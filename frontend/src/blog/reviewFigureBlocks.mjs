// Draft-only structured figures. Production continues to use figureBlocks.mjs.
const marker = /^<!-- FIGURE:([a-z0-9-]+) -->$/;

export function reviewFigureBlocks(article) {
  const figures = new Map();
  for (const figure of article.figures || []) {
    if (!/^[a-z0-9-]+$/.test(figure.id || '') || figures.has(figure.id)) throw new Error('Invalid or duplicate review figure ID');
    if (figure.type !== 'decision-flow' || figure.approved === true) throw new Error(`Figure ${figure.id} must be an unapproved decision flow`);
    for (const field of ['title', 'alt', 'caption', 'provenance']) {
      if (typeof figure[field] !== 'string' || !figure[field].trim()) throw new Error(`Figure ${figure.id} requires ${field}`);
    }
    if (figure.rights !== 'OPC original diagram') throw new Error(`Figure ${figure.id} requires verified original rights`);
    if (!Array.isArray(figure.steps) || figure.steps.length < 3 || figure.steps.length > 5 || figure.steps.some((step) => typeof step !== 'string' || !step.trim() || step.length > 120)) {
      throw new Error(`Figure ${figure.id} requires three to five concise steps`);
    }
    figures.set(figure.id, figure);
  }
  const used = new Set();
  const blocks = String(article.content || article.body || '').split(/\n\s*\n/).filter(Boolean).map((text) => {
    const match = text.match(marker);
    if (!match) return { type: 'text', text };
    const figure = figures.get(match[1]);
    if (!figure || used.has(match[1])) throw new Error(`Unknown or repeated review figure ${match[1]}`);
    used.add(match[1]);
    return { type: 'figure', figure };
  });
  if (used.size !== figures.size) throw new Error('Every review figure needs one in-body marker');
  return blocks;
}
