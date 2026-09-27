/**
 * Persistance minimale des demandes reçues (fichier JSON par demande).
 * Suffisant pour démarrer sans base de données ; peut être remplacé plus
 * tard par une vraie base (Postgres, Airtable, Google Sheets...) en ne
 * modifiant que ce fichier.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "..", "data", "submissions");

function ensureDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function saveSubmission(order) {
  ensureDir();
  const id = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const record = { id, receivedAt: new Date().toISOString(), ...order };
  const filePath = path.join(DATA_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf-8");
  return id;
}

module.exports = { saveSubmission };
