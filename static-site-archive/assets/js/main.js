/* The Yoga School: shared site script (all pages). No frameworks. */

/* Local preview only: when opened straight from disk (file://), point the live-style
   links (/pages/classes) at the matching .html files. On the real server this does nothing. */
(function () {
  if (location.protocol !== 'file:' || !document.currentScript) return;
  var base = document.currentScript.src.replace(/assets\/js\/main\.js.*$/, '');
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="/"]:not([href^="//"])'), function (a) {
    var m = a.getAttribute('href').match(/^\/([^?#]*)([?#].*)?$/);
    var path = m[1] || 'index';
    a.setAttribute('href', base + path + (/\.[a-z0-9]+$/i.test(path) ? '' : '.html') + (m[2] || ''));
  });
})();
(function () {
  'use strict';
  document.body.classList.remove('no-js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Header: solid on scroll, hides on scroll down, progress bar, back-to-top ---------- */
  var header = $('.site-header'), bar = $('.progress span'), toTop = $('.fab__top'), lastY = 0, ticking = false;
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('is-solid', y > 40 || header.classList.contains('is-light'));
    if (y > 600 && y > lastY + 4 && !document.body.classList.contains('is-locked')) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 600) header.classList.remove('is-hidden');
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (toTop) toTop.classList.toggle('is-visible', y > innerHeight);
    lastY = y; ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();
  header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

  /* ---------- "More" dropdown (desktop) ---------- */
  $$('.drop-btn').forEach(function (btn) {
    var drop = document.getElementById(btn.getAttribute('aria-controls')), wrap = btn.parentNode, closeT;
    function set(open) { btn.setAttribute('aria-expanded', open ? 'true' : 'false'); drop.classList.toggle('is-open', open); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(btn.getAttribute('aria-expanded') !== 'true'); });
    wrap.addEventListener('mouseenter', function () { clearTimeout(closeT); set(true); });
    wrap.addEventListener('mouseleave', function () { closeT = setTimeout(function () { set(false); }, 180); });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) set(false); });
    wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); btn.focus(); } });
    wrap.addEventListener('focusout', function (e) { if (!wrap.contains(e.relatedTarget)) set(false); });
  });

  /* ---------- Slide-in menu (mobile / tablet) ---------- */
  var toggle = $('.nav-toggle'), menu = $('#mobile-menu');
  if (toggle && menu) {
    var closeBtn = $('.menu__close', menu);
    var openMenu = function () { menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('is-locked'); setTimeout(function () { closeBtn.focus(); }, 60); };
    var closeMenu = function (ret) { menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('is-locked'); if (ret) toggle.focus(); };
    toggle.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', function () { closeMenu(true); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a') || e.target.hasAttribute('data-menu-close')) closeMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeMenu(true);
      if (e.key === 'Tab') {
        var f = $$('.menu__panel a, .menu__panel button', menu), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (innerWidth >= 1180 && menu.classList.contains('is-open')) closeMenu(false); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) reveals.forEach(function (el) { el.classList.add('is-visible'); });
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero slider (home) ---------- */
  var hero = $('.hero');
  if (hero && $('.hero__slide')) (function () {
    var slides = $$('.hero__slide'), bars = $$('.hero__bars button'), idx = $('#hero-idx'), tog = $('#hero-toggle');
    var DUR = 3500, cur = 0, timer = null, paused = false; /* time per hero slide (ms) */
    hero.style.setProperty('--hero-dur', DUR + 'ms');
    function load(i) { var img = $('img', slides[i]); if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); } }
    function go(i) {
      i = (i + slides.length) % slides.length; load(i); load((i + 1) % slides.length);
      slides.forEach(function (s, n) { s.classList.toggle('is-leaving', n === cur && n !== i); s.classList.toggle('is-active', n === i); s.setAttribute('aria-hidden', n === i ? 'false' : 'true'); });
      bars.forEach(function (b, n) { b.classList.remove('is-active'); b.classList.toggle('is-done', n < i); if (n === i) { void b.offsetWidth; b.classList.add('is-active'); } b.setAttribute('aria-current', n === i ? 'true' : 'false'); });
      idx.textContent = ('0' + (i + 1)).slice(-2); cur = i; schedule();
    }
    function schedule() { clearTimeout(timer); if (!paused) timer = setTimeout(function () { go(cur + 1); }, DUR); }
    bars.forEach(function (b, n) { b.addEventListener('click', function () { go(n); }); });
    tog.addEventListener('click', function () {
      paused = !paused; hero.classList.toggle('is-paused', paused); clearTimeout(timer);
      tog.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
      $('use', tog).setAttribute('href', paused ? '#i-play' : '#i-pause');
      if (!paused) go(cur);
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else schedule(); });
    window.addEventListener('load', function () { load(1); });
    go(0);
  })();

  /* ---------- Scroll-snap sliders (+ optional data-auto) ---------- */
  $$('.slider__track').forEach(function (track) {
    var nav = $('.slider__nav[data-for="' + track.id + '"]'), barEl = $('.slider__bar[data-bar-for="' + track.id + '"] span');
    var prev = nav && $('[data-dir="-1"]', nav), next = nav && $('[data-dir="1"]', nav);
    function step() { var s = track.querySelector('.slide'); return s ? s.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 24) : track.clientWidth * 0.8; }
    function update() {
      var max = track.scrollWidth - track.clientWidth, x = track.scrollLeft;
      if (prev) prev.disabled = x <= 2;
      if (next) next.disabled = x >= max - 2;
      if (barEl) { var w = Math.max(12, track.clientWidth / track.scrollWidth * 100); barEl.style.width = w + '%'; barEl.style.transform = 'translateX(' + (max > 0 ? (x / max) * (100 / w * 100 - 100) : 0) + '%)'; }
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    var pending = false;
    track.addEventListener('scroll', function () { if (!pending) { pending = true; requestAnimationFrame(function () { pending = false; update(); }); } }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); if (next) next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); if (prev) prev.click(); }
    });
    window.addEventListener('resize', update);
    update();

    var delay = parseInt(track.dataset.auto, 10);
    if (!delay) return;
    var autoBtn = nav && $('[data-auto-toggle]', nav), timer = null, userPaused = false, hold = false, inView = false;
    var label = autoBtn ? autoBtn.getAttribute('aria-label').replace(/^Pause /, '') : '';
    function tick() {
      var max = track.scrollWidth - track.clientWidth;
      track.scrollTo({ left: track.scrollLeft >= max - 4 ? 0 : Math.min(max, track.scrollLeft + step()), behavior: 'smooth' });
    }
    function run() { clearInterval(timer); timer = null; if (!userPaused && !hold && inView && !document.hidden) timer = setInterval(tick, delay); }
    var host = track.closest('.slider') || track;
    host.addEventListener('mouseenter', function () { hold = true; run(); });
    host.addEventListener('mouseleave', function () { hold = false; run(); });
    host.addEventListener('focusin', function () { hold = true; run(); });
    host.addEventListener('focusout', function () { hold = false; run(); });
    track.addEventListener('touchstart', function () { hold = true; run(); }, { passive: true });
    track.addEventListener('touchend', function () { setTimeout(function () { hold = false; run(); }, 3000); }, { passive: true });
    document.addEventListener('visibilitychange', run);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { inView = en[0].isIntersecting; run(); }, { threshold: 0.3 }).observe(track);
    else { inView = true; run(); }
    if (autoBtn) autoBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      autoBtn.setAttribute('aria-label', (userPaused ? 'Play ' : 'Pause ') + label);
      $('use', autoBtn).setAttribute('href', userPaused ? '#i-play' : '#i-pause');
      run();
    });
  });

  /* ---------- Studio moments strip: pause / play ---------- */
  var mBtn = $('#moments-toggle');
  if (mBtn) mBtn.addEventListener('click', function () {
    var p = $('.moments').classList.toggle('is-paused');
    mBtn.setAttribute('aria-label', p ? 'Play photo strip' : 'Pause photo strip');
    $('use', mBtn).setAttribute('href', p ? '#i-play' : '#i-pause');
  });

  /* ---------- Testimonial slider ---------- */
  var tRoot = $('.tslider');
  if (tRoot) (function () {
    var slides = $$('.tslide', tRoot), dotsWrap = $('.dots', tRoot), tog = $('#t-toggle');
    var cur = 0, timer = null, paused = false, hover = false, DUR = 7000;
    slides.forEach(function (s, n) {
      s.setAttribute('aria-label', (n + 1) + ' of ' + slides.length);
      var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', 'Show testimonial ' + (n + 1));
      d.addEventListener('click', function () { go(n); }); dotsWrap.appendChild(d);
    });
    var dots = $$('button', dotsWrap);
    function go(i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === cur); s.setAttribute('aria-hidden', n === cur ? 'false' : 'true'); });
      dots.forEach(function (d, n) { d.setAttribute('aria-current', n === cur ? 'true' : 'false'); });
      schedule();
    }
    function schedule() { clearTimeout(timer); if (!paused && !hover) timer = setTimeout(function () { go(cur + 1); }, DUR); }
    $$('[data-t]', tRoot).forEach(function (b) { b.addEventListener('click', function () { go(cur + parseInt(b.dataset.t, 10)); }); });
    tog.addEventListener('click', function () {
      paused = !paused; tog.setAttribute('aria-label', paused ? 'Play testimonials' : 'Pause testimonials');
      $('use', tog).setAttribute('href', paused ? '#i-play' : '#i-pause'); schedule();
    });
    tRoot.addEventListener('mouseenter', function () { hover = true; clearTimeout(timer); });
    tRoot.addEventListener('mouseleave', function () { hover = false; schedule(); });
    tRoot.addEventListener('focusin', function () { hover = true; clearTimeout(timer); });
    tRoot.addEventListener('focusout', function () { hover = false; schedule(); });
    var tx = null;
    tRoot.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    tRoot.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); tx = null; });
    go(0);
  })();

  /* ---------- In-page sheet: videos + teacher profiles ---------- */
  var sheet = $('#sheet');
  if (sheet) (function () {
    var content = $('#sheet-content'), scroller = $('.sheet__scroll', sheet), lastTrigger = null, onClose = null;
    function open(html, opts) {
      opts = opts || {};
      content.innerHTML = html;
      sheet.classList.toggle('sheet--video', !!opts.video);
      var t = $('.sheet__title', content);
      if (t) { t.id = 'sheet-title'; sheet.setAttribute('aria-labelledby', 'sheet-title'); sheet.removeAttribute('aria-label'); }
      else { sheet.removeAttribute('aria-labelledby'); sheet.setAttribute('aria-label', opts.label || 'Details'); }
      if (!sheet.open) { if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', ''); }
      scroller.scrollTop = 0;
      document.body.classList.add('is-locked');
      onClose = opts.onClose || null;
    }
    function close() { if (typeof sheet.close === 'function') sheet.close(); else { sheet.removeAttribute('open'); done(); } }
    function done() {
      content.innerHTML = ''; document.body.classList.remove('is-locked');
      if (onClose) { onClose(); onClose = null; }
      if (lastTrigger) lastTrigger.focus();
    }
    sheet.addEventListener('close', done);
    $('.sheet__close', sheet).addEventListener('click', close);
    sheet.addEventListener('click', function (e) { if (e.target === sheet) close(); });

    /* Videos */
    document.addEventListener('click', function (e) {
      var v = e.target.closest('[data-video]');
      if (!v) return;
      lastTrigger = v;
      open('<div class="sheet__video"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.dataset.video) + '?autoplay=1&rel=0" title="' + (v.dataset.title || 'Video') + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>', { video: true, label: 'Video player' });
    });

    /* Teacher profiles (teachers page): tap a portrait -> detailed popup */
    var profiles = $$('#teacher-profiles article[id]');
    if (!profiles.length) return;
    var ids = profiles.map(function (p) { return p.id; });
    function showTeacher(id) {
      var i = ids.indexOf(id); if (i < 0) return;
      var p = profiles[i], img = $('img', p);
      var prev = profiles[(i - 1 + ids.length) % ids.length], next = profiles[(i + 1) % ids.length];
      var name = $('h2', p).textContent;
      open(
        '<div class="sheet__profile">' +
          '<img src="' + img.getAttribute('src') + '" alt="' + img.alt + '" width="' + img.getAttribute('width') + '" height="' + img.getAttribute('height') + '">' +
          '<div><p class="eyebrow">' + $('.row__sub', p).innerHTML + '</p><h2 class="sheet__title">' + name + '</h2>' +
          '<p class="sheet__lede">' + $('.row__spec', p).innerHTML + '</p></div>' +
        '</div>' +
        '<div class="prose">' + $('.prose', p).innerHTML + '</div>' +
        '<div class="sheet__actions"><a class="btn btn--primary" href="/pages/timetable">Book a class <svg aria-hidden="true"><use href="#i-arrow"/></svg></a></div>' +
        '<nav class="sheet__nav" aria-label="Other teachers">' +
          '<button type="button" data-teacher="' + prev.id + '"><svg aria-hidden="true"><use href="#i-left"/></svg><span><small>Previous</small>' + $('h2', prev).textContent + '</span></button>' +
          '<button type="button" data-teacher="' + next.id + '"><span><small>Next</small>' + $('h2', next).textContent + '</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>' +
        '</nav>',
        { label: name, onClose: function () { if (location.hash) history.replaceState(null, '', location.pathname + location.search); } }
      );
      if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
      $('.sheet__close', sheet).focus();
    }
    document.addEventListener('click', function (e) {
      var card = e.target.closest('a.teacher[href^="#"]');
      if (card) { e.preventDefault(); lastTrigger = card; showTeacher(card.getAttribute('href').slice(1)); return; }
      var nav = e.target.closest('[data-teacher]');
      if (nav) showTeacher(nav.dataset.teacher);
    });
    /* Arriving from another page with #teacher-name opens that teacher straight away */
    var start = location.hash.slice(1);
    if (ids.indexOf(start) > -1) { lastTrigger = $('a.teacher[href="#' + start + '"]'); showTeacher(start); }
  })();

  /* ---------- Inline YouTube player ---------- */
  $$('[data-yt]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
      f.title = b.getAttribute('data-title') || 'Video'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
      var box = b.parentNode; box.innerHTML = ''; box.appendChild(f); f.focus();
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lb = $('#lightbox');
  if (lb) (function () {
    var img = $('#lb-img'), cap = $('#lb-cap'), cur = 0, items = $$('#gallery-grid button'), trigger = null;
    function show(i) {
      cur = (i + items.length) % items.length;
      var t = $('img', items[cur]);
      img.src = items[cur].dataset.full; img.alt = t.alt;
      cap.textContent = t.alt + ' (' + (cur + 1) + ' of ' + items.length + ')';
    }
    items.forEach(function (btn, i) {
      btn.setAttribute('aria-label', 'Open image: ' + $('img', btn).alt);
      btn.addEventListener('click', function () {
        trigger = btn; show(i);
        if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
        document.body.classList.add('is-locked');
      });
    });
    function close() { if (typeof lb.close === 'function') lb.close(); else lb.removeAttribute('open'); }
    lb.addEventListener('close', function () { document.body.classList.remove('is-locked'); if (trigger) trigger.focus(); });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { show(cur - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') close(); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
    var tx = null;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); tx = null; });
  })();

  /* ---------- Contact form: prefill enquiry from ?enquiry=, validate ---------- */
  var form = $('#contact-form');
  if (form) (function () {
    var sel = $('#f-class'), want = new URLSearchParams(location.search).get('enquiry');
    if (want && sel) $$('option', sel).forEach(function (o) { if (o.textContent === want) sel.value = o.value || o.textContent; });
    var fields = $$('.field input, .field select, .field textarea', form); /* skips the hidden spam-trap field */
    function validate(el) {
      var wrap = el.closest('.field'), ok = el.checkValidity();
      if (el.name === 'name' && el.value.trim().length < 2) ok = false;
      if (el.name === 'message' && el.value.trim().length < 10) ok = false;
      wrap.classList.toggle('is-invalid', !ok); el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    }
    fields.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value) validate(el); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-invalid')) validate(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (el) { if (!validate(el) && !firstBad) firstBad = el; });
      if (firstBad) { firstBad.focus(); return; }
      /* CONNECT A BACKEND HERE
         Formspree:
         fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
           .then(function (r) { if (r.ok) showSuccess(); else alert('Sorry, something went wrong. Please call 0412 499 700.'); });
         return;
         EmailJS:
         emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', form).then(showSuccess); return;
      */
      /* Sends to Supabase (assets/js/data.js) when configured. */
      var send = window.TYS && window.TYS.sendContact, btn = $('button[type="submit"]', form), err = $('.form__error', form);
      if (!send) { showSuccess(); return; }
      if (err) err.hidden = true;
      btn.disabled = true; btn.setAttribute('aria-busy', 'true');
      send(new FormData(form)).then(showSuccess, function () {
        if (err) { err.hidden = false; err.focus(); }
      }).then(function () { btn.disabled = false; btn.removeAttribute('aria-busy'); });
    });
    function showSuccess() { form.classList.add('is-sent'); form.reset(); $('.form__success', form).focus(); }
  })();

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
