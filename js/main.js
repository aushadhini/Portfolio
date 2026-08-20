/* ═══════════════════════════════════════════════════════════════
   Niragi Kodagoda — Portfolio
   Nav state · theme · mobile menu · reveal · filters · form
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    /* ── THEME TOGGLE ─────────────────────────────────────── */
    var themeBtn = document.getElementById('themeBtn');
    var root = document.documentElement;

    function syncThemeButton() {
      if (!themeBtn) return;
      var isDark = root.getAttribute('data-theme') === 'dark';
      themeBtn.innerHTML = isDark
        ? '<i class="fas fa-sun" aria-hidden="true"></i>'
        : '<i class="fas fa-moon" aria-hidden="true"></i>';
      themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    syncThemeButton();

    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('nk-theme', next);
        syncThemeButton();
      });
    }

    /* Follow the OS theme only while the visitor has no explicit preference */
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (localStorage.getItem('nk-theme')) return;
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      syncThemeButton();
    });

    /* ── NAV: SHRINK ON SCROLL ────────────────────────────── */
    var nav = document.getElementById('nav');
    if (nav) {
      var onScrollNav = function () {
        nav.classList.toggle('is-scrolled', window.scrollY > 24);
      };
      onScrollNav();
      window.addEventListener('scroll', onScrollNav, { passive: true });
    }

    /* ── MOBILE MENU ──────────────────────────────────────── */
    var burger = document.getElementById('burger');
    var navMenu = document.getElementById('navMenu');

    function closeMenu() {
      if (!navMenu || !burger) return;
      navMenu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      burger.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    }

    if (burger && navMenu) {
      burger.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(isOpen));
        burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        burger.innerHTML = isOpen
          ? '<i class="fas fa-xmark" aria-hidden="true"></i>'
          : '<i class="fas fa-bars" aria-hidden="true"></i>';
      });

      navMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
      });

      /* Clicking outside the open panel dismisses it */
      document.addEventListener('click', function (e) {
        if (!navMenu.classList.contains('is-open')) return;
        if (navMenu.contains(e.target) || burger.contains(e.target)) return;
        closeMenu();
      });
    }

    /* ── ACTIVE SECTION IN NAV ────────────────────────────── */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a[href^="#"]'));
    var sections = navLinks
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if (sections.length) {
      var setActive = function () {
        var probe = window.scrollY + window.innerHeight * 0.3;
        var currentId = sections[0].id;

        sections.forEach(function (s) {
          if (s.offsetTop <= probe) currentId = s.id;
        });

        /* At the very bottom, favour the last section so Contact can highlight */
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
          currentId = sections[sections.length - 1].id;
        }

        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + currentId);
        });
      };

      setActive();
      window.addEventListener('scroll', setActive, { passive: true });
      window.addEventListener('resize', setActive);
    }

    /* ── SCROLL REVEAL ────────────────────────────────────── */
    /* Added only here, so a failed/erroring main.js leaves content visible
       instead of stranding every section at opacity 0. */
    document.documentElement.classList.add('js');

    var revealTargets = document.querySelectorAll('.reveal, .reveal-group');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealTargets.forEach(function (el) { observer.observe(el); });
    }

    /* ── PROJECT FILTERS ──────────────────────────────────── */
    var filters = document.querySelectorAll('.filter');
    var projects = Array.prototype.slice.call(document.querySelectorAll('.proj'));
    var projEmpty = document.getElementById('projEmpty');

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tag = btn.dataset.filter;

        filters.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });

        var shown = 0;
        projects.forEach(function (card) {
          var tags = (card.dataset.tags || '').split(/\s+/);
          var match = tag === 'all' || tags.indexOf(tag) !== -1;
          /* hidden removes the card from layout entirely — no ghost cards */
          card.hidden = !match;
          if (match) shown++;
        });

        if (projEmpty) projEmpty.hidden = shown > 0;
      });
    });

    /* ── BACK TO TOP ──────────────────────────────────────── */
    var toTop = document.getElementById('toTop');
    if (toTop) {
      window.addEventListener('scroll', function () {
        toTop.classList.toggle('is-visible', window.scrollY > 600);
      }, { passive: true });

      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    }

    /* ── CONTACT FORM (Formspree) ─────────────────────────── */
    var form = document.getElementById('contactForm');
    var status = document.getElementById('cfStatus');
    var submitBtn = document.getElementById('cfSubmit');

    function setStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.classList.remove('is-ok', 'is-err');
      status.classList.add(kind === 'ok' ? 'is-ok' : 'is-err');
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var action = form.getAttribute('action') || '';

        /* Fail loudly rather than pretending the message was delivered */
        if (action.indexOf('YOUR_FORM_ID') !== -1) {
          setStatus(
            'This form is not connected yet. Please email niragiaushadhini@gmail.com directly.',
            'err'
          );
          return;
        }

        var original = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i> Sending…';
        }

        fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Request failed with status ' + res.status);
            form.reset();
            setStatus('Thanks — your message is on its way. I usually reply within 24 hours.', 'ok');
          })
          .catch(function () {
            setStatus(
              'Something went wrong sending that. Please email niragiaushadhini@gmail.com instead.',
              'err'
            );
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = original;
            }
          });
      });
    }

    /* ── FOOTER YEAR ──────────────────────────────────────── */
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

  });
})();
