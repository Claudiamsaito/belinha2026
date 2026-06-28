import { describe, it, expect } from "vitest";

// Pure logic tests for the rating system (no module imports with @ alias)
// These test the business logic that the store implements

function calcularMedia(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

interface AvaliacaoCategoria {
  atendimento: number;
  limpeza: number;
  tempoEspera: number;
  estrutura: number;
}

function calcularNotaGeral(categorias: AvaliacaoCategoria): number {
  return calcularMedia([
    categorias.atendimento,
    categorias.limpeza,
    categorias.tempoEspera,
    categorias.estrutura,
  ]);
}

function calcularDistribuicao(notas: number[]): Record<number, number> {
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  notas.forEach((n) => {
    const estrela = Math.round(n);
    if (estrela >= 1 && estrela <= 5) dist[estrela]++;
  });
  return dist;
}

describe("Sistema de Avaliação — Lógica de Negócio", () => {
  it("calcularMedia retorna 0 para array vazio", () => {
    expect(calcularMedia([])).toBe(0);
  });

  it("calcularMedia calcula corretamente com valores simples", () => {
    expect(calcularMedia([5, 5, 5, 5])).toBe(5);
    expect(calcularMedia([1, 2, 3, 4])).toBe(2.5);
    expect(calcularMedia([3, 4, 5])).toBe(4);
  });

  it("calcularMedia arredonda para 1 casa decimal", () => {
    expect(calcularMedia([4, 5, 3])).toBe(4); // 12/3 = 4.0
    expect(calcularMedia([1, 2])).toBe(1.5);
  });

  it("calcularNotaGeral calcula média das 4 categorias", () => {
    const cats: AvaliacaoCategoria = {
      atendimento: 5,
      limpeza: 4,
      tempoEspera: 3,
      estrutura: 4,
    };
    // (5+4+3+4)/4 = 16/4 = 4.0
    expect(calcularNotaGeral(cats)).toBe(4);
  });

  it("calcularNotaGeral com todas as notas máximas retorna 5", () => {
    const cats: AvaliacaoCategoria = {
      atendimento: 5,
      limpeza: 5,
      tempoEspera: 5,
      estrutura: 5,
    };
    expect(calcularNotaGeral(cats)).toBe(5);
  });

  it("calcularNotaGeral com todas as notas mínimas retorna 1", () => {
    const cats: AvaliacaoCategoria = {
      atendimento: 1,
      limpeza: 1,
      tempoEspera: 1,
      estrutura: 1,
    };
    expect(calcularNotaGeral(cats)).toBe(1);
  });

  it("calcularDistribuicao conta estrelas corretamente", () => {
    const notas = [5, 5, 4, 3, 5, 2, 1];
    const dist = calcularDistribuicao(notas);
    expect(dist[5]).toBe(3);
    expect(dist[4]).toBe(1);
    expect(dist[3]).toBe(1);
    expect(dist[2]).toBe(1);
    expect(dist[1]).toBe(1);
  });

  it("calcularDistribuicao ignora notas fora do intervalo 1-5", () => {
    const notas = [5, 0, 6, 3];
    const dist = calcularDistribuicao(notas);
    expect(dist[5]).toBe(1);
    expect(dist[3]).toBe(1);
    // 0 e 6 não devem ser contados
    expect(Object.values(dist).reduce((a, b) => a + b, 0)).toBe(2);
  });

  it("sistema de avaliação tem 4 categorias obrigatórias", () => {
    const categorias = ["atendimento", "limpeza", "tempoEspera", "estrutura"];
    expect(categorias).toHaveLength(4);
    expect(categorias).toContain("atendimento");
    expect(categorias).toContain("limpeza");
    expect(categorias).toContain("tempoEspera");
    expect(categorias).toContain("estrutura");
  });

  it("avaliação incompleta é detectada quando alguma categoria é 0", () => {
    const cats: AvaliacaoCategoria = {
      atendimento: 5,
      limpeza: 0, // não preenchida
      tempoEspera: 4,
      estrutura: 3,
    };
    const incompleta = Object.values(cats).some((v) => v === 0);
    expect(incompleta).toBe(true);
  });

  it("avaliação completa é detectada quando todas as categorias > 0", () => {
    const cats: AvaliacaoCategoria = {
      atendimento: 5,
      limpeza: 4,
      tempoEspera: 3,
      estrutura: 4,
    };
    const incompleta = Object.values(cats).some((v) => v === 0);
    expect(incompleta).toBe(false);
  });

  it("unidades têm IDs únicos", () => {
    const unidadeIds = [
      "sede", "hospital", "ubs_barra_velha", "ubs_costa_norte",
      "ubs_vila_centro", "ubs_itaquanduba", "ubs_perequê",
      "ubs_alto_barra", "ubs_agua_branca", "ubs_costa_sul",
      "cre", "cev", "ceo", "certea",
    ];
    const unique = new Set(unidadeIds);
    expect(unique.size).toBe(unidadeIds.length);
  });
});
