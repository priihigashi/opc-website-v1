import test from 'node:test';
import assert from 'node:assert/strict';
import { articleBlocks } from '../blog/figureBlocks.mjs';

const figure = {
  id: 'roof-tie-in', src: '/images/opc/roof-tie-in.webp', alt: 'Roof framing connection at an addition',
  caption: 'The connection must be designed for the actual structure.', provenance: 'OPC project photograph, 2026',
  rights: 'OPC-owned', approved: true,
};

test('approved figure occupies one ordered block between article paragraphs', () => {
  const blocks = articleBlocks({ content: 'Opening.\n\n<!-- FIGURE:roof-tie-in -->\n\nNext step.', figures: [figure] });
  assert.deepEqual(blocks.map((block) => block.type), ['text', 'figure', 'text']);
  assert.equal(blocks[1].figure.caption, figure.caption);
});

test('rejects missing provenance, approval, unsafe path, missing marker, and unknown marker', () => {
  const base = { content: '<!-- FIGURE:roof-tie-in -->', figures: [figure] };
  for (const variant of [
    { ...figure, provenance: '' }, { ...figure, rights: '' }, { ...figure, approved: false },
    { ...figure, src: 'https://example.org/unreviewed.png' }, { ...figure, alt: '' },
  ]) assert.throws(() => articleBlocks({ ...base, figures: [variant] }));
  assert.throws(() => articleBlocks({ content: 'Text only', figures: [figure] }), /needs one in-body marker/);
  assert.throws(() => articleBlocks({ content: '<!-- FIGURE:unknown -->', figures: [figure] }), /Unknown/);
});
