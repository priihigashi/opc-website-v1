import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { digest, postDigest, verifyBlogRelease } from '../verify-blog-release.mjs';

const policy = { enabled: false, rubricVersion: 'opc-blog-editorial-v1', minimumScore: null, calibratedAt: null };

async function setup() {
  const root = await mkdtemp(join(tmpdir(), 'opc-blog-individual-'));
  const blog = join(root, 'src', 'blog');
  const images = join(root, 'public', 'images', 'opc');
  await mkdir(join(blog, 'release-evidence'), { recursive: true });
  await mkdir(images, { recursive: true });
  const hero = Buffer.from('hero-photo');
  const inline = Buffer.from('inline-photo');
  await writeFile(join(images, 'hero.webp'), hero);
  await writeFile(join(images, 'inline.webp'), inline);
  const post = { slug: 'owner-pick', title: 'Owner pick', content: 'Body.\n\n<!-- FIGURE:f1 -->', image: '/images/opc/hero.webp', imageAlt: 'OPC addition', imageCaption: 'Illustrative.', figures: [{ id: 'f1', kind: 'opc-photo', src: '/images/opc/inline.webp', sha256: digest(inline), alt: 'OPC detail', caption: 'Illustrative.', provenance: 'OPC', rights: 'owner approved', approved: true }] };
  const body = digest(post.content);
  const raw = (total, extra = {}) => JSON.stringify({ decision: 'pass', bodySha256: body, total, findings: [], requiredChanges: [], ...extra });
  const review = text => ({ rawReceipt: text, receiptSha256: digest(text) });
  const mediaRaw = JSON.stringify({ decision: 'pass', articleBodySha256: body, privacyDecision: 'clear', findings: [], images: [digest(hero), digest(inline)].map(sha256 => ({ sha256, hashMatchesExpected: true, altAccurate: true, captionAccurate: true })) });
  const evidence = { postSha256: postDigest(post), articleBodySha256: body,
    ownerAuthorization: { by: 'Owner', at: '2026-10-13T20:50:00Z', scope: 'individual-article', slug: post.slug, evidenceUrl: 'https://docs.google.com/document/d/x' },
    reviews: { codex: review(raw(96)), claude: review('```json\n' + raw(87) + '\n```') },
    media: { ownerArticleApproval: true, ownerApprovedImageSha256: [digest(hero), digest(inline)], privacyDecision: 'clear', review: review(mediaRaw) } };
  const save = (name, value) => writeFile(join(blog, name), JSON.stringify(value));
  const saveEvidence = async ev => { const bytes = JSON.stringify(ev); await writeFile(join(blog, 'release-evidence', `${post.slug}.json`), bytes); return digest(bytes); };
  await save('posts.json', [post]);
  await save('release-baseline.json', {});
  await save('auto-release-policy.json', policy);
  const approval = { method: 'human', postSha256: postDigest(post), imageSha256: digest(hero), approvedBy: 'Owner', approvedAt: '2026-10-13T20:50:00Z', evidenceUrl: 'https://docs.google.com/document/d/x', batchStatus: 'owner-individual', mediaDecision: 'owner-approved-photo' };
  return { root, post, evidence, approval, save, saveEvidence, raw, review };
}

test('owner-individual release passes only with exact owner, review and media evidence', async () => {
  const s = await setup();
  try {
    await s.save('release-approvals.json', { [s.post.slug]: { ...s.approval, evidenceSha256: await s.saveEvidence(s.evidence) } });
    assert.deepEqual(await verifyBlogRelease(s.root), { checked: 1, exactApprovals: 1 });

    const cases = [
      [{ ...s.evidence, reviews: { ...s.evidence.reviews, claude: s.review(s.raw(74)) } }, /claude-score/],
      [{ ...s.evidence, reviews: { ...s.evidence.reviews, codex: s.review(s.raw(96, { findings: [{ severity: 'major' }] })) } }, /codex-severe-finding/],
      [{ ...s.evidence, reviews: { ...s.evidence.reviews, codex: s.review(s.raw(96, { bodySha256: 'a'.repeat(64) })) } }, /codex-body-hash/],
      [{ ...s.evidence, reviews: { codex: s.evidence.reviews.codex } }, /two-independent-reviews/],
      [{ ...s.evidence, reviews: { ...s.evidence.reviews, claude: { ...s.evidence.reviews.claude, receiptSha256: 'b'.repeat(64) } } }, /claude-receipt/],
      [{ ...s.evidence, media: { ...s.evidence.media, ownerArticleApproval: false } }, /owner-photo-approval/],
      [{ ...s.evidence, media: { ...s.evidence.media, privacyDecision: 'unverified' } }, /privacy/],
      [{ ...s.evidence, ownerAuthorization: { ...s.evidence.ownerAuthorization, slug: 'other' } }, /owner-authorization/],
    ];
    for (const [ev, pattern] of cases) {
      await s.save('release-approvals.json', { [s.post.slug]: { ...s.approval, evidenceSha256: await s.saveEvidence(ev) } });
      await assert.rejects(verifyBlogRelease(s.root), pattern);
    }
    const good = await s.saveEvidence(s.evidence);
    await s.save('release-approvals.json', { [s.post.slug]: { ...s.approval, evidenceSha256: 'c'.repeat(64) } });
    await assert.rejects(verifyBlogRelease(s.root), /evidence-changed/);
    await s.save('release-approvals.json', { [s.post.slug]: { ...s.approval, method: 'automatic', evidenceSha256: good } });
    await assert.rejects(verifyBlogRelease(s.root), /series-review-not-ready|auto-release/);
    await s.save('release-approvals.json', { [s.post.slug]: { ...s.approval, evidenceSha256: good } });
    await s.save('posts.json', [{ ...s.post, content: s.post.content + ' edited' }]);
    await assert.rejects(verifyBlogRelease(s.root), /missing-exact-version-approval/);
  } finally { await rm(s.root, { recursive: true, force: true }); }
});
