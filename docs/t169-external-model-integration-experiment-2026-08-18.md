# T169 — Realistic external-model integration experiment

Date: 2026-08-18

## Protection and rollback

- Protected source remains unchanged on `emergent-house-hero-source-2026-08-17`.
- Protected checkpoint: `4c96c39`.
- Permanent rollback tag: `opc-review-before-model-integration-2026-08-18`.
- All experimental work is isolated on `codex/model-integration-experiment-2026-08-18`.
- The public protected preview must not be replaced until the experiment has its own review URL and passes the acceptance checks below.

## Candidate

- Source: CGTrader, “Luxury Modern Villa Pool 3D Model”.
- Model ID: `7273726`.
- Listed formats: SketchUp, Lumion, OBJ, MTL, materials and textures.
- Listed complexity: 24,285 polygons, 35,000 vertices, 38 materials and 23 textures.
- SketchUp hierarchy listed by the source: 178 groups and 67 component instances.
- License shown by the source: free Royalty Free License, no AI usage.
- The local source archive has not appeared in Downloads yet. Public preview images are saved only for evaluation and documentation; they are not website assets.

## Visual decision

The full candidate house is a sprawling pitched-roof villa and does not preserve the compact, modern silhouette or the existing hero composition. Its strongest fit is as a donor source for higher-quality outdoor construction elements:

- pool shell, coping, water and steps;
- terrace and paver materials;
- retaining walls, hardscape and stairs;
- pergola or covered outdoor-living components;
- restrained South Florida landscaping;
- better rectangular lot treatment to replace the gray circular platform.

The full-house replacement remains an option only if the downloaded hierarchy allows the structure, roof, glazing and outdoor components to be separated without destructive rework.

## Better donor candidate found

The follow-up research found a more targeted free candidate: CGTrader model `6589173`, “Modern Villa Landscape Backyard Design—pergola—pool.” It is preferable for the outdoor chapters because the creator explicitly says the main villa is not included and the scene uses organized groups and layers. It includes SKP, FBX, DAE and OBJ files, is listed as low-poly, and contains a pool, pergola, paths, lawn and garden elements.

Tradeoff: its archive is listed at 206 MB and roughly 80,000 polygons, so it must be selectively extracted and optimized before web use. It should be tested as the first outdoor donor once a signed-in download is available. The original `7273726` candidate remains useful as a visual-quality reference and possible hardscape donor, but not as the default full-house replacement.

## Required staged story

The experiment must keep the existing “one house, every service” behavior:

1. Clean initial shell on a simple, premium rectangular lot.
2. Interior/cutaway remodel reveal.
3. Recessed addition grows from the original volume.
4. Pergola, pool and outdoor-living elements appear.
5. Driveway, concrete and pavers complete the property.

No stage may expose later-stage objects early. The opening view must remain visually calm and lightweight.

## Technical acceptance gates

- The original protected version remains deployable and visually unchanged.
- Objects needed for each scroll stage are separate meshes or reliably addressable groups.
- Web model is converted to GLB/GLTF and optimized; original source files stay in the experiment archive.
- Materials survive conversion without missing textures, glare, or washed-out lighting.
- Desktop, iPad and mobile framing remain intentional at every stage.
- Hero text never covers the main transformation.
- No visible wall/roof gaps, open corners, floating panels, z-fighting or jagged shadow artifacts.
- Initial load remains performance-safe; large optional details can load after the first frame.
- Reduced-motion and low-power fallbacks keep a complete, attractive static composition.

## Next inspection step

When the archive appears in Downloads, copy it into this experiment, preserve the original, inspect its object hierarchy and textures, then produce a small GLB test before integrating any object into the live hero.
