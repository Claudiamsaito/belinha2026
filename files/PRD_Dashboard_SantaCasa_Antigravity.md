# PRD — Dashboard de Satisfação em Saúde
### Santa Casa de Ilhabela × Antigravity
**Versão:** 1.0  
**Data:** Abril 2026  
**Status:** Em revisão  

---

## 1. Visão Geral do Produto

### 1.1 Problema a Resolver

A Secretaria Municipal de Saúde de Ilhabela coleta dados de satisfação de pacientes por três canais distintos — QR Code nas UBS (Recepção), QR Code no Laboratório e pesquisa via WhatsApp pós-consulta — mas esses dados vivem em planilhas isoladas, sem consolidação, sem histórico visual e sem mecanismo de alerta para gestores.

O resultado é que decisões de melhoria são tomadas com atraso ou sem evidência, e os gestores municipais não conseguem comparar o desempenho entre as unidades de forma ágil e confiável.

### 1.2 Solução

Um **dashboard web intermediário** desenvolvido pela Antigravity que consolida todas as fontes de dados de satisfação, calcula NPS adaptado à escala local, aplica análise de sentimento nos comentários abertos e gera comparativos entre as unidades de saúde — tudo acessível em tempo quase-real para os gestores municipais.

### 1.3 Objetivo do Produto (OKR da v1)

| Objetivo | Key Result |
|---|---|
| Dar visibilidade ágil da satisfação municipal | Gestor visualiza NPS consolidado em < 5 segundos após login |
| Identificar unidades críticas proativamente | Dashboard destaca automaticamente unidades abaixo do limiar de alerta |
| Substituir planilhas manuais | 100% das fontes de dados conectadas e atualizadas automaticamente |

---

## 2. Contexto e Fontes de Dados

### 2.1 Fontes Mapeadas

A partir da análise dos arquivos fornecidos, o dashboard v1 deve integrar **três fontes de dados**:

#### Fonte 1 — QR Code Recepção das UBS
- **Canal:** Formulário Google via QR Code físico nas unidades
- **Arquivo de referência:** `QRCODE-Recepção_respostas.csv`
- **Frequência:** Contínua (respostas ao longo do dia)
- **Perguntas (5 dimensões):**
  1. Avaliação do atendimento da recepcionista
  2. Tempo de espera na recepção
  3. Tempo entre agendamento e consulta
  4. Infraestrutura e conservação da unidade
  5. Já fez elogio/sugestão anteriormente? Teve retorno?
- **Campo livre:** Comentário aberto do paciente
- **Escala:** Ótimo / Bom / Regular / Ruim / Péssimo / Não sabe

#### Fonte 2 — QR Code Laboratório (Exame Laboratorial)
- **Canal:** Formulário Google via QR Code no Laboratório
- **Arquivo de referência:** `QRCODE_-_Exame_Laboratorial_respostas.csv`
- **Frequência:** Contínua
- **Perguntas (5 dimensões):**
  1. Atendimento da recepcionista
  2. Tempo de espera na recepção
  3. Técnica, rapidez e segurança na coleta
  4. Tempo entre agendamento e coleta do exame
  5. Infraestrutura e conservação do laboratório
- **Campo livre:** Comentário aberto
- **Escala:** Ótimo / Bom / Regular / Ruim / Péssimo / Não sabe

#### Fonte 3 — WhatsApp Pós-Consulta
- **Canal:** Mensagem automatizada via WhatsApp após consulta realizada
- **Arquivo de referência:** `data-177XXXXXXX.csv`
- **Frequência:** Automática (disparada após registro de consulta no sistema)
- **Campos relevantes:** unidade, profissional, especialidade, procedimento, data/hora, status de entrega da mensagem, respostas (pergunta1–5), análise de sentimentos
- **Observação:** Contém status de entrega (sent, delivered, read, failed) — dados valiosos para taxa de resposta

#### Fonte 4 — Hospital (futura integração)
- **Canal:** QR Code / Formulário hospitalar
- **Arquivo de referência:** `QRCODE-Hospital_respostas.xlsx`
- **Status para v1:** Leitura e exibição básica dos dados; integração completa na v2

### 2.2 Unidades de Saúde Identificadas

| Sigla/Nome | Tipo |
|---|---|
| UBS Água Branca | Unidade Básica de Saúde |
| UBS Perequê | Unidade Básica de Saúde |
| UBS Costa Sul | Unidade Básica de Saúde |
| UBS Barra Velha | Unidade Básica de Saúde |
| UBS Alto da Barra | Unidade Básica de Saúde |
| UBS Costa Norte | Unidade Básica de Saúde |
| UBS Itaquanduba | Unidade Básica de Saúde |
| UBS Vila / Centro de Saúde III | Unidade Básica de Saúde |
| CEV — Centro de Especialidade Vila (Santa Casa) | Especialidade |
| CERTEA — Centro Especializado em Reabilitação e TEA | Especialidade |
| CIAMA — Centro de Incentivo ao Aleitamento Materno | Especialidade |
| Academia da Saúde | Promoção à Saúde |
| Centro de Especialidade de Ilhabela | Especialidade |
| Laboratório Municipal | Diagnóstico |

### 2.3 Escala de Avaliação e Mapeamento NPS

A escala local (Ótimo → Péssimo) não é uma escala NPS nativa de 0–10, mas será convertida para o cálculo de um **NPS adaptado**:

| Resposta | Classificação NPS | Peso |
|---|---|---|
| Ótimo | Promotor | +1 |
| Bom | Neutro | 0 |
| Regular | Neutro | 0 |
| Ruim | Detrator | -1 |
| Péssimo | Detrator | -1 |
| Não sabe / Não opinou | Excluído do cálculo | — |

**Fórmula:** `NPS = (% Promotores - % Detratores) × 100`

---

## 3. Público-Alvo e Perfil de Usuário

### 3.1 Usuário Principal

**Gestor Municipal de Saúde de Ilhabela**

- **Cargo:** Secretário Municipal de Saúde, Coordenadores de Atenção Básica, Diretores de Unidade
- **Perfil técnico:** Baixo a médio — não são analistas de dados, precisam de leituras visuais imediatas
- **Frequência de uso esperada:** Diária (acompanhamento) e mensal (relatórios)
- **Necessidade principal:** Saber rapidamente "onde está pior" e "o que os pacientes estão dizendo"
- **Dispositivo:** Principalmente desktop; mobile como consulta rápida

### 3.2 Usuários Secundários (v2)

- Diretores de unidades individuais (visão restrita à sua unidade)
- Equipe técnica da Antigravity (manutenção e suporte)

---

## 4. Funcionalidades — v1

### 4.1 Módulo 1 — Visão Geral Municipal (Home)

**Descrição:** Tela inicial com panorama consolidado de todas as unidades e fontes.

**Elementos visuais obrigatórios:**

- **Cartão NPS Global** — Score único consolidado de todas as unidades e fontes, com gauge/velocímetro colorido (vermelho < 0, amarelo 0–50, verde > 50), igual ao modelo de referência InstitutoPHD
- **Total de Respondentes** — Contador de respostas no período selecionado
- **Distribuição da Escala** — Barra horizontal segmentada mostrando % de Ótimo / Bom / Regular / Ruim / Péssimo
- **Mapa de Calor por Unidade** — Ranking visual das unidades, da melhor para a pior NPS, com sinalização de cor (verde/amarelo/vermelho)
- **Tendência Temporal** — Gráfico de linha do NPS ao longo do tempo (semana/mês/trimestre)
- **Alertas de Atenção** — Badges destacando unidades com NPS abaixo de limiar configurável (ex.: < 30)

**Filtros globais (afetam todo o dashboard):**
- Período (últimos 7 dias / 30 dias / 3 meses / período customizado)
- Módulo/Fonte (Recepção UBS / Laboratório / Hospital / WhatsApp / Todos)
- Unidade de Saúde (multi-seleção)

---

### 4.2 Módulo 2 — Comparativo por Unidade

**Descrição:** Visão lado a lado do desempenho das unidades para identificar melhores e piores práticas.

**Elementos visuais obrigatórios:**

- **Gráfico de Barras Horizontais** — Todas as unidades ordenadas por NPS, com valores absolutos exibidos
- **Tabela Comparativa de Dimensões** — Grade com unidades nas linhas e as 5 dimensões avaliadas nas colunas, mostrando nota média por dimensão (ex.: "Tempo de espera na UBS Itaquanduba: 2.1 / 5")
- **Card de Destaque:** "Melhor unidade do período" e "Unidade que mais melhorou"
- **Drill-down:** Ao clicar em uma unidade, abre o painel detalhado daquela unidade

---

### 4.3 Módulo 3 — Análise por Unidade (Drill-down)

**Descrição:** Painel individual de cada unidade com histórico e diagnóstico.

**Elementos visuais obrigatórios:**

- **NPS da Unidade** — Score atual com variação vs. período anterior (ex.: ▲ +8 pts vs. mês passado)
- **Total de Respondentes da Unidade**
- **Distribuição das 5 Dimensões** — Gráfico radar ou barras por dimensão avaliada
- **Evolução Temporal da Unidade** — Linha do NPS ao longo do tempo
- **Nuvem de Palavras** — Gerada a partir dos comentários abertos dos pacientes
- **Feed de Comentários** — Lista paginada dos comentários abertos com: data, rating geral, texto, badge de sentimento (positivo / neutro / negativo)
- **Taxa de Resposta WhatsApp** (quando disponível) — % de mensagens enviadas que foram respondidas

---

### 4.4 Módulo 4 — Análise de Sentimento e Comentários

**Descrição:** Painel centralizado para leitura qualitativa das falas dos pacientes.

**Elementos visuais obrigatórios:**

- **Distribuição de Sentimentos** — Pizza ou barras: % Positivo / Neutro / Negativo (baseado no campo `analisedesentimentos` já presente nos dados)
- **Temas Mais Citados** — Tag cloud ou lista de assuntos recorrentes (ex.: "tempo de espera", "atendimento", "infraestrutura")
- **Filtro por Sentimento** — Ver apenas comentários negativos para ação imediata
- **Filtro por Unidade**
- **Busca Textual** — Pesquisar palavra-chave nos comentários (ex.: buscar "estacionamento")
- **Tabela de Comentários** — Com colunas: Data | Unidade | Dimensão | Nota | Comentário | Sentimento | Respondente (mascarado por LGPD)

---

### 4.5 Módulo 5 — Laboratório (Exame Laboratorial)

**Descrição:** Painel específico do Laboratório Municipal com suas dimensões próprias.

**Elementos visuais:**

- NPS do Laboratório
- Distribuição por dimensão específica: Técnica de Coleta, Agendamento, Infraestrutura, Atendimento na Recepção
- Comentários dos pacientes do laboratório
- Comparativo: Laboratório vs. média das UBS

---

### 4.6 Funcionalidade Transversal — Exportação de Relatório

**Descrição:** Geração de relatório em PDF/Excel para uso em reuniões gerenciais.

**Especificações:**

- Relatório mensal automático com NPS consolidado, ranking de unidades e comentários em destaque
- Exportação manual sob demanda com filtros aplicados
- Logotipo da Santa Casa no cabeçalho
- Formato: PDF e/ou Excel

---

## 5. Requisitos Não-Funcionais

| Categoria | Requisito |
|---|---|
| **Performance** | Dashboard deve carregar em < 3 segundos para 90% das consultas |
| **Responsividade** | Layout adaptado para desktop (prioritário) e tablet |
| **Autenticação** | Login com controle de acesso (gestor municipal vs. diretor de unidade) |
| **LGPD** | Dados de CPF e telefone nunca exibidos na tela; nome exibido apenas em contextos autorizados |
| **Atualização de dados** | Sincronização automática com Google Sheets/Forms a cada 1 hora (v1); tempo real via webhook (v2) |
| **Disponibilidade** | SLA de 99% em horário comercial (07h–20h) |
| **Acessibilidade** | Contraste mínimo WCAG AA; textos legíveis sem depender apenas de cor |

---

## 6. Design e Identidade Visual

### 6.1 Referência Visual

O layout de referência é o dashboard do **InstitutoPHD** (imagem fornecida), com:
- Fundo escuro (dark mode) com cartões em cinza escuro
- Gauge/velocímetro para NPS global em destaque
- Escala de notas exibida como barra horizontal colorida
- Gráficos de barras para comparativo regional/por unidade
- Paleta: verde (#2E7D32 ou similar) como cor primária — alinhado ao logo da Santa Casa

### 6.2 Identidade Santa Casa de Ilhabela

- Logo fornecido: Santa Casa (verde + cruz + azul), "Desde 1943"
- Cores primárias: Verde escuro `#1B5E3B`, Verde claro `#4CAF50`, Azul `#1565C0`
- Tipografia: Sans-serif limpa (Inter ou equivalente)
- Tom: Institucional, confiável, acessível para não-técnicos

---

## 7. Arquitetura de Dados (Proposta para Antigravity)

```
[Fontes de Dados]
  ├── Google Sheets (QR Code Recepção)     ──┐
  ├── Google Sheets (QR Code Laboratório)  ──┤
  ├── Google Sheets (QR Code Hospital)     ──┤──> [ETL / Conector]
  └── Banco de dados WhatsApp (CSV/API)    ──┘         │
                                                        ▼
                                              [Camada de Transformação]
                                              • Normalização de escalas
                                              • Cálculo de NPS
                                              • Limpeza de dados pessoais
                                              • Análise de sentimento
                                                        │
                                                        ▼
                                              [Backend / API]
                                              • Endpoints por módulo
                                              • Filtros e agregações
                                                        │
                                                        ▼
                                              [Frontend — Dashboard Web]
                                              • React / Next.js (sugestão)
                                              • Biblioteca de gráficos: Recharts / ApexCharts
```

---

## 8. Regras de Negócio

- **NPS Mínimo para Alerta:** Unidades com NPS < 30 devem ser marcadas com badge de atenção em vermelho
- **Volume Mínimo:** Unidades com menos de 5 respostas no período não têm NPS calculado — exibir "Dados insuficientes"
- **Tratamento de "Não sabe/Não opinou":** Excluir do cálculo do NPS mas contabilizar no total de respondentes
- **Sentimento:** Usar o campo `analisedesentimentos` já presente nos dados do WhatsApp e Recepção; para fontes sem esse campo, aplicar análise via NLP simples baseado em palavras-chave em português
- **LGPD:** CPF armazenado em hash; telefone não exibido; nome exibido somente em tela de administração com log de acesso

---

## 9. Escopo — O que NÃO está no v1

- Sistema de tickets ou workflow de tratamento de reclamações
- Notificações push ou e-mail automáticos de alerta
- App mobile nativo
- Integração com prontuário eletrônico ou sistemas de agendamento
- Módulo de gestão de profissionais (avaliação individual de médicos/técnicos)
- Painel para o paciente acompanhar sua própria avaliação

---

## 10. Roadmap

| Fase | Entregável | Prazo Estimado |
|---|---|---|
| **v0 — Discovery** | Definição de arquitetura, acesso às fontes de dados, wireframes | Semana 1–2 |
| **v1 — MVP** | Home + Comparativo por Unidade + Análise de Sentimento + Laboratório | Semana 3–6 |
| **v1.1 — Ajustes** | Refinamentos UX, exportação de relatório PDF, performance | Semana 7–8 |
| **v2 — Expansão** | Hospital completo, alertas automáticos, controle de acesso por unidade, atualização em tempo real | TBD |

---

## 11. Critérios de Aceite da v1

O dashboard v1 será considerado concluído quando:

1. Gestor consegue visualizar NPS global consolidado com filtro de período
2. Comparativo entre todas as unidades está disponível e ordenável
3. Comentários abertos dos pacientes são exibidos com badge de sentimento
4. Dados do Laboratório têm painel próprio com suas 5 dimensões
5. Dados pessoais (CPF, telefone) não aparecem em nenhuma tela do dashboard
6. Relatório básico pode ser exportado em PDF
7. Dashboard carrega em menos de 3 segundos em conexão padrão

---

## 12. Glossário

| Termo | Definição |
|---|---|
| **NPS** | Net Promoter Score — métrica de lealdade adaptada para a escala Ótimo/Péssimo |
| **UBS** | Unidade Básica de Saúde |
| **CERTEA** | Centro Especializado em Reabilitação e Transtorno do Espectro Autista |
| **CIAMA** | Centro de Incentivo ao Aleitamento Materno |
| **CEV** | Centro de Especialidade Vila (Santa Casa) |
| **QR Code** | Código bidimensional usado para direcionar pacientes ao formulário de pesquisa |
| **Promotor** | Paciente que avaliou como "Ótimo" |
| **Detrator** | Paciente que avaliou como "Ruim" ou "Péssimo" |
| **Análise de Sentimento** | Classificação automática de comentários em Positivo / Neutro / Negativo |
| **LGPD** | Lei Geral de Proteção de Dados — legislação brasileira de privacidade |

---

*Documento elaborado por Antigravity com base nos dados fornecidos pela Santa Casa de Ilhabela.*  
*Versão sujeita a revisão após validação com stakeholders.*
