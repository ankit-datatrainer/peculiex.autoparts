"""
Turns the Wikimedia Commons downloads chosen for each part type into site
images and the credits list.

  input   scripts/.tmp/commons/<key>.jpg|png      (raw downloads)
          scripts/.tmp/commons_results.jsonl      (licence + author per key)
  output  public/assets/parts-photos/<key>.jpg    (800x800, centre-cropped)
          src/data/imageCredits.json              (shown on /image-credits)

Every photo is CC0, public domain, CC BY or CC BY-SA. The BY licences need
the author, licence and source credited, and the change ("cropped and
resized") noted — /image-credits does that.

    python scripts/process-commons-photos.py
"""
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "scripts" / ".tmp" / "commons"
RESULTS = ROOT / "scripts" / ".tmp" / "commons_results.jsonl"
OUT = ROOT / "public" / "assets" / "parts-photos"
CREDITS = ROOT / "src" / "data" / "imageCredits.json"
SIZE = 800

OUT.mkdir(parents=True, exist_ok=True)
credits = []
for line in RESULTS.read_text(encoding="utf-8").splitlines():
    if not line.strip():
        continue
    r = json.loads(line)
    if r.get("status") != "ok":
        continue
    src = next((p for p in (RAW / f"{r['key']}.jpg", RAW / f"{r['key']}.png") if p.exists()), None)
    if not src:
        print("missing download for", r["key"])
        continue
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    ratio = im.width / im.height
    if 0.6 <= ratio <= 1.7:
        im = ImageOps.fit(im, (SIZE, SIZE), Image.LANCZOS, centering=(0.5, 0.5))
    else:
        # Very wide or tall (a handlebar, a long cable): show it whole on a
        # background matching the photo's own corner colour instead of cropping.
        bg = im.getpixel((2, 2))
        im = ImageOps.pad(im, (SIZE, SIZE), Image.LANCZOS, color=bg)
    im.save(OUT / f"{r['key']}.jpg", quality=84, optimize=True, progressive=True)
    credits.append({
        "key": r["key"],
        "image": f"/assets/parts-photos/{r['key']}.jpg",
        "title": r["title"].replace("File:", ""),
        "page": r["page"],
        "author": r.get("author") or "Unknown",
        "license": r["license"],
        "licenseUrl": r.get("license_url") or "",
    })

credits.sort(key=lambda c: c["key"])
CREDITS.parent.mkdir(parents=True, exist_ok=True)
CREDITS.write_text(json.dumps(credits, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"{len(credits)} photos written to {OUT}")
