/* =========================================================
   Fabrizio Waldner — site interactions
   vanilla JS, no dependencies
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".section, .card, .stat");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
            requestAnimationFrame(() => entry.target.classList.add("is-visible"));
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Stat count-up ---------- */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target.toLocaleString("en-US");
    }
    requestAnimationFrame(frame);
  }

  const statEls = document.querySelectorAll(".stat__value");
  if ("IntersectionObserver" in window && statEls.length) {
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            so.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statEls.forEach((el) => so.observe(el));
  }

  /* ---------- Hyperscale vs Edge toggle ---------- */
  const tabs = document.querySelectorAll(".compare__tab");
  const panes = document.querySelectorAll(".compare__pane");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const pane = tab.dataset.pane;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panes.forEach((p) => {
        const show = p.id === "pane-" + pane;
        p.hidden = !show;
        p.classList.toggle("is-active", show);
      });
    });
  });

  /* ---------- Timeline accordion ---------- */
  const timelineItems = document.querySelectorAll(".timeline__item");
  timelineItems.forEach((item) => {
    const head = item.querySelector(".timeline__head");
    head.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      timelineItems.forEach((i) => {
        i.classList.remove("is-open");
        i.querySelector(".timeline__head").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Publication filtering ---------- */
  const filters = document.querySelectorAll("#pub-filters .filter");
  const pubs = document.querySelectorAll("#pub-list .pub");
  filters.forEach((f) => {
    f.addEventListener("click", () => {
      filters.forEach((x) => {
        x.classList.toggle("is-active", x === f);
        x.setAttribute("aria-selected", String(x === f));
      });
      const cat = f.dataset.filter;
      pubs.forEach((p) => {
        const match = cat === "all" || p.dataset.cat === cat;
        p.classList.toggle("is-hidden", !match);
      });
    });
  });
})();
