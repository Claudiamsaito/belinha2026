#!/usr/bin/env python3
"""
Gera a documentação técnica completa em PDF do app Belinha
com logomarca da Santa Casa em todas as páginas, capturas de tela
e layout profissional.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage,
    Table, TableStyle, HRFlowable, PageBreak, KeepTogether
)
from PIL import Image as PILImage
import os

# ─── Caminhos ─────────────────────────────────────────────────────────────────
LOGO_PATH    = "/home/ubuntu/belinha_video/otimizadas/logopng.jpg"
BELINHA_PATH = "/home/ubuntu/belinha_video/otimizadas/Belinhasemfundo.jpg"
FRAMES_DIR   = "/home/ubuntu/belinha_video/otimizadas/frames"
COMPOSED_DIR = "/home/ubuntu/belinha_video/otimizadas"
OUTPUT_PDF   = "/home/ubuntu/belinha_game_python/Documentacao_Tecnica_Belinha_Final.pdf"

# ─── Cores ────────────────────────────────────────────────────────────────────
VERDE_ESCURO  = colors.HexColor("#1B5E20")
VERDE_MEDIO   = colors.HexColor("#2E7D32")
VERDE_CLARO   = colors.HexColor("#4CAF50")
VERDE_BG      = colors.HexColor("#F1F8E9")
AZUL          = colors.HexColor("#1565C0")
CINZA_ESCURO  = colors.HexColor("#263238")
CINZA_MEDIO   = colors.HexColor("#546E7A")
CINZA_CLARO   = colors.HexColor("#ECEFF1")
BRANCO        = colors.white
DOURADO       = colors.HexColor("#F9A825")

W, H = A4  # 595 x 842 pts

# ─── Estilos ──────────────────────────────────────────────────────────────────
def style(name, **kw):
    return ParagraphStyle(name, **kw)

TITLE_STYLE = style("Title",
    fontName="Helvetica-Bold", fontSize=22,
    textColor=VERDE_ESCURO, alignment=TA_CENTER,
    spaceAfter=6, leading=28)

SUBTITLE_STYLE = style("Subtitle",
    fontName="Helvetica", fontSize=13,
    textColor=CINZA_MEDIO, alignment=TA_CENTER,
    spaceAfter=4)

H1_STYLE = style("H1",
    fontName="Helvetica-Bold", fontSize=16,
    textColor=VERDE_ESCURO, spaceBefore=16,
    spaceAfter=6, leading=20)

H2_STYLE = style("H2",
    fontName="Helvetica-Bold", fontSize=12,
    textColor=VERDE_MEDIO, spaceBefore=10,
    spaceAfter=4, leading=16)

H3_STYLE = style("H3",
    fontName="Helvetica-BoldOblique", fontSize=11,
    textColor=AZUL, spaceBefore=8,
    spaceAfter=3, leading=14)

BODY_STYLE = style("Body",
    fontName="Helvetica", fontSize=10,
    textColor=CINZA_ESCURO, alignment=TA_JUSTIFY,
    spaceAfter=6, leading=15)

CODE_STYLE = style("Code",
    fontName="Courier", fontSize=8.5,
    textColor=CINZA_ESCURO, backColor=CINZA_CLARO,
    spaceBefore=4, spaceAfter=4, leading=13,
    leftIndent=10, rightIndent=10)

CAPTION_STYLE = style("Caption",
    fontName="Helvetica-Oblique", fontSize=8,
    textColor=CINZA_MEDIO, alignment=TA_CENTER,
    spaceAfter=6)

BULLET_STYLE = style("Bullet",
    fontName="Helvetica", fontSize=10,
    textColor=CINZA_ESCURO, leftIndent=18,
    spaceAfter=3, leading=14)

TABLE_HEADER_STYLE = style("TableHeader",
    fontName="Helvetica-Bold", fontSize=9,
    textColor=BRANCO, alignment=TA_LEFT)

TABLE_CELL_STYLE = style("TableCell",
    fontName="Helvetica", fontSize=9,
    textColor=CINZA_ESCURO, alignment=TA_LEFT, leading=13)

# ─── Funções auxiliares ───────────────────────────────────────────────────────

def get_img_dimensions(path, target_width_cm):
    """Retorna width e height em pontos mantendo proporção."""
    try:
        with PILImage.open(path) as img:
            iw, ih = img.size
        target_w = target_width_cm * cm
        target_h = target_w * ih / iw
        return target_w, target_h
    except Exception:
        return target_width_cm * cm, target_width_cm * cm

def safe_image(path, width_cm=5):
    """Cria um RLImage com dimensões calculadas corretamente."""
    if not os.path.exists(path):
        return Paragraph(f"[Imagem não encontrada]", CAPTION_STYLE)
    w, h = get_img_dimensions(path, width_cm)
    return RLImage(path, width=w, height=h)

def logo_img(w_cm=4.5):
    return safe_image(LOGO_PATH, w_cm)

def screen_img(filename, w_cm=6):
    path = os.path.join(FRAMES_DIR, filename.replace('.png', '.jpg'))
    return safe_image(path, w_cm)

def composed_img(filename, w_cm=4):
    path = os.path.join(COMPOSED_DIR, filename.replace('.png', '.jpg'))
    return safe_image(path, w_cm)

def hr(color=VERDE_CLARO, thickness=1):
    return HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=6, spaceBefore=4)

def p(text, st=None):
    return Paragraph(text, st or BODY_STYLE)

def h1(text): return Paragraph(text, H1_STYLE)
def h2(text): return Paragraph(text, H2_STYLE)
def h3(text): return Paragraph(text, H3_STYLE)
def sp(h=0.3): return Spacer(1, h * cm)

def code_block(text):
    escaped = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    escaped = escaped.replace("\n", "<br/>").replace("  ", "&nbsp;&nbsp;")
    return Paragraph(escaped, CODE_STYLE)

def bullet(text):
    return Paragraph(f"• {text}", BULLET_STYLE)

def th(text):
    return Paragraph(f"<b>{text}</b>", TABLE_HEADER_STYLE)

def tc(text):
    return Paragraph(text, TABLE_CELL_STYLE)

def section_header(num, title):
    return KeepTogether([
        sp(0.4),
        Paragraph(f"<b>{num}. {title}</b>", H1_STYLE),
        hr(VERDE_CLARO, 1.5),
    ])

def info_box(text):
    data = [[Paragraph(text, BODY_STYLE)]]
    t = Table(data, colWidths=[W - 3.6 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), VERDE_BG),
        ('BOX', (0, 0), (-1, -1), 1, VERDE_CLARO),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    return t

def make_table(headers, rows, col_widths):
    data = [headers] + rows
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), VERDE_MEDIO),
        ('TEXTCOLOR', (0, 0), (-1, 0), BRANCO),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [BRANCO, VERDE_BG]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#C8E6C9")),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    return t

# ─── Cabeçalho e rodapé de página ─────────────────────────────────────────────

def on_page(canvas, doc):
    canvas.saveState()
    # Logo no cabeçalho
    lw, lh = get_img_dimensions(LOGO_PATH, 3.5)
    canvas.drawImage(LOGO_PATH, 1.5 * cm, H - 1.9 * cm,
                     width=lw, height=lh, preserveAspectRatio=True, mask='auto')
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(CINZA_MEDIO)
    canvas.drawRightString(W - 1.5 * cm, H - 1.2 * cm,
                           "Missão Saúde Ilhabela — Documentação Técnica")
    canvas.setStrokeColor(VERDE_CLARO)
    canvas.setLineWidth(0.5)
    canvas.line(1.5 * cm, H - 2.1 * cm, W - 1.5 * cm, H - 2.1 * cm)
    # Rodapé
    canvas.line(1.5 * cm, 1.5 * cm, W - 1.5 * cm, 1.5 * cm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(CINZA_MEDIO)
    canvas.drawCentredString(W / 2, 1.1 * cm,
                             f"Santa Casa de Ilhabela — Desde 1943  |  Página {doc.page}")
    canvas.restoreState()


def on_first_page(canvas, doc):
    canvas.saveState()
    # Banner verde escuro no topo
    canvas.setFillColor(VERDE_ESCURO)
    canvas.rect(0, H - 5.5 * cm, W, 5.5 * cm, fill=1, stroke=0)
    # Logo centralizado no banner
    lw, lh = get_img_dimensions(LOGO_PATH, 7)
    canvas.drawImage(LOGO_PATH, (W - lw) / 2, H - 5.0 * cm,
                     width=lw, height=lh, preserveAspectRatio=True, mask='auto')
    # Rodapé
    canvas.setStrokeColor(VERDE_CLARO)
    canvas.setLineWidth(0.5)
    canvas.line(1.5 * cm, 1.5 * cm, W - 1.5 * cm, 1.5 * cm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(CINZA_MEDIO)
    canvas.drawCentredString(W / 2, 1.1 * cm,
                             "Santa Casa de Ilhabela — Desde 1943  |  Missão Saúde Ilhabela")
    canvas.restoreState()


# ─── Construção do documento ──────────────────────────────────────────────────

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        leftMargin=1.8 * cm, rightMargin=1.8 * cm,
        topMargin=2.6 * cm, bottomMargin=2.2 * cm,
        title="Documentação Técnica — Missão Saúde Ilhabela",
        author="Santa Casa de Ilhabela",
        subject="App Belinha — Python + SQLite",
    )

    story = []

    # ── CAPA ──────────────────────────────────────────────────────────────────
    story.append(sp(4.5))
    story.append(p("<b>Documentação Técnica Completa</b>", TITLE_STYLE))
    story.append(p("Missão Saúde Ilhabela — O Ciclo da Melhoria com a Belinha", SUBTITLE_STYLE))
    story.append(sp(0.3))
    story.append(hr(DOURADO, 2))
    story.append(sp(0.3))

    capa_data = [
        [tc("<b>Versão:</b>"), tc("1.0")],
        [tc("<b>Data:</b>"), tc("14 de Março de 2026")],
        [tc("<b>Linguagem:</b>"), tc("Python 3.11")],
        [tc("<b>Banco de Dados:</b>"), tc("SQLite 3 (nativo Python — sem instalação extra)")],
        [tc("<b>Framework Mobile:</b>"), tc("Kivy 2.2.1")],
        [tc("<b>Plataformas:</b>"), tc("Android, iOS, Windows, macOS, Linux")],
        [tc("<b>Instituição:</b>"), tc("Santa Casa de Ilhabela")],
        [tc("<b>Contato:</b>"), tc("(12) 3896-1710")],
    ]
    t = Table(capa_data, colWidths=[4.5 * cm, 11 * cm])
    t.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), VERDE_ESCURO),
        ('TEXTCOLOR', (1, 0), (1, -1), CINZA_ESCURO),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LINEBELOW', (0, 0), (-1, -2), 0.3, colors.HexColor("#C8E6C9")),
    ]))
    story.append(t)
    story.append(sp(0.8))

    # Belinha na capa
    if os.path.exists(BELINHA_PATH):
        bw, bh = get_img_dimensions(BELINHA_PATH, 5)
        belinha_img = RLImage(BELINHA_PATH, width=bw, height=bh)
        tb = Table([[belinha_img]], colWidths=[W - 3.6 * cm])
        tb.setStyle(TableStyle([('ALIGN', (0, 0), (-1, -1), 'CENTER')]))
        story.append(tb)

    story.append(PageBreak())

    # ── SUMÁRIO ───────────────────────────────────────────────────────────────
    story.append(h1("Sumário"))
    story.append(hr())
    sumario = [
        ("1", "Visão Geral do Projeto"),
        ("2", "Arquitetura da Aplicação"),
        ("3", "Banco de Dados SQLite"),
        ("4", "Módulo de Unidades de Saúde"),
        ("5", "Telas do Aplicativo"),
        ("6", "Vídeo Demonstrativo"),
        ("7", "Instalação e Execução"),
        ("8", "Compilação para Android"),
        ("9", "Identidade Visual"),
        ("10", "Próximos Passos"),
    ]
    for num, titulo in sumario:
        pontos = "." * max(5, 60 - len(titulo))
        story.append(p(f"<b>{num}.</b>  {titulo}  <font color='#C8E6C9'>{pontos}</font>"))
    story.append(PageBreak())

    # ── SEÇÃO 1: VISÃO GERAL ──────────────────────────────────────────────────
    story.append(section_header("1", "Visão Geral do Projeto"))
    story.append(p(
        "O aplicativo <b>Missão Saúde Ilhabela</b> é um jogo interativo para celular, "
        "desenvolvido em <b>Python</b> com o framework <b>Kivy</b>. Seu propósito é guiar "
        "os pacientes e visitantes da Santa Casa de Ilhabela sobre como fornecer feedback "
        "de satisfação sobre os serviços de saúde recebidos. A personagem <b>Belinha</b>, "
        "uma simpática recepcionista virtual, conduz o usuário por uma jornada gamificada "
        "de forma simples, acolhedora e acessível a qualquer pessoa — inclusive aquelas "
        "com pouca familiaridade com tecnologia."
    ))
    story.append(sp(0.3))
    story.append(info_box(
        "<b>Objetivo principal:</b> Aumentar o engajamento da comunidade na avaliação dos "
        "serviços de saúde, coletando dados para o ciclo de melhoria contínua da Santa Casa de Ilhabela."
    ))
    story.append(sp(0.4))

    story.append(h2("1.1. Tecnologias Utilizadas"))
    story.append(make_table(
        [th("Componente"), th("Tecnologia"), th("Justificativa")],
        [
            [tc("Linguagem"), tc("Python 3.11"),
             tc("Linguagem de alto nível, multiplataforma, fácil de manter e com vasta biblioteca.")],
            [tc("Framework Mobile"), tc("Kivy 2.2.1"),
             tc("Framework open-source para criar apps com interfaces ricas em Python, compatível com Android, iOS e Desktop.")],
            [tc("Banco de Dados"), tc("SQLite 3 (nativo)"),
             tc("Banco de dados relacional embutido no Python. Não requer servidor separado. Ideal para armazenamento local no celular.")],
            [tc("Edição de Vídeo"), tc("FFmpeg + Pillow"),
             tc("Ferramentas programáveis para composição de imagens e montagem do vídeo demonstrativo.")],
        ],
        col_widths=[3.5 * cm, 3.5 * cm, 9 * cm]
    ))
    story.append(sp(0.4))

    story.append(h2("1.2. Estrutura de Arquivos"))
    story.append(p("O projeto está organizado na pasta <b>belinha_game_python/</b> com os seguintes arquivos:"))
    story.append(code_block(
        "belinha_game_python/\n"
        "├── main.py          # Código principal da aplicação Kivy (1.029 linhas)\n"
        "├── database.py      # Módulo de gerenciamento do banco de dados SQLite (161 linhas)\n"
        "├── unidades.py      # Dados das 13 unidades de saúde (133 linhas)\n"
        "├── belinha_game.db  # Arquivo do banco de dados SQLite\n"
        "├── requirements.txt # Lista de dependências Python\n"
        "├── buildozer.spec   # Configuração para compilar o app para Android\n"
        "├── narration.wav    # Áudio da narração do vídeo demonstrativo\n"
        "└── roteiro_video.md # Roteiro completo da narração"
    ))
    story.append(PageBreak())

    # ── SEÇÃO 2: ARQUITETURA ──────────────────────────────────────────────────
    story.append(section_header("2", "Arquitetura da Aplicação"))
    story.append(p(
        "O aplicativo foi construído sobre uma arquitetura baseada em <b>telas (Screens)</b> "
        "gerenciadas pelo <b>ScreenManager</b> do Kivy. Cada tela é uma classe Python que "
        "herda de <b>kivy.uix.screenmanager.Screen</b> e define sua própria interface e lógica "
        "de negócio de forma independente. A transição entre telas usa o efeito <b>FadeTransition</b>, "
        "que proporciona uma experiência visual suave e profissional."
    ))
    story.append(sp(0.3))

    story.append(h2("2.1. Fluxo de Navegação"))
    story.append(make_table(
        [th("Ordem"), th("Tela (Classe Python)"), th("Descrição")],
        [
            [tc("1"), tc("WelcomeScreen"), tc("Tela inicial com a Belinha e o botão 'Iniciar Missão'.")],
            [tc("2"), tc("InstructionsScreen"), tc("Apresenta os 4 passos da missão ao usuário.")],
            [tc("3"), tc("MapScreen"), tc("Lista rolável com as 13 unidades de saúde.")],
            [tc("4"), tc("PathsScreen"), tc("Usuário escolhe: QR Code, Formulário Impresso ou WhatsApp.")],
            [tc("5a"), tc("QRCodeScreen"), tc("Instruções para usar o QR Code nas unidades.")],
            [tc("5b"), tc("FormularioScreen"), tc("Instruções para preencher o formulário impresso.")],
            [tc("5c"), tc("WhatsappScreen"), tc("Instruções para a avaliação médica via WhatsApp.")],
            [tc("6"), tc("AboutScreen"), tc("Informações institucionais sobre a Santa Casa.")],
            [tc("7"), tc("EvaluationScreen"), tc("Redireciona para o Google Forms de avaliação.")],
            [tc("8"), tc("ConclusionScreen"), tc("Tela de conclusão com o Selo 'Amigo da Saúde'.")],
        ],
        col_widths=[1.5 * cm, 5 * cm, 9.5 * cm]
    ))
    story.append(sp(0.4))

    story.append(h2("2.2. Inicialização do Aplicativo"))
    story.append(p(
        "O arquivo <b>main.py</b> é o coração da aplicação. Ele contém todas as classes de tela "
        "e a classe principal <b>BelinhaApp</b>, que inicializa o <b>ScreenManager</b> e "
        "registra todas as telas. A paleta de cores é centralizada no dicionário <b>CORES</b>, "
        "garantindo consistência visual em toda a aplicação."
    ))
    story.append(code_block(
        "# Exemplo de inicialização do app (main.py)\n"
        "class BelinhaApp(App):\n"
        "    def build(self):\n"
        "        sm = ScreenManager(transition=FadeTransition())\n"
        "        sm.add_widget(WelcomeScreen())\n"
        "        sm.add_widget(InstructionsScreen())\n"
        "        sm.add_widget(MapScreen())\n"
        "        sm.add_widget(PathsScreen())\n"
        "        sm.add_widget(QRCodeScreen())\n"
        "        sm.add_widget(FormularioScreen())\n"
        "        sm.add_widget(WhatsappScreen())\n"
        "        sm.add_widget(AboutScreen())\n"
        "        sm.add_widget(ConclusionScreen())\n"
        "        return sm\n\n"
        "if __name__ == '__main__':\n"
        "    BelinhaApp().run()"
    ))
    story.append(PageBreak())

    # ── SEÇÃO 3: BANCO DE DADOS ───────────────────────────────────────────────
    story.append(section_header("3", "Banco de Dados SQLite"))
    story.append(p(
        "O banco de dados é gerenciado pelo módulo <b>database.py</b>, que utiliza a biblioteca "
        "<b>sqlite3</b>, nativa do Python — ou seja, <b>não é necessário instalar nada extra</b>. "
        "O arquivo do banco de dados (<b>belinha_game.db</b>) é criado automaticamente na "
        "primeira execução do aplicativo, na mesma pasta do projeto."
    ))
    story.append(sp(0.3))
    story.append(info_box(
        "<b>Por que SQLite?</b> O SQLite é o banco de dados mais utilizado no mundo. "
        "Ele é leve, não requer um servidor separado, armazena tudo em um único arquivo "
        "e é perfeitamente adequado para aplicativos mobile que precisam salvar dados localmente. "
        "Ele já vem incluído no Python — basta fazer 'import sqlite3'."
    ))
    story.append(sp(0.4))

    story.append(h2("3.1. Tabelas do Banco de Dados"))
    story.append(h3("Tabela 1: avaliacoes_recepcao"))
    story.append(p("Armazena as avaliações feitas via QR Code ou Formulário Impresso."))
    story.append(make_table(
        [th("Campo"), th("Tipo"), th("Descrição")],
        [
            [tc("id"), tc("INTEGER (PK)"), tc("Identificador único, gerado automaticamente.")],
            [tc("unidade_id"), tc("TEXT"), tc("Código da unidade avaliada (ex: 'ubs_pereque').")],
            [tc("unidade_nome"), tc("TEXT"), tc("Nome completo da unidade de saúde.")],
            [tc("limpeza"), tc("INTEGER (1-5)"), tc("Nota para a limpeza da unidade.")],
            [tc("recepcao"), tc("INTEGER (1-5)"), tc("Nota para o atendimento da recepção.")],
            [tc("tempo_espera"), tc("INTEGER (1-5)"), tc("Nota para o tempo de espera.")],
            [tc("comentarios"), tc("TEXT"), tc("Comentários opcionais do usuário.")],
            [tc("data_criacao"), tc("TIMESTAMP"), tc("Data e hora do registro (automático).")],
        ],
        col_widths=[3.5 * cm, 3.5 * cm, 9 * cm]
    ))
    story.append(sp(0.3))

    story.append(h3("Tabela 2: avaliacoes_medicas"))
    story.append(p("Armazena as avaliações do atendimento médico, geralmente via WhatsApp."))
    story.append(make_table(
        [th("Campo"), th("Tipo"), th("Descrição")],
        [
            [tc("id"), tc("INTEGER (PK)"), tc("Identificador único, gerado automaticamente.")],
            [tc("unidade_id"), tc("TEXT"), tc("Código da unidade avaliada.")],
            [tc("medico_nome"), tc("TEXT"), tc("Nome do médico avaliado (opcional).")],
            [tc("atencao"), tc("INTEGER (1-5)"), tc("Nota para a atenção do médico.")],
            [tc("explicacao"), tc("INTEGER (1-5)"), tc("Nota para a clareza das explicações.")],
            [tc("horario_cumprido"), tc("INTEGER (1-5)"), tc("Nota para o cumprimento do horário.")],
            [tc("comentarios"), tc("TEXT"), tc("Comentários opcionais do usuário.")],
            [tc("data_criacao"), tc("TIMESTAMP"), tc("Data e hora do registro (automático).")],
        ],
        col_widths=[3.5 * cm, 3.5 * cm, 9 * cm]
    ))
    story.append(sp(0.3))

    story.append(h3("Tabela 3: progresso_usuario"))
    story.append(p("Salva o estado atual do usuário no jogo para retomada da sessão."))
    story.append(make_table(
        [th("Campo"), th("Tipo"), th("Descrição")],
        [
            [tc("id"), tc("INTEGER (PK)"), tc("Identificador único.")],
            [tc("tela_atual"), tc("TEXT"), tc("Nome da tela em que o usuário está.")],
            [tc("caminho_selecionado"), tc("TEXT"), tc("Caminho escolhido: 'qrcode', 'formulario' ou 'whatsapp'.")],
            [tc("unidade_selecionada"), tc("TEXT"), tc("ID da unidade selecionada pelo usuário.")],
            [tc("data_atualizacao"), tc("TIMESTAMP"), tc("Data e hora da última atualização.")],
        ],
        col_widths=[3.5 * cm, 3.5 * cm, 9 * cm]
    ))
    story.append(sp(0.4))

    story.append(h2("3.2. Funções Disponíveis no database.py"))
    story.append(code_block(
        "import sqlite3\n"
        "from database import (\n"
        "    init_db,                         # Cria as tabelas (executado na inicialização)\n"
        "    salvar_avaliacao_recepcao,        # Salva avaliação de recepção\n"
        "    salvar_avaliacao_medica,          # Salva avaliação médica\n"
        "    obter_todas_avaliacoes_recepcao,  # Retorna todas as avaliações de recepção\n"
        "    obter_todas_avaliacoes_medicas,   # Retorna todas as avaliações médicas\n"
        "    obter_media_avaliacoes_unidade,   # Calcula médias por unidade\n"
        "    salvar_progresso,                 # Salva o estado da sessão\n"
        "    obter_progresso                   # Recupera o estado da sessão\n"
        ")"
    ))
    story.append(PageBreak())

    # ── SEÇÃO 4: UNIDADES ─────────────────────────────────────────────────────
    story.append(section_header("4", "Módulo de Unidades de Saúde"))
    story.append(p(
        "O arquivo <b>unidades.py</b> contém um dicionário Python com os dados completos das "
        "<b>13 unidades de saúde</b> da Santa Casa de Ilhabela. Cada unidade possui: "
        "identificador único, nome, endereço, bairro, telefone, categoria e coordenadas geográficas. "
        "Este módulo é importado pelo <b>main.py</b> para popular a tela do Mapa."
    ))
    story.append(sp(0.3))
    story.append(make_table(
        [th("ID"), th("Nome da Unidade"), th("Categoria"), th("Bairro")],
        [
            [tc("sede"), tc("Santa Casa — Sede / Administração"), tc("Sede"), tc("Centro")],
            [tc("hospital"), tc("Hospital Municipal Gov. Mário Covas"), tc("Hospital"), tc("Barra Velha")],
            [tc("ubs_barra_velha"), tc("UBS Barra Velha"), tc("UBS"), tc("Barra Velha")],
            [tc("ubs_alto_barra"), tc("UBS Alto da Barra"), tc("UBS"), tc("Zabumba")],
            [tc("ubs_agua_branca"), tc("UBS Água Branca"), tc("UBS"), tc("Água Branca")],
            [tc("ubs_itaquanduba"), tc("UBS Itaquanduba"), tc("UBS"), tc("Itaquanduba")],
            [tc("ubs_pereque"), tc("UBS Perequê"), tc("UBS"), tc("Perequê")],
            [tc("ubs_costa_norte"), tc("UBS Costa Norte"), tc("UBS"), tc("Ponta Azeda")],
            [tc("ubs_costa_sul"), tc("UBS Costa Sul"), tc("UBS"), tc("Praia Grande")],
            [tc("centro_saude_iii"), tc("Centro de Saúde III"), tc("Especialidade"), tc("Centro")],
            [tc("centro_especialidades"), tc("Centro de Especialidades"), tc("Especialidade"), tc("Centro")],
            [tc("centro_julia_tenorio"), tc("Centro Especializado Júlia Tenório"), tc("Especialidade"), tc("Centro")],
            [tc("ciama"), tc("CIAMA"), tc("Especialidade"), tc("Perequê")],
        ],
        col_widths=[3.5 * cm, 7 * cm, 3 * cm, 2.5 * cm]
    ))
    story.append(PageBreak())

    # ── SEÇÃO 5: TELAS ────────────────────────────────────────────────────────
    story.append(section_header("5", "Telas do Aplicativo"))
    story.append(p(
        "O aplicativo possui <b>10 telas</b> que guiam o usuário pelo fluxo completo da "
        "missão. Todas as telas exibem a logomarca oficial da Santa Casa de Ilhabela no topo "
        "e seguem a paleta de cores institucional (verde #2E7D32). Abaixo estão as capturas "
        "de tela de cada uma delas, organizadas em pares para facilitar a visualização."
    ))
    story.append(sp(0.4))

    telas = [
        ("tela_01_welcome.png", "1. Boas-vindas\nApresentação da Belinha\ne botão 'Iniciar Missão'."),
        ("tela_02_instrucoes.png", "2. Instruções\nOs 4 passos para\ncompletar a avaliação."),
        ("tela_03_mapa.png", "3. Mapa das Unidades\nLista rolável com as\n13 unidades de saúde."),
        ("tela_04_caminhos.png", "4. Escolha do Caminho\nQR Code, Formulário\nImpresso ou WhatsApp."),
        ("tela_05_qrcode.png", "5. QR Code\nInstruções para usar o\nQR Code nas unidades."),
        ("tela_06_formulario.png", "6. Formulário Impresso\nInstruções para preencher\ne depositar na urna."),
        ("tela_07_whatsapp.png", "7. WhatsApp\nAvaliação médica\napós a consulta."),
        ("tela_08_conclusao.png", "8. Missão Cumprida!\nSelo 'Amigo da Saúde\nde Ilhabela'."),
        ("tela_09_sobre.png", "9. Sobre a Santa Casa\nHistória, missão\ne contatos."),
        ("tela_10_encerramento.png", "10. Encerramento\nTela final do vídeo\ndemonstativo."),
    ]

    for i in range(0, len(telas), 2):
        row = []
        for j in range(2):
            if i + j < len(telas):
                fname, caption = telas[i + j]
                img = screen_img(fname, w_cm=5.5)
                cap = Paragraph(caption.replace("\n", "<br/>"), CAPTION_STYLE)
                cell = Table([[img], [cap]], colWidths=[7.5 * cm])
                cell.setStyle(TableStyle([
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                row.append(cell)
            else:
                row.append(Spacer(1, 1))
        t = Table([row], colWidths=[8 * cm, 8 * cm])
        t.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(t)
        story.append(sp(0.2))

    story.append(PageBreak())

    # ── SEÇÃO 6: VÍDEO ────────────────────────────────────────────────────────
    story.append(section_header("6", "Vídeo Demonstrativo"))
    story.append(p(
        "Foi produzido um vídeo demonstrativo de aproximadamente <b>3 minutos e 5 segundos</b> "
        "em formato <b>MP4 (1080×1920 pixels)</b>, no formato vertical ideal para celular. "
        "O vídeo percorre o fluxo completo do aplicativo com narração em português e legendas "
        "em todas as cenas. A logomarca da Santa Casa aparece em destaque no topo de cada tela."
    ))
    story.append(sp(0.3))
    story.append(make_table(
        [th("Característica"), th("Detalhe")],
        [
            [tc("Arquivo"), tc("belinha_demo.mp4")],
            [tc("Duração"), tc("~185 segundos (3 min 5 seg)")],
            [tc("Resolução"), tc("1080 × 1920 pixels (Full HD vertical)")],
            [tc("Formato de vídeo"), tc("H.264 (libx264)")],
            [tc("Formato de áudio"), tc("AAC 192 kbps")],
            [tc("Narração"), tc("Voz feminina em português brasileiro")],
            [tc("Legendas"), tc("Faixa verde escura na base de cada cena")],
            [tc("Logomarca"), tc("Santa Casa de Ilhabela em destaque no topo de todas as telas")],
            [tc("Taxa de quadros"), tc("25 fps")],
        ],
        col_widths=[5 * cm, 11 * cm]
    ))
    story.append(sp(0.4))

    story.append(h2("6.1. Processo de Produção do Vídeo"))
    story.append(p("O vídeo foi produzido inteiramente com ferramentas Python e open-source:"))
    story.append(bullet("<b>Roteiro:</b> Escrito em português, dividido em 8 cenas, cobrindo todo o fluxo do usuário."))
    story.append(bullet("<b>Narração:</b> Gerada com síntese de voz (TTS) em português, salva em formato WAV."))
    story.append(bullet("<b>Telas:</b> Geradas como imagens PNG de alta resolução (1536×2752 px)."))
    story.append(bullet("<b>Composição:</b> Script Python com Pillow adicionou o logo oficial e as legendas em cada tela."))
    story.append(bullet("<b>Montagem:</b> FFmpeg criou clipes individuais para cada cena e os concatenou."))
    story.append(bullet("<b>Finalização:</b> FFmpeg combinou o vídeo com a narração em áudio."))
    story.append(sp(0.4))

    story.append(h2("6.2. Capturas do Vídeo (com Logomarca e Legendas)"))
    story.append(p("Abaixo estão capturas do vídeo final, mostrando a logomarca e as legendas em destaque:"))
    story.append(sp(0.2))

    composed_files = [
        ("composed_00.png", "Boas-vindas"),
        ("composed_03.png", "Escolha do Caminho"),
        ("composed_05.png", "Missão Cumprida"),
        ("composed_07.png", "Encerramento"),
    ]
    row = []
    for fname, caption in composed_files:
        img = composed_img(fname, w_cm=3.5)
        cap = Paragraph(caption, CAPTION_STYLE)
        cell = Table([[img], [cap]], colWidths=[4 * cm])
        cell.setStyle(TableStyle([('ALIGN', (0, 0), (-1, -1), 'CENTER')]))
        row.append(cell)
    t = Table([row], colWidths=[4 * cm, 4 * cm, 4 * cm, 4 * cm])
    t.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t)
    story.append(PageBreak())

    # ── SEÇÃO 7: INSTALAÇÃO ───────────────────────────────────────────────────
    story.append(section_header("7", "Instalação e Execução"))
    story.append(p(
        "O aplicativo pode ser executado em qualquer computador (Windows, macOS, Linux) "
        "para fins de teste e desenvolvimento. Para distribuição ao público, ele deve ser "
        "compilado para Android usando o Buildozer."
    ))
    story.append(sp(0.3))

    story.append(h2("7.1. Pré-requisitos"))
    story.append(bullet("Python 3.11 ou superior instalado no computador."))
    story.append(bullet("Pip (gerenciador de pacotes Python) — já vem com o Python."))
    story.append(bullet("Conexão com a internet (para instalar as dependências na primeira vez)."))
    story.append(sp(0.3))

    story.append(h2("7.2. Instalação das Dependências"))
    story.append(code_block(
        "# 1. Acesse a pasta do projeto\n"
        "cd belinha_game_python\n\n"
        "# 2. Instale as dependências\n"
        "pip install -r requirements.txt\n\n"
        "# Conteúdo do requirements.txt:\n"
        "kivy==2.2.1\n"
        "kivymd==1.1.1\n"
        "pillow>=9.0.0"
    ))
    story.append(sp(0.3))

    story.append(h2("7.3. Executando o Aplicativo"))
    story.append(code_block(
        "# Execute o aplicativo\n"
        "python main.py\n\n"
        "# Uma janela de 400x800 pixels será aberta,\n"
        "# simulando a tela de um celular."
    ))
    story.append(sp(0.3))

    story.append(h2("7.4. Verificando o Banco de Dados"))
    story.append(code_block(
        "# Verificar as tabelas criadas\n"
        "python3 -c \"\n"
        "import sqlite3\n"
        "conn = sqlite3.connect('belinha_game.db')\n"
        "cursor = conn.cursor()\n"
        "cursor.execute(\\\"SELECT name FROM sqlite_master WHERE type='table'\\\")\n"
        "print('Tabelas:', cursor.fetchall())\n"
        "conn.close()\n"
        "\"\n\n"
        "# Resultado esperado:\n"
        "# Tabelas: [('avaliacoes_recepcao',), ('avaliacoes_medicas',), ('progresso_usuario',)]"
    ))
    story.append(PageBreak())

    # ── SEÇÃO 8: ANDROID ──────────────────────────────────────────────────────
    story.append(section_header("8", "Compilação para Android"))
    story.append(p(
        "O projeto está configurado para ser compilado para Android usando o <b>Buildozer</b>, "
        "uma ferramenta que empacota aplicativos Kivy em arquivos APK prontos para instalação "
        "em celulares Android. O arquivo <b>buildozer.spec</b> já está configurado com todas "
        "as informações necessárias."
    ))
    story.append(sp(0.3))
    story.append(info_box(
        "<b>Atenção:</b> A compilação para Android requer um sistema Linux (Ubuntu recomendado) "
        "com pelo menos 8 GB de RAM e 20 GB de espaço em disco. O processo pode levar de 30 a "
        "60 minutos na primeira vez, pois o Buildozer baixa o Android SDK automaticamente."
    ))
    story.append(sp(0.3))

    story.append(h2("8.1. Passos para Compilar"))
    story.append(code_block(
        "# 1. Instalar o Buildozer\n"
        "pip install buildozer\n\n"
        "# 2. Instalar dependências do sistema (Ubuntu/Debian)\n"
        "sudo apt-get install -y python3-pip build-essential git python3 python3-dev\n\n"
        "# 3. Compilar o APK (modo debug)\n"
        "cd belinha_game_python\n"
        "buildozer android debug\n\n"
        "# 4. O APK será gerado em:\n"
        "# bin/missaosaudeilhabela-1.0-arm64-v8a-debug.apk"
    ))
    story.append(sp(0.3))

    story.append(h2("8.2. Configurações do buildozer.spec"))
    story.append(make_table(
        [th("Configuração"), th("Valor")],
        [
            [tc("title"), tc("Missão Saúde Ilhabela")],
            [tc("package.name"), tc("missaosaudeilhabela")],
            [tc("package.domain"), tc("org.santacasailhabela")],
            [tc("version"), tc("1.0")],
            [tc("requirements"), tc("python3, kivy, kivymd, pillow, sqlite3")],
            [tc("android.minapi"), tc("21 (Android 5.0+)")],
            [tc("android.arch"), tc("arm64-v8a")],
            [tc("orientation"), tc("portrait")],
        ],
        col_widths=[5 * cm, 11 * cm]
    ))
    story.append(PageBreak())

    # ── SEÇÃO 9: IDENTIDADE VISUAL ────────────────────────────────────────────
    story.append(section_header("9", "Identidade Visual"))
    story.append(p(
        "A identidade visual do aplicativo foi desenvolvida para refletir os valores da "
        "Santa Casa de Ilhabela: <b>saúde, confiança e acolhimento</b>. A logomarca oficial "
        "da instituição aparece em <b>todas as telas</b> do aplicativo e em todo o material "
        "produzido, incluindo o vídeo demonstrativo e esta documentação."
    ))
    story.append(sp(0.3))

    story.append(h2("9.1. Paleta de Cores"))
    story.append(make_table(
        [th("Nome"), th("Código Hex"), th("Uso no Aplicativo")],
        [
            [tc("Verde Escuro (Primary)"), tc("#2E7D32"), tc("Botões principais, títulos, destaques.")],
            [tc("Verde Médio"), tc("#4CAF50"), tc("Ícones, bordas, elementos secundários.")],
            [tc("Verde Claro (Background)"), tc("#F1F8E9"), tc("Fundo de todas as telas.")],
            [tc("Azul (Accent)"), tc("#1565C0"), tc("Tela do QR Code, links, informações.")],
            [tc("Verde WhatsApp"), tc("#25D366"), tc("Tela e botões do WhatsApp.")],
            [tc("Laranja"), tc("#F57F17"), tc("Tela do Formulário Impresso.")],
            [tc("Cinza Escuro"), tc("#263238"), tc("Texto principal.")],
            [tc("Cinza Médio"), tc("#546E7A"), tc("Texto secundário, subtítulos.")],
        ],
        col_widths=[4.5 * cm, 3 * cm, 8.5 * cm]
    ))
    story.append(sp(0.4))

    story.append(h2("9.2. Personagem Belinha"))
    story.append(p(
        "A <b>Belinha</b> é a mascote e guia do aplicativo. Ela é representada como uma "
        "recepcionista simpática com uniforme azul e crachá com seu nome. A personagem "
        "aparece na tela de boas-vindas e serve como ponto de identificação emocional "
        "com os usuários, tornando a experiência mais humana e acolhedora. O arquivo da "
        "personagem (<b>Belinhasemfundo.png</b>) possui fundo transparente para se adaptar "
        "a qualquer cor de fundo."
    ))
    story.append(PageBreak())

    # ── SEÇÃO 10: PRÓXIMOS PASSOS ─────────────────────────────────────────────
    story.append(section_header("10", "Próximos Passos e Melhorias"))
    story.append(p(
        "O aplicativo está funcional e pronto para uso. As melhorias abaixo são sugeridas "
        "para versões futuras, visando ampliar a funcionalidade e o alcance do projeto."
    ))
    story.append(sp(0.3))
    story.append(make_table(
        [th("Melhoria"), th("Descrição"), th("Prioridade")],
        [
            [tc("Avaliação Nativa"),
             tc("Implementar o formulário de avaliação diretamente no Kivy, sem redirecionar para o Google Forms."),
             tc("Alta")],
            [tc("Dashboard Admin"),
             tc("Criar uma interface web para visualizar estatísticas das avaliações coletadas no banco de dados."),
             tc("Alta")],
            [tc("Publicação na Play Store"),
             tc("Publicar o APK na Google Play Store para facilitar o download pelos usuários."),
             tc("Média")],
            [tc("Notificações Push"),
             tc("Enviar lembretes e novidades para os usuários após o atendimento."),
             tc("Média")],
            [tc("Modo Offline"),
             tc("Garantir que o app funcione completamente sem conexão com a internet."),
             tc("Baixa")],
            [tc("Internacionalização"),
             tc("Adicionar suporte para inglês e espanhol para atender turistas."),
             tc("Baixa")],
        ],
        col_widths=[4 * cm, 10 * cm, 2 * cm]
    ))
    story.append(sp(0.8))

    story.append(hr(DOURADO, 2))
    story.append(sp(0.3))
    story.append(p(
        "<i>Documentação gerada para a Santa Casa de Ilhabela. "
        "Para dúvidas ou suporte técnico, entre em contato pelo telefone (12) 3896-1710.</i>",
        CAPTION_STYLE
    ))

    # ── GERAR PDF ─────────────────────────────────────────────────────────────
    print("Gerando PDF...")
    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_page)
    size = os.path.getsize(OUTPUT_PDF) / (1024 * 1024)
    print(f"✅ PDF gerado: {OUTPUT_PDF}")
    print(f"   Tamanho: {size:.1f} MB")


if __name__ == "__main__":
    build_pdf()
