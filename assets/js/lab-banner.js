/*
 * OPC Design Lab Banner — temporary internal nav
 * Auto-injects on every page that includes this script.
 * Derives base path from its own <script src> so links work
 * from root, /services/, or /prototypes/.
 * To hide: click ✕ (per page-load only).
 *
 * 2026-06-24: reorganized into COLOR-CODED CATEGORY GROUPS so Priscila
 * compares apples-to-apples. Each group has its own accent color.
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

  // ---- category groups (color-coded) ----
  const GROUPS = [
    { label: 'PRODUCTION', color: '#CBCC10', links: [
      ['Home', 'index.html'],
      ['About', 'about.html'],
      ['How We Work', 'how-it-works.html'],
      ['Contact', 'contact.html'],
      ['📍 Broward', 'areas/broward.html'],
      ['📍 Palm Beach', 'areas/palm-beach.html'],
      ['📍 Miami-Dade', 'areas/miami-dade.html'],
    ]},
    { label: 'HOME DIRECTIONS', color: '#E5B53B', links: [
      ['⭐ Home Immersive v2', 'home-immersive-v2.html'],
      ['✨ Home B', 'home-b.html'],
      ['18 Light Panel', 'prototypes/novobudowa-light-panel.html'],
    ]},
    { label: 'GALLERIES & PROJECTS', color: '#6EA8FF', links: [
      ['⭐ Projects List v2', 'projects-list-v2.html'],
      ['⭐ Stacked-Swiper v2', 'projects/nc-stacked-swiper-v2.html'],
      ['Project-Cards v2', 'projects/nc-projectcards-v2.html'],
      ['Gallery (matched)', 'property-gallery-b.html'],
      ['Gallery v1', 'property-gallery.html'],
      ['Projects Gallery', 'gallery.html'],
      ['Projects Page', 'projects.html'],
      ['Gallery 3D v2', 'gallery-3d-v2.html'],
      ['Gallery 3D v13', 'gallery-3d-v13.html'],
      ['Gallery List', 'gallery-list.html'],
      ['Gallery Showcase', 'gallery-showcase.html'],
      ['BG v3 glass', 'gallery-bg-v3.html'],
      ['04 Cube', 'prototypes/project-gallery-cube.html'],
      ['05 Hover', 'prototypes/hover-gallery-tiles.html'],
      ['13 Gallery Split', 'prototypes/project-gallery-split.html'],
      ['Project · New Constr', 'projects/new-construction-additions.html'],
      ['Viewer B Stacked', 'projects/nc-stacked.html'],
      ['Viewer Grid', 'projects/nc-grid.html'],
      ['Viewer Fullbleed', 'projects/nc-fullbleed.html'],
    ]},
    { label: 'SERVICE / 3D', color: '#C98A4B', links: [
      ['✨ Service B', 'new-construction-b.html'],
      ['10 NewBuild', 'prototypes/new-construction-assembly.html'],
      ['10· House3D', 'prototypes/new-construction-house3d.html'],
      ['11 Kitchen', 'prototypes/kitchen-exploded-cabinet.html'],
      ['11· Kitchen3D', 'prototypes/kitchen-room3d.html'],
      ['08 Concrete', 'prototypes/concrete-rotating-bars.html'],
      ['09 Bath', 'prototypes/bathroom-plumbing-stack.html'],
      ['02 Transform', 'prototypes/blueprint-property-transform.html'],
      ['03 3D House', 'prototypes/wireframe-house-aura.html'],
      ['15 Bath Wall', 'prototypes/bathroom-waterproofing-section.html'],
      ['16 Plan→3D', 'prototypes/floor-plan-3d-reveal.html'],
      ['17 Stucco', 'prototypes/stucco-layer-section.html'],
    ]},
    { label: 'EFFECTS / ATMOSPHERE', color: '#C77DFF', links: [
      ['01 Glass', 'prototypes/liquid-glass-components.html'],
      ['06 Combo', 'prototypes/combined-lumen-vision.html'],
      ['07 Gold', 'prototypes/combined-gold-glow.html'],
      ['12 Contact Atmos', 'prototypes/contact-atmosphere.html'],
      ['14 BG Swap', 'prototypes/background-swap.html'],
    ]},
    { label: 'TOOLS', color: '#FF8FB1', links: [
      ['🏠 AI Design Vision', 'room-vision.html'],
      ['🗄 AI Kitchen v1 (arch)', 'kitchen-vision.html'],
    ]},
    { label: 'CONTACT', color: '#5EC8C0', links: [
      ['✉ Contact v1', 'contact-v1.html'],
      ['✉ Contact v2', 'contact-v2.html'],
      ['✉ Contact v3', 'contact-v3.html'],
    ]},
  ];

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .opc-lab-banner {
      position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
      background: rgba(10,10,10,0.94);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid #CBCC10;
      padding: 8px 16px;
      display: flex; align-items: center; justify-content: flex-start;
      gap: 12px; flex-wrap: nowrap;
      font-family: 'Courier New', monospace;
      font-size: 11px; letter-spacing: 2px;
      color: #F0EBE3;
      overflow-x: auto; scrollbar-width: none; white-space: nowrap;
    }
    .opc-lab-banner::-webkit-scrollbar{display:none}
    .opc-lab-banner .opc-tag { color: #CBCC10; font-weight: 700; flex:0 0 auto; }
    .opc-lab-banner a.opc-all {
      color: #CBCC10; text-decoration: none; border: 1px solid #CBCC10;
      padding: 5px 14px; border-radius: 999px; transition: all 0.2s; flex:0 0 auto;
    }
    .opc-lab-banner a.opc-all:hover { background: #CBCC10; color: #0A0A0A; }
    .opc-groups { display: flex; gap: 10px; flex-wrap: nowrap; align-items: center; }
    .opc-grp { display: flex; gap: 6px; align-items: center; flex:0 0 auto;
      padding-left: 10px; border-left: 1px solid rgba(240,235,227,0.14); }
    .opc-grp .opc-grp-label {
      font-size: 9.5px; font-weight: 700; letter-spacing: 1.5px;
      color: var(--c); opacity: .95; padding: 2px 6px;
      border: 1px solid var(--c); border-radius: 4px; background: rgba(255,255,255,.02);
    }
    .opc-grp a {
      color: var(--c); text-decoration: none;
      border: 1px solid var(--c); opacity: .82;
      padding: 4px 10px; font-size: 10px; border-radius: 999px;
      transition: all 0.18s; flex:0 0 auto;
    }
    .opc-grp a:hover { background: var(--c); color: #0A0A0A; opacity: 1; }
    .opc-lab-banner .opc-close {
      cursor: pointer; opacity: 0.5; font-size: 14px; padding: 0 8px;
      user-select: none; flex:0 0 auto; margin-left:auto;
    }
    .opc-lab-banner .opc-close:hover { opacity: 1; color: #CBCC10; }
    body.opc-lab-active { padding-top: 44px; }
    @media (max-width: 768px) {
      .opc-lab-banner { font-size: 10px; padding: 8px 12px; }
    }
  `;
  document.head.appendChild(style);

  // Build grouped HTML
  const groupsHtml = GROUPS.map(g => {
    const links = g.links.map(([t, href]) => `<a href="${base}${href}">${t}</a>`).join('');
    return `<div class="opc-grp" style="--c:${g.color}"><span class="opc-grp-label">${g.label}</span>${links}</div>`;
  }).join('');

  // Inject banner
  const banner = document.createElement('div');
  banner.className = 'opc-lab-banner';
  banner.innerHTML = `
    <span class="opc-tag">🧪 LAB</span>
    <a class="opc-all" href="${base}prototypes/">ALL →</a>
    <div class="opc-groups">${groupsHtml}</div>
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
