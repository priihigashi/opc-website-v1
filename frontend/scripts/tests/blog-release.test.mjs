import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { digest, postDigest, verifyBlogRelease } from '../verify-blog-release.mjs';

test('existing articles pass; new or changed versions need matching article and image approval', async () => {
  const root = await mkdtemp(join(tmpdir(), 'opc-blog-release-'));
  const blog = join(root, 'src', 'blog');
  const imageDir = join(root, 'public', 'images', 'opc');
  await mkdir(blog, { recursive: true });
  await mkdir(imageDir, { recursive: true });
  const existing = { slug: 'existing', title: 'Published', image: '/images/opc/old.webp' };
  const fresh = { slug: 'new', title: 'Reviewed', image: '/images/opc/new.webp', imageAlt: 'Approved OPC photograph', content: 'Final text' };
  const image = Buffer.from('approved-photo');
  const save = async (name, value) => writeFile(join(blog, name), JSON.stringify(value));
  try {
    await save('posts.json', [existing]);
    await save('release-baseline.json', { existing: postDigest(existing) });
    await save('release-approvals.json', {});
    await save('auto-release-policy.json', { enabled: false, rubricVersion: 'opc-blog-editorial-v1', minimumScore: null, calibratedAt: null });
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 0 });
    await save('posts.json', [existing, fresh]);
    await assert.rejects(verifyBlogRelease(root), /missing-exact-version-approval:new/);
    await writeFile(join(imageDir, 'new.webp'), image);
    const approval = { postSha256: postDigest(fresh), imageSha256: digest(image), approvedBy: 'human editor', approvedAt: '2026-10-10T15:00:00Z', evidenceUrl: 'https://drive.google.com/file/d/review', batchReceiptSha256: 'a'.repeat(64), batchStatus: 'private-trial-ready' };
    await save('release-approvals.json', { new: approval });
    assert.deepEqual(await verifyBlogRelease(root), { checked: 2, exactApprovals: 1 });
    await save('posts.json', [existing, { ...fresh, content: 'Edited after approval' }]);
    await assert.rejects(verifyBlogRelease(root), /missing-exact-version-approval:new/);
    await save('posts.json', [existing, fresh]);
    await writeFile(join(imageDir, 'new.webp'), 'changed-photo');
    await assert.rejects(verifyBlogRelease(root), /image-version-changed:new/);
    await save('release-approvals.json', { new: { ...approval, batchStatus: 'batch-hold' } });
    await assert.rejects(verifyBlogRelease(root), /series-review-not-ready:new/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('a photo-free article needs an explicit exact-version text-only media decision', async () => {
  const root = await mkdtemp(join(tmpdir(), 'opc-blog-text-only-'));
  const blog = join(root, 'src', 'blog');
  await mkdir(blog, { recursive: true });
  await mkdir(join(blog, 'release-evidence'));
  const post = { slug: 'text-only', title: 'Useful answer', content: 'Evidence-backed article.' };
  const save = async (name, value) => writeFile(join(blog, name), JSON.stringify(value));
  const approval = { postSha256: postDigest(post), approvedBy: 'human editor', approvedAt: '2026-10-10T15:00:00Z', evidenceUrl: 'https://drive.google.com/file/d/review', batchReceiptSha256: 'a'.repeat(64), batchStatus: 'private-trial-ready' };
  try {
    await save('posts.json', [post]);
    await save('release-baseline.json', {});
    await save('release-approvals.json', { 'text-only': approval });
    await save('auto-release-policy.json', { enabled: false, rubricVersion: 'opc-blog-editorial-v1', minimumScore: null, calibratedAt: null });
    await assert.rejects(verifyBlogRelease(root), /invalid-text-only-approval:text-only/);
    await save('release-approvals.json', { 'text-only': { ...approval, mediaDecision: 'text-only' } });
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 1 });
    await save('posts.json', [{ ...post, imageAlt: 'A missing photo' }]);
    await assert.rejects(verifyBlogRelease(root), /missing-exact-version-approval:text-only/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('an approved in-body image cannot change without failing the release gate', async () => {
  const root = await mkdtemp(join(tmpdir(), 'opc-blog-figure-'));
  const blog = join(root, 'src', 'blog');
  const imageDir = join(root, 'public', 'images', 'opc');
  await mkdir(blog, { recursive: true });
  await mkdir(imageDir, { recursive: true });
  const image = Buffer.from('approved-inline-photo');
  const post = { slug: 'existing', content: 'Intro.\n\n<!-- FIGURE:detail -->', figures: [{ id: 'detail', src: '/images/opc/detail.webp', sha256: digest(image), kind: 'opc-photo', alt: 'An OPC construction detail', caption: 'A reviewed construction detail.', provenance: 'OPC project photograph', rights: 'OPC-owned', approved: true }] };
  try {
    await writeFile(join(blog, 'posts.json'), JSON.stringify([post]));
    await writeFile(join(blog, 'release-baseline.json'), JSON.stringify({ existing: postDigest(post) }));
    await writeFile(join(blog, 'release-approvals.json'), '{}');
    await writeFile(join(blog, 'auto-release-policy.json'), JSON.stringify({ enabled: false, rubricVersion: 'opc-blog-editorial-v1', minimumScore: null, calibratedAt: null }));
    await writeFile(join(imageDir, 'detail.webp'), image);
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 0 });
    await writeFile(join(imageDir, 'detail.webp'), 'replaced-photo');
    await assert.rejects(verifyBlogRelease(root), /figure-version-changed:existing:detail/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('automatic release stays closed until calibrated and both exact-version reviews approve', async () => {
  const root = await mkdtemp(join(tmpdir(), 'opc-blog-auto-release-'));
  const blog = join(root, 'src', 'blog');
  await mkdir(blog, { recursive: true });
  await mkdir(join(blog, 'release-evidence'));
  const post = { slug: 'auto', title: 'Reviewed answer', content: 'Evidence-backed article.' };
  const hash = postDigest(post);
  const save = async (name, value) => writeFile(join(blog, name), JSON.stringify(value));
  const result = rating => ({ decision: 'pass', findings: [], ratings: Object.fromEntries(['readerAnswer', 'factualSupport', 'serviceAndAreaFit', 'clarity', 'searchIntent', 'visualIntegrity'].map(key => [key, { rating, evidence: `Observed ${key} in the article` }])) });
  const review = rating => ({ articleBodySha256: digest(post.content), result: result(rating), receiptSha256: digest(JSON.stringify(result(rating))) });
  const evidence = { postSha256: hash, articleBodySha256: digest(post.content), rubricVersion: 'opc-blog-editorial-v1', hubRunReceiptSha256: 'd'.repeat(64), batchReceiptSha256: 'c'.repeat(64), gate: [], reviews: { codex: review(4), claude: review(3) } };
  const evidenceBytes = JSON.stringify(evidence);
  const approval = { method: 'automatic', postSha256: hash, approvedAt: '2026-10-12T16:00:00Z', evidenceUrl: 'https://drive.google.com/file/d/review', evidenceSha256: digest(evidenceBytes), batchReceiptSha256: 'c'.repeat(64), batchStatus: 'private-trial-ready', mediaDecision: 'text-only', editorialScore: 75, rubricVersion: 'opc-blog-editorial-v1', gateStatus: 'clear', hardVeto: false };
  const policy = { enabled: true, rubricVersion: 'opc-blog-editorial-v1', minimumScore: 70, calibratedAt: '2026-10-12T14:00:00Z' };
  try {
    await save('posts.json', [post]);
    await save('release-baseline.json', {});
    await save('release-approvals.json', { auto: approval });
    await writeFile(join(blog, 'release-evidence', 'auto.json'), evidenceBytes);
    await save('auto-release-policy.json', { ...policy, enabled: false });
    await assert.rejects(verifyBlogRelease(root), /auto-release-policy-disabled:auto/);
    await save('auto-release-policy.json', policy);
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 1 });
    await save('release-approvals.json', { auto: { ...approval, evidenceSha256: 'a'.repeat(64) } });
    await assert.rejects(verifyBlogRelease(root), /auto-release-evidence-invalid:auto/);
    await save('release-approvals.json', { auto: { ...approval, editorialScore: 69 } });
    await assert.rejects(verifyBlogRelease(root), /auto-release-evidence-invalid:auto/);
    await save('release-approvals.json', { auto: { ...approval, hardVeto: true } });
    await assert.rejects(verifyBlogRelease(root), /auto-release-evidence-invalid:auto/);
    await save('release-approvals.json', { auto: approval });
    await writeFile(join(blog, 'release-evidence', 'auto.json'), JSON.stringify({ ...evidence, gate: ['unsupported-claim'] }));
    await assert.rejects(verifyBlogRelease(root), /auto-release-evidence-invalid:auto/);
    const changedReview = { ...evidence, reviews: { ...evidence.reviews, claude: { ...evidence.reviews.claude, result: { ...evidence.reviews.claude.result, decision: 'revise' } } } };
    const changedBytes = JSON.stringify(changedReview);
    await writeFile(join(blog, 'release-evidence', 'auto.json'), changedBytes);
    await save('release-approvals.json', { auto: { ...approval, evidenceSha256: digest(changedBytes) } });
    await assert.rejects(verifyBlogRelease(root), /auto-release-evidence-invalid:auto/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
