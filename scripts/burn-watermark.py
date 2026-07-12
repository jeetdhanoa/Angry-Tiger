import sys
from PIL import Image, ImageDraw, ImageFont

REPO = "/Users/jeet/Documents/Angry Tiger/Website"
RED = (201, 14, 14, 255)  # #C90E0E, sRGB brand red
TARGET_WIDTH = 2000
JPEG_QUALITY = 85

FONT_PATH = f"{REPO}/public/fonts/Inter-Variable.ttf"
SYMBOL_PATH = f"{REPO}/public/logos/at-brand-symbol-red.png"


def tracked_text_width(draw, text, font, tracking):
    total = 0.0
    for ch in text:
        total += font.getlength(ch) + tracking
    return total - tracking if text else 0


def draw_tracked_text(draw, xy, text, font, fill, tracking):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += font.getlength(ch) + tracking


def burn(src_path, out_path, caption):
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    if w != TARGET_WIDTH:
        new_h = round(h * TARGET_WIDTH / w)
        img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)
        w, h = img.size

    img = img.convert("RGBA")

    margin = round(w * 0.014)  # ~28px at 2000px wide
    font_size = round(w * 0.0105)  # ~21px at 2000px wide
    tracking = font_size * 0.3  # matches --tracking-wide: 0.3em
    symbol_w = round(w * 0.04)  # ~80px at 2000px wide

    font = ImageFont.truetype(FONT_PATH, font_size)
    try:
        font.set_variation_by_name("SemiBold")
    except Exception:
        pass

    # Symbol, bottom-right, ~88% opacity.
    symbol = Image.open(SYMBOL_PATH).convert("RGBA")
    sym_ratio = symbol.height / symbol.width
    symbol = symbol.resize((symbol_w, round(symbol_w * sym_ratio)), Image.LANCZOS)
    r, g, b, a = symbol.split()
    a = a.point(lambda v: int(v * 0.88))
    symbol.putalpha(a)
    sym_x = w - margin - symbol.width
    sym_y = h - margin - symbol.height
    img.alpha_composite(symbol, (sym_x, sym_y))

    # Caption, bottom-left, vertically centred on the symbol's baseline band.
    draw = ImageDraw.Draw(img)
    caption_upper = caption.upper()
    text_w = tracked_text_width(draw, caption_upper, font, tracking)
    ascent, descent = font.getmetrics()
    text_h = ascent + descent
    text_x = margin
    text_y = h - margin - (symbol.height + text_h) / 2
    draw_tracked_text(draw, (text_x, text_y), caption_upper, font, RED, tracking)

    img = img.convert("RGB")
    img.save(out_path, "JPEG", quality=JPEG_QUALITY)
    print(f"{out_path}: {w}x{h}, margin={margin}, font={font_size}, symbol={symbol_w}")


JOBS = [
    ("Images for Website/IMG_4554.jpg", "public/photos/home-story.jpg", "Production Still 09"),
    ("Images for Website/_MG_9030.jpg", "public/photos/production-01.jpg", "Production Still 27"),
    ("Images for Website/IMG_0006.jpg", "public/photos/production-02.jpg", "Production Still 36"),
    ("Images for Website/IMG_5750.jpg", "public/photos/about-story.jpg", "Production Still 18"),
]

for src, out, caption in JOBS:
    burn(f"{REPO}/{src}", f"{REPO}/{out}", caption)
