#!/usr/bin/env node
// Promote only a READY Vercel preview for the exact, pushed article commit.
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { postDigest, verifyBlogRelease } from './verify-blog-release.mjs';

const PROJECT = 'opc-house-elements-review';
const SCOPE = 'priihigashis-projects';
const REPO = 'https://github.com/priihigashi/opc-website-v1.git';
const ORG = 'priihigashi';
const GIT_REPO = 'opc-website-v1';

function command(program, args, cwd) {
  const result = spawnSync(program, args, { cwd, encoding: 'utf8', timeout: 180000 });
  if (result.error || result.status !== 0) throw new Error(`${program} failed: ${result.error?.message || result.stderr || result.stdout}`);
  return result.stdout.trim();
}

export function exactPreview(deployments, sha, branch) {
  const matches = deployments.filter(item => item.state === 'READY' && !item.target
    && item.meta?.githubCommitSha === sha && item.meta?.githubCommitRef === branch
    && item.meta?.githubOrg === ORG && item.meta?.githubRepo === GIT_REPO
    && /^[a-z0-9-]+\.vercel\.app$/.test(item.url || ''));
  return matches.sort((a, b) => b.createdAt - a.createdAt)[0] || null;
}

export async function releasePreflight(repoDir, slug, { git = command, vercel = command } = {}) {
  const root = resolve(repoDir);
  const frontend = resolve(root, 'frontend');
  const branch = git('git', ['branch', '--show-current'], root);
  const sha = git('git', ['rev-parse', 'HEAD'], root);
  const originSha = git('git', ['rev-parse', `origin/${branch}`], root);
  const remote = git('git', ['remote', 'get-url', 'origin'], root);
  if (!branch.startsWith('codex/blog-v2-') || !/^[a-f0-9]{40}$/.test(sha) || sha !== originSha || remote !== REPO
    || git('git', ['status', '--porcelain'], root)) throw new Error('Release requires a clean pushed blog branch');
  const changed = git('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'], root).split('\n').filter(Boolean).sort();
  const expected = [`frontend/src/blog/posts.json`, `frontend/src/blog/release-approvals.json`, `frontend/src/blog/release-evidence/${slug}.json`].sort();
  if (JSON.stringify(changed) !== JSON.stringify(expected)) throw new Error('Article commit contains unrelated changes');
  await verifyBlogRelease(frontend);
  const blog = resolve(frontend, 'src', 'blog');
  const posts = JSON.parse(await readFile(resolve(blog, 'posts.json'), 'utf8'));
  const approvals = JSON.parse(await readFile(resolve(blog, 'release-approvals.json'), 'utf8'));
  const post = posts.find(item => item.slug === slug);
  if (!post || approvals[slug]?.method !== 'automatic' || approvals[slug].postSha256 !== postDigest(post)) throw new Error('No exact automatic article approval');
  const listing = JSON.parse(vercel('vercel', ['ls', PROJECT, '--scope', SCOPE, '--json', '--limit', '100'], frontend));
  const preview = exactPreview(listing.deployments || [], sha, branch);
  if (!preview) throw new Error('No READY preview for the exact article commit');
  return { slug, sha, branch, previewUrl: `https://${preview.url}`, project: PROJECT };
}

export async function promoteAutoBlogRelease(repoDir, slug, { execute = false, git = command, vercel = command } = {}) {
  const preflight = await releasePreflight(repoDir, slug, { git, vercel });
  if (!execute) return { status: 'validated', ...preflight };
  const frontend = resolve(repoDir, 'frontend');
  vercel('vercel', ['promote', preflight.previewUrl, '--yes', '--scope', SCOPE], frontend);
  let promoted;
  for (let attempt = 0; attempt < 24 && !promoted; attempt += 1) {
    const listing = JSON.parse(vercel('vercel', ['ls', PROJECT, '--scope', SCOPE, '--json', '--limit', '30'], frontend));
    promoted = (listing.deployments || []).find(item => item.state === 'READY' && item.target === 'production'
      && item.meta?.githubCommitSha === preflight.sha && item.meta?.action === 'promote');
    if (!promoted) await new Promise(done => setTimeout(done, 5000));
  }
  if (!promoted) throw new Error('Promotion ran but exact production deployment is not READY');
  const article = await fetch(`https://oakpark-construction.com/${slug}`, { redirect: 'follow' });
  const html = await article.text();
  const blog = await fetch('https://oakpark-construction.com/blog', { redirect: 'follow' });
  const listingHtml = await blog.text();
  if (article.status !== 200 || !html.includes(slug) || !html.includes('<h1')
    || blog.status !== 200 || !listingHtml.includes(`/${slug}`)) {
    throw new Error('Production deployment is READY but the public article or listing failed verification');
  }
  return { status: 'public-verified', deploymentUrl: `https://${promoted.url}`, articleUrl: article.url, ...preflight };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [repoDir, slug, flag] = process.argv.slice(2);
  if (!repoDir || !slug || (flag && flag !== '--execute')) {
    console.error('Usage: promote-auto-blog-release.mjs SITE_REPO SLUG [--execute]');
    process.exitCode = 1;
  } else promoteAutoBlogRelease(repoDir, slug, { execute: flag === '--execute' })
    .then(result => console.log(JSON.stringify(result)))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
