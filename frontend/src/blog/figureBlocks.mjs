const figureMarker = /^<!-- FIGURE:([a-z0-9-]+) -->$/;

export function articleBlocks(post) {
  const figures = new Map();
  for (const figure of post.figures || []) {
    if (!figure.id || !/^[a-z0-9-]+$/.test(figure.id) || figures.has(figure.id)) throw new Error('Invalid or duplicate figure ID');
    if (!/^\/images\/opc\/[a-z0-9/_-]+\.(?:webp|png|jpe?g)$/i.test(figure.src || '')) throw new Error(`Figure ${figure.id} requires a local OPC image`);
    for (const field of ['alt', 'caption', 'provenance', 'rights']) {
      if (typeof figure[field] !== 'string' || !figure[field].trim()) throw new Error(`Figure ${figure.id} requires ${field}`);
    }
    if (figure.approved !== true) throw new Error(`Figure ${figure.id} is not approved`);
    figures.set(figure.id, figure);
  }
  const used = new Set();
  const blocks = String(post.content || '').split(/\n\s*\n/).filter(Boolean).map((text) => {
    const match = text.match(figureMarker);
    if (!match) return { type: 'text', text };
    const figure = figures.get(match[1]);
    if (!figure || used.has(match[1])) throw new Error(`Unknown or repeated figure ${match[1]}`);
    used.add(match[1]);
    return { type: 'figure', figure };
  });
  if (used.size !== figures.size) throw new Error('Every approved figure needs one in-body marker');
  return blocks;
}
