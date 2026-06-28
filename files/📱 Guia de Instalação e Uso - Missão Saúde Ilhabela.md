# 📱 Guia de Instalação e Uso - Missão Saúde Ilhabela

## 🎮 Sobre o Aplicativo

**Missão Saúde Ilhabela: O Ciclo da Melhoria com a Belinha** é um jogo interativo desenvolvido em **Python com Kivy** que ensina os usuários como responder ao questionário de satisfação da Santa Casa de Ilhabela através de três caminhos diferentes:

1. **QR Code** - Apontando a câmera para o código nas paredes ou balcões
2. **Formulário Impresso** - Preenchendo o formulário físico disponível na recepção
3. **WhatsApp** - Respondendo ao link enviado após a consulta médica

---

## 💻 Requisitos de Sistema

### Para Desktop (Windows, macOS, Linux)

- **Python 3.8+** instalado
- **Kivy 2.2.1** ou superior
- **SQLite3** (geralmente já vem instalado)
- Mínimo 200MB de espaço em disco

### Para Android

- **Android 5.0+** (API 21 ou superior)
- Mínimo 100MB de espaço em disco
- Câmera (para usar o QR Code)

### Para iOS

- **iOS 12.0+**
- Mínimo 100MB de espaço em disco
- Câmera (para usar o QR Code)

---

## 🚀 Instalação no Desktop

### 1. Clonar ou Baixar o Projeto

```bash
# Se você tem Git
git clone <url-do-repositorio> belinha_game_python
cd belinha_game_python

# Ou extrair o arquivo ZIP
unzip belinha_game_python.zip
cd belinha_game_python
```

### 2. Criar um Ambiente Virtual (Recomendado)

```bash
# No Windows
python -m venv venv
venv\Scripts\activate

# No macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 4. Executar o Aplicativo

```bash
python main.py
```

A janela do aplicativo deve abrir automaticamente com a tela de boas-vindas.

---

## 📦 Compilar para Android

### Pré-requisitos

- **Java Development Kit (JDK) 11+**
- **Android SDK**
- **Android NDK**
- **Buildozer** (ferramenta de compilação para Kivy)

### Passos

1. **Instalar Buildozer**

```bash
pip install buildozer
```

2. **Compilar o APK**

```bash
cd /caminho/para/belinha_game_python
buildozer android debug
```

3. **Instalar no Dispositivo**

```bash
# Conecte seu dispositivo Android via USB
buildozer android debug deploy run
```

O APK será gerado em `bin/` e instalado automaticamente no seu dispositivo.

---

## 🍎 Compilar para iOS

### Pré-requisitos

- **macOS**
- **Xcode**
- **Kivy**

### Passos

```bash
pip install kivy-ios
toolchain create Belinha /caminho/para/belinha_game_python
cd Belinha
toolchain build Belinha
```

---

## 📂 Estrutura do Projeto

```
belinha_game_python/
├── main.py                    # Arquivo principal da aplicação
├── database.py                # Gerenciador de banco de dados SQLite
├── unidades.py                # Dados das unidades de saúde
├── requirements.txt           # Dependências do projeto
├── buildozer.spec            # Configuração para compilar Android
├── README.md                 # Documentação do projeto
├── GUIA_INSTALACAO.md        # Este arquivo
└── belinha_game.db           # Banco de dados (criado automaticamente)
```

---

## 🎮 Como Usar o Aplicativo

### Tela de Boas-vindas

1. Clique em **"Iniciar Missão"** para começar o jogo
2. Ou clique em **"Sobre a Santa Casa"** para saber mais sobre a instituição

### Tela de Instruções

Aqui você aprenderá como funciona a Missão em 4 passos simples:
1. Conheça a rede de unidades
2. Escolha seu caminho
3. Responda o questionário
4. Ganhe seu Selo de Amigo da Saúde

### Tela do Mapa

Veja todas as unidades de saúde da Santa Casa de Ilhabela:
- **UBS** - Unidades Básicas de Saúde
- **Hospital** - Hospital Municipal
- **Especialidades** - Centros de Especialidades
- **Urgência** - Pronto Socorro e Maternidade

### Tela de Escolha de Caminhos

Escolha como você quer avaliar:

**📱 QR Code**
- Aponte a câmera para o código nas paredes ou balcões
- Toque no link que aparecer
- Responda o questionário online

**📋 Formulário Impresso**
- Pegue o formulário na recepção
- Preencha seus dados
- Deposite na urna

**💬 WhatsApp**
- Receba um link via WhatsApp após sua consulta
- Clique no link
- Avalie o atendimento médico

### Tela de Conclusão

Parabéns! Você recebeu o **Selo de Amigo da Saúde** 🏆

---

## 🗄️ Banco de Dados

O aplicativo usa **SQLite** para armazenar:

### Tabelas

1. **avaliacoes_recepcao** - Avaliações de recepção (QR Code)
   - Limpeza
   - Atendimento da recepção
   - Tempo de espera
   - Comentários (opcional)

2. **avaliacoes_medicas** - Avaliações médicas (WhatsApp)
   - Atenção do médico
   - Explicação
   - Cumprimento de horário
   - Comentários (opcional)

3. **progresso_usuario** - Progresso do usuário
   - Tela atual
   - Caminho selecionado
   - Unidade selecionada

### Acessar o Banco de Dados

```bash
# Abrir o SQLite
sqlite3 belinha_game.db

# Ver tabelas
.tables

# Ver dados
SELECT * FROM avaliacoes_recepcao;
SELECT * FROM avaliacoes_medicas;
```

---

## 🔗 Links Importantes

- **Formulário de Recepção**: https://forms.gle/r48ujrBz3yWX15on8
- **Formulário Médico**: https://forms.gle/Ee1YnyEdxqv94eve8
- **Santa Casa de Ilhabela**: https://www.santacasailhabela.org.br
- **Telefone**: (12) 3896-1710

---

## 🐛 Solução de Problemas

### O aplicativo não inicia

**Solução**: Verifique se todas as dependências estão instaladas:
```bash
pip install -r requirements.txt
```

### Erro "ModuleNotFoundError: No module named 'kivy'"

**Solução**: Instale Kivy:
```bash
pip install kivy
```

### As imagens não aparecem

**Solução**: Verifique se os caminhos das imagens estão corretos em `main.py`. As imagens devem estar no diretório do projeto.

### Erro ao compilar para Android

**Solução**: Verifique se você tem Java, Android SDK e Android NDK instalados corretamente.

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com:

- **Santa Casa de Ilhabela**
- **Telefone**: (12) 3896-1710
- **Email**: contato@santacasailhabela.org.br

---

## 📄 Licença

Este aplicativo é propriedade da Santa Casa de Ilhabela e foi desenvolvido para fins educacionais e de melhoria de serviços.

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ para a comunidade de Ilhabela.

**Belinha agradece sua participação na Missão Saúde Ilhabela!** 🌟
