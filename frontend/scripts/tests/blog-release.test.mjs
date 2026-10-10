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
  const fresh = { slug: 'new', title: 'Reviewed', image: '/images/opc/new.webp', content: 'Final text' };
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
