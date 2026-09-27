const express = require("express");
const multer = require("multer");
const { sendOrderEmail } = require("../lib/mailer");
const { sendOrderSms } = require("../lib/sms");
const { saveSubmission } = require("../lib/store");

const router = express.Router();

// --- Upload : en mémoire (pas d'écriture disque), limité en taille/type/nombre ---
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const MAX_FILES = 5;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error("INVALID_FILE_TYPE"));
    }
    cb(null, true);
  },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body) {
  const errors = [];
  const required = ["prenom", "nom", "telephone", "email", "typeCreation", "description"];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      errors.push(`Le champ "${field}" est requis.`);
    }
  }
  if (body.email && !EMAIL_RE.test(body.email)) {
    errors.push("L'adresse e-mail n'est pas valide.");
  }
  if (body.telephone && body.telephone.replace(/[^0-9+]/g, "").length < 6) {
    errors.push("Le numéro de téléphone n'est pas valide.");
  }
  // Limites de longueur (protection contre les abus)
  const maxLengths = { prenom: 80, nom: 80, telephone: 20, email: 120, theme: 200, budget: 100, description: 2000, inspiration: 500 };
  for (const [field, max] of Object.entries(maxLengths)) {
    if (body[field] && String(body[field]).length > max) {
      errors.push(`Le champ "${field}" est trop long.`);
    }
  }
  return errors;
}

router.post("/", (req, res) => {
  upload.array("photos", MAX_FILES)(req, res, async (err) => {
    if (err) {
      const message =
        err.message === "INVALID_FILE_TYPE"
          ? "Seules les images JPG, PNG ou WEBP sont acceptées."
          : err.code === "LIMIT_FILE_SIZE"
          ? "Une photo dépasse la taille maximale autorisée (5 Mo)."
          : err.code === "LIMIT_FILE_COUNT"
          ? "5 photos maximum peuvent être envoyées."
          : "Erreur lors du traitement des fichiers envoyés.";
      return res.status(400).json({ success: false, message });
    }

    const body = req.body || {};
    const files = req.files || [];

    // --- Anti-spam : honeypot ---
    if (body.website && String(body.website).trim() !== "") {
      // Réponse "succès" factice pour ne pas renseigner le robot, sans rien envoyer.
      return res.status(200).json({ success: true });
    }

    // --- Anti-spam : délai minimum entre chargement et envoi du formulaire ---
    const minDelay = Number(process.env.MIN_SUBMIT_DELAY_MS || 3000);
    const loadedAt = Number(body.formLoadedAt || 0);
    if (loadedAt && Date.now() - loadedAt < minDelay) {
      return res.status(400).json({ success: false, message: "Envoi trop rapide, merci de réessayer." });
    }

    // --- Validation des champs ---
    const errors = validate(body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }

    const order = {
      prenom: String(body.prenom).trim(),
      nom: String(body.nom).trim(),
      telephone: String(body.telephone).trim(),
      email: String(body.email).trim(),
      typeCreation: String(body.typeCreation).trim(),
      dateSouhaitee: body.dateSouhaitee ? String(body.dateSouhaitee).trim() : "",
      nbPersonnes: body.nbPersonnes ? String(body.nbPersonnes).trim() : "",
      budget: body.budget ? String(body.budget).trim() : "",
      theme: body.theme ? String(body.theme).trim() : "",
      description: String(body.description).trim(),
      inspiration: body.inspiration ? String(body.inspiration).trim() : "",
      photosCount: files.length,
    };

    try {
      // 1. Enregistrement de la demande
      const id = saveSubmission(order);

      // 2. E-mail à la pâtisserie (canal principal : doit réussir)
      await sendOrderEmail(order, files);

      // 3. SMS au responsable (best-effort : ne bloque pas la réponse client)
      sendOrderSms(order).catch((smsErr) => {
        console.error("[sms] Échec de l'envoi SMS (non bloquant) :", smsErr.message);
      });

      // 4. Confirmation au client
      return res.status(200).json({ success: true, id });
    } catch (sendErr) {
      console.error("[commande] Échec du traitement de la demande :", sendErr);
      return res.status(500).json({
        success: false,
        message: "Votre demande n'a pas pu être transmise automatiquement. Merci de nous contacter directement.",
      });
    }
  });
});

module.exports = router;
