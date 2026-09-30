/* ============================================================
   BMG Website V2 - app.js
   Global behaviors shared by every page:
     - Auto-update footer year.
     - Smooth in-page anchor scrolling (respecting sticky header).
     - Contact form validation stub (no backend yet).
     - Reveal-on-scroll animation for [data-reveal] elements.
   Loaded with `defer` on every page, after navigation.js.
   ============================================================ */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    updateFooterYear();
    initContactForm();
    initRevealOnScroll();
  });

  /* ---------- Footer year ---------- */
  function updateFooterYear() {
    var nodes = document.querySelectorAll("[data-year]");
    var year = String(new Date().getFullYear());
    nodes.forEach(function (node) {
      node.textContent = year;
    });
  }

  /* ---------- Contact form (client-side validation only) ---------- */
  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        // Let the browser surface its native validation messages.
        form.reportValidity();
        return;
      }

      var status = form.querySelector("[data-form-status]");
      // TODO: POST to /contact/ handler or API endpoint once backend exists.
      if (status) {
        status.textContent =
          "Thank you! Your message has been received. We will reply within 1–2 business days.";
        status.classList.remove("u-text-muted");
        status.classList.add("u-text-primary", "u-fw-bold");
      }
      form.reset();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initRevealOnScroll() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    var supportsIO = "IntersectionObserver" in window;
    if (!supportsIO) {
      items.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    var style = document.createElement("style");
    style.textContent =
      "[data-reveal]{opacity:0;transform:translateY(14px);" +
      "transition:opacity .5s ease,transform .5s ease}" +
      "[data-reveal].is-revealed{opacity:1;transform:none}" +
      "@media (prefers-reduced-motion:reduce){" +
      "[data-reveal]{opacity:1;transform:none;transition:none}}";
    document.head.appendChild(style);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
