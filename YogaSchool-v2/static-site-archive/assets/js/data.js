/* The Yoga School: live content from Supabase.
   Progressive enhancement: every page ships with its own built-in content. When Supabase is
   configured (assets/js/supabase-config.js), elements marked data-sb="..." are refreshed from
   the database. If Supabase is not configured or a request fails, the built-in content stays. */
(function () {
  'use strict';
  var cfg = window.TYS_SUPABASE || {};
  var configured = !!(cfg.url && cfg.anonKey);
  var LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/dist/umd/supabase.min.js';
  var TZ = 'Australia/Brisbane'; /* Cairns time (AEST, no daylight saving) */
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var STATIC_POSTS = ['why-yoga', 'you-cant-stop-the-waves', 'james-bryan-yoga-and-the-body', 'nicky-knoff-yoga-and-the-body', 'healthy-vs-stagnant'];
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ARROW = '<svg aria-hidden="true"><use href="#i-arrow"/></svg>';
  var CHECK = '<svg aria-hidden="true"><use href="#i-check"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function paras(text) { return String(text || '').split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean).map(function (p) { return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join(''); }
  function money(n) { var v = Number(n); return '$' + (v % 1 ? v.toFixed(2) : v.toLocaleString('en-AU')); }
  function priceText(r) { return r.price_label || (r.price != null ? money(r.price) : ''); }
  function ext(url) { return /^https?:/.test(url || '') ? ' target="_blank" rel="noopener"' : ''; }
  function time(t) { var p = String(t).split(':'), h = +p[0], m = p[1]; return (h % 12 || 12) + ':' + m + (h < 12 ? 'am' : 'pm'); }

  /* ---------- Load the client only when needed ---------- */
  var clientPromise = null;
  function client() {
    if (!configured) return Promise.reject(new Error('Supabase is not configured'));
    if (clientPromise) return clientPromise;
    clientPromise = new Promise(function (resolve, reject) {
      if (window.supabase && window.supabase.createClient) return resolve();
      var s = document.createElement('script');
      s.src = LIB; s.async = true; s.onload = resolve; s.onerror = function () { reject(new Error('Could not load Supabase')); };
      document.head.appendChild(s);
    }).then(function () {
      return window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: false } });
    });
    return clientPromise;
  }
  function query(build) {
    return client().then(function (sb) { return build(sb); }).then(function (res) { if (res.error) throw res.error; return res.data || []; });
  }

  /* ---------- Contact form (used by main.js) ---------- */
  window.TYS = window.TYS || {};
  window.TYS.sendContact = configured ? function (fd) {
    if (fd.get('website')) return Promise.resolve(); /* spam trap: humans never fill this */
    return query(function (sb) {
      return sb.from('contact_messages').insert({
        name: String(fd.get('name') || '').trim(),
        phone: String(fd.get('phone') || '').trim(),
        email: String(fd.get('email') || '').trim(),
        preferred_class: String(fd.get('preferred_class') || '').trim() || null,
        message: String(fd.get('message') || '').trim()
      });
    });
  } : null;

  if (!configured) return;
  var hooks = $$('[data-sb]');
  if (!hooks.length) return;

  function refreshReveals(root) { $$('.reveal', root).forEach(function (el) { el.classList.add('is-visible'); }); }
  function done(el) { el.setAttribute('data-sb-loaded', ''); refreshReveals(el); }

  /* ---------- Classes ---------- */
  function renderClasses(el) {
    query(function (sb) { return sb.from('classes').select('*').eq('published', true).order('sort'); }).then(function (rows) {
      if (!rows.length) return;
      el.innerHTML = rows.map(function (c) {
        var meta = '<span class="chip"><svg aria-hidden="true"><use href="#i-level"/></svg>' + esc(c.level) + '</span>' +
          (c.duration ? '<span class="chip"><svg aria-hidden="true"><use href="#i-clock"/></svg>' + esc(c.duration) + '</span>' : '');
        var cta = c.slug === 'private'
          ? '<a class="btn btn--primary" href="tel:+61412499700">Call 0412 499 700 to book</a><a class="btn btn--outline" href="/pages/contact-us?enquiry=Private%20session">Send an enquiry</a>'
          : '<a class="btn btn--primary" href="/pages/timetable">Book on the timetable ' + ARROW + '</a><a class="btn btn--outline" href="/pages/prices">Passes &amp; prices</a>';
        return '<article class="row reveal" id="class-' + esc(c.slug) + '">' +
          '<div class="row__media"><div class="arch"><div class="arch__frame">' + (c.image_url ? '<img src="' + esc(c.image_url) + '" alt="' + esc(c.name) + ' class at The Yoga School" loading="lazy" decoding="async">' : '') + '</div>' +
          (c.tag ? '<p class="arch__badge"><span>' + CHECK + '</span>' + esc(c.tag) + '</p>' : '') + '</div></div>' +
          '<div><p class="row__sub">' + esc(c.level) + '</p><h2>' + esc(c.name) + '</h2><p class="row__spec">' + esc(c.summary) + '</p>' +
          '<div class="card__meta">' + meta + '</div><div class="prose">' + paras(c.description) + '</div><div class="row__actions">' + cta + '</div></div></article>';
      }).join('');
      var jump = $('[data-sb="classes-jump"]');
      if (jump) jump.innerHTML = rows.map(function (c) { return '<a href="#class-' + esc(c.slug) + '">' + esc(c.name) + '</a>'; }).join('');
      done(el);
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    }).catch(warn);
  }

  /* ---------- Timetable ---------- */
  function renderTimetable(el) {
    query(function (sb) { return sb.from('timetable').select('*').eq('published', true).order('day_of_week').order('start_time'); }).then(function (rows) {
      if (!rows.length) return;
      var today = new Date(new Date().toLocaleString('en-US', { timeZone: TZ })).getDay(); /* 0 = Sun */
      var todayIdx = (today + 6) % 7, days = {};
      rows.forEach(function (r) { (days[r.day_of_week - 1] = days[r.day_of_week - 1] || []).push(r); });
      var tabs = DAYS.map(function (d, i) {
        return '<button type="button" role="tab" id="tt-tab-' + i + '" aria-controls="tt-panel-' + i + '" aria-selected="' + (i === todayIdx) + '"' + (i === todayIdx ? '' : ' tabindex="-1"') + '>' +
          '<span>' + d.slice(0, 3) + '</span><small>' + (days[i] ? days[i].length + ' class' + (days[i].length > 1 ? 'es' : '') : 'No classes') + '</small></button>';
      }).join('');
      var panels = DAYS.map(function (d, i) {
        var list = (days[i] || []).map(function (r) {
          var note = r.notes && !/^Imported from Momence/i.test(r.notes) ? '<p class="tt__note">' + esc(r.notes) + '</p>' : '';
          var name = r.class_slug ? '<a href="/pages/classes#class-' + esc(r.class_slug) + '">' + esc(r.class_name) + '</a>' : esc(r.class_name);
          return '<li class="tt__row"><p class="tt__time">' + time(r.start_time) + (r.end_time ? '<span>– ' + time(r.end_time) + '</span>' : '') + '</p>' +
            '<div class="tt__info"><h3>' + name + '</h3><p>' + [r.teacher, r.level].filter(Boolean).map(esc).join(' · ') + '</p>' + note + '</div>' +
            '<a class="btn btn--teal btn--sm" href="' + esc(r.book_url || '#book') + '"' + ext(r.book_url) + '>Book</a></li>';
        }).join('');
        return '<div class="tt__panel" role="tabpanel" id="tt-panel-' + i + '" aria-labelledby="tt-tab-' + i + '"' + (i === todayIdx ? '' : ' hidden') + '>' +
          '<h3 class="tt__day">' + d + '</h3>' + (list ? '<ul>' + list + '</ul>' : '<p class="tt__empty">No classes on ' + d + '. Check another day.</p>') + '</div>';
      }).join('');
      el.innerHTML = '<div class="tt reveal"><div class="tt__tabs" role="tablist" aria-label="Day of the week">' + tabs + '</div>' + panels + '</div>';
      el.hidden = false;
      var buttons = $$('[role="tab"]', el);
      function select(i, focus) {
        buttons.forEach(function (b, n) { b.setAttribute('aria-selected', n === i); b.tabIndex = n === i ? 0 : -1; $('#tt-panel-' + n, el).hidden = n !== i; });
        if (focus) buttons[i].focus();
      }
      buttons.forEach(function (b, i) {
        b.addEventListener('click', function () { select(i); });
        b.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % 7, true); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); select((i + 6) % 7, true); }
        });
      });
      var bookHead = $('[data-sb-show-with="timetable"]');
      if (bookHead) bookHead.hidden = false;
      done(el);
    }).catch(warn);
  }

  /* ---------- Prices ---------- */
  function renderMemberships(el) {
    query(function (sb) { return sb.from('prices').select('*').eq('published', true).eq('category', 'membership').order('sort'); }).then(function (rows) {
      if (!rows.length) return;
      el.innerHTML = rows.map(function (p, n) {
        var feat = p.featured;
        return '<article class="plan' + (feat ? ' plan--featured on-dark' : '') + ' reveal"' + (n ? ' data-delay="' + n + '"' : '') + '>' +
          (p.badge ? '<span class="plan__badge">' + esc(p.badge) + '</span>' : '') +
          '<h3>' + esc(p.name) + '</h3><p class="plan__desc">' + esc(p.description) + '</p>' +
          '<p class="plan__price">' + esc(priceText(p)) + (p.period ? ' <span>/ ' + esc(p.period) + '</span>' : '') + '</p>' +
          (p.terms ? '<p class="plan__terms">' + esc(p.terms) + '</p>' : '') +
          '<ul>' + (p.features || []).map(function (f) { return '<li>' + CHECK + esc(f) + '</li>'; }).join('') + '</ul>' +
          (p.cta_url ? '<a class="btn ' + (feat ? 'btn--teal' : 'btn--outline') + '" href="' + esc(p.cta_url) + '"' + ext(p.cta_url) + '>' + esc(p.cta_label || 'Join') + '</a>' : '') +
          '</article>';
      }).join('');
      done(el);
    }).catch(warn);
  }
  function renderPasses(el) {
    var groups = [['drop_in', 'Drop in'], ['chair', 'Chair Yoga passes'], ['class_pass', 'Class passes'], ['unlimited', 'Unlimited passes'], ['private', 'Private classes']];
    query(function (sb) { return sb.from('prices').select('*').eq('published', true).neq('category', 'membership').neq('category', 'other').order('sort'); }).then(function (rows) {
      if (!rows.length) return;
      var html = groups.map(function (g) {
        var items = rows.filter(function (r) { return r.category === g[0]; });
        if (!items.length) return '';
        var notes = items.map(function (r) { return r.description; }).filter(Boolean);
        return '<h4>' + g[1] + '</h4><ul>' + items.map(function (r) { return '<li><span>' + esc(r.name) + '</span><span>' + esc(priceText(r)) + '</span></li>'; }).join('') + '</ul>' +
          (notes.length ? '<small>' + notes.map(esc).join(' ') + (g[0] === 'private' ? ' Call <a href="tel:+61412499700">0412 499 700</a> to book.' : '') + '</small>' : '');
      }).filter(Boolean);
      var half = Math.ceil(html.length / 2);
      $$('.price-list', el).forEach(function (n) { n.remove(); });
      var fine = $('.fine-print', el);
      [html.slice(0, half), html.slice(half)].forEach(function (col) {
        var d = document.createElement('div'); d.className = 'price-list'; d.innerHTML = col.join('');
        el.insertBefore(d, fine);
      });
      done(el);
    }).catch(warn);
  }

  /* ---------- Events ---------- */
  function renderEvents(el) {
    var now = Date.now(), since = new Date(now - 7 * 864e5).toISOString();
    query(function (sb) { return sb.from('events').select('*').eq('published', true).gte('starts_at', since).order('starts_at').limit(48); }).then(function (rows) {
      rows = rows.filter(function (e) { return new Date(e.ends_at || e.starts_at).getTime() >= now; }).slice(0, 24);
      if (!rows.length) return;
      var f = function (d, o) { return new Intl.DateTimeFormat('en-AU', Object.assign({ timeZone: TZ }, o)).format(new Date(d)); };
      $('[data-sb-list]', el).innerHTML = rows.map(function (e) {
        var when = f(e.starts_at, { weekday: 'long', hour: 'numeric', minute: '2-digit' }) + (e.ends_at ? ' – ' + f(e.ends_at, { hour: 'numeric', minute: '2-digit' }) : '');
        return '<article class="event reveal">' +
          '<p class="event__date"><b>' + f(e.starts_at, { day: 'numeric' }) + '</b>' + f(e.starts_at, { month: 'short' }) + '</p>' +
          '<div class="event__body"><h3>' + esc(e.title) + '</h3><p class="event__meta">' + [when, e.teacher, e.price_label].filter(Boolean).map(esc).join(' · ') + '</p>' +
          '<div class="prose">' + paras(e.description) + '</div></div>' +
          (e.book_url ? '<a class="btn btn--primary btn--sm" href="' + esc(e.book_url) + '"' + ext(e.book_url) + '>Book ' + ARROW + '</a>' : '') +
          '</article>';
      }).join('');
      el.hidden = false;
      done(el);
    }).catch(warn);
  }

  /* ---------- Blog ---------- */
  function postUrl(p) { return STATIC_POSTS.indexOf(p.slug) > -1 ? '/pages/blog-' + p.slug : '/pages/post?slug=' + encodeURIComponent(p.slug); }
  function postCard(p) {
    return '<article class="post__card reveal"><div class="post__media">' + (p.image_url ? '<img src="' + esc(p.image_url) + '" alt="" loading="lazy" decoding="async">' : '') + '</div>' +
      '<div class="post__body"><p class="post__by">' + esc(p.author) + '</p><h3>' + esc(p.title) + '</h3><p>' + esc(p.excerpt || '') + '</p>' +
      '<a class="link-arrow stretch" href="' + postUrl(p) + '">Read article ' + ARROW + '<span class="sr-only">: ' + esc(p.title) + '</span></a></div></article>';
  }
  function renderBlog(el) {
    query(function (sb) { return sb.from('blog_posts').select('slug,title,author,excerpt,image_url,published_at').eq('published', true).order('published_at', { ascending: false }); }).then(function (rows) {
      if (!rows.length) return;
      el.innerHTML = rows.map(postCard).join('');
      done(el);
    }).catch(warn);
  }
  function renderPost(el) {
    var slug = new URLSearchParams(location.search).get('slug');
    if (!slug) return;
    query(function (sb) { return sb.from('blog_posts').select('*').eq('slug', slug).eq('published', true).limit(1); }).then(function (rows) {
      var p = rows[0];
      if (!p) { el.innerHTML = '<div class="article"><h1>Article not found</h1><p class="lead">This article may have moved.</p><p><a class="btn btn--primary" href="/pages/blog1">All articles</a></p></div>'; return; }
      document.title = p.title + ' | The Yoga School Blog';
      var d = new Intl.DateTimeFormat('en-AU', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(p.published_at));
      el.innerHTML = '<div class="article"><nav aria-label="Breadcrumb"><ol class="crumbs"><li><a href="/pages/home">Home</a></li><li><a href="/pages/blog1">Blog</a></li><li aria-current="page">' + esc(p.title) + '</li></ol></nav>' +
        '<p class="eyebrow">From the blog</p><h1>' + esc(p.title) + '</h1><div class="article__meta"><span>By <strong>' + esc(p.author) + '</strong> · ' + d + '</span></div></div>' +
        (p.image_url ? '<figure class="article__hero" style="margin-top:var(--s-5)"><img src="' + esc(p.image_url) + '" alt=""></figure>' : '') +
        '<article class="article"><div class="prose">' + paras(p.body) + '</div><div class="article__end"><a class="btn btn--outline" href="/pages/blog1">← All articles</a><a class="btn btn--primary" href="/pages/timetable">Book a class ' + ARROW + '</a></div></article>';
      done(el);
    }).catch(warn);
  }

  /* ---------- Gift vouchers ---------- */
  function renderVouchers(el) {
    query(function (sb) { return sb.from('gift_vouchers').select('*').eq('published', true).order('sort'); }).then(function (rows) {
      if (!rows.length) return;
      el.innerHTML = rows.map(function (v, n) {
        return '<div class="info-card voucher reveal"' + (n % 3 ? ' data-delay="' + (n % 3) + '"' : '') + '>' +
          '<p class="voucher__price">' + esc(priceText(v)) + '</p><h3>' + esc(v.name) + '</h3><p>' + esc(v.description || '') + '</p>' +
          '<a class="btn btn--primary btn--sm" href="' + esc(v.buy_url || 'https://momence.com/gcc/23652') + '" target="_blank" rel="noopener">Buy voucher ' + ARROW + '</a></div>';
      }).join('');
      done(el);
    }).catch(warn);
  }

  /* ---------- Shop ---------- */
  function renderShop(el) {
    query(function (sb) { return sb.from('shop_products').select('*').eq('published', true).order('sort'); }).then(function (rows) {
      if (!rows.length) return;
      el.innerHTML = rows.map(function (p) {
        var price = p.price != null ? money(p.price) : 'Enquire in studio';
        var cta = !p.in_stock ? '<span class="chip">Out of stock</span>'
          : p.buy_url ? '<a class="btn btn--primary btn--sm" href="' + esc(p.buy_url) + '"' + ext(p.buy_url) + '>Buy ' + ARROW + '</a>'
          : '<a class="btn btn--outline btn--sm" href="/pages/contact-us?enquiry=' + encodeURIComponent('Not sure yet, please advise') + '">Enquire</a>';
        return '<article class="product reveal"><div class="product__media">' + (p.image_url ? '<img src="' + esc(p.image_url) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' : '') + '</div>' +
          '<div class="product__body">' + (p.category ? '<p class="post__by">' + esc(p.category) + '</p>' : '') + '<h3>' + esc(p.name) + '</h3><p>' + esc(p.description || '') + '</p>' +
          '<div class="product__foot"><p class="product__price">' + esc(price) + '</p>' + cta + '</div></div></article>';
      }).join('');
      done(el);
    }).catch(warn);
  }

  function warn(err) { if (window.console) console.warn('[The Yoga School] Using built-in content:', err && err.message ? err.message : err); }

  var renderers = { classes: renderClasses, timetable: renderTimetable, memberships: renderMemberships, passes: renderPasses,
    events: renderEvents, blog: renderBlog, post: renderPost, vouchers: renderVouchers, shop: renderShop };
  hooks.forEach(function (el) { var fn = renderers[el.getAttribute('data-sb')]; if (fn) fn(el); });
})();
