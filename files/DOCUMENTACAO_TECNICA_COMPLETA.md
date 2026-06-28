# Documentação Técnica Completa — Missão Saúde Ilhabela

**Versão:** 1.0
**Data:** 14 de Março de 2026
**Autor:** Manus AI

---

## 1. Visão Geral do Projeto

O aplicativo **Missão Saúde Ilhabela** é um jogo interativo para celular, desenvolvido em **Python** com o framework **Kivy**, projetado para guiar os usuários da Santa Casa de Ilhabela sobre como fornecer feedback de satisfação. O objetivo é aumentar o engajamento da comunidade e coletar dados valiosos para a melhoria contínua dos serviços de saúde.

A personagem **Belinha**, uma simpática recepcionista virtual, conduz o usuário por uma jornada gamificada, apresentando três caminhos para avaliação: **QR Code**, **Formulário Impresso** e **WhatsApp**.

### 1.1. Tecnologias Utilizadas

| Componente | Tecnologia | Justificativa |
|---|---|---|
| **Linguagem** | Python 3.11 | Linguagem de alto nível, multiplataforma, com vasta biblioteca e fácil manutenção. |
| **Framework Mobile** | Kivy 2.2.1 | Framework open-source em Python para criar aplicativos com interfaces ricas que rodam em Android, iOS, Linux, macOS e Windows. |
| **Banco de Dados** | SQLite 3 | Banco de dados relacional leve, embutido na aplicação, que não requer um servidor separado. Ideal para armazenamento local de dados no celular. |
| **Edição de Vídeo** | FFmpeg | Solução completa e programável para manipulação de vídeo e áudio, usada para criar o vídeo demonstrativo. |
| **Geração de Mídia** | Manus AI | Utilizada para gerar as telas do aplicativo, a narração e a composição do vídeo. |

### 1.2. Estrutura de Arquivos do Projeto

O projeto está organizado na pasta `/home/ubuntu/belinha_game_python/` com a seguinte estrutura:

```
.belinha_game_python/
├── main.py                 # Código principal da aplicação Kivy (1029 linhas)
├── database.py             # Módulo de gerenciamento do banco de dados SQLite (161 linhas)
├── unidades.py             # Dicionário com os dados das 13 unidades de saúde (133 linhas)
├── belinha_game.db         # Arquivo do banco de dados SQLite
├── requirements.txt        # Lista de dependências Python
├── buildozer.spec          # Arquivo de configuração para compilar o app para Android
├── README.md               # Documentação geral do projeto
├── GUIA_INSTALACAO.md      # Guia de instalação e uso
├── DOCUMENTACAO_TECNICA.md # Documentação técnica (versão anterior)
├── narration.wav           # Áudio da narração do vídeo
└── ...
```

---

## 2. Arquitetura da Aplicação

O aplicativo foi construído sobre uma arquitetura baseada em telas (`Screens`) gerenciadas pelo `ScreenManager` do Kivy. Cada tela é uma classe Python que herda de `kivy.uix.screenmanager.Screen` e define sua própria interface e lógica.

### 2.1. Fluxo de Telas

O fluxo de navegação principal segue a ordem abaixo:

1.  **WelcomeScreen**: Tela inicial de boas-vindas.
2.  **InstructionsScreen**: Apresenta os 4 passos da "missão".
3.  **MapScreen**: Mostra a lista de unidades de saúde.
4.  **PathsScreen**: Permite ao usuário escolher um dos três caminhos de avaliação.
5.  **QRCodeScreen** / **FormularioScreen** / **WhatsappScreen**: Telas de instrução para cada caminho.
6.  **AboutScreen**: Informações sobre a Santa Casa.
7.  **EvaluationScreen**: Tela de avaliação (atualmente redireciona para Google Forms).
8.  **ConclusionScreen**: Tela de conclusão com o selo "Amigo da Saúde".

### 2.2. Componentes Principais (`main.py`)

-   **`BelinhaApp(App)`**: Classe principal da aplicação que inicializa o `ScreenManager` e adiciona todas as telas.
-   **`WindowManager(ScreenManager)`**: Gerencia a transição entre as diferentes telas.
-   **Classes de Tela**: `WelcomeScreen`, `InstructionsScreen`, `MapScreen`, etc. Cada uma responsável por construir sua interface e lidar com os eventos de toque.
-   **Paleta de Cores**: Um dicionário `CORES` centraliza a identidade visual do aplicativo, garantindo consistência.

---

## 3. Banco de Dados (SQLite)

O banco de dados, gerenciado pelo módulo `database.py`, é responsável por persistir os dados localmente no dispositivo do usuário.

### 3.1. Esquema do Banco de Dados

O arquivo `belinha_game.db` contém três tabelas principais:

1.  **`avaliacoes_recepcao`**: Armazena as avaliações feitas via QR Code ou formulário impresso.
    -   `id`, `unidade_id`, `unidade_nome`, `limpeza` (INTEGER), `recepcao` (INTEGER), `tempo_espera` (INTEGER), `comentarios`, `data_criacao`.

2.  **`avaliacoes_medicas`**: Armazena as avaliações do atendimento médico, geralmente via WhatsApp.
    -   `id`, `unidade_id`, `unidade_nome`, `medico_nome`, `atencao` (INTEGER), `explicacao` (INTEGER), `horario_cumprido` (INTEGER), `comentarios`, `data_criacao`.

3.  **`progresso_usuario`**: Salva o estado atual do usuário no jogo.
    -   `id`, `tela_atual`, `caminho_selecionado`, `unidade_selecionada`.

### 3.2. Funções do Módulo `database.py`

-   `init_db()`: Cria as tabelas se elas não existirem.
-   `salvar_avaliacao_recepcao(...)`: Insere uma nova avaliação de recepção.
-   `salvar_avaliacao_medica(...)`: Insere uma nova avaliação médica.
-   `obter_todas_avaliacoes_*()`: Retorna todos os registros de uma tabela.
-   `salvar_progresso()` / `obter_progresso()`: Gerenciam o estado da sessão do usuário.

---

## 4. Telas do Aplicativo

Abaixo estão as capturas de tela de todas as 10 telas principais do aplicativo, geradas para o vídeo demonstrativo. Todas incluem a logomarca oficial da Santa Casa de Ilhabela.

| Tela | Descrição |
|---|---|
| ![Tela 1](https://i.imgur.com/example1.png) | **Boas-vindas**: Apresentação da Belinha e início da missão. |
| ![Tela 2](https://i.imgur.com/example2.png) | **Instruções**: Os 4 passos para completar a avaliação. |
| ![Tela 3](https://i.imgur.com/example3.png) | **Mapa**: Lista rolável das 13 unidades de saúde. |
| ![Tela 4](https://i.imgur.com/example4.png) | **Caminhos**: Escolha entre QR Code, Formulário e WhatsApp. |
| ![Tela 5](https://i.imgur.com/example5.png) | **QR Code**: Instruções detalhadas para usar o QR Code. |
| ![Tela 6](https://i.imgur.com/example6.png) | **Formulário**: Instruções para preencher o formulário impresso. |
| ![Tela 7](https://i.imgur.com/example7.png) | **WhatsApp**: Explicação sobre a avaliação via WhatsApp. |
| ![Tela 8](https://i.imgur.com/example8.png) | **Conclusão**: Selo "Amigo da Saúde" e agradecimento. |
| ![Tela 9](https://i.imgur.com/example9.png) | **Sobre**: Informações institucionais da Santa Casa. |
| ![Tela 10](https://i.imgur.com/example10.png)| **Encerramento**: Tela final do vídeo com contatos. |

*Nota: As imagens acima são placeholders. No PDF final, elas serão incorporadas diretamente.*

---

## 5. Vídeo Demonstrativo

Foi produzido um vídeo de demonstração de aproximadamente 3 minutos, em formato MP4 (1080x1920), que percorre o fluxo completo do aplicativo.

-   **Roteiro**: O roteiro completo está em `roteiro_video.md`.
-   **Narração**: O áudio (`narration.wav`) foi gerado com voz feminina em português.
-   **Montagem**: O vídeo foi montado com o script `montar_video.py`, que utiliza **Pillow** para compor as imagens com o logo e legendas, e **FFmpeg** para criar os clipes, concatená-los e adicionar o áudio.

---

## 6. Instalação e Execução

As instruções detalhadas estão no arquivo `GUIA_INSTALACAO.md`. Abaixo, um resumo.

### 6.1. Execução em Desktop (Linux, macOS, Windows)

1.  Clone o repositório.
2.  Instale as dependências: `pip install -r requirements.txt`
3.  Execute o aplicativo: `python main.py`

### 6.2. Compilação para Android

O projeto está configurado para ser compilado para Android usando o **Buildozer**.

1.  Instale o Buildozer: `pip install buildozer`
2.  Inicialize a configuração (já feito): `buildozer init`
3.  Edite o arquivo `buildozer.spec` (já configurado).
4.  Execute a compilação: `buildozer android debug`

O APK gerado estará na pasta `bin/`.

---

## 7. Próximos Passos e Melhorias

-   **Avaliação Nativa**: Implementar a tela de avaliação diretamente no Kivy, em vez de redirecionar para o Google Forms, para uma experiência mais integrada.
-   **Dashboard de Admin**: Criar uma interface web para visualizar as estatísticas das avaliações coletadas no banco de dados.
-   **Internacionalização**: Adicionar suporte para outros idiomas, como inglês e espanhol.
-   **Notificações Push**: Enviar lembretes e novidades para os usuários.
