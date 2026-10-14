#!/usr/bin/env node
// Stage an already reviewed article in the React site. This script never deploys.
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest, postDigest, verifyBlogRelease } from './verify-blog-release.mjs';

const json = value => JSON.stringify(value, null, 2) + '\n';
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
const isoDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && new Date(`${value}T12:00:00Z`).toISOString().startsWith(value);
const nyDate = now => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
export const MAX_PER_WEEK = 3;
const week = value => {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
};

export async function stageAutoBlogRelease(frontendDir, manifest, { apply = false, now = new Date() } = {}) {
  const root = resolve(frontendDir);
  const blog = join(root, 'src', 'blog');
  const { post, approval, evidence } = manifest || {};
  if (!post || !approval || !evidence || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug || '')) throw new Error('Complete post, approval and evidence required');
  if (['title', 'author', 'category', 'content'].some(key => typeof post[key] !== 'string' || !post[key].trim())) throw new Error('Post title, author, category and body required');
  if (approval.method !== 'automatic' || approval.postSha256 !== postDigest(post)) throw new Error('Exact-version automatic approval required');
  if (!isoDate(post.date) || post.date !== nyDate(now)) throw new Error('Publication date must be today in New York');
  const evidenceBytes = json(evidence);
  if (approval.evidenceSha256 !== digest(evidenceBytes)) throw new Error('Evidence bytes do not match approval');
  const posts = await readJson(join(blog, 'posts.json'));
  const approvals = await readJson(join(blog, 'release-approvals.json'));
  if (posts.some(item => item.slug === post.slug) || approvals[post.slug]) throw new Error('Article slug already exists');
  // Owner cadence decision 2026-10-13: up to three articles per week (Mon/Wed/Thu runs), never two on the same day.
  if (posts.some(item => item.date === post.date)) throw new Error('Daily article limit reached');
  if (posts.filter(item => isoDate(item.date) && week(item.date) === week(post.date)).length >= MAX_PER_WEEK) throw new Error('Weekly article limit reached');
  const stage = await mkdtemp(join(tmpdir(), 'opc-blog-stage-'));
  try {
    const stageBlog = join(stage, 'src', 'blog');
    await mkdir(join(stage, 'src'), { recursive: true });
    await cp(blog, stageBlog, { recursive: true });
    await symlink(join(root, 'public'), join(stage, 'public'));
    await mkdir(join(stageBlog, 'release-evidence'), { recursive: true });
    await writeFile(join(stageBlog, 'posts.json'), json([...posts, post]));
    await writeFile(join(stageBlog, 'release-approvals.json'), json({ ...approvals, [post.slug]: approval }));
    await writeFile(join(stageBlog, 'release-evidence', `${post.slug}.json`), evidenceBytes);
    const result = await verifyBlogRelease(stage);
    if (!apply) return { status: 'validated', slug: post.slug, ...result };
    const files = ['posts.json', 'release-approvals.json', join('release-evidence', `${post.slug}.json`)];
    const originals = new Map();
    for (const file of files) {
      try { originals.set(file, await readFile(join(blog, file))); } catch { originals.set(file, null); }
    }
    try {
      await mkdir(join(blog, 'release-evidence'), { recursive: true });
      for (const file of files) await writeFile(join(blog, file), await readFile(join(stageBlog, file)));
      await verifyBlogRelease(root);
    } catch (error) {
      for (const [file, bytes] of originals) {
        if (bytes === null) await rm(join(blog, file), { force: true });
        else await writeFile(join(blog, file), bytes);
      }
      throw error;
    }
    return { status: 'staged', slug: post.slug, ...result };
  } finally { await rm(stage, { recursive: true, force: true }); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [frontendDir, manifestFile, flag] = process.argv.slice(2);
  if (!frontendDir || !manifestFile || (flag && flag !== '--apply')) {
    console.error('Usage: stage-auto-blog-release.mjs FRONTEND_DIR MANIFEST.json [--apply]');
    process.exitCode = 1;
  } else {
    stageAutoBlogRelease(frontendDir, await readJson(resolve(manifestFile)), { apply: flag === '--apply' })
      .then(result => console.log(json(result)))
      .catch(error => { console.error(error.message); process.exitCode = 1; });
  }
}
