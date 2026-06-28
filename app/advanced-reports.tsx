import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { SantaCasaHeader } from '@/components/santa-casa-header';
import { LineChartTrends } from '@/components/charts/line-chart-trends';
import { BarChartUnits } from '@/components/charts/bar-chart-units';
import { useColors } from '@/hooks/use-colors';
import { carregarAvaliacoes, type Avaliacao } from '@/lib/avaliacoes-store';
import { obterTodasAvaliacoesBackend } from '@/lib/api';
import { UNIDADES } from '@/components/unidades-map';
import {
  gerarRelatorioCompleto,
  type RelatorioCompleto,
} from '@/lib/advanced-reports-utils';
import {
  gerarHTMLRelatorio,
  gerarCSVTendencias,
  gerarCSVCategorias,
  gerarCSVRanking,
  gerarNomeArquivo,
} from '@/lib/pdf-export-utils';
import { registrarAuditoria } from '@/lib/admin-audit-store';

export default function AdvancedReportsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [carregando, setCarregando] = useState(true);
  const [relatorio, setRelatorio] = useState<RelatorioCompleto | null>(null);
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    carregarRelatorio();
  }, []);

  function backendParaAvaliacao(av: any): Avaliacao {
    const tempoEspera = Math.round((av.tempo_espera_recepcao + av.tempo_espera_consulta) / 2);
    const nota = parseFloat(
      ((av.atendimento_recepcao + av.tempo_espera_recepcao + av.tempo_espera_consulta + av.infraestrutura) / 4).toFixed(2)
    );
    return {
      id: String(av.id),
      unidadeId: av.unidade_id,
      nota,
      categorias: {
        atendimento: av.atendimento_recepcao,
        limpeza: av.infraestrutura,
        tempoEspera,
        estrutura: av.infraestrutura,
      },
      comentario: av.comentario || '',
      data: av.created_at,
    };
  }

  const carregarRelatorio = async () => {
    try {
      setCarregando(true);

      let avaliacoes: Avaliacao[];
      try {
        const dadosBackend = await obterTodasAvaliacoesBackend();
        avaliacoes = dadosBackend.map(backendParaAvaliacao);
      } catch {
        avaliacoes = await carregarAvaliacoes();
      }

      const agora = new Date();
      const trinta = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
      const periodoInicioStr = trinta.toISOString().split('T')[0];
      const periodoFimStr = agora.toISOString().split('T')[0];

      setPeriodoInicio(periodoInicioStr);
      setPeriodoFim(periodoFimStr);

      const relatorioGerado = gerarRelatorioCompleto(
        avaliacoes,
        UNIDADES,
        periodoInicioStr,
        periodoFimStr
      );

      setRelatorio(relatorioGerado);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      Alert.alert('Erro', 'Não foi possível carregar o relatório');
    } finally {
      setCarregando(false);
    }
  };

  const exportarPDF = async () => {
    if (!relatorio) return;

    try {
      setExportando(true);
      const html = gerarHTMLRelatorio(relatorio);
      const nomeArquivo = gerarNomeArquivo('pdf');

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(html);
          win.document.close();
          win.print();
        } else {
          // fallback: download como HTML se popup bloqueado
          const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = nomeArquivo.replace('.pdf', '.html');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      } else {
        await Share.share({ message: html, title: nomeArquivo });
      }

      await registrarAuditoria('admin', 'export_pdf', `Relatório ${relatorio.periodoInicio} a ${relatorio.periodoFim}`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      Alert.alert('Erro', 'Não foi possível exportar o PDF');
    } finally {
      setExportando(false);
    }
  };

  const exportarCSV = async (tipo: 'tendencias' | 'categorias' | 'ranking') => {
    if (!relatorio) return;

    try {
      setExportando(true);
      let csv = '';
      let nomeArquivo = '';

      if (tipo === 'tendencias') {
        csv = gerarCSVTendencias(relatorio);
        nomeArquivo = `tendencias-${gerarNomeArquivo('csv')}`;
      } else if (tipo === 'categorias') {
        csv = gerarCSVCategorias(relatorio);
        nomeArquivo = `categorias-${gerarNomeArquivo('csv')}`;
      } else {
        csv = gerarCSVRanking(relatorio);
        nomeArquivo = `ranking-${gerarNomeArquivo('csv')}`;
      }

      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        await Share.share({ message: csv, title: nomeArquivo });
      }

      await registrarAuditoria('admin', 'export_csv', `${tipo} - ${relatorio.periodoInicio} a ${relatorio.periodoFim}`);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      Alert.alert('Erro', 'Não foi possível exportar o CSV');
    } finally {
      setExportando(false);
    }
  };

  if (carregando) {
    return (
      <ScreenContainer>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.foreground, marginTop: 16 }]}>
            Carregando relatório...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!relatorio) {
    return (
      <ScreenContainer>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            Nenhum dado disponível
          </Text>
          <Pressable
            onPress={carregarRelatorio}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>Tentar Novamente</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SantaCasaHeader />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Título */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>📊 Relatórios Avançados</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Período: {relatorio.periodoInicio} a {relatorio.periodoFim}
            </Text>
          </View>

          {/* Cards de Estatísticas */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Total</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {relatorio.totalAvaliacoes}
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.success }]}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Média</Text>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {relatorio.mediaGeral.toFixed(2)}
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Unidades</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {relatorio.unidadesAvaliadas}
              </Text>
            </View>
          </View>

          {/* Gráfico de Tendências */}
          {relatorio.tendencias.length > 0 && (
            <LineChartTrends
              data={relatorio.tendencias}
              title="📈 Tendência de Avaliações"
              height={220}
            />
          )}

          {/* Gráfico de Unidades */}
          {relatorio.topUnidades.length > 0 && (
            <BarChartUnits
              data={relatorio.topUnidades.map(u => ({
                nome: u.nome,
                media: u.media,
                avaliacoes: 0,
              }))}
              title="📊 Avaliações por Unidade"
              height={220}
            />
          )}

          {/* Seção de Tendências */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>📈 Tendências (Tabela)</Text>
            <View style={[styles.dataTable, { backgroundColor: colors.surface }]}>
              {relatorio.tendencias.slice(-7).map((t, i) => (
                <View key={i} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 1 }]}>
                    {t.data}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.primary, textAlign: 'right' }]}>
                    {t.media.toFixed(2)} ⭐
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.muted, textAlign: 'right' }]}>
                    {t.total}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Seção de Categorias */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🎯 Por Categoria</Text>
            <View style={[styles.dataTable, { backgroundColor: colors.surface }]}>
              {relatorio.categorias.map((c, i) => (
                <View key={i} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 1 }]}>
                    {c.categoria}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.success, textAlign: 'right' }]}>
                    {c.media.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.muted, textAlign: 'right' }]}>
                    {c.total}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Top Unidades */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>⭐ Melhores Unidades</Text>
            <View style={[styles.dataTable, { backgroundColor: colors.surface }]}>
              {relatorio.topUnidades.map((u, i) => (
                <View key={i} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.tableCell, { color: colors.success, fontWeight: 'bold' }]}>
                    #{i + 1}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 1 }]}>
                    {u.nome}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.success, textAlign: 'right' }]}>
                    {u.media.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Piores Unidades */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>⚠️ Atenção Necessária</Text>
            <View style={[styles.dataTable, { backgroundColor: colors.surface }]}>
              {relatorio.pioresUnidades.map((u, i) => (
                <View key={i} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.tableCell, { color: colors.error, fontWeight: 'bold' }]}>
                    #{i + 1}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 1 }]}>
                    {u.nome}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.error, textAlign: 'right' }]}>
                    {u.media.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Botões de Exportação */}
          <View style={styles.exportSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>📥 Exportar Dados</Text>

            <Pressable
              onPress={exportarPDF}
              disabled={exportando}
              style={[
                styles.exportButton,
                { backgroundColor: colors.primary, opacity: exportando ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {exportando ? 'Exportando...' : '📄 Exportar Relatório em PDF'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => exportarCSV('tendencias')}
              disabled={exportando}
              style={[
                styles.exportButton,
                { backgroundColor: colors.success, opacity: exportando ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>
                📊 Exportar Tendências (CSV)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => exportarCSV('categorias')}
              disabled={exportando}
              style={[
                styles.exportButton,
                { backgroundColor: colors.warning, opacity: exportando ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>
                🎯 Exportar Categorias (CSV)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => exportarCSV('ranking')}
              disabled={exportando}
              style={[
                styles.exportButton,
                { backgroundColor: colors.primary, opacity: exportando ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                🏆 Exportar Ranking (CSV)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={[styles.exportButton, { backgroundColor: colors.error }]}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>← Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dataTable: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  tableCell: {
    fontSize: 13,
    flex: 1,
  },
  exportSection: {
    marginBottom: 24,
  },
  exportButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
