(function () {
  // ─── Selector group definitions ────────────────────────────────────
  // Add new groups here to create more selectors.
  // Each group needs: containerId, storageKey, label, options[], and an optional autoDetect function.
  // Tab titles in your MDX <Tabs> must exactly match option names.

  var SELECTORS = [
    {
      containerId: 'platform-selector',
      storageKey: 'nika-platform-selected',
      label: 'Select your platform:',
      autoDetect: function () {
        var ua = navigator.userAgent || '';
        var p = navigator.platform || '';
        if (/Mac/i.test(p) || /Mac/i.test(ua)) return 'macOS';
        if (/Win/i.test(p) || /Win/i.test(ua)) return 'Windows';
        return 'Linux';
      },
      options: [
        { name: 'macOS',   svg: '<svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>' },
        { name: 'Windows', svg: '<svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor"><path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"/></svg>' },
        { name: 'Linux',   svg: '<svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor"><path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1C175 124.4 162.6 128 151 130.7c-10.7-22.8-1.6-54.9 32-54.9zm-48.6 348.3c-35.2 40.3-93 20.3-79.1-30 2.3-8.4 7.3-16 12.7-22.5 3.5 1.9 12.9 9 20 12.7-3.4 3-5.3 7.5-5.3 12.5 0 13.3 16.3 19.2 25.3 10.5l-1 14 17.5 13.5c-1.7 4.5-6.5 8.5-10.3 11.7-7.1 4.6-7.8-2.1-7.2-6.7zm10.6-18.9c-.6-1.6-1.1-3.4-1.5-5.2-.3-1.3-.6-2.8-.9-4.4-1-5.1-2.3-11.7-5.4-16.7-3.3-5.3-8.8-8.4-17.4-10.8-4.4-1.2-8.3-3-11.5-5.5-3.2-2.5-5.7-5.6-7.4-9.7-3.5-8.2-2.8-19.5-2.8-32.3.1-2.6.6-5 1.5-7.2.9-2.2 2.2-4.1 3.8-5.7.9-.9 1.9-1.7 3-2.3-2.6 7.5-3.4 15.7-1.1 23.6 2.8 9.2 9.9 16.3 19.3 19.5 3 1 5.3 2.4 7 4.4 1.7 2 2.8 4.6 3.2 8 .7 7.6-2.5 15.5-3.9 23.1-.6 3.1-.7 6.6.4 9.3 1.1 2.7 3.3 4.5 5.9 5.8-.3-.1-.5-.2-.7-.2zm91.5 24.4c-21.2 6.8-42.4-4.4-59-24.2l19.2-14.5c-2.1-4.1-4-8.5-5.7-12.9-3.5 1.5-8.7 1.5-12.1-.7-3.5-2.2-3.4-7.2-3.5-10.8-.1-3.3-.1-6.7-.1-10l-5.2-.8c-2.9-.5-5.8-1.2-8.2-3.2-2.4-2-3.9-5.2-3.3-8.6.6-3 2.6-5.1 5-6.6 2.5-1.5 5.4-2.4 8.5-3.1-1.1-4.2-1.4-8.7-.8-13.3 2.7-.8 5.7-1.4 8.8-1.6.5 5.4 2 10.3 4.5 14.5-6.3 2.3-12.4 6.4-8.8 12.4 2.2 3.6 7.9 5.3 12.2 5.3l2.4-.1c6.2-.4 11.7-3.8 15.5-9.1 3.8-5.3 5.8-12.3 6-19.4.5-14.2-3.4-27.3-10.5-38.8-7.1-11.6-17.4-21.3-29.6-28.7.7-3.7.8-7.6.3-11.6 17.5 5.5 31.9 17.6 41.3 33.1 9.4 15.6 13.9 34.6 13.3 53.8-.3 10 3.6 18.6 11.6 21.6 8 3 19.3-1.1 27.4-10.5 8.1-9.4 12.9-23.4 7.5-38.3-5.4-14.9-20.2-26.2-27.6-42.4-7.4-16.1-7.2-37.3 7.6-50.6 3-2.5 6.3-4.4 9.8-5.8-2 3.5-3.2 7.5-3.5 11.8-.9 13.6 6.2 26.6 12.7 38.3 6.5 11.7 12.4 22.1 10.8 32.6-.5 3.5-1.8 6.8-3.7 9.8-1.9 3-4.4 5.6-7.2 7.9-11.3 8.9-26 13.1-37.4 23.1-11.4 10-19.4 26.2-12.2 44.1.9 2.3 2.1 4.4 3.5 6.3l-33.3 25.5zm28.6-21.9l10.2-7.8c2.7 3.5 5.7 6.7 9 9.4-6.2 2.6-12.8 1.5-19.2-1.6zm100.8-122.9c-1.4 3.6-5.7 6.9-10.5 9.7-4.8 2.8-10.1 5-14.5 6.7-1.3-4.5-3.1-8.8-5.3-12.7 2.3-1.1 4.8-2.4 7.4-3.8 2.6-1.4 5.2-3.1 7-5.2 3.7-4.2 1.4-7.6-5.2-7.6-6.7 0-17.2 4.2-17.2 7.7 0 1.2.8 2.5 1.8 3.8-1.3-.1-2.6-.1-3.8 0-1.4-2.8-1.3-6.5 1.3-9.6 2.6-3.1 7.2-5.5 12.7-6.4 5.5-.9 11.9-.2 16.5 3.2s6.7 9.7 3.8 14.2zm-76.1-41.3c10.3 7.2 18.6 16.3 24.5 26.7-5.2 1.1-10.1 3.6-14.2 6.7-5.3-9.3-13.3-17.1-23.3-22.1 3.6-4.7 8-8.6 13-11.3zm-19 82.6c-1.8-5.3-2.5-10.9-2.1-16.5 13.9 10 26.3 18.1 42.5 20.9 9.6 1.7 19 1.1 27.4-2.2.7 2.6 1.2 5.3 1.6 8-8.3 3.5-17.6 4.4-27.1 3.1-18.1-2.5-30.4-13.5-42.3-13.3z"/></svg>' }
      ]
    },
    {
      containerId: 'gis-selector',
      storageKey: 'nika-gis-selected',
      label: 'Select your GIS platform:',
      options: [
        { name: 'QGIS',        svg: '<svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><polygon points="17.613,17.625 21.97,17.612 17.969,13.625 13.613,13.625 13.613,17.625 17.613,22.082 "/><polygon points="31.613,27.222 23.989,19.624 19.613,19.625 19.613,23.958 26.853,31.625 31.613,31.625 "/><path d="M18,25.185c-0.682,0.157-1.17,0.195-1.901,0.195c-5.229,0-9.677-4.3-9.677-9.876c0-5.576,4.399-9.781,9.677-9.781 s9.482,4.205,9.482,9.781c0,0.907-0.155,1.961-0.364,2.788L30.1,22.95c1.248-2.187,1.946-4.729,1.946-7.482 c0-8.594-6.858-15.028-16.044-15.028C6.858,0.439,0,6.831,0,15.467c0,8.678,6.858,15.197,16.001,15.197c2.361,0,4.224-0.3,6.2-1.09 L18,25.185z"/></svg>' },
        { name: 'ArcGIS Pro',  svg: '<svg width="16" height="16" viewBox="0 0 64 64" fill="currentColor"><defs><mask id="gMask"><path fill="white" d="M4,16.72132V52.05835l27.09921,11.75358c.57376,.24888,1.22642,.25029,1.80018,.00141l22.71627-9.85377c2.6619-1.15467,4.38435-3.77935,4.38435-6.68089V11.94226L32.90079,.18806c-.57376-.24888-1.2283-.24842-1.80206,.00047L8.38435,10.04043c-2.6619,1.15467-4.38435,3.77935-4.38435,6.68089Z"/><path fill="black" d="M32.00009,12.9c-11.10105,0-20.10009,8.99913-20.10009,20.1s8.99904,20.1,20.10009,20.1,20.09991-8.99904,20.09991-20.1-8.99904-20.1-20.09991-20.1Zm0,35.56645c-4.07235,0-7.78547-1.53288-10.59848-4.05075,.17123-1.27554,.76553-2.90473,1.6029-4.28999,.85579-1.41608-.31128-2.64543-1.6184-3.29899s-4.52131-1.50215-5.22502-2.86735,1.14756-2.3543,2.53273-3.13578c1.38517-.78139-.22138-2.57157,.83373-3.48271,1.4851-1.28232,2.23768-.90503,2.8544-2.65172,.41449-1.17382-.37346-2.30296-1.30566-3.78168,4.32455-4.18551,8.68928-4.50611,10.9238-4.23884,7.96235,.95235,3.43351,3.56659,4.01735,5.06045s2.98694,1.97987,2.77213,4.27127c-.14005,1.49385-3.12906,.90665-4.01986,.90665-1.52358,0-5.07307,2.53369-4.83875,4.9168,.28466,2.89379,1.28925,3.14205,3.16441,3.18107,1.87534,.03912,3.08066,.50795,2.45555,2.03153-.62493,1.52367-.83665,3.31706-.28976,5.46575,.54707,2.14869,2.14887,1.09395,3.00813,.15628,.85962-.93758,3.39892-3.5551,3.35989-5.19594-.03921-1.64083,1.3673-2.30488,2.22674-3.67227,.85944-1.3673-.05015-3.82886-.05015-3.82886,1.58722,0,4.20146,.03823,4.09314,2.50567-.38495,8.77228-7.11823,15.9994-15.89881,15.9994Z"/></mask></defs><rect height="64" width="64" mask="url(#gMask)"/></svg>' }
      ]
    }
  ];

  // ─── Shared styles (injected once) ─────────────────────────────────
  var stylesInjected = false;

  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    var style = document.createElement('style');
    style.textContent = [
      '.ps-container { margin: 0.5rem 0 1.5rem; }',
      '.ps-group {',
      '  display: inline-flex;',
      '  border-radius: 8px;',
      '  overflow: hidden;',
      '  border: 1px solid var(--border-color, #e2e8f0);',
      '}',
      '.ps-btn {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '  padding: 8px 18px;',
      '  font-size: 14px;',
      '  font-weight: 500;',
      '  font-family: inherit;',
      '  border: none;',
      '  cursor: pointer;',
      '  transition: background 0.15s, color 0.15s;',
      '  background: var(--bg-secondary, #f8fafc);',
      '  color: var(--text-secondary, #64748b);',
      '}',
      '.ps-btn:not(:last-child) {',
      '  border-right: 1px solid var(--border-color, #e2e8f0);',
      '}',
      '.ps-btn:hover {',
      '  background: var(--bg-hover, #f1f5f9);',
      '}',
      '.ps-btn.ps-active {',
      '  background: #003646;',
      '  color: #c5ff5a;',
      '}',
      '.ps-btn .ps-icon {',
      '  display: inline-flex;',
      '  align-items: center;',
      '}',
      '.ps-label {',
      '  font-size: 13px;',
      '  font-weight: 600;',
      '  color: var(--text-secondary, #64748b);',
      '  margin-bottom: 6px;',
      '}',
      '',
      '/* Hide native tab buttons for selector-controlled tab groups */',
      '.ps-controlled [role="tablist"] {',
      '  display: none !important;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  // ─── Generic selector logic ────────────────────────────────────────

  function getStored(cfg) {
    var stored = localStorage.getItem(cfg.storageKey);
    if (stored) return stored;
    if (cfg.autoDetect) return cfg.autoDetect();
    return cfg.options[0].name;
  }

  function buildSelector(cfg) {
    var container = document.getElementById(cfg.containerId);
    if (!container) return;
    if (container.querySelector('.ps-group')) return; // already built

    container.className = 'ps-container';
    container.innerHTML = '';

    var label = document.createElement('div');
    label.className = 'ps-label';
    label.textContent = cfg.label;
    container.appendChild(label);

    var group = document.createElement('div');
    group.className = 'ps-group';

    var current = getStored(cfg);

    cfg.options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.className = 'ps-btn' + (opt.name === current ? ' ps-active' : '');
      btn.setAttribute('data-selector', cfg.containerId);
      btn.setAttribute('data-option', opt.name);

      var icon = document.createElement('span');
      icon.className = 'ps-icon';
      icon.innerHTML = opt.svg;
      btn.appendChild(icon);

      btn.appendChild(document.createTextNode(opt.name));

      btn.addEventListener('click', function () {
        selectOption(cfg, opt.name);
      });

      group.appendChild(btn);
    });

    container.appendChild(group);
  }

  function selectOption(cfg, name) {
    localStorage.setItem(cfg.storageKey, name);

    // Update button states for this selector
    var buttons = document.querySelectorAll('.ps-btn[data-selector="' + cfg.containerId + '"]');
    buttons.forEach(function (btn) {
      btn.classList.toggle('ps-active', btn.getAttribute('data-option') === name);
    });

    // Sync matching Mintlify tabs
    syncTabs(cfg, name);
  }

  function syncTabs(cfg, name) {
    var optionNames = cfg.options.map(function (o) { return o.name; });
    var tabs = document.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab) {
      var text = (tab.textContent || '').trim();
      if (optionNames.indexOf(text) !== -1) {
        // Mark parent as controlled to hide native tab buttons
        var tablist = tab.closest('[role="tablist"]');
        if (tablist && tablist.parentElement) {
          tablist.parentElement.classList.add('ps-controlled');
        }
        if (text === name) {
          tab.click();
        }
      }
    });
  }

  // ─── Initialisation ────────────────────────────────────────────────

  function initAll() {
    var anyFound = false;
    SELECTORS.forEach(function (cfg) {
      if (document.getElementById(cfg.containerId)) {
        anyFound = true;
        injectStyles();
        buildSelector(cfg);

        var current = getStored(cfg);
        localStorage.setItem(cfg.storageKey, current);
        setTimeout(function () { syncTabs(cfg, current); }, 150);
      }
    });
  }

  // ─── SPA navigation handling ───────────────────────────────────────
  var lastPath = '';

  function onRouteChange() {
    var newPath = window.location.pathname;
    if (newPath !== lastPath) {
      lastPath = newPath;
      setTimeout(initAll, 400);
    }
  }

  var origPush = history.pushState;
  var origReplace = history.replaceState;
  history.pushState = function () {
    origPush.apply(this, arguments);
    onRouteChange();
  };
  history.replaceState = function () {
    origReplace.apply(this, arguments);
    onRouteChange();
  };
  window.addEventListener('popstate', onRouteChange);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      lastPath = window.location.pathname;
      initAll();
    });
  } else {
    lastPath = window.location.pathname;
    setTimeout(initAll, 300);
  }
})();
