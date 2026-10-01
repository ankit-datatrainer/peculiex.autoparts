"""
Builds the home-page artwork that replaced the helmet promos:

  public/assets/ai-brakes-wheels.jpg        hero, dark tile   brake disc + tyre
  public/assets/ai-lighting-electricals.jpg hero, amber tile  LED headlight
  public/assets/ai-genuine-parts.jpg        "Genuine spares" banner
                                            tyre + brake disc + chain kit

Composited from the product photos already in public/assets, cut out of their
white studio backgrounds. Hero tiles are 1122x1402 like the others; the banner
is landscape to fill its half of the promo strip.

    python scripts/make-hero-tiles.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ASSETS = Path(__file__).resolve().parent.parent / "public" / "assets"
W, H = 1122, 1402


def cut_all_white(img, lo=228, hi=250):
    """Every near-white pixel becomes transparent (tyre centre, disc holes)."""
    img = img.convert("RGBA")
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            m = min(r, g, b)
            if m >= hi:
                px[x, y] = (r, g, b, 0)
            elif m > lo:
                px[x, y] = (r, g, b, int(a * (hi - m) / (hi - lo)))
    return img


def cut_background(img, thresh=26):
    """Only the white connected to the border goes; white inside the object stays."""
    rgb = img.convert("RGB")
    marker = (255, 0, 255)
    work = rgb.copy()
    w, h = work.size
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if work.getpixel(seed) != marker:
            ImageDraw.floodfill(work, seed, marker, thresh=thresh)
    alpha = Image.new("L", (w, h), 255)
    ap = alpha.load()
    wp = work.load()
    for y in range(h):
        for x in range(w):
            if wp[x, y] == marker:
                ap[x, y] = 0
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out


def crop_to_content(img):
    box = img.getchannel("A").getbbox()
    return img.crop(box) if box else img


def fit(img, max_w, max_h):
    scale = min(max_w / img.width, max_h / img.height)
    return img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)


def gradient(top, bottom, size=(W, H)):
    w, h = size
    bg = Image.new("RGB", (w, h), top)
    d = ImageDraw.Draw(bg)
    for y in range(h):
        t = y / (h - 1)
        d.line([(0, y), (w, y)], fill=tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return bg.convert("RGBA")


def glow(canvas, center, radius, color, alpha):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    d.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.45))
    return Image.alpha_composite(canvas, layer)


def floor_shadow(canvas, box, alpha=110, blur=28):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse(box, fill=(0, 0, 0, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    return Image.alpha_composite(canvas, layer)


def paste(canvas, img, x, y):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    layer.paste(img, (x, y), img)
    return Image.alpha_composite(canvas, layer)


def brakes_and_wheels():
    canvas = gradient((24, 24, 26), (46, 46, 50))
    canvas = glow(canvas, (620, 900), 360, (198, 40, 40), 70)

    tyre = fit(crop_to_content(cut_all_white(Image.open(ASSETS / "michelin-tyre.webp"))), 700, 860)
    disc = fit(crop_to_content(cut_all_white(Image.open(ASSETS / "brake-disc.png"))), 600, 600)

    canvas = floor_shadow(canvas, (170, 1250, 1060, 1340))
    canvas = paste(canvas, tyre, W - tyre.width - 70, 1300 - tyre.height)
    canvas = paste(canvas, disc, 90, 1305 - disc.height)
    return canvas.convert("RGB")


def lighting():
    canvas = gradient((248, 199, 110), (238, 160, 52))
    canvas = glow(canvas, (560, 930), 380, (255, 244, 214), 150)

    lamp = fit(crop_to_content(cut_background(Image.open(ASSETS / "led-headlight.png"))), 860, 820)
    canvas = floor_shadow(canvas, (200, 1255, 940, 1345), alpha=90)
    canvas = paste(canvas, lamp, (W - lamp.width) // 2 + 20, 1300 - lamp.height)
    return canvas.convert("RGB")


def parts_banner():
    # Wide (about 1.7:1) to match the promo box, with the parts kept to the
    # middle so a phone-width crop still shows all three.
    BW, BH = 1300, 760
    canvas = gradient((250, 251, 252), (232, 236, 240), (BW, BH))
    canvas = glow(canvas, (680, 420), 300, (198, 40, 40), 38)

    tyre = fit(crop_to_content(cut_all_white(Image.open(ASSETS / "michelin-tyre.webp"))), 520, 640)
    disc = fit(crop_to_content(cut_all_white(Image.open(ASSETS / "brake-disc.png"))), 440, 440)
    chain = fit(crop_to_content(cut_all_white(Image.open(ASSETS / "chain-kit.jpg"), lo=236, hi=252)), 520, 390)

    canvas = floor_shadow(canvas, (200, 650, 1120, 720), alpha=70, blur=24)
    canvas = paste(canvas, tyre, 1120 - tyre.width, 690 - tyre.height)
    canvas = paste(canvas, disc, 200, 700 - disc.height)
    canvas = paste(canvas, chain, (BW - chain.width) // 2 + 30, 715 - chain.height)
    return canvas.convert("RGB")


if __name__ == "__main__":
    brakes_and_wheels().save(ASSETS / "ai-brakes-wheels.jpg", quality=86, optimize=True, progressive=True)
    lighting().save(ASSETS / "ai-lighting-electricals.jpg", quality=86, optimize=True, progressive=True)
    parts_banner().save(ASSETS / "ai-genuine-parts.jpg", quality=86, optimize=True, progressive=True)
    print("wrote ai-brakes-wheels.jpg, ai-lighting-electricals.jpg and ai-genuine-parts.jpg")
