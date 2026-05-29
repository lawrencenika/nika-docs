(function () {
  if (document.getElementById('nika-topbar-actions-style')) return;

  var pricingUrl = 'https://www.nikaplanet.com/pricing';

  var style = document.createElement('style');
  style.id = 'nika-topbar-actions-style';
  style.textContent = [
    '#navbar nav a[href="https://www.nikaplanet.com/download"] {',
    '  display: inline-flex !important;',
    '  align-items: center !important;',
    '  justify-content: center !important;',
    '  min-height: 34px !important;',
    '  padding: 8px 16px !important;',
    '  border: 1px solid #d3cad5 !important;',
    '  border-radius: 999px !important;',
    '  color: #170d19 !important;',
    '  background: transparent !important;',
    '  font-weight: 500 !important;',
    '  line-height: 1 !important;',
    '  transition: background 0.15s ease, border-color 0.15s ease !important;',
    '}',
    '#navbar nav a[href="https://www.nikaplanet.com/download"]:hover {',
    '  background: #f4f0f5 !important;',
    '  border-color: #170d19 !important;',
    '}',
    '.dark #navbar nav a[href="https://www.nikaplanet.com/download"] {',
    '  color: #f7ece6 !important;',
    '  border-color: #362839 !important;',
    '}',
    '.dark #navbar nav a[href="https://www.nikaplanet.com/download"]:hover {',
    '  background: #261a29 !important;',
    '  border-color: #f7ece6 !important;',
    '}',
    '#navbar #topbar-cta-button > a {',
    '  min-height: 34px !important;',
    '  padding: 8px 14px !important;',
    '  border-radius: 999px !important;',
    '  border-color: #eba941 !important;',
    '  background: #eba941 !important;',
    '  color: #170d19 !important;',
    '  font-weight: 500 !important;',
    '  line-height: 1 !important;',
    '}',
    '#navbar #topbar-cta-button > a svg {',
    '  display: none !important;',
    '}',
    '#navbar #topbar-cta-button > a:hover {',
    '  background: #d8922f !important;',
    '  border-color: #d8922f !important;',
    '  color: #170d19 !important;',
    '}',
    '.dark #navbar #topbar-cta-button > a {',
    '  border-color: #c5ff5a !important;',
    '  background: #c5ff5a !important;',
    '  color: #170d19 !important;',
    '}',
    '.dark #navbar #topbar-cta-button > a:hover {',
    '  background: #c5ff5a !important;',
    '  border-color: #c5ff5a !important;',
    '  color: #170d19 !important;',
    '}'
  ].join('\n');

  document.head.appendChild(style);

  function configurePricingLinks() {
    document.querySelectorAll('a[href="/pricing"], a[href="' + pricingUrl + '"]').forEach(function (link) {
      link.href = pricingUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      if (link.dataset.nikaPricingClick === '1') return;

      link.dataset.nikaPricingClick = '1';
      link.addEventListener('click', function (event) {
        event.preventDefault();
        window.open(pricingUrl, '_blank', 'noopener,noreferrer');
      });
    });
  }

  configurePricingLinks();

  var pricingObserver = new MutationObserver(configurePricingLinks);
  pricingObserver.observe(document.documentElement, { childList: true, subtree: true });
})();
