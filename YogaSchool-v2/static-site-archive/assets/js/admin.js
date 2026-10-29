/* The Yoga School: admin dashboard (Supabase). Access is enforced by Row Level Security:
   only users listed in public.admins can change content or read messages. */
(function () {
  'use strict';
  var cfg = window.TYS_SUPABASE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var TZ = 'Australia/Brisbane';
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var CATEGORIES = [['membership', 'Membership'], ['drop_in', 'Drop in'], ['chair', 'Chair Yoga pass'], ['class_pass', 'Class pass'], ['unlimited', 'Unlimited pass'], ['private', 'Private class'], ['other', 'Other / offer']];

  if (!cfg.url || !cfg.anonKey) { $('#setup-view').hidden = false; return; }
  var sb = window.supabase.createClient(cfg.url, cfg.anonKey);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function toast(msg) { var t = document.createElement('div'); t.className = 'a-toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
  function slugify(s) { return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80); }
  function money(n) { return n == null || n === '' ? '' : '$' + Number(n).toLocaleString('en-AU', { minimumFractionDigits: Number(n) % 1 ? 2 : 0 }); }
  /* timestamptz <-> <input type="datetime-local"> in Cairns time (UTC+10, no daylight saving) */
  function toLocalInput(iso) {
    if (!iso) return '';
    var p = {}; new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date(iso)).forEach(function (x) { p[x.type] = x.value; });
    return p.year + '-' + p.month + '-' + p.day + 'T' + (p.hour === '24' ? '00' : p.hour) + ':' + p.minute;
  }
  function fromLocalInput(v) { return v ? v + ':00+10:00' : null; }
  function fmtDate(iso) { return iso ? new Intl.DateTimeFormat('en-AU', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso)) : ''; }
  function hhmm(t) { return t ? String(t).slice(0, 5) : ''; }
  var pub = function (r) { return r.published ? '<span class="a-pill a-pill--on">Live</span>' : '<span class="a-pill a-pill--off">Hidden</span>'; };

  /* ---------------------------------------------------------------- content types */
  var F = {
    text: function (name, label, o) { return Object.assign({ name: name, label: label, type: 'text' }, o); },
    area: function (name, label, o) { return Object.assign({ name: name, label: label, type: 'textarea' }, o); },
    num: function (name, label, o) { return Object.assign({ name: name, label: label, type: 'number' }, o); },
    bool: function (name, label, o) { return Object.assign({ name: name, label: label, type: 'checkbox' }, o); },
    url: function (name, label, o) { return Object.assign({ name: name, label: label, type: 'url' }, o); },
    img: function (name, label, o) { return Object.assign({ name: name, label: label, type: 'image' }, o); }
  };
  var PUBLISHED = F.bool('published', 'Published (visible on the website)', { def: true });
  var TYPES = {
    classes: {
      title: 'Classes', single: 'class', order: [['sort', true]], search: ['name', 'level'],
      intro: 'Classes on the Classes page. Lower “Sort” numbers appear first.',
      cols: [['Name', function (r) { return esc(r.name); }], ['Level', function (r) { return esc(r.level); }], ['Duration', function (r) { return esc(r.duration) || '—'; }], ['Status', pub]],
      fields: [F.text('name', 'Class name', { required: true, half: true }), F.text('slug', 'Web address name', { required: true, half: true, slugFrom: 'name', help: 'Used in links, e.g. /pages/classes#class-yin. Lowercase, no spaces.' }),
        F.text('level', 'Level', { half: true }), F.text('duration', 'Duration', { half: true, help: 'e.g. 60–75 min. Leave empty to hide.' }),
        F.text('summary', 'Short description'), F.area('description', 'Full description', { big: true, help: 'Leave a blank line between paragraphs.' }),
        F.text('tag', 'Badge', { half: true, help: 'Optional, e.g. Start here' }), F.num('sort', 'Sort', { half: true, def: 0 }),
        F.img('image_url', 'Photo'), PUBLISHED]
    },
    timetable: {
      title: 'Timetable', single: 'class time', order: [['day_of_week', true], ['start_time', true]], search: ['class_name', 'teacher'],
      intro: 'Weekly timetable. When at least one class is published, the Timetable page shows it above the Momence booking widget.',
      cols: [['Day', function (r) { return DAYS[r.day_of_week - 1]; }], ['Time', function (r) { return hhmm(r.start_time) + (r.end_time ? '–' + hhmm(r.end_time) : ''); }],
        ['Class', function (r) { return esc(r.class_name); }], ['Teacher', function (r) { return esc(r.teacher); }], ['Status', pub]],
      fields: [{ name: 'day_of_week', label: 'Day', type: 'select', half: true, required: true, options: DAYS.map(function (d, i) { return [i + 1, d]; }), def: 1 },
        F.text('class_name', 'Class name', { half: true, required: true }),
        { name: 'start_time', label: 'Start time', type: 'time', half: true, required: true }, { name: 'end_time', label: 'End time', type: 'time', half: true },
        F.text('teacher', 'Teacher', { half: true }), F.text('level', 'Level', { half: true }),
        F.text('class_slug', 'Links to class', { half: true, help: 'Optional: the class web address name, e.g. yin, l1, all, shoshin.' }),
        F.url('book_url', 'Booking link', { half: true, help: 'Optional. Empty = scrolls to the Momence booking widget.' }),
        F.text('notes', 'Note shown to students'), PUBLISHED]
    },
    prices: {
      title: 'Prices', single: 'price', order: [['sort', true]], search: ['name', 'category'],
      intro: 'Memberships appear as cards on the Prices page; everything else appears in the passes list.',
      cols: [['Type', function (r) { var c = CATEGORIES.filter(function (x) { return x[0] === r.category; })[0]; return c ? c[1] : esc(r.category); }],
        ['Name', function (r) { return esc(r.name); }], ['Price', function (r) { return esc(r.price_label || money(r.price)); }], ['Status', pub]],
      fields: [{ name: 'category', label: 'Type', type: 'select', half: true, required: true, options: CATEGORIES, def: 'membership' }, F.text('name', 'Name', { half: true, required: true }),
        F.num('price', 'Price ($)', { half: true, step: '0.01' }), F.text('price_label', 'Price text (optional)', { half: true, help: 'Overrides the price, e.g. $120 / $160' }),
        F.text('period', 'Per', { half: true, help: 'e.g. fortnight' }), F.text('badge', 'Badge', { half: true, help: 'e.g. All access' }),
        F.area('description', 'Description'), { name: 'features', label: 'Included (one per line)', type: 'list' },
        F.text('terms', 'Terms', { help: 'e.g. Minimum 12-week commitment' }),
        F.text('cta_label', 'Button text', { half: true }), F.text('cta_url', 'Button link', { half: true }),
        F.num('sort', 'Sort', { half: true, def: 0 }), F.bool('featured', 'Highlight this card', { half: true }), PUBLISHED]
    },
    events: {
      title: 'Events', single: 'event', order: [['starts_at', false]], search: ['title', 'teacher'],
      intro: 'Upcoming events appear on the Events page automatically and disappear once they have finished. Times are Cairns time.',
      cols: [['When', function (r) { return fmtDate(r.starts_at); }], ['Event', function (r) { return esc(r.title); }], ['Teacher', function (r) { return esc(r.teacher); }], ['Status', pub]],
      fields: [F.text('title', 'Event title', { required: true }),
        { name: 'starts_at', label: 'Starts', type: 'datetime', half: true, required: true }, { name: 'ends_at', label: 'Ends', type: 'datetime', half: true },
        F.text('teacher', 'Teacher', { half: true }), F.text('price_label', 'Price', { half: true, help: 'e.g. $45 or Free' }),
        F.text('location', 'Location', { def: 'The Yoga School, Piccones Village, Edge Hill' }), F.area('description', 'Description', { help: 'Blank line = new paragraph.' }),
        F.url('book_url', 'Booking link'), F.img('image_url', 'Image'), PUBLISHED]
    },
    blog_posts: {
      title: 'Blog', single: 'article', order: [['published_at', false]], search: ['title', 'author'],
      intro: 'Articles on the Blog page. A future publish date keeps an article hidden until that day.',
      cols: [['Title', function (r) { return esc(r.title); }], ['Author', function (r) { return esc(r.author); }], ['Date', function (r) { return fmtDate(r.published_at); }], ['Status', pub]],
      fields: [F.text('title', 'Title', { required: true }), F.text('slug', 'Web address name', { required: true, half: true, slugFrom: 'title' }),
        F.text('author', 'Author', { half: true, def: 'The Yoga School' }), F.area('excerpt', 'Short summary', { help: 'Shown on the blog cards.' }),
        F.area('body', 'Article', { big: true, help: 'Leave a blank line between paragraphs.' }), F.img('image_url', 'Main image'),
        { name: 'published_at', label: 'Publish date', type: 'datetime', half: true, def: 'now' }, PUBLISHED]
    },
    shop_products: {
      title: 'Shop', single: 'product', order: [['sort', true]], search: ['name', 'category'],
      intro: 'Products on the Shop page. Leave the price empty to show “Enquire in studio”.',
      cols: [['Product', function (r) { return esc(r.name); }], ['Price', function (r) { return money(r.price) || 'Enquire'; }], ['Stock', function (r) { return r.in_stock ? 'In stock' : 'Out of stock'; }], ['Status', pub]],
      fields: [F.text('name', 'Product name', { required: true, half: true }), F.text('category', 'Category', { half: true }), F.area('description', 'Description'),
        F.num('price', 'Price ($)', { half: true, step: '0.01' }), F.url('buy_url', 'Buy link', { half: true, help: 'e.g. the product on Momence' }),
        F.img('image_url', 'Photo'), F.num('sort', 'Sort', { half: true, def: 0 }), F.bool('in_stock', 'In stock', { half: true, def: true }), PUBLISHED]
    },
    gift_vouchers: {
      title: 'Gift vouchers', single: 'voucher', order: [['sort', true]], search: ['name'],
      intro: 'Voucher options on the Gift vouchers page. When none are published, the page shows its standard cards.',
      cols: [['Voucher', function (r) { return esc(r.name); }], ['Price', function (r) { return money(r.price); }], ['Status', pub]],
      fields: [F.text('name', 'Voucher name', { required: true, half: true }), F.num('price', 'Price ($)', { half: true, step: '0.01' }), F.area('description', 'Description'),
        F.url('buy_url', 'Buy link', { def: 'https://momence.com/gcc/23652' }), F.num('sort', 'Sort', { half: true, def: 0 }), PUBLISHED]
    }
  };
  var NAV = [['messages', 'Messages'], ['classes'], ['timetable'], ['prices'], ['events'], ['blog_posts'], ['shop_products'], ['gift_vouchers']];

  /* ---------------------------------------------------------------- auth */
  var user = null, current = null, rowsCache = [];
  function showLogin(msg, ok) {
    $('#app-view').hidden = true; $('#login-view').hidden = false;
    var m = $('#login-msg'); m.hidden = !msg; m.textContent = msg || ''; m.className = 'a-msg ' + (ok ? 'a-msg--ok' : 'a-msg--err');
  }
  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = $('button[type="submit"]', e.target); btn.disabled = true;
    sb.auth.signInWithPassword({ email: $('#l-email').value.trim(), password: $('#l-pass').value }).then(function (r) {
      btn.disabled = false;
      if (r.error) return showLogin('Sign in failed: ' + r.error.message);
      start(r.data.user);
    });
  });
  $('#forgot').addEventListener('click', function () {
    var email = $('#l-email').value.trim();
    if (!email) return showLogin('Type your email address first, then click “Forgot password?”.');
    sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0] }).then(function (r) {
      showLogin(r.error ? r.error.message : 'If that email has an admin account, a reset link is on its way.', !r.error);
    });
  });
  $('#sign-out').addEventListener('click', function () { sb.auth.signOut().then(function () { location.reload(); }); });
  sb.auth.onAuthStateChange(function (event, session) {
    if (event === 'PASSWORD_RECOVERY') {
      var pw = prompt('Choose a new password (at least 8 characters):');
      if (pw && pw.length >= 8) sb.auth.updateUser({ password: pw }).then(function (r) { alert(r.error ? r.error.message : 'Password updated.'); });
    }
  });

  function start(u) {
    user = u;
    sb.from('admins').select('user_id').eq('user_id', u.id).maybeSingle().then(function (r) {
      if (r.error || !r.data) {
        sb.auth.signOut();
        return showLogin('This account is not an admin yet. Ask the site owner to add it (supabase/README.md, step 4).');
      }
      $('#login-view').hidden = true; $('#app-view').hidden = false;
      $('#a-user-email').textContent = u.email;
      buildNav(); go(location.hash.slice(1) || 'messages');
    });
  }
  sb.auth.getSession().then(function (r) { if (r.data.session) start(r.data.session.user); else showLogin(); });

  /* ---------------------------------------------------------------- navigation */
  function buildNav() {
    $('#a-nav').innerHTML = NAV.map(function (n) {
      var label = n[1] || TYPES[n[0]].title;
      return '<button type="button" data-go="' + n[0] + '">' + label + (n[0] === 'messages' ? '<span class="a-badge" id="new-count" hidden></span>' : '') + '</button>';
    }).join('');
    $('#a-nav').addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });
    refreshCount();
  }
  function go(key) {
    if (key !== 'messages' && !TYPES[key]) key = 'messages';
    current = key; history.replaceState(null, '', '#' + key);
    Array.prototype.forEach.call(document.querySelectorAll('[data-go]'), function (b) { b.setAttribute('aria-current', b.dataset.go === key ? 'page' : 'false'); });
    if (key === 'messages') return loadMessages();
    loadType(key);
  }
  function refreshCount() {
    sb.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new').then(function (r) {
      var b = $('#new-count'); if (!b) return; b.hidden = !r.count; b.textContent = r.count || '';
    });
  }

  /* ---------------------------------------------------------------- content lists */
  function loadType(key) {
    var T = TYPES[key], main = $('#a-main');
    main.innerHTML = '<div class="a-head"><div><h1>' + T.title + '</h1><p>' + T.intro + '</p></div><div class="a-tools"><input type="search" placeholder="Search…" aria-label="Search ' + T.title + '" id="a-search"><button class="btn btn--primary btn--sm" type="button" id="a-new">+ Add ' + T.single + '</button></div></div><div class="a-table-wrap" id="a-list"><p class="a-empty">Loading…</p></div>';
    $('#a-new').addEventListener('click', function () { edit(key, null); });
    $('#a-search').addEventListener('input', function () { renderList(key, this.value); });
    var q = sb.from(key).select('*');
    T.order.forEach(function (o) { q = q.order(o[0], { ascending: o[1] }); });
    q.then(function (r) {
      if (r.error) { $('#a-list').innerHTML = '<p class="a-empty">Could not load: ' + esc(r.error.message) + '</p>'; return; }
      rowsCache = r.data; renderList(key, '');
    });
  }
  function renderList(key, term) {
    var T = TYPES[key], t = (term || '').toLowerCase();
    var rows = rowsCache.filter(function (r) { return !t || T.search.some(function (f) { return String(r[f] || '').toLowerCase().indexOf(t) > -1; }); });
    if (!rows.length) { $('#a-list').innerHTML = '<p class="a-empty">' + (t ? 'Nothing matches “' + esc(term) + '”.' : 'Nothing here yet. Click “Add ' + T.single + '”.') + '</p>'; return; }
    $('#a-list').innerHTML = '<table class="a-table"><thead><tr>' + T.cols.map(function (c) { return '<th scope="col">' + c[0] + '</th>'; }).join('') + '<th><span class="sr-only">Actions</span></th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr>' + T.cols.map(function (c) { return '<td>' + c[1](r) + '</td>'; }).join('') +
          '<td class="a-actions"><button class="btn btn--outline btn--sm" type="button" data-edit="' + r.id + '">Edit</button><button class="btn btn--outline btn--sm" type="button" data-copy="' + r.id + '">Duplicate</button></td></tr>';
      }).join('') + '</tbody></table>';
    $('#a-list').onclick = function (e) {
      var b = e.target.closest('[data-edit],[data-copy]'); if (!b) return;
      var row = rowsCache.filter(function (r) { return r.id === (b.dataset.edit || b.dataset.copy); })[0];
      if (b.dataset.edit) edit(key, row);
      else { var c = Object.assign({}, row); delete c.id; if (c.slug) c.slug += '-copy'; c.published = false; edit(key, c, true); }
    };
  }

  /* ---------------------------------------------------------------- editor */
  var dlg = $('#editor');
  function fieldHtml(f, v) {
    var id = 'f_' + f.name, req = f.required ? ' required' : '', cls = 'field' + (f.half ? ' field--half' : ''), help = f.help ? '<p class="a-help">' + f.help + '</p>' : '';
    var val = v == null ? (f.def === 'now' ? toLocalInput(new Date().toISOString()) : (f.def == null ? '' : f.def)) : v;
    if (f.type === 'checkbox') return '<div class="' + cls + '"><label class="a-check"><input type="checkbox" id="' + id + '" name="' + f.name + '"' + (val === true || val === 'true' ? ' checked' : '') + '> ' + f.label + '</label>' + help + '</div>';
    if (f.type === 'select') return '<div class="' + cls + '"><label for="' + id + '">' + f.label + '</label><select id="' + id + '" name="' + f.name + '"' + req + '>' + f.options.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(val) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>' + help + '</div>';
    if (f.type === 'textarea' || f.type === 'list') return '<div class="' + cls + '"><label for="' + id + '">' + f.label + '</label><textarea id="' + id + '" name="' + f.name + '"' + (f.big ? ' class="big"' : '') + req + '>' + esc(f.type === 'list' ? (val || []).join('\n') : val) + '</textarea>' + help + '</div>';
    if (f.type === 'image') return '<div class="' + cls + '"><label for="' + id + '">' + f.label + '</label><input type="text" id="' + id + '" name="' + f.name + '" value="' + esc(val) + '" placeholder="Paste an image link or upload">' +
      '<div class="a-img"><img alt="" src="' + esc(val) + '"' + (val ? '' : ' hidden') + '><label class="btn btn--outline btn--sm">Upload image<input type="file" accept="image/*" hidden data-upload="' + id + '"></label></div>' + help + '</div>';
    var type = f.type === 'datetime' ? 'datetime-local' : f.type, dv = f.type === 'datetime' && v ? toLocalInput(v) : (f.type === 'time' ? hhmm(val) : val);
    return '<div class="' + cls + '"><label for="' + id + '">' + f.label + '</label><input type="' + type + '" id="' + id + '" name="' + f.name + '" value="' + esc(dv) + '"' + (f.step ? ' step="' + f.step + '"' : '') + req + '>' + help + '</div>';
  }
  function edit(key, row, isCopy) {
    var T = TYPES[key], isNew = !row || isCopy;
    dlg.innerHTML = '<form novalidate><header><h2>' + (isNew ? 'Add ' + T.single : 'Edit ' + T.single) + '</h2><button type="button" class="btn btn--outline btn--sm" data-close>Close</button></header>' +
      '<div class="a-body">' + T.fields.map(function (f) { return fieldHtml(f, row ? row[f.name] : null); }).join('') + '<p class="a-msg a-msg--err field" hidden id="e-msg" role="alert"></p></div>' +
      '<footer>' + (!isNew ? '<button type="button" class="btn btn--outline btn--sm a-danger" data-delete>Delete</button>' : '<span></span>') + '<button type="submit" class="btn btn--primary">Save</button></footer></form>';
    var form = $('form', dlg);
    T.fields.filter(function (f) { return f.slugFrom; }).forEach(function (f) {
      var src = form.elements[f.slugFrom], dst = form.elements[f.name], touched = !!dst.value;
      dst.addEventListener('input', function () { touched = true; });
      src.addEventListener('input', function () { if (!touched) dst.value = slugify(src.value); });
    });
    form.addEventListener('change', function (e) {
      var up = e.target.dataset && e.target.dataset.upload; if (!up || !e.target.files[0]) return;
      var file = e.target.files[0], path = key + '/' + Date.now() + '-' + slugify(file.name.replace(/\.[^.]+$/, '')) + '.' + (file.name.split('.').pop() || 'jpg').toLowerCase();
      toast('Uploading…');
      sb.storage.from('media').upload(path, file, { cacheControl: '31536000', upsert: false }).then(function (r) {
        if (r.error) return toast('Upload failed: ' + r.error.message);
        var url = sb.storage.from('media').getPublicUrl(path).data.publicUrl;
        form.elements[up.slice(2)].value = url; var img = e.target.closest('.a-img').querySelector('img'); img.src = url; img.hidden = false; toast('Image uploaded');
      });
    });
    form.addEventListener('input', function (e) { if (e.target.closest('.a-img') === null && e.target.parentNode.querySelector('.a-img img')) { var img = e.target.parentNode.querySelector('.a-img img'); img.src = e.target.value; img.hidden = !e.target.value; } });
    $('[data-close]', form).addEventListener('click', function () { dlg.close(); });
    var del = $('[data-delete]', form);
    if (del) del.addEventListener('click', function () {
      if (!confirm('Delete this ' + T.single + '? This cannot be undone.')) return;
      sb.from(key).delete().eq('id', row.id).then(function (r) { if (r.error) return showErr(r.error.message); dlg.close(); toast('Deleted'); loadType(key); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {}, missing = [];
      T.fields.forEach(function (f) {
        var el = form.elements[f.name], v;
        if (f.type === 'checkbox') v = el.checked;
        else if (f.type === 'number') v = el.value === '' ? null : Number(el.value);
        else if (f.type === 'select') v = f.name === 'day_of_week' ? Number(el.value) : el.value;
        else if (f.type === 'list') v = el.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
        else if (f.type === 'datetime') v = fromLocalInput(el.value);
        else v = el.value.trim() || null;
        if (f.required && (v == null || v === '')) missing.push(f.label);
        data[f.name] = v;
      });
      if (data.slug) data.slug = slugify(data.slug);
      if (missing.length) return showErr('Please fill in: ' + missing.join(', '));
      var btn = $('button[type="submit"]', form); btn.disabled = true;
      var q = isNew ? sb.from(key).insert(data) : sb.from(key).update(data).eq('id', row.id);
      q.then(function (r) {
        btn.disabled = false;
        if (r.error) return showErr(r.error.code === '23505' ? 'That web address name is already used. Choose another.' : r.error.message);
        dlg.close(); toast('Saved'); loadType(key);
      });
    });
    function showErr(m) { var p = $('#e-msg', form); p.hidden = false; p.textContent = m; p.scrollIntoView({ block: 'nearest' }); }
    dlg.showModal();
    var first = form.querySelector('input, textarea, select'); if (first) first.focus();
  }

  /* ---------------------------------------------------------------- messages */
  var STATUS = [['new', 'New'], ['read', 'Read'], ['replied', 'Replied'], ['archived', 'Archived']];
  function loadMessages(filter) {
    filter = filter || 'inbox';
    var main = $('#a-main');
    main.innerHTML = '<div class="a-head"><div><h1>Messages</h1><p>Enquiries from the contact form.</p></div><div class="a-tools"><select id="m-filter" aria-label="Show"><option value="inbox">Inbox (not archived)</option><option value="new">New only</option><option value="archived">Archived</option><option value="all">All</option></select></div></div><div class="a-table-wrap" id="a-list"><p class="a-empty">Loading…</p></div>';
    $('#m-filter').value = filter;
    $('#m-filter').addEventListener('change', function () { loadMessages(this.value); });
    var q = sb.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(500);
    if (filter === 'inbox') q = q.neq('status', 'archived'); else if (filter !== 'all') q = q.eq('status', filter);
    q.then(function (r) {
      if (r.error) { $('#a-list').innerHTML = '<p class="a-empty">Could not load: ' + esc(r.error.message) + '</p>'; return; }
      var rows = r.data;
      if (!rows.length) { $('#a-list').innerHTML = '<p class="a-empty">No messages here.</p>'; return; }
      $('#a-list').innerHTML = '<table class="a-table"><thead><tr><th>Received</th><th>From</th><th>Enquiry</th><th>Message</th><th>Status</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>' +
        rows.map(function (m) {
          return '<tr class="' + (m.status === 'new' ? 'is-new' : '') + '"><td>' + fmtDate(m.created_at) + '</td><td><strong>' + esc(m.name) + '</strong><br><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a><br><a href="tel:' + esc(m.phone) + '">' + esc(m.phone) + '</a></td>' +
            '<td>' + esc(m.preferred_class || '—') + '</td><td><div class="a-clip">' + esc(m.message) + '</div></td>' +
            '<td><select data-status="' + m.id + '" aria-label="Status">' + STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === m.status ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select></td>' +
            '<td class="a-actions"><button class="btn btn--outline btn--sm" type="button" data-view="' + m.id + '">Open</button></td></tr>';
        }).join('') + '</tbody></table>';
      $('#a-list').onchange = function (e) {
        var id = e.target.dataset.status; if (!id) return;
        sb.from('contact_messages').update({ status: e.target.value }).eq('id', id).then(function (r) { toast(r.error ? r.error.message : 'Updated'); refreshCount(); });
      };
      $('#a-list').onclick = function (e) {
        var b = e.target.closest('[data-view]'); if (!b) return;
        var m = rows.filter(function (x) { return x.id === b.dataset.view; })[0];
        dlg.innerHTML = '<form method="dialog"><header><h2>Message from ' + esc(m.name) + '</h2><button class="btn btn--outline btn--sm">Close</button></header><div class="a-body"><div class="field a-msgview">' +
          '<dl><dt>Received</dt><dd>' + fmtDate(m.created_at) + '</dd><dt>Email</dt><dd><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a></dd><dt>Phone</dt><dd><a href="tel:' + esc(m.phone) + '">' + esc(m.phone) + '</a></dd><dt>Enquiry</dt><dd>' + esc(m.preferred_class || '—') + '</dd></dl>' +
          '<p>' + esc(m.message) + '</p></div></div><footer><button type="button" class="btn btn--outline btn--sm a-danger" data-del>Delete</button>' +
          '<a class="btn btn--primary" href="mailto:' + esc(m.email) + '?subject=' + encodeURIComponent('Re: your enquiry to The Yoga School') + '" data-reply>Reply by email</a></footer></form>';
        dlg.showModal();
        if (m.status === 'new') sb.from('contact_messages').update({ status: 'read' }).eq('id', m.id).then(function () { refreshCount(); });
        $('[data-reply]', dlg).addEventListener('click', function () { sb.from('contact_messages').update({ status: 'replied' }).eq('id', m.id).then(refreshCount); });
        $('[data-del]', dlg).addEventListener('click', function () {
          if (!confirm('Delete this message?')) return;
          sb.from('contact_messages').delete().eq('id', m.id).then(function (r) { dlg.close(); toast(r.error ? r.error.message : 'Deleted'); loadMessages(filter); refreshCount(); });
        });
        dlg.addEventListener('close', function once() { dlg.removeEventListener('close', once); loadMessages($('#m-filter') ? $('#m-filter').value : filter); }, { once: true });
      };
    });
  }
})();
