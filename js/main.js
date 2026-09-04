const apps = [
  {
    id: "goway",
    name: "GOWAY",
    tagline: "Horaires temps réel et navigation TaM à Montpellier.",
    platforms: ["iOS", "Android"],
    status: "live",
    statusLabel: "App Store bientôt",
    accent: "#5B8DEF",
    wide: true,
    href: "apps/goway.html",
    store: null,
  },
  {
    id: "cotcot",
    name: "Cot Cot",
    tagline: "Course de poules arcade — Mario Kart × cartoon.",
    platforms: ["iOS", "iPadOS"],
    status: "live",
    statusLabel: "Jeu",
    accent: "#F0A56C",
    href: "apps/cotcot.html",
    store: null,
  },
  {
    id: "mastercell",
    name: "Master Cell",
    tagline: "Puzzle tactique hexagonal, réactions en chaîne.",
    platforms: ["iOS"],
    status: "live",
    statusLabel: "Puzzle",
    accent: "#6EC8C0",
    href: "apps/mastercell.html",
    store: null,
  },
  {
    id: "viewzy",
    name: "Viewzy",
    tagline: "Création visuelle pour iPad — flux, outils, abonnement Premium.",
    platforms: ["iPadOS"],
    status: "live",
    statusLabel: "iPad",
    accent: "#C8F06C",
    href: "apps/viewzy.html",
    store: null,
  },
  {
    id: "oculus",
    name: "Oculus",
    tagline: "Application Mac — vision et flux de travail créatif.",
    platforms: ["macOS"],
    status: "live",
    statusLabel: "Mac",
    accent: "#E8E4DC",
    href: "apps/oculus.html",
    store: null,
  },
  {
    id: "jumpy",
    name: "Jumpy",
    tagline: "Projet en préparation — bientôt sur le hub Picaza.",
    platforms: ["Windows", "macOS"],
    status: "soon",
    statusLabel: "Bientôt",
    accent: "#9A958C",
    href: "#apps",
    soon: true,
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
      const classes = ["app-tile", app.wide ? "wide" : "", app.soon ? "soon" : ""]
        .filter(Boolean)
        .join(" ");
      return `
      <a class="${classes} reveal" href="${app.href}" ${app.soon ? 'aria-disabled="true"' : ""}>
        <span class="app-glow" style="background:${app.accent}"></span>
        <div class="app-meta">${chips}</div>
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
