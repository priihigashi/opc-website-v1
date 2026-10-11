import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

export const digest = value => createHash('sha256').update(value).digest('hex');
export const postDigest = post => digest(JSON.stringify(post));

export async function verifyBlogRelease(frontendDir) {
  const blogDir = join(frontendDir, 'src', 'blog');
  const posts = JSON.parse(await readFile(join(blogDir, 'posts.json'), 'utf8'));
  const baseline = JSON.parse(await readFile(join(blogDir, 'release-baseline.json'), 'utf8'));
  const approvals = JSON.parse(await readFile(join(blogDir, 'release-approvals.json'), 'utf8'));
  const errors = [];
  const seen = new Set();
  for (const post of posts) {
    if (!post.slug || seen.has(post.slug)) { errors.push(`duplicate-or-missing-slug:${post.slug || 'unknown'}`); continue; }
    seen.add(post.slug);
    if (baseline[post.slug] === postDigest(post)) continue;
    const approval = approvals[post.slug];
    if (!approval || approval.postSha256 !== postDigest(post)) { errors.push(`missing-exact-version-approval:${post.slug}`); continue; }
    if (!approval.approvedBy || !Number.isFinite(Date.parse(approval.approvedAt)) || !/^https:\/\//.test(approval.evidenceUrl || '') || !/^[a-f0-9]{64}$/.test(approval.batchReceiptSha256 || '')) errors.push(`incomplete-approval-record:${post.slug}`);
    if (approval.batchStatus !== 'private-trial-ready') errors.push(`series-review-not-ready:${post.slug}`);
    if (!post.image) {
      if (approval.mediaDecision !== 'text-only' || approval.imageSha256 || post.imageAlt) errors.push(`invalid-text-only-approval:${post.slug}`);
      continue;
    }
    if (!post.imageAlt?.trim()) errors.push(`missing-image-alt:${post.slug}`);
    if (!/^\/images\/opc\/[a-zA-Z0-9_./-]+$/.test(post.image || '') || post.image.includes('..')) { errors.push(`invalid-approved-image:${post.slug}`); continue; }
    const publicDir = resolve(frontendDir, 'public');
    const imagePath = resolve(publicDir, `.${post.image}`);
    if (!imagePath.startsWith(`${publicDir}${sep}`)) { errors.push(`invalid-approved-image:${post.slug}`); continue; }
    try {
      const mediaHash = digest(await readFile(imagePath));
      if (mediaHash !== approval.imageSha256) errors.push(`image-version-changed:${post.slug}`);
    } catch { errors.push(`approved-image-missing:${post.slug}`); }
  }
  for (const slug of Object.keys(baseline)) if (!seen.has(slug)) errors.push(`baseline-article-removed:${slug}`);
  if (errors.length) throw new Error(`Blog release gate failed: ${errors.join(', ')}`);
  return { checked: posts.length, exactApprovals: posts.filter(post => baseline[post.slug] !== postDigest(post)).length };
}

if (process.argv[1] && import.meta.url === new URL(`file://${resolve(process.argv[1])}`).href) {
  const frontendDir = resolve(process.argv[2] || new URL('..', import.meta.url).pathname);
  verifyBlogRelease(frontendDir).then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
