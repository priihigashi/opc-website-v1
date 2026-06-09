# OPC Photo Source Audit - 2026-06-09

## Decision

The rebuilt site should not rely only on the small `assets/img/catalog/` subset or on filename labels. The source of truth for project photos is:

1. Google Sheet: Ideas & Inbox (`1IrFrCNGVIF7cvAr9cIuAXvCtUR_-eQN1mdCpHXpfbcU`) tab `Photo Catalog`.
2. Local website assets under `assets/img/mike/`.
3. Legacy WordPress gallery at `https://oakpark-construction.com/gallery/` and linked job gallery pages.

## Confirmed Catalog Tabs

- `Photo Catalog`: 1,279 rows, columns include project name, service type, filename, Drive URL, AI description, phase, quality, enhanced, used.
- `Project Content Catalog`
- `Photo Log`
- `Proof Post Candidates`

## Important Finding

Some catalog rows are mislabeled by service category, so the website build should use semantic descriptions and project names, not only the service label. Example: `CMU Block Addition Yellow House` appears under `Kitchens`, but it is an addition/shell-construction photo.

## Local Assets Now Available

`assets/img/mike/` contains real OPC folders for:

- `bathrooms`
- `commercial-build-out`
- `concrete-work`
- `exterior-patio-builds`
- `kitchens`
- `new-construction`
- `shell-construction`

## Legacy Website Categories To Bring Forward

From `https://oakpark-construction.com/gallery/`:

- New Build & Additions
- Full Home Remodel
- Shell & Concrete
- Kitchen & Bath Builds
- Exterior Feature Builds
- Commercial Buildout
- Before & After

## Current Fix Applied

Homepage and About page image references were updated to use real Mike/source folders instead of mismatched placeholders for kitchens, bathrooms, shell/additions, outdoor living, new construction, concrete, and stucco. The remaining work is to build full service pages and case-study pages using the catalog rows, Drive URLs, and legacy gallery media together.

