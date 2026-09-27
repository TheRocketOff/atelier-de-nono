/**
 * ============================================================================
 *  CONFIGURATION DU SITE — « L'atelier de Nono »
 * ============================================================================
 *  Toutes les informations "métier" (coordonnées, réseaux sociaux, zone de
 *  livraison, endpoint du formulaire...) sont centralisées ici pour être
 *  modifiées facilement, sans toucher au reste du code.
 *
 *  ⚠️  Ne JAMAIS mettre de clé API ou de secret dans ce fichier : il est
 *      chargé par le navigateur et donc visible par tout le monde.
 * ============================================================================
 */
window.NONO_CONFIG = {
  // --- Identité --------------------------------------------------------
  siteName: "L'atelier de Nono",
  tagline: "Pâtisserie artisanale & créations sur-mesure",

  // --- Contact ------------------------------------------------------------
  phone: {
    display: "06 65 26 52 90",
    href: "+33665265290",       // format international pour les liens tel:
  },
  email: "latelierdenono70@gmail.com",

  // --- Adresse / zone de chalandise (À REMPLACER — ne pas inventer) -----
  address: {
    line1: "Rue du Commandant Girardot",
    city: "Vesoul",
    postalCode: "70000",
    department: "Haute-Saône",
  },
  deliveryZone: "Zone de livraison à préciser (ex. : 20 km autour de Vesoul)",
  pickupZone: "Retrait des commandes à préciser (atelier, marché, point relais...)",

  // --- Horaires (À REMPLACER) -------------------------------------------
  openingHours: [
    { day: "Lundi", hours: "Sur rendez-vous" },
    { day: "Mardi — Vendredi", hours: "9h00 – 18h00" },
    { day: "Samedi", hours: "9h00 – 13h00" },
    { day: "Dimanche", hours: "Sur rendez-vous" },
  ],

  // --- Réseaux sociaux ------------------------------------------------------
  social: {
    instagram: "https://www.instagram.com/latelier_de_nono/",
    facebook: "https://www.facebook.com/profile.php?id=61594515713891&locale=fr_FR",
    tiktok: "https://www.tiktok.com/@latelierdenono", // TODO: pas encore fourni — à remplacer si vous avez un compte TikTok
  },

  // --- Formulaire de commande --------------------------------------------
  // URL de l'API qui traite les demandes de devis (voir dossier /server).
  // En local avec le serveur fourni : http://localhost:4000/api/commande
  // En production : l'URL de votre backend déployé, ex. https://api.latelierdenono.fr/api/commande
  orderApiUrl: "http://localhost:4000/api/commande",

  // --- SEO local (À REMPLACER) --------------------------------------------
  seo: {
    city: "Vesoul",
    department: "Haute-Saône",
    region: "Franche-Compté",
  },
};
