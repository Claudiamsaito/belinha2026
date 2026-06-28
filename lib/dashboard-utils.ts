import * as XLSX from 'xlsx';
import { Avaliacao } from './avaliacoes-store';

export type PeriodoFiltro = '7dias' | '30dias' | '3meses' | 'todos';

/**
 * Filtra avaliações por período
 */
export function filtrarPorPeriodo(avaliacoes: Avaliacao[], periodo: PeriodoFiltro): Avaliacao[] {
  const agora = new Date();
  let dataLimite: Date;

  switch (periodo) {
    case '7dias':
      dataLimite = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30dias':
      dataLimite = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '3meses':
      dataLimite = new Date(agora.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'todos':
    default:
      return avaliacoes;
  }

  return avaliacoes.filter((avaliacao) => {
    const dataAvaliacao = new Date(avaliacao.data);
    return dataAvaliacao >= dataLimite;
  });
}

/**
 * Obtém label amigável para o período
 */
export function obterLabelPeriodo(periodo: PeriodoFiltro): string {
  switch (periodo) {
    case '7dias':
      return 'Últimos 7 dias';
    case '30dias':
      return 'Últimos 30 dias';
    case '3meses':
      return 'Últimos 3 meses';
    case 'todos':
      return 'Todos os períodos';
    default:
      return 'Período desconhecido';
  }
}

/**
 * Exporta avaliações para Excel
 */
export async function exportarParaExcel(
  avaliacoes: Avaliacao[],
  unidades: Map<string, string>,
  periodo: PeriodoFiltro
): Promise<void> {
  try {
    // Preparar dados para Excel
    const dados = avaliacoes.map((avaliacao) => ({
      'Data': new Date(avaliacao.data).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      'Unidade': unidades.get(avaliacao.unidadeId) || 'Desconhecida',
      'Nota Geral': avaliacao.nota,
      'Atendimento': avaliacao.categorias.atendimento,
      'Limpeza': avaliacao.categorias.limpeza,
      'Tempo de Espera': avaliacao.categorias.tempoEspera,
      'Estrutura': avaliacao.categorias.estrutura,
      'Comentário': avaliacao.comentario || '-',
    }));

    // Criar workbook
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Avaliações');

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 20 }, // Data
      { wch: 25 }, // Unidade
      { wch: 12 }, // Nota Geral
      { wch: 12 }, // Atendimento
      { wch: 12 }, // Limpeza
      { wch: 15 }, // Tempo de Espera
      { wch: 12 }, // Estrutura
      { wch: 30 }, // Comentário
    ];
    ws['!cols'] = colWidths;

    // Gerar nome do arquivo
    const dataAtual = new Date().toISOString().split('T')[0];
    const nomeArquivo = `Avaliacoes_${obterLabelPeriodo(periodo).replace(/\s+/g, '_')}_${dataAtual}.xlsx`;

    // Salvar arquivo
    XLSX.writeFile(wb, nomeArquivo);
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    throw error;
  }
}

/**
 * Gera um resumo dos dados para exibição
 */
export function gerarResumo(avaliacoes: Avaliacao[]) {
  if (avaliacoes.length === 0) {
    return {
      total: 0,
      media: 0,
      distribuicao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const notas = avaliacoes.map((a) => a.nota);
  const media = Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10;

  const distribuicao: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  avaliacoes.forEach((a) => {
    const estrela = Math.round(a.nota) as 1 | 2 | 3 | 4 | 5;
    if (estrela >= 1 && estrela <= 5) {
      distribuicao[estrela]++;
    }
  });

  return {
    total: avaliacoes.length,
    media,
    distribuicao,
  };
}
