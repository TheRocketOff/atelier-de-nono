require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const commandeRouter = require("./routes/commande");

const app = express();
const PORT = process.env.PORT || 4000;

// Nécessaire derrière un proxy/load-balancer (Render, Railway, Heroku, etc.)
// pour que express-rate-limit lise correctement l'IP réelle via X-Forwarded-For.
// Sans ce réglage, express-rate-limit lève une erreur de validation qui peut
// bloquer la requête indéfiniment au lieu de répondre.
app.set("trust proxy", 1);

// --- Sécurité de base ---
app.use(helmet());
app.disable("x-powered-by");

// --- CORS : uniquement les origines autorisées (le site en prod / en local) ---
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Autorise les appels sans origine (ex: curl, Postman) et les origines listées
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origine non autorisée par la politique CORS."));
    },
  })
);

app.use(express.json({ limit: "200kb" }));

// --- Limitation du nombre de requêtes sur le formulaire (anti-spam / anti-abus) ---
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Trop de demandes envoyées. Merci de réessayer plus tard." },
});

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/commande", orderLimiter, commandeRouter);

// --- Gestion d'erreurs générique ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Erreur serveur." });
});

app.listen(PORT, () => {
  console.log(`✅ Backend L'atelier de Nono à l'écoute sur http://localhost:${PORT}`);
  console.log(`   Origines autorisées : ${allowedOrigins.join(", ") || "(toutes — à restreindre en production)"}`);
});
