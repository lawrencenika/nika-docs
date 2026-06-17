(function () {
  // CSS custom properties for the NIKA Memory Core chat UI.
  // Dark mode  : light/white backgrounds stand out against a dark page.
  // Light mode : darker/more saturated tones stand out against a light page.
  var DARK = {
    '--gc-container-bg':     '#f9fafb',
    '--gc-container-border': '#e5e7eb',
    '--gc-ai-bg':            '#f3f4f6',
    '--gc-ai-border':        '#e5e7eb',
    '--gc-ai-text':          '#6b7280',
    '--gc-gv-bg':            '#ffffff',
    '--gc-gv-border':        '#e5e7eb',
    '--gc-divider':          '#e5e7eb',
    '--gc-table-header-bg':  '#f8fafc',
    '--gc-table-sep':        '#e5e7eb',
    '--gc-bar-track':        '#f1f5f9',
  };

  var LIGHT = {
    '--gc-container-bg':     '#dce6f0',
    '--gc-container-border': '#7a92b2',
    '--gc-ai-bg':            '#c8d6e5',
    '--gc-ai-border':        '#7a92b2',
    '--gc-ai-text':          '#2d3a4a',
    '--gc-gv-bg':            '#edf2f8',
    '--gc-gv-border':        '#7a92b2',
    '--gc-divider':          '#7a92b2',
    '--gc-table-header-bg':  '#d4e0ed',
    '--gc-table-sep':        '#7a92b2',
    '--gc-bar-track':        '#b8cde0',
  };

  function applyTheme() {
    var vars = document.documentElement.classList.contains('dark') ? DARK : LIGHT;
    var root = document.documentElement.style;
    Object.keys(vars).forEach(function (k) { root.setProperty(k, vars[k]); });
  }

  applyTheme();

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'class') applyTheme();
    });
  });
  observer.observe(document.documentElement, { attributes: true });
})();
