import test from 'node:test';
import assert from 'node:assert/strict';
import { exactPreview } from '../promote-auto-blog-release.mjs';

test('promotion selects only a READY preview from the exact pushed commit and repository', () => {
  const sha = 'a'.repeat(40);
  const branch = 'codex/blog-v2-article';
  const base = { state: 'READY', target: null, url: 'opc-house-elements-review-abc-priihigashis-projects.vercel.app', createdAt: 1,
    meta: { githubCommitSha: sha, githubCommitRef: branch, githubOrg: 'priihigashi', githubRepo: 'opc-website-v1' } };
  const cases = [
    { ...base, state: 'ERROR', createdAt: 9 },
    { ...base, target: 'production', createdAt: 8 },
    { ...base, meta: { ...base.meta, githubCommitSha: 'b'.repeat(40) }, createdAt: 7 },
    { ...base, meta: { ...base.meta, githubRepo: 'another-repo' }, createdAt: 6 },
    { ...base, url: 'evil.example.com', createdAt: 5 },
    base,
  ];
  assert.equal(exactPreview(cases, sha, branch), base);
  assert.equal(exactPreview(cases, 'c'.repeat(40), branch), null);
});
