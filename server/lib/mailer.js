/**
 * Envoi de l'e-mail de notification à la pâtisserie.
 * Le fournisseur utilisé dépend des variables d'environnement présentes
 * (voir .env.example) : Resend en priorité, sinon SMTP (Brevo, OVH, etc.).
 * Aucune clé n'est jamais exposée au frontend : tout se passe ici, côté serveur.
 */

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(order) {
  const row = (label, value) =>
    value ? `<tr><td style="padding:6px 12px;color:#8a6a4f;font-size:13px;">${label}</td><td style="padding:6px 12px;color:#3b2314;font-size:14px;"><strong>${escapeHtml(value)}</strong></td></tr>` : "";

  return `
  <div style="font-family:Georgia,serif;background:#fdf7ee;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eadfcf;">
      <div style="background:#3b2314;color:#fdf7ee;padding:20px 28px;">
        <h1 style="margin:0;font-size:18px;">🎂 Nouvelle demande de devis</h1>
        <p style="margin:4px 0 0;font-size:13px;color:#e6cda2;">L'atelier de Nono</p>
      </div>
      <table style="width:100%;border-collapse:collapse;padding:10px;">
        ${row("Prénom", order.prenom)}
        ${row("Nom", order.nom)}
        ${row("Téléphone", order.telephone)}
        ${row("E-mail", order.email)}
        ${row("Type de création", order.typeCreation)}
        ${row("Date souhaitée", order.dateSouhaitee)}
        ${row("Nombre de personnes", order.nbPersonnes)}
        ${row("Budget approximatif", order.budget)}
        ${row("Thème / Couleurs", order.theme)}
      </table>
      <div style="padding:16px 24px;">
        <p style="font-size:13px;color:#8a6a4f;margin:0 0 4px;">Description du projet</p>
        <p style="font-size:14px;color:#3b2314;white-space:pre-wrap;">${escapeHtml(order.description || "—")}</p>
        ${order.inspiration ? `<p style="font-size:13px;color:#8a6a4f;margin:16px 0 4px;">Inspiration</p><p style="font-size:14px;color:#3b2314;white-space:pre-wrap;">${escapeHtml(order.inspiration)}</p>` : ""}
      </div>
      <div style="padding:0 24px 24px;">
        <p style="font-size:12px;color:#a08b76;">
          ${order.photosCount ? `${order.photosCount} photo(s) d'inspiration jointe(s) à cet e-mail.` : "Aucune photo d'inspiration jointe."}
        </p>
      </div>
    </div>
  </div>`;
}

function buildEmailText(order) {
  return [
    "Nouvelle demande de devis — L'atelier de Nono",
    "",
    `Prénom : ${order.prenom}`,
    `Nom : ${order.nom}`,
    `Téléphone : ${order.telephone}`,
    `E-mail : ${order.email}`,
    `Type de création : ${order.typeCreation}`,
    `Date souhaitée : ${order.dateSouhaitee || "—"}`,
    `Nombre de personnes : ${order.nbPersonnes || "—"}`,
    `Budget : ${order.budget || "—"}`,
    `Thème / couleurs : ${order.theme || "—"}`,
    "",
    "Description du projet :",
    order.description || "—",
    "",
    order.inspiration ? `Inspiration :\n${order.inspiration}` : "",
  ].join("\n");
}

async function sendViaResend(order, attachments) {
  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const result = await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: process.env.NOTIFY_EMAIL_TO,
    reply_to: order.email,
    subject: `🎂 Nouvelle demande — ${order.prenom} ${order.nom} (${order.typeCreation})`,
    html: buildEmailHtml(order),
    text: buildEmailText(order),
    attachments: attachments.map((f) => ({
      filename: f.originalname,
      content: f.buffer.toString("base64"),
    })),
  });

  if (result.error) throw new Error(result.error.message || "Échec de l'envoi via Resend");
  return result;
}

async function sendViaSmtp(order, attachments) {
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.NOTIFY_EMAIL_TO,
    replyTo: order.email,
    subject: `🎂 Nouvelle demande — ${order.prenom} ${order.nom} (${order.typeCreation})`,
    html: buildEmailHtml(order),
    text: buildEmailText(order),
    attachments: attachments.map((f) => ({
      filename: f.originalname,
      content: f.buffer,
    })),
  });
}

async function sendOrderEmail(order, attachments = []) {
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(order, attachments);
  }
  if (process.env.SMTP_HOST) {
    return sendViaSmtp(order, attachments);
  }
  throw new Error(
    "Aucun fournisseur d'e-mail configuré. Renseignez RESEND_API_KEY ou les variables SMTP_* dans server/.env"
  );
}

module.exports = { sendOrderEmail };
