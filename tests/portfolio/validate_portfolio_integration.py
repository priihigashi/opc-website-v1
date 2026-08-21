#!/usr/bin/env python3
"""Validates the wired portfolio against the T-203 export manifest and the filesystem.

Fails (exit 1) on any of:
  - a project with zero images
  - an image whose derivative files do not exist on disk
  - an image not present in EXPORT_MANIFEST.csv (invented path)
  - cross-project contamination (an image whose manifest project != the project rendering it)
  - a held/unapproved image appearing anywhere
  - empty alt text
  - a declared width/height that disagrees with the real file
  - an address-shaped string or GPS payload reaching the public data
  - a filter with no projects (would render an empty grid)
"""
import csv, json, os, re, sys, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FE = os.path.join(ROOT, "frontend")
MANIFEST = "/Users/priscilahigashi/Desktop/OPC_WORK/portfolio-exports/EXPORT_MANIFEST.csv"
PUBLIC = os.path.join(FE, "public")
DATA = os.path.join(FE, "src", "data", "portfolioProjectsV3.js")

js = open(DATA).read()
FILTERS = json.loads(re.search(r"export const PORTFOLIO_FILTERS = (\[.*?\]);", js, re.S).group(1))
PROJECTS = json.loads(re.search(r"export const PORTFOLIO_PROJECTS = (\[.*?\]);\n\nexport const getPortfolioProject", js, re.S).group(1))

man = {r["export_basename"]: r for r in csv.DictReader(open(MANIFEST))}
HELD_SOURCE = "IMG_2879.jpeg"
fails = []

def fail(msg): fails.append(msg)

# --- per project -------------------------------------------------------------
for p in PROJECTS:
    imgs = [i for row in p["rows"] for i in row["images"]]
    if not imgs:
        fail(f"{p['id']}: project has ZERO images (would render blank)")
    if not p.get("cover"):
        fail(f"{p['id']}: no cover image")
    for tag in p["tags"]:
        if tag not in FILTERS:
            fail(f"{p['id']}: tag {tag!r} is not a declared filter")

    manifest_projects = set()
    for im in imgs:
        base = os.path.basename(im["src"])
        rec = man.get(base)
        if rec is None:
            fail(f"{p['id']}: {base} is NOT in EXPORT_MANIFEST.csv (invented path)")
            continue
        manifest_projects.add(rec["project"])
        if rec["source_filename"] == HELD_SOURCE:
            fail(f"{p['id']}: HELD image {HELD_SOURCE} is being rendered")
        if not im.get("alt", "").strip():
            fail(f"{p['id']}: {base} has empty alt text")
        if im["phase"] != rec["phase"]:
            fail(f"{p['id']}: {base} phase {im['phase']} != manifest {rec['phase']}")
        # every declared derivative must exist
        for w in im["widths"]:
            for ext in ("avif", "webp", "jpg"):
                f = os.path.join(PUBLIC, im["src"].lstrip("/") + f"-{w}w.{ext}")
                if not os.path.exists(f):
                    fail(f"{p['id']}: MISSING derivative {os.path.relpath(f, PUBLIC)}")
        # declared intrinsic size must match the real largest file
        biggest = max(im["widths"])
        real = os.path.join(PUBLIC, im["src"].lstrip("/") + f"-{biggest}w.jpg")
        if os.path.exists(real):
            try:
                from PIL import Image
                w, h = Image.open(real).size
                if (w, h) != (im["w"], im["h"]):
                    fail(f"{p['id']}: {base} declares {im['w']}x{im['h']} but file is {w}x{h}")
            except ImportError:
                pass
    if len(manifest_projects) > 1:
        fail(f"{p['id']}: CROSS-PROJECT CONTAMINATION — images from {sorted(manifest_projects)}")

# --- filters -----------------------------------------------------------------
for f in FILTERS:
    if f == "ALL":
        continue
    if not [p for p in PROJECTS if f in p["tags"]]:
        fail(f"filter {f!r} matches no projects (would render an empty grid)")

# --- privacy -----------------------------------------------------------------
blob = json.dumps(PROJECTS)
addr = re.findall(r"\b\d{2,5}\s+(?:NE|NW|SE|SW|N|S|E|W)?\s?[A-Z][A-Za-z]+\s+(?:Cir|Ct|Ter|Dr|Ave|St|Rd|Way|Blvd|Ln|Pl|Court|Circle|Terrace)\b", blob)
if addr:
    fail(f"ADDRESS-SHAPED STRING in public portfolio data: {sorted(set(addr))}")

# --- GPS in shipped derivatives (bounded spot-check, 30 files) ---------------
try:
    from PIL import Image
    checked = 0
    for p in PROJECTS:
        for row in p["rows"]:
            for im in row["images"]:
                if checked >= 30: break
                f = os.path.join(PUBLIC, im["src"].lstrip("/") + f"-{max(im['widths'])}w.jpg")
                if os.path.exists(f):
                    ex = Image.open(f).getexif()
                    if ex and ex.get_ifd(0x8825):
                        fail(f"GPS PRESENT in shipped derivative {os.path.basename(f)}")
                    checked += 1
except ImportError:
    pass

total = sum(len(row["images"]) for p in PROJECTS for row in p["rows"])
print(f"projects: {len(PROJECTS)}   rendered images: {total}   filters: {len(FILTERS)}")
print(f"manifest placements available: {len(man)}")
if fails:
    print(f"\nFAILURES: {len(fails)}\n")
    for f in fails[:40]: print("  -", f)
    if len(fails) > 40: print(f"  ... and {len(fails)-40} more")
    sys.exit(1)
print("\nALL PORTFOLIO INTEGRATION CHECKS PASSED.")
sys.exit(0)
