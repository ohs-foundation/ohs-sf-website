/* OHS Foundation — shared interactions */
(function () {
  'use strict';

  /* Sticky header border on scroll */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var mnav = document.querySelector('.mobile-nav');
  if (toggle && mnav) {
    toggle.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mnav.classList.remove('open'); });
    });
  }

  /* Reveal on scroll */
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

  /* Count-up for stats */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = (el.getAttribute('data-decimals')) ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
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

  /* Interactive ecosystem map: hover/click a pillar to highlight its projects */
  var ecosystem = document.querySelector('[data-ecosystem]');
  if (ecosystem) {
    var pillars = ecosystem.querySelectorAll('[data-pillar]');
    function setActive(key) {
      ecosystem.setAttribute('data-active', key);
      pillars.forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-pillar') === key);
      });
      ecosystem.querySelectorAll('[data-belongs]').forEach(function (node) {
        var match = node.getAttribute('data-belongs') === key;
        node.classList.toggle('dim', !match);
      });
    }
    pillars.forEach(function (p) {
      p.addEventListener('mouseenter', function () { setActive(p.getAttribute('data-pillar')); });
      p.addEventListener('click', function () { setActive(p.getAttribute('data-pillar')); });
      p.addEventListener('focus', function () { setActive(p.getAttribute('data-pillar')); });
    });
    ecosystem.addEventListener('mouseleave', function () {
      ecosystem.removeAttribute('data-active');
      pillars.forEach(function (p) { p.classList.remove('is-active'); });
      ecosystem.querySelectorAll('[data-belongs]').forEach(function (n) { n.classList.remove('dim'); });
    });
  }

  /* Simple tab/accordion toggles (used on Foundation/Projects pages) */
  document.querySelectorAll('[data-accordion]').forEach(function (acc) {
    var heads = acc.querySelectorAll('[data-acc-head]');
    heads.forEach(function (h) {
      h.addEventListener('click', function () {
        var item = h.closest('[data-acc-item]');
        var open = item.classList.contains('open');
        acc.querySelectorAll('[data-acc-item]').forEach(function (i) { i.classList.remove('open'); });
        if (!open) item.classList.add('open');
      });
    });
  });

  /* Mark current year */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
