const config = require("./_lib/config");
const { applyCors, requirePost, readJson, sendJson, sendError } = require("./_lib/http");
const { validateEmail, validatePhone } = require("./_lib/validation");
const { sendMail, escapeHtml } = require("./_lib/email");
const { generateConcept } = require("./_lib/image");
const { makeHighResConcept } = require("./_lib/watermark");
const store = require("./_lib/store");

module.exports = async function handler(req, res) {
  if (!applyCors(req, res) || !requirePost(req, res)) return;

  try {
    const body = await readJson(req);
    const job = await store.getJob(body.jobId);
    if (!job) return sendError(res, 404, "Room Vision job was not found or expired.", "JOB_NOT_FOUND");
    if (!job.emailVerified) return sendError(res, 403, "Verify your email before submitting.", "EMAIL_NOT_VERIFIED");
    if (String(body.email || "").trim().toLowerCase() !== String(job.email || "").toLowerCase()) {
      return sendError(res, 403, "Use the same email you verified.", "EMAIL_MISMATCH");
    }
    if (job.submitted) return sendError(res, 409, "This Room Vision request was already submitted.", "JOB_ALREADY_SUBMITTED");

    const emailCheck = await validateEmail(body.email);
    if (!emailCheck.ok) return sendError(res, 400, emailCheck.error, emailCheck.code);
    const phoneCheck = await validatePhone(body.phone);
    if (!phoneCheck.ok) return sendError(res, 400, phoneCheck.error, phoneCheck.code);

    // Room-aware labels/slugs so every lead + customer email + filename reflects
    // the room the visitor actually selected (not always "kitchen").
    const roomKey = job.answers?.room || "kitchen";
    const ROOM_LABEL = { kitchen: "Kitchen", bathroom: "Bathroom", exterior: "Exterior", backyard: "Backyard & Patio" };
    const roomLabel = ROOM_LABEL[roomKey] || "Room";
    const roomSlug = roomKey.replace(/[^a-z]/g, "") || "room";

    const original = await store.readFile(job.jobId, "original");
    const generated = await generateConcept(original, job.mimeType, job.answers, "highres");
    const highRes = await makeHighResConcept(generated.raw);
    await store.writeFile(job.jobId, "highres.jpg", highRes);

    const lead = {
      name: String(body.name || "").trim().slice(0, 120),
      email: emailCheck.email,
      phone: phoneCheck.phone,
      room: roomKey,
      sourcePage: job.sourcePage,
      referrer: job.referrer,
      utm: job.utm,
      answers: job.answers,
      engine: generated.engine,
      phoneLookup: phoneCheck.lookup
    };

    const leadHtml = `
      <h2>New OPC ${escapeHtml(roomLabel)} Vision lead</h2>
      <p><strong>Room:</strong> ${escapeHtml(roomLabel)}</p>
      <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)} verified</p>
      <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
      <p><strong>Source page:</strong> ${escapeHtml(lead.sourcePage)}</p>
      <p><strong>Referrer:</strong> ${escapeHtml(lead.referrer)}</p>
      <p><strong>UTM:</strong> ${escapeHtml(lead.utm)}</p>
      <p><strong>Engine:</strong> ${escapeHtml(lead.engine)}</p>
      <pre>${escapeHtml(JSON.stringify({ answers: lead.answers, phoneLookup: lead.phoneLookup }, null, 2))}</pre>
    `;

    await sendMail({
      to: config.leadToEmail,
      subject: `${roomLabel} Vision Lead - ${lead.name || lead.phone}`,
      text: JSON.stringify(lead, null, 2),
      html: leadHtml,
      attachments: [
        { filename: "original-upload.jpg", content: original, contentType: job.mimeType },
        { filename: `oak-park-${roomSlug}-concept.jpg`, content: highRes, contentType: "image/jpeg" }
      ]
    });

    await sendMail({
      to: lead.email,
      subject: `Your Oak Park Construction ${roomLabel.toLowerCase()} concept`,
      text: `Thanks for using Oak Park Construction Room Vision. Your ${roomLabel.toLowerCase()} concept image is attached. Michael or Matthew will follow up within one business day.`,
      html: `<p>Thanks for using Oak Park Construction Room Vision.</p><p>Your ${escapeHtml(roomLabel.toLowerCase())} concept image is attached. Michael or Matthew will follow up within one business day.</p>`,
      attachments: [
        { filename: `oak-park-construction-${roomSlug}-concept.jpg`, content: highRes, contentType: "image/jpeg" }
      ]
    });

    await store.updateJob(job.jobId, {
      submitted: true,
      submittedAt: Date.now(),
      lead,
      highResEngine: generated.engine
    });

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return sendError(res, 500, error.message || "Could not submit the Kitchen Vision lead.", error.code || "KITCHEN_SUBMIT_FAILED");
  }
};
