const sharp = require("sharp");
const { GoogleGenAI, Modality } = require("@google/genai");
const config = require("./config");
const { makePreview, makeHighResConcept } = require("./watermark");

// Per-room generation profiles. Each room has a different subject, default
// material language, geometry to preserve, and failure modes to avoid — so a
// bathroom is never prompted as a kitchen, an exterior is never prompted as an
// interior, etc.
const ROOM_PROFILES = {
  kitchen: {
    subject: "kitchen",
    interior: true,
    defaultMaterials: "durable premium kitchen materials",
    keep: "walls, windows, perspective, camera angle, ceiling height, and major plumbing/electrical locations",
    avoid: "no warped cabinets, no impossible island placement, no floating appliances"
  },
  bathroom: {
    subject: "bathroom",
    interior: true,
    defaultMaterials: "durable premium bathroom tile and fixtures",
    keep: "walls, windows, perspective, camera angle, ceiling height, and major plumbing locations",
    avoid: "no warped vanities, no floating fixtures, realistic shower glass and grout lines"
  },
  exterior: {
    subject: "home exterior and front yard",
    interior: false,
    defaultMaterials: "durable premium exterior materials (pavers, stone, stucco)",
    keep: "house footprint, rooflines, window and door positions, driveway proportions, perspective, and camera angle",
    avoid: "no added stories, no impossible landscaping, keep the sky and surroundings realistic"
  },
  backyard: {
    subject: "backyard and patio",
    interior: false,
    defaultMaterials: "durable premium outdoor-living materials (pavers, travertine, composite deck)",
    keep: "property lines, the rear house wall, existing grade, perspective, and camera angle",
    avoid: "no impossible pool placement, realistic shade structures and plantings"
  }
};

function roomProfile(answers) {
  return ROOM_PROFILES[answers.room] || ROOM_PROFILES.kitchen;
}

function buildPrompt(answers, mode = "preview") {
  const p = roomProfile(answers);
  const materials = answers.materials?.length ? answers.materials.join(", ") : p.defaultMaterials;
  const lines = [
    `Edit the uploaded ${p.subject} photo into a photoreal Oak Park Construction remodel concept.`
  ];

  // Room-specific intent: kitchen/bath have layout + dislikes; exterior has
  // focus areas; backyard has features to add/upgrade.
  if (answers.room === "kitchen" || answers.room === "bathroom" || !answers.room) {
    const dislikes = answers.dislikes?.length ? answers.dislikes.join(", ") : "only the areas the visitor disliked";
    lines.push(`Layout preference: ${answers.layout || "keep"}. Preserve room geometry unless the visitor explicitly asked to redesign layout.`);
    lines.push(`Visitor dislikes: ${dislikes}. Change those areas only.`);
  } else if (answers.room === "exterior") {
    const focus = answers.focus?.length ? answers.focus.join(", ") : "the most visible curb-appeal areas";
    lines.push(`Transform these exterior areas: ${focus}. Leave everything else as-is.`);
  } else if (answers.room === "backyard") {
    const features = answers.features?.length ? answers.features.join(", ") : "the main usable patio area";
    lines.push(`Add or upgrade these outdoor features: ${features}. Keep the rest of the yard realistic.`);
  }

  lines.push(`Preferred style: ${answers.style}. Preferred materials: ${materials}. Preferred color direction: ${answers.color}.`);
  lines.push(`Budget signal: ${answers.budget}. Timeline: ${answers.timeline}.`);
  lines.push(`Negative instructions: keep ${p.keep} realistic. No text artifacts, no fake logos, ${p.avoid}.`);
  lines.push(mode === "preview" ? "Return one polished concept image." : "Return a clean high-resolution concept image suitable for emailing after verification.");
  return lines.join("\n");
}

async function ensureImage(buffer, mimeType) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
    throw Object.assign(new Error("Upload a JPG, PNG, or WebP image."), { code: "UPLOAD_TYPE_INVALID" });
  }
  const meta = await sharp(buffer).metadata();
  if (!meta.width || !meta.height || meta.width < 300 || meta.height < 300) {
    throw Object.assign(new Error("Upload a clearer room photo."), { code: "UPLOAD_TOO_SMALL" });
  }
  return meta;
}

async function moderateUpload(buffer, mimeType, answers = {}) {
  await ensureImage(buffer, mimeType);
  if (!config.geminiKey) {
    if (config.mockAi) return { ok: true, provider: "mock" };
    throw Object.assign(new Error("Gemini key is required for upload moderation."), { code: "MODERATION_NOT_CONFIGURED" });
  }
  const p = roomProfile(answers);
  // Interior rooms expect an inside photo; exterior/backyard expect an outdoor
  // house/yard photo — so the moderator no longer rejects valid exterior shots.
  const expected = p.interior
    ? `an interior ${p.subject} (or similar room) photo`
    : `an outdoor photo of a ${p.subject}`;
  const ai = new GoogleGenAI({ apiKey: config.geminiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{
      role: "user",
      parts: [
        { text: `Classify this upload for a home remodeling lead form. The visitor selected: ${p.subject}. Reply JSON only: {"valid":true|false,"unsafe":true|false,"reason":"short"}. Set valid=true only if the image is ${expected} suitable for a remodel concept. Reject (valid=false) if it does not match, or set unsafe=true for people as the main subject, nudity, violence, documents, or spam.` },
        { inlineData: { mimeType, data: buffer.toString("base64") } }
      ]
    }]
  });
  const text = response.text || "{}";
  const json = JSON.parse(text.replace(/^```json|```$/g, "").trim());
  if (!json.valid || json.unsafe) {
    return { ok: false, code: "UPLOAD_REJECTED", error: json.reason || `Upload a clear ${p.subject} photo.` };
  }
  return { ok: true, provider: "gemini", reason: json.reason || "" };
}

async function geminiEdit(buffer, mimeType, answers, mode) {
  if (!config.geminiKey) throw Object.assign(new Error("Gemini key missing."), { code: "GEMINI_NOT_CONFIGURED" });
  const ai = new GoogleGenAI({ apiKey: config.geminiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{
      role: "user",
      parts: [
        { text: buildPrompt(answers, mode) },
        { inlineData: { mimeType, data: buffer.toString("base64") } }
      ]
    }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE]
    }
  });
  const parts = response.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((part) => part.inlineData?.data);
  if (!imagePart) throw Object.assign(new Error("Gemini did not return an image."), { code: "GEMINI_NO_IMAGE" });
  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function nb2Edit(buffer, mimeType, answers, mode) {
  if (!config.infshKey) throw Object.assign(new Error("NB2 inference.sh key missing."), { code: "NB2_NOT_CONFIGURED" });
  const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const create = await fetch("https://api.inference.sh/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.infshKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      app: "google/gemini-3-1-flash-image-preview",
      input: {
        prompt: buildPrompt(answers, mode),
        image: dataUrl,
        image_url: dataUrl,
        width: mode === "preview" ? 1024 : 1536,
        height: mode === "preview" ? 1024 : 1536
      }
    })
  });
  if (!create.ok) {
    throw Object.assign(new Error(`NB2 request failed (${create.status}).`), { code: "NB2_REQUEST_FAILED" });
  }
  const payload = await create.json();
  const imageUrl = payload.url || payload.output?.[0] || payload.data?.[0]?.url;
  if (!imageUrl) throw Object.assign(new Error("NB2 did not return an image URL."), { code: "NB2_NO_IMAGE" });
  const image = await fetch(imageUrl);
  if (!image.ok) throw Object.assign(new Error("Could not download NB2 image."), { code: "NB2_DOWNLOAD_FAILED" });
  return Buffer.from(await image.arrayBuffer());
}

async function generateConcept(buffer, mimeType, answers, mode = "preview") {
  if (config.mockAi) {
    return {
      engine: "mock-original-watermarked",
      raw: mode === "preview" ? await makePreview(buffer) : await makeHighResConcept(buffer)
    };
  }
  try {
    const raw = await geminiEdit(buffer, mimeType, answers, mode);
    return { engine: "gemini-2.5-flash-image", raw };
  } catch (geminiError) {
    console.warn("[kitchen-vision] Gemini failed; trying NB2", geminiError.code || geminiError.message);
    const raw = await nb2Edit(buffer, mimeType, answers, mode);
    return { engine: "nb2-inference-sh", raw };
  }
}

module.exports = {
  buildPrompt,
  moderateUpload,
  generateConcept
};
