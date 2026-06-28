#!/usr/bin/env python3
"""
Script para montar o vídeo demonstrativo do jogo Belinha
com logomarca oficial da Santa Casa de Ilhabela em todas as telas,
narração em português e legendas.
"""

import os
import subprocess
from PIL import Image, ImageDraw, ImageFont
import textwrap

# ─── Configurações ────────────────────────────────────────────────────────────
FRAMES_DIR  = "/home/ubuntu/belinha_video/frames"
OUTPUT_DIR  = "/home/ubuntu/belinha_video"
LOGO_PATH   = "/home/ubuntu/projects/game-belinha-santa-casa-de-ilhab-e1e3b798/logopng.png"
BELINHA_PATH = "/home/ubuntu/projects/game-belinha-santa-casa-de-ilhab-e1e3b798/Belinhasemfundo.png"
NARRATION   = "/home/ubuntu/belinha_game_python/narration.wav"
VIDEO_OUT   = "/home/ubuntu/belinha_video/belinha_demo.mp4"

# Duração total do áudio: ~184.875 s ≈ 185 s
TOTAL_AUDIO = 184.875

# Cada tela recebe um tempo proporcional ao roteiro (em segundos)
# Cenas: welcome, instrucoes, mapa, caminhos, qrcode, formulario, whatsapp, conclusao, sobre, encerramento
SCREEN_DURATIONS = [
    ("tela_01_welcome.png",     25),   # 0:00 – 0:25
    ("tela_02_instrucoes.png",  30),   # 0:25 – 0:55
    ("tela_03_mapa.png",        30),   # 0:55 – 1:25
    ("tela_04_caminhos.png",    50),   # 1:25 – 2:15
    ("tela_05_qrcode.png",      35),   # 2:15 – 2:50
    ("tela_08_conclusao.png",   30),   # 2:50 – 3:20
    ("tela_09_sobre.png",       30),   # 3:20 – 3:50
    ("tela_10_encerramento.png",10),   # 3:50 – 4:00
]

# Legendas por cena (texto exibido na parte inferior do vídeo)
SUBTITLES = [
    "Tela de Boas-vindas — Missão Saúde Ilhabela",
    "Como funciona a Missão — 4 passos simples",
    "Conheça nossa rede de unidades de saúde",
    "Escolha seu caminho: QR Code, Formulário ou WhatsApp",
    "Caminho do QR Code — Aponte a câmera e responda",
    "Missão Cumprida! Você é Amigo da Saúde de Ilhabela!",
    "Sobre a Santa Casa de Ilhabela — Desde 1943",
    "Baixe o app e participe da Missão Saúde Ilhabela!",
]

# ─── Funções auxiliares ───────────────────────────────────────────────────────

def load_logo(max_width=420, max_height=110):
    """Carrega e redimensiona o logo mantendo proporção."""
    logo = Image.open(LOGO_PATH).convert("RGBA")
    ratio = min(max_width / logo.width, max_height / logo.height)
    new_size = (int(logo.width * ratio), int(logo.height * ratio))
    return logo.resize(new_size, Image.LANCZOS)


def compose_frame(screen_path: str, subtitle: str, frame_idx: int) -> str:
    """
    Compõe um frame final:
    - Tela do app (9:16, 1080×1920)
    - Logo oficial da Santa Casa no topo
    - Faixa de legenda na parte inferior
    """
    TARGET_W, TARGET_H = 1080, 1920

    # Carrega a tela e redimensiona para 1080×1920
    screen = Image.open(screen_path).convert("RGBA")
    screen = screen.resize((TARGET_W, TARGET_H), Image.LANCZOS)

    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (255, 255, 255, 255))
    canvas.paste(screen, (0, 0), screen)

    draw = ImageDraw.Draw(canvas)

    # ── Faixa superior semi-transparente para o logo ──────────────────────────
    overlay = Image.new("RGBA", (TARGET_W, 130), (255, 255, 255, 210))
    canvas.alpha_composite(overlay, (0, 0))

    logo = load_logo(max_width=400, max_height=110)
    logo_x = (TARGET_W - logo.width) // 2
    logo_y = (130 - logo.height) // 2
    canvas.alpha_composite(logo, (logo_x, logo_y))

    # ── Faixa inferior de legenda ─────────────────────────────────────────────
    legend_h = 110
    legend_overlay = Image.new("RGBA", (TARGET_W, legend_h), (27, 94, 32, 220))  # verde escuro
    canvas.alpha_composite(legend_overlay, (0, TARGET_H - legend_h))

    draw2 = ImageDraw.Draw(canvas)

    # Texto da legenda
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
    except Exception:
        font = ImageFont.load_default()

    wrapped = textwrap.fill(subtitle, width=42)
    lines = wrapped.split("\n")
    line_height = 42
    total_text_h = len(lines) * line_height
    text_y = TARGET_H - legend_h + (legend_h - total_text_h) // 2

    for line in lines:
        bbox = draw2.textbbox((0, 0), line, font=font)
        text_w = bbox[2] - bbox[0]
        text_x = (TARGET_W - text_w) // 2
        draw2.text((text_x, text_y), line, font=font, fill=(255, 255, 255, 255))
        text_y += line_height

    # Salva o frame composto
    out_path = os.path.join(OUTPUT_DIR, f"composed_{frame_idx:02d}.png")
    canvas.convert("RGB").save(out_path, "PNG")
    return out_path


def build_video():
    """Monta o vídeo final com FFmpeg."""
    print("=== Compondo frames com logomarca ===")
    composed_frames = []
    for idx, (screen_file, duration) in enumerate(SCREEN_DURATIONS):
        screen_path = os.path.join(FRAMES_DIR, screen_file)
        subtitle = SUBTITLES[idx]
        print(f"  [{idx+1}/{len(SCREEN_DURATIONS)}] {screen_file} ({duration}s)")
        composed = compose_frame(screen_path, subtitle, idx)
        composed_frames.append((composed, duration))

    print("\n=== Gerando clipes individuais ===")
    clip_files = []
    for idx, (frame_path, duration) in enumerate(composed_frames):
        clip_out = os.path.join(OUTPUT_DIR, f"clip_{idx:02d}.mp4")
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", frame_path,
            "-t", str(duration),
            "-vf", "scale=1080:1920,fps=25",
            "-c:v", "libx264",
            "-preset", "fast",
            "-pix_fmt", "yuv420p",
            clip_out
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  ERRO no clipe {idx}: {result.stderr[-300:]}")
        else:
            print(f"  Clipe {idx+1} gerado: {clip_out}")
        clip_files.append(clip_out)

    print("\n=== Concatenando clipes ===")
    concat_list = os.path.join(OUTPUT_DIR, "concat_list.txt")
    with open(concat_list, "w") as f:
        for clip in clip_files:
            f.write(f"file '{clip}'\n")

    silent_video = os.path.join(OUTPUT_DIR, "video_silent.mp4")
    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        silent_video
    ]
    result = subprocess.run(cmd_concat, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ERRO na concatenação: {result.stderr[-500:]}")
        return
    print(f"  Vídeo silencioso: {silent_video}")

    print("\n=== Adicionando narração ===")
    cmd_audio = [
        "ffmpeg", "-y",
        "-i", silent_video,
        "-i", NARRATION,
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        VIDEO_OUT
    ]
    result = subprocess.run(cmd_audio, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ERRO ao adicionar áudio: {result.stderr[-500:]}")
        return
    print(f"\n✅ Vídeo final gerado: {VIDEO_OUT}")

    # Verifica duração final
    probe = subprocess.run(
        ["ffprobe", "-i", VIDEO_OUT, "-show_entries", "format=duration",
         "-v", "quiet", "-of", "csv=p=0"],
        capture_output=True, text=True
    )
    print(f"   Duração: {float(probe.stdout.strip()):.1f}s")


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    build_video()
