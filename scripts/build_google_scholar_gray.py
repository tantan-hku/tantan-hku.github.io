"""Build gray Google Scholar icon (g+cap in rounded square) for 18px display."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "images"
SRC = ROOT / "google-scholar-source.png"
OUT = ROOT / "google-scholar-gray.png"
GRAY = (102, 102, 102)  # matches --gray #666

img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 20:
            px[x, y] = (0, 0, 0, 0)
            continue
        # white icon
        if r > 200 and g > 200 and b > 200:
            px[x, y] = (255, 255, 255, a)
            continue
        # blue (or any colored) background -> site gray
        px[x, y] = (*GRAY, 255)

# trim transparent edges if any, then square pad
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

size = max(img.size)
canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
ox = (size - img.width) // 2
oy = (size - img.height) // 2
canvas.paste(img, (ox, oy), img)

# 2x for crisp 18px CSS display
canvas = canvas.resize((36, 36), Image.Resampling.LANCZOS)
canvas.save(OUT, optimize=True)
print("saved", OUT)
