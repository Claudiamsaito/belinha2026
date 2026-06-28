# PRD — Dashboard de Gestão em Saúde
**Empresa:** Antigravity | **Versão:** 1.0 | **Data:** Abril 2026 | **Status:** Em Revisão | **Confidencial**

---

## 1. Visão Geral do Produto

### 1.1 Contexto e Motivação

A rede municipal de saúde opera com múltiplas unidades — UBS, AME, CAPS, Academias da Saúde — cada uma produzindo dados de agendamento em sistemas distintos. Hoje, esses dados existem em silos, impedindo que gestores tenham uma visão consolidada em tempo real do que está acontecendo na rede.

A análise do arquivo de dados fornecido pelo cliente revelou aproximadamente 1.724 registros de agendamentos em um único dia (17/04/2026), envolvendo múltiplas unidades, profissionais com diferentes CBOs e tipos de procedimento. Isso sinaliza um volume expressivo de informações que, sem um dashboard dedicado, fica disperso e sem valor analítico.

### 1.2 Declaração do Problema

Gestores municipais e coordenadores de unidade não conseguem responder, em tempo real, perguntas essenciais como:

- Quantos pacientes foram atendidos hoje em cada unidade?
- Quais profissionais têm maior índice de absenteísmo?
- Quais procedimentos são mais demandados e em quais horários?
- Qual a distribuição etária dos pacientes atendidos?
- Existe ociosidade de agenda em alguma unidade ou especialidade?

### 1.3 Solução Proposta

A Antigravity desenvolverá o **Dashboard de Gestão em Saúde**: uma plataforma web responsiva (mobile-friendly) que consolida, em tempo real, os dados de agendamento e produção de todas as unidades, com controle de acesso hierárquico por perfil de usuário.

---

## 2. Análise dos Dados de Origem

O arquivo CSV fornecido pelo cliente (`contatos.csv`) serviu como base para o mapeamento de entidades, relacionamentos e indicadores do dashboard.

### 2.1 Estrutura dos Dados

| Campo | Tipo | Descrição |
|---|---|---|
| `unidade` | Texto | Nome da unidade de saúde (UBS, AME, CAPS, Academia) |
| `profissional` | Texto | Nome completo do profissional de saúde |
| `cbo` | Texto | Classificação Brasileira de Ocupações do profissional |
| `procedimento` | Texto | Tipo de consulta ou procedimento realizado |
| `codigo` | Alfanum. | Código identificador do paciente no sistema legado |
| `paciente` | Texto | Nome completo do paciente |
| `cns` | Numérico | Cartão Nacional de Saúde (identificador único nacional) |
| `dn` | Data | Data de nascimento — permite cálculo de faixa etária |
| `data` | Data | Data do agendamento / atendimento |
| `hora` | Hora | Horário do agendamento — permite análise de fluxo por turno |
| `telefone1` | Texto | Contato do paciente para notificações e confirmações |

### 2.2 Entidades Identificadas na Amostra

**Unidades:**
- Academia Barra Velha Ilhabela
- AME Caraguatatuba
- CAPS AD de Ilhabela
- UBS Pereque Ilhabela
- (+ outras unidades na rede)

**Tipos de Profissional (CBO):**
- Médico de Família (ESF)
- Médico Especialista (Oftalmologista, Urologista)
- Enfermeiro ESF
- Psicólogo
- Assistente Social
- Terapeuta Ocupacional
- Profissional de Educação Física

**Tipos de Procedimento:**
- Consulta Médica Atenção Básica
- Consulta Médica em Atenção Especializada
- Consulta de Nível Superior na Atenção Básica (exceto médico)
- Consulta de Nível Superior na Atenção Especializada (exceto médico)

### 2.3 Oportunidades Analíticas Identificadas

- Distribuição de atendimentos por unidade, profissional, CBO e tipo de procedimento
- Análise de faixa etária dos pacientes com base na data de nascimento
- Identificação de picos de demanda por horário e turno
- Cruzamento entre capacidade agendada e produção real (quando integrado a dados de absenteísmo)
- Ranking de produtividade por profissional e por unidade
- Alertas de agenda vazia ou subutilizada por especialidade

---

## 3. Objetivos e Critérios de Sucesso

| # | Objetivo | Indicador de Sucesso |
|---|---|---|
| O1 | Consolidar dados de múltiplas fontes em uma visão única e em tempo real | Latência < 30 segundos entre evento e dashboard |
| O2 | Reduzir tempo gasto por gestores em relatórios manuais | Redução de 70% no tempo de elaboração de relatórios mensais |
| O3 | Aumentar a visibilidade sobre absenteísmo de pacientes | Taxa de absenteísmo monitorada e reduzida em 15% em 6 meses |
| O4 | Apoiar decisões de alocação de profissionais e recursos | Pelo menos 80% dos gestores usam o dashboard semanalmente |
| O5 | Garantir segurança e privacidade dos dados de pacientes (LGPD) | Zero incidentes de acesso indevido a dados sensíveis |

---

## 4. Perfis de Usuário e Hierarquia de Acesso

O sistema adota um modelo hierárquico de acesso com 4 perfis distintos. Cada perfil acessa apenas os dados e funcionalidades pertinentes ao seu escopo de responsabilidade.

| Perfil | Quem é | Escopo de Visão | Principais Necessidades |
|---|---|---|---|
| **Super Admin** | Equipe Antigravity / TI | Tudo — configuração do sistema | Gerenciar integrações, usuários, logs de sistema |
| **Gestor Municipal** | Secretaria de Saúde | Toda a rede municipal | KPIs macro, comparativo entre unidades, metas |
| **Coordenador de Unidade** | Diretor de UBS, AME, CAPS | Somente sua unidade | Agenda do dia, produção da equipe, absenteísmo |
| **Profissional de Saúde** | Médicos, enfermeiros, etc. | Somente sua agenda própria | Pacientes do dia, histórico de atendimentos |

---

## 5. Funcionalidades e Requisitos

### 5.1 Módulo 1 — Painel Principal (Home)

Visão consolidada com os indicadores do dia, acessível logo após o login. O conteúdo exibido varia conforme o perfil do usuário.

**KPIs em Cards de Destaque:**
- Total de agendamentos do dia (por unidade ou rede toda)
- Total de atendimentos realizados vs. agendados (taxa de comparecimento)
- Número de profissionais em atividade no dia
- Alertas de capacidade: unidades com baixa ocupação ou sobrecarga

**Filtros Globais:**
- Período (dia, semana, mês, período customizado)
- Unidade de saúde (multi-seleção)
- Tipo de unidade (UBS, AME, CAPS, Academia)
- CBO / categoria profissional
- Tipo de procedimento

### 5.2 Módulo 2 — Agendamentos e Produção

- Listagem de todos os agendamentos com busca por paciente, profissional ou unidade
- Gráfico de volume de atendimentos por hora do dia (identificação de picos)
- Gráfico de produção diária/semanal/mensal por unidade
- Comparativo de produção entre unidades no mesmo período
- Exportação dos dados filtrados em CSV e PDF

### 5.3 Módulo 3 — Profissionais

- Ranking de produção por profissional (atendimentos realizados)
- Agenda do profissional: slots livres, ocupados, faltas
- Distribuição de procedimentos por CBO
- Indicador de carga de trabalho vs. capacidade máxima

### 5.4 Módulo 4 — Pacientes e Perfil Epidemiológico

> Dados anonimizados e agregados para análise epidemiológica, respeitando a LGPD.

- Distribuição por faixa etária (calculada a partir da data de nascimento)
- Distribuição por turno de preferência (manhã, tarde)
- Frequência de retorno de pacientes (pacientes com múltiplos agendamentos)
- Mapa de calor geográfico de origem dos pacientes (quando disponível o CEP)

### 5.5 Módulo 5 — Absenteísmo

- Taxa de não comparecimento por unidade, profissional e período
- Ranking de pacientes com maior histórico de faltas
- Horários com maior índice de falta
- Funcionalidade de disparo de lembrete via WhatsApp/SMS ao paciente (usando o campo `telefone1`)

### 5.6 Módulo 6 — Relatórios e Exportação

- Geração automática de relatório mensal de produção por unidade (PDF)
- Relatório de BPA (Boletim de Produção Ambulatorial) para prestação de contas ao Ministério da Saúde
- Exportação de qualquer visualização em CSV, XLSX ou PDF
- Agendamento de envio automático de relatórios por e-mail

---

## 6. Requisitos Não Funcionais

| Categoria | Requisito | Especificação |
|---|---|---|
| Performance | Latência de dados | Dados atualizados em < 30 segundos via streaming (WebSocket ou SSE) |
| Performance | Tempo de carregamento | Dashboard inicial carregado em < 3 segundos em conexão 4G |
| Segurança | Autenticação | SSO com MFA obrigatório para perfis Gestor e Admin |
| Segurança | LGPD | Dados de pacientes anonimizados em análises agregadas; acesso nominal somente para perfis autorizados |
| Segurança | Auditoria | Log de todos os acessos e exportações de dados por 12 meses |
| Disponibilidade | Uptime | SLA de 99,5% de disponibilidade (≈ 3,6h de downtime/mês tolerado) |
| Responsividade | Mobile-first | Interface adaptável para smartphones (≥ 375px) e tablets (≥ 768px) |
| Escalabilidade | Volume | Suporte a até 50 unidades e 500 profissionais simultâneos sem degradação |
| Integrações | Multi-fonte | API REST + conector de arquivos CSV/XLSX para sistemas legados sem API |

---

## 7. Arquitetura e Integrações

### 7.1 Fontes de Dados

O cliente sinalizou múltiplas fontes de dados. A arquitetura deve suportar os seguintes cenários de ingestão:

- **Sistemas com API REST** (Tasy, MV, PEP municipais): integração via webhook ou polling periódico
- **Sistemas legados sem API**: ingestão via upload de arquivos CSV/XLSX com mapeamento de colunas configurável
- **Planilhas operacionais**: conector Google Sheets / Excel Online
- **Futuramente**: integração com RNDS (Rede Nacional de Dados em Saúde) do Ministério da Saúde

### 7.2 Camadas da Solução

| Camada | Descrição |
|---|---|
| **Ingestão** | Conectores para APIs REST, uploads CSV, banco de dados legado (SQL). Pipeline ETL com validação e deduplicação de registros. |
| **Processamento** | Streaming em tempo real (Apache Kafka ou equivalente). Cálculo de métricas e agregações no backend. |
| **Armazenamento** | Data warehouse otimizado para consultas analíticas (OLAP). Banco relacional para dados operacionais. |
| **API / BFF** | Backend for Frontend com endpoints otimizados por perfil de usuário. WebSocket para atualizações em tempo real. |
| **Frontend** | Aplicação web responsiva (React ou equivalente). Progressive Web App (PWA) para uso offline parcial. |
| **Segurança** | Camada de identidade e acesso (IAM) com RBAC (Role-Based Access Control). Criptografia em repouso e em trânsito. |

---

## 8. Roadmap de Entrega

| Fase | Prazo | Entregáveis | Perfis Impactados |
|---|---|---|---|
| **Fase 1 — Fundação** | Semanas 1–4 | Infraestrutura de ingestão de dados, autenticação com RBAC, painel principal com KPIs básicos, importação de CSV | Admin, Gestor Municipal |
| **Fase 2 — Produção** | Semanas 5–9 | Módulo de Agendamentos, Módulo de Profissionais, filtros avançados, exportação PDF/CSV, alertas em tempo real | Gestor, Coordenador de Unidade |
| **Fase 3 — Analítica** | Semanas 10–14 | Módulo Epidemiológico, Módulo de Absenteísmo, disparos de lembrete (WhatsApp/SMS), relatórios automáticos BPA | Gestor, Coordenador, Profissional |
| **Fase 4 — Maturidade** | Semanas 15–20 | Integração com APIs de sistemas legados, PWA mobile, módulo de metas e acompanhamento de indicadores, RNDS | Todos os perfis |

---

## 9. Riscos e Questões em Aberto

### 9.1 Riscos Identificados

| Risco | Impacto | Mitigação |
|---|---|---|
| Sistemas legados sem API documentada ou instável | Alto | Iniciar com ingestão via CSV; manter conector genérico e documentar processo de onboarding de novas fontes |
| Qualidade dos dados inconsistente entre unidades (campos em branco, formatos diferentes) | Alto | Pipeline ETL com validação e logs de qualidade. Dashboard de monitoramento de integridade dos dados para equipe de TI |
| Resistência de profissionais ao uso da plataforma | Médio | UX simplificada para profissionais; treinamento presencial nas unidades; champion local em cada unidade |
| Dados de pacientes expostos indevidamente (risco LGPD) | Alto | Auditoria de acessos, anonimização em views analíticas, DPO envolvido no processo desde o início |
| Latência de internet em unidades periféricas impactando tempo real | Médio | PWA com modo offline parcial; sincronização quando conectado; indicador visual de status de conexão |

### 9.2 Questões em Aberto

- Qual é o sistema de prontuário atual de cada unidade? (necessário para planejar conectores específicos)
- Existe já uma infraestrutura de cloud definida (AWS, Azure, GCP) ou o projeto define isso?
- Há um DPO (Data Protection Officer) designado para acompanhar a conformidade LGPD?
- O envio de lembretes por WhatsApp/SMS deve usar uma plataforma já contratada ou a Antigravity define o fornecedor?
- Qual o prazo-alvo para entrega da Fase 1 (go-live mínimo)?
- Haverá integração futura com o sistema de regulação (SISREG) do Ministério da Saúde?

---

## 10. Glossário

| Termo | Definição |
|---|---|
| **UBS** | Unidade Básica de Saúde — porta de entrada do SUS para atenção primária |
| **AME** | Ambulatório Médico de Especialidades — atenção especializada ambulatorial |
| **CAPS** | Centro de Atenção Psicossocial — atenção à saúde mental e dependência química |
| **CBO** | Classificação Brasileira de Ocupações — código que identifica a categoria do profissional de saúde |
| **CNS** | Cartão Nacional de Saúde — identificador único do paciente no SUS |
| **BPA** | Boletim de Produção Ambulatorial — relatório obrigatório de prestação de contas ao Ministério da Saúde |
| **ESF** | Estratégia de Saúde da Família — modelo de atenção primária com equipes multiprofissionais territorializadas |
| **LGPD** | Lei Geral de Proteção de Dados (Lei 13.709/2018) — regulamenta o tratamento de dados pessoais no Brasil |
| **RNDS** | Rede Nacional de Dados em Saúde — plataforma de interoperabilidade do Ministério da Saúde |
| **RBAC** | Role-Based Access Control — modelo de controle de acesso baseado em perfis/funções de usuário |
| **KPI** | Key Performance Indicator — indicador-chave de desempenho, métrica principal de monitoramento |
| **ETL** | Extract, Transform, Load — processo de extração, transformação e carga de dados entre sistemas |

---

*Documento elaborado por Antigravity · Versão 1.0 · Abril 2026 · Confidencial*
