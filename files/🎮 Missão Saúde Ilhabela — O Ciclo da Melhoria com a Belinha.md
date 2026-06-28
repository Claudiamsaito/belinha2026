# 🎮 Missão Saúde Ilhabela — O Ciclo da Melhoria com a Belinha

Aplicativo mobile em Python com Kivy para ensinar os usuários a responder ao questionário de satisfação da Santa Casa de Ilhabela através de QR Codes, formulários impressos e WhatsApp.

## 📋 Requisitos

- Python 3.8+
- Kivy 2.2.1
- SQLite3 (nativo do Python)

## 🚀 Instalação

### 1. Clonar ou baixar o projeto

```bash
cd /home/ubuntu/belinha_game_python
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Instalar kivy-garden (para widgets adicionais)

```bash
garden install ratingbar
```

## ▶️ Executar o aplicativo

```bash
python main.py
```

## 📁 Estrutura do Projeto

```
belinha_game_python/
├── main.py                 # Arquivo principal da aplicação
├── belinha.kv             # Interface visual em Kivy Language
├── database.py            # Gerenciador de banco de dados SQLite
├── unidades.py            # Dados das unidades de saúde
├── requirements.txt       # Dependências do projeto
└── README.md             # Este arquivo
```

## 🎯 Funcionalidades

### Telas Implementadas

1. **Tela de Boas-vindas** - Apresentação da Belinha e da missão
2. **Tela de Instruções** - Explicação de como funciona o jogo
3. **Tela do Mapa** - Lista de todas as unidades de saúde
4. **Tela de Escolha de Caminhos** - QR Code, Formulário Impresso ou WhatsApp
5. **Tela do QR Code** - Instruções para usar o QR Code
6. **Tela do Formulário** - Instruções para usar o formulário impresso
7. **Tela do WhatsApp** - Instruções para usar o WhatsApp
8. **Tela Sobre** - Informações sobre a Santa Casa de Ilhabela
9. **Tela de Avaliação** - Formulário de avaliação com estrelas
10. **Tela de Conclusão** - Selo de "Amigo da Saúde" e agradecimento

### Banco de Dados

O aplicativo usa **SQLite** para armazenar:

- **Avaliações de Recepção** - Limpeza, recepção e tempo de espera
- **Avaliações Médicas** - Atenção, explicação e cumprimento de horário
- **Progresso do Usuário** - Tela atual e caminho selecionado

## 🎨 Design

- **Cores**: Verde Santa Casa (#2E7D32), Azul (#1565C0), Branco
- **Personagem**: Belinha com uniforme verde claro
- **Tema**: Acolhedor e humanizado

## 📱 Compatibilidade

- Android (via Buildozer)
- iOS (via Kivy)
- Desktop (Windows, macOS, Linux)

## 🔧 Compilar para Android

Para compilar o aplicativo para Android, use **Buildozer**:

```bash
pip install buildozer
buildozer android debug
```

## 📝 Notas

- O banco de dados SQLite é criado automaticamente na primeira execução
- Os dados são armazenados localmente no dispositivo
- As URLs dos formulários Google podem ser atualizadas em `main.py`

## 👥 Autor

Desenvolvido para a Santa Casa de Ilhabela

## 📄 Licença

Propriedade da Santa Casa de Ilhabela
