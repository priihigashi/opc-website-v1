import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { reviewFigureBlocks } from '../blog/reviewFigureBlocks.mjs';

const figure = { id: 'plan-sequence', type: 'decision-flow', title: 'A planning sequence', alt: 'Three steps from scope to trade coordination', caption: 'Questions to resolve before construction.', provenance: 'Editorial diagram derived from the article planning framework', rights: 'OPC original diagram', approved: false, steps: ['Define project scope', 'Check source requirements', 'Coordinate the design team'] };

test('private preview places a draft decision diagram in the article body', () => {
  const blocks = reviewFigureBlocks({ body: 'Opening.\n\n<!-- FIGURE:plan-sequence -->\n\nClose.', figures: [figure] });
  assert.deepEqual(blocks.map((block) => block.type), ['text', 'figure', 'text']);
});

test('review figures require provenance, rights, alt, and a unique body marker', () => {
  const base = { body: '<!-- FIGURE:plan-sequence -->', figures: [figure] };
  for (const variant of [ { ...figure, provenance: '' }, { ...figure, rights: 'unknown' }, { ...figure, alt: '' }, { ...figure, approved: true }, { ...figure, steps: ['Only one'] } ]) {
    assert.throws(() => reviewFigureBlocks({ ...base, figures: [variant] }));
  }
  assert.throws(() => reviewFigureBlocks({ body: 'No marker', figures: [figure] }));
  assert.throws(() => reviewFigureBlocks({ body: '<!-- FIGURE:plan-sequence -->\n\n<!-- FIGURE:plan-sequence -->', figures: [figure] }));
});

test('private HTML preview renders the diagram and escapes editorial text', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'opc-blog-figure-'));
  try {
    const input = join(dir, 'bundle.json');
    const output = join(dir, 'preview.html');
    await writeFile(input, JSON.stringify({ article: { title: 'Review', body: 'Opening.\n\n<!-- FIGURE:plan-sequence -->\n\nClose.', figures: [{ ...figure, steps: ['Scope <script>alert(1)</script>', ...figure.steps.slice(1)] }] } }));
    execFileSync(process.execPath, [resolve(import.meta.dirname, '../../scripts/generate-blog-review-preview.mjs'), input, output]);
    const html = await readFile(output, 'utf8');
    assert.match(html, /noindex,nofollow,noarchive/);
    assert.match(html, /<figure class="review-figure"/);
    assert.match(html, /Scope &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.doesNotMatch(html, /<script>alert/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
