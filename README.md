# L'atelier de Nono — Site internet

Site one-page pour une pâtisserie artisanale, avec formulaire de demande de
devis réellement fonctionnel (e-mail + SMS optionnel, sans simulation).

## 📁 Structure du projet

```
L'atelier de Nono/
├── index.html                     → la page principale (one-page)
├── mentions-legales.html
├── politique-confidentialite.html
├── assets/
│   ├── css/style.css               → toute la feuille de style
│   ├── js/config.js                 → ⚙️ COORDONNÉES & RÉGLAGES à personnaliser
│   ├── js/main.js                   → interactions (menu, galerie, formulaire...)
│   ├── logo/logo.jpg                → ⭐ le vrai logo utilisé sur tout le site
│   ├── logo/logo.svg                → repli automatique si logo.jpg est absent
│   └── images/                      → emplacements des photos (voir plus bas)
└── server/                         → backend Node.js qui envoie réellement les demandes
    ├── server.js
    ├── routes/commande.js
    ├── lib/mailer.js  (Resend ou SMTP)
    ├── lib/sms.js     (Twilio, optionnel)
    ├── lib/store.js   (sauvegarde des demandes en JSON)
    └── .env.example   → à copier en .env et compléter
```

## ✅ État actuel du site (mis à jour)

1. **Logo** — `assets/logo/logo.jpg` est le vrai monogramme (N/C, fouet,
   feuillage) en haute qualité, utilisé partout (menu, accueil, pied de page,
   favicon). Optimisé pour le web (512×512, ~35 Ko) ; l'original haute
   résolution que vous avez fourni est conservé sans modification dans
   `assets/logo/logo-original-hires.jpg`. `assets/logo/logo.svg` reste un
   repli automatique si `logo.jpg` venait à manquer. `assets/logo/logo.png`
   (ancien export) n'est plus utilisé — supprimable si vous le souhaitez.
2. **Coordonnées, horaires, zone** — renseignées dans
   [`assets/js/config.js`](assets/js/config.js) : téléphone, e-mail, adresse
   (Vesoul, Haute-Saône), horaires. Répercutées automatiquement partout sur
   le site (contact, footer, boutons "Appeler", barre mobile) **et** dans le
   SEO local (title, meta description, données structurées JSON-LD dans
   `index.html`). Restent à préciser : réseaux sociaux réels (actuellement
   des exemples `latelierdenono`), zone de livraison/retrait exacte.
3. **Photos** — 7 vraies photos sont intégrées depuis `assets/images/gallery/`
   (optimisées en JPG, ~200 Ko chacune ; originaux conservés dans
   `assets/images/gallery/originals/`). Elles alimentent la galerie **et**,
   par réemploi, la photo d'accueil + 4 cartes de la section « Créations »
   (voir tableau ci-dessous). Il manque encore des photos dédiées pour :
   - la section « À propos » (portrait de la pâtissière / de l'atelier)
   - la carte « Cupcakes »
   - la carte « Biscuits & petites douceurs »

   Tant qu'une photo n'existe pas au bon endroit, un joli bloc de
   remplacement (dégradé + icône) s'affiche à la place — rien n'est cassé.
   Déposez un fichier au chemin exact ci-dessous pour qu'il apparaisse :

   | Emplacement | Usage | Statut |
   |---|---|---|
   | `assets/images/hero/hero-gateau.jpg` | Photo d'accueil | ✅ (gâteau lettre « L ») |
   | `assets/images/about/atelier-nono.jpg` | Photo de la pâtissière / de l'atelier | ⬜ à fournir |
   | `assets/images/pastries/gateaux-personnalises.jpg` | Carte « Gâteaux personnalisés » | ✅ |
   | `assets/images/pastries/cupcakes.jpg` | Carte « Cupcakes » | ⬜ à fournir |
   | `assets/images/pastries/entremets.jpg` | Carte « Entremets » | ✅ |
   | `assets/images/pastries/biscuits.jpg` | Carte « Biscuits & petites douceurs » | ⬜ à fournir |
   | `assets/images/pastries/evenementiel.jpg` | Carte « Pâtisseries événementielles » | ✅ |
   | `assets/images/pastries/creations-personnalisees.jpg` | Carte « Créations personnalisées » | ✅ |
   | `assets/images/gallery/*.jpg` | Galerie (10 photos, filtrables) | ✅ |

4. **Catégories de pâtisseries** — tarifs réels renseignés ; textes/photos
   « Cupcakes » et « Biscuits » restent à finaliser dans `index.html`,
   section `id="patisseries"`.
5. **Avis clients** — 3 avis d'exemple affichés sans étiquette « Exemple »
   (avec prénoms réalistes mais textes fictifs) ; à remplacer par de vrais
   retours clients dès que possible, section `id="avis"`.
6. **Mentions légales** — SIRET et forme juridique de L'atelier de Nono
   toujours à ajouter (`mentions-legales.html`, section Propriété
   intellectuelle / à créer une section identité de l'entreprise si besoin).
7. **Envoi e-mail réel** — déjà opérationnel en production via Resend
   (voir ci-dessous). SMS non activé (abandonné au profit de l'e-mail seul).

## ▶️ Prévisualiser le site (frontend seul)

Le frontend est 100% statique (HTML/CSS/JS). Ouvrez simplement `index.html`
dans un navigateur, ou servez le dossier avec un petit serveur local, par
exemple avec l'extension VS Code "Live Server", ou :

```bash
npx serve .
```

Sans backend lancé, tout le site fonctionne **sauf** l'envoi réel du
formulaire (vous verrez un message d'erreur convivial invitant à contacter
directement par téléphone/e-mail — c'est le comportement attendu).

## ▶️ Lancer le backend (envoi réel des demandes)

Le formulaire envoie les demandes à une petite API Node.js/Express fournie
dans `server/`. Aucune clé API n'est jamais présente côté frontend.

```bash
cd server
npm install
copy .env.example .env      # (sous PowerShell : Copy-Item .env.example .env)
```

Puis ouvrez `server/.env` et complétez au minimum :

- `NOTIFY_EMAIL_TO` → l'adresse qui doit recevoir les demandes
- **Un** fournisseur d'e-mail :
  - **Resend** (recommandé, gratuit pour démarrer) : créez un compte sur
    [resend.com](https://resend.com), récupérez une clé API, renseignez
    `RESEND_API_KEY` et `RESEND_FROM`.
  - **Brevo** ou **SMTP générique** (OVH, etc.) : renseignez les variables
    `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`.
- (optionnel) **Twilio** pour le SMS au responsable : `TWILIO_ACCOUNT_SID`,
  `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `NOTIFY_PHONE_TO`.

Démarrez ensuite le serveur :

```bash
npm start
```

Le backend écoute par défaut sur `http://localhost:4000`. Vérifiez que
`assets/js/config.js` → `orderApiUrl` pointe bien vers cette URL (déjà le
cas par défaut en local).

### Ce que fait le backend à chaque demande

1. Valide les champs (obligatoires, formats, tailles, anti-spam par
   honeypot + délai minimum de remplissage).
2. Vérifie les photos jointes (JPG/PNG/WEBP uniquement, 5 Mo max/photo,
   5 photos max).
3. Enregistre la demande dans `server/data/submissions/` (un fichier JSON
   par demande).
4. Envoie un e-mail complet (avec les photos en pièces jointes) à
   `NOTIFY_EMAIL_TO`.
5. Envoie un SMS de notification au responsable si Twilio est configuré
   (optionnel, n'empêche jamais la confirmation client).
6. Renvoie une confirmation au client, affichée sur le site.

## 🚀 Déploiement en production

- **Frontend** : n'importe quel hébergement statique (Netlify, Vercel,
  OVH mutualisé, o2switch...). Pensez à mettre à jour `orderApiUrl` dans
  `config.js` avec l'URL publique du backend, et l'URL du site dans les
  balises `<meta>` / JSON-LD de `index.html`.
- **Backend** : un hébergeur Node.js (Render, Railway, Fly.io, VPS...).
  Renseignez `FRONTEND_ORIGIN` dans `.env` avec le domaine réel du site
  pour que le CORS n'autorise que votre site.

## 📱 Réseaux sociaux — flux réels

- **Facebook** : déjà intégré via le *Page Plugin* officiel (aucune clé
  requise), il suffit de renseigner votre vraie URL de page Facebook dans
  `config.js` **et** dans l'attribut `href` encodé de l'iframe Facebook
  (section `id="reseaux"` de `index.html`).
- **Instagram** : l'affichage automatique de la dernière publication
  nécessite l'API Graph (compte professionnel + token). En attendant,
  un bouton « Voir toutes les créations » renvoie vers le profil réel.
  Pour un embed manuel d'un post précis : script officiel `embed.js`
  d'Instagram avec l'URL du post.
- **TikTok** : même logique — l'embed officiel (`blockquote class="tiktok-embed"`
  + script `https://www.tiktok.com/embed.js`) fonctionne pour une vidéo
  précise dont vous connaissez l'URL ; pour un flux "toujours la dernière
  vidéo", il faut l'API TikTok for Developers.

## ✅ RGPD & sécurité déjà en place

- Formulaire avec case de consentement explicite + lien vers la politique
  de confidentialité.
- Bandeau cookies (accepter / refuser) mémorisé dans le navigateur du
  visiteur.
- Anti-spam : champ honeypot invisible + délai minimum de remplissage +
  limitation du nombre de requêtes par IP (rate limiting) côté serveur.
- Upload de photos limité en nombre, taille et type de fichier, aussi
  bien côté navigateur que côté serveur.
- Aucune clé API, mot de passe ou secret dans le code du site (tout est
  dans `server/.env`, jamais commité).

## 🎨 Identité visuelle

Palette et typographies définies comme variables CSS en haut de
`assets/css/style.css` (`:root`), directement inspirées du logo fourni :
crème/ivoire, brun chocolat, caramel, doré. Polices Google Fonts
*Playfair Display* (titres) et *Poppins* (texte courant).
