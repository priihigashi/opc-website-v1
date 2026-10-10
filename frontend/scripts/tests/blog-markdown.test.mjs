import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { orderedItems, tableRows } from '../../src/blog/markdownBlocks.mjs';

test('shared parser recognizes bounded comparison tables and numbered decisions', () => {
  const table = '| Scope | Evidence |\n| --- | --- |\n| Use | [City](https://example.gov) |';
  assert.deepEqual(tableRows(table), { header: ['Scope', 'Evidence'], rows: [['Use', '[City](https://example.gov)']] });
  assert.equal(tableRows('| A | B |\n| --- | --- |\n| only one cell |'), null);
  assert.deepEqual(orderedItems('1. Check site.\n2. Compare plan.'), ['Check site.', 'Compare plan.']);
  assert.equal(orderedItems('One paragraph.'), null);
});

test('private preview renders the same table and ordered list as article structures', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'opc-blog-markdown-'));
  const input = join(dir, 'bundle.json'), output = join(dir, 'preview.html');
  const content = '## Scope map\n\n| Scope | Evidence |\n| --- | --- |\n| Use | [City](https://example.gov/rule) |\n\n## Owner sequence\n\n1. Check site.\n2. Compare plan.';
  try {
    await writeFile(input, JSON.stringify({ article: { title: 'Review', content }, review: { decision: 'pass' } }));
    const script = resolve(import.meta.dirname, '..', 'generate-blog-review-preview.mjs');
    const run = spawnSync(process.execPath, [script, input, output], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const html = await readFile(output, 'utf8');
    assert.match(html, /<table><thead>/);
    assert.match(html, /<ol><li>Check site\.<\/li>/);
    assert.match(html, /href="https:\/\/example\.gov\/rule"/);
    assert.match(html, /noindex,nofollow,noarchive/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
