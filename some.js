// ===================== CURSEUR CUBE =====================
const cursorCube = document.getElementById("cursor-cube");
document.addEventListener("mousemove", function (e) {
  if (cursorCube) {
    cursorCube.style.left = e.clientX - 10 + "px";
    cursorCube.style.top = e.clientY - 10 + "px";
  }
});

// la touche Shift passe le curseur en 3D
document.addEventListener("keydown", function (e) {
  if (e.key === "Shift") {
    document.body.classList.add("is-3d");
  }
});
document.addEventListener("keyup", function (e) {
  if (e.key === "Shift") {
    document.body.classList.remove("is-3d");
  }
});

// empêche les flèches de faire défiler la page (utile pour le jeu)
window.addEventListener("keydown", function (e) {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    e.preventDefault();
  }
});

// ===================== NAVBAR AU SCROLL =====================
let isScrolling;
window.addEventListener("scroll", function () {
  const nav = document.querySelector(".nav");
  if (nav) {
    if (window.scrollY > 50) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(function () {
      nav.classList.remove("is-scrolled");
    }, 2000);
  }
});

// ===================== IMAGES QUI SUIVENT LA SOURIS =====================
const images = [
  "elements/1.jpg",
  "elements/2.jpg",
  "elements/3.jpg",
  "elements/4.jpg",
  "elements/5.jpg",
  "elements/6.jpg",
  "elements/7.jpg",
  "elements/8.jpg",
  "elements/9.jpg",
  "elements/10.jpg",
  "elements/11.jpg",
  "elements/12.jpg",
  "elements/13.jpg",
  "elements/14.jpg",
  "elements/15.jpg",
  "elements/16.jpg",
  "elements/17.jpg",
  "elements/18.jpg",
  "elements/19.jpg",
  "elements/20.jpg",
];

const trailContainer = document.querySelector(".trail");
let imageIndex = 0;
let lastX = 0;
let lastY = 0;
const distanceThreshold = 100;

document.addEventListener("mousemove", (e) => {
  if (window.scrollY > 50) return;
  const x = e.clientX;
  const y = e.clientY;
  const distance = Math.hypot(x - lastX, y - lastY);
  if (distance > distanceThreshold) {
    spawnImage(x, y);
    lastX = x;
    lastY = y;
  }
});

function spawnImage(x, y) {
  if (y < 60 || !trailContainer) return;
  const img = document.createElement("img");
  img.src = images[imageIndex % images.length];
  imageIndex++;
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  const randomAngle = Math.random() * 20 - 10;
  img.style.transform = `translate(-50%, -50%) rotate(${randomAngle}deg)`;
  trailContainer.appendChild(img);
  setTimeout(() => {
    img.remove();
  }, 2000);
}

// ===================== BULLES SHOP ET CONTACT =====================
let shopTimer;
let emailTimer;

function toggleShop() {
  const shopBox = document.getElementById("ShopBox");
  const emailBox = document.getElementById("emailBox");
  if (emailBox) emailBox.classList.remove("visible");
  clearTimeout(emailTimer);
  if (shopBox) {
    shopBox.classList.toggle("visible");
    if (shopBox.classList.contains("visible")) {
      clearTimeout(shopTimer);
      shopTimer = setTimeout(() => shopBox.classList.remove("visible"), 3000);
    }
  }
}

function toggleEmail() {
  const shopBox = document.getElementById("ShopBox");
  const emailBox = document.getElementById("emailBox");
  if (shopBox) shopBox.classList.remove("visible");
  clearTimeout(shopTimer);
  if (emailBox) {
    emailBox.classList.toggle("visible");
    if (emailBox.classList.contains("visible")) {
      clearTimeout(emailTimer);
      emailTimer = setTimeout(
        () => emailBox.classList.remove("visible"),
        10000,
      );
    }
  }
}

// copie le mail et affiche une coche pendant 2 secondes
function copyToClipboard(event, iconId) {
  event.stopPropagation();
  const email = "remysorriauxpro@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    const iconContainer = document.getElementById(iconId);
    if (!iconContainer) return;

    const originalIcon = iconContainer.innerHTML;
    iconContainer.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`;

    setTimeout(() => {
      iconContainer.innerHTML = originalIcon;
    }, 2000);
  });
}

// ferme la bulle du mail 3 secondes après avoir quitté la souris
let timer;
function startAutoClose() {
  timer = setTimeout(function () {
    const box = document.getElementById("emailBox");
    if (box) box.classList.remove("visible");
  }, 3000);
}
function stopAutoClose() {
  clearTimeout(timer);
}

// ===================== FOOTER =====================
// le footer apparait quand on arrive en bas de la page
document.addEventListener("DOMContentLoaded", function () {
  const footer = document.querySelector(".site-footer");
  if (footer) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) footer.classList.add("is-visible");
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(footer);
  }
});

// ===================== TITRE "HELLO" =====================
// chaque lettre se déforme quand la souris s'approche
document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("pressure-title");
  if (!title) return;
  const text = title.textContent;
  title.innerHTML = "";
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    title.appendChild(span);
  });
  const spans = title.querySelectorAll("span");
  window.addEventListener("mousemove", (e) => {
    spans.forEach((span) => {
      const rect = span.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - charCenterX, 2) +
          Math.pow(e.clientY - charCenterY, 2),
      );
      const maxDist = 400;
      if (distance < maxDist) {
        const intensity = (maxDist - distance) / maxDist;
        span.style.transform = `scale(${1 - intensity * 0.1}, ${1 + intensity * 0.5}) skewX(${intensity * -20}deg)`;
        span.style.fontWeight = 300 + intensity * 600;
      } else {
        span.style.transform = "scale(1, 1) skewX(0deg)";
        span.style.fontWeight = 300;
      }
    });
  });
});

// le titre disparait en scrollant
const pressureTitle = document.getElementById("pressure-title");
if (pressureTitle) {
  window.addEventListener("scroll", () => {
    pressureTitle.style.opacity = Math.max(0, 1 - window.scrollY / 500);
  });
}

// ===================== BOUTON CV =====================
let cvTimer;
function toggleCV() {
  const cvWrapper = document.querySelector(".cv-wrapper");
  const cvBox = document.getElementById("cvBox");
  if (cvBox && cvWrapper) {
    cvBox.classList.toggle("active");
    cvWrapper.classList.toggle("is-open");
    if (!cvBox.classList.contains("active")) closeCVVisuals();
  }
}
function closeCVVisuals() {
  const cvBox = document.getElementById("cvBox");
  const cvWrapper = document.querySelector(".cv-wrapper");
  if (cvBox) cvBox.classList.remove("active");
  if (cvWrapper) cvWrapper.classList.remove("is-open");
}
function startCVTimer() {
  const cvBox = document.getElementById("cvBox");
  if (cvBox && cvBox.classList.contains("active")) {
    cvTimer = setTimeout(() => {
      closeCVVisuals();
    }, 3000);
  }
}
function stopCVTimer() {
  clearTimeout(cvTimer);
}

// ===================== JEU =====================
// le bouton "Click here !" peut être déplacé ; un clic rapide ouvre le jeu
const el = document.getElementById("boom");
const modal = document.getElementById("game-modal");
if (el) {
  let offsetX, offsetY, clickStartTime;
  el.addEventListener("mousedown", (e) => {
    clickStartTime = Date.now();
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
  });
  function mousemove(e) {
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
    el.style.bottom = "auto";
    el.style.right = "auto";
  }
  function mouseup() {
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
    if (Date.now() - clickStartTime < 200 && modal) {
      modal.classList.add("active");
    }
  }
}

const btnPlay = document.querySelector(".btn-launch");
const iframeJeu = document.getElementById("game-iframe");
const ecranPretAJouer = document.getElementById("splash-screen");
const closeBtn = document.getElementById("close-game-btn");
const gameModal = document.getElementById("game-modal");

// bouton "Play" : on charge le jeu dans l'iframe
if (btnPlay) {
  btnPlay.addEventListener("click", () => {
    if (ecranPretAJouer) ecranPretAJouer.style.display = "none";
    if (iframeJeu) {
      iframeJeu.style.display = "block";
      iframeJeu.src = "MonJeuDoodleJump/Second.html";
      iframeJeu.onload = () => {
        iframeJeu.focus();
      };
    }
  });
}

// bouton "×" : on ferme le jeu
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    if (gameModal) gameModal.classList.remove("active");
    if (iframeJeu) {
      iframeJeu.src = "";
      iframeJeu.style.display = "none";
    }
    if (ecranPretAJouer) ecranPretAJouer.style.display = "flex";
  });
}

// le jeu peut demander sa propre fermeture
window.addEventListener("message", (event) => {
  if (event.data === "closeGameModal" && closeBtn) closeBtn.click();
});

// l'image du jeu suit légèrement la souris
const magnet = document.getElementById("magnetRect");
if (magnet) {
  magnet.addEventListener("mousemove", (e) => {
    const rect = magnet.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.4;
    const deltaY = (e.clientY - centerY) * 0.4;
    magnet.querySelector(".magnet-rect").style.transform =
      `translate(${deltaX}px, ${deltaY}px)`;
  });
  magnet.addEventListener("mouseleave", () => {
    magnet.querySelector(".magnet-rect").style.transform = "translate(0, 0)";
  });
}

// ===================== FILTRES DES PROJETS =====================
document.addEventListener("DOMContentLoaded", () => {
  const categories = document.querySelectorAll(".category-item");
  const grid = document.getElementById("projectGrid");
  if (!grid || !categories.length) return;
  const cards = grid.querySelectorAll(".project-card");
  const pairs = grid.querySelectorAll(".project-pair");
  const cols = grid.querySelectorAll(".project-col");

  function applyFilter(filter) {
    const showAll = filter === "all";

    grid.classList.toggle("is-filtered", !showAll);

    // 1. on filtre les cartes
    cards.forEach((card) => {
      const cats = (card.dataset.category || "").split(" ");
      const hideInAll = card.hasAttribute("data-hide-in-all");
      card.hidden = showAll ? hideInAll : !cats.includes(filter);
    });

    // 2. on cache les paires dont les deux cartes sont cachées
    pairs.forEach((pair) => {
      const cardsInPair = pair.querySelectorAll(".project-card");
      const allHidden = Array.from(cardsInPair).every((c) => c.hidden);
      pair.hidden = allHidden;
    });

    // 3. on cache les colonnes vides
    cols.forEach((col) => {
      const visibleItems = col.querySelectorAll(
        ".project-card:not([hidden]), .project-pair:not([hidden])",
      );
      col.hidden = visibleItems.length === 0;
    });
  }

  categories.forEach((category) => {
    category.addEventListener("click", () => {
      categories.forEach((item) => item.classList.remove("active"));
      category.classList.add("active");
      applyFilter(category.getAttribute("data-filter"));
    });
  });

  const activeCategory = document.querySelector(".category-item.active");
  applyFilter(
    activeCategory ? activeCategory.getAttribute("data-filter") : "all",
  );
});

// ===================== FENÊTRE PROJET (diaporama) =====================
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("projectGrid");
  const projectModal = document.getElementById("projectModal");
  if (!grid || !projectModal) return;

  const track = projectModal.querySelector(".pm-track");
  const prevBtn = projectModal.querySelector(".pm-prev");
  const nextBtn = projectModal.querySelector(".pm-next");
  const closeProjectBtn = projectModal.querySelector(".pm-close");

  let total = 0;
  let current = 0;
  let lastFocus = null;

  const AUTOPLAY_MUTED = true;

  function update() {
    track.style.transform = `translateX(${-current * 100}%)`;
    prevBtn.classList.toggle("is-hidden", current === 0);
    nextBtn.classList.toggle("is-hidden", current === total - 1);
  }

  // transforme un lien Vimeo en lien d'intégration
  function vimeoEmbedUrl(url) {
    const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
    if (!m) return null;
    const hash = m[2] || (url.match(/[?&]h=([a-zA-Z0-9]+)/) || [])[1];
    const params = new URLSearchParams({
      title: "0",
      byline: "0",
      portrait: "0",
      dnt: "1",
      loop: "1",
      quality: "1080p",
      autoplay: "1",
      muted: AUTOPLAY_MUTED ? "1" : "0",
    });
    if (hash) params.set("h", hash);
    return `https://player.vimeo.com/video/${m[1]}?${params}`;
  }

  // transforme un lien Sketchfab en lien d'intégration
  function sketchfabEmbedUrl(url) {
    const m = url.match(
      /sketchfab\.com\/(?:3d-models\/(?:[^/?#]*-)?|models\/)([0-9a-f]{32})/i,
    );
    if (!m) return null;
    const params = new URLSearchParams({ autostart: "1", dnt: "1" });
    return `https://sketchfab.com/models/${m[1]}/embed?${params}`;
  }

  // crée une slide : vidéo Vimeo, modèle 3D, fichier vidéo ou image
  function buildSlide(src, label) {
    const slide = document.createElement("div");
    slide.className = "pm-slide";

    const embed = vimeoEmbedUrl(src) || sketchfabEmbedUrl(src);
    if (embed) {
      const iframe = document.createElement("iframe");
      iframe.className = "pm-video";
      iframe.dataset.src = embed;
      iframe.title = label;
      iframe.allow =
        "autoplay; fullscreen; picture-in-picture; xr-spatial-tracking";
      iframe.allowFullscreen = true;
      slide.appendChild(iframe);
    } else if (/\.(mp4|webm|mov)(\?.*)?$/i.test(src)) {
      const video = document.createElement("video");
      video.className = "pm-video";
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      video.loop = true;
      video.muted = AUTOPLAY_MUTED;
      slide.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = src;
      img.alt = label;
      slide.appendChild(img);
    }
    return slide;
  }

  // arrête la vidéo d'une slide quand on la quitte
  function stopSlide(index) {
    const slide = track.children[index];
    if (!slide) return;
    const iframe = slide.querySelector("iframe");
    if (iframe) iframe.src = "about:blank";
    const video = slide.querySelector("video");
    if (video) video.pause();
  }

  // lance la vidéo de la slide affichée
  function activateSlide(index) {
    const slide = track.children[index];
    if (!slide) return;
    const iframe = slide.querySelector("iframe");
    if (iframe && iframe.getAttribute("src") !== iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
    }
    const video = slide.querySelector("video");
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  function go(n) {
    const previous = current;
    current = Math.max(0, Math.min(total - 1, n));
    if (previous !== current) stopSlide(previous);
    update();
    activateSlide(current);
  }

  function openProject(card) {
    const title = card.querySelector("h3")?.textContent.trim() || "";
    const clicked = card.querySelector("img")?.getAttribute("src");

    // images supplémentaires, séparées par "|" dans data-slides
    const extra = card.dataset.slides
      ? card.dataset.slides
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const first = card.dataset.video || clicked;
    const slides = first ? [first, ...extra.filter((s) => s !== first)] : extra;

    track.innerHTML = "";
    slides.forEach((src, i) => {
      track.appendChild(buildSlide(src, `${title} — ${i + 1}`));
    });

    total = slides.length;
    current = 0;

    track.style.transition = "none";
    update();
    void track.offsetWidth;
    track.style.transition = "";
    activateSlide(current);

    lastFocus = document.activeElement;
    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeProjectBtn.focus();
  }

  function closeProject() {
    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");

    // on vide le diaporama après l'animation de fermeture
    setTimeout(() => {
      if (!projectModal.classList.contains("is-open")) track.innerHTML = "";
    }, 350);
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  // clic sur une carte
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (!card) return;
    e.preventDefault();
    openProject(card);
  });

  prevBtn.addEventListener("click", () => go(current - 1));
  nextBtn.addEventListener("click", () => go(current + 1));
  closeProjectBtn.addEventListener("click", closeProject);

  // clic sur le fond sombre
  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) closeProject();
  });

  // clavier : Échap, flèches gauche / droite
  document.addEventListener("keydown", (e) => {
    if (!projectModal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeProject();
    if (e.key === "ArrowRight") go(current + 1);
    if (e.key === "ArrowLeft") go(current - 1);
  });
});
