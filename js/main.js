const apps = [
  {
    "id": "goway",
    "name": "GOWAY",
    "tagline": "GOWAY est l’application de mobilité pour la Métropole de Montpellier. Elle s’appuie sur les données open data TaM (GT…",
    "platforms": [
      "iOS",
      "Android"
    ],
    "status": "draft",
    "statusLabel": "Bientôt",
    "accent": "#5B8DEF",
    "wide": true,
    "icon": "assets/goway-icon.png?v=20260904g",
    "href": "apps/goway.html",
    "store": null,
    "ascId": "6806571587",
    "ascState": "PREPARE_FOR_SUBMISSION"
  },
  {
    "id": "viewzy",
    "name": "Viewzy",
    "tagline": "Viewzy est une application iPad conçue pour parcourir facilement vos serveurs de fichiers sur le réseau local, consul…",
    "platforms": [
      "iPadOS"
    ],
    "status": "live",
    "statusLabel": "Sur l’App Store",
    "accent": "#00D0C8",
    "wide": false,
    "icon": "assets/viewzy-icon.png?v=20260904v2b",
    "href": "apps/viewzy.html",
    "store": "https://apps.apple.com/fr/app/viewzy/id6774137587",
    "ascId": "6774137587",
    "ascState": "READY_FOR_SALE"
  },
  {
    "id": "oculus",
    "name": "Oculus",
    "tagline": "Oculus est le studio vidéo natif pour Mac qui élève votre production — de la prise de vue à la diffusion, du montage …",
    "platforms": [
      "macOS",
      "Apple Silicon"
    ],
    "status": "live",
    "statusLabel": "Sur l’App Store",
    "accent": "#00D0C8",
    "wide": false,
    "icon": "assets/oculus-icon.png?v=20260904o",
    "href": "apps/oculus.html",
    "store": "https://apps.apple.com/fr/app/oculus/id6776262110?mt=12",
    "ascId": "6776262110",
    "ascState": "READY_FOR_SALE"
  }
];

function isPublished(app) {
  return Boolean(app.store) || app.ascState === "READY_FOR_SALE";
}

function renderApps(root) {
  if (!root) return;
  const visible = apps.filter(isPublished);
  if (!visible.length) {
    root.innerHTML = `<p class="reveal in" style="opacity:.7">Catalogue à venir.</p>`;
    return;
  }
  root.innerHTML = visible
    .map((app) => {
      const chips = [
        `<span class="chip ${app.status}">${app.statusLabel}</span>`,
        ...app.platforms.map((p) => `<span class="chip">${p}</span>`),
      ].join("");
      const classes = ["app-tile", app.wide ? "wide" : ""].filter(Boolean).join(" ");
      const icon = app.icon
        ? `<img class="tile-icon" src="${app.icon}" alt="" width="56" height="56" />`
        : "";
      return `
      <a class="${classes} reveal" href="${app.href}">
        <span class="app-glow" style="background:${app.accent}"></span>
        <div class="tile-top">${icon}<div class="app-meta">${chips}</div></div>
        <h3 class="app-name">${app.name}</h3>
        <p class="app-desc">${app.tagline}</p>
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

function initNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  renderApps(document.getElementById("apps-grid"));
  initReveal();
  initNav();
});
