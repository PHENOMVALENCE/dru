/* ============================================
   Portfolio Interactions — refined motion
   ============================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const navBackdrop = document.getElementById("nav-backdrop");
  const links = document.querySelectorAll(".nav__link");
  const backToTop = document.getElementById("back-to-top");
  const progress = document.getElementById("progress");
  const floatCta = document.getElementById("float-cta");
  const yearEl = document.getElementById("year");

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
  links.forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      nav?.classList.toggle("is-scrolled", y > 24);
      backToTop?.classList.toggle("is-visible", y > 480);
      floatCta?.classList.toggle("is-visible", y > 700 && y < docH - 400);
      if (progress && docH > 0) {
        progress.style.width = `${Math.min(100, (y / docH) * 100)}%`;
      }
      highlightSection();
      scrollTicking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  const sections = document.querySelectorAll("section[id]");
  function highlightSection() {
    const offset = window.scrollY + 120;
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (offset >= top && offset < top + height) current = section.id;
    });
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  }

  /* ---------- Typed text ---------- */
  const typedEl = document.getElementById("typed-text");
  const phrases = ["Excel Specialist", "Dashboard Builder", "Data Enthusiast"];

  function runTyping() {
    if (!typedEl) return;
    if (reduceMotion) {
      typedEl.textContent = phrases[0];
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
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  initReveal();

  /* ---------- Counters ---------- */
  function animateCount(el) {
    const target = Number(el.dataset.target || 0);
    if (!target && target !== 0) return;

    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }

    const duration = 1200;
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
      { threshold: 0.45 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  initCounters();

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (reduceMotion || !finePointer) return;

    document.querySelectorAll(".js-magnetic").forEach((btn) => {
      const strength = 0.28;
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.setProperty("--mx", `${x * strength}px`);
        btn.style.setProperty("--my", `${y * strength}px`);
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.setProperty("--mx", "0px");
        btn.style.setProperty("--my", "0px");
      });
    });

    document.querySelectorAll(".js-magnetic-soft").forEach((card) => {
      const strength = 0.12;
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `translate(${x * strength}px, ${y * strength - 4}px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  initMagnetic();

  /* ---------- Tilt / mouse tracking ---------- */
  function initTilt() {
    if (reduceMotion || !finePointer) return;

    document.querySelectorAll(".js-tilt").forEach((el) => {
      const max = Number(el.dataset.tiltMax || 8);

      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * max;
        const ry = (px - 0.5) * max;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });

      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  initTilt();

  /* ---------- Soft parallax orbs ---------- */
  function initParallax() {
    if (reduceMotion || !finePointer) return;

    const orbs = document.querySelectorAll(".hero__bg-orb, .hero__accent");
    if (!orbs.length) return;

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;

    window.addEventListener(
      "pointermove",
      (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );

    function loop() {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      orbs.forEach((orb, i) => {
        const depth = (i % 2 === 0 ? 12 : 8) + i * 2;
        orb.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
      });
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  initParallax();
})();
