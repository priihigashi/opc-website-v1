import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { digest, postDigest, verifyBlogRelease } from '../verify-blog-release.mjs';

async function calibratedPolicy(blog, minimumScore = 75) {
  const calibration = { rubricVersion: 'opc-blog-editorial-v1', samples: Array.from({ length: 6 }, (_, i) => ({
    articleBodySha256: digest(`article-${i}`), sourceReceiptSha256: digest(`run-${i}`),
    codexReceiptSha256: digest(`codex-${i}`), claudeReceiptSha256: digest(`claude-${i}`),
    codexScore: i < 3 ? 85 : 65, claudeScore: i < 3 ? 80 : 60,
    label: i < 3 ? 'safe-for-automatic-publication' : 'hold-from-automatic-publication',
    hardVeto: false, adjudicationEvidenceUrl: `https://drive.google.com/file/d/example-${i}`,
  })) };
  const bytes = JSON.stringify(calibration);
  await writeFile(join(blog, 'auto-release-calibration.json'), bytes);
  return { enabled: true, rubricVersion: 'opc-blog-editorial-v1', minimumScore,
    calibratedAt: '2026-10-12T14:00:00Z', calibrationEvidenceSha256: digest(bytes) };
}

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

test('an original in-body diagram must match verified claims and the exact article body', async () => {
  const root = await mkdtemp(join(tmpdir(), 'opc-blog-original-diagram-'));
  const blog = join(root, 'src', 'blog');
  await mkdir(blog, { recursive: true });
  const body = 'Intro.\n\n<!-- FIGURE:planning-map -->\n\n## Requirement\n\nCity requires the document.\n\n## Preparation\n\nLicensed professionals prepare it.\n\n## Property decision\n\nThe design needs a separate check.';
  const claims = ['City requires the document.', 'Licensed professionals prepare it.', 'The design needs a separate check.'].map((text, i) => ({ id: `claim-${i + 1}`, text, sourceId: `source-${i + 1}`, status: 'verified' }));
  const steps = claims.map((claim, i) => ({ label: ['Requirement', 'Preparation', 'Property decision'][i], text: claim.text, kind: 'source', claimId: claim.id, sourceId: claim.sourceId }));
  const clean = body.replace('\n\n<!-- FIGURE:planning-map -->', '').replace(/\n{3,}/g, '\n\n');
  const figure = { id: 'planning-map', kind: 'original-diagram', type: 'evidence-map', title: 'Evidence map', alt: 'Three source-bound distinctions', caption: 'Original diagram with no implied sequence.', provenance: `OPC original; body SHA-256 ${digest(clean).slice(0, 16)}`, rights: 'OPC original diagram', approved: true, steps };
  const post = { slug: 'diagram-article', title: 'Diagram article', content: body, claims, figures: [figure] };
  const save = (name, value) => writeFile(join(blog, name), JSON.stringify(value));
  try {
    await save('posts.json', [post]);
    await save('release-baseline.json', { [post.slug]: postDigest(post) });
    await save('release-approvals.json', {});
    await save('auto-release-policy.json', { enabled: false, rubricVersion: 'opc-blog-editorial-v1', minimumScore: null, calibratedAt: null });
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 0 });
    const changed = { ...post, content: body + '\n\nA later edit.' };
    await save('posts.json', [changed]);
    await save('release-baseline.json', { [post.slug]: postDigest(changed) });
    await assert.rejects(verifyBlogRelease(root), /diagram-version-changed:diagram-article:planning-map/);
    const falseClaim = { ...post, figures: [{ ...figure, steps: [{ ...steps[0], text: 'Invented claim.' }, ...steps.slice(1)] }] };
    await save('posts.json', [falseClaim]);
    await save('release-baseline.json', { [post.slug]: postDigest(falseClaim) });
    await assert.rejects(verifyBlogRelease(root), /invalid-figure-structure:diagram-article/);
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
  const policy = await calibratedPolicy(blog);
  try {
    await save('posts.json', [post]);
    await save('release-baseline.json', {});
    await save('release-approvals.json', { auto: approval });
    await writeFile(join(blog, 'release-evidence', 'auto.json'), evidenceBytes);
    await save('auto-release-policy.json', { ...policy, enabled: false });
    await assert.rejects(verifyBlogRelease(root), /auto-release-policy-disabled:auto/);
    await save('auto-release-policy.json', { ...policy, calibrationEvidenceSha256: null });
    await assert.rejects(verifyBlogRelease(root), /auto-release-policy-disabled:auto/);
    await save('auto-release-policy.json', policy);
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 1 });
    const fullCalibration = JSON.parse(await readFile(join(blog, 'auto-release-calibration.json'), 'utf8'));
    const minimumCalibrationBytes = JSON.stringify({ ...fullCalibration, samples: [fullCalibration.samples[0], fullCalibration.samples[3]] });
    await writeFile(join(blog, 'auto-release-calibration.json'), minimumCalibrationBytes);
    await save('auto-release-policy.json', { ...policy, calibrationEvidenceSha256: digest(minimumCalibrationBytes) });
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 1 });
    await save('auto-release-policy.json', { ...policy, minimumScore: 74, calibrationEvidenceSha256: digest(minimumCalibrationBytes) });
    await assert.rejects(verifyBlogRelease(root), /auto-release-policy-disabled:auto/);
    await save('auto-release-policy.json', policy);
    await calibratedPolicy(blog);
    const weakCalibration = { rubricVersion: policy.rubricVersion, samples: [{ articleBodySha256: 'a'.repeat(64), label: 'safe-for-automatic-publication' }] };
    const weakBytes = JSON.stringify(weakCalibration);
    await writeFile(join(blog, 'auto-release-calibration.json'), weakBytes);
    await save('auto-release-policy.json', { ...policy, calibrationEvidenceSha256: digest(weakBytes) });
    await assert.rejects(verifyBlogRelease(root), /auto-release-policy-disabled:auto/);
    await save('auto-release-policy.json', policy);
    await calibratedPolicy(blog);
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

test('automatic photo release requires exact dual media reviews and an honest visible caption', async () => {
  const root = await mkdtemp(join(tmpdir(), 'opc-blog-auto-photo-'));
  const blog = join(root, 'src', 'blog');
  const images = join(root, 'public', 'images', 'opc');
  await mkdir(join(blog, 'release-evidence'), { recursive: true });
  await mkdir(images, { recursive: true });
  const photo = Buffer.from('test-photo');
  await writeFile(join(images, 'addition.webp'), photo);
  const imageSha256 = digest(photo);
  const post = { slug: 'photo-article', title: 'Addition article', content: 'A source-backed answer.', image: '/images/opc/addition.webp', imageAlt: 'OPC addition in progress', imageCaption: 'OPC addition work; this photo does not document the permit process.' };
  const body = digest(post.content);
  const articleReview = rating => {
    const result = { decision: 'pass', findings: [], ratings: Object.fromEntries(['readerAnswer', 'factualSupport', 'serviceAndAreaFit', 'clarity', 'searchIntent', 'visualIntegrity'].map(key => [key, { rating, evidence: 'Reviewed article' }])) };
    return { articleBodySha256: body, result, receiptSha256: digest(JSON.stringify(result)) };
  };
  const mediaReview = provider => {
    const result = { decision: 'pass', findings: [], articleBodySha256: body, mediaSha256: imageSha256, reviewer: provider };
    return { articleBodySha256: body, mediaSha256: imageSha256, result, receiptSha256: digest(JSON.stringify(result)) };
  };
  const evidence = { postSha256: postDigest(post), articleBodySha256: body, rubricVersion: 'opc-blog-editorial-v1', hubRunReceiptSha256: 'd'.repeat(64), batchReceiptSha256: 'c'.repeat(64), gate: [], reviews: { codex: articleReview(4), claude: articleReview(3) }, media: { imageSha256, articleBodySha256: body, source: { approvalStatus: 'APPROVED FOR WEBSITE', provenance: 'REAL OPC', sourceDriveId: 'source-id' }, privacyDecision: 'clear', rightsDecision: 'cleared-for-website', caption: post.imageCaption, alt: post.imageAlt, reviews: { codex: mediaReview('codex'), claude: mediaReview('claude') } } };
  const approval = { method: 'automatic', postSha256: postDigest(post), approvedAt: '2026-10-12T16:00:00Z', evidenceUrl: 'https://drive.google.com/file/d/review', evidenceSha256: digest(JSON.stringify(evidence)), batchReceiptSha256: 'c'.repeat(64), batchStatus: 'private-trial-ready', mediaDecision: 'dual-reviewed-photo', imageSha256, editorialScore: 75, rubricVersion: 'opc-blog-editorial-v1', gateStatus: 'clear', hardVeto: false };
  const save = (name, value) => writeFile(join(blog, name), JSON.stringify(value));
  try {
    await save('posts.json', [post]);
    await save('release-baseline.json', {});
    await save('release-approvals.json', { [post.slug]: approval });
    await save('auto-release-policy.json', await calibratedPolicy(blog));
    await writeFile(join(blog, 'release-evidence', `${post.slug}.json`), JSON.stringify(evidence));
    assert.deepEqual(await verifyBlogRelease(root), { checked: 1, exactApprovals: 1 });
    const changed = { ...evidence, media: { ...evidence.media, privacyDecision: 'unverified' } };
    await writeFile(join(blog, 'release-evidence', `${post.slug}.json`), JSON.stringify(changed));
    await save('release-approvals.json', { [post.slug]: { ...approval, evidenceSha256: digest(JSON.stringify(changed)) } });
    await assert.rejects(verifyBlogRelease(root), /auto-release-media-invalid:photo-article/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
