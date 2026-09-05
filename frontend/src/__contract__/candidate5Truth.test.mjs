import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { PORTFOLIO_PROJECTS as projects } from '../data/portfolioProjectsLaunchV1.js';
const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
test('Candidate 5 preserves the approved project set and exact displayed counts', () => {
 assert.equal(projects.length, 12);
 assert.equal(new Set(projects.map(p=>p.id)).size,12);
 assert.equal(projects.reduce((n,p)=>n+p.imageCount,0),74);
 for(const p of projects) assert.equal(p.imageCount,p.rows.reduce((n,r)=>n+r.images.length,0));
 const addition=projects.find(p=>p.id==='home-addition-outdoor-living');
 assert.deepEqual(addition.tags,['ADDITIONS','OUTDOOR LIVING']);
});
test('documented unfinished photographs cannot regain Finished labels', () => {
 const unfinished=new Set(['4493','5901','5902','5903','3370','3368','3462','4606','2880','7860','7847','7844','7853','7200','5291','0104']);
 for(const p of projects) for(const r of p.rows) {
  assert.deepEqual(r.phases,[...new Set(r.images.map(i=>i.phase))]);
  for(const i of r.images) if(unfinished.has(i.src.match(/img-(\d+)$/)?.[1])) assert.equal(i.phase,'DURING');
 }
 assert.deepEqual(projects.filter(p=>p.progressOnly).map(p=>p.id).sort(),['dockside-full-home-remodel','opa-locka-airport','pompano-kitchen-remodel','pompano-patio-slab','shell-concrete-construction']);
 assert.match(read('../pages/PortfolioV10.jsx'),/project.progressOnly \? "Construction progress/);
});
test('current gallery has one identity, contained 16:9 photographs and the Candidate 4 navigation owner',()=>{
 const gallery=read('../pages/ProjectGalleryV7.jsx');
 assert.equal((gallery.match(/<h1\b/g)||[]).length,1);
 assert.doesNotMatch(gallery,/Selected Project|projectTitle|Sequence 01/);
 assert.match(gallery,/aspect-video/);assert.match(gallery,/object-contain/);
 assert.match(gallery,/<ProjectGalleryV5><RoutedGalleryContent \/><\/ProjectGalleryV5>/);
 assert.match(read('../pages/ProjectGalleryV5.jsx'),/useLayoutEffect/);
 assert.match(read('../pages/ProjectGalleryV5.jsx'),/return children \|\| <ProjectGalleryV4 \/>/);
 assert.doesNotMatch(read('../AppV19.js'),/preview\/centered-house/);
});
test('privacy selects its provider disclosure from the configured build, and React image priority is valid',()=>{
 assert.match(read('../pages/PrivacyV4.jsx'),/process.env.REACT_APP_WEB3FORMS_KEY \?/);
 assert.match(read('../pages/PrivacyV4.jsx'),/preparing it does not send a message/);
 assert.match(read('../components/PortfolioPicture.jsx'),/fetchPriority=/);
 assert.doesNotMatch(read('../components/PortfolioPicture.jsx'),/fetchpriority=/);
});

test('private house-number photographs are excluded from the public selection',()=>{
 const data=JSON.stringify(projects);
 assert.doesNotMatch(data,/img-(0277|3721)/);
 assert.match(data,/img-3722/);
});
