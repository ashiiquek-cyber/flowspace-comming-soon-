"""Builds responsive WebP variants of the photographs in assets-src/ into public/assets/.

For each source <name>.png it writes:
  <name>-640.webp, <name>-1024.webp, <name>-1600.webp  (widths capped at the source width)

Run with: python3 scripts/optimize-images.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'assets-src', ROOT / 'public' / 'assets'
WIDTHS = (640, 1024, 1600)

for src in sorted(SRC.glob('*.png')):
    im = Image.open(src).convert('RGB')
    for w in WIDTHS:
        w2 = min(w, im.width)
        h2 = round(im.height * w2 / im.width)
        im.resize((w2, h2), Image.LANCZOS).save(OUT / f'{src.stem}-{w}.webp', 'WEBP', quality=72, method=6)
    print(src.name)
