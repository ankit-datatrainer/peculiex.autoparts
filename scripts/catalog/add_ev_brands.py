"""Step 5: fold the electric brands into the spares-by-bike catalog.

OLA, ATHER, VIDA and IQUBE are not sold on the scraped source, so their models and
parts come from the in-repo curated catalog (frontend/src/lib/catalogData.js) instead.
This writes them into the same index.json / model-chunk shape as the scraped brands, so
the brand pages, the Spares by Bike menu and the header all pick them up unchanged.

    python scripts/catalog/add_ev_brands.py

Idempotent: existing electric-brand entries are replaced, scraped brands are untouched.
Re-run it after editing the electric brands in catalogData.js.
"""
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FRONTEND = os.path.join(ROOT, "frontend")
DATA = os.path.join(FRONTEND, "src", "data", "eauto")
MODELS_DIR = os.path.join(DATA, "models")
CATALOG_JS = os.path.join(FRONTEND, "src", "lib", "catalogData.js")
PARTS_IMG_DIR = os.path.join(FRONTEND, "public", "assets", "parts")

EV_BRANDS = {
    "ola": "S1 Pro · S1 Air · Roadster & more",
    "ather": "450X · 450S · Rizta & more",
    "vida": "V1 Pro · V1 Plus",
    "iqube": "iQube · iQube S · iQube ST",
}


def read_js_array(source, name, next_export):
    """catalogData.js stores plain JSON literals, so slice the array out and parse it."""
    start = source.index(f"export const {name} = ") + len(f"export const {name} = ")
    end = source.index(f"export const {next_export}")
    return json.loads(source[start:end].rstrip().rstrip(";").rstrip())


def slugify(value):
    value = re.sub(r"\(.*?\)", " ", value)
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return re.sub(r"-+", "-", value) or "model"


def pct_off(price, mrp):
    return round((mrp - price) / mrp * 100) if mrp and mrp > price > 0 else 0


def part_image(brand_id, product):
    """Prefer the brand-specific artwork over the generic part photo when it exists."""
    part_slug = os.path.basename(product["image"])
    branded = f"{brand_id}-{part_slug}"
    if os.path.exists(os.path.join(PARTS_IMG_DIR, branded)):
        return f"/assets/parts/{branded}"
    return product["image"]


source = open(CATALOG_JS, encoding="utf-8").read()
company_brands = read_js_array(source, "companyBrands", "bikePartTypes")
products = read_js_array(source, "initialProducts", "initialCategories")

index_path = os.path.join(DATA, "index.json")
index = json.load(open(index_path, encoding="utf-8"))

# drop any previous run so re-running never duplicates a brand
index["brands"] = [b for b in index["brands"] if b["id"] not in EV_BRANDS]
for stale in os.listdir(MODELS_DIR):
    if stale.split("__")[0] in EV_BRANDS:
        os.remove(os.path.join(MODELS_DIR, stale))

added_models = 0

for brand in company_brands:
    bid = brand["id"]
    if bid not in EV_BRANDS:
        continue

    bname = brand["name"]
    brand_products = [p for p in products if p["brand"] == bname]
    if not brand_products:
        print(f"  skipping {bname}: no parts in the curated catalog")
        continue

    parts_template = []
    for product in brand_products:
        image = part_image(bid, product)
        parts_template.append({
            "id": product["id"],
            "name": product["name"],
            "brand": bname,
            "brandId": bid,
            "category": product["partType"],
            "partType": product["partType"],
            "vehicleType": product.get("vehicleType", "Electric"),
            "sku": product.get("oemPartNumber", ""),
            "oemPartNumber": product.get("oemPartNumber", ""),
            "vendor": brand["code"],
            "price": product["price"],
            "mrp": product["mrp"],
            "discountPercent": pct_off(product["price"], product["mrp"]),
            "badge": f"{pct_off(product['price'], product['mrp'])}% off",
            "available": True,
            "image": image,
            "images": [image],
            "description": " ".join(product.get("about", []))[:420],
            "sourceUrl": product.get("officialSourceUrl", brand["website"]),
            "tags": [f"VehicleBrand_{bname}"],
        })

    categories = [{"name": p["category"], "count": 1} for p in parts_template]
    models_meta = []

    for kind, names in (("bike", brand["models"]["bikes"]), ("scooter", brand["models"]["scooters"])):
        vehicle = "Electric Bike" if kind == "bike" else "Electric Scooter"
        for name in names:
            slug = slugify(name)
            # every curated part is listed as fitting the whole model range
            parts = [
                {**p, "modelId": slug, "modelName": name, "fit": f"Fits {bname} {name}"}
                for p in parts_template
            ]
            json.dump({
                "brandId": bid, "brandName": bname, "modelId": slug, "modelName": name,
                "type": kind, "vehicleType": vehicle, "image": brand["image"],
                "sourceCollection": None,
                "categories": categories,
                "parts": parts,
            }, open(os.path.join(MODELS_DIR, f"{bid}__{slug}.json"), "w"), separators=(",", ":"))

            models_meta.append({
                "id": slug, "name": name, "type": kind, "image": brand["image"],
                "partsCount": len(parts),
                "topCategories": [c["name"] for c in categories[:3]],
            })
            added_models += 1

    index["brands"].append({
        "id": bid,
        "name": bname,
        "logo": brand["image"],
        "tagline": EV_BRANDS[bid],
        "heroImage": brand["image"],
        "modelCount": len(models_meta),
        "partsCount": len(models_meta) * len(parts_template),
        "bikeCount": sum(1 for m in models_meta if m["type"] == "bike"),
        "scooterCount": sum(1 for m in models_meta if m["type"] == "scooter"),
        "models": sorted(models_meta, key=lambda m: m["name"]),
    })
    print(f"{bname:>14} {len(models_meta):>2} models  {len(parts_template)} parts each")

index["brands"].sort(key=lambda b: -b["partsCount"])
index["totalParts"] = sum(
    m["partsCount"] for b in index["brands"] for m in b["models"]
)
json.dump(index, open(index_path, "w"), indent=1)

print(f"\nbrands={len(index['brands'])} models={sum(b['modelCount'] for b in index['brands'])} "
      f"parts={index['totalParts']} (+{added_models} electric models)")
