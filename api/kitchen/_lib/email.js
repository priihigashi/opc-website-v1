const nodemailer = require("nodemailer");
const config = require("./config");

function configured() {
  return Boolean(config.gmailUser && config.gmailPass);
}

async function sendMail({ to, subject, text, html, attachments = [] }) {
  if (!configured()) {
    if (config.mockAi) {
      console.log("[kitchen-vision] email mock", { to, subject });
      return { mocked: true };
    }
    throw Object.assign(new Error("Gmail app password is not configured."), { code: "EMAIL_NOT_CONFIGURED" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.gmailUser,
      pass: config.gmailPass
    }
  });

  return transporter.sendMail({
    from: `"Oak Park Construction" <${config.gmailUser}>`,
    to,
    subject,
    text,
    html,
    attachments
  });
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

module.exports = { sendMail, escapeHtml };
