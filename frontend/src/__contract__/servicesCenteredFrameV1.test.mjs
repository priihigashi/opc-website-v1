import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const read = p => readFileSync(new URL(p, import.meta.url), 'utf8');
test('Services index isolates its house, loading and fallback in the measured layout gap',()=>{
 const app=read('../AppV20.js');
 assert.match(app,/<ServicesStageFrameV1><DeferredHouseStageV13 scene="services" \/><\/ServicesStageFrameV1>/);
 assert.match(app,/lastFramed/);
 assert.match(read('../components/ServicesStageFrameV1.jsx'),/ResizeObserver/);
 assert.match(read('../components/ServicesStageFrameV1.jsx'),/translateZ\(0\)/);
 assert.match(read('../pages/ServicesV9.jsx'),/data-testid="services-house-space-v1"/);
 assert.match(read('../components/DeferredHouseStageV13.jsx'),/max-h-\[80%\]/);
});
test('Services house keeps a small steady root and fits narrow frames',()=>{
 const model=read('../three/ServicesHouseModelV1.jsx');
 assert.match(model,/const CENTER = \[\[0, 0\], \[1, 0\]\]/);
 assert.match(model,/const SCALE = \[\[0, 1\], \[1, 1\]\]/);
 assert.match(model,/<group scale=\{0.56\}>/);
 assert.match(model,/positionXTrack=\{CENTER\}/);
 assert.match(model,/positionYTrack=\{CENTER\}/);
 assert.doesNotMatch(model,/desktopXBias|viewportStage|useState/);
 const scene=read('../three/ServicesHouseSceneV1.jsx');
 assert.match(scene,/1.5 \/ aspect/);
 assert.match(scene,/updateProjectionMatrix/);
 assert.match(scene,/webglcontextlost/);
});
