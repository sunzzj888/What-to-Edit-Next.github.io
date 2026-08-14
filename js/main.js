/* Project-page interactions inherited from the reference template:
   tabs, figure lightbox, BibTeX copy, reading progress, reveal motion,
   and floating section navigation. */

function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((group) => {
    const tabs = [...group.querySelectorAll(".tab")];
    const panes = [...group.querySelectorAll(".tabpane")];

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((item) => {
          const active = item === tab;
          item.classList.toggle("active", active);
          item.setAttribute("aria-selected", String(active));
        });
        panes.forEach((pane) => pane.classList.remove("active"));
        group.querySelector(`#${tab.dataset.target}`)?.classList.add("active");
      });
    });
  });
}

function initLightbox() {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Expanded paper figure");
  lightbox.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close">×</button><img alt="Expanded paper figure">';
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const close = () => lightbox.classList.remove("open");

  document.body.addEventListener("click", (event) => {
    const image = event.target.closest("figure.fig img");
    if (!image) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
    lightbox.querySelector("button").focus();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.closest(".lightbox-close")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function initCopy() {
  document.querySelectorAll(".bibtex .copy").forEach((button) => {
    button.addEventListener("click", async () => {
      const code = button.parentElement.querySelector("pre")?.innerText || "";
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      const original = button.textContent;
      button.textContent = "Copied!";
      window.setTimeout(() => (button.textContent = original), 1500);
    });
  });
}

function initMath() {
  if (!window.renderMathInElement) return;
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
  });
}

function initProgress() {
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  document.body.appendChild(bar);
  let ticking = false;

  const update = () => {
    const documentRoot = document.documentElement;
    const maxScroll = documentRoot.scrollHeight - window.innerHeight;
    bar.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    ticking = false;
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  update();
}

function initDotNav() {
  const sections = [...document.querySelectorAll("section")].filter((section) => section.querySelector("h2.sec"));
  if (sections.length < 3 || !("IntersectionObserver" in window)) return;

  const nav = document.createElement("nav");
  nav.className = "dotnav";
  nav.setAttribute("aria-label", "Section navigation");

  sections.forEach((section, index) => {
    if (!section.id) section.id = `section-${index}`;
    const label = section.querySelector("h2.sec").textContent.trim();
    const link = document.createElement("a");
    link.className = "dot";
    link.href = `#${section.id}`;
    link.setAttribute("aria-label", label);
    link.innerHTML = `<span class="dot-label">${label}</span>`;
    nav.appendChild(link);
  });
  document.body.appendChild(nav);

  const dots = [...nav.querySelectorAll(".dot")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        dots.forEach((dot) => dot.classList.toggle("active", dot.hash === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
}

function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("has-reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -7% 0px" },
  );
  document.querySelectorAll("section").forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  initMath();
  initTabs();
  initLightbox();
  initCopy();
  initProgress();
  initReveal();
  initDotNav();
});
