"""
cutouts.py — isolate the subject of each photo-based project cover.

The portfolio's photo covers sit on cluttered backgrounds (a shelf, a
classroom table, a field), so a border flood-fill cannot separate subject
from background. This uses rembg (U^2-Net salient-object segmentation) and
writes RGBA PNGs where the background is fully transparent, which is exactly
what the ASCII renderer's alphaCut expects.

Usage: python tools/cutouts.py [slug ...]
"""
import os
import sys
import io

from rembg import remove, new_session
from PIL import Image

ROOT = os.getcwd()
OUT = os.path.join(ROOT, "tools", "cutouts")

# slug -> source image (only the ones where isolation is wanted)
SOURCES = {
    "robot-hand": "public/assets/projects/robot-hand/finalhand.png",
    "vex": "public/assets/projects/vex/cover.png",
    "mars-rover": "public/assets/projects/rover/cover.png",
    "card-dealer": "public/assets/projects/card-dealer/cover.png",
    "smart-home": "public/assets/projects/smart-home/cover.png",
}

def main():
    want = sys.argv[1:]
    os.makedirs(OUT, exist_ok=True)
    session = new_session("isnet-general-use")

    for slug, rel in SOURCES.items():
        if want and slug not in want:
            continue
        src = os.path.join(ROOT, rel)
        if not os.path.exists(src):
            print(f"{slug}: MISSING {rel}")
            continue

        with open(src, "rb") as f:
            data = f.read()

        out = remove(
            data,
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=250,
            alpha_matting_background_threshold=15,
            alpha_matting_erode_size=8,
        )

        img = Image.open(io.BytesIO(out)).convert("RGBA")
        dest = os.path.join(OUT, f"{slug}.png")
        img.save(dest)

        # report coverage so a failed segmentation is obvious
        alpha = img.getchannel("A")
        px = alpha.histogram()
        opaque = sum(px[128:])
        total = img.width * img.height
        print(f"{slug:16} {img.width}x{img.height}  subject={100*opaque/total:.1f}% of frame")

if __name__ == "__main__":
    main()
