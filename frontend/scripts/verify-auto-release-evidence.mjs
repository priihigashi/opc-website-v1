import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const digest = value => createHash('sha256').update(value).digest('hex');
const hex = value => /^[a-f0-9]{64}$/.test(value || '');
const weights = { readerAnswer: 25, factualSupport: 25, serviceAndAreaFit: 15, clarity: 15, searchIntent: 10, visualIntegrity: 10 };

function reviewScore(entry, bodyHash) {
  if (!entry?.result || !hex(entry.receiptSha256) || digest(JSON.stringify(entry.result)) !== entry.receiptSha256
    || entry.articleBodySha256 !== bodyHash || entry.result?.decision !== 'pass'
    || !Array.isArray(entry.result.findings)
    || entry.result.findings.some(finding => ['major', 'blocker'].includes(finding.severity))) return null;
  const ratings = entry.result.ratings;
  if (!ratings || Object.keys(weights).some(key => !Number.isInteger(ratings[key]?.rating)
    || ratings[key].rating < 0 || ratings[key].rating > 4 || typeof ratings[key].evidence !== 'string' || !ratings[key].evidence.trim())) return null;
  return Math.round(Object.entries(weights).reduce((total, [key, weight]) => total + weight * ratings[key].rating / 4, 0));
}

function verifiedMediaReview(entry, bodyHash, imageHash) {
  return entry?.result?.decision === 'pass' && Array.isArray(entry.result.findings)
    && !entry.result.findings.some(finding => ['major', 'blocker'].includes(finding.severity))
    && entry.articleBodySha256 === bodyHash && entry.mediaSha256 === imageHash
    && entry.result.articleBodySha256 === bodyHash && entry.result.mediaSha256 === imageHash
    && hex(entry.receiptSha256) && digest(JSON.stringify(entry.result)) === entry.receiptSha256;
}

export async function verifyAutoReleaseEvidence(blogDir, post, approval, policy) {
  const slug = post.slug;
  const errors = [];
  if (policy.enabled !== true || policy.rubricVersion !== 'opc-blog-editorial-v1'
    || !Number.isInteger(policy.minimumScore) || policy.minimumScore < 0 || policy.minimumScore > 100
    || !Number.isFinite(Date.parse(policy.calibratedAt))) errors.push(`auto-release-policy-disabled:${slug}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !hex(approval.evidenceSha256)) {
    errors.push(`auto-release-evidence-invalid:${slug}`);
    return errors;
  }
  let evidence;
  try {
    const bytes = await readFile(join(blogDir, 'release-evidence', `${slug}.json`));
    if (digest(bytes) !== approval.evidenceSha256) throw new Error('Evidence digest mismatch');
    evidence = JSON.parse(bytes);
  } catch {
    errors.push(`auto-release-evidence-invalid:${slug}`);
    return errors;
  }
  const bodyHash = digest(post.content || '');
  const codex = reviewScore(evidence?.reviews?.codex, bodyHash);
  const claude = reviewScore(evidence?.reviews?.claude, bodyHash);
  const score = codex === null || claude === null ? null : Math.min(codex, claude);
  if (!evidence || evidence.postSha256 !== approval.postSha256 || evidence.articleBodySha256 !== bodyHash
    || evidence.rubricVersion !== policy.rubricVersion || !hex(evidence.hubRunReceiptSha256)
    || evidence.batchReceiptSha256 !== approval.batchReceiptSha256
    || !Array.isArray(evidence.gate) || evidence.gate.length || codex === null || claude === null
    || evidence.reviews.codex.receiptSha256 === evidence.reviews.claude.receiptSha256
    || score !== approval.editorialScore || score < policy.minimumScore
    || approval.rubricVersion !== policy.rubricVersion || approval.gateStatus !== 'clear'
    || approval.hardVeto !== false) errors.push(`auto-release-evidence-invalid:${slug}`);
  if (post.image) {
    const media = evidence?.media;
    const imageHash = approval.imageSha256;
    if (approval.mediaDecision !== 'dual-reviewed-photo' || !hex(imageHash)
      || media?.imageSha256 !== imageHash || media?.articleBodySha256 !== bodyHash
      || media?.source?.approvalStatus !== 'APPROVED FOR WEBSITE'
      || media?.source?.provenance !== 'REAL OPC' || !media?.source?.sourceDriveId
      || media?.privacyDecision !== 'clear' || media?.rightsDecision !== 'cleared-for-website'
      || !post.imageCaption?.trim() || media?.caption !== post.imageCaption
      || media?.alt !== post.imageAlt
      || !verifiedMediaReview(media?.reviews?.codex, bodyHash, imageHash)
      || !verifiedMediaReview(media?.reviews?.claude, bodyHash, imageHash)
      || media.reviews.codex.receiptSha256 === media.reviews.claude.receiptSha256) {
      errors.push(`auto-release-media-invalid:${slug}`);
    }
  }
  return errors;
}
