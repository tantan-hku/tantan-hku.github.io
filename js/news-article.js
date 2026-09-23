(function () {
  "use strict";
  const title = document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : document.title;
  const canonical = document.querySelector('link[rel="canonical"]');
  const pageUrl = canonical ? canonical.href : location.href;
  const status = document.querySelector("[data-share-status]");
  const tip = document.querySelector("[data-wechat-tip]");

  function copyLink(message) {
    const fallback = function () {
      const input = document.createElement("textarea");
      input.value = pageUrl;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    };
    const action = navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(pageUrl) : Promise.resolve(fallback());
    action.then(function () {
      if (status) {
        status.textContent = message;
        window.setTimeout(function () { status.textContent = ""; }, 3000);
      }
    });
  }

  document.querySelectorAll("[data-copy-link]").forEach(function (button) {
    button.addEventListener("click", function () { copyLink(button.dataset.copied || "Link copied."); });
  });
  document.querySelectorAll("[data-wechat]").forEach(function (button) {
    button.addEventListener("click", function () {
      copyLink(button.dataset.copied || "Link copied.");
      if (tip) tip.hidden = false;
    });
  });
  document.querySelectorAll("[data-linkedin]").forEach(function (link) {
    link.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(pageUrl);
  });
  document.querySelectorAll("[data-email]").forEach(function (link) {
    link.href = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(pageUrl);
  });

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
  let lastTrigger = null;
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  }
  document.querySelectorAll("[data-lightbox-src]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!lightbox || !lightboxImage) return;
      lastTrigger = button;
      const source = button.dataset.lightboxSrc;
      const thumbnail = button.querySelector("img");
      lightboxImage.src = source;
      lightboxImage.alt = thumbnail ? thumbnail.alt : "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightbox.querySelector("button").focus();
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", function (event) { if (event.target === lightbox || event.target.closest("[data-lightbox-close]")) closeLightbox(); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox(); });
  }

  const menuButton = document.getElementById("menu-toggle-btn");
  const overlay = document.getElementById("menu-overlay");
  function closeMenu() { document.body.classList.remove("menu-open"); if (menuButton) menuButton.setAttribute("aria-expanded", "false"); }
  if (menuButton) menuButton.addEventListener("click", function () { const open = document.body.classList.toggle("menu-open"); menuButton.setAttribute("aria-expanded", String(open)); });
  if (overlay) overlay.addEventListener("click", closeMenu);
  document.querySelectorAll("#nav-links-menu a").forEach(function (link) { link.addEventListener("click", closeMenu); });
  const topButton = document.getElementById("back-to-top-btn");
  if (topButton) addEventListener("scroll", function () { topButton.classList.toggle("visible", scrollY > 400); });
}());
