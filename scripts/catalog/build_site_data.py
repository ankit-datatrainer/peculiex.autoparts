"""Step 3: turn the raw eauto scrape into the data files the MotoMart frontend reads."""
import json, os, re, urllib.request, concurrent.futures as cf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA = os.path.join(ROOT, "frontend", "src", "data", "eauto")
MODELS_DIR = os.path.join(DATA, "models")
IMG_DIR = os.path.join(ROOT, "frontend", "public", "assets", "models")
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36"}

for d in (MODELS_DIR, IMG_DIR):
    os.makedirs(d, exist_ok=True)

raw = json.load(open("eauto_catalog.json"))

BRAND_LOGOS = {
    "bajaj": "/assets/brands/bajaj.svg", "hero": "/assets/brands/hero.svg",
    "honda": "/assets/brands/honda.svg", "suzuki": "/assets/brands/suzuki.svg",
    "tvs": "/assets/brands/tvs.svg", "yamaha": "/assets/brands/yamaha.svg",
    "mahindra": "/assets/brands/mahindra.svg", "royal-enfield": "/assets/brands/royal-enfield.svg",
    "ktm": None, "kawasaki": None,
}
BRAND_TAGLINE = {
    "bajaj": "Pulsar · Discover · Avenger & more", "hero": "Splendor · Passion · Glamour & more",
    "honda": "Activa · Shine · Unicorn & more", "suzuki": "Access · Gixxer · Hayate & more",
    "tvs": "Apache · Jupiter · Ntorq & more", "yamaha": "FZ · R15 · RX 100 & more",
    "mahindra": "Duro · Rodeo · Centuro & more", "royal-enfield": "Bullet · Classic · Thunderbird & more",
    "ktm": "Duke & RC spares", "kawasaki": "Ninja spares",
}

SCOOTER_WORDS = re.compile(
    r"\b(activa|dio|aviator|grazia|jupiter|ntorq|scooty|pep|wego|zest|streak|pleasure|maestro|destini|"
    r"duet|access|swish|let'?s|lets|burgman|fascino|ray|alpha|cygnus|gusto|duro|flyte|rodeo|kine|"
    r"chetak|activa|dio|saluto|avenis)\b", re.I)


def slugify(s):
    s = re.sub(r"\(.*?\)", " ", s)
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return re.sub(r"-+", "-", s) or "model"


def model_type(name):
    return "scooter" if SCOOTER_WORDS.search(name) else "bike"


def short_name(brand, title):
    """'Yamaha FZ (FZS, FZ16...)' -> 'FZ (FZS, FZ16...)' - drop the redundant brand prefix."""
    t = title.strip()
    for pre in (brand.title(), brand.upper(), brand.capitalize(), "Bike ", "Royal Enfield"):
        if t.lower().startswith(pre.lower()):
            t = t[len(pre):].strip(" -|")
    t = re.sub(r"\s*spare parts list at best price\s*$", "", t, flags=re.I)
    # brand-level collections (KTM, Kawasaki) strip down to nothing useful
    if not t or t.lower() in ("spare parts", "spares", "products"):
        return title
    return t


def pct_off(price, mrp):
    if mrp and mrp > price > 0:
        return round((mrp - price) / mrp * 100)
    return 0


def part_category(p):
    if p.get("type"):
        return p["type"].strip()
    for tag in p.get("tags", []):
        if tag.startswith("Category_"):
            return tag.split("_", 1)[1].strip()
    return "Spare Parts"


index_brands, part_index, image_jobs = [], {}, {}
total_parts = 0

for b in raw["brands"]:
    bid, bname = b["id"], b["name"]
    models_meta, used_slugs = [], set()
    brand_parts = 0

    for m in b["models"]:
        name = short_name(bname, m["name"])
        slug = slugify(name)
        while slug in used_slugs:
            slug += "-2"
        used_slugs.add(slug)
        key = f"{bid}__{slug}"

        # local path for the model card photo
        local_img = f"/assets/models/{key}.jpg"
        if m.get("image"):
            image_jobs[os.path.join(IMG_DIR, f"{key}.jpg")] = m["image"] + "?width=640"
        else:
            local_img = BRAND_LOGOS.get(bid) or "/assets/site-icon.svg"

        mtype = model_type(name)
        vehicle = "Scooter" if mtype == "scooter" else "Motorcycle"
        parts, cats = [], {}

        for p in m["parts"]:
            cat = part_category(p)
            cats[cat] = cats.get(cat, 0) + 1
            pid = f"ea-{p['id']}"
            off = pct_off(p["price"], p["compareAt"])
            parts.append({
                "id": pid,
                "name": p["title"],
                "brand": bname,
                "brandId": bid,
                "modelId": slug,
                "modelName": name,
                "category": cat,
                "partType": cat,
                "vehicleType": vehicle,
                "sku": p["sku"],
                "oemPartNumber": p["sku"],
                "vendor": p["vendor"],
                "price": p["price"],
                "mrp": p["compareAt"] or p["price"],
                "discountPercent": off,
                "badge": f"{off}% off" if off else "",
                "available": p["available"],
                "image": (p["images"][0] + "?width=520") if p["images"] else None,
                "images": [i + "?width=900" for i in p["images"]],
                "fit": f"Fits {bname.title()} {name}",
                "description": p["description"],
                "sourceUrl": f"https://eauto.co.in/products/{p['handle']}",
                "tags": p["tags"],
            })
            part_index[pid] = key

        brand_parts += len(parts)
        total_parts += len(parts)

        json.dump({
            "brandId": bid, "brandName": bname, "modelId": slug, "modelName": name,
            "type": mtype, "vehicleType": vehicle, "image": local_img,
            "sourceCollection": m["id"],
            "categories": [{"name": k, "count": v} for k, v in sorted(cats.items(), key=lambda x: (-x[1], x[0]))],
            "parts": parts,
        }, open(os.path.join(MODELS_DIR, key + ".json"), "w"), separators=(",", ":"))

        models_meta.append({
            "id": slug, "name": name, "type": mtype, "image": local_img,
            "partsCount": len(parts),
            "topCategories": [k for k, _ in sorted(cats.items(), key=lambda x: (-x[1], x[0]))[:3]],
        })

    models_meta.sort(key=lambda x: -x["partsCount"])
    index_brands.append({
        "id": bid, "name": bname,
        "logo": BRAND_LOGOS.get(bid),
        "tagline": BRAND_TAGLINE.get(bid, ""),
        "heroImage": models_meta[0]["image"] if models_meta else "/assets/site-icon.svg",
        "modelCount": len(models_meta),
        "partsCount": brand_parts,
        "bikeCount": sum(1 for x in models_meta if x["type"] == "bike"),
        "scooterCount": sum(1 for x in models_meta if x["type"] == "scooter"),
        "models": sorted(models_meta, key=lambda x: x["name"]),
    })

index_brands.sort(key=lambda x: -x["partsCount"])
json.dump({"scrapedAt": raw["scrapedAt"], "source": raw["source"],
           "totalParts": total_parts, "brands": index_brands},
          open(os.path.join(DATA, "index.json"), "w"), indent=1)
json.dump(part_index, open(os.path.join(DATA, "part-index.json"), "w"), separators=(",", ":"))

print(f"brands={len(index_brands)} models={len(part_index) and sum(b['modelCount'] for b in index_brands)} parts={total_parts}")

# ---- download the model card photos (small set, worth self-hosting) ----
def fetch(item):
    path, url = item
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        return 1
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=40) as r:
            data = r.read()
        if len(data) < 500:
            return 0
        open(path, "wb").write(data)
        return 1
    except Exception as e:
        print("  img fail", url, e)
        return 0

with cf.ThreadPoolExecutor(10) as ex:
    ok = sum(ex.map(fetch, image_jobs.items()))
print(f"model images downloaded: {ok}/{len(image_jobs)}")
