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
  deliveryZone: "20 km autour de Vesoul",

  // --- Horaires (À REMPLACER) -------------------------------------------
  openingHours: [
    { day: "Lundi", hours: "Sur rendez-vous" },
    { day: "Mardi — Vendredi", hours: "9h00 – 18h00" },
    { day: "Samedi", hours: "9h00 – 13h00" },
    { day: "Dimanche", hours: "Sur rendez-vous" },
  ],

  // --- Réseaux sociaux ------------------------------------------------------
  social: {
    instagram: "https://www.instagram.com/latelier_de__nono?stkn=MW91djZzbDNxb2J4cQ%3D%3D",
    facebook: "https://www.facebook.com/profile.php?id=61594515713891&locale=fr_FR",
    tiktok: null, // pas encore de compte TikTok — la carte affiche "Prochainement"
  },

  // --- Formulaire de commande --------------------------------------------
  // URL de l'API qui traite les demandes de devis (backend déployé sur Render).
  // Pour retester en local, remplacez temporairement par http://localhost:4000/api/commande
  orderApiUrl: "https://atelier-de-nono-v7uo.onrender.com/api/commande",

  // --- SEO local (À REMPLACER) --------------------------------------------
  seo: {
    city: "Vesoul",
    department: "Haute-Saône",
    region: "Franche-Compté",
  },
};
