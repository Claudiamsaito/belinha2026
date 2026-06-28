# Missão Saúde Ilhabela — TODO

## Setup e Configuração
- [x] Configurar tema de cores (verde Santa Casa, azul, branco)
- [x] Gerar logo e ícone da Belinha
- [x] Atualizar app.config.ts com nome e logo
- [x] Configurar navegação sem tab bar (fluxo linear)

## Telas
- [x] Splash Screen com logo Santa Casa
- [x] Tela de Boas-Vindas com Belinha e botão "Iniciar Missão"
- [x] Tela do Mapa das Unidades (lista categorizada)
- [x] Tela de Escolha do Caminho (3 cards: QR Code, Papel, WhatsApp)
- [x] Tela do Caminho QR Code com animação de câmera
- [x] Tela do Caminho Formulário Impresso
- [x] Tela do Caminho WhatsApp com simulação de notificação
- [x] Tela de Conclusão com Selo de Amigo da Saúde

## Componentes
- [x] Componente Belinha (personagem com balão de fala)
- [x] Barra de progresso do fluxo
- [x] Cards de seleção de caminho
- [x] Botão pulsante de ação
- [x] Animação de confetes na conclusão
- [x] Animação de câmera (QR Code scan)
- [x] Simulação de balão WhatsApp

## Funcionalidades
- [x] Link para Google Forms (QR Code): https://forms.gle/1BBPrSTR2YhiG5QPA
- [x] Link para Google Forms (WhatsApp/Médico): https://forms.gle/Ee1YnyEdxqv94eve8
- [x] Abertura de link externo no browser
- [x] Navegação entre telas
- [x] Política de privacidade na tela de conclusão

## Atualização de Imagens (solicitado pelo usuário)
- [x] Fazer upload da nova imagem da Belinha (uniforme azul, crachá)
- [x] Fazer upload do logo oficial da Santa Casa de Ilhabela
- [x] Substituir imagem da Belinha em todos os componentes e telas
- [x] Substituir logo da Santa Casa na tela de boas-vindas e conclusão
- [x] Atualizar ícone do app com o logo da Santa Casa

## Correção de Links (solicitado pelo usuário)
- [x] Atualizar link do QR Code para formulário da recepção: https://forms.gle/r48ujrBz3yWX15on8

## Botão de Compartilhamento (solicitado pelo usuário)
- [x] Ler documentação do expo-sharing
- [x] Adicionar botão de compartilhamento na tela de conclusão
- [x] Adicionar botão de compartilhamento na tela de boas-vindas
- [x] Implementar mensagem personalizada de compartilhamento com link do app

## Ajuste WhatsApp (solicitado pelo usuário)
- [x] Remover botão "Acessar Formulário Médico" da tela do WhatsApp

## Botão de Sair (solicitado pelo usuário)
- [x] Adicionar botão "Encerrar e Sair" na tela de conclusão
- [x] Implementar lógica de fechar/minimizar o app ao pressionar

## Ajustes visuais e funcionais (solicitado pelo usuário)
- [x] Substituir Belinha pela nova imagem (sentada na recepção com tablet)
- [x] Adicionar logo da Santa Casa no topo de todas as telas (identidade visual)
- [x] Corrigir botão de sair para fechar o app de verdade no Android

## Tela de Instruções Iniciais (solicitado pelo usuário)
- [x] Criar tela instrucoes.tsx com objetivo do jogo explicado pela Belinha
- [x] Inserir tela entre boas-vindas e mapa (passo 0 do fluxo)
- [x] Atualizar barra de progresso para 6 passos
- [x] Atualizar botão "Iniciar Missão" na welcome para ir para instruções

## Tela Sobre a Santa Casa (solicitado pelo usuário)
- [x] Pesquisar história e informações da Santa Casa de Ilhabela
- [x] Criar tela sobre.tsx com história, missão/visão/valores e contatos
- [x] Adicionar botão de acesso na tela de boas-vindas
- [x] Registrar tela no Stack do _layout.tsx

## Mapa Interativo na Tela Sobre (solicitado pelo usuário)
- [x] Pesquisar coordenadas GPS de todas as unidades da Santa Casa de Ilhabela
- [x] Instalar e configurar expo-maps (ou react-native-maps)
- [x] Implementar mapa com marcadores clicáveis na tela sobre.tsx
- [x] Adicionar painel de detalhes ao tocar em cada marcador

## Sistema de Avaliação por Unidade (solicitado pelo usuário)
- [x] Criar store de avaliações com AsyncStorage (avaliacoes-store.ts)
- [x] Criar componente StarRating reutilizável
- [x] Criar tela de avaliação de unidade (avaliacao.tsx)
- [x] Integrar botão "Avaliar" nos cards de unidades na tela Sobre
- [x] Exibir média de estrelas e total de avaliações nos cards
- [x] Adicionar categorias de avaliação (atendimento, limpeza, tempo de espera)
- [x] Registrar tela no Stack do _layout.tsx

## Integração com Google Forms e Backend (solicitado pelo usuário)
- [x] Acessar Google Forms e extrair perguntas reais do questionário
- [x] Atualizar tela de avaliação com as 5 perguntas reais do formulário
- [ ] Criar tabelas no banco de dados para armazenar respostas
- [ ] Desenvolver endpoints da API para salvar avaliações
- [ ] Integrar envio de dados do app para o backend
- [ ] Criar tela de dashboard com relatórios e gráficos
- [ ] Adicionar filtros por unidade, período e tipo de pergunta no dashboard
