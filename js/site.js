(function () {
  const CONTACT = (window.PICAZA_I18N && window.PICAZA_I18N.contactEmail) || "contact@picaza.fr";
  const STORAGE_KEY = "picaza-lang";

  const publishedApps = [
    {
      id: "viewzy",
      name: "Viewzy",
      platforms: ["iPadOS"],
      accent: "#C8F06C",
      icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e8/e7/13/e8e71340-60d9-fe09-d9ab-f969f2cde535/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg",
      store: "https://apps.apple.com/fr/app/viewzy/id6774137587",
    },
    {
      id: "oculus",
      name: "Oculus",
      platforms: ["macOS", "Apple Silicon"],
      accent: "#6EC8C0",
      icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/7e/ae/f3/7eaef3ed-e22b-1d97-cb33-8b40e960be09/AppIcon-0-0-85-220-0-5-0-2x.png/512x512bb.png",
      store: "https://apps.apple.com/fr/app/oculus/id6776262110?mt=12",
    },
  ];

  function depthPrefix() {
    const d = document.body && document.body.dataset.depth;
    if (d === "2") return "../../";
    if (d === "1") return "../";
    return "";
  }

  function t(key) {
    const i18n = window.PICAZA_I18N;
    const loc = getLocale();
    const pack = (i18n.strings[loc] || i18n.strings.fr);
    return pack[key] || i18n.strings.fr[key] || key;
  }

  function getLocale() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && window.PICAZA_I18N.locales[saved]) return saved;
    const nav = (navigator.language || "fr").slice(0, 2).toLowerCase();
    return window.PICAZA_I18N.locales[nav] ? nav : "fr";
  }

  function setLocale(loc) {
    if (!window.PICAZA_I18N.locales[loc]) return;
    localStorage.setItem(STORAGE_KEY, loc);
    applyLocale();
  }

  function applyLocale() {
    const loc = getLocale();
    const rtl = window.PICAZA_I18N.rtl.includes(loc);
    document.documentElement.lang = loc;
    document.documentElement.dir = rtl ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });

    document.querySelectorAll("[data-app-tagline]").forEach((el) => {
      const id = el.getAttribute("data-app-tagline");
      el.textContent = t("tagline_" + id);
    });

    const langBtn = document.getElementById("lang-current");
    if (langBtn) langBtn.textContent = loc.toUpperCase();

    renderAppsGrid();
  }

  function buildNav() {
    const mount = document.getElementById("site-nav");
    if (!mount) return;
    const p = depthPrefix();
    mount.innerHTML = `
      <div class="wrap nav-inner">
        <a class="logo" href="${p}index.html" data-home>PICAZA<span>.</span></a>
        <div class="nav-actions">
          <div class="lang-wrap">
            <button type="button" class="icon-btn" id="lang-toggle" aria-haspopup="listbox" aria-expanded="false" title="Language">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.8 3.8 6 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-6-3.8-9S9.5 5.8 12 3z" stroke="currentColor" stroke-width="1.6"/></svg>
              <span id="lang-current">FR</span>
            </button>
            <ul class="nav-dropdown lang-menu" id="lang-menu" role="listbox"></ul>
          </div>
          <div class="menu-wrap">
            <button type="button" class="icon-btn menu-btn" id="menu-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Menu">
              <svg class="burger-icon" width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
                <path d="M1 1h18M1 7h18M1 13h18" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="sheet-menu" id="sheet-menu" aria-hidden="true">
        <div class="sheet-rail wrap">
          <a class="sheet-link" href="${p}apps/viewzy.html" style="--i:0">Viewzy</a>
          <a class="sheet-link" href="${p}apps/oculus.html" style="--i:1">Oculus</a>
          <a class="sheet-link" href="${p}apps/goway.html" style="--i:2">GOWAY</a>
          <button type="button" class="sheet-link sheet-btn" data-open-contact data-i18n="nav_contact" style="--i:3">Contact</button>
        </div>
      </div>
    `;

    const menu = document.getElementById("lang-menu");
    Object.entries(window.PICAZA_I18N.locales).forEach(([code, label]) => {
      const li = document.createElement("li");
      li.role = "option";
      li.tabIndex = 0;
      li.dataset.locale = code;
      li.textContent = label;
      li.addEventListener("click", () => {
        setLocale(code);
        closeLang();
      });
      menu.appendChild(li);
    });
  }

  function buildContactModal() {
    if (document.getElementById("contact-modal")) return;
    const el = document.createElement("div");
    el.id = "contact-modal";
    el.className = "modal";
    el.hidden = true;
    el.innerHTML = `
      <div class="modal-backdrop" data-close-contact></div>
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <h2 id="contact-title" data-i18n="contact_modal_title">Nous écrire</h2>
        <label class="field">
          <span data-i18n="contact_modal_subject">Sujet</span>
          <input type="text" id="contact-subject" data-i18n-placeholder="contact_subject_ph" />
        </label>
        <label class="field">
          <span data-i18n="contact_modal_message">Message</span>
          <textarea id="contact-message" rows="5" data-i18n-placeholder="contact_message_ph"></textarea>
        </label>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-close-contact data-i18n="contact_modal_cancel">Annuler</button>
          <button type="button" class="btn btn-primary" id="contact-send" data-i18n="contact_modal_send">Ouvrir l’e-mail</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
  }

  function openContact() {
    const modal = document.getElementById("contact-modal");
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    closeMenu();
    setTimeout(() => document.getElementById("contact-subject")?.focus(), 50);
  }

  function closeContact() {
    const modal = document.getElementById("contact-modal");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function sendContact() {
    const subject = document.getElementById("contact-subject")?.value?.trim() || "Picaza";
    const message = document.getElementById("contact-message")?.value?.trim() || "";
    const href = `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = href;
    closeContact();
  }

  function openMenu() {
    const sheet = document.getElementById("sheet-menu");
    const btn = document.getElementById("menu-toggle");
    if (!sheet) return;
    closeLang();
    sheet.classList.remove("is-closing");
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    btn?.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    const sheet = document.getElementById("sheet-menu");
    const btn = document.getElementById("menu-toggle");
    if (!sheet || !sheet.classList.contains("is-open")) return;
    sheet.classList.add("is-closing");
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    btn?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    window.setTimeout(() => sheet.classList.remove("is-closing"), 420);
  }

  function toggleMenu() {
    const sheet = document.getElementById("sheet-menu");
    if (!sheet) return;
    if (sheet.classList.contains("is-open")) closeMenu();
    else openMenu();
  }

  function openLang() {
    const menu = document.getElementById("lang-menu");
    const btn = document.getElementById("lang-toggle");
    if (!menu) return;
    closeMenu();
    menu.classList.add("is-open");
    btn?.setAttribute("aria-expanded", "true");
  }

  function closeLang() {
    const menu = document.getElementById("lang-menu");
    const btn = document.getElementById("lang-toggle");
    if (!menu) return;
    menu.classList.remove("is-open");
    btn?.setAttribute("aria-expanded", "false");
  }

  function toggleLang() {
    const menu = document.getElementById("lang-menu");
    if (!menu) return;
    if (menu.classList.contains("is-open")) closeLang();
    else openLang();
  }

  function showAppsSection(scroll) {
    const section = document.getElementById("apps");
    if (!section) return;
    section.classList.add("is-visible");
    section.hidden = false;
    if (scroll) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderAppsGrid() {
    const root = document.getElementById("apps-grid");
    if (!root) return;
    const p = depthPrefix();
    if (!publishedApps.length) {
      root.innerHTML = `<p class="reveal in" data-i18n="catalog_empty">${t("catalog_empty")}</p>`;
      return;
    }
    root.innerHTML = publishedApps
      .map((app) => {
        const chips = [
          `<span class="chip live">${t("status_store")}</span>`,
          ...app.platforms.map((x) => `<span class="chip">${x}</span>`),
        ].join("");
        return `
      <a class="app-tile reveal in" href="${p}apps/${app.id}.html">
        <span class="app-glow" style="background:${app.accent}"></span>
        <div class="tile-top"><img class="tile-icon" src="${app.icon}" alt="" width="56" height="56" /><div class="app-meta">${chips}</div></div>
        <h3 class="app-name">${app.name}</h3>
        <p class="app-desc">${t("card_" + app.id)}</p>
      </a>`;
      })
      .join("");
  }

  function initReveal() {
    const nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    nodes.forEach((n) => io.observe(n));
  }

  function initNavScroll() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function wireEvents() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-contact]")) {
        e.preventDefault();
        openContact();
        return;
      }
      if (e.target.closest("[data-close-contact]")) {
        closeContact();
        return;
      }
      if (e.target.closest("#menu-toggle")) {
        toggleMenu();
        return;
      }
      if (e.target.closest("#lang-toggle")) {
        toggleLang();
        return;
      }
      if (e.target.closest("[data-show-apps]")) {
        showAppsSection(true);
        closeMenu();
      }
      if (!e.target.closest(".lang-wrap")) closeLang();
      if (!e.target.closest(".menu-wrap") && !e.target.closest("#sheet-menu")) closeMenu();
    });

    document.getElementById("contact-send")?.addEventListener("click", sendContact);

    document.querySelectorAll('a[href$="#apps"], a[href="#apps"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const section = document.getElementById("apps");
        if (!section) return;
        e.preventDefault();
        showAppsSection(true);
        history.replaceState(null, "", "#apps");
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeContact();
        closeMenu();
        closeLang();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildNav();
    buildContactModal();
    wireEvents();
    initNavScroll();
    applyLocale();
    initReveal();

    const appsSection = document.getElementById("apps");
    if (appsSection) {
      if (location.hash === "#apps") showAppsSection(true);
      else {
        appsSection.hidden = true;
        appsSection.classList.remove("is-visible");
      }
    }

    // Fix home links when opened as file
    document.querySelectorAll("[data-home]").forEach((a) => {
      a.setAttribute("href", depthPrefix() + "index.html");
    });
  });
})();
