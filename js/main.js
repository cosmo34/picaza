const apps = [
  {
    id: "goway",
    name: "GOWAY",
    tagline: "Horaires temps réel et navigation TaM à Montpellier.",
    platforms: ["iOS", "Android"],
    status: "live",
    statusLabel: "Bientôt",
    accent: "#5B8DEF",
    wide: true,
    icon: "assets/goway-icon.png",
    href: "apps/goway.html",
    store: null,
  },
  {
    id: "viewzy",
    name: "Viewzy",
    tagline: "Serveurs de fichiers, médias et panier — conçu pour iPad.",
    platforms: ["iPadOS"],
    status: "live",
    statusLabel: "Sur l’App Store",
    accent: "#C8F06C",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e8/e7/13/e8e71340-60d9-fe09-d9ab-f969f2cde535/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg",
    href: "apps/viewzy.html",
    store: "https://apps.apple.com/fr/app/viewzy/id6774137587",
  },
  {
    id: "oculus",
    name: "Oculus",
    tagline: "Studio vidéo Mac — capture, diffusion, montage, conversion.",
    platforms: ["macOS"],
    status: "live",
    statusLabel: "Sur le Mac App Store",
    accent: "#6EC8C0",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/7e/ae/f3/7eaef3ed-e22b-1d97-cb33-8b40e960be09/AppIcon-0-0-85-220-0-5-0-2x.png/512x512bb.png",
    href: "apps/oculus.html",
    store: "https://apps.apple.com/fr/app/oculus/id6776262110?mt=12",
  },
];

function renderApps(root) {
  if (!root) return;
  root.innerHTML = apps
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
