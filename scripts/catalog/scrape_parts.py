"""Step 2: for every model collection, pull collection meta + all spare-part products."""
import json, re, time, urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
BASE = "https://eauto.co.in"

brands = json.load(open("brand_models.json"))


def getjson(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.loads(r.read().decode("utf-8", "replace"))
        except Exception as e:
            if i == tries - 1:
                print("   !!", url, e)
                return None
            time.sleep(2)


def clean_img(src):
    return src.split("?")[0] if src else None


def strip_html(html, limit=420):
    txt = re.sub(r"<[^>]+>", " ", html or "")
    txt = (txt.replace("&nbsp;", " ").replace("&amp;", "&").replace("&quot;", '"')
              .replace("&#39;", "'").replace("&lt;", "<").replace("&gt;", ">"))
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt[:limit]


catalog = {"scrapedAt": time.strftime("%Y-%m-%d"), "source": BASE, "brands": []}
total_parts = 0

for bid, b in brands.items():
    bout = {"id": bid, "name": b["name"], "models": []}
    for m in b["models"]:
        handle = m["handle"]
        meta = getjson(f"{BASE}/collections/{handle}.json")
        col = (meta or {}).get("collection", {})
        title = col.get("title") or handle.replace("-", " ").title()

        products, page = [], 1
        while True:
            data = getjson(f"{BASE}/collections/{handle}/products.json?limit=250&page={page}")
            items = (data or {}).get("products", [])
            if not items:
                break
            products.extend(items)
            if len(items) < 250:
                break
            page += 1
            time.sleep(0.2)

        parts = []
        for p in products:
            variants = p.get("variants") or []
            v = variants[0] if variants else {}
            imgs = [clean_img(i.get("src")) for i in (p.get("images") or [])][:3]
            parts.append({
                "id": str(p.get("id")),
                "handle": p.get("handle"),
                "title": p.get("title", "").strip(),
                "vendor": p.get("vendor"),
                "type": p.get("product_type") or "",
                "tags": p.get("tags") or [],
                "price": float(v.get("price") or 0),
                "compareAt": float(v["compare_at_price"]) if v.get("compare_at_price") else None,
                "available": bool(v.get("available")),
                "sku": v.get("sku") or "",
                "images": imgs,
                "description": strip_html(p.get("body_html")),
            })

        cardImage = m.get("cardImage") or clean_img((col.get("image") or {}).get("src"))
        bout["models"].append({
            "id": handle,
            "name": title,
            "image": cardImage,
            "alt": m.get("alt") or (col.get("image") or {}).get("alt") or f"{b['name']} {title} spare parts",
            "partsCount": len(parts),
            "parts": parts,
        })
        total_parts += len(parts)
        print(f"{b['name']:>14} | {title:<38} {len(parts):>4} parts")
        time.sleep(0.15)
    catalog["brands"].append(bout)

json.dump(catalog, open("eauto_catalog.json", "w"), indent=1)
print("\nTOTAL PARTS:", total_parts)
