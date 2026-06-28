import { describe, it, expect, beforeEach } from 'vitest';
import {
  filtrarPorPeriodo,
  obterLabelPeriodo,
  gerarResumo,
  type PeriodoFiltro,
} from '../dashboard-utils';
import type { Avaliacao } from '../avaliacoes-store';

describe('dashboard-utils', () => {
  let avaliacoes: Avaliacao[];

  beforeEach(() => {
    const agora = new Date();
    const uma_semana_atras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    const um_mes_atras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
    const tres_meses_atras = new Date(agora.getTime() - 90 * 24 * 60 * 60 * 1000);

    avaliacoes = [
      {
        id: '1',
        unidadeId: 'unit-1',
        nota: 4.5,
        categorias: {
          atendimento: 5,
          limpeza: 4,
          tempoEspera: 4,
          estrutura: 5,
        },
        comentario: 'Ótimo atendimento',
        data: agora.toISOString(),
      },
      {
        id: '2',
        unidadeId: 'unit-1',
        nota: 3.5,
        categorias: {
          atendimento: 4,
          limpeza: 3,
          tempoEspera: 3,
          estrutura: 4,
        },
        comentario: 'Bom',
        data: uma_semana_atras.toISOString(),
      },
      {
        id: '3',
        unidadeId: 'unit-2',
        nota: 2.5,
        categorias: {
          atendimento: 3,
          limpeza: 2,
          tempoEspera: 2,
          estrutura: 3,
        },
        comentario: 'Pode melhorar',
        data: um_mes_atras.toISOString(),
      },
      {
        id: '4',
        unidadeId: 'unit-2',
        nota: 1.5,
        categorias: {
          atendimento: 2,
          limpeza: 1,
          tempoEspera: 1,
          estrutura: 2,
        },
        comentario: 'Ruim',
        data: tres_meses_atras.toISOString(),
      },
    ];
  });

  describe('filtrarPorPeriodo', () => {
    it('deve retornar todas as avaliações quando período é "todos"', () => {
      const resultado = filtrarPorPeriodo(avaliacoes, 'todos');
      expect(resultado).toHaveLength(4);
    });

    it('deve filtrar avaliações dos últimos 7 dias', () => {
      const resultado = filtrarPorPeriodo(avaliacoes, '7dias');
      expect(resultado.length).toBeLessThanOrEqual(2);
    });

    it('deve filtrar avaliações dos últimos 30 dias', () => {
      const resultado = filtrarPorPeriodo(avaliacoes, '30dias');
      expect(resultado.length).toBeLessThanOrEqual(3);
    });

    it('deve filtrar avaliações dos últimos 3 meses', () => {
      const resultado = filtrarPorPeriodo(avaliacoes, '3meses');
      expect(resultado.length).toBeLessThanOrEqual(4);
    });

    it('deve retornar array vazio se nenhuma avaliação está no período', () => {
      const resultado = filtrarPorPeriodo([], '7dias');
      expect(resultado).toHaveLength(0);
    });
  });

  describe('obterLabelPeriodo', () => {
    it('deve retornar label correto para 7dias', () => {
      expect(obterLabelPeriodo('7dias')).toBe('Últimos 7 dias');
    });

    it('deve retornar label correto para 30dias', () => {
      expect(obterLabelPeriodo('30dias')).toBe('Últimos 30 dias');
    });

    it('deve retornar label correto para 3meses', () => {
      expect(obterLabelPeriodo('3meses')).toBe('Últimos 3 meses');
    });

    it('deve retornar label correto para todos', () => {
      expect(obterLabelPeriodo('todos')).toBe('Todos os períodos');
    });
  });

  describe('gerarResumo', () => {
    it('deve gerar resumo com dados corretos', () => {
      const resumo = gerarResumo(avaliacoes);
      expect(resumo.total).toBe(4);
      expect(resumo.media).toBeGreaterThan(0);
      expect(resumo.distribuicao[1]).toBeGreaterThanOrEqual(0);
      expect(resumo.distribuicao[5]).toBeGreaterThanOrEqual(0);
    });

    it('deve retornar resumo vazio para array vazio', () => {
      const resumo = gerarResumo([]);
      expect(resumo.total).toBe(0);
      expect(resumo.media).toBe(0);
      expect(resumo.distribuicao[1]).toBe(0);
    });

    it('deve calcular média corretamente', () => {
      const resumo = gerarResumo([avaliacoes[0]]);
      expect(resumo.media).toBe(4.5);
    });

    it('deve contar distribuição de estrelas corretamente', () => {
      const resumo = gerarResumo(avaliacoes);
      const totalEstrelas = Object.values(resumo.distribuicao).reduce((a, b) => a + b, 0);
      expect(totalEstrelas).toBe(4);
    });
  });
});
