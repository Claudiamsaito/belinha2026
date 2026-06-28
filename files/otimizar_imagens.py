#!/usr/bin/env python3
"""
Redimensiona as imagens para resolução adequada ao PDF,
reduzindo o tamanho final do arquivo.
"""
from PIL import Image
import os

FRAMES_DIR   = "/home/ubuntu/belinha_video/frames"
COMPOSED_DIR = "/home/ubuntu/belinha_video"
OPT_DIR      = "/home/ubuntu/belinha_video/otimizadas"

os.makedirs(OPT_DIR, exist_ok=True)
os.makedirs(os.path.join(OPT_DIR, "frames"), exist_ok=True)

MAX_W = 800  # pixels — suficiente para impressão A4 a 150 DPI

def otimizar(src, dst):
    with Image.open(src) as img:
        w, h = img.size
        if w > MAX_W:
            ratio = MAX_W / w
            new_size = (MAX_W, int(h * ratio))
            img = img.resize(new_size, Image.LANCZOS)
        # Converte para RGB se necessário (remove canal alpha para JPEG)
        if img.mode in ("RGBA", "P"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "RGBA":
                bg.paste(img, mask=img.split()[3])
            else:
                bg.paste(img)
            img = bg
        img.save(dst, "JPEG", quality=80, optimize=True)
    orig = os.path.getsize(src) / 1024
    novo = os.path.getsize(dst) / 1024
    print(f"  {os.path.basename(src)}: {orig:.0f} KB → {novo:.0f} KB")

# Otimizar frames
print("Otimizando frames...")
for f in sorted(os.listdir(FRAMES_DIR)):
    if f.endswith(".png"):
        src = os.path.join(FRAMES_DIR, f)
        dst = os.path.join(OPT_DIR, "frames", f.replace(".png", ".jpg"))
        otimizar(src, dst)

# Otimizar compostos
print("Otimizando compostos...")
for f in sorted(os.listdir(COMPOSED_DIR)):
    if f.startswith("composed_") and f.endswith(".png"):
        src = os.path.join(COMPOSED_DIR, f)
        dst = os.path.join(OPT_DIR, f.replace(".png", ".jpg"))
        otimizar(src, dst)

# Otimizar logo e belinha
print("Otimizando logo e belinha...")
logo_src = "/home/ubuntu/projects/game-belinha-santa-casa-de-ilhab-e1e3b798/logopng.png"
belinha_src = "/home/ubuntu/projects/game-belinha-santa-casa-de-ilhab-e1e3b798/Belinhasemfundo.png"
otimizar(logo_src, os.path.join(OPT_DIR, "logopng.jpg"))
otimizar(belinha_src, os.path.join(OPT_DIR, "Belinhasemfundo.jpg"))

print("\n✅ Imagens otimizadas em:", OPT_DIR)
