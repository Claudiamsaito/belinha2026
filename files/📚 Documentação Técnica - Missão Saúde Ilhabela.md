# 📚 Documentação Técnica - Missão Saúde Ilhabela

## 🎯 Visão Geral

**Missão Saúde Ilhabela: O Ciclo da Melhoria com a Belinha** é um aplicativo mobile interativo desenvolvido em **Python com Kivy** que funciona como um guia educacional para ensinar os usuários da Santa Casa de Ilhabela como responder aos questionários de satisfação através de múltiplos canais.

### Características Principais

- ✅ **Interface intuitiva e acolhedora** com a personagem Belinha
- ✅ **Três caminhos de avaliação**: QR Code, Formulário Impresso e WhatsApp
- ✅ **Banco de dados SQLite** nativo para armazenar dados localmente
- ✅ **Compatibilidade multiplataforma**: Desktop, Android e iOS
- ✅ **Design responsivo** adaptado para telas de diferentes tamanhos
- ✅ **Integração com Google Forms** para coleta de dados

---

## 🏗️ Arquitetura do Sistema

### Componentes Principais

```
┌─────────────────────────────────────────────────────┐
│                   BelinhaApp (Kivy)                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │         ScreenManager (WindowManager)         │  │
│  ├──────────────────────────────────────────────┤  │
│  │                                              │  │
│  │  • WelcomeScreen        (Boas-vindas)       │  │
│  │  • InstrucoesScreen     (Como funciona)     │  │
│  │  • MapaScreen           (Unidades)          │  │
│  │  • CaminhosScreen       (Escolha caminho)   │  │
│  │  • QrCodeScreen         (Instruções QR)     │  │
│  │  • FormularioScreen     (Instruções papel)  │  │
│  │  • WhatsappScreen       (Instruções WA)     │  │
│  │  • SobreScreen          (Sobre Santa Casa)  │  │
│  │  • AvaliacaoScreen      (Avaliação)         │  │
│  │  • ConclusaoScreen      (Conclusão)         │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │           Database Layer (SQLite)            │  │
│  ├──────────────────────────────────────────────┤  │
│  │                                              │  │
│  │  • avaliacoes_recepcao                       │  │
│  │  • avaliacoes_medicas                        │  │
│  │  • progresso_usuario                         │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │           Dados Estáticos (unidades.py)      │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Arquivos

```
belinha_game_python/
│
├── main.py                      # Arquivo principal da aplicação
│   ├── Classe BelinhaApp        # App principal (Kivy)
│   ├── Classe WindowManager      # Gerenciador de telas
│   ├── Classes de Telas         # 10 telas diferentes
│   └── Definição de cores       # Paleta de cores
│
├── database.py                  # Gerenciador de banco de dados
│   ├── init_db()                # Inicializa as tabelas
│   ├── salvar_avaliacao_recepcao()
│   ├── salvar_avaliacao_medica()
│   ├── obter_todas_avaliacoes_recepcao()
│   ├── obter_todas_avaliacoes_medicas()
│   ├── obter_media_avaliacoes_unidade()
│   ├── salvar_progresso()
│   └── obter_progresso()
│
├── unidades.py                  # Dados das unidades de saúde
│   └── UNIDADES                 # Lista com 13 unidades
│
├── belinha_game.db              # Banco de dados SQLite (criado automaticamente)
│
├── requirements.txt             # Dependências do projeto
│   ├── kivy==2.2.1
│   └── pillow==10.0.0
│
├── buildozer.spec              # Configuração para compilar Android
│
├── README.md                   # Documentação do projeto
├── GUIA_INSTALACAO.md          # Guia de instalação e uso
└── DOCUMENTACAO_TECNICA.md     # Este arquivo
```

---

## 🎨 Paleta de Cores

| Token | Cor | Uso |
|-------|-----|-----|
| `primary` | `#2E7D32` | Verde Santa Casa - botões principais |
| `primary_light` | `#4CAF50` | Verde claro - destaques |
| `accent` | `#1565C0` | Azul - botões de ação (QR Code) |
| `accent_light` | `#42A5F5` | Azul claro - destaques |
| `background` | `#F1F8E9` | Verde bem claro - fundo |
| `surface` | `#FFFFFF` | Branco - cards e painéis |
| `foreground` | `#1B2631` | Texto principal escuro |
| `muted` | `#546E7A` | Texto secundário |
| `border` | `#C8E6C9` | Borda verde suave |
| `whatsapp` | `#25D366` | Verde WhatsApp |

---

## 📱 Fluxo de Navegação

```
Welcome (Boas-vindas)
    ↓
Instrucoes (Como funciona)
    ↓
Mapa (Conheça nossa rede)
    ↓
Caminhos (Escolha seu caminho)
    ├→ QrCode (Instruções QR Code)
    │   ├→ Abre formulário Google
    │   └→ Conclusao
    │
    ├→ Formulario (Instruções Formulário)
    │   └→ Conclusao
    │
    └→ Whatsapp (Instruções WhatsApp)
        └→ Conclusao

Conclusao (Missão cumprida!)
    └→ Voltar ao Welcome ou Sair

Sobre (Acessível do Welcome)
    └→ Voltar ao Welcome
```

---

## 🗄️ Banco de Dados

### Tabela: `avaliacoes_recepcao`

Armazena avaliações de recepção e infraestrutura (via QR Code).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária |
| `unidade_id` | TEXT | ID da unidade |
| `unidade_nome` | TEXT | Nome da unidade |
| `limpeza` | INTEGER | Nota de 1-5 |
| `recepcao` | INTEGER | Nota de 1-5 |
| `tempo_espera` | INTEGER | Nota de 1-5 |
| `comentarios` | TEXT | Comentários opcionais |
| `nome_usuario` | TEXT | Nome (opcional) |
| `telefone` | TEXT | Telefone (opcional) |
| `data_criacao` | TIMESTAMP | Data/hora da criação |

### Tabela: `avaliacoes_medicas`

Armazena avaliações do atendimento médico (via WhatsApp).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária |
| `unidade_id` | TEXT | ID da unidade |
| `unidade_nome` | TEXT | Nome da unidade |
| `medico_nome` | TEXT | Nome do médico |
| `atencao` | INTEGER | Nota de 1-5 |
| `explicacao` | INTEGER | Nota de 1-5 |
| `horario_cumprido` | INTEGER | Nota de 1-5 |
| `comentarios` | TEXT | Comentários opcionais |
| `nome_usuario` | TEXT | Nome (opcional) |
| `telefone` | TEXT | Telefone (opcional) |
| `data_criacao` | TIMESTAMP | Data/hora da criação |

### Tabela: `progresso_usuario`

Armazena o progresso do usuário no aplicativo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária |
| `tela_atual` | TEXT | Nome da tela atual |
| `caminho_selecionado` | TEXT | QR Code, Formulario ou Whatsapp |
| `unidade_selecionada` | TEXT | ID da unidade |
| `data_atualizacao` | TIMESTAMP | Data/hora da atualização |

---

## 🎮 Classes de Telas

### 1. WelcomeScreen

**Propósito**: Apresentação inicial com a Belinha

**Componentes**:
- Logo da Santa Casa
- Imagem da Belinha
- Título e subtítulo
- Botão "Iniciar Missão"
- Botão "Sobre a Santa Casa"

**Navegação**:
- → InstrucoesScreen
- → SobreScreen

### 2. InstrucoesScreen

**Propósito**: Explicar como funciona o jogo

**Componentes**:
- Barra de progresso (1/6)
- Mensagem da Belinha
- 4 passos do jogo
- Garantias (Anônimo, Rápido, Seguro, Gratuito)
- Botão "Vamos começar"

**Navegação**:
- → MapaScreen

### 3. MapaScreen

**Propósito**: Mostrar todas as unidades de saúde

**Componentes**:
- Barra de progresso (2/6)
- Lista de 13 unidades
- Informações de cada unidade (nome, endereço, bairro)
- Botão "Continuar"

**Dados**: Carregados de `unidades.py`

**Navegação**:
- → CaminhosScreen

### 4. CaminhosScreen

**Propósito**: Permitir escolha do caminho de avaliação

**Componentes**:
- Barra de progresso (3/6)
- 3 cards de caminho (QR Code, Formulário, WhatsApp)
- Resumo dos caminhos
- Botão "Voltar"

**Navegação**:
- → QrCodeScreen
- → FormularioScreen
- → WhatsappScreen
- ← MapaScreen

### 5. QrCodeScreen

**Propósito**: Instruções para usar QR Code

**Componentes**:
- Barra de progresso (4/6)
- Mensagem da Belinha
- 4 passos numerados
- Informações sobre avaliação
- Botão "Responder Agora" (abre Google Forms)

**Ação**: Abre `https://forms.gle/r48ujrBz3yWX15on8`

**Navegação**:
- → ConclusaoScreen

### 6. FormularioScreen

**Propósito**: Instruções para usar formulário impresso

**Componentes**:
- Barra de progresso (4/6)
- Mensagem da Belinha
- 6 passos numerados
- Garantias
- Botão "Formulário Preenchido!"

**Navegação**:
- → ConclusaoScreen
- ← CaminhosScreen

### 7. WhatsappScreen

**Propósito**: Instruções para usar WhatsApp

**Componentes**:
- Barra de progresso (4/6)
- Mensagem da Belinha
- Instruções sobre recebimento de link
- Informações sobre avaliação
- Botão "Entendi!"

**Navegação**:
- → ConclusaoScreen
- ← CaminhosScreen

### 8. SobreScreen

**Propósito**: Informações sobre a Santa Casa

**Componentes**:
- Logo da Santa Casa
- História (desde 1943)
- Missão
- Lista de unidades
- Contato
- Botão "Voltar"

**Navegação**:
- ← WelcomeScreen

### 9. AvaliacaoScreen

**Propósito**: Formulário de avaliação (em desenvolvimento)

**Status**: Placeholder para futuras expansões

### 10. ConclusaoScreen

**Propósito**: Conclusão e agradecimento

**Componentes**:
- Logo da Santa Casa
- Título "Missão Cumprida! 🎉"
- Mensagem de agradecimento
- Selo de "Amigo da Saúde"
- Botão "Voltar ao Início"
- Botão "Sair"

**Navegação**:
- → WelcomeScreen
- Sair do app

---

## 🔌 Integração com Google Forms

O aplicativo integra-se com dois formulários Google:

### Formulário de Recepção (QR Code)
- **URL**: `https://forms.gle/r48ujrBz3yWX15on8`
- **Campos**: Limpeza, Recepção, Tempo de Espera
- **Acesso**: Clicando "Responder Agora" na tela QrCodeScreen

### Formulário Médico (WhatsApp)
- **URL**: `https://forms.gle/Ee1YnyEdxqv94eve8`
- **Campos**: Atenção, Explicação, Cumprimento de Horário
- **Acesso**: Via link enviado por WhatsApp

---

## 🚀 Compilação e Distribuição

### Para Desktop

```bash
# Executar diretamente
python main.py

# Criar executável (Windows)
pip install pyinstaller
pyinstaller --onefile main.py
```

### Para Android

```bash
# Instalar Buildozer
pip install buildozer

# Compilar APK
buildozer android debug

# APK gerado em: bin/missao_saude_ilhabela-1.0-debug.apk
```

### Para iOS

```bash
# Instalar Kivy iOS
pip install kivy-ios

# Compilar
toolchain create Belinha /caminho/para/belinha_game_python
cd Belinha
toolchain build Belinha
```

---

## 🔒 Segurança e Privacidade

### Dados Armazenados Localmente

- Todos os dados são armazenados no banco de dados SQLite local
- Nenhum dado é enviado automaticamente para servidores
- Os dados de avaliação são enviados apenas quando o usuário clica no link do Google Forms

### Conformidade

- ✅ LGPD (Lei Geral de Proteção de Dados)
- ✅ Coleta de dados anônima por padrão
- ✅ Identificação opcional (nome e telefone)

---

## 📊 Estatísticas e Relatórios

### Funções Disponíveis

```python
# Obter todas as avaliações de recepção
avaliacoes = obter_todas_avaliacoes_recepcao()

# Obter todas as avaliações médicas
avaliacoes = obter_todas_avaliacoes_medicas()

# Obter média de avaliações por unidade
media = obter_media_avaliacoes_unidade('ubs_costa_norte')
# Retorna: (media_limpeza, media_recepcao, media_tempo_espera, total_avaliacoes)
```

### Exemplo de Uso

```python
from database import obter_media_avaliacoes_unidade

resultado = obter_media_avaliacoes_unidade('ubs_costa_norte')
if resultado:
    media_limpeza, media_recepcao, media_tempo_espera, total = resultado
    print(f"Média de Limpeza: {media_limpeza:.1f}")
    print(f"Média de Recepção: {media_recepcao:.1f}")
    print(f"Média de Tempo de Espera: {media_tempo_espera:.1f}")
    print(f"Total de Avaliações: {total}")
```

---

## 🛠️ Desenvolvimento e Manutenção

### Adicionar uma Nova Tela

1. Criar uma classe herdando de `Screen`
2. Implementar `__init__` com layout
3. Adicionar métodos de navegação
4. Registrar no `WindowManager.build()`

```python
class NovaScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = 'nova_tela'
        
        layout = FloatLayout()
        # Adicionar widgets...
        self.add_widget(layout)
    
    def ir_para_outra_tela(self, instance):
        self.manager.current = 'outra_tela'
```

### Adicionar um Novo Campo ao Banco de Dados

1. Modificar a função `init_db()` em `database.py`
2. Criar uma função para salvar dados
3. Criar uma função para recuperar dados

```python
def salvar_novo_campo(valor):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('UPDATE tabela SET novo_campo = ? WHERE id = 1', (valor,))
    conn.commit()
    conn.close()
```

---

## 📝 Logs e Debugging

### Ativar Modo Debug

```python
# Em main.py, adicionar no início
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Acessar Logs do Kivy

```bash
# Logs geralmente em:
~/.kivy/logs/kivy_*.txt
```

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Aplicativo não inicia | Verificar se todas as dependências estão instaladas |
| Imagens não aparecem | Verificar caminhos das imagens em `main.py` |
| Banco de dados corrompido | Deletar `belinha_game.db` e reiniciar |
| Erro ao compilar Android | Verificar se Java, Android SDK e NDK estão instalados |

---

## 📞 Suporte

Para dúvidas técnicas ou problemas, entre em contato com:

- **Santa Casa de Ilhabela**
- **Telefone**: (12) 3896-1710
- **Email**: contato@santacasailhabela.org.br

---

## 📄 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|-----------|
| 1.0 | 12/03/2026 | Versão inicial com 10 telas e banco de dados |

---

## 🙏 Créditos

Desenvolvido com ❤️ para a Santa Casa de Ilhabela

**Tecnologias Utilizadas**:
- Python 3.8+
- Kivy 2.2.1
- SQLite3
- Pillow

---

**Última atualização**: 12 de março de 2026
