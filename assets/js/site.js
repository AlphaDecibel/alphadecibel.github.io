/* ═══════════════════════════════════════════════════════════════════
   OVERTONE by AlphaDecibel — site behaviour
   No dependencies. Every animation is gated on prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── Nav: shrink-on-scroll + mobile drawer ─────────────────────── */
  function nav() {
    var bar = $('.nav');
    if (!bar) return;

    var onScroll = function () {
      bar.classList.toggle('stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var burger = $('.burger');
    var menu = $('.mobile-menu');
    if (!burger || !menu) return;

    var setOpen = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1000) setOpen(false);
    });
  }

  /* ── Scroll reveals ────────────────────────────────────────────── */
  function reveals() {
    var items = $$('[data-reveal]');
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ── Animated counters ─────────────────────────────────────────── */
  function counters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;

    var render = function (el, val) {
      var dec = parseInt(el.dataset.dec || '0', 10);
      var txt = dec ? val.toFixed(dec) : Math.round(val).toLocaleString('en-US');
      el.textContent = (el.dataset.pre || '') + txt + (el.dataset.suf || '');
    };

    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { render(el, parseFloat(el.dataset.count)); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var target = parseFloat(el.dataset.count);
        var dur = 1500;
        var t0 = performance.now();
        var tick = function (now) {
          var p = Math.min((now - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);           // easeOutCubic
          render(el, target * e);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (el) { io.observe(el); });
  }

  /* ── Bars / meters that fill when scrolled into view ───────────── */
  function fillBars() {
    var nodes = $$('[data-fill]');
    if (!nodes.length) return;

    var apply = function (el) { el.style.width = el.dataset.fill + '%'; };

    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(apply);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        setTimeout(function () { apply(el); }, parseInt(el.dataset.delay || '0', 10));
      });
    }, { threshold: 0.25 });
    nodes.forEach(function (el) { io.observe(el); });
  }

  /* ── Chart bars fill by height ─────────────────────────────────── */
  function fillHeights() {
    var nodes = $$('[data-h]');
    if (!nodes.length) return;
    var apply = function (el) { el.style.height = el.dataset.h + '%'; };
    if (reduced || !('IntersectionObserver' in window)) { nodes.forEach(apply); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        setTimeout(function () { apply(el); }, parseInt(el.dataset.delay || '0', 10));
      });
    }, { threshold: 0.3 });
    nodes.forEach(function (el) { io.observe(el); });
  }

  /* ── Generic tab groups (role dashboards, industries) ──────────── */
  function tabs() {
    $$('[data-tabs]').forEach(function (group) {
      var btns  = $$('[role="tab"]', group);
      var panes = $$('[role="tabpanel"]', group);
      if (!btns.length) return;

      var select = function (idx) {
        btns.forEach(function (b, i) {
          b.setAttribute('aria-selected', String(i === idx));
          b.tabIndex = i === idx ? 0 : -1;
        });
        panes.forEach(function (p, i) { p.classList.toggle('on', i === idx); });
        // re-run bar fills inside the newly shown pane
        $$('[data-fill]', panes[idx]).forEach(function (el) {
          el.style.width = '0%';
          setTimeout(function () { el.style.width = el.dataset.fill + '%'; }, 40);
        });
      };

      btns.forEach(function (b, i) {
        b.addEventListener('click', function () { select(i); });
        b.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var next = (i + d + btns.length) % btns.length;
          btns[next].focus();
          select(next);
        });
      });
      select(0);
    });
  }

  /* ── Pipeline: scroll-linked stepper with click override ───────── */
  function pipeline() {
    var wrap = $('[data-pipeline]');
    if (!wrap) return;
    var steps = $$('.pstep', wrap);
    var panes = $$('.pv-pane', wrap);
    if (!steps.length) return;

    var manual = false;
    var timer = null;

    var show = function (i) {
      steps.forEach(function (s, n) { s.classList.toggle('on', n === i); });
      panes.forEach(function (p, n) { p.classList.toggle('on', n === i); });
      $$('[data-fill]', panes[i]).forEach(function (el) {
        el.style.width = '0%';
        setTimeout(function () { el.style.width = el.dataset.fill + '%'; }, 60);
      });
    };

    steps.forEach(function (s, i) {
      s.addEventListener('click', function () {
        manual = true;
        clearTimeout(timer);
        timer = setTimeout(function () { manual = false; }, 9000);
        show(i);
      });
    });

    show(0);
    if (reduced) return;

    // Auto-advance while the section is on screen and untouched
    var visible = false;
    var idx = 0;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
      }, { threshold: 0.35 }).observe(wrap);
    }
    setInterval(function () {
      if (!visible || manual || document.hidden) return;
      idx = (idx + 1) % steps.length;
      show(idx);
    }, 3800);
  }

  /* ── Hero: waveform canvas ─────────────────────────────────────── */
  function waveform() {
    var cv = document.getElementById('waveform');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;

    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var BARS = 96;
    var vals = new Array(BARS).fill(0);
    var seedT = 0;

    var size = function () {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener('resize', size);

    // Pseudo speech envelope: layered sines + syllable gating, deterministic-ish
    var envelope = function (i, t) {
      var x = i / BARS;
      var syll = Math.sin(x * 34 + t * 2.1) * 0.5 + 0.5;
      var word = Math.sin(x * 7.3 - t * 0.9) * 0.5 + 0.5;
      var breath = Math.sin(x * 2.1 + t * 0.42) * 0.5 + 0.5;
      var gate = word > 0.24 ? 1 : 0.12;                       // pauses between words
      var v = (syll * 0.55 + breath * 0.45) * gate * (0.35 + word * 0.75);
      return Math.max(0.04, Math.min(1, v));
    };

    var draw = function (t) {
      ctx.clearRect(0, 0, W, H);
      var mid = H / 2;
      var bw = W / BARS;
      var speaker = Math.floor(t * 0.28) % 2;                  // alternate agent / customer

      for (var i = 0; i < BARS; i++) {
        var target = envelope(i, t);
        vals[i] += (target - vals[i]) * 0.22;
        var h = vals[i] * (H * 0.42);
        var x = i * bw + bw * 0.5;
        var isAgent = ((i / BARS) + t * 0.06) % 1 < 0.5 ? speaker === 0 : speaker === 1;
        var col = isAgent ? '77,225,224' : '123,92,255';
        var alpha = 0.35 + vals[i] * 0.6;

        ctx.strokeStyle = 'rgba(' + col + ',' + alpha.toFixed(3) + ')';
        ctx.lineWidth = Math.max(1.2, bw * 0.42);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, mid - h);
        ctx.lineTo(x, mid + h);
        ctx.stroke();
      }

      // centre baseline
      ctx.strokeStyle = 'rgba(255,255,255,.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(W, mid);
      ctx.stroke();

      // playhead sweep
      var px = ((t * 0.16) % 1) * W;
      var g = ctx.createLinearGradient(px - 40, 0, px, 0);
      g.addColorStop(0, 'rgba(77,225,224,0)');
      g.addColorStop(1, 'rgba(77,225,224,.55)');
      ctx.fillStyle = g;
      ctx.fillRect(px - 40, 0, 40, H);
      ctx.fillStyle = 'rgba(77,225,224,.9)';
      ctx.fillRect(px - 1, 0, 1.5, H);
    };

    if (reduced) {
      // one static frame — still reads as a waveform, no motion
      draw(1.4);
      return;
    }

    var t0 = performance.now();
    var loop = function (now) {
      draw((now - t0) / 1000);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ── Hero: live transcript + score simulation ──────────────────── */
  function transcript() {
    var box = $('#tscript');
    if (!box) return;

    var lines = [
      { who: 'Agent',    cls: 'agent', ts: '00:04', txt: 'Thanks for holding — I have your policy up now. Let me confirm the vehicle first.' },
      { who: 'Customer', cls: 'cust',  ts: '00:11', txt: "It's the 2022 Outback. Honestly I'm just tired of the premium going up every year." },
      { who: 'Agent',    cls: 'agent', ts: '00:18', txt: "That's fair, and I hear the frustration. Let me look at what's actually driving it." },
      { who: 'Customer', cls: 'cust',  ts: '00:26', txt: 'If it keeps climbing I might just shop around, to be blunt.' },
      { who: 'Agent',    cls: 'agent', ts: '00:31', txt: 'Understood. Before you do — you qualify for two discounts that were never applied.' },
      { who: 'Customer', cls: 'cust',  ts: '00:39', txt: 'Really? Nobody mentioned that. What would that bring it down to?' },
      { who: 'Agent',    cls: 'agent', ts: '00:44', txt: 'About forty-one dollars a month less. I can apply both right now if you like.' },
      { who: 'Customer', cls: 'cust',  ts: '00:52', txt: "Yes — please do. That changes things, I appreciate you catching it." }
    ];

    var scores = [
      { el: '#sc-sent', vals: [62, 48, 55, 34, 58, 71, 79, 88] },
      { el: '#sc-disc', vals: [40, 55, 66, 66, 78, 82, 88, 92] },
      { el: '#sc-emp',  vals: [50, 62, 84, 84, 86, 86, 89, 91] },
      { el: '#sc-risk', vals: [12, 22, 22, 74, 55, 30, 18, 9 ] }
    ];

    var i = 0;

    var setScores = function (step) {
      scores.forEach(function (s) {
        var host = $(s.el);
        if (!host) return;
        var v = s.vals[Math.min(step, s.vals.length - 1)];
        var bar = $('i', host);
        var num = $('.score-v', host);
        if (bar) bar.style.width = v + '%';
        if (num) num.firstChild.nodeValue = String(v);
        if (s.el === '#sc-risk') host.classList.toggle('warn', v >= 50);
        else host.classList.toggle('good', v >= 85);
      });
    };

    var add = function () {
      var l = lines[i % lines.length];
      var el = document.createElement('div');
      el.className = 'tline ' + l.cls;
      el.innerHTML = '<span class="ts">' + l.ts + '</span>' +
        '<span><span class="who">' + l.who + '</span> <span class="txt">' + l.txt + '</span></span>';
      box.appendChild(el);
      while (box.children.length > 7) box.removeChild(box.firstChild);
      box.scrollTop = box.scrollHeight;
      setScores(i % lines.length);
      i++;
    };

    if (reduced) {
      // render the whole conversation at rest, final scores
      lines.slice(0, 4).forEach(function (l) {
        var el = document.createElement('div');
        el.className = 'tline ' + l.cls;
        el.style.animation = 'none';
        el.innerHTML = '<span class="ts">' + l.ts + '</span>' +
          '<span><span class="who">' + l.who + '</span> <span class="txt">' + l.txt + '</span></span>';
        box.appendChild(el);
      });
      setScores(lines.length - 1);
      return;
    }

    add(); add();
    setInterval(function () { if (!document.hidden) add(); }, 2600);
  }

  /* ── Contact form → Formspree ──────────────────────────────────── */
  function contactForm() {
    var form = $('#contact-form');
    if (!form) return;

    var btn = $('button[type="submit"]', form);
    var ok  = $('#form-ok');
    var err = $('#form-err');
    var btnLabel = btn ? btn.querySelector('.btn-label') : null;
    var original = btnLabel ? btnLabel.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var action = form.getAttribute('action') || '';
      ok.classList.remove('show');
      err.classList.remove('show');

      // Honeypot — silently accept and do nothing
      if (form.querySelector('input[name="_gotcha"]').value) return;

      // Endpoint not configured yet: fail loudly rather than silently dropping a lead
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        err.querySelector('.msg').textContent =
          'This form is not connected yet. Add your Formspree endpoint to the form action, or email info@alphadecibel.com directly.';
        err.classList.add('show');
        return;
      }

      if (btn) { btn.setAttribute('aria-busy', 'true'); if (btnLabel) btnLabel.textContent = 'Sending…'; }

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          ok.classList.add('show');
          ok.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        })
        .catch(function () {
          err.querySelector('.msg').textContent =
            'Something went wrong sending that. Please email info@alphadecibel.com and we will pick it up from there.';
          err.classList.add('show');
        })
        .then(function () {
          if (btn) { btn.removeAttribute('aria-busy'); if (btnLabel) btnLabel.textContent = original; }
        });
    });
  }

  /* ── Current-year stamps ───────────────────────────────────────── */
  function year() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ── Boot ──────────────────────────────────────────────────────── */
  function init() {
    nav();
    reveals();
    counters();
    fillBars();
    fillHeights();
    tabs();
    pipeline();
    waveform();
    transcript();
    contactForm();
    year();
    // Analytics hook — drop your snippet here if you add one later.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
