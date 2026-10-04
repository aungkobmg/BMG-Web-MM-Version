/* ============================================================
   BMG Website V2 - app.js
   Global behaviors shared by every page:
     - Auto-update footer year.
     - Contact form: validates, then opens the visitor's email app
       (mailto fallback). No backend exists, so it never claims the
       message was sent.
     - Reveal-on-scroll for [data-reveal] elements (styles in
       components.css; content stays visible if JS is unavailable).
   Loaded with `defer` on every page, after navigation.js.
   Every function is a no-op when its elements are absent.
   ============================================================ */
(function () {
  "use strict";

  const CONTACT_EMAIL = "hello@bmg.com.mm";

  const ready = (fn) => {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  };

  ready(() => {
    updateFooterYear();
    initContactForm();
    initRevealOnScroll();
  });

  /* ---------- Footer year ---------- */
  function updateFooterYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((node) => {
      node.textContent = year;
    });
  }

  /* ---------- Contact form (mailto fallback) ---------- */
  function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    const status = form.querySelector("[data-form-status]");
    const setStatus = (message, tone) => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("u-text-muted", tone === "info");
      status.classList.toggle("bmg-form__status--error", tone === "error");
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        setStatus("Please complete the required fields.", "error");
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const subject = `Website enquiry: ${data.get("topic") || "General"}`;
      const body = [
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        "",
        data.get("message"),
      ].join("\n");

      setStatus(
        `Online sending is not set up yet. Your email app should open with a draft addressed to ${CONTACT_EMAIL}; if it does not, please email us directly.`,
        "info"
      );
      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initRevealOnScroll() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return; // stay visible

    // The hidden initial state only applies once JS has confirmed it can reveal.
    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el) => observer.observe(el));
  }
})();
