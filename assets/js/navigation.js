/* ============================================================
   BMG Website V2 - navigation.js
   Responsibilities:
     1. Mobile nav toggle (accessible, aria-expanded).
     2. Active link highlighting based on current path.
     3. Header shadow on scroll.
   Loaded with `defer` on every page. Uses relative-safe logic so
   it works from any folder depth (/services/, /resources/youtube/…).
   ============================================================ */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    initMobileNav();
    highlightActiveLink();
    initHeaderScrollState();
  });

  /* ---------- 1. Mobile navigation toggle ---------- */
  function initMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Close when a nav link is chosen (mobile UX)
    nav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });

    // Close on Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- 2. Active link highlighting ---------- */
  function highlightActiveLink() {
    var currentPath = normalizePath(window.location.pathname);
    var links = document.querySelectorAll("[data-nav] a[href]");

    links.forEach(function (link) {
      var linkPath = normalizePath(link.getAttribute("href") || "");
      if (linkPath === currentPath) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function normalizePath(href) {
    if (!href) return "";
    try {
      // Resolve against current directory so relative hrefs work
      // at any folder depth ("../about/", "index.html", "/services/").
      var url = new URL(href, window.location.origin + "/");
      var p = url.pathname;
      // Treat index.html as the directory itself
      p = p.replace(/index\.html$/i, "");
      // Ensure trailing slash for directory paths
      if (!/\.[a-z]+$/i.test(p) && !p.endsWith("/")) p += "/";
      return p;
    } catch (e) {
      return href;
    }
  }

  /* ---------- 3. Header scroll state ---------- */
  function initHeaderScrollState() {
    var header = document.querySelector(".bmg-header");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
