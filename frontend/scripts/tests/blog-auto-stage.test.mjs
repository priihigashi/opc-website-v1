import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { digest, postDigest, verifyBlogRelease } from '../verify-blog-release.mjs';
import { stageAutoBlogRelease } from '../stage-auto-blog-release.mjs';

test('automatic staging validates exact reviews, writes only after passing, and limits weekly releases', async () => {
  const root = await mkdtemp(join(tmpdir(), 'opc-auto-stage-test-'));
  const blog = join(root, 'src', 'blog');
  await mkdir(blog, { recursive: true });
  await mkdir(join(root, 'public'));
  const save = (name, value) => writeFile(join(blog, name), JSON.stringify(value, null, 2) + '\n');
  const post = { slug: 'verified-article', title: 'Reviewed answer', author: 'Oak Park Construction', category: 'Planning', date: '2026-10-12', content: 'Source-backed answer.' };
  const bodyHash = digest(post.content);
  const review = rating => {
    const result = { decision: 'pass', findings: [], ratings: Object.fromEntries(['readerAnswer', 'factualSupport', 'serviceAndAreaFit', 'clarity', 'searchIntent', 'visualIntegrity'].map(key => [key, { rating, evidence: `Observed ${key}` }])) };
    return { articleBodySha256: bodyHash, result, receiptSha256: digest(JSON.stringify(result)) };
  };
  const evidence = { postSha256: postDigest(post), articleBodySha256: bodyHash, rubricVersion: 'opc-blog-editorial-v1', hubRunReceiptSha256: 'd'.repeat(64), batchReceiptSha256: 'c'.repeat(64), gate: [], reviews: { codex: review(4), claude: review(3) } };
  const approval = { method: 'automatic', postSha256: postDigest(post), evidenceSha256: digest(JSON.stringify(evidence, null, 2) + '\n'), approvedAt: '2026-10-12T19:00:00Z', evidenceUrl: 'https://drive.google.com/file/d/evidence', batchReceiptSha256: 'c'.repeat(64), batchStatus: 'private-trial-ready', mediaDecision: 'text-only', editorialScore: 75, rubricVersion: 'opc-blog-editorial-v1', gateStatus: 'clear', hardVeto: false };
  const manifest = { post, approval, evidence };
  try {
    await save('posts.json', []);
    await save('release-baseline.json', {});
    await save('release-approvals.json', {});
    await save('auto-release-policy.json', { enabled: false, rubricVersion: 'opc-blog-editorial-v1', minimumScore: 75, calibratedAt: '2026-10-12T18:00:00Z' });
    const now = new Date('2026-10-12T19:00:00Z');
    await assert.rejects(stageAutoBlogRelease(root, manifest, { apply: true, now }), /auto-release-policy-disabled/);
    assert.deepEqual(JSON.parse(await readFile(join(blog, 'posts.json'), 'utf8')), []);
    const calibration = { rubricVersion: 'opc-blog-editorial-v1', samples: Array.from({ length: 6 }, (_, i) => ({
      articleBodySha256: digest(`article-${i}`), sourceReceiptSha256: digest(`run-${i}`),
      codexReceiptSha256: digest(`codex-${i}`), claudeReceiptSha256: digest(`claude-${i}`),
      codexScore: i < 3 ? 85 : 65, claudeScore: i < 3 ? 80 : 60,
      label: i < 3 ? 'safe-for-automatic-publication' : 'hold-from-automatic-publication',
      hardVeto: false, adjudicationEvidenceUrl: `https://drive.google.com/file/d/example-${i}`,
    })) };
    await save('auto-release-calibration.json', calibration);
    const calibrationEvidenceSha256 = digest(await readFile(join(blog, 'auto-release-calibration.json')));
    await save('auto-release-policy.json', { enabled: true, rubricVersion: 'opc-blog-editorial-v1', minimumScore: 75, calibratedAt: '2026-10-12T18:00:00Z', calibrationEvidenceSha256 });
    assert.equal((await stageAutoBlogRelease(root, manifest, { now })).status, 'validated');
    assert.deepEqual(JSON.parse(await readFile(join(blog, 'posts.json'), 'utf8')), []);
    await assert.rejects(stageAutoBlogRelease(root, { ...manifest, post: { ...post, author: '' } }, { now }), /Post title, author, category and body required/);
    await assert.rejects(stageAutoBlogRelease(root, manifest, { now: new Date('2026-10-13T19:00:00Z') }), /Publication date must be today/);
    assert.equal((await stageAutoBlogRelease(root, manifest, { apply: true, now })).status, 'staged');
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 1 });
    const nextPost = { ...post, slug: 'second-article' };
    const next = { ...manifest, post: nextPost, approval: { ...approval, postSha256: postDigest(nextPost) }, evidence: { ...evidence, postSha256: postDigest(nextPost) } };
    next.approval.evidenceSha256 = digest(JSON.stringify(next.evidence, null, 2) + '\n');
    await assert.rejects(stageAutoBlogRelease(root, next, { now }), /Weekly article limit reached/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
