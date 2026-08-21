// Renders the notification email. Every interpolated value is escaped, because
// the entire payload is attacker-controlled and lands in an HTML mail client.

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

// Header injection guard: a newline in a subject or a From name lets an
// attacker append their own headers.
export const headerSafe = (v) => String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 200);

export function renderSubject(enquiry) {
  return headerSafe(`New project enquiry — ${enquiry.service} — ${enquiry.name}`);
}

export function renderText(enquiry, attribution = {}) {
  const lines = [
    `New project enquiry from the Oak Park Construction website.`,
    ``,
    `Name:    ${enquiry.name}`,
    `Email:   ${enquiry.email}`,
    `Phone:   ${enquiry.phone || "—"}`,
    `Service: ${enquiry.service}`,
    ``,
    `Message:`,
    enquiry.message,
    ``,
  ];
  if (attribution.sourcePage) lines.push(`Submitted from: ${attribution.sourcePage}`);
  if (attribution.referrer) lines.push(`Referrer:       ${attribution.referrer}`);
  const params = Object.entries(attribution.params || {});
  if (params.length) lines.push(`Campaign:       ${params.map(([k, v]) => `${k}=${v}`).join(" · ")}`);
  lines.push(``, `Reply directly to this email to answer ${enquiry.name}.`);
  return lines.join("\n");
}

export function renderHtml(enquiry, attribution = {}) {
  const row = (label, value) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#8a8a80;font:500 12px/1.5 Arial,sans-serif;white-space:nowrap;vertical-align:top">${esc(label)}</td>` +
    `<td style="padding:6px 0;color:#1a1a17;font:400 15px/1.5 Arial,sans-serif">${esc(value)}</td></tr>`;

  const params = Object.entries(attribution.params || {});
  const meta = [
    attribution.sourcePage ? row("Submitted from", attribution.sourcePage) : "",
    attribution.referrer ? row("Referrer", attribution.referrer) : "",
    params.length ? row("Campaign", params.map(([k, v]) => `${k}=${v}`).join(" · ")) : "",
  ].join("");

  return [
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3ef;padding:28px 0">',
    '<tr><td align="center">',
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e0d6;border-radius:4px">',
    '<tr><td style="padding:26px 28px 0">',
    '<p style="margin:0;font:600 11px/1.4 Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#8a8b00">Oak Park Construction</p>',
    '<h1 style="margin:10px 0 22px;font:700 21px/1.25 Arial,sans-serif;color:#1a1a17">New project enquiry</h1>',
    '</td></tr>',
    '<tr><td style="padding:0 28px"><table role="presentation" cellpadding="0" cellspacing="0" width="100%">',
    row("Name", enquiry.name),
    row("Email", enquiry.email),
    row("Phone", enquiry.phone || "—"),
    row("Service", enquiry.service),
    '</table></td></tr>',
    '<tr><td style="padding:20px 28px 0">',
    '<p style="margin:0 0 6px;font:500 12px/1.5 Arial,sans-serif;color:#8a8a80">Message</p>',
    `<p style="margin:0;font:400 15px/1.65 Arial,sans-serif;color:#1a1a17;white-space:pre-line">${esc(enquiry.message)}</p>`,
    '</td></tr>',
    meta
      ? `<tr><td style="padding:22px 28px 0"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #efede4;padding-top:10px">${meta}</table></td></tr>`
      : "",
    '<tr><td style="padding:22px 28px 26px">',
    `<p style="margin:0;font:400 12px/1.6 Arial,sans-serif;color:#8a8a80">Reply directly to this email to answer ${esc(enquiry.name)}. Sent by the Oak Park Construction website. We never ask for passwords or card details by email.</p>`,
    '</td></tr></table></td></tr></table>',
  ].join("");
}
