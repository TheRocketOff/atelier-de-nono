/**
 * Envoi SMS optionnel au responsable via Twilio.
 * Si les identifiants Twilio ne sont pas configurés, la fonction ne fait
 * rien (le SMS est une notification "si possible", pas un canal bloquant).
 */
async function sendOrderSms(order) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, NOTIFY_PHONE_TO } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !NOTIFY_PHONE_TO) {
    console.log("[sms] Twilio non configuré — SMS non envoyé (optionnel).");
    return null;
  }

  const twilio = require("twilio");
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  const body = `🎂 Nouvelle demande L'atelier de Nono : ${order.prenom} ${order.nom}, ${order.typeCreation}, tel ${order.telephone}. Voir e-mail pour le détail.`;

  return client.messages.create({
    body,
    from: TWILIO_FROM_NUMBER,
    to: NOTIFY_PHONE_TO,
  });
}

module.exports = { sendOrderSms };
