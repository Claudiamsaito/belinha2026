# Design: Missão Saúde Ilhabela — O Ciclo da Melhoria com a Belinha

## Conceito Visual

Aplicativo mobile com estética acolhedora e institucional, inspirado no ambiente humanizado das Unidades de Saúde da Santa Casa de Ilhabela. O design remete ao ambiente hospitalar limpo, organizado e sinalizado, com toques de cor vibrante para tornar a experiência lúdica e engajante.

---

## Paleta de Cores

| Token | Cor Light | Descrição |
|-------|-----------|-----------|
| `primary` | `#2E7D32` | Verde Santa Casa — cor principal da Belinha e da instituição |
| `primaryLight` | `#4CAF50` | Verde claro para destaques e botões secundários |
| `accent` | `#1565C0` | Azul para botões de ação (QR Code, links) |
| `accentLight` | `#42A5F5` | Azul claro para destaques |
| `background` | `#F1F8E9` | Verde bem claro — fundo acolhedor |
| `surface` | `#FFFFFF` | Branco para cards e painéis |
| `foreground` | `#1B2631` | Texto principal escuro |
| `muted` | `#546E7A` | Texto secundário |
| `border` | `#C8E6C9` | Borda verde suave |
| `success` | `#2E7D32` | Verde sucesso |
| `warning` | `#F57F17` | Amarelo alerta |
| `whatsapp` | `#25D366` | Verde WhatsApp |

---

## Screen List

### 1. Splash Screen
- Logo da Santa Casa de Ilhabela
- Animação de entrada com a Belinha surgindo

### 2. Tela de Boas-Vindas (Welcome)
- Belinha em destaque com uniforme verde claro
- Texto de apresentação da missão
- Botão "Iniciar Missão"
- Fundo com elementos visuais de Ilhabela

### 3. Tela do Mapa das Unidades (Map Screen)
- Mapa visual/lista interativa das unidades da Santa Casa
- Categorias: UBSs, Especialidades, Urgência, Animal
- Belinha ao lado explicando a abrangência
- Botão "Continuar"

### 4. Tela de Escolha do Caminho (Path Selection)
- Três cards grandes e interativos:
  - QR Code (ícone de câmera/qrcode)
  - Formulário Impresso (ícone de papel/caneta)
  - WhatsApp (ícone do WhatsApp)
- Belinha no topo convidando o usuário a escolher

### 5. Tela do Caminho QR Code
- Animação de celular com moldura de câmera
- Instruções passo a passo numeradas
- Botão "Responder Agora" (link para Google Forms)
- Belinha explicando o processo

### 6. Tela do Caminho Formulário Impresso
- Belinha segurando formulário virtual
- Instruções de preenchimento
- Indicação da urna de coleta
- Campos de avaliação ilustrados (Péssimo → Ótimo)

### 7. Tela do Caminho WhatsApp
- Simulação de balão de conversa WhatsApp
- Celular vibrando com notificação
- Instruções sobre o link pós-consulta
- Link para formulário médico

### 8. Tela de Conclusão / Selo
- Animação de confetes
- Selo "Amigo da Saúde" dourado
- Mensagem final da Belinha
- Política de privacidade
- Botão "Voltar ao Início"

---

## Key User Flows

### Fluxo Principal
```
Splash → Boas-Vindas → Mapa das Unidades → Escolha do Caminho
  ├── QR Code → Instruções QR → [Abre Google Forms]
  ├── Formulário Impresso → Instruções Papel → Conclusão
  └── WhatsApp → Instruções WhatsApp → [Abre link WhatsApp]
```

### Fluxo de Conclusão
```
Qualquer caminho → Tela de Conclusão → Selo de Amigo da Saúde → Início
```

---

## Layout e Componentes

### Componente Belinha
- Posicionada no lado direito ou centro inferior
- Balão de fala com texto das instruções
- Animação de entrada (fade + slide up)
- Expressões: normal, feliz (joinha), explicando

### Cards de Caminho
- Altura: ~160px
- Ícone grande centralizado
- Título em negrito
- Descrição curta
- Cor de fundo diferente por caminho

### Botões de Ação
- Primário: Verde (#2E7D32), texto branco, bordas arredondadas (16px)
- Secundário: Azul (#1565C0), para links externos
- WhatsApp: Verde WhatsApp (#25D366)
- Tamanho mínimo: 56px de altura (acessibilidade)

### Barra de Progresso
- Presente em todas as telas do fluxo
- Indica quantos passos faltam
- Cor: verde primário

---

## Tipografia

- Títulos: Bold, 24-28px
- Subtítulos: SemiBold, 18-20px
- Corpo: Regular, 15-16px, lineHeight 1.5
- Balões da Belinha: Italic ou Regular, 14-15px

---

## Animações

- Entrada de tela: fade + slide up (300ms)
- Botão pulsante: escala 1.0 → 1.05 → 1.0 (loop suave)
- Confetes na conclusão: partículas coloridas caindo
- Celular com câmera: animação de scan (cantos piscando)
- Notificação WhatsApp: vibração + badge pulsante
