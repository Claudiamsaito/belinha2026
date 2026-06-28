import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

/**
 * GET /api/dashboard/stats
 * Retorna estatísticas do dashboard para sincronização em tempo real
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Aqui você buscaria dados do banco de dados
    // Por enquanto, retornamos dados simulados
    const stats = {
      totalAvaliacoes: 156,
      mediaGeral: 4.7,
      unidadesAvaliadas: 8,
      ultimaAtualizacao: new Date().toISOString(),
      periodo: {
        inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        fim: new Date().toISOString(),
      },
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
  }
});

/**
 * GET /api/dashboard/units
 * Retorna dados de avaliações por unidade
 */
router.get('/units', async (req: Request, res: Response) => {
  try {
    const unidades = [
      {
        id: '1',
        nome: 'Santa Casa — Sede / Administração',
        media: 5.0,
        avaliacoes: 45,
        categorias: {
          atendimento: 5.0,
          tempoEspera: 4.9,
          limpeza: 5.0,
          estrutura: 5.0,
        },
      },
      {
        id: '2',
        nome: 'Pronto Atendimento',
        media: 4.8,
        avaliacoes: 38,
        categorias: {
          atendimento: 4.7,
          tempoEspera: 4.6,
          limpeza: 4.9,
          estrutura: 4.8,
        },
      },
      {
        id: '3',
        nome: 'Internação',
        media: 4.6,
        avaliacoes: 32,
        categorias: {
          atendimento: 4.7,
          tempoEspera: 4.5,
          limpeza: 4.6,
          estrutura: 4.5,
        },
      },
      {
        id: '4',
        nome: 'UTI',
        media: 4.5,
        avaliacoes: 28,
        categorias: {
          atendimento: 4.6,
          tempoEspera: 4.4,
          limpeza: 4.5,
          estrutura: 4.4,
        },
      },
      {
        id: '5',
        nome: 'Farmácia',
        media: 4.9,
        avaliacoes: 13,
        categorias: {
          atendimento: 4.9,
          tempoEspera: 4.8,
          limpeza: 5.0,
          estrutura: 4.9,
        },
      },
    ];

    res.json(unidades);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    res.status(500).json({ erro: 'Erro ao buscar unidades' });
  }
});

/**
 * GET /api/dashboard/trends
 * Retorna tendências de avaliações ao longo do tempo
 */
router.get('/trends', async (req: Request, res: Response) => {
  try {
    const tendencias = [];
    const agora = new Date();

    // Gerar dados de tendências dos últimos 30 dias
    for (let i = 29; i >= 0; i--) {
      const data = new Date(agora);
      data.setDate(data.getDate() - i);

      tendencias.push({
        data: data.toISOString().split('T')[0],
        media: 4.5 + Math.random() * 0.5,
        total: Math.floor(Math.random() * 10) + 3,
      });
    }

    res.json(tendencias);
  } catch (error) {
    console.error('Erro ao buscar tendências:', error);
    res.status(500).json({ erro: 'Erro ao buscar tendências' });
  }
});

/**
 * GET /api/dashboard/export
 * Retorna dados para exportação (PDF, Excel, CSV)
 */
router.get('/export', async (req: Request, res: Response) => {
  try {
    const formato = req.query.formato as string || 'json';

    const dados = {
      titulo: 'Relatório de Avaliações - Santa Casa Ilhabela',
      periodo: {
        inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fim: new Date().toISOString().split('T')[0],
      },
      totalAvaliacoes: 156,
      mediaGeral: 4.7,
      unidadesAvaliadas: 8,
      geradoEm: new Date().toISOString(),
    };

    if (formato === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="relatorio.csv"');
      // Gerar CSV
      const csv = 'Título,Período Início,Período Fim,Total,Média\n' +
        `${dados.titulo},${dados.periodo.inicio},${dados.periodo.fim},${dados.totalAvaliacoes},${dados.mediaGeral}`;
      res.send(csv);
    } else {
      res.json(dados);
    }
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    res.status(500).json({ erro: 'Erro ao exportar dados' });
  }
});

export default router;
