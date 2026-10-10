// Draft-only structured figures. Production continues to use figureBlocks.mjs.
const marker = /^<!-- FIGURE:([a-z0-9-]+) -->$/;

export function reviewFigureBlocks(article) {
  const figures = new Map();
  const claims = new Map((article.claims || []).map((claim) => [claim.id, claim]));
  const body = String(article.content || article.body || '');
  for (const figure of article.figures || []) {
    if (!/^[a-z0-9-]+$/.test(figure.id || '') || figures.has(figure.id)) throw new Error('Invalid or duplicate review figure ID');
    if (!['decision-flow', 'scope-map', 'evidence-map', 'three-view-diagram'].includes(figure.type) || figure.approved === true) throw new Error(`Figure ${figure.id} must be an unapproved supported diagram`);
    for (const field of ['title', 'alt', 'caption', 'provenance']) {
      if (typeof figure[field] !== 'string' || !figure[field].trim() || figure[field].length > 300) throw new Error(`Figure ${figure.id} requires concise ${field}`);
    }
    if (figure.rights !== 'OPC original diagram') throw new Error(`Figure ${figure.id} requires verified original rights`);
    if (figure.type === 'three-view-diagram') {
      const claim = claims.get(figure.claimId);
      if (!claim || claim.sourceId !== figure.sourceId || claim.status !== 'verified' || !body.includes(claim.text)
        || !/site plan/i.test(claim.text) || !/floor plan/i.test(claim.text) || !/elevation plan/i.test(claim.text)) {
        throw new Error(`Figure ${figure.id} must bind the three views to a verified in-body source claim`);
      }
      figures.set(figure.id, figure);
      continue;
    }
    if (!Array.isArray(figure.steps) || figure.steps.length < 3 || figure.steps.length > 5) {
      throw new Error(`Figure ${figure.id} requires three to five concise steps`);
    }
    for (const step of figure.steps) {
      if (!step || typeof step !== 'object' || typeof step.text !== 'string' || !step.text.trim() || step.text.length > 240) throw new Error(`Figure ${figure.id} requires structured step text`);
      if (step.kind === 'editorial') {
        if (step.claimId || step.sourceId || step.label) throw new Error(`Figure ${figure.id} editorial step cannot cite or label a source claim`);
      } else if (step.kind === 'source') {
        const claim = claims.get(step.claimId);
        if (!claim || !step.sourceId || claim.sourceId !== step.sourceId || claim.text !== step.text || claim.status !== 'verified' || !body.includes(claim.text)) {
          throw new Error(`Figure ${figure.id} source step must match a verified in-body claim and source`);
        }
        if (step.label !== undefined) {
          const headings = [...body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) => match[1].trim().toLowerCase());
          if (typeof step.label !== 'string' || !step.label.trim() || step.label.length > 80 || !headings.some((heading) => heading.includes(step.label.trim().toLowerCase()))) {
            throw new Error(`Figure ${figure.id} source label must come from an article heading`);
          }
        }
      } else throw new Error(`Figure ${figure.id} step requires source or editorial kind`);
    }
    figures.set(figure.id, figure);
  }
  const used = new Set();
  const blocks = body.split(/\n\s*\n/).filter(Boolean).map((text) => {
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
