/* OHS Foundation — shared interactions + content hydration from content.json */
(function () {
  'use strict';

  /* ─── HTML escaping ─────────────────────────────────────────────────── */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ─── Static SVG assets ─────────────────────────────────────────────── */
  var ECO_ICONS = {
    core:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    toolkit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>',
    ai:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>'
  };

  var ARROW = '<svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function checkmark(colorClass) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--' + colorClass + ')" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  }

  /* ─── Render functions ──────────────────────────────────────────────── */

  function renderPillarsHead(s) {
    return '<span class="eyebrow">' + esc(s.eyebrow) + '</span>' +
      '<h2 class="section-title" style="margin-top:18px">' + esc(s.heading) + '</h2>' +
      '<p class="lead">' + esc(s.lead) + '</p>';
  }

  function renderHeroDiagram(d, pillars) {
    var tiles = d.appTileColors.map(function (c) {
      return '<div class="dz-t-app" style="background:color-mix(in oklch,' + c + ' 12%,white);border-color:color-mix(in oklch,' + c + ' 26%,transparent)"><span class="dz-t-icon" style="background:' + c + '"></span></div>';
    }).join('');

    var cols = pillars.map(function (p) {
      return '<div class="dz-t-col dz-' + esc(p.id) + '">' +
        '<div class="dz-t-col-cap"></div>' +
        '<div class="dz-t-col-num">Pillar ' + esc(p.num) + ' · ' + esc(p.statusShort) + '</div>' +
        '<div class="dz-t-col-name">' + esc(p.name) + '</div>' +
        '<div class="dz-t-col-desc">' + esc(p.diagramDesc) + '</div>' +
        '<div class="dz-t-blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
        '</div>';
    }).join('');

    var chips = d.baseChips.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('');

    return '<div class="dz-t-apps">' +
        '<div class="dz-t-apps-head">' +
          '<div class="dz-text"><div class="dz-ll">Built on top</div><div class="dz-lt">' + esc(d.appsLabel) + '</div></div>' +
          '<div class="dz-t-by">' + esc(d.appsByline) + '</div>' +
        '</div>' +
        '<div class="dz-t-grid">' + tiles + '<div class="dz-t-app dz-t-more">+ more</div></div>' +
      '</div>' +
      '<div class="dz-t-rest">' + esc(d.connectorTop) + '</div>' +
      '<div class="dz-t-pillars">' + cols + '</div>' +
      '<div class="dz-t-rest">' + esc(d.connectorBottom) + '</div>' +
      '<div class="dz-t-base">' +
        '<div class="dz-text"><div class="dz-ll">' + esc(d.baseLabel) + '</div><div class="dz-lt">' + esc(d.baseTitle) + '</div></div>' +
        '<div class="dz-t-chips">' + chips + '</div>' +
      '</div>';
  }

  function renderPillarCards(pillars) {
    return pillars.map(function (p) {
      var bullets = p.cardBullets.map(function (b) {
        return '<li>' + checkmark(p.colorClass) + ' ' + esc(b) + '</li>';
      }).join('');
      return '<article class="card pillar ' + esc(p.colorClass) + '">' +
        '<span class="glow" aria-hidden="true"></span>' +
        '<div class="pillar-top"><span class="tag ' + esc(p.colorClass) + '">' + esc(p.tagLabel) + '</span></div>' +
        '<h3>' + esc(p.cardHeading) + '</h3>' +
        '<p>' + esc(p.cardBody) + '</p>' +
        '<ul>' + bullets + '</ul>' +
        '<div class="pillar-foot"><a href="' + esc(p.cardLinkHref) + '" class="textlink">' + esc(p.cardLinkLabel) + ' ' + ARROW + '</a></div>' +
        '</article>';
    }).join('');
  }

  function renderEcoPillars(pillars) {
    return pillars.map(function (p) {
      var icon = ECO_ICONS[p.id] || ECO_ICONS.core;
      return '<button type="button" class="eco-pillar" data-pillar="' + esc(p.id) + '" aria-label="Highlight ' + esc(p.name) + ' projects">' +
        '<span class="icon-chip ' + esc(p.colorClass) + '" aria-hidden="true">' + icon + '</span>' +
        '<span>' +
          '<span class="ep-title">Pillar ' + esc(p.num) + ' · ' + esc(p.name) + '</span>' +
          '<span class="ep-sub">' + esc(p.ecoSub) + '</span>' +
        '</span>' +
        '<span class="ep-count">' + esc(p.ecoCount) + '</span>' +
        '</button>';
    }).join('');
  }

  function renderEcoNodes(nodes) {
    return nodes.map(function (n) {
      return '<div class="eco-node" data-belongs="' + esc(n.pillar) + '">' +
        '<div class="en-tag">' + esc(n.tag) + '</div>' +
        '<div class="en-name">' + esc(n.name) + '</div>' +
        '<div class="en-desc">' + esc(n.desc) + '</div>' +
        '</div>';
    }).join('');
  }

  function renderPartners(partners) {
    return partners.map(function (p) {
      return '<span class="partner-chip"><span class="pdot" style="background:' + esc(p.color) + '"></span>' + esc(p.name) + '</span>';
    }).join('');
  }

  /* ─── DOM hydration ─────────────────────────────────────────────────── */
  function set(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function renderContent(data) {
    set('widget-pillars-head',  renderPillarsHead(data.pillarsSection));
    set('widget-hero-diagram',  renderHeroDiagram(data.diagram, data.pillars));
    set('widget-pillar-grid',   renderPillarCards(data.pillars));
    set('widget-eco-pillars',   renderEcoPillars(data.pillars));
    set('widget-eco-nodes',     renderEcoNodes(data.ecosystemNodes));
    set('widget-partners',      renderPartners(data.partners));
  }

  /* ─── Ecosystem map interaction ─────────────────────────────────────── */
  function initEcosystem() {
    var stage = document.querySelector('[data-ecosystem]');
    if (!stage) return;
    var btns = stage.querySelectorAll('[data-pillar]');

    function activate(key) {
      stage.setAttribute('data-active', key);
      btns.forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-pillar') === key);
      });
      stage.querySelectorAll('[data-belongs]').forEach(function (n) {
        n.classList.toggle('dim', n.getAttribute('data-belongs') !== key);
      });
    }

    btns.forEach(function (b) {
      b.addEventListener('mouseenter', function () { activate(b.getAttribute('data-pillar')); });
      b.addEventListener('click',      function () { activate(b.getAttribute('data-pillar')); });
      b.addEventListener('focus',      function () { activate(b.getAttribute('data-pillar')); });
    });
    stage.addEventListener('mouseleave', function () {
      stage.removeAttribute('data-active');
      btns.forEach(function (b) { b.classList.remove('is-active'); });
      stage.querySelectorAll('[data-belongs]').forEach(function (n) { n.classList.remove('dim'); });
    });
  }

  /* ─── Sticky header ─────────────────────────────────────────────────── */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Mobile nav ────────────────────────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var mnav   = document.querySelector('.mobile-nav');
  if (toggle && mnav) {
    toggle.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mnav.classList.remove('open'); });
    });
  }

  /* ─── Reveal on scroll ──────────────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ─── Count-up animation ────────────────────────────────────────────── */
  function animateCount(el) {
    var target   = parseFloat(el.getAttribute('data-count'));
    var suffix   = el.getAttribute('data-suffix')   || '';
    var prefix   = el.getAttribute('data-prefix')   || '';
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ─── Accordion ─────────────────────────────────────────────────────── */
  document.querySelectorAll('[data-accordion]').forEach(function (acc) {
    acc.querySelectorAll('[data-acc-head]').forEach(function (h) {
      h.addEventListener('click', function () {
        var item = h.closest('[data-acc-item]');
        var open = item.classList.contains('open');
        acc.querySelectorAll('[data-acc-item]').forEach(function (i) { i.classList.remove('open'); });
        if (!open) item.classList.add('open');
      });
    });
  });

  /* ─── Current year ──────────────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ─── Load content.json and hydrate widgets ─────────────────────────── */
  if (document.getElementById('widget-pillar-grid')) {
    fetch('content.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        renderContent(data);
        initEcosystem();
      })
      .catch(function () {
        // Static HTML fallback stays; still wire up ecosystem map
        initEcosystem();
      });
  } else {
    initEcosystem();
  }

})();
