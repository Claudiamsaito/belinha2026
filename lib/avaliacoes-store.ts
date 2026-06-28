import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AvaliacaoCategoria {
  atendimento: number;   // 1-5
  limpeza: number;       // 1-5
  tempoEspera: number;   // 1-5
  estrutura: number;     // 1-5
}

export interface Avaliacao {
  id: string;
  unidadeId: string;
  nota: number;           // média geral 1-5
  categorias: AvaliacaoCategoria;
  comentario: string;
  data: string;           // ISO date string
}

export interface UnidadeStats {
  totalAvaliacoes: number;
  mediaGeral: number;
  mediaCategorias: AvaliacaoCategoria;
  distribuicao: Record<1 | 2 | 3 | 4 | 5, number>; // quantas avaliações por estrela
}

const STORAGE_KEY = "@missao_saude:avaliacoes";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function calcularMedia(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function carregarAvaliacoes(): Promise<Avaliacao[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Avaliacao[]) : [];
  } catch {
    return [];
  }
}

export async function salvarAvaliacao(
  unidadeId: string,
  categorias: AvaliacaoCategoria,
  comentario: string
): Promise<Avaliacao> {
  const todas = await carregarAvaliacoes();

  const nota = calcularMedia([
    categorias.atendimento,
    categorias.limpeza,
    categorias.tempoEspera,
    categorias.estrutura,
  ]);

  const nova: Avaliacao = {
    id: gerarId(),
    unidadeId,
    nota,
    categorias,
    comentario: comentario.trim(),
    data: new Date().toISOString(),
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...todas, nova]));
  return nova;
}

export async function excluirAvaliacao(id: string): Promise<void> {
  const todas = await carregarAvaliacoes();
  const filtradas = todas.filter((a) => a.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function obterStatsUnidade(unidadeId: string): Promise<UnidadeStats> {
  const todas = await carregarAvaliacoes();
  const da_unidade = todas.filter((a) => a.unidadeId === unidadeId);

  if (da_unidade.length === 0) {
    return {
      totalAvaliacoes: 0,
      mediaGeral: 0,
      mediaCategorias: { atendimento: 0, limpeza: 0, tempoEspera: 0, estrutura: 0 },
      distribuicao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const distribuicao: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  da_unidade.forEach((a) => {
    const estrela = Math.round(a.nota) as 1 | 2 | 3 | 4 | 5;
    if (estrela >= 1 && estrela <= 5) distribuicao[estrela]++;
  });

  return {
    totalAvaliacoes: da_unidade.length,
    mediaGeral: calcularMedia(da_unidade.map((a) => a.nota)),
    mediaCategorias: {
      atendimento: calcularMedia(da_unidade.map((a) => a.categorias.atendimento)),
      limpeza: calcularMedia(da_unidade.map((a) => a.categorias.limpeza)),
      tempoEspera: calcularMedia(da_unidade.map((a) => a.categorias.tempoEspera)),
      estrutura: calcularMedia(da_unidade.map((a) => a.categorias.estrutura)),
    },
    distribuicao,
  };
}

export async function obterTodasStats(): Promise<Record<string, UnidadeStats>> {
  const todas = await carregarAvaliacoes();
  const unidadeIds = [...new Set(todas.map((a) => a.unidadeId))];
  const resultado: Record<string, UnidadeStats> = {};
  for (const id of unidadeIds) {
    resultado[id] = await obterStatsUnidade(id);
  }
  return resultado;
}
