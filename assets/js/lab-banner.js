/*
 * OPC Design Lab Banner — temporary internal nav
 * Auto-injects on every page that includes this script.
 * Derives base path from its own <script src> so links work
 * from root, /services/, or /prototypes/.
 * To hide: click ✕ (per page-load only).
 */
(function () {
  if (sessionStorage.getItem('opcLabHidden') === '1') return;

  // Derive base path from script's own location
  const script = document.currentScript || (function () {
    const s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();
  const src = script.src || '';
  // src ends in /assets/js/lab-banner.js — base is everything before /assets/
  const base = src.replace(/assets\/js\/lab-banner\.js.*$/, '');

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .opc-lab-banner {
      position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
      background: rgba(10,10,10,0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid #CBCC10;
      padding: 10px 24px;
      display: flex; align-items: center; justify-content: center;
      gap: 16px; flex-wrap: wrap;
      font-family: 'Courier New', monospace;
      font-size: 11px; letter-spacing: 2px;
      color: #F0EBE3;
    }
    .opc-lab-banner .opc-tag { color: #CBCC10; font-weight: 700; }
    .opc-lab-banner a {
      color: #CBCC10; text-decoration: none;
      border: 1px solid #CBCC10;
      padding: 5px 14px; border-radius: 999px;
      transition: all 0.2s;
    }
    .opc-lab-banner a:hover { background: #CBCC10; color: #0A0A0A; }
    .opc-lab-banner .opc-quick { display: flex; gap: 6px; flex-wrap: wrap; }
    .opc-lab-banner .opc-quick a {
      padding: 4px 10px; font-size: 10px;
      border-color: rgba(240,235,227,0.25);
      color: #F0EBE3;
    }
    .opc-lab-banner .opc-quick a:hover {
      border-color: #CBCC10; color: #CBCC10; background: transparent;
    }
    .opc-lab-banner .opc-close {
      cursor: pointer; opacity: 0.5; font-size: 14px; padding: 0 8px;
      user-select: none;
    }
    .opc-lab-banner .opc-close:hover { opacity: 1; color: #CBCC10; }
    body.opc-lab-active { padding-top: 50px; }
    @media (max-width: 768px) {
      .opc-lab-banner .opc-quick { display: none; }
      .opc-lab-banner { font-size: 10px; padding: 8px 12px; }
    }
  `;
  document.head.appendChild(style);

  // Inject banner
  const banner = document.createElement('div');
  banner.className = 'opc-lab-banner';
  banner.innerHTML = `
    <span class="opc-tag">🧪 DESIGN LAB</span>
    <a href="${base}prototypes/">ALL PROTOTYPES →</a>
    <div class="opc-quick">
      <a href="${base}index.html">Home</a>
      <a href="${base}about.html">About</a>
      <a href="${base}prototypes/liquid-glass-components.html">01 Glass</a>
      <a href="${base}prototypes/blueprint-property-transform.html">02 Transform</a>
      <a href="${base}prototypes/wireframe-house-aura.html">03 3D</a>
      <a href="${base}prototypes/project-gallery-cube.html">04 Cube</a>
      <a href="${base}prototypes/hover-gallery-tiles.html">05 Hover</a>
      <a href="${base}prototypes/combined-lumen-vision.html">06 Combo</a>
      <a href="${base}prototypes/combined-gold-glow.html">07 Gold</a>
      <a href="${base}prototypes/concrete-rotating-bars.html">08 Concrete</a>
      <a href="${base}prototypes/bathroom-plumbing-stack.html">09 Bath</a>
      <a href="${base}prototypes/new-construction-assembly.html">10 NewBuild</a>
      <a href="${base}prototypes/new-construction-house3d.html">10· House3D</a>
      <a href="${base}prototypes/kitchen-exploded-cabinet.html">11 Kitchen</a>
      <a href="${base}prototypes/kitchen-room3d.html">11· Kitchen3D</a>
      <a href="${base}prototypes/contact-atmosphere.html">12 Contact</a>
      <a href="${base}prototypes/project-gallery-split.html">13 Gallery</a>
      <a href="${base}prototypes/background-swap.html">14 BG Swap</a>
      <a href="${base}prototypes/bathroom-waterproofing-section.html">15 Bath Wall</a>
      <a href="${base}prototypes/floor-plan-3d-reveal.html">16 Plan→3D</a>
      <a href="${base}prototypes/stucco-layer-section.html">17 Stucco</a>
      <a href="${base}areas/broward.html">📍 Broward</a>
      <a href="${base}areas/palm-beach.html">📍 Palm Beach</a>
      <a href="${base}areas/miami-dade.html">📍 Miami-Dade</a>
      <a href="${base}home-b.html">✨ Home B</a>
      <a href="${base}how-it-works.html">✨ How We Work</a>
      <a href="${base}new-construction-b.html">✨ Service B</a>
      <a href="${base}property-gallery-b.html">🖼 Gallery (matched)</a>
      <a href="${base}property-gallery.html">🖼 Gallery v1</a>
      <a href="${base}gallery.html">🖼 Projects Gallery</a>
      <a href="${base}gallery-3d.html">🖼 Gallery 3D</a>
      <a href="${base}projects/new-construction-additions.html">🖼 Project · New Constr</a>
    </div>
    <span class="opc-close" id="opc-close-btn">✕</span>
  `;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    document.body.classList.add('opc-lab-active');
    document.body.insertBefore(banner, document.body.firstChild);
    document.getElementById('opc-close-btn').addEventListener('click', () => {
      banner.remove();
      document.body.classList.remove('opc-lab-active');
      sessionStorage.setItem('opcLabHidden', '1');
    });
  });
})();
