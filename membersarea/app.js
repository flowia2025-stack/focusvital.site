/* Área de membros Brighter Days: rotas por hash, leitor de PDF, carrosséis e janela de desbloqueio.
   Só monta a tela depois do evento member-ready (auth.js), que traz a lista de produtos da pessoa. */
(function () {
  'use strict';

  /* ---------- Conteúdo ---------- */
  var MAIN = {
    id: 'brighter-days',
    title: 'Brighter Days',
    banner: v('img/banners/brighter-days.webp'),
    text: '150+ simple activities for memory, conversation, movement and joy, plus 5 exclusive bonuses. Your main access, already included.'
  };

  var VOLUMES = [
    { id: 'vol-1', kicker: 'Volume 1', title: 'Activities 1 to 50', text: 'Memory games, trivia, life stories and gentle movement to start your journey.' },
    { id: 'vol-2', kicker: 'Volume 2', title: 'Activities 51 to 100', text: 'Chair exercises, crafts, music and family moments for every kind of day.' },
    { id: 'vol-3', kicker: 'Volume 3', title: 'Activities 101 to 150', text: 'Brain teasers, sensory fun and seasonal celebrations to keep the joy going.' }
  ];

  var BONUSES = [
    { id: 'bonus-1', kicker: 'Bonus 1', title: 'Peaceful Evening Kit', text: 'Calming activities to ease late-afternoon restlessness and end the day in peace.' },
    { id: 'bonus-2', kicker: 'Bonus 2', title: 'Visual Routine & Communication Cards', text: 'Picture cards that bring structure, independence and easier conversations.' },
    { id: 'bonus-3', kicker: 'Bonus 3', title: '12-Month Themed Activity Calendar', text: 'A ready-made plan with themed activities for every month of the year.' },
    { id: 'bonus-4', kicker: 'Bonus 4', title: 'Games for Family & Groups', text: 'Fun games that connect generations and get everyone playing together.' },
    { id: 'bonus-5', kicker: 'Bonus 5', title: 'Large-Print Brain Games', text: 'Easy-to-read puzzles that keep the mind active and engaged.' }
  ];

  /* Atividade N fica na página N + 5 do Volume 1 (capa + 4 páginas de sumário). */
  var POPULAR = [
    { n: 11, title: 'Life Story Bingo', cat: 'Social & Reminiscence' },
    { n: 1, title: 'The Memory Jar', cat: 'Memory & Conversation' },
    { n: 14, title: 'Golden Age Movie Trivia', cat: 'Memory & Trivia' },
    { n: 20, title: 'Build-a-Sundae Social', cat: 'Social & Senses' },
    { n: 40, title: 'Color Race', cat: 'Play & Social Fun' },
    { n: 30, title: 'Road Trip USA', cat: 'Geography & Memory' },
    { n: 12, title: 'Sock Hop Word Search', cat: 'Words & Nostalgia' },
    { n: 48, title: 'Thanksgiving Memories', cat: 'Traditions & Gratitude' }
  ];

  /* Produtos secundários. Copy curta (cabe na tela do celular), revisada com a skill copy-master.
     peek = quantas páginas da prévia existem em img/peek/<id>/ (escolhidas pelo Lucas).
     productId = ID Hotmart; docs = materiais que a posse do produto libera (ids do docs.js). */
  var OFFERS = [
    {
      id: 'memory',
      productId: '8695626',
      docs: [{ id: 'memory', kicker: 'Add-on', title: "50+ Memory Activities for Dementia & Alzheimer's", text: 'Large-print brain workouts with gentle levels, clear pictures and answer keys.' }],
      title: "50+ Memory Activities for Dementia & Alzheimer's",
      banner: v('img/banners/memory.webp'),
      card: 'Large-print brain workouts your loved one can actually finish, and feel proud of.',
      sub: 'Brain workouts they can actually finish',
      text: 'Most puzzles are made for younger, sharper minds, so they end in frustration. These work the other way around: gentle levels and clear pictures, so every session ends with a small win and a proud smile.',
      checks: [
        'Picture Recall, Faces & Names, Fruit Sudoku and more',
        '3 gentle levels: always capable, never frustrated',
        'Large print, clear pictures and answer keys for you',
        'About 10 minutes. No prep, just open or print'
      ],
      peek: 5,
      price: '$9.90',
      anchor: 'Less than a movie ticket',
      checkout: 'https://pay.hotmart.com/S107962007U?off=rfflogfw'
    },
    {
      id: 'fall-proof',
      productId: '8721230',
      docs: [
        { id: 'fall-proof', kicker: 'Add-on', title: 'Fall-Proof Legs Protocol', text: 'A gentle 10-minute chair routine for stronger legs and steadier steps.' },
        { id: 'safe-home', kicker: 'Add-on bonus', title: 'The Safe Home Checklist', text: 'Room by room: the hidden fall risks at home and how to fix them.' },
        { id: 'pro-kit', kicker: 'Add-on bonus', title: 'High-Value Professional Kit', text: 'For professional caregivers: show your value and track real results.' }
      ],
      title: 'Fall-Proof Legs Protocol',
      banner: v('img/banners/fall-proof.webp'),
      card: 'A gentle 10-minute chair routine for stronger legs and steadier steps at home.',
      sub: '10-minute chair routine for stronger legs',
      text: 'About 1 in 4 adults over 65 falls every year, according to the CDC, and it usually starts with weaker legs and shaky balance. This gentle chair routine helps build stronger legs and steadier steps, at any age.',
      checks: [
        'Sit-to-Stand, Single-Leg Stand, Step Taps and more',
        'Chair-based and safe for every level',
        'Clear pictures and the exact dose for each move',
        'Bonus: The Safe Home Checklist, room by room'
      ],
      peek: 5,
      price: '$19',
      anchor: 'Less than a single physical therapy visit',
      checkout: 'https://pay.hotmart.com/J108012942O?off=k0uxnsgw'
    },
    {
      id: 'bedridden',
      productId: '8744954',
      docs: [{ id: 'bedridden', kicker: 'Add-on', title: '50+ Activities for Bedridden Seniors', text: 'Joyful 10-minute activities for the bed or the wheelchair.' }],
      title: '50+ Activities for Bedridden Seniors',
      banner: v('img/banners/bedridden.webp'),
      card: 'Joyful 10-minute activities made for the bed or the wheelchair. No standing needed.',
      sub: 'Joyful days, right from the bed or chair',
      text: 'When getting up is hard, the days get long and quiet. Every activity here is done sitting or lying down, with things you already have at home, so each visit becomes something you do together.',
      checks: [
        'The Memory Box, Armchair Travel, Music & Memories and more',
        'No standing needed, made for limited mobility',
        'Movement, senses and memory in about 10 minutes',
        'Step-by-step pictures and a caregiver tip on every page'
      ],
      peek: 5,
      price: '$6.90',
      anchor: 'About the price of a coffee',
      checkout: 'https://pay.hotmart.com/X108060189R?off=p6lqh7vg'
    },
    {
      id: 'lifetime',
      productId: '8695666',
      docs: [],
      ownedText: 'Your lifetime access is active. New activities are added here every month, at no extra cost.',
      title: 'Lifetime Access + Monthly Updates',
      banner: v('img/banners/lifetime.webp'),
      card: 'Never run out of ideas: new activities added every month, yours for life.',
      sub: 'New activities every month, forever',
      text: 'The hardest part of caregiving is coming up with something new, day after day. With lifetime access, fresh ready-to-use activities arrive right here every month, so you never run out of ideas again.',
      checks: [
        'A new pack of activities added every month',
        'Seasonal themes and holidays, ready on time',
        'Use it on your phone or tablet, or print it',
        'One payment, access for life'
      ],
      peek: 4,
      price: '$4.90',
      anchor: 'Pay once, keep it forever',
      checkout: 'https://pay.hotmart.com/P107962058O?off=30n23zs5'
    }
  ];

  /* ---------- Utilidades ---------- */
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var app = $('#app');
  var ICON = {
    sun: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="22" r="9" fill="#FFC93C"/><g stroke="#F5A623" stroke-width="3" stroke-linecap="round"><path d="M20 5v4M8 10l2.8 2.8M32 10l-2.8 2.8M4 22h4M32 22h4"/></g><path d="M7 33h26" stroke="#1B2A5E" stroke-width="3" stroke-linecap="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    read: '<svg viewBox="0 0 24 24"><path d="M3 6.5c3-1.5 6-1.5 9 .5 3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z"/><path d="M12 7v12.5"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5.5 12.5l4 4 9-9.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>'
  };
  function v(u) { return u + '?v=' + (window.IMGV || '1'); }
  function pageUrl(slug, p) { return v('pages/' + slug + '/' + String(p).padStart(3, '0') + '.webp'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function offer(id) { return OFFERS.filter(function (o) { return o.id === id; })[0]; }

  /* Posse: vem só da lista `products` da API (evento member-ready). */
  var owned = {};
  function has(o) { return !!owned[o.productId]; }
  function lockedOffers() { return OFFERS.filter(function (o) { return !has(o); }); }
  function ownedOffers() { return OFFERS.filter(has); }
  var ADDON_DOCS = OFFERS.reduce(function (all, o) { return all.concat(o.docs); }, []);
  function docOffer(id) { return OFFERS.filter(function (o) { return o.docs.some(function (d) { return d.id === id; }); })[0]; }

  function header(withBack) {
    return '<header class="top"><div class="top-in">' +
      (withBack ? '<a class="back" href="#/" aria-label="Back">' + ICON.back + '</a>' : '') +
      '<div class="brand">' + ICON.sun + '<span>Brighter Days</span></div>' +
      '<span class="pill">Members Area</span></div></header>';
  }

  function docCard(d) {
    var meta = window.DOCS[d.id];
    return '<a class="doc" href="#/read/' + d.id + '">' +
      '<div class="doc-cv"><img src="' + v('img/covers/' + d.id + '.webp') + '" alt="" width="300" height="424" loading="lazy" decoding="async"></div>' +
      '<div class="doc-b"><small>' + esc(d.kicker) + '</small><strong>' + esc(d.title) + '</strong>' +
      '<p>' + esc(d.text) + '</p>' +
      '<em>' + ICON.read + 'Read Now · ' + meta.pages + ' pages</em></div></a>';
  }

  function lockedCard(o) {
    return '<article class="prod locked"><a class="prod-img" href="#/unlock/' + o.id + '" aria-label="' + esc(o.title) + '"><img src="' + o.banner + '" alt="" width="960" height="536" loading="lazy" decoding="async"><span class="lock-ic">' + ICON.lock + '</span></a>' +
      '<div class="prod-body"><span class="tag lck">' + ICON.lock + 'Locked</span><h3>' + esc(o.title) + '</h3><p>' + esc(o.card) + '</p>' +
      '<a class="btn btn-gold" href="#/unlock/' + o.id + '">Unlock Now</a></div></article>';
  }

  /* Produto secundário que a pessoa já tem: abre o material em vez da oferta. */
  function ownedCard(o) {
    var href = o.docs.length ? '#/read/' + o.docs[0].id : '#/' + MAIN.id;
    var also = o.docs.slice(1).map(function (d) { return '<a href="#/read/' + d.id + '">' + ICON.read + esc(d.title) + '</a>'; }).join('');
    return '<article class="prod owned"><a class="prod-img" href="' + href + '" aria-label="' + esc(o.title) + '"><img src="' + o.banner + '" alt="" width="960" height="536" loading="lazy" decoding="async"></a>' +
      '<div class="prod-body"><span class="tag own">' + ICON.check + 'Unlocked</span><h3>' + esc(o.title) + '</h3><p>' + esc(o.ownedText || o.card) + '</p>' +
      (also ? '<div class="also"><small>Also included</small>' + also + '</div>' : '') +
      '<a class="btn btn-sun" href="' + href + '">' + (o.docs.length ? 'Read Now' : 'Open Brighter Days') + '</a></div></article>';
  }

  /* ---------- Carrosséis ---------- */
  var timers = [];
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clearTimers() { timers.forEach(function (t) { clearInterval(t); }); timers = []; }

  /* Fita contínua: passa sem parar; o toque pausa, e volta a andar 2,5 s depois de soltar. */
  function marquee(rail, speed) {
    var n = rail.children.length;
    if (!n || still) return;
    rail.insertAdjacentHTML('beforeend', rail.innerHTML.replace(/<(a|button)\b/g, '<$1 aria-hidden="true" tabindex="-1"'));
    var pos = 0, last = null, paused = false, resumeT = null;
    function period() { return rail.children[n] ? rail.children[n].offsetLeft - rail.children[0].offsetLeft : 0; }
    function tick(t) {
      if (!rail.isConnected) return;
      if (last !== null && !paused && !document.hidden) {
        pos += Math.min(t - last, 64) / 1000 * speed;
        var p = period();
        if (p > 0 && pos >= p) pos -= p;
        rail.scrollLeft = pos;
      }
      last = t;
      requestAnimationFrame(tick);
    }
    function pause() { paused = true; clearTimeout(resumeT); }
    function resume() {
      clearTimeout(resumeT);
      resumeT = setTimeout(function () {
        if (!rail.isConnected) return;
        var p = period();
        pos = p > 0 ? rail.scrollLeft % p : 0;  /* rail escondido: p = 0 */
        rail.scrollLeft = pos;
        paused = false;
      }, 2500);
    }
    rail.addEventListener('touchstart', pause, { passive: true });
    rail.addEventListener('touchend', resume);
    rail.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') pause(); });
    rail.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') resume(); });
    rail.addEventListener('scroll', function () {
      if (!paused) return;
      var p = period();
      if (p > 0 && rail.scrollLeft >= p + 2) rail.scrollLeft -= p;
    }, { passive: true });
    requestAnimationFrame(tick);
  }

  /* Slides: mostra um por vez e troca a cada `ms`; o toque pausa por 5 s. */
  function slides(rail, dotsEl, ms) {
    var items = rail.children, n = items.length, idx = 0, holdUntil = 0;
    if (dotsEl) {
      var d = '';
      for (var i = 0; i < n; i++) d += '<i' + (i === 0 ? ' class="on"' : '') + '></i>';
      dotsEl.innerHTML = d;
    }
    function current() {
      var best = 0, bestD = 1e9;
      for (var i = 0; i < n; i++) {
        var dd = Math.abs(items[i].offsetLeft - 16 - rail.scrollLeft);
        if (dd < bestD) { bestD = dd; best = i; }
      }
      return best;
    }
    function paint(i) { if (dotsEl) [].forEach.call(dotsEl.children, function (el, k) { el.classList.toggle('on', k === i); }); }
    rail.addEventListener('scroll', function () { idx = current(); paint(idx); }, { passive: true });
    rail.addEventListener('touchstart', function () { holdUntil = Date.now() + 5000; }, { passive: true });
    if (n < 2 || still) return;
    timers.push(setInterval(function () {
      if (!rail.isConnected || document.hidden || Date.now() < holdUntil) return;
      idx = (current() + 1) % n;
      rail.scrollTo({ left: items[idx].offsetLeft - 16, behavior: 'smooth' });
    }, ms));
  }

  /* ---------- Telas ---------- */
  function home() {
    app.innerHTML = header(false) + '<main class="wrap">' +
      '<section class="hello"><h1>Welcome back! 👋</h1><p>Choose what you would like to explore today.</p></section>' +
      '<section class="sec"><div class="sec-h"><h2>Your products</h2><span>Your access and recommendations</span></div>' +
        '<article class="prod main"><a class="prod-img" href="#/' + MAIN.id + '" aria-label="Open Brighter Days"><img src="' + MAIN.banner + '" alt="" width="960" height="536" fetchpriority="high"></a>' +
          '<div class="prod-body"><span class="tag inc">Included in your plan</span><h3>' + MAIN.title + '</h3><p>' + MAIN.text + '</p>' +
          '<a class="btn btn-sun" href="#/' + MAIN.id + '">Open Brighter Days</a></div></article>' +
        ownedOffers().map(ownedCard).join('') +
        lockedOffers().map(lockedCard).join('') +
      '</section>' +
      '<p class="foot">Brighter Days · Members Area</p></main>';
    prefetchProduct();
  }

  /* Enquanto a pessoa está na tela inicial, baixa as primeiras imagens da página do produto. */
  function prefetchProduct() {
    var go = function () {
      [v('img/covers/vol-1.webp')].concat(POPULAR.slice(0, 4).map(function (a) { return thumbUrl(a.n); }))
        .concat(OFFERS.map(function (o) { return o.banner; }))
        .forEach(function (u) { var im = new Image(); im.decoding = 'async'; im.src = u; });
    };
    if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 1500 }); else setTimeout(go, 600);
  }
  function thumbUrl(n) { return v('img/popular/' + String(n).padStart(3, '0') + '-t.webp'); }

  /* Topo de cada página de produto: "Welcome to" + nome + frase + capa. */
  function hero(p) {
    return '<section class="hero"><div class="hero-txt"><small>Welcome to</small><h1>' + esc(p.title) + '</h1>' +
      '<p>' + esc(p.text) + '</p></div>' +
      '<img class="hero-cv" src="' + p.cover + '" alt="" width="300" height="424" fetchpriority="high"></section>';
  }

  function product() {
    var pops = POPULAR.map(function (a, i) {
      return '<a class="pop" href="#/activity/' + a.n + '">' +
        '<div class="pop-img"><img src="' + thumbUrl(a.n) + '" alt="" width="340" height="510" decoding="async"' + (i < 4 ? '' : ' loading="lazy"') + '>' +
        '<span class="rank"><b>#' + (i + 1) + '</b> this week</span></div>' +
        '<div class="pop-b"><strong>' + esc(a.title) + '</strong><span>' + esc(a.cat) + '</span></div></a>';
    }).join('');
    var addons = ownedOffers().reduce(function (all, o) { return all.concat(o.docs); }, []);
    var promos = lockedOffers().map(function (o) {
      return '<a class="promo" href="#/unlock/' + o.id + '"><div class="prod-img"><img src="' + o.banner + '" alt="" width="960" height="536" decoding="async"><span class="lock-ic">' + ICON.lock + '</span></div>' +
        '<div class="promo-b"><small>Recommended for you</small><strong>' + esc(o.title) + '</strong><span>See What&rsquo;s Inside</span></div></a>';
    }).join('');

    app.innerHTML = header(true) + '<main class="wrap">' +
      hero({ title: 'Brighter Days', text: '150+ simple activities for memory, conversation, movement and joy.', cover: v('img/covers/vol-1.webp') }) +
      '<section class="sec"><div class="sec-h"><h2>Most loved activities</h2><span>What families are enjoying this week</span></div>' +
        '<div class="rail rail-free" id="railPop">' + pops + '</div></section>' +
      (promos ? '<section class="sec"><div class="sec-h"><h2>Discover our other products</h2><span>To complete your routine</span></div>' +
        '<div class="rail" id="railPromo">' + promos + '</div><div class="dots" id="dotsPromo"></div></section>' : '') +
      '<section class="sec"><div class="sec-h"><h2>Your activity books</h2><span>Included in your plan</span></div>' +
        VOLUMES.map(docCard).join('') + '</section>' +
      (addons.length ? '<section class="sec"><div class="sec-h"><h2>Your add-ons</h2><span>Unlocked in your account</span></div>' +
        addons.map(docCard).join('') + '</section>' : '') +
      '<section class="sec bonus-box"><div class="sec-h"><h2>Exclusive bonuses</h2><span>Included in your plan</span></div>' +
        BONUSES.map(docCard).join('') + '</section>' +
      '<p class="foot">Brighter Days · Members Area</p></main>';
    marquee($('#railPop'), 32);
    if (promos) slides($('#railPromo'), $('#dotsPromo'), 3000);
  }

  /* Tela de carregamento: fica no mínimo 0,9 s e espera as primeiras imagens (até 2,5 s). */
  var loader = $('#loader');
  function showLoader() {
    loader.hidden = false;
    loader.classList.remove('out');
    var t0 = Date.now();
    var imgs = [].slice.call(app.querySelectorAll('.hero-cv, #railPop img')).slice(0, 4);
    var ready = Promise.all(imgs.map(function (im) {
      return im.complete ? 0 : new Promise(function (r) { im.addEventListener('load', r); im.addEventListener('error', r); });
    }));
    Promise.race([ready, new Promise(function (r) { setTimeout(r, 2500); })]).then(function () {
      setTimeout(function () {
        loader.classList.add('out');
        setTimeout(function () { loader.hidden = true; }, 350);
      }, Math.max(0, 450 - (Date.now() - t0)));
    });
  }

  /* ---------- Leitor ---------- */
  var viewer = $('#viewer'), vScroll = $('#vScroll'), vPages = $('#vPages');
  var vTitle = $('#vTitle'), vCount = $('#vCount'), vDl = $('#vDownload'), vCta = $('#vCta');
  var zoom = 1, total = 0, io = null, openKey = '';
  var vZoom = $('.v-zoom'), gPrev = $('#gPrev'), gNext = $('#gNext');

  function baseWidth() { return Math.min(vScroll.clientWidth, 760); }
  function setZoom(z, cx, cy) {
    z = Math.max(1, Math.min(3.5, z));
    cx = cx == null ? vScroll.clientWidth / 2 : cx;
    cy = cy == null ? vScroll.clientHeight / 2 : cy;
    var rx = (vScroll.scrollLeft + cx) / vScroll.scrollWidth;
    var ry = (vScroll.scrollTop + cy) / vScroll.scrollHeight;
    zoom = z;
    vPages.style.width = Math.round(baseWidth() * z) + 'px';
    vScroll.scrollLeft = rx * vScroll.scrollWidth - cx;
    vScroll.scrollTop = ry * vScroll.scrollHeight - cy;
  }

  /* Galeria (prévia e atividades em destaque): uma imagem por tela, deslizando para o lado. */
  var gItems = null, gIdx = 0;
  function openGallery(o) {
    openKey = o.key;
    gItems = o.items;
    viewer.classList.add('gallery');
    vZoom.hidden = true;
    vPages.style.width = '';
    vPages.innerHTML = o.items.map(function (it, i) {
      return '<div class="g-item"><img src="' + it.src + '" alt="" decoding="async"' + (Math.abs(i - o.start) > 1 ? ' loading="lazy"' : '') + '></div>';
    }).join('');
    gPrev.hidden = gNext.hidden = o.items.length < 2;
    viewer.hidden = false;
    document.body.classList.add('lock');
    vScroll.scrollTop = 0;
    vScroll.scrollLeft = o.start * vScroll.clientWidth;
    gShow(o.start);
  }
  function gShow(i) {
    gIdx = i;
    var it = gItems[i];
    vTitle.textContent = it.title;
    vCount.textContent = gItems.length > 1 ? (i + 1) + ' of ' + gItems.length + ' · swipe for more' : '';
    if (it.download) { vDl.hidden = false; vDl.href = it.download; vDl.setAttribute('download', it.file); }
    else vDl.hidden = true;
    if (it.cta) { vCta.hidden = false; vCta.href = it.cta.href; vCta.textContent = it.cta.label; }
    else vCta.hidden = true;
    gPrev.disabled = i === 0;
    gNext.disabled = i === gItems.length - 1;
  }
  function gGo(d) {
    var i = Math.max(0, Math.min(gItems.length - 1, gIdx + d));
    vScroll.scrollTo({ left: i * vScroll.clientWidth, behavior: 'smooth' });
  }
  vScroll.addEventListener('scroll', function () {
    if (!gItems) return;
    var i = Math.round(vScroll.scrollLeft / vScroll.clientWidth);
    if (i !== gIdx && gItems[i]) gShow(i);
  }, { passive: true });

  function openViewer(o) {
    if (openKey === o.key && !viewer.hidden) { if (o.start) jumpTo(o.start); return; }
    gItems = null;
    viewer.classList.remove('gallery');
    vZoom.hidden = false;
    gPrev.hidden = gNext.hidden = true;
    openKey = o.key;
    vTitle.textContent = o.title;
    total = o.pages.length;
    if (o.download) { vDl.hidden = false; vDl.href = o.download; vDl.setAttribute('download', o.file); }
    else vDl.hidden = true;
    if (o.cta) { vCta.hidden = false; vCta.href = o.cta.href; vCta.textContent = o.cta.label; }
    else vCta.hidden = true;
    vPages.innerHTML = o.pages.map(function (src, i) {
      return '<div class="v-page" data-i="' + (i + 1) + '" style="aspect-ratio:1/' + o.ratio + '">' +
        '<span class="ld">Page ' + (i + 1) + '</span>' +
        '<img src="' + src + '" alt="Page ' + (i + 1) + '" loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async" onload="this.previousSibling.remove()"></div>';
    }).join('');
    viewer.hidden = false;
    document.body.classList.add('lock');
    zoom = 1;
    vPages.style.width = baseWidth() + 'px';
    vScroll.scrollTop = 0;
    vScroll.scrollLeft = 0;
    vCount.textContent = total > 1 ? 'Page 1 of ' + total : '';
    if (io) io.disconnect();
    io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting && total > 1) vCount.textContent = 'Page ' + e.target.dataset.i + ' of ' + total;
      });
    }, { root: vScroll, rootMargin: '-45% 0px -45% 0px' });
    vPages.querySelectorAll('.v-page').forEach(function (el) { io.observe(el); });
    if (o.start && o.start > 1) jumpTo(o.start);
  }
  function jumpTo(p) {
    var el = vPages.querySelector('[data-i="' + p + '"]');
    if (!el) return;
    var imgs = vPages.querySelectorAll('img');
    for (var i = Math.max(0, p - 2); i < Math.min(imgs.length, p + 1); i++) imgs[i].loading = 'eager';
    requestAnimationFrame(function () {
      vScroll.scrollTop += el.getBoundingClientRect().top - vScroll.getBoundingClientRect().top - 8;
    });
  }
  function closeViewer() {
    viewer.hidden = true;
    gItems = null;
    viewer.classList.remove('gallery');
    openKey = '';
    vPages.innerHTML = '';
    if (io) io.disconnect();
    if (sheet.hidden) document.body.classList.remove('lock');
  }

  /* Pinça e toque duplo */
  var pinch = null, lastTap = 0;
  vScroll.addEventListener('touchstart', function (e) {
    if (gItems) return;
    if (e.touches.length === 2) {
      var a = e.touches[0], b = e.touches[1], r = vScroll.getBoundingClientRect();
      pinch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), z: zoom,
        cx: (a.clientX + b.clientX) / 2 - r.left, cy: (a.clientY + b.clientY) / 2 - r.top };
    } else if (e.touches.length === 1) {
      var now = Date.now(), t = e.touches[0];
      if (now - lastTap < 300) {
        var rr = vScroll.getBoundingClientRect();
        setZoom(zoom > 1.2 ? 1 : 2.2, t.clientX - rr.left, t.clientY - rr.top);
        e.preventDefault();
        lastTap = 0;
      } else lastTap = now;
    }
  }, { passive: false });
  vScroll.addEventListener('touchmove', function (e) {
    if (pinch && e.touches.length === 2) {
      e.preventDefault();
      var a = e.touches[0], b = e.touches[1];
      setZoom(pinch.z * Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) / pinch.d, pinch.cx, pinch.cy);
    }
  }, { passive: false });
  vScroll.addEventListener('touchend', function (e) { if (e.touches.length < 2) pinch = null; });
  gPrev.addEventListener('click', function () { gGo(-1); });
  gNext.addEventListener('click', function () { gGo(1); });
  document.addEventListener('keydown', function (e) {
    if (viewer.hidden || !gItems) return;
    if (e.key === 'ArrowRight') gGo(1);
    if (e.key === 'ArrowLeft') gGo(-1);
  });
  $('#vIn').addEventListener('click', function () { setZoom(zoom + 0.5); });
  $('#vOut').addEventListener('click', function () { setZoom(zoom - 0.5); });
  $('#vClose').addEventListener('click', goBackOrHome);
  window.addEventListener('resize', function () {
    if (viewer.hidden) return;
    if (gItems) vScroll.scrollLeft = gIdx * vScroll.clientWidth; else setZoom(zoom);
  });

  /* ---------- Janela de desbloqueio ---------- */
  var sheet = $('#sheet'), sheetBody = $('#sheetBody'), sheetOffer = null;
  function peekUrl(id, i, thumb) { return v('img/peek/' + id + '/' + i + (thumb ? '-t' : '') + '.webp'); }
  function openSheet(o) {
    sheetOffer = o;
    var peek = '';
    for (var i = 1; i <= o.peek; i++) {
      peek += '<button type="button" data-peek="' + i + '"><img src="' + peekUrl(o.id, i, true) + '" alt="" width="340" height="510"></button>';
    }
    sheetBody.innerHTML =
      '<button class="x" data-close aria-label="Close">' + ICON.x + '</button>' +
      '<div class="sh-body">' +
        '<span class="sh-tag">' + ICON.lock + 'Members-only add-on</span>' +
        '<h2>' + esc(o.title) + '</h2><div class="sh-sub">' + esc(o.sub) + '</div>' +
        '<p class="sh-txt">' + esc(o.text) + '</p>' +
        '<div class="peek rail" id="railPeek">' + peek + '</div>' +
        '<ul class="checks">' + o.checks.map(function (c) {
          var m = /^Bonus: /.test(c);
          return '<li>' + (m ? '<b>Bonus:</b> ' + esc(c.slice(7)) : esc(c)) + '</li>';
        }).join('') + '</ul>' +
      '</div>' +
      '<div class="price"><div class="price-v"><small>One-time payment</small><strong>' + o.price + '</strong></div>' +
        '<em>' + esc(o.anchor) + '</em>' +
        '<a class="btn btn-gold" href="' + o.checkout + '" rel="noopener">Unlock Now</a>' +
        '<p class="sh-safe">' + ICON.shield + 'Secure checkout · Instant access here</p></div>';
    sheet.hidden = false;
    document.body.classList.add('lock');
    sheetBody.scrollTop = 0;
    marquee($('#railPeek'), 26);
  }
  function closeSheet() { sheet.hidden = true; sheetBody.innerHTML = ''; sheetOffer = null; if (viewer.hidden) document.body.classList.remove('lock'); }
  sheet.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) { goBackOrHome(); return; }
    var pk = e.target.closest('[data-peek]');
    if (pk && sheetOffer) {
      var o = sheetOffer, items = [];
      for (var k = 1; k <= o.peek; k++) {
        items.push({ src: peekUrl(o.id, k), title: 'A peek inside', cta: { href: o.checkout, label: 'Unlock all for ' + o.price } });
      }
      openGallery({ key: 'peek-' + o.id, items: items, start: +pk.dataset.peek - 1 });
    }
  });

  /* ---------- Rotas ---------- */
  /* Cada entrada do histórico recebe um número: se não for a primeira, "voltar" usa o histórico. */
  var navIdx = 0, maxIdx = 0;
  function stamp() {
    if (history.state && typeof history.state.i === 'number') navIdx = history.state.i;
    else { navIdx = ++maxIdx; history.replaceState({ i: navIdx }, ''); }
    maxIdx = Math.max(maxIdx, navIdx);
  }
  function goBackOrHome() {
    if (!viewer.hidden && /^#\/unlock\//.test(location.hash)) { closeViewer(); return; }
    if (navIdx > 1) history.back();
    else location.hash = /^#\/(read|activity)\//.test(location.hash) ? '#/brighter-days' : '#/';
  }

  var currentBase = '';
  function route() {
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('/');

    /* Material de produto que a pessoa não tem leva à oferta; oferta de produto que já tem leva ao material. */
    var guard = parts[0] === 'read' ? docOffer(parts[1]) : parts[0] === 'unlock' ? offer(parts[1]) : null;
    if (guard && parts[0] === 'read' && !has(guard)) { location.replace('#/unlock/' + guard.id); return; }
    if (guard && parts[0] === 'unlock' && has(guard)) {
      location.replace(guard.docs.length ? '#/read/' + guard.docs[0].id : '#/' + MAIN.id);
      return;
    }
    var base = parts[0] === 'read' || parts[0] === 'activity' ? 'brighter-days'
      : parts[0] === 'unlock' ? (currentBase || 'home')
      : parts[0] === 'brighter-days' ? 'brighter-days' : 'home';
    if (base !== currentBase) {
      var fromHome = currentBase === 'home';
      currentBase = base;
      clearTimers();
      if (base === 'brighter-days') product(); else home();
      window.scrollTo(0, 0);
      if (base === 'brighter-days' && fromHome && parts[0] === 'brighter-days') showLoader();
    }

    if (parts[0] === 'read' && window.DOCS[parts[1]]) {
      closeSheet();
      var meta = window.DOCS[parts[1]];
      var label = VOLUMES.concat(BONUSES, ADDON_DOCS).filter(function (d) { return d.id === parts[1]; })[0];
      var pages = [];
      for (var i = 1; i <= meta.pages; i++) pages.push(pageUrl(parts[1], i));
      openViewer({ key: 'read-' + parts[1], title: label ? label.kicker + ' · ' + label.title : 'Brighter Days',
        pages: pages, ratio: meta.ratio, download: v(meta.pdf), file: meta.file, start: +parts[2] || 1 });
    } else if (parts[0] === 'activity') {
      closeSheet();
      var a = POPULAR.filter(function (x) { return x.n === +parts[1]; })[0];
      if (!a) { location.hash = '#/brighter-days'; return; }
      if (openKey === 'popular' && !viewer.hidden) return;
      openGallery({ key: 'popular', start: POPULAR.indexOf(a), items: POPULAR.map(function (x) {
        return { src: pageUrl('vol-1', x.n + 5), title: 'Activity ' + x.n + ' · ' + x.title,
          download: pageUrl('vol-1', x.n + 5), file: 'Activity ' + x.n + ' - ' + x.title + '.webp',
          cta: { href: '#/read/vol-1/' + (x.n + 5), label: 'Open in Volume 1' } };
      }) });
    } else if (parts[0] === 'unlock' && offer(parts[1])) {
      closeViewer();
      if (sheet.hidden || !sheetOffer || sheetOffer.id !== parts[1]) openSheet(offer(parts[1]));
    } else {
      closeViewer();
      closeSheet();
    }
  }

  /* Início: só depois que o auth.js confirmar o login. */
  window.addEventListener('member-ready', function (e) {
    owned = {};
    (e.detail.products || []).forEach(function (id) { owned[String(id)] = true; });
    window.addEventListener('hashchange', function () { stamp(); route(); });
    history.replaceState({ i: 1 }, '');
    navIdx = maxIdx = 1;
    route();
  }, { once: true });
})();
