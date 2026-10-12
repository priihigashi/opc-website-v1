import { readFile, mkdir, writeFile, access, stat } from 'node:fs/promises';
import { resolve, dirname, relative, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { reviewFigureBlocks } from '../src/blog/reviewFigureBlocks.mjs';
import { orderedItems, tableRows } from '../src/blog/markdownBlocks.mjs';

// Local review artifact only. This script never writes into the deployable build.
const [inputArg, outputArg] = process.argv.slice(2);
if (!inputArg || !outputArg) {
  console.error('Usage: node scripts/generate-blog-review-preview.mjs <bundle.json> <preview.html>');
  process.exit(2);
}
const output = resolve(outputArg);
const frontendRoot = resolve(import.meta.dirname, '..');
const forbiddenRoots = ['build', 'public', 'src'].map((name) => resolve(frontendRoot, name));
if (forbiddenRoots.some((root) => {
  const within = relative(root, output);
  return within === '' || (!within.startsWith('..') && !isAbsolute(within));
})) {
  throw new Error('Review previews cannot be written into deployable frontend directories');
}
const input = resolve(inputArg);
const inputDir = (await stat(input)).isDirectory();
const bundle = inputDir ? {
  ...(JSON.parse(await readFile(resolve(input, 'receipt.json'), 'utf8'))),
  draft: JSON.parse(await readFile(resolve(input, 'draft.json'), 'utf8')),
  review: JSON.parse(await readFile(resolve(input, 'review.json'), 'utf8')),
} : JSON.parse(await readFile(input, 'utf8'));
const article = bundle.article || bundle.draft || bundle;
const articleContent = article.content || article.body;
if (!article || !article.title || !articleContent) throw new Error('Bundle requires article.title and article.content (or body)');
const escape = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const safeHref = (value) => /^https:\/\//i.test(value) || /^\/(?!\/)/.test(value) ? value : null;
const inline = (value) => escape(value).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
  const href = safeHref(url);
  return href ? `<a href="${escape(href)}" rel="noopener noreferrer">${escape(label)}</a>` : escape(label);
}).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
const renderText = (block) => {
  if (block.startsWith('## ')) return `<h2>${escape(block.slice(3))}</h2>`;
  if (block.startsWith('### ')) return `<h3>${escape(block.slice(4))}</h3>`;
  const table = tableRows(block);
  if (table) return `<div class="table-scroll"><table><thead><tr>${table.header.map(cell => `<th>${inline(cell)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const ordered = orderedItems(block);
  if (ordered) return `<ol>${ordered.map(item => `<li>${inline(item)}</li>`).join('')}</ol>`;
  if (block.startsWith('- ')) return `<ul>${block.split(/\n(?=- )/).map((item) => `<li>${inline(item.replace(/^- /, '').replace(/\n\s+/g, ' '))}</li>`).join('')}</ul>`;
  return `<p>${inline(block.replace(/\n/g, ' '))}</p>`;
};
const renderFigure = (figure) => {
  if (figure.type === 'three-view-diagram') {
    const panels = [
      { label: 'Site plan', description: 'Property footprint', cells: '<rect x="20" y="24" width="188" height="112" fill="none" stroke="#666"/><rect x="72" y="48" width="72" height="60" fill="#AAA"/><rect x="144" y="66" width="42" height="42" fill="#CBCC10"/>' },
      { label: 'Floor plan', description: 'Interior arrangement', cells: '<rect x="30" y="36" width="122" height="88" fill="none" stroke="#666"/><path d="M92 36v88M30 80h122" stroke="#666"/><rect x="152" y="58" width="48" height="66" fill="#CBCC10"/>' },
      { label: 'Elevation plan', description: 'Exterior form', cells: '<path d="M25 76l62-40 62 40v56H25z" fill="#AAA"/><path d="M149 76l30-20 30 20v56h-60z" fill="#CBCC10"/>' },
    ];
    return `<figure class="review-figure three-view-diagram" role="img" aria-label="${escape(figure.alt)}"><div class="diagram-title">${escape(figure.title)}</div><div class="three-view-grid">${panels.map((panel) => `<div class="three-view-panel"><strong>${panel.label}</strong><svg viewBox="0 0 230 155" aria-hidden="true">${panel.cells}</svg><span>${panel.description}</span></div>`).join('')}</div><figcaption>${escape(figure.caption)} <small>Draft diagram · ${escape(figure.provenance)} · ${escape(figure.rights)}</small></figcaption></figure>`;
  }
  const ordered = figure.type === 'decision-flow';
  const listTag = ordered ? 'ol' : 'ul';
  return `<figure class="review-figure ${figure.type}" role="img" aria-label="${escape(figure.alt)}"><div class="diagram-title">${escape(figure.title)}</div><${listTag}>${figure.steps.map((step) => `<li>${step.label ? `<strong class="node-title">${escape(step.label)}</strong>` : ''}<span class="step-label">${step.kind === 'source' ? `Source claim ${escape(step.claimId)} · ${escape(step.sourceId)}` : 'OPC planning note'}</span>${escape(step.text)}</li>`).join('')}</${listTag}><figcaption>${escape(figure.caption)} <small>Draft diagram · ${escape(figure.provenance)} · ${escape(figure.rights)}</small></figcaption></figure>`;
};
const body = reviewFigureBlocks({ ...article, content: articleContent }).map((block) => block.type === 'figure' ? renderFigure(block.figure) : renderText(block.text)).join('\n');
let image = safeHref(article.image || '');
if (image?.startsWith('/')) {
  const asset = resolve(import.meta.dirname, '..', 'public', `.${image}`);
  const publicRoot = resolve(import.meta.dirname, '..', 'public');
  const assetRelative = relative(publicRoot, asset);
  if (assetRelative.startsWith('..') || isAbsolute(assetRelative)) throw new Error('Image path escapes public assets');
  try { await access(asset); image = pathToFileURL(asset).href; } catch { image = null; }
}
const hero = image ? `<img class="hero" src="${escape(image)}" alt="${escape(article.imageAlt || '')}">` : '';
const runId = bundle.runId || bundle.run_id || bundle.id || 'Unassigned';
const review = bundle.review?.decision || bundle.review?.status || bundle.review?.verdict || 'Pending';
const findings = Array.isArray(bundle.review?.findings) ? bundle.review.findings : [];
const editorialNotes = findings.length ? `<section class="notice"><h2>Independent review notes</h2><ul>${findings.map((finding) => `<li><strong>${escape(finding.severity || 'note')}:</strong> ${escape(finding.issue || '')}</li>`).join('')}</ul></section>` : '';
const claims = Array.isArray(article.claims) ? article.claims : [];
const sourceLedger = claims.length ? `<section class="notice"><h2>Claim and source ledger</h2><ul>${claims.map((claim) => `<li>${escape(claim.text || '')} <small>Source: ${escape(claim.sourceId || 'unknown')}</small></li>`).join('')}</ul></section>` : '';
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Review draft: ${escape(article.title)}</title><style>
*{box-sizing:border-box}body{margin:0;background:#F0EBE3;color:#0A0A0A;font:17px/1.8 Arial,sans-serif}a{color:#7B7C08}header{background:#0A0A0A;color:#fff;padding:1rem 1.5rem;font:700 13px/1.5 monospace;letter-spacing:.08em}main{max-width:808px;margin:auto;padding:2rem 1.5rem 5rem}.notice{padding:1rem 1.3rem;background:#F0EBE3;border-left:5px solid #CBCC10;font:14px/1.6 Arial,sans-serif}.eyebrow{font:12px monospace;text-transform:uppercase;letter-spacing:.12em;color:#655F57;margin-top:3rem}h1,h2,h3{font-family:Georgia,serif;line-height:1.18}h1{font-size:clamp(2.4rem,4vw,3.8rem);max-width:760px}h2{font-size:2rem;margin-top:2.8rem}h3{font-size:1.5rem;margin-top:2rem}.hero{width:100%;max-height:480px;object-fit:cover;border-radius:5px;margin:1.5rem 0}article{max-width:760px;margin:3rem 0}article p,article li{color:#55514C}article li{margin:.5rem 0}footer{background:#0A0A0A;color:#fff;padding:2rem;text-align:center;font:12px monospace}@media(max-width:600px){main{padding:1rem 1rem 3rem}article{margin:2rem 0}}
.table-scroll{overflow-x:auto}.table-scroll table{border-collapse:collapse;width:100%;min-width:560px;font-size:.9rem}.table-scroll th,.table-scroll td{border-bottom:1px solid #C9C5BC;padding:.7rem;text-align:left;vertical-align:top}.table-scroll th{border-bottom:2px solid #CBCC10;color:#0A0A0A}
.review-figure{margin:2.5rem 0;padding:1.5rem;background:#fff;border:2px solid #CBCC10;border-radius:5px}.diagram-title{font:700 1.3rem Georgia,serif}.review-figure ol{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem;padding:0;list-style:none;counter-reset:step}.review-figure li{margin:0;padding:1rem;background:#F0EBE3;color:#0A0A0A;counter-increment:step}.review-figure li:before{content:counter(step,decimal-leading-zero);display:block;color:#686900;font:700 .85rem monospace}.review-figure figcaption{margin-top:1rem;color:#555;font-size:.9rem}.review-figure small{display:block;color:#777}@media(max-width:600px){.review-figure ol{grid-template-columns:1fr}}
.review-figure .step-label{display:block;font:700 .72rem monospace;text-transform:uppercase;letter-spacing:.04em;color:#686900;margin:.25rem 0 .5rem}
.review-figure ul{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem;padding:0;list-style:none}.review-figure ul li:before{content:none}.review-figure .node-title{display:block;font:700 1rem Georgia,serif;margin-bottom:.35rem}@media(max-width:600px){.review-figure ul{grid-template-columns:1fr}}
.three-view-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem;margin-top:1rem}.three-view-panel{display:flex;flex-direction:column;padding:.8rem;background:#F0EBE3}.three-view-panel strong{font:700 1rem Georgia,serif}.three-view-panel svg{width:100%;height:auto}.three-view-panel span{font-size:.8rem;color:#555}@media(max-width:600px){.three-view-grid{grid-template-columns:1fr}}
</style></head><body><header>OAK PARK CONSTRUCTION / INTERNAL ARTICLE REVIEW</header><main><div class="notice"><strong>DRAFT PREVIEW — NOT APPROVED FOR PUBLICATION</strong><br>Run: ${escape(runId)} · Review: ${escape(review)}. This local file is for editorial review only.</div><p class="eyebrow">${escape(article.category || 'Construction guidance')}</p><h1>${escape(article.title)}</h1><p>${escape(article.author || 'Oak Park Construction')} · Draft</p>${hero}<article>${body}</article>${editorialNotes}${sourceLedger}</main><footer>Internal review copy · Publication requires separate release checks for this exact version.</footer></body></html>`;
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(output);
