/* ============================================
   Druscilla Kalonga Portfolio — Interactions
   ============================================ */

(() => {
  "use strict";

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const navBackdrop = document.getElementById("nav-backdrop");
  const links = document.querySelectorAll(".nav__link");
  const backToTop = document.getElementById("back-to-top");
  const yearEl = document.getElementById("year");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Navigation ---------- */
  function setMenuOpen(open) {
    navToggle?.classList.toggle("is-open", open);
    navLinks?.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    navToggle?.setAttribute("aria-expanded", String(open));
    navToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    if (navBackdrop) {
      if (open) {
        navBackdrop.hidden = false;
        requestAnimationFrame(() => navBackdrop.classList.add("is-visible"));
      } else {
        navBackdrop.classList.remove("is-visible");
        setTimeout(() => {
          navBackdrop.hidden = true;
        }, 280);
      }
    }
  }

  navToggle?.addEventListener("click", () => {
    setMenuOpen(!navLinks?.classList.contains("is-open"));
  });

  navBackdrop?.addEventListener("click", () => setMenuOpen(false));

  links.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav?.classList.toggle("is-scrolled", y > 24);
      backToTop?.classList.toggle("is-visible", y > 480);
      highlightSection();
      scrollTicking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Active section ---------- */
  const sections = document.querySelectorAll("section[id]");

  function highlightSection() {
    const offset = window.scrollY + 120;
    let current = "";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (offset >= top && offset < top + height) {
        current = section.id;
      }
    });

    links.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === `#${current}`);
    });
  }

  /* ---------- Typed text ---------- */
  const typedEl = document.getElementById("typed-text");
  const phrases = [
    "Excel Specialist",
    "Dashboard Builder",
    "Data Enthusiast",
  ];

  function runTyping() {
    if (!typedEl || reduceMotion) {
      if (typedEl) typedEl.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const phrase = phrases[phraseIndex];

      if (!deleting) {
        typedEl.textContent = phrase.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === phrase.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 70);
      } else {
        typedEl.textContent = phrase.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 36);
      }
    }

    tick();
  }

  runTyping();

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  initReveal();

  /* ---------- Counters ---------- */
  function animateCount(el) {
    const target = Number(el.dataset.target || 0);
    if (!target) return;

    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }

    const duration = 1100;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function initCounters() {
    const counters = document.querySelectorAll(".js-count");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  initCounters();

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const submitBtn = document.getElementById("submit-btn");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    formMessage.className = "form-message";
    formMessage.textContent = "";

    if (!name || !email || !subject || !message) {
      formMessage.classList.add("is-error");
      formMessage.textContent = "Please fill in all fields.";
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formMessage.classList.add("is-error");
      formMessage.textContent = "Please enter a valid email address.";
      return;
    }

    submitBtn?.classList.add("is-loading");
    const label = submitBtn?.querySelector(".btn__label");
    if (label) label.textContent = "Sending…";

    // Mailto fallback — replace with your backend endpoint when ready
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    const mailto = `mailto:sunday@topintanzania.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    setTimeout(() => {
      window.location.href = mailto;
      submitBtn?.classList.remove("is-loading");
      if (label) label.textContent = "Send message";
      formMessage.classList.add("is-success");
      formMessage.textContent = "Opening your email client…";
      form.reset();
    }, 600);
  });
})();
