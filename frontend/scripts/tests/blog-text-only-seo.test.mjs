import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { postDigest } from '../verify-blog-release.mjs';

const frontend = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('static article output omits misleading image metadata for an approved text-only post', async () => {
  const root = await mkdtemp(join(tmpdir(), 'opc-blog-seo-text-'));
  const scriptDir = join(root, 'scripts');
  const blogDir = join(root, 'src', 'blog');
  const dataDir = join(root, 'src', 'data');
  const buildDir = join(root, 'build');
  try {
    await Promise.all([mkdir(scriptDir, { recursive: true }), mkdir(blogDir, { recursive: true }), mkdir(dataDir, { recursive: true }), mkdir(buildDir, { recursive: true })]);
    await Promise.all([
      copyFile(join(frontend, 'scripts', 'generate-seo-pages.mjs'), join(scriptDir, 'generate-seo-pages.mjs')),
      copyFile(join(frontend, 'scripts', 'verify-blog-release.mjs'), join(scriptDir, 'verify-blog-release.mjs')),
      copyFile(join(frontend, 'src', 'blog', 'figureBlocks.mjs'), join(blogDir, 'figureBlocks.mjs')),
      copyFile(join(frontend, 'src', 'blog', 'markdownBlocks.mjs'), join(blogDir, 'markdownBlocks.mjs')),
    ]);
    const post = { slug: 'text-only', title: 'A sourced answer', author: 'Oak Park Construction', category: 'Planning', date: '2026-10-10', modified: '2026-10-10', content: 'A useful answer with a source.' };
    const approval = { postSha256: postDigest(post), mediaDecision: 'text-only', approvedBy: 'human editor', approvedAt: '2026-10-10T15:00:00Z', evidenceUrl: 'https://drive.google.com/file/d/review', batchReceiptSha256: 'a'.repeat(64), batchStatus: 'private-trial-ready' };
    await Promise.all([
      writeFile(join(blogDir, 'posts.json'), JSON.stringify([post])),
      writeFile(join(blogDir, 'release-baseline.json'), '{}'),
      writeFile(join(blogDir, 'release-approvals.json'), JSON.stringify({ 'text-only': approval })),
      writeFile(join(blogDir, 'auto-release-policy.json'), JSON.stringify({ enabled: false, rubricVersion: 'opc-blog-editorial-v1', minimumScore: null, calibratedAt: null })),
      writeFile(join(dataDir, 'seoRoutesV1.json'), '{}'),
      writeFile(join(buildDir, 'index.html'), '<html><head><meta property="og:image" content="old-photo" /><meta name="twitter:image" content="old-photo" /></head><body><div id="root"></div></body></html>'),
    ]);
    const result = spawnSync(process.execPath, [join(scriptDir, 'generate-seo-pages.mjs')], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const article = await readFile(join(buildDir, 'text-only', 'index.html'), 'utf8');
    const listing = await readFile(join(buildDir, 'blog', 'index.html'), 'utf8');
    assert.doesNotMatch(article, /<img\b|og:image|twitter:image|"image":\[/);
    assert.doesNotMatch(listing, /<img\b/);
    assert.match(article, /A sourced answer/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
