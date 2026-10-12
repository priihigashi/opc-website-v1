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
  const post = { slug: 'text-only', title: 'Useful answer', content: 'Evidence-backed article.' };
  const save = async (name, value) => writeFile(join(blog, name), JSON.stringify(value));
  const approval = { postSha256: postDigest(post), approvedBy: 'human editor', approvedAt: '2026-10-10T15:00:00Z', evidenceUrl: 'https://drive.google.com/file/d/review', batchReceiptSha256: 'a'.repeat(64), batchStatus: 'private-trial-ready' };
  try {
    await save('posts.json', [post]);
    await save('release-baseline.json', {});
    await save('release-approvals.json', { 'text-only': approval });
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
    await writeFile(join(imageDir, 'detail.webp'), image);
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 0 });
    await writeFile(join(imageDir, 'detail.webp'), 'replaced-photo');
    await assert.rejects(verifyBlogRelease(root), /figure-version-changed:existing:detail/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
