import { type Avaliacao } from './avaliacoes-store';

export interface TrendData {
  data: string;
  media: number;
  total: number;
}

export interface CategoryStats {
  categoria: string;
  media: number;
  total: number;
}

export interface UnidadeComparacao {
  unidade: string;
  periodo1: number;
  periodo2: number;
  variacao: number;
  variacaoPercentual: number;
}

export interface RelatorioCompleto {
  periodoInicio: string;
  periodoFim: string;
  totalAvaliacoes: number;
  mediaGeral: number;
  unidadesAvaliadas: number;
  tendencias: TrendData[];
  categorias: CategoryStats[];
  comparativos: UnidadeComparacao[];
  topUnidades: Array<{ nome: string; media: number }>;
  pioresUnidades: Array<{ nome: string; media: number }>;
}

/**
 * Gera dados de tendência por dia/semana/mês
 */
export function gerarTendencias(
  avaliacoes: Avaliacao[],
  periodo: 'dia' | 'semana' | 'mes' = 'dia'
): TrendData[] {
  const agora = new Date();
  const dados: Map<string, { soma: number; count: number }> = new Map();

  avaliacoes.forEach((av) => {
    const data = new Date(av.data);
    let chave: string;

    if (periodo === 'dia') {
      chave = data.toISOString().split('T')[0];
    } else if (periodo === 'semana') {
      const semana = Math.floor((agora.getTime() - data.getTime()) / (7 * 24 * 60 * 60 * 1000));
      chave = `Semana ${semana}`;
    } else {
      chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    }

    const atual = dados.get(chave) || { soma: 0, count: 0 };
    atual.soma += av.nota;
    atual.count += 1;
    dados.set(chave, atual);
  });

  return Array.from(dados.entries())
    .map(([data, { soma, count }]) => ({
      data,
      media: parseFloat((soma / count).toFixed(2)),
      total: count,
    }))
    .sort((a, b) => a.data.localeCompare(b.data));
}

/**
 * Calcula estatísticas por categoria de avaliação
 */
export function calcularEstatisticasPorCategoria(
  avaliacoes: Avaliacao[]
): CategoryStats[] {
  const categorias: Map<string, { soma: number; count: number }> = new Map();

  avaliacoes.forEach((av) => {
    const { atendimento, limpeza, tempoEspera, estrutura } = av.categorias;
    const categoriasArray = [
      { nome: 'Atendimento', nota: atendimento },
      { nome: 'Limpeza', nota: limpeza },
      { nome: 'Tempo de Espera', nota: tempoEspera },
      { nome: 'Estrutura', nota: estrutura },
    ];

    categoriasArray.forEach((cat) => {
      const atual = categorias.get(cat.nome) || { soma: 0, count: 0 };
      atual.soma += cat.nota;
      atual.count += 1;
      categorias.set(cat.nome, atual);
    });
  });

  return Array.from(categorias.entries())
    .map(([categoria, { soma, count }]) => ({
      categoria,
      media: parseFloat((soma / count).toFixed(2)),
      total: count,
    }))
    .sort((a, b) => b.media - a.media);
}

/**
 * Compara desempenho entre dois períodos
 */
export function compararPeriodos(
  avaliacoesPeriodo1: Avaliacao[],
  avaliacoesPeriodo2: Avaliacao[],
  unidades: Array<{ id: string; nome: string }>
): UnidadeComparacao[] {
  const comparacoes: UnidadeComparacao[] = [];

  unidades.forEach((unidade) => {
    const av1 = avaliacoesPeriodo1.filter((av) => av.unidadeId === unidade.id);
    const av2 = avaliacoesPeriodo2.filter((av) => av.unidadeId === unidade.id);

    const media1 =
      av1.length > 0
        ? parseFloat((av1.reduce((sum, av) => sum + av.nota, 0) / av1.length).toFixed(2))
        : 0;

    const media2 =
      av2.length > 0
        ? parseFloat((av2.reduce((sum, av) => sum + av.nota, 0) / av2.length).toFixed(2))
        : 0;

    const variacao = parseFloat((media2 - media1).toFixed(2));
    const variacaoPercentual =
      media1 > 0
        ? parseFloat(((variacao / media1) * 100).toFixed(2))
        : media2 > 0
          ? 100
          : 0;

    comparacoes.push({
      unidade: unidade.nome,
      periodo1: media1,
      periodo2: media2,
      variacao,
      variacaoPercentual,
    });
  });

  return comparacoes.sort((a, b) => Math.abs(b.variacao) - Math.abs(a.variacao));
}

/**
 * Gera relatório completo
 */
export function gerarRelatorioCompleto(
  avaliacoes: Avaliacao[],
  unidades: Array<{ id: string; nome: string }>,
  periodoInicio: string,
  periodoFim: string
): RelatorioCompleto {
  const totalAvaliacoes = avaliacoes.length;
  const mediaGeral =
    totalAvaliacoes > 0
      ? parseFloat((avaliacoes.reduce((sum, av) => sum + av.nota, 0) / totalAvaliacoes).toFixed(2))
      : 0;

  const unidadesComAvaliacoes = new Set(avaliacoes.map((av) => av.unidadeId)).size;

  // Calcular top e piores unidades
  const statsUnidades: Array<{ nome: string; media: number }> = [];
  unidades.forEach((unidade) => {
    const avsUnidade = avaliacoes.filter((av) => av.unidadeId === unidade.id);
    if (avsUnidade.length > 0) {
      const media = parseFloat(
        (avsUnidade.reduce((sum, av) => sum + av.nota, 0) / avsUnidade.length).toFixed(2)
      );
      statsUnidades.push({ nome: unidade.nome, media });
    }
  });

  const topUnidades = statsUnidades.sort((a, b) => b.media - a.media).slice(0, 5);
  const pioresUnidades = statsUnidades.sort((a, b) => a.media - b.media).slice(0, 5);

  return {
    periodoInicio,
    periodoFim,
    totalAvaliacoes,
    mediaGeral,
    unidadesAvaliadas: unidadesComAvaliacoes,
    tendencias: gerarTendencias(avaliacoes, 'dia'),
    categorias: calcularEstatisticasPorCategoria(avaliacoes),
    comparativos: [],
    topUnidades,
    pioresUnidades,
  };
}

/**
 * Formata dados para gráfico de linhas (tendências)
 */
export function formatarDadosGraficoLinhas(tendencias: TrendData[]) {
  return {
    labels: tendencias.map((t) => t.data.substring(5)), // MM-DD
    datasets: [
      {
        label: 'Média de Avaliações',
        data: tendencias.map((t) => t.media),
        borderColor: '#0a7ea4',
        backgroundColor: 'rgba(10, 126, 164, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

/**
 * Formata dados para gráfico de barras (categorias)
 */
export function formatarDadosGraficoBarras(categorias: CategoryStats[]) {
  return {
    labels: categorias.map((c) => c.categoria),
    datasets: [
      {
        label: 'Média por Categoria',
        data: categorias.map((c) => c.media),
        backgroundColor: ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
        borderRadius: 8,
      },
    ],
  };
}

/**
 * Formata dados para gráfico de pizza (distribuição)
 */
export function formatarDadosGraficoPizza(categorias: CategoryStats[]) {
  return {
    labels: categorias.map((c) => c.categoria),
    datasets: [
      {
        data: categorias.map((c) => c.total),
        backgroundColor: ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
      },
    ],
  };
}

/**
 * Calcula variação percentual
 */
export function calcularVariacaoPercentual(valor1: number, valor2: number): number {
  if (valor1 === 0) return valor2 > 0 ? 100 : 0;
  return parseFloat((((valor2 - valor1) / valor1) * 100).toFixed(2));
}

/**
 * Formata número para moeda/percentual
 */
export function formatarNumero(valor: number, tipo: 'numero' | 'percentual' = 'numero'): string {
  if (tipo === 'percentual') {
    return `${valor > 0 ? '+' : ''}${valor}%`;
  }
  return valor.toFixed(2);
}
