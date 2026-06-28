# Guia de Integração - Dashboard Santa Casa Ilhabela com IPEMPI

## Visão Geral

Este guia descreve como integrar o Dashboard de Saúde da Santa Casa Ilhabela no site do IPEMPI para visualização em tempo real.

## Opções de Integração

### 1. **Embed via iframe (Recomendado para Google Sites)**

A forma mais simples de integrar é usando um iframe. Adicione o seguinte código na página do IPEMPI:

```html
<iframe 
  src="https://seu-dominio.com/dashboard-widget.html" 
  width="100%" 
  height="800" 
  frameborder="0" 
  allow="fullscreen">
</iframe>
```

**Vantagens:**
- Simples de implementar
- Funciona em qualquer site
- Atualiza em tempo real
- Responsivo

**Desvantagens:**
- Pode ter limitações de CORS
- Menos controle sobre estilo

### 2. **Embed via Script (Mais Flexível)**

Adicione este script na página do IPEMPI:

```html
<div id="dashboard-container"></div>
<script src="https://seu-dominio.com/dashboard-embed.js"></script>
```

**Vantagens:**
- Mais controle sobre o layout
- Melhor integração com o design existente
- Sem problemas de CORS

**Desvantagens:**
- Requer mais configuração

## Configuração de CORS

Se usar iframe, configure CORS no servidor backend:

```typescript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://sites.google.com');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## Endpoints da API

### 1. **GET /api/dashboard/stats**

Retorna estatísticas gerais do dashboard.

**Resposta:**
```json
{
  "totalAvaliacoes": 156,
  "mediaGeral": 4.7,
  "unidadesAvaliadas": 8,
  "ultimaAtualizacao": "2026-04-07T12:00:00Z",
  "periodo": {
    "inicio": "2026-03-08T00:00:00Z",
    "fim": "2026-04-07T23:59:59Z"
  }
}
```

### 2. **GET /api/dashboard/units**

Retorna dados de avaliações por unidade.

**Resposta:**
```json
[
  {
    "id": "1",
    "nome": "Santa Casa — Sede / Administração",
    "media": 5.0,
    "avaliacoes": 45,
    "categorias": {
      "atendimento": 5.0,
      "tempoEspera": 4.9,
      "limpeza": 5.0,
      "estrutura": 5.0
    }
  }
]
```

### 3. **GET /api/dashboard/trends**

Retorna tendências de avaliações ao longo do tempo.

**Resposta:**
```json
[
  {
    "data": "2026-03-08",
    "media": 4.6,
    "total": 5
  }
]
```

### 4. **GET /api/dashboard/export?formato=csv**

Retorna dados para exportação em diferentes formatos.

**Formatos suportados:**
- `json` (padrão)
- `csv`
- `pdf` (em desenvolvimento)

## Sincronização em Tempo Real

O dashboard atualiza os dados a cada 30 segundos. Para customizar:

1. Edite o arquivo `public/dashboard-widget.html`
2. Localize a constante `REFRESH_INTERVAL`
3. Altere o valor em milissegundos (ex: 60000 = 1 minuto)

```javascript
const REFRESH_INTERVAL = 30000; // 30 segundos
```

## Customização de Estilo

### Cores Personalizadas

Edite as variáveis CSS no arquivo `dashboard-widget.html`:

```css
:root {
  --primary-color: #667eea;
  --success-color: #48bb78;
  --warning-color: #ed8936;
  --danger-color: #f56565;
}
```

### Tema Escuro

Adicione esta classe ao elemento raiz:

```html
<body class="dark-theme">
```

## Segurança

### Autenticação

Para proteger os dados, implemente autenticação:

```javascript
// No dashboard-widget.html
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

fetch(`${API_URL}/stats`, { headers })
  .then(res => res.json())
  .then(data => renderizarDashboard(data));
```

### HTTPS

Sempre use HTTPS em produção:

```html
<iframe src="https://seu-dominio.com/dashboard-widget.html"></iframe>
```

## Troubleshooting

### Problema: "Blocked by CORS"

**Solução:** Configure CORS no servidor backend (veja seção "Configuração de CORS")

### Problema: "Dados não atualizam"

**Solução:** 
1. Verifique se a API está respondendo: `curl https://seu-dominio.com/api/dashboard/stats`
2. Verifique o console do navegador para erros
3. Aumente o intervalo de atualização

### Problema: "Layout quebrado"

**Solução:**
1. Verifique a resolução da tela
2. Teste em diferentes navegadores
3. Verifique se o CSS está sendo carregado corretamente

## Próximos Passos

1. ✅ Logout funcionando corretamente
2. ✅ Dashboard widget HTML criado
3. ✅ API de sincronização implementada
4. ⏳ Integração com Google Sites do IPEMPI
5. ⏳ Testes de sincronização em tempo real
6. ⏳ Documentação de manutenção

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

**Email:** dev@santacasailhabela.com.br
**Telefone:** (12) 3892-1234
