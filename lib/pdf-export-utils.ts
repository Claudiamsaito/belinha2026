import { type RelatorioCompleto } from './advanced-reports-utils';

/**
 * Gera relatório em formato HTML para exportação em PDF
 */
export function gerarHTMLRelatorio(relatorio: RelatorioCompleto): string {
  const dataAtual = new Date().toLocaleDateString('pt-BR');

  const htmlTendencias = relatorio.tendencias
    .map(
      (t) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.data}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${t.media.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${t.total}</td>
    </tr>
  `
    )
    .join('');

  const htmlCategorias = relatorio.categorias
    .map(
      (c) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${c.categoria}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${c.media.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${c.total}</td>
    </tr>
  `
    )
    .join('');

  const htmlTopUnidades = relatorio.topUnidades
    .map(
      (u, i) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${i + 1}º</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${u.nome}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${u.media.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const htmlPioresUnidades = relatorio.pioresUnidades
    .map(
      (u, i) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${i + 1}º</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${u.nome}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${u.media.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Avaliações - Santa Casa</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background-color: white;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #0a7ea4;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #0a7ea4;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: linear-gradient(135deg, #0a7ea4 0%, #1e90ff 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-card.alt {
      background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%);
    }
    .stat-card h3 {
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    .stat-card .value {
      font-size: 32px;
      font-weight: bold;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      color: #0a7ea4;
      font-size: 20px;
      margin-bottom: 20px;
      border-left: 4px solid #0a7ea4;
      padding-left: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background-color: #0a7ea4;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body {
        background-color: white;
      }
      .container {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Relatório de Avaliações</h1>
      <p>Santa Casa de Ilhabela - Ciclo da Melhoria</p>
      <p>Período: ${relatorio.periodoInicio} a ${relatorio.periodoFim}</p>
      <p>Gerado em: ${dataAtual}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total de Avaliações</h3>
        <div class="value">${relatorio.totalAvaliacoes}</div>
      </div>
      <div class="stat-card alt">
        <h3>Média Geral</h3>
        <div class="value">${relatorio.mediaGeral.toFixed(2)}</div>
      </div>
      <div class="stat-card">
        <h3>Unidades Avaliadas</h3>
        <div class="value">${relatorio.unidadesAvaliadas}</div>
      </div>
      <div class="stat-card alt">
        <h3>Período</h3>
        <div class="value" style="font-size: 16px;">Completo</div>
      </div>
    </div>

    <div class="section">
      <h2>📈 Tendências de Avaliações</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th style="text-align: center;">Média</th>
            <th style="text-align: center;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${htmlTendencias}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>🎯 Estatísticas por Categoria</h2>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th style="text-align: center;">Média</th>
            <th style="text-align: center;">Total de Avaliações</th>
          </tr>
        </thead>
        <tbody>
          ${htmlCategorias}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>⭐ Melhores Unidades</h2>
      <table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Unidade</th>
            <th style="text-align: center;">Média</th>
          </tr>
        </thead>
        <tbody>
          ${htmlTopUnidades}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>⚠️ Unidades com Menor Desempenho</h2>
      <table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Unidade</th>
            <th style="text-align: center;">Média</th>
          </tr>
        </thead>
        <tbody>
          ${htmlPioresUnidades}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>Este relatório foi gerado automaticamente pelo sistema de avaliações da Santa Casa de Ilhabela.</p>
      <p>Para mais informações, entre em contato com a administração.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Gera CSV com dados de tendências
 */
export function gerarCSVTendencias(relatorio: RelatorioCompleto): string {
  let csv = 'Data,Média,Total\n';

  relatorio.tendencias.forEach((t) => {
    csv += `${t.data},${t.media.toFixed(2)},${t.total}\n`;
  });

  return csv;
}

/**
 * Gera CSV com dados de categorias
 */
export function gerarCSVCategorias(relatorio: RelatorioCompleto): string {
  let csv = 'Categoria,Média,Total\n';

  relatorio.categorias.forEach((c) => {
    csv += `${c.categoria},${c.media.toFixed(2)},${c.total}\n`;
  });

  return csv;
}

/**
 * Gera CSV com ranking de unidades
 */
export function gerarCSVRanking(relatorio: RelatorioCompleto): string {
  let csv = 'Posição,Unidade,Média\n';

  relatorio.topUnidades.forEach((u, i) => {
    csv += `${i + 1},${u.nome},${u.media.toFixed(2)}\n`;
  });

  csv += '\n--- PIORES UNIDADES ---\n';
  csv += 'Posição,Unidade,Média\n';

  relatorio.pioresUnidades.forEach((u, i) => {
    csv += `${i + 1},${u.nome},${u.media.toFixed(2)}\n`;
  });

  return csv;
}

/**
 * Cria um blob de PDF (simulado com HTML para web)
 */
export function criarBlobPDF(html: string): Blob {
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}

/**
 * Cria um blob de CSV
 */
export function criarBlobCSV(csv: string): Blob {
  return new Blob([csv], { type: 'text/csv;charset=utf-8' });
}

/**
 * Gera nome de arquivo com timestamp
 */
export function gerarNomeArquivo(tipo: 'pdf' | 'csv' | 'xlsx' = 'pdf'): string {
  const agora = new Date();
  const timestamp = agora.toISOString().split('T')[0];
  return `relatorio-avaliacoes-${timestamp}.${tipo}`;
}
