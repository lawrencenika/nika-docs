(function () {
  if (document.getElementById('nika-floating-cta')) return;
  if (sessionStorage.getItem('nika-cta-dismissed')) return;

  function init() {
  var style = document.createElement('style');
  style.textContent = [
    '#nika-floating-cta {',
    '  position: fixed;',
    '  bottom: 24px;',
    '  right: 24px;',
    '  z-index: 9999;',
    '  width: 340px;',
    '  background: var(--color-background-default, #0a0a0a);',
    '  border: 1px solid var(--color-border-default, #2a2a2a);',
    '  border-radius: 16px;',
    '  padding: 28px 24px 24px;',
    '  box-shadow: 0 12px 40px rgba(0,0,0,0.5);',
    '  font-family: inherit;',
    '  transition: opacity 0.2s ease;',
    '}',
    '#nika-floating-cta .nika-cta-close {',
    '  position: absolute;',
    '  top: 12px;',
    '  right: 12px;',
    '  background: none;',
    '  border: none;',
    '  color: var(--color-text-secondary, #888);',
    '  cursor: pointer;',
    '  font-size: 20px;',
    '  line-height: 1;',
    '  padding: 4px 8px;',
    '  border-radius: 6px;',
    '}',
    '#nika-floating-cta .nika-cta-close:hover {',
    '  color: var(--color-text-default, #fff);',
    '  background: var(--color-border-default, #2a2a2a);',
    '}',
    '#nika-floating-cta .nika-cta-title {',
    '  font-size: 18px;',
    '  font-weight: 700;',
    '  color: var(--color-text-default, #fff);',
    '  margin: 0 0 8px 0;',
    '  line-height: 1.3;',
    '}',
    '#nika-floating-cta .nika-cta-desc {',
    '  font-size: 13px;',
    '  color: var(--color-text-secondary, #888);',
    '  margin: 0 0 16px 0;',
    '  line-height: 1.5;',
    '}',
    '#nika-floating-cta .nika-cta-logos {',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 16px;',
    '  margin-bottom: 20px;',
    '  flex-wrap: wrap;',
    '}',
    '#nika-floating-cta .nika-cta-logos img {',
    '  height: 20px;',
    '  width: auto;',
    '  opacity: 0.7;',
    '  filter: grayscale(100%) brightness(1.8);',
    '}',
    '#nika-floating-cta .nika-cta-buttons {',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 8px;',
    '}',
    '#nika-floating-cta .nika-cta-btn {',
    '  display: block;',
    '  width: 100%;',
    '  padding: 10px 0;',
    '  text-align: center;',
    '  font-size: 14px;',
    '  font-weight: 600;',
    '  border: none;',
    '  border-radius: 8px;',
    '  text-decoration: none;',
    '  transition: opacity 0.15s ease;',
    '  box-sizing: border-box;',
    '}',
    '#nika-floating-cta .nika-cta-btn:hover {',
    '  opacity: 0.85;',
    '}',
    '#nika-floating-cta .nika-cta-btn-primary {',
    '  color: #003646;',
    '  background: var(--color-primary, #c5ff5a);',
    '}',
    '#nika-floating-cta .nika-cta-btn-secondary {',
    '  color: var(--color-text-default, #fff);',
    '  background: transparent;',
    '  border: 1px solid var(--color-border-default, #2a2a2a);',
    '}',
    '@media (max-width: 640px) {',
    '  #nika-floating-cta {',
    '    width: calc(100% - 32px);',
    '    right: 16px;',
    '    bottom: 16px;',
    '  }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  var widget = document.createElement('div');
  widget.id = 'nika-floating-cta';
  widget.innerHTML = [
    '<button class="nika-cta-close" aria-label="Dismiss" title="Dismiss">&times;</button>',
    '<p class="nika-cta-title">Deploy and Scale Mapping Operations with Nika</p>',
    '<p class="nika-cta-desc">Supercharge your existing GIS team with code-to-GIS deployment pipeline, geospatial AI agent, label-to-train-to-inference ML capability together with industry leaders:</p>',
    '<div class="nika-cta-logos">',
    '  <img src="/images/logos/ubs.png" alt="UBS" height="20" />',
    '  <img src="/images/logos/amazon.png" alt="Amazon" height="20" />',
    '  <img src="/images/logos/tpg.png" alt="TPG" height="20" />',
    '  <img src="/images/logos/fedex.svg" alt="FedEx" height="20" />',
    '</div>',
    '<div class="nika-cta-buttons">',
    '  <a class="nika-cta-btn nika-cta-btn-primary" href="https://planet.nika.eco" target="_blank" rel="noopener noreferrer">Sign Up</a>',
    '  <a class="nika-cta-btn nika-cta-btn-secondary" href="https://cal.com/lawrence-nika/nika-expert?utm_source=docs.nikaplanet.com" target="_blank" rel="noopener noreferrer">Schedule a Demo</a>',
    '</div>'
  ].join('\n');

  document.body.appendChild(widget);

  widget.querySelector('.nika-cta-close').addEventListener('click', function () {
    widget.style.opacity = '0';
    setTimeout(function () {
      widget.remove();
    }, 200);
    sessionStorage.setItem('nika-cta-dismissed', '1');
  });
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
