"""Step 1: discover brand -> model-collection mapping from eauto.co.in brand pages."""
import json, re, urllib.request, time

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
BASE = "https://eauto.co.in"

BRAND_PAGES = [
    ("bajaj", "BAJAJ", "/pages/online-spare-parts-price-list-by-brand-b-bike-model"),
    ("hero", "HERO", "/pages/online-spare-parts-price-list-by-hero-bike-model"),
    ("honda", "HONDA", "/pages/online-spare-parts-price-list-by-honda-bike-model"),
    ("suzuki", "SUZUKI", "/pages/online-spare-parts-price-list-by-suzuki-bike-model"),
    ("tvs", "TVS", "/pages/online-spare-parts-price-list-by-tvs-bike-model"),
    ("yamaha", "YAMAHA", "/pages/online-spare-parts-price-list-by-yamaha-bike-model"),
    ("mahindra", "MAHINDRA", "/pages/online-spare-parts-price-list-by-mahindra-bike-model"),
    ("royal-enfield", "ROYAL ENFIELD", "/pages/online-spare-parts-price-list-by-royal-enfield-bike-model"),
]

# Brands that only have a single collection on eauto (no per-model landing page)
BRAND_COLLECTIONS = [
    ("ktm", "KTM", ["ktm-products"]),
    ("kawasaki", "KAWASAKI", ["online-spare-parts-price-list-for-kawasaki-ninja-bikes"]),
]

SKIP = re.compile(
    r"(carxneo|bikexneo|air-purifier|mobile-holder|^all$|3d-monogram|best-selling|"
    r"^online-(bajaj|hero|honda|suzuki|tvs|yamaha|mahindra)-bike-spare-parts|led|frontpage)",
    re.I,
)


def get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:
            if i == tries - 1:
                print("  !! fail", url, e)
                return ""
            time.sleep(2)


# Match: <a ... href="/collections/X" class="quick-links__link"> ... data-src="IMG" alt="ALT"
CARD = re.compile(
    r'href="/collections/([a-z0-9\-]+)"[^>]*class="quick-links__link".*?data-src="([^"]+)"[^>]*alt="([^"]*)"',
    re.S,
)
# Alternate layout (Royal Enfield page): overlay collection blocks with a title paragraph
CARD2 = re.compile(
    r'href="/collections/([a-z0-9\-]+)"[^>]*class="collection-block-item[^"]*".*?data-bg="([^"]+)".*?'
    r'class="collection-block-item__title[^"]*">([^<]*)<',
    re.S,
)

out = {}
for bid, bname, path in BRAND_PAGES:
    html = get(BASE + path)
    seen, models = set(), []
    cards = CARD.findall(html) or CARD2.findall(html)
    for handle, img, alt in cards:
        if handle in seen or SKIP.search(handle):
            continue
        seen.add(handle)
        models.append({"handle": handle, "cardImage": "https:" + img.split("?")[0].replace("_280x", ""), "alt": alt})
    out[bid] = {"id": bid, "name": bname, "page": path, "models": models}
    print(f"{bname}: {len(models)} models")

for bid, bname, handles in BRAND_COLLECTIONS:
    out[bid] = {"id": bid, "name": bname, "page": None,
                "models": [{"handle": h, "cardImage": None, "alt": ""} for h in handles]}
    print(f"{bname}: {len(handles)} collections")

json.dump(out, open("brand_models.json", "w"), indent=1)
print("total model collections:", sum(len(v["models"]) for v in out.values()))
