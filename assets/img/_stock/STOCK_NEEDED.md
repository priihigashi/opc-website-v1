# Stock Photo Manifest — What's needed before production

**Status:** Mike's photo library has 7 categories × 6 photos = 42 photos. Production OPC website needs 4 more service categories represented. This file lists what's missing + where to source.

Last updated: 2026-06-09

---

## 🔴 Critical gaps (block production launch)

### Stucco service page
**Status:** Currently uses `new-construction/` + `shell-construction/` as stand-ins on prototype #17.

**Photos needed:** 6 total
1. Wire lath being installed (close-up showing diamond mesh + building paper)
2. Scratch coat going on (worker with hawk + trowel, horizontal scratch lines visible)
3. Brown coat troweled smooth (mid-application, partially complete)
4. Finish coat being applied (sand-float or smooth texture)
5. Completed stucco wall — wide shot, golden hour
6. Repair vs new comparison — patched section next to fresh

**Free-stock sources** (in order of preference):
- Unsplash: search `"stucco wall application"` · `"plastering worker"` · `"trowel cement"`
- Pexels: search `"stucco"` · `"plaster wall"` · `"facade work"`
- Pixabay: same queries

**Or:** ask Mike for 6 shots from his next stucco job.

### Renovation service page
**Status:** Can repurpose `shell-construction/` (IMG_5402, IMG_5456) for during-shots.

**Photos needed:** 6 ideal
1. Before — gutted kitchen (drywall down, no cabinets)
2. During — framing visible, electrical roughed in
3. During — drywall up, paint primed
4. After — same room, finished
5. Before/after pair shot for hero (split-screen layout)
6. Detail — molding/trim closeup

**Free-stock sources:**
- Unsplash: search `"home renovation before"` · `"kitchen demo"` · `"renovation project"`
- Pexels: search `"home renovation"` · `"interior remodel"`

### Additions service page
**Status:** No dedicated photos. Stop-gap = `new-construction/122-dockside-cir-*` mid-build shots.

**Photos needed:** 6 ideal
1. Existing house — before addition starts
2. Foundation pour for addition (matched to existing footprint)
3. New wall framing attached to existing wall (tie-in visible)
4. Roofline merged — old vs new
5. Siding/stucco matched to original
6. Final — addition seamless with original

**Free-stock sources:**
- Unsplash: search `"house addition framing"` · `"home expansion"` · `"second story addition"`

### Decks service page (separate from Outdoor)
**Status:** Currently bundled in `exterior-patio-builds/` (Clark Pergola dominates).

**Photos needed:** 3-4 specific deck shots
1. Trex composite deck — top-down or angled
2. IPE hardwood deck — close-up of grain
3. Paver patio detail (geometric pattern)
4. Joist/substructure shot (engineering trust signal)

---

## 🟢 Categories already covered (no action)

| Category | Folder | Count | Coverage |
|---|---|---|---|
| Bathrooms | `bathrooms/` | 6 | ✅ Full |
| Kitchens | `kitchens/` | 6 | ✅ Full |
| New Construction | `new-construction/` | 6 | ✅ Full (all 122 Dockside Cir) |
| Concrete | `concrete-work/` | 6 | ✅ Full (Rio Vista + Opa-locka) |
| Outdoor / Patios | `exterior-patio-builds/` | 6 | ✅ Full (Clark Pergola + Harbor Ct) |
| Shell Construction | `shell-construction/` | 6 | ✅ Reusable for Renovation/Additions |
| Commercial Build-Out | `commercial-build-out/` | 6 | ✅ Full (Plantation salon) — future use |

---

## 📂 File naming convention (when adding stock)

```
assets/img/_stock/<service>/<source>_<descriptor>_<id>.jpeg
```

Examples:
- `_stock/stucco/unsplash_scratch-coat_abc123.jpeg`
- `_stock/renovation/pexels_kitchen-demo_456789.jpeg`

The `_stock/` prefix flags them as placeholders in folder listings. The source prefix (`unsplash_` / `pexels_`) makes it easy to grep + replace when Mike's real photos arrive.

**Always add `<!-- STOCK PLACEHOLDER -->` HTML comment** next to any `<img>` tag using these files. That way `grep -r "STOCK PLACEHOLDER"` finds every swap point.

---

## License notes

- **Unsplash:** All photos free for commercial use, no attribution required (but appreciated).
- **Pexels:** Same.
- **Pixabay:** Same.

No paid stock libraries needed. Avoid Getty/Shutterstock.
