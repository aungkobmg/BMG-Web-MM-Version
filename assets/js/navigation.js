/* ============================================================
   BMG Website V2 - navigation.js
   Responsibilities:
     1. Accessible mobile nav (aria-expanded, Escape, outside click,
        focus return, body scroll lock, close on navigation/resize).
     2. Active link highlighting resolved against the current document.
     3. Header shadow on scroll.
   Loaded with `defer` on every page. Every function is a no-op when
   its elements are absent. Works from any folder depth and when the
   site is served from a sub-path (GitHub Pages project sites).
   ============================================================ */
(function () {
  "use strict";

  const DESKTOP_QUERY = "(min-width: 992px)";

  const ready = (fn) => {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  };

  ready(() => {
    initMobileNav();
    highlightActiveLink();
    initHeaderScrollState();
  });

  /* ---------- 1. Mobile navigation ---------- */
  function initMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);

    const setOpen = (open, { restoreFocus = false } = {}) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
      if (restoreFocus) toggle.focus();
    };
    const isOpen = () => nav.classList.contains("is-open");

    toggle.addEventListener("click", () => setOpen(!isOpen()));

    // Close when a link is chosen (covers same-page and anchor links)
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    // Close on Escape and return focus to the toggle
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) setOpen(false, { restoreFocus: true });
    });

    // Close on outside click/tap
    document.addEventListener("click", (event) => {
      if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });

    // Reset state when moving to the desktop layout
    const onBreakpointChange = (event) => {
      if (event.matches) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpointChange);
    else desktop.addListener(onBreakpointChange);

    // Restore state if the page is restored from the back/forward cache
    window.addEventListener("pageshow", () => setOpen(false));
  }

  /* ---------- 2. Active link highlighting ---------- */
  function highlightActiveLink() {
    const current = normalizePath(window.location.href);
    if (!current) return;

    document.querySelectorAll("[data-nav] a[href]").forEach((link) => {
      const target = normalizePath(link.href); // `.href` is resolved against the document URL
      // Section match: /services/ is active on /services/music-distribution.html,
      // but the home link only matches the home page itself.
      const isExact = target === current;
      const isSection =
        !isExact && target !== homePath() && target.endsWith("/") && current.startsWith(target);
      if (isExact || isSection) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", isExact ? "page" : "true");
      }
    });
  }

  // The home link is the nav link that points at the site root; it is the
  // shortest directory path among nav links, so only an exact match counts.
  function homePath() {
    const homeLink = document.querySelector("[data-nav] a[href]");
    return homeLink ? normalizePath(homeLink.href) : "";
  }

  function normalizePath(href) {
    try {
      const url = new URL(href, document.baseURI);
      if (url.origin !== window.location.origin) return "";
      return url.pathname.replace(/index\.html$/i, "");
    } catch (error) {
      return "";
    }
  }

  /* ---------- 3. Header scroll state ---------- */
  function initHeaderScrollState() {
    const header = document.querySelector(".bmg-header");
    if (!header) return;

    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", update, { passive: true });
    update();
  }
})();
