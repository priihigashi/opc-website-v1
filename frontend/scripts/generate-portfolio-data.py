"""Generate portfolioProjectsV3.js from the verified T-203 EXPORT_MANIFEST.csv.
Project-first. No visual inference. Every field traces to the manifest."""
import csv, json, collections, os

MANIFEST = "/Users/priscilahigashi/Desktop/OPC_WORK/portfolio-exports/EXPORT_MANIFEST.csv"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "data", "portfolioProjectsV3.js")
BASE = "/images/opc/portfolio"

# Existing V2 filter labels are PRESERVED verbatim (StoryV11/StoryV13/serviceContentV3 link to them).
# ADDITIONS and COMMERCIAL are ADDED so the old published gallery's categories all have V2 parity.
FILTERS = ["ALL", "FULL HOME REMODELS", "KITCHENS + BATHROOMS", "ADDITIONS",
           "OUTDOOR LIVING", "SHELL + NEW BUILD", "CONCRETE", "COMMERCIAL"]

# manifest category -> V2 filter tag
CAT_TAG = {
    "Full Home Remodels": "FULL HOME REMODELS",
    "New Builds": "SHELL + NEW BUILD",
    "Additions": "ADDITIONS",
    "Kitchens & Bathrooms": "KITCHENS + BATHROOMS",
    "Exterior Features & Outdoor Living": "OUTDOOR LIVING",
    "Commercial Build-Out": "COMMERCIAL",
}
# "Shell & Concrete" is split by project, because the manifest groups two different
# kinds of work under one category. Project names are the evidence, not the imagery.
SHELL_CONCRETE_TAG = {
    "Kinney Shell Build": "SHELL + NEW BUILD",
    "Rio Vista Concrete": "CONCRETE",
    "Pompano Patio Slab": "CONCRETE",
}

# Extra service tags taken from how the OLD PUBLISHED SITE itself categorised a project.
# This is documentary evidence of OPC's own classification, not a visual judgement.
# oakpark-construction.com/jobgallery/full-home-remodel/ listed four projects: Pompano
# Beach, Home Theater, Crestheaven and Victoria Park. Victoria Park's photos there sit at
# the same GPS property (26.129,-80.135) as the victoria-park selects, so the project the
# old site called a Full Home Remodel is the one already in V2.
# Priscila 2026-08-21: "don't put the repetition ... just have unique ones and the biggest
# of them ... you keep the one with more photos". Each project appears under exactly ONE
# category. The default winner is the scope carrying the most photographs.
# PRIMARY_TAG is an explicit override where she or the old published site named the
# category directly — she called Victoria Park a full remodel, and
# oakpark-construction.com/jobgallery/full-home-remodel/ listed it there too.
PRIMARY_TAG = {
    "Victoria Park": "FULL HOME REMODELS",
}

# Route ids. Existing V2 routes are PRESERVED where the project genuinely corresponds.
ROUTE_ID = {
    "Harbor Court": "harbor-court-residence",      # existing route + live redirect from 1270-harbor-court
    "Pergola Outdoor Living": "clark-pergola",     # existing route, approved pergola asset
    "Rio Vista Concrete": "concrete-work",         # existing route held exactly these images
    "Kinney Shell Build": "shell-construction",    # existing route was the shell project
    "Dockside Full Home Remodel": "dockside-full-home-remodel",
    "Victoria Park": "victoria-park-residence",
    "Miami New Build": "miami-new-build",
    "Weston New Build": "weston-new-build",
    "Pompano Kitchen Remodel": "pompano-kitchen-remodel",
    "Matte Black Bathroom": "matte-black-bathroom",
    "Pompano Patio Slab": "pompano-patio-slab",
    "Salon Buildout": "salon-buildout",
    "Opa Locka Airport": "opa-locka-airport",
}
# Public titles. Approved/privacy-corrected titles are preserved; nothing is invented.
TITLE = {
    "Harbor Court": "Harbor Court Residence",
    "Pergola Outdoor Living": "Clark Pergola + Outdoor Kitchen",
}
SCOPE_WORD = {
    "full-home-remodel": "Full Home Remodel", "new-build": "New Build", "addition": "Addition",
    "kitchen-bath": "Kitchen + Bath", "shell-concrete": "Shell + Concrete",
    "outdoor-living": "Outdoor Living", "commercial": "Commercial Build-Out",
}
PHASE_LABEL = {"BEFORE": "Before", "DURING": "During Construction", "AFTER": "Finished"}
PHASE_ORDER = {"BEFORE": 0, "DURING": 1, "AFTER": 2}

rows = list(csv.DictReader(open(MANIFEST)))

def tag_for(r):
    if r["category"] == "Shell & Concrete":
        return SHELL_CONCRETE_TAG[r["project"]]
    return CAT_TAG[r["category"]]

def image_obj(r):
    d = json.loads(r["derivatives"])
    widths = sorted({m["width"] for m in d})
    biggest = max(d, key=lambda m: m["width"])
    folder = os.path.dirname(json.loads(r["derivatives"])[0]["file"])
    return {
        "id": r["stable_id"],
        "src": f"{BASE}/{folder}/{r['export_basename']}",
        "w": biggest["width"], "h": biggest["height"],
        "widths": widths,
        "alt": r["alt_text"],
        "phase": r["phase"],
        "seq": int(r["sequence"]),
        "orientation": r["orientation"],
        "role": r["view"],
        "source": r["source_filename"],
    }

projects = collections.OrderedDict()
for r in sorted(rows, key=lambda r: (r["project"], r["scope_slug"], PHASE_ORDER[r["phase"]], int(r["sequence"]))):
    p = projects.setdefault(r["project"], {
        "id": ROUTE_ID[r["project"]],
        "title": TITLE.get(r["project"], r["project"]),
        "tags": [], "scope_tags": {}, "scopes": collections.OrderedDict(), "seen": set(),
    })
    t = tag_for(r)
    p.setdefault("scope_tags", {})
    p["scope_tags"].setdefault(r["scope_slug"], t)
    if r["source_filename"] in p["seen"]:
        continue                      # same photo placed under two scopes: keep the first
    p["seen"].add(r["source_filename"])
    p["scopes"].setdefault(r["scope_slug"], []).append(image_obj(r))

out = []
for name, p in projects.items():
    multi = len(p["scopes"]) > 1
    # one category per project: the scope with the most photographs wins, unless
    # PRIMARY_TAG names it explicitly.
    biggest_scope = max(p["scopes"], key=lambda sc: len(p["scopes"][sc]))
    p["tags"] = [PRIMARY_TAG.get(name, p["scope_tags"][biggest_scope])]
    rows_out, all_imgs = [], []
    # One row per SCOPE, ordered BEFORE -> DURING -> AFTER. Splitting further by phase
    # produced 11 single-image "carousels" with two dead arrows; the phase is carried on
    # each slide instead, so the sequence still reads chronologically.
    for scope, imgs in p["scopes"].items():
        ordered = sorted(imgs, key=lambda i: (PHASE_ORDER[i["phase"]], i["seq"]))
        all_imgs.extend(ordered)
        present = [ph for ph in ("BEFORE", "DURING", "AFTER") if any(i["phase"] == ph for i in ordered)]
        span = " → ".join(PHASE_LABEL[ph] for ph in present)
        label = f"{SCOPE_WORD[scope]} · {span}" if multi else span
        rows_out.append({"label": label, "phases": present, "images": ordered})

    # The manifest already designates hero candidates during curation. Honour that
    # rather than picking a cover by position — position is not an editorial judgement.
    heroes = [i for i in all_imgs if i.get("role") == "hero"]
    finished = [i for i in all_imgs if i["phase"] == "AFTER"]
    cover = heroes[0] if heroes else (finished[-1] if finished else all_imgs[-1])
    phases_present = [ph for ph in ("BEFORE", "DURING", "AFTER") if any(i["phase"] == ph for i in all_imgs)]

    scope_words = " · ".join(SCOPE_WORD[s] for s in p["scopes"])
    seq_words = " → ".join(PHASE_LABEL[ph] for ph in phases_present)
    out.append({
        "id": p["id"],
        "title": p["title"],
        "tags": p["tags"],
        "cat": p["tags"][0],
        "phase": "Multi-scope project" if multi else PHASE_LABEL[phases_present[-1]],
        "detail": scope_words,
        "intro": f"{len(all_imgs)} verified photographs from this project, in order: {seq_words}.",
        "cover": cover,
        "rows": rows_out,
        "imageCount": len(all_imgs),
    })

# Largest projects lead; featured flag drives the wide card.
out.sort(key=lambda p: -p["imageCount"])
for i, p in enumerate(out):
    p["featured"] = i in (0, 3)

body = "// GENERATED from the verified T-203 EXPORT_MANIFEST.csv — do not hand-edit.\n"
body += "// Every image, phase, sequence and alt string traces to the READY_FOR_WEB manifest.\n\n"
body += "export const PORTFOLIO_FILTERS = " + json.dumps(FILTERS) + ";\n\n"
body += "export const PORTFOLIO_PROJECTS = " + json.dumps(out, indent=2, ensure_ascii=False) + ";\n\n"
body += "export const getPortfolioProject = (id) => PORTFOLIO_PROJECTS.find((project) => project.id === id);\n"
open(OUT, "w").write(body)

print(f"projects: {len(out)}   placements: {sum(p['imageCount'] for p in out)}")
for p in out:
    print(f"  {p['imageCount']:3d} imgs  {p['id']:<28} {', '.join(p['tags'])}")
