import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const script = resolve(import.meta.dirname, '..', 'generate-blog-review-preview.mjs');
test('renders a review artifact without exposing draft content to public routes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'opc-review-'));
  try {
    const input = join(dir, 'bundle.json');
    const output = join(dir, 'preview.html');
    await writeFile(input, JSON.stringify({ runId: 'pilot-1', review: { decision: 'HOLD' }, article: {
      title: 'Draft <title>', category: 'Planning', content: 'A <b>private</b> draft.\n\n## Check first\n\nSee [Broward](https://www.broward.org/BUILDING). [unsafe](javascript:alert(1))',
    } }));
    const result = spawnSync(process.execPath, [script, input, output], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const html = await readFile(output, 'utf8');
    assert.match(html, /noindex,nofollow,noarchive/);
    assert.match(html, /DRAFT PREVIEW — NOT APPROVED FOR PUBLICATION/);
    assert.match(html, /pilot-1 · Review: HOLD/);
    assert.match(html, /Draft &lt;title&gt;/);
    assert.match(html, /A &lt;b&gt;private&lt;\/b&gt; draft/);
    assert.match(html, /href="https:\/\/www\.broward\.org\/BUILDING"/);
    assert.doesNotMatch(html, /href="javascript:/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('rejects a deployable build destination', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'opc-review-'));
  try {
    const input = join(dir, 'bundle.json');
    await writeFile(input, JSON.stringify({ article: { title: 'Draft', content: 'Text' } }));
    const output = resolve(import.meta.dirname, '..', '..', 'build', 'review', 'draft.html');
    const result = spawnSync(process.execPath, [script, input, output], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /cannot be written into deployable frontend directories/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('reads hub pilot directory with draft body and review receipt', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'opc-review-'));
  try {
    await writeFile(join(dir, 'draft.json'), JSON.stringify({ title: 'Permit questions', body: 'Ask the local office.', category: 'Planning' }));
    await writeFile(join(dir, 'review.json'), JSON.stringify({ decision: 'PASS' }));
    await writeFile(join(dir, 'receipt.json'), JSON.stringify({ runId: 'pilot-2' }));
    const output = join(dir, 'review.html');
    const result = spawnSync(process.execPath, [script, dir, output], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const html = await readFile(output, 'utf8');
    assert.match(html, /pilot-2 · Review: PASS/);
    assert.match(html, /Ask the local office/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
