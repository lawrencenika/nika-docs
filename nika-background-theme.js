(function () {
  if (document.getElementById('nika-background-theme-style')) return;

  var style = document.createElement('style');
  style.id = 'nika-background-theme-style';
  style.textContent = [
    ':root {',
    '  --background-light: 251 249 252 !important;',
    '  --background-dark: 23 13 25 !important;',
    '}',
    'html.light, html.light body, html.light [data-docs-theme="linden"] {',
    '  background: #fbf9fc !important;',
    '}',
    'html.dark, html.dark body, html.dark [data-docs-theme="linden"] {',
    '  background: #170d19 !important;',
    '}',
    'html.light #navbar-transition[data-is-opaque="true"] {',
    '  background: rgba(251, 249, 252, 0.94) !important;',
    '}',
    'html.light #navbar-transition[data-is-opaque="false"] {',
    '  background: rgba(251, 249, 252, 0.72) !important;',
    '}',
    'html.dark #navbar-transition[data-is-opaque="true"] {',
    '  background: rgba(23, 13, 25, 0.92) !important;',
    '}',
    'html.dark #navbar-transition[data-is-opaque="false"] {',
    '  background: rgba(23, 13, 25, 0.72) !important;',
    '}',
    'span[class*="h-[64rem]"] {',
    '  opacity: 1 !important;',
    '}',
    'html.light span[class*="h-[64rem]"] svg path {',
    '  fill-opacity: 0.07 !important;',
    '}',
    'html.light span[class*="h-[64rem]"] svg g {',
    '  color: #170d19 !important;',
    '  fill: #170d19 !important;',
    '}',
    'html.dark span[class*="h-[64rem]"] svg path {',
    '  fill-opacity: 0.13 !important;',
    '}',
    'html.dark span[class*="h-[64rem]"] svg g {',
    '  color: #f7ece6 !important;',
    '  fill: #f7ece6 !important;',
    '}'
  ].join('\n');

  document.head.appendChild(style);
})();
