import { readFile, mkdir, writeFile, access, stat } from 'node:fs/promises';
import { resolve, dirname, relative, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { reviewFigureBlocks } from '../src/blog/reviewFigureBlocks.mjs';

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
  if (block.startsWith('- ')) return `<ul>${block.split(/\n(?=- )/).map((item) => `<li>${inline(item.replace(/^- /, '').replace(/\n\s+/g, ' '))}</li>`).join('')}</ul>`;
  return `<p>${inline(block.replace(/\n/g, ' '))}</p>`;
};
const renderFigure = (figure) => `<figure class="review-figure" role="img" aria-label="${escape(figure.alt)}"><div class="diagram-title">${escape(figure.title)}</div><ol>${figure.steps.map((step) => `<li><span class="step-label">${step.kind === 'source' ? `Source claim ${escape(step.claimId)} · ${escape(step.sourceId)}` : 'OPC planning note'}</span>${escape(step.text)}</li>`).join('')}</ol><figcaption>${escape(figure.caption)} <small>Draft diagram · ${escape(figure.provenance)} · ${escape(figure.rights)}</small></figcaption></figure>`;
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
*{box-sizing:border-box}body{margin:0;background:#F0EBE3;color:#0A0A0A;font:17px/1.8 Arial,sans-serif}a{color:#9A9B0C}header{background:#0A0A0A;color:#fff;padding:1rem 1.5rem;font:700 13px/1.5 monospace;letter-spacing:.08em}main{max-width:1120px;margin:auto;padding:2rem 1.5rem 5rem}.notice{padding:1rem 1.3rem;background:#F0EBE3;border-left:5px solid #CBCC10;font:14px/1.6 Arial,sans-serif}.eyebrow{font:12px monospace;text-transform:uppercase;letter-spacing:.12em;color:#7A7267;margin-top:3rem}h1,h2,h3{font-family:Georgia,serif;line-height:1.18}h1{font-size:clamp(2.4rem,6vw,4.5rem);max-width:900px}h2{font-size:2rem;margin-top:2.8rem}h3{font-size:1.5rem;margin-top:2rem}.hero{width:100%;max-height:480px;object-fit:cover;border-radius:5px;margin:1.5rem 0}article{max-width:760px;margin:3rem auto}article p,article li{color:#7A7267}article li{margin:.5rem 0}footer{background:#0A0A0A;color:#fff;padding:2rem;text-align:center;font:12px monospace}@media(max-width:600px){main{padding:1rem 1rem 3rem}article{margin:2rem auto}}
.review-figure{margin:2.5rem 0;padding:1.5rem;background:#fff;border:2px solid #CBCC10;border-radius:5px}.diagram-title{font:700 1.3rem Georgia,serif}.review-figure ol{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem;padding:0;list-style:none;counter-reset:step}.review-figure li{margin:0;padding:1rem;background:#F0EBE3;color:#0A0A0A;counter-increment:step}.review-figure li:before{content:counter(step,decimal-leading-zero);display:block;color:#686900;font:700 .85rem monospace}.review-figure figcaption{margin-top:1rem;color:#555;font-size:.9rem}.review-figure small{display:block;color:#777}@media(max-width:600px){.review-figure ol{grid-template-columns:1fr}}
.review-figure .step-label{display:block;font:700 .72rem monospace;text-transform:uppercase;letter-spacing:.04em;color:#686900;margin:.25rem 0 .5rem}
</style></head><body><header>OAK PARK CONSTRUCTION / INTERNAL ARTICLE REVIEW</header><main><div class="notice"><strong>DRAFT PREVIEW — NOT APPROVED FOR PUBLICATION</strong><br>Run: ${escape(runId)} · Review: ${escape(review)}. This local file is for editorial review only.</div><p class="eyebrow">${escape(article.category || 'Construction guidance')}</p><h1>${escape(article.title)}</h1><p>${escape(article.author || 'Oak Park Construction')} · Draft</p>${hero}<article>${body}</article>${editorialNotes}${sourceLedger}</main><footer>Internal review copy · Publication requires separate human approval of this exact version.</footer></body></html>`;
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(output);
