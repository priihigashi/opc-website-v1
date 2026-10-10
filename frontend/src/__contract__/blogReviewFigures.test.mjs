import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { reviewFigureBlocks } from '../blog/reviewFigureBlocks.mjs';

const claim = { id: 'c1', sourceId: 'doe-sizing', text: 'Check the proposed system capacity against the addition load.', status: 'verified' };
const figure = { id: 'plan-sequence', type: 'decision-flow', title: 'A planning sequence', alt: 'Three steps from scope to trade coordination', caption: 'Questions to resolve before construction.', provenance: 'Editorial diagram derived from the article planning framework', rights: 'OPC original diagram', approved: false, steps: [{ text: 'Define project scope', kind: 'editorial' }, { text: claim.text, kind: 'source', claimId: claim.id, sourceId: claim.sourceId }, { text: 'Coordinate the design team', kind: 'editorial' }] };
const body = `Opening. ${claim.text}\n\n<!-- FIGURE:plan-sequence -->\n\nClose.`;

test('private preview places a draft decision diagram in the article body', () => {
  const blocks = reviewFigureBlocks({ body, claims: [claim], figures: [figure] });
  assert.deepEqual(blocks.map((block) => block.type), ['text', 'figure', 'text']);
});

test('review figures require provenance, rights, alt, and a unique body marker', () => {
  const base = { body, claims: [claim], figures: [figure] };
  for (const variant of [ { ...figure, provenance: '' }, { ...figure, rights: 'unknown' }, { ...figure, alt: '' }, { ...figure, approved: true }, { ...figure, steps: [{ text: 'Only one', kind: 'editorial' }] }, { ...figure, steps: figure.steps.map((step) => ({ ...step, sourceId: step.kind === 'source' ? 'wrong' : undefined })) }, { ...figure, steps: figure.steps.map((step) => ({ ...step, text: step.kind === 'source' ? 'A paraphrase' : step.text })) } ]) {
    assert.throws(() => reviewFigureBlocks({ ...base, figures: [variant] }));
  }
  assert.throws(() => reviewFigureBlocks({ ...base, body: `No marker. ${claim.text}` }));
  assert.throws(() => reviewFigureBlocks({ ...base, body: `${body}\n\n<!-- FIGURE:plan-sequence -->` }));
  assert.throws(() => reviewFigureBlocks({ ...base, claims: [{ ...claim, status: 'unverified' }] }));
});

test('private HTML preview renders the diagram and escapes editorial text', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'opc-blog-figure-'));
  try {
    const input = join(dir, 'bundle.json');
    const output = join(dir, 'preview.html');
    await writeFile(input, JSON.stringify({ article: { title: 'Review', body, claims: [claim], figures: [{ ...figure, steps: [{ text: 'Scope <script>alert(1)</script>', kind: 'editorial' }, ...figure.steps.slice(1)] }] } }));
    execFileSync(process.execPath, [resolve(import.meta.dirname, '../../scripts/generate-blog-review-preview.mjs'), input, output]);
    const html = await readFile(output, 'utf8');
    assert.match(html, /noindex,nofollow,noarchive/);
    assert.match(html, /<figure class="review-figure"/);
    assert.match(html, /Scope &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.match(html, /OPC planning note/);
    assert.match(html, /Source claim c1 · doe-sizing/);
    assert.doesNotMatch(html, /<script>alert/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
