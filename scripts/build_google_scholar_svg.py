"""Build google-scholar.svg (g+cap) with currentColor for gray icon styling."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "images"
SRC = ROOT / "google-scholar-g-source.png"
OUT = ROOT / "google-scholar.svg"
MASK_PNG = ROOT / "google-scholar-g-mask.png"

img = Image.open(SRC).convert("RGBA")
w, h = img.size
px = img.load()
mask = Image.new("L", (w, h), 0)
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 128:
            continue
        if r > 210 and g > 210 and b > 210:
            mask.putpixel((x, y), 255)

bbox = mask.getbbox()
if bbox:
    mask = mask.crop(bbox)

size = max(mask.size)
canvas = Image.new("L", (size, size), 0)
ox = (size - mask.width) // 2
oy = (size - mask.height) // 2
canvas.paste(mask, (ox, oy))
canvas = canvas.resize((48, 48), Image.Resampling.LANCZOS)
canvas.save(MASK_PNG)

svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="Google Scholar">
  <defs>
    <mask id="gs-mark" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
      <image href="google-scholar-g-mask.png" x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet"/>
    </mask>
  </defs>
  <rect width="24" height="24" fill="currentColor" mask="url(#gs-mark)"/>
</svg>
"""
OUT.write_text(svg, encoding="utf-8")
print("wrote", OUT, MASK_PNG)
