// Portfolio — vanilla JS. No dependencies.
// Behavior:
//   1. Footer year.
//   2. Mobile menu toggle (hamburger).
//   3. Auto-close the mobile menu when a nav link is clicked.
//   4. Header border on scroll (subtle).
//   5. Reveal-on-scroll: add .is-visible to .reveal elements as they enter.
//   6. Scroll-spy: highlight the nav link of the section currently in view.

(() => {
  "use strict";

  // --- Footer year --------------------------------------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // --- Mobile menu toggle ------------------------------------------------
  const body = document.body;
  const toggle = document.getElementById("navToggle");
  const header = document.getElementById("siteHeader");

  const setNavOpen = (open) => {
    body.classList.toggle("nav-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      setNavOpen(!body.classList.contains("nav-open"));
    });
  }

  // --- Close menu on link click (mobile) --------------------------------
  document.querySelectorAll(".site-nav a[data-nav]").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  // --- Header border on scroll ------------------------------------------
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // --- Reveal on scroll --------------------------------------------------
  // Any .reveal element gets .is-visible the first time it intersects.
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // No IO support — show everything immediately.
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // --- Scroll-spy --------------------------------------------------------
  const navLinks = Array.from(
    document.querySelectorAll(".site-nav a[data-nav]")
  );
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      const el = document.querySelector(id);
      return el ? { id, el, link } : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === id);
      });
    };

    const visibility = new Map();

    const spyObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = null;
        let bestRatio = 0;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActive(`#${bestId}`);
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach(({ el }) => spyObserver.observe(el));
  }

  // --- Carousel: cycle images inside .entry-figure--carousel -------------
  const carousels = document.querySelectorAll(".entry-figure--carousel");
  carousels.forEach((fig) => {
    const imgs = fig.querySelectorAll(".entry-figure-img");
    if (imgs.length < 2) return;
    let i = 0;
    setInterval(() => {
      imgs[i].classList.remove("is-active");
      i = (i + 1) % imgs.length;
      imgs[i].classList.add("is-active");
    }, 3000);
  });
})();
