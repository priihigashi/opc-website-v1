import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Owner-authorized individual release (decision 2026-10-13, Website Build Tracker / Blog v2 release doc).
// Replaces the three-article series requirement for ONE human-approved article with exact-version evidence:
// owner authorization for this slug, two distinct independent reviews of the exact body (Codex + Claude),
// each passing at >= 75/100 with no severe finding, and an owner photo decision tied to exact image hashes.
// Every other gate in verify-blog-release.mjs (post hash, image/figure hashes, alt text) still applies.

const digest = value => createHash('sha256').update(value).digest('hex');
const hex = value => /^[a-f0-9]{64}$/.test(value || '');
const SEVERE = new Set(['blocker', 'major', 'high', 'critical']);
export const INDIVIDUAL_MINIMUM_SCORE = 75;

const parseReceipt = raw => JSON.parse(String(raw).trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, ''));

function reviewErrors(entry, bodyHash) {
  if (!entry || typeof entry.rawReceipt !== 'string' || !hex(entry.receiptSha256) || digest(entry.rawReceipt) !== entry.receiptSha256) return ['receipt'];
  let result;
  try { result = parseReceipt(entry.rawReceipt); } catch { return ['receipt-json']; }
  const errors = [];
  if (result.decision !== 'pass') errors.push('decision');
  if ((result.bodySha256 || result.articleBodySha256) !== bodyHash) errors.push('body-hash');
  if (!Number.isFinite(result.total) || result.total < INDIVIDUAL_MINIMUM_SCORE || result.total > 100) errors.push('score');
  if (!Array.isArray(result.findings) || result.findings.some(f => SEVERE.has(String(f.severity).toLowerCase()))) errors.push('severe-finding');
  if (Array.isArray(result.requiredChanges) && result.requiredChanges.length) errors.push('required-changes');
  return errors;
}

function photoHashes(post) {
  const hashes = [];
  for (const figure of post.figures || []) if (figure.kind === 'opc-photo') hashes.push(figure.sha256);
  return hashes;
}

export async function verifyIndividualReleaseEvidence(blogDir, post, approval) {
  const slug = post.slug;
  const fail = reason => [`individual-release-evidence-invalid:${slug}:${reason}`];
  if (!hex(approval.evidenceSha256)) return fail('evidence-hash');
  let bytes;
  try { bytes = await readFile(join(blogDir, 'release-evidence', `${slug}.json`)); } catch { return fail('evidence-missing'); }
  if (digest(bytes) !== approval.evidenceSha256) return fail('evidence-changed');
  let evidence;
  try { evidence = JSON.parse(bytes); } catch { return fail('evidence-json'); }
  const bodyHash = digest(String(post.content || ''));
  const errors = [];
  if (evidence.postSha256 !== digest(JSON.stringify(post)) || evidence.articleBodySha256 !== bodyHash) errors.push('version');
  const auth = evidence.ownerAuthorization;
  if (!auth || auth.slug !== slug || auth.scope !== 'individual-article' || !auth.by || !Number.isFinite(Date.parse(auth.at)) || !/^https:\/\//.test(auth.evidenceUrl || '')) errors.push('owner-authorization');
  const reviews = evidence.reviews || {};
  if (!reviews.codex || !reviews.claude || reviews.codex.receiptSha256 === reviews.claude.receiptSha256) errors.push('two-independent-reviews');
  for (const provider of ['codex', 'claude']) for (const e of reviewErrors(reviews[provider], bodyHash)) errors.push(`${provider}-${e}`);
  const photos = [...(post.image ? [approval.imageSha256] : []), ...photoHashes(post)];
  if (photos.length) {
    const media = evidence.media || {};
    const approved = new Set(media.ownerApprovedImageSha256 || []);
    if (media.ownerArticleApproval !== true || photos.some(h => !hex(h) || !approved.has(h))) errors.push('owner-photo-approval');
    if (media.privacyDecision !== 'clear') errors.push('privacy');
    const review = media.review;
    let result;
    try { result = review && digest(review.rawReceipt) === review.receiptSha256 ? parseReceipt(review.rawReceipt) : null; } catch { result = null; }
    const reviewed = new Set((result?.images || []).filter(i => i.hashMatchesExpected && i.altAccurate && i.captionAccurate).map(i => i.sha256));
    if (!result || result.decision !== 'pass' || result.articleBodySha256 !== bodyHash || result.privacyDecision !== 'clear'
      || !Array.isArray(result.findings) || result.findings.some(f => SEVERE.has(String(f.severity).toLowerCase()))
      || photos.some(h => !reviewed.has(h))) errors.push('media-review');
  } else if (approval.mediaDecision !== 'text-only') errors.push('media-decision');
  return errors.map(reason => `individual-release-evidence-invalid:${slug}:${reason}`);
}
