/* ============================================================
   NIRAGI KODAGODA — PORTFOLIO JS
   ============================================================ */

(function () {

  /* ── HELPERS ─────────────────────────────────────────────── */
  function getOverlay() { return document.getElementById('transition-overlay'); }

  /* ── PAGE ENTER ANIMATION ────────────────────────────────── */
  function playEnter() {
    const ov = getOverlay();
    if (!ov) return;
    ov.className = '';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ov.classList.add('entering');
        ov.style.pointerEvents = 'none';
      });
    });
  }

  /* ── PAGE LEAVE ANIMATION ────────────────────────────────── */
  function playLeave(href) {
    const ov = getOverlay();
    if (!ov) { window.location.href = href; return; }
    ov.style.pointerEvents = 'all';
    ov.className = '';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ov.classList.add('leaving');
        setTimeout(() => { window.location.href = href; }, 620);
      });
    });
  }

  /* ── DOM READY ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {

    playEnter();

    /* ── NAV SCROLL STATE ────────────────────────────────── */
    const navbar = document.querySelector('nav');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      }, { passive: true });
    }

    /* ── ACTIVE NAV LINK ─────────────────────────────────── */
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const linkFile = href.split('/').pop().split('?')[0];
      const isHome = (currentFile === '' || currentFile === 'index.html') && (href === '#home' || linkFile === 'index.html');
      if (linkFile === currentFile || isHome) a.classList.add('active');
    });

    if (currentFile === 'index.html' || currentFile === '') {
      const sections = ['home','about','skills','services','projects','certs','contact'];
      window.addEventListener('scroll', () => {
        let current = 'home';
        sections.forEach(id => {
          const s = document.getElementById(id);
          if (s && window.scrollY >= s.offsetTop - 200) current = id;
        });
        document.querySelectorAll('.nav-links a').forEach(a => {
          const href = a.getAttribute('href') || '';
          a.classList.toggle('active', href === '#' + current);
        });
      }, { passive: true });
    }

    /* ── MOBILE MENU ─────────────────────────────────────── */
    const menuBtn  = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuBtn.innerHTML = navLinks.classList.contains('open')
          ? '<i class="fas fa-times"></i>'
          : '<i class="fas fa-bars"></i>';
      });
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          navLinks.classList.remove('open');
          menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
      });
    }

    /* ── THEME TOGGLE ────────────────────────────────────── */
    const themeBtn = document.getElementById('themeBtn');
    const savedTheme = localStorage.getItem('nk-theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('nk-theme', isDark ? 'dark' : 'light');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      });
    }

    /* ── INTERCEPT INTERNAL NAV LINKS ────────────────────── */
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('mailto') ||
          href.startsWith('http') || href.startsWith('tel') ||
          link.target === '_blank') return;
      try {
        const resolvedHref    = new URL(href, window.location.href).pathname;
        const resolvedCurrent = window.location.pathname;
        const norm = p => p.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
        if (norm(resolvedHref) === norm(resolvedCurrent)) return;
      } catch(e) { return; }
      link.addEventListener('click', e => {
        e.preventDefault();
        playLeave(href);
      });
    });

    /* ── SMOOTH SCROLL for hash links ────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    });

    /* ── TYPING ANIMATION ────────────────────────────────── */
    const typedEl = document.getElementById('typed');
    if (typedEl) {
      const words = ['Frontend Developer & UI/UX Designer','Creative Coder','Problem Solver','React Developer'];
      let wi = 0, ci = 0, del = false;
      function tick() {
        const w = words[wi];
        typedEl.textContent = del ? w.slice(0, ci--) : w.slice(0, ci++);
        let d = del ? 35 : 75;
        if (!del && ci === w.length + 1) { d = 2400; del = true; }
        else if (del && ci < 0) { del = false; wi = (wi + 1) % words.length; ci = 0; d = 300; }
        setTimeout(tick, d);
      }
      tick();
    }

    /* ── SCROLL REVEAL ───────────────────────────────────── */
    const ro = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-stagger').forEach(el => ro.observe(el));

    /* ── SKILL BARS ──────────────────────────────────────── */
    const barObs = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.bar-fill, .prof-bar-fill').forEach(f => {
            f.style.width = (f.dataset.pct || 0) + '%';
          });
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('#skillBars, .skill-bars, #profBars, .prof-grid').forEach(el => barObs.observe(el));

    /* ── PROJECT FILTER ──────────────────────────────────── */
    document.querySelectorAll('.f-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tag = btn.dataset.tag;
        document.querySelectorAll('.proj-card').forEach(c => {
          const tags = (c.dataset.tags || '').toLowerCase();
          const show = tag === 'all' || tags.includes(tag.toLowerCase());
          c.style.opacity       = show ? '1' : '0.12';
          c.style.transform     = show ? '' : 'scale(0.96)';
          c.style.pointerEvents = show ? '' : 'none';
          c.style.transition    = 'opacity 0.3s, transform 0.3s';
        });
      });
    });

    /* ── HORIZONTAL DRAG SCROLL ──────────────────────────── */
    document.querySelectorAll('.proj-grid').forEach(grid => {
      let isDown = false, startX, scrollLeft;

      grid.addEventListener('mousedown', e => {
        isDown = true;
        grid.classList.add('active');
        startX = e.pageX - grid.offsetLeft;
        scrollLeft = grid.scrollLeft;
      });
      grid.addEventListener('mouseleave', () => { isDown = false; grid.classList.remove('active'); });
      grid.addEventListener('mouseup',    () => { isDown = false; grid.classList.remove('active'); });
      grid.addEventListener('mousemove',  e => {
        if (!isDown) return;
        e.preventDefault();
        const x    = e.pageX - grid.offsetLeft;
        const walk = (x - startX) * 1.5;
        grid.scrollLeft = scrollLeft - walk;
      });
    });

    /* ── PROJ NAV BUTTONS ────────────────────────────────── */
    document.querySelectorAll('.proj-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // find nearest proj-grid — check inside same section/wrapper first
        const wrapper = btn.closest('.proj-nav')?.nextElementSibling;
        const grid = wrapper?.querySelector('.proj-grid')
                  || btn.closest('section, .section, div')?.querySelector('.proj-grid')
                  || document.querySelector('.proj-grid');
        if (!grid) return;
        const dir = btn.dataset.dir;
        const cardWidth = grid.querySelector('.proj-card')?.offsetWidth || 340;
        const gap = 24; // 1.5rem
        grid.scrollBy({ left: dir === 'next' ? (cardWidth + gap) : -(cardWidth + gap), behavior: 'smooth' });
      });
    });



    /* ── UPDATE NAV ARROW STATES ─────────────────────────── */
    document.querySelectorAll('.proj-grid').forEach(grid => {
      const navEl = grid.closest('section, .section, div')?.querySelector('.proj-nav');
      if (!navEl) return;
      const prevBtn = navEl.querySelector('[data-dir="prev"]');
      const nextBtn = navEl.querySelector('[data-dir="next"]');

      function updateBtns() {
        if (prevBtn) prevBtn.disabled = grid.scrollLeft <= 0;
        if (nextBtn) nextBtn.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 2;
      }

      grid.addEventListener('scroll', updateBtns, { passive: true });
      setTimeout(updateBtns, 300);
    });

    /* ── BACK TO TOP ─────────────────────────────────────── */
    const btt = document.getElementById('btt');
    if (btt) {
      window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 500), { passive: true });
      btt.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ── CONTACT FORM ────────────────────────────────────── */
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn  = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#6366f1,#22c55e)';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3500);
      });
    }

    /* ── CV DOWNLOAD ─────────────────────────────────────── */
    document.querySelectorAll('.cv-download-btn').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        window.open('assets/cv/NiragiKodagoda_CV.pdf', '_blank');
      });
    });

  }); // DOMContentLoaded

})();
  /* ── DOM READY ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {

    playEnter();

    /* ── CURSOR ──────────────────────────────────────────── */
     /* ── const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
    });

    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a,button,.chip,.proj-card,.glass-card,.cert-card,.info-chip,.soc,.f-btn,.aq-stat,.foot-soc').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    /* ── NAV SCROLL STATE ────────────────────────────────── */
    const navbar = document.querySelector('nav');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      }, { passive: true });
    }

    /* ── ACTIVE NAV LINK ─────────────────────────────────── */
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const linkFile = href.split('/').pop().split('?')[0];
      const isHome = (currentFile === '' || currentFile === 'index.html') && (href === '#home' || linkFile === 'index.html');
      if (linkFile === currentFile || isHome) a.classList.add('active');
    });

    if (currentFile === 'index.html' || currentFile === '') {
      const sections = ['home','about','skills','projects','certs','contact'];
      window.addEventListener('scroll', () => {
        let current = 'home';
        sections.forEach(id => {
          const s = document.getElementById(id);
          if (s && window.scrollY >= s.offsetTop - 200) current = id;
        });
        document.querySelectorAll('.nav-links a').forEach(a => {
          const href = a.getAttribute('href') || '';
          a.classList.toggle('active', href === '#' + current);
        });
      }, { passive: true });
    }

    /* ── MOBILE MENU ─────────────────────────────────────── */
    const menuBtn  = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuBtn.innerHTML = navLinks.classList.contains('open')
          ? '<i class="fas fa-times"></i>'
          : '<i class="fas fa-bars"></i>';
      });
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          navLinks.classList.remove('open');
          menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
      });
    }

    /* ── THEME TOGGLE ────────────────────────────────────── */
    const themeBtn = document.getElementById('themeBtn');
    const savedTheme = localStorage.getItem('nk-theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light');
      if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        localStorage.setItem('nk-theme', isLight ? 'light' : 'dark');
        themeBtn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
      });
    }

    /* ── INTERCEPT INTERNAL NAV LINKS ────────────────────── */
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('mailto') ||
          href.startsWith('http') || href.startsWith('tel') ||
          link.target === '_blank') return;
      try {
        const resolvedHref    = new URL(href, window.location.href).pathname;
        const resolvedCurrent = window.location.pathname;
        const norm = p => p.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
        if (norm(resolvedHref) === norm(resolvedCurrent)) return;
      } catch(e) { return; }
      link.addEventListener('click', e => {
        e.preventDefault();
        playLeave(href);
      });
    });

    /* ── SMOOTH SCROLL for hash links ────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    });

    /* ── TYPING ANIMATION ────────────────────────────────── */
    const typedEl = document.getElementById('typed');
    if (typedEl) {
      const words = ['Frontend Developer & UI/UX Designer','Creative Coder','Problem Solver','React Developer'];
      let wi = 0, ci = 0, del = false;
      function tick() {
        const w = words[wi];
        typedEl.textContent = del ? w.slice(0, ci--) : w.slice(0, ci++);
        let d = del ? 35 : 75;
        if (!del && ci === w.length + 1) { d = 2400; del = true; }
        else if (del && ci < 0) { del = false; wi = (wi + 1) % words.length; ci = 0; d = 300; }
        setTimeout(tick, d);
      }
      tick();
    }

    /* ── SCROLL REVEAL ───────────────────────────────────── */
    const ro = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-stagger').forEach(el => ro.observe(el));

    /* ── SKILL BARS ──────────────────────────────────────── */
    const barObs = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.bar-fill, .pro-bar-fill').forEach(f => {
            f.style.width = (f.dataset.pct || 0) + '%';
          });
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('#skillBars, .skill-bars, .pro-bars').forEach(el => barObs.observe(el));

    /* ── PROJECT FILTER ──────────────────────────────────── */
    document.querySelectorAll('.f-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tag = btn.dataset.tag;
        document.querySelectorAll('.proj-card').forEach(c => {
          const tags = (c.dataset.tags || '').toLowerCase();
          const show = tag === 'all' || tags.includes(tag.toLowerCase());
          c.style.opacity      = show ? '1' : '0.12';
          c.style.transform    = show ? '' : 'scale(0.96)';
          c.style.pointerEvents= show ? '' : 'none';
          c.style.transition   = 'opacity 0.3s, transform 0.3s';
        });
      });
    });

    /* ── BACK TO TOP ─────────────────────────────────────── */
    const btt = document.getElementById('btt');
    if (btt) {
      window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 500), { passive: true });
      btt.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ── CONTACT FORM ────────────────────────────────────── */
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#5e8b6e,#3d9b8a)';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3500);
      });
    }

    /* ── CV DOWNLOAD ─────────────────────────────────────── */
    document.querySelectorAll('.cv-download-btn').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        window.open('assets/cv/NiragiKodagoda_CV.pdf', '_blank');
      });
    });

  }); // DOMContentLoaded

})();
