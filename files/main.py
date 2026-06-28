main.py - Aplicativo Belinha - Missão Saúde Ilhabela
Jogo interativo em Python com Kivy para ensinar como responder questionários
de satisfação da Santa Casa de Ilhabela
"""

from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen, FadeTransition
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.scrollview import ScrollView
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.image import Image
from kivy.uix.popup import Popup
from kivy.uix.textinput import TextInput
from kivy.uix.spinner import Spinner
from kivy.uix.togglebutton import ToggleButton
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.anchorlayout import AnchorLayout
from kivy.core.window import Window
from kivy.graphics import Color, Rectangle
from kivy.uix.widget import Widget
from kivy.uix.progressbar import ProgressBar
from kivy.uix.relativelayout import RelativeLayout
from kivy.uix.stacklayout import StackLayout
from kivy.uix.slider import Slider
from kivy.uix.checkbox import CheckBox
# from kivy.garden.ratingbar import RatingBar  # Não disponível neste ambiente
import webbrowser
from unidades import UNIDADES
from database import (
    init_db, 
    salvar_avaliacao_recepcao, 
    salvar_avaliacao_medica,
    obter_todas_avaliacoes_recepcao,
    obter_progresso,
    salvar_progresso
)

# Configurar tamanho da janela
Window.size = (400, 800)

# Inicializar banco de dados
init_db()

# URLs dos formulários Google
FORM_URL_RECEPCAO = "https://forms.gle/r48ujrBz3yWX15on8"
FORM_URL_MEDICO = "https://forms.gle/Ee1YnyEdxqv94eve8"

# Cores
CORES = {
    'primary': (46/255, 125/255, 50/255, 1),  # Verde Santa Casa
    'primary_light': (76/255, 175/255, 80/255, 1),  # Verde claro
    'accent': (21/255, 101/255, 192/255, 1),  # Azul
    'accent_light': (66/255, 165/255, 245/255, 1),  # Azul claro
    'background': (241/255, 248/255, 233/255, 1),  # Verde bem claro
    'surface': (1, 1, 1, 1),  # Branco
    'foreground': (27/255, 38/255, 49/255, 1),  # Texto escuro
    'muted': (84/255, 110/255, 122/255, 1),  # Texto secundário
    'border': (200/255, 230/255, 201/255, 1),  # Borda verde
    'success': (46/255, 125/255, 50/255, 1),  # Verde sucesso
    'warning': (245/255, 127/255, 23/255, 1),  # Amarelo alerta
    'whatsapp': (37/255, 211/255, 102/255, 1),  # Verde WhatsApp
}

class WelcomeScreen(Screen):
    """Tela de boas-vindas com apresentação da Belinha"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = 'welcome'
        
        layout = FloatLayout()
        
        # Fundo
        with layout.canvas.before:
            Color(*CORES['background'])
            Rectangle(size=Window.size, pos=layout.pos)
        
        # Logo no topo
        logo = Image(
            source='/home/ubuntu/projects/game-belinha-santa-casa-de-ilhab-e1e3b798/logopng.png',
            size_hint=(None, None),
            size=('120dp', '120dp'),
            pos_hint={'center_x': 0.5, 'top': 0.95}
        )
        layout.add_widget(logo)
        
        # Belinha
        belinha = Image(
            source='/home/ubuntu/projects/game-belinha-santa-casa-de-ilhab-e1e3b798/Belinhasemfundo.png',
            size_hint=(None, None),
            size=('250dp', '250dp'),
            pos_hint={'center_x': 0.5, 'center_y': 0.6}
        )
        layout.add_widget(belinha)
        
        # Título
        titulo = Label(