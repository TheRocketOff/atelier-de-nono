/**
 * L'atelier de Nono — script principal
 * Aucune dépendance externe. Toutes les données "métier" viennent de config.js.
 */
(function () {
  "use strict";

  const CFG = window.NONO_CONFIG || {};

  /* ==========================================================
     0. Injection des données de config dans le DOM
  ========================================================== */
  function applyConfig() {
    // Téléphone
    const telHref = `tel:${CFG.phone?.href || ""}`;
    document.querySelectorAll("#contactPhone, #callBtn, #mobileCallBtn").forEach((el) => {
      el.setAttribute("href", telHref);
    });
    const contactPhone = document.getElementById("contactPhone");
    if (contactPhone) contactPhone.textContent = CFG.phone?.display || contactPhone.textContent;
    const footerPhone = document.getElementById("footerPhone");
    if (footerPhone) footerPhone.textContent = CFG.phone?.display || footerPhone.textContent;

    // E-mail
    document.querySelectorAll("#contactEmail, #footerEmail").forEach((el) => {
      el.setAttribute("href", `mailto:${CFG.email}`);
      el.textContent = CFG.email || el.textContent;
    });

    // Adresse / zone
    const addr = document.getElementById("contactAddress");
    if (addr && CFG.address) {
      addr.textContent = `${CFG.address.line1}, ${CFG.address.postalCode} ${CFG.address.city}`;
    }
    const delivery = document.getElementById("contactDelivery");
    if (delivery) delivery.textContent = `Livraison : ${CFG.deliveryZone || ""}`;
    const pickup = document.getElementById("contactPickup");
    if (pickup) pickup.textContent = `Retrait : ${CFG.pickupZone || ""}`;

    // Horaires
    const hoursWrap = document.getElementById("contactHours");
    if (hoursWrap && Array.isArray(CFG.openingHours)) {
      hoursWrap.innerHTML = CFG.openingHours
        .map((h) => `<div><span>${h.day}</span><strong>${h.hours}</strong></div>`)
        .join("");
    }

    // Réseaux sociaux
    const socialMap = { instagram: CFG.social?.instagram, facebook: CFG.social?.facebook, tiktok: CFG.social?.tiktok };
    document.querySelectorAll("[data-social]").forEach((el) => {
      const key = el.getAttribute("data-social");
      if (socialMap[key]) el.setAttribute("href", socialMap[key]);
    });
  }

  /* ==========================================================
     1. Navigation (header + menu mobile)
  ========================================================== */
  function initNav() {
    const header = document.getElementById("siteHeader");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ==========================================================
     2. Apparition au scroll
  ========================================================== */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ==========================================================
     3. Galerie — filtres + Lightbox
  ========================================================== */
  function initGallery() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const items = Array.from(document.querySelectorAll(".masonry-item"));

    const emptyState = document.getElementById("galleryEmpty");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const filter = btn.getAttribute("data-filter");
        let visibleCount = 0;
        items.forEach((item) => {
          const show = filter === "tout" || item.getAttribute("data-category") === filter;
          item.classList.toggle("is-hidden", !show);
          if (show) visibleCount++;
        });
        if (emptyState) emptyState.hidden = visibleCount !== 0;
      });
    });

    // Lightbox
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeBtn = document.getElementById("lightboxClose");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");
    let currentIndex = 0;

    function visibleItems() {
      return items.filter((it) => !it.classList.contains("is-hidden"));
    }

    function openLightbox(index) {
      const list = visibleItems();
      if (!list.length) return;
      currentIndex = (index + list.length) % list.length;
      const item = list[currentIndex];
      const img = item.querySelector("img");
      const caption = item.querySelector(".overlay");
      lightboxImg.src = img ? img.currentSrc || img.src : "";
      lightboxImg.alt = img ? img.alt : "";
      lightboxCaption.textContent = caption ? caption.textContent : "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    items.forEach((item, idx) => {
      item.addEventListener("click", () => {
        const list = visibleItems();
        const listIdx = list.indexOf(item);
        openLightbox(listIdx === -1 ? 0 : listIdx);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener("click", () => openLightbox(currentIndex - 1));
    nextBtn.addEventListener("click", () => openLightbox(currentIndex + 1));

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
      if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
    });

    // fermeture tactile (swipe vers le bas)
    let touchStartY = null;
    lightbox.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (touchStartY === null) return;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (dy > 80) closeLightbox();
      touchStartY = null;
    }, { passive: true });
  }

  /* ==========================================================
     4. Upload de photos d'inspiration (drag & drop + aperçu)
  ========================================================== */
  function initUpload() {
    const zone = document.getElementById("uploadZone");
    const input = document.getElementById("fileInput");
    const previews = document.getElementById("uploadPreviews");
    if (!zone || !input) return;

    const MAX_FILES = 5;
    const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
    const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
    let files = [];

    function renderPreviews() {
      previews.innerHTML = "";
      files.forEach((file, i) => {
        const thumb = document.createElement("div");
        thumb.className = "upload-thumb";
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = `Aperçu inspiration ${i + 1}`;
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.setAttribute("aria-label", "Retirer cette photo");
        removeBtn.textContent = "✕";
        removeBtn.addEventListener("click", () => {
          files.splice(i, 1);
          renderPreviews();
        });
        thumb.appendChild(img);
        thumb.appendChild(removeBtn);
        previews.appendChild(thumb);
      });
    }

    function addFiles(fileList) {
      const incoming = Array.from(fileList);
      for (const file of incoming) {
        if (files.length >= MAX_FILES) {
          alert(`Vous pouvez joindre ${MAX_FILES} photos maximum.`);
          break;
        }
        if (!ACCEPTED.includes(file.type)) {
          alert(`Format non accepté : ${file.name}. Utilisez JPG, PNG ou WEBP.`);
          continue;
        }
        if (file.size > MAX_SIZE) {
          alert(`« ${file.name} » dépasse 5 Mo et ne peut pas être ajoutée.`);
          continue;
        }
        files.push(file);
      }
      renderPreviews();
    }

    zone.addEventListener("click", () => input.click());
    zone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
    });
    input.addEventListener("change", () => addFiles(input.files));

    ["dragenter", "dragover"].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.remove("is-dragover");
      });
    });
    zone.addEventListener("drop", (e) => {
      if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
    });

    // expose pour la soumission du formulaire
    window.__nonoGetUploadedFiles = () => files;
  }

  /* ==========================================================
     5. Formulaire de commande / devis
  ========================================================== */
  function initOrderForm() {
    const form = document.getElementById("orderForm");
    if (!form) return;
    const feedback = document.getElementById("formFeedback");
    const submitBtn = document.getElementById("submitBtn");
    const loadedAtField = document.getElementById("formLoadedAt");
    if (loadedAtField) loadedAtField.value = String(Date.now());

    function showFeedback(type, message) {
      feedback.className = `form-feedback is-${type}`;
      feedback.textContent = message;
      feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      feedback.className = "form-feedback";
      feedback.textContent = "";

      // Anti-spam : le honeypot doit rester vide
      const honeypot = form.querySelector("#website");
      if (honeypot && honeypot.value.trim() !== "") {
        // Ne pas alerter un éventuel robot : faux succès silencieux
        showFeedback("success", "Merci pour votre demande ! 🍰 Votre projet a bien été transmis à L'atelier de Nono.");
        form.reset();
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const files = (window.__nonoGetUploadedFiles && window.__nonoGetUploadedFiles()) || [];
      formData.delete("photos");
      files.forEach((file) => formData.append("photos", file));

      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Envoi en cours...";

      try {
        const apiUrl = CFG.orderApiUrl;
        if (!apiUrl) throw new Error("no-api-url");

        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "request-failed");
        }

        showFeedback(
          "success",
          "Merci pour votre demande ! 🍰 Votre projet a bien été transmis à L'atelier de Nono. Nous reviendrons vers vous rapidement afin d'échanger sur votre création."
        );
        form.reset();
        if (window.__nonoGetUploadedFiles) {
          files.length = 0;
          document.getElementById("uploadPreviews").innerHTML = "";
        }
      } catch (err) {
        console.error("Erreur d'envoi du formulaire :", err);
        showFeedback(
          "error",
          `Une erreur est survenue lors de l'envoi de votre demande. Merci de réessayer, ou de nous contacter directement au ${CFG.phone?.display || ""} / ${CFG.email || ""}.`
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* ==========================================================
     6. Bouton "retour en haut"
  ========================================================== */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("is-visible", window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ==========================================================
     7. Bandeau cookies (RGPD)
  ========================================================== */
  function initCookieBanner() {
    const banner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("cookieAccept");
    const declineBtn = document.getElementById("cookieDecline");
    const settingsLink = document.getElementById("cookieSettingsLink");
    if (!banner) return;

    const STORAGE_KEY = "nono_cookie_choice";

    function getChoice() {
      try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
    }
    function setChoice(value) {
      try { localStorage.setItem(STORAGE_KEY, value); } catch { /* stockage indisponible */ }
    }

    if (!getChoice()) {
      setTimeout(() => banner.classList.add("is-visible"), 800);
    }

    acceptBtn.addEventListener("click", () => {
      setChoice("accepted");
      banner.classList.remove("is-visible");
    });
    declineBtn.addEventListener("click", () => {
      setChoice("declined");
      banner.classList.remove("is-visible");
    });
    if (settingsLink) {
      settingsLink.addEventListener("click", (e) => {
        e.preventDefault();
        banner.classList.add("is-visible");
      });
    }
  }

  /* ==========================================================
     Init
  ========================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initNav();
    initReveal();
    initGallery();
    initUpload();
    initOrderForm();
    initBackToTop();
    initCookieBanner();
  });
})();
