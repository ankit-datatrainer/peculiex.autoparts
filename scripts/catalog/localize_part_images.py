"""Optional step 4: self-host the spare-part photos instead of loading them from the
source CDN.

Downloads every part image into frontend/public/assets/parts-catalog/ and rewrites the
model JSON chunks to point at the local copies. Roughly 5,000 files / ~95 MB.

    python scripts/catalog/localize_part_images.py

Re-running is safe: files already on disk are skipped, and chunks already pointing at
local paths are left alone.
"""
import concurrent.futures as cf
import hashlib
import json
import os
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODELS_DIR = os.path.join(ROOT, "frontend", "src", "data", "eauto", "models")
IMG_DIR = os.path.join(ROOT, "frontend", "public", "assets", "parts-catalog")
PUBLIC_PREFIX = "/assets/parts-catalog"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36"}

os.makedirs(IMG_DIR, exist_ok=True)


def local_name(url):
    base = url.split("?")[0]
    ext = os.path.splitext(base)[1].lower()
    if ext not in (".jpg", ".jpeg", ".png", ".webp"):
        ext = ".jpg"
    return hashlib.sha1(base.encode()).hexdigest()[:20] + ext


def download(job):
    url, path = job
    if os.path.exists(path) and os.path.getsize(path) > 500:
        return True
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=45) as r:
            data = r.read()
        if len(data) < 500:
            return False
        with open(path, "wb") as fh:
            fh.write(data)
        return True
    except Exception as exc:
        print("  failed:", url, exc)
        return False


chunks = [f for f in os.listdir(MODELS_DIR) if f.endswith(".json")]
jobs, rewrites = {}, []

for name in chunks:
    path = os.path.join(MODELS_DIR, name)
    with open(path, encoding="utf-8") as fh:
        chunk = json.load(fh)

    touched = False
    for part in chunk["parts"]:
        for field in ("image", "images"):
            value = part.get(field)
            if not value:
                continue
            urls = [value] if isinstance(value, str) else value
            mapped = []
            for url in urls:
                if url.startswith(PUBLIC_PREFIX):
                    mapped.append(url)
                    continue
                fname = local_name(url)
                jobs[url] = os.path.join(IMG_DIR, fname)
                mapped.append(f"{PUBLIC_PREFIX}/{fname}")
                touched = True
            part[field] = mapped[0] if isinstance(value, str) else mapped
    if touched:
        rewrites.append((path, chunk))

print(f"{len(jobs)} images to fetch across {len(rewrites)} model chunks")

with cf.ThreadPoolExecutor(12) as ex:
    ok = sum(ex.map(download, jobs.items()))
print(f"downloaded {ok}/{len(jobs)}")

if ok < len(jobs):
    print("some downloads failed - JSON left untouched so nothing points at a missing file")
    raise SystemExit(1)

for path, chunk in rewrites:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(chunk, fh, separators=(",", ":"))
print(f"rewrote {len(rewrites)} chunks to use {PUBLIC_PREFIX}/")
