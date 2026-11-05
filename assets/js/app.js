/* OHS Foundation — shared interactions (nav, scroll reveal, community events, share links) */
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

  /* ─── Sticky header ─────────────────────────────────────────────────── */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Light / dark switch ───────────────────────────────────────────── */
  // The page follows the device's setting unless the visitor picks the other
  // theme with the button; that choice is remembered (localStorage "ohs-theme")
  // and applied before the page is drawn by the small script in <head>.
  // Picking the theme the device already uses forgets the choice again, so
  // the page goes back to following the device.
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    var root = document.documentElement;
    var deviceDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false };
    var currentTheme = function () {
      return root.getAttribute('data-theme') || (deviceDark.matches ? 'dark' : 'light');
    };
    var labelThemeBtn = function () {
      themeBtn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    };
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      var deviceTheme = deviceDark.matches ? 'dark' : 'light';
      try {
        if (next === deviceTheme) { root.removeAttribute('data-theme'); localStorage.removeItem('ohs-theme'); }
        else { root.setAttribute('data-theme', next); localStorage.setItem('ohs-theme', next); }
      } catch (e) { root.setAttribute('data-theme', next); }
      labelThemeBtn();
    });
    if (deviceDark.addEventListener) deviceDark.addEventListener('change', labelThemeBtn);
    labelThemeBtn();
    themeBtn.hidden = false;
  }

  /* ─── Mobile nav ────────────────────────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var mnav   = document.querySelector('.mobile-nav');
  if (toggle && mnav) {
    toggle.addEventListener('click', function () {
      setMenu(!mnav.classList.contains('open'));
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    // Escape closes the menu and puts the keyboard focus back on the button.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mnav.classList.contains('open')) { setMenu(false); toggle.focus(); }
    });
  }
  function setMenu(open) {
    mnav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  /* ─── Wide tables ───────────────────────────────────────────────────── */
  // A table too wide for the screen scrolls sideways inside its wrapper; make
  // that wrapper reachable with the keyboard so it can be scrolled with arrows.
  var tableWraps = document.querySelectorAll('.table-wrap');
  function markScrollableTables() {
    tableWraps.forEach(function (w) {
      if (w.scrollWidth > w.clientWidth + 1) {
        w.setAttribute('tabindex', '0'); w.setAttribute('role', 'region');
        w.setAttribute('aria-label', 'Table (scrolls sideways)');
      } else {
        w.removeAttribute('tabindex'); w.removeAttribute('role'); w.removeAttribute('aria-label');
      }
    });
  }
  if (tableWraps.length) { markScrollableTables(); window.addEventListener('resize', markScrollableTables); }

  /* ─── Reveal on scroll ──────────────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    // An element appears once 12% of it is on screen — or, if it's much taller
    // than the screen (a long blog post body can never be 12% visible), once
    // it fills a quarter of the screen.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting &&
            (e.intersectionRatio >= 0.12 || e.intersectionRect.height >= window.innerHeight * 0.25)) {
          e.target.classList.add('in'); io.unobserve(e.target);
        }
      });
    }, { threshold: [0, 0.01, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12], rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ─── Community events (fetched from netlify/functions/community-events) */
  var EVENT_CATEGORY_LABEL = {
    'community': 'Community call',
    'working-group': 'Working group',
    'in-person': 'In-person'
  };
  var EVENT_CATEGORY_TAG_CLASS = {
    'community': 'tag teal etag',
    'working-group': 'tag core etag',
    'in-person': 'tag etag'
  };
  var DETAILS_ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  var BTN_ARROW = '<svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  function formatEventTime(iso) {
    var d = new Date(iso);
    return {
      date: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }),
      local: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
      utc: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
    };
  }

  var discordUrl = '';

  function renderEventCard(e) {
    var t = formatEventTime(e.start);
    var label = EVENT_CATEGORY_LABEL[e.category] || 'Event';
    var tagClass = EVENT_CATEGORY_TAG_CLASS[e.category] || 'tag etag';
    var whereText = e.isOnline ? 'Online' : (e.location ? esc(e.location) : 'Location to be confirmed');

    var actions = '';
    if (e.joinUrl) {
      actions += '<a href="' + esc(e.joinUrl) + '" target="_blank" rel="noopener" class="btn btn-primary">Join call ' + BTN_ARROW + '</a>';
    }
    if (discordUrl) {
      actions += '<a href="' + esc(discordUrl) + '" target="_blank" rel="noopener" class="btn btn-ghost">Drop questions in Discord ' + BTN_ARROW + '</a>';
    }

    var dialin = e.dialInUrl
      ? '<div class="event-dialin"><a href="' + esc(e.dialInUrl) + '" target="_blank" rel="noopener">More phone numbers</a></div>'
      : '';

    return '<details class="event-row event-expandable" data-category="' + esc(e.category) + '">' +
      '<summary>' +
        '<div class="when">' + esc(t.date) + '</div>' +
        '<div class="event-summary-main">' +
          '<div class="what">' + esc(e.title) + '</div>' +
          '<div class="where">' + esc(t.local) + ' your time · ' + esc(t.utc) + ' UTC · ' + whereText + '</div>' +
        '</div>' +
        '<div class="event-summary-meta">' +
          '<span class="' + tagClass + '">' + esc(label) + '</span>' +
          '<span class="event-toggle-cue">Details ' + DETAILS_ARROW + '</span>' +
        '</div>' +
      '</summary>' +
      '<div class="event-expanded-body">' +
        '<div class="event-actions">' + actions + '</div>' +
        dialin +
      '</div>' +
    '</details>';
  }

  function initCommunityEvents() {
    var list = document.querySelector('.event-list');
    if (!list) return;
    var loading = list.querySelector('[data-events-loading]');
    discordUrl = list.getAttribute('data-discord') || '';

    // Hide pinned events whose end date has passed (data-ends="YYYY-MM-DD").
    var today = new Date().toISOString().slice(0, 10);
    list.querySelectorAll('[data-pinned][data-ends]').forEach(function (row) {
      if (row.getAttribute('data-ends') < today) row.remove();
    });
    var pinned = list.querySelector('[data-pinned]');

    fetch('/.netlify/functions/community-events')
      .then(function (r) { if (!r.ok) throw new Error('bad status'); return r.json(); })
      .then(function (data) {
        if (loading) loading.remove();
        var events = data && data.events ? data.events : [];
        if (!events.length) return;
        var html = events.map(renderEventCard).join('');
        if (pinned) pinned.insertAdjacentHTML('beforebegin', html);
        else list.insertAdjacentHTML('afterbegin', html);
      })
      .catch(function () {
        if (loading) loading.querySelector('.where').textContent =
          "Couldn't load the latest schedule — subscribe to the calendar above to see all upcoming calls.";
      });
  }

  function initEventFilters() {
    var bar = document.querySelector('.event-filters');
    if (!bar) return;
    var chips = bar.querySelectorAll('.filter-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var filter = chip.getAttribute('data-filter');
        document.querySelectorAll('.event-list [data-category]').forEach(function (row) {
          row.style.display = (filter === 'all' || row.getAttribute('data-category') === filter) ? '' : 'none';
        });
      });
    });
  }

  initCommunityEvents();
  initEventFilters();

  /* ─── Current year ──────────────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ─── Copy-link buttons (blog share row) ──────────────────────────── */
  document.querySelectorAll('[data-copy-link]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var label = btn.querySelector('[data-copy-label]');
      var url = btn.getAttribute('data-copy-link');
      var done = function () {
        if (!label) return;
        label.textContent = 'Link copied';
        setTimeout(function () { label.textContent = 'Copy link'; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
      } else {
        window.prompt('Copy this link:', url);
      }
    });
  });

})();
