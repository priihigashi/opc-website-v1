const figureMarker = /^<!-- FIGURE:([a-z0-9-]+) -->$/;
export const isStructuredDiagram = figure => figure.kind === 'original-diagram' && figure.type === 'evidence-map';

export function articleBlocks(post) {
  const figures = new Map();
  const claims = new Map((post.claims || []).map(claim => [claim.id, claim]));
  for (const figure of post.figures || []) {
    if (!figure.id || !/^[a-z0-9-]+$/.test(figure.id) || figures.has(figure.id)) throw new Error('Invalid or duplicate figure ID');
    for (const field of ['alt', 'caption', 'provenance', 'rights']) {
      if (typeof figure[field] !== 'string' || !figure[field].trim()) throw new Error(`Figure ${figure.id} requires ${field}`);
    }
    if (isStructuredDiagram(figure)) {
      if (figure.src || figure.sha256 || figure.rights !== 'OPC original diagram' || !figure.title
        || !Array.isArray(figure.steps) || figure.steps.length < 3 || figure.steps.length > 5) throw new Error(`Figure ${figure.id} requires a source-bound original diagram`);
      const headings = [...String(post.content || '').matchAll(/^#{2,3}\s+(.+)$/gm)].map(match => match[1].trim().toLowerCase());
      for (const step of figure.steps) {
        const claim = claims.get(step.claimId);
        if (step.kind !== 'source' || !claim || claim.status !== 'verified' || claim.sourceId !== step.sourceId
          || claim.text !== step.text || !post.content.includes(claim.text) || !headings.includes(String(step.label || '').toLowerCase())) {
          throw new Error(`Figure ${figure.id} step is not bound to a verified article claim`);
        }
      }
    } else {
      if (!/^\/images\/opc\/[a-z0-9/_-]+\.(?:webp|png|jpe?g)$/i.test(figure.src || '')) throw new Error(`Figure ${figure.id} requires a local OPC image`);
      if (!/^[a-f0-9]{64}$/.test(figure.sha256 || '')) throw new Error(`Figure ${figure.id} requires an exact image hash`);
      if (!['opc-photo', 'licensed-photo', 'ai-illustration', 'original-diagram'].includes(figure.kind)) throw new Error(`Figure ${figure.id} requires a verified media kind`);
    }
    if (figure.layout && !['wide', 'left', 'right'].includes(figure.layout)) throw new Error(`Figure ${figure.id} has an invalid layout`);
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
