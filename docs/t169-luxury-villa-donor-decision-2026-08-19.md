# T-169 — Luxury villa donor decision

Date: 2026-08-19

## Outcome

The downloaded `2123.skp` luxury-villa model is rejected as a full replacement for the protected Oak Park Construction hero house.

The existing compact procedural house remains the preferred and protected direction at:

- https://opc-house-hero-preview.vercel.app/

The donor remains isolated on `codex/model-integration-experiment-2026-08-18` and has not changed the protected branch, deployment, or animation choreography.

## Why the donor looks cartoonish

- The SketchUp source contains embedded texture references, but the current OpenSKP-to-GLB conversion retained geometry, UVs, material colors, and transparency without reconstructing the texture images in the GLB.
- The result therefore renders as flat architectural colors rather than a photoreal material set.
- The model is also organized as 337 meshes with generic names across one layer, so walls, roofs, glazing, pool, terraces, and furnishings are not cleanly identified for OPC's five scroll stages.

## Why it is the wrong replacement

- The massing is sprawling and mansion-scale rather than a practical South Florida residential project.
- Its pitched roofs, elevated wings, balconies, and railings change the character of the site too far from the compact modern OPC house.
- Preparing it for cutaways, additions, outdoor living, and groundwork would require manual mesh classification and reconstruction while still producing the wrong building type.

## Approved donor learnings

Use the model as reference only for:

1. Integrated terrace and pool levels instead of a single undifferentiated ground plane.
2. Deeper roof, fascia, and soffit layering.
3. More varied but restrained exterior material transitions around paving, coping, gravel, and stucco.
4. A clearer relationship between the house, steps, pool, and outdoor-living zone.

Do not transfer:

- the overall villa geometry;
- mansion scale or traditional massing;
- pitched roof forms;
- balconies or decorative railings;
- the donor's full site layout.

## Safe next direction

Keep the current house and apply any future realism pass as a new versioned experiment. The first useful comparison should focus on the ground/site presentation and material depth, not on replacing the house shape.
