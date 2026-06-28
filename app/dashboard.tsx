'use client';

import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { SantaCasaHeader } from '@/components/santa-casa-header';
import { useColors } from '@/hooks/use-colors';
import { UNIDADES } from '@/components/unidades-map';
import { verificarAutenticacao, logout, obterEstadoAuth } from '@/lib/admin-auth-store';
import {
  obterDashboardBackend,
  registrarAuditoriaBackend,
  getExcelDownloadUrl,
} from '@/lib/api';

type PeriodoFiltro = '7dias' | '30dias' | '3meses' | 'todos';

const LABEL_PERIODO: Record<PeriodoFiltro, string> = {
  '7dias': '7 dias',
  '30dias': '30 dias',
  '3meses': '3 meses',
  'todos': 'Todos',
};

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [nomeAdmin, setNomeAdmin] = useState('');
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('30dias');
  const [dashData, setDashData] = useState<any>(null);

  useEffect(() => {
    inicializar();
  }, []);

  useEffect(() => {
    if (autenticado) carregarDados();
  }, [periodo, autenticado]);

  const inicializar = async () => {
    setCarregando(true);
    try {
      const ok = await verificarAutenticacao();
      if (!ok) {
        router.replace('/admin-login');
        return;
      }
      const estado = await obterEstadoAuth();
      setNomeAdmin(estado.username || 'Administrador');
      setAutenticado(true);
    } catch {
      router.replace('/admin-login');
    } finally {
      setCarregando(false);
    }
  };

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const data = await obterDashboardBackend(periodo === 'todos' ? undefined : periodo);
      setDashData(data);
    } catch (e: any) {
      Alert.alert('Erro', `Não foi possível carregar dados.\n${e?.message || ''}`);
    } finally {
      setCarregando(false);
    }
  }, [periodo]);

  const handleExportarExcel = async () => {
    const url = getExcelDownloadUrl(periodo === 'todos' ? undefined : periodo);
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      await Linking.openURL(url);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair do Dashboard', 'Tem certeza que deseja fazer logout?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await registrarAuditoriaBackend('LOGOUT', 'Logout do dashboard');
          await logout();
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  const obterCorMedia = (media: number): string => {
    if (media >= 4.5) return '#22C55E';
    if (media >= 3.5) return '#EAB308';
    if (media >= 2.5) return '#F97316';
    return '#EF4444';
  };

  const obterEmoji = (media: number): string => {
    if (media >= 4.5) return '😊';
    if (media >= 3.5) return '😐';
    if (media >= 2.5) return '😕';
    return '😞';
  };

  const nomeUnidade = (id: string) =>
    UNIDADES.find((u) => u.id === id)?.nome || id;

  if (carregando && !dashData) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!autenticado) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const resumo = dashData?.resumo || { total_avaliacoes: 0, unidades_avaliadas: 0, media_geral: 0 };
  const statsPorUnidade: Record<string, any> = dashData?.stats_por_unidade || {};
  const unidadesComDados = Object.entries(statsPorUnidade).filter(
    ([, s]: any) => s.total_avaliacoes > 0
  );

  return (
    <ScreenContainer className="p-0">
      <SantaCasaHeader />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4 gap-4">

          {/* Cabeçalho */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.foreground }}>
                📊 Dashboard
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                Conectado como <Text style={{ fontWeight: '600' }}>{nomeAdmin}</Text>
              </Text>
            </View>
            <View style={styles.headerBtns}>
              <Pressable
                onPress={() => router.push('/advanced-reports')}
                style={[styles.iconBtn, { backgroundColor: '#E0F2FE' }]}
              >
                <Text>📈</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/admin-settings')}
                style={[styles.iconBtn, { backgroundColor: '#E0F2FE' }]}
              >
                <Text>⚙️</Text>
              </Pressable>
              <Pressable onPress={handleLogout} style={[styles.iconBtn, { backgroundColor: '#FEE2E2' }]}>
                <Text>🚪</Text>
              </Pressable>
            </View>
          </View>

          {/* Filtros de período */}
          <View style={[styles.filtrosBox, { borderColor: '#E0F2FE' }]}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
              Filtrar por período:
            </Text>
            <View style={styles.periodoRow}>
              {(['7dias', '30dias', '3meses', 'todos'] as const).map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPeriodo(p)}
                  style={[
                    styles.periodoBotao,
                    {
                      backgroundColor: periodo === p ? colors.primary : colors.surface,
                      borderColor: periodo === p ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: periodo === p ? '#FFF' : colors.foreground }}>
                    {LABEL_PERIODO[p]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {carregando ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 24 }} />
          ) : resumo.total_avaliacoes === 0 ? (
            <View style={[styles.vazioBox, { backgroundColor: colors.surface }]}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>📭</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                Sem dados no período
              </Text>
              <Text style={{ fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 4 }}>
                Nenhuma avaliação registrada em "{LABEL_PERIODO[periodo]}"
              </Text>
            </View>
          ) : (
            <>
              {/* Cards de resumo */}
              <View style={styles.resumoRow}>
                <View style={[styles.resumoCard, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={styles.resumoNum}>{resumo.unidades_avaliadas}</Text>
                  <Text style={styles.resumoLabel}>Unidades avaliadas</Text>
                </View>
                <View style={[styles.resumoCard, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={styles.resumoNum}>{resumo.total_avaliacoes}</Text>
                  <Text style={styles.resumoLabel}>Total avaliações</Text>
                </View>
                <View style={[styles.resumoCard, { backgroundColor: '#FEF9C3' }]}>
                  <Text style={[styles.resumoNum, { color: obterCorMedia(resumo.media_geral) }]}>
                    {resumo.media_geral?.toFixed(1) || '0.0'}
                  </Text>
                  <Text style={styles.resumoLabel}>Média geral</Text>
                </View>
              </View>

              {/* Cards por unidade */}
              {unidadesComDados.map(([unidadeId, stats]: any) => (
                <Pressable
                  key={unidadeId}
                  onPress={() => router.push({ pathname: '/avaliacao', params: { unidadeId } })}
                  style={({ pressed }) => [
                    { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 8, opacity: pressed ? 0.75 : 1 },
                  ]}
                >
                  <View style={{ gap: 10 }}>
                    {/* Nome + emoji */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground, flex: 1 }}>
                        {nomeUnidade(unidadeId)}
                      </Text>
                      <Text style={{ fontSize: 22 }}>{obterEmoji(stats.media_geral)}</Text>
                    </View>

                    {/* Média + total */}
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                      <Text style={{ fontSize: 28, fontWeight: '700', color: obterCorMedia(stats.media_geral) }}>
                        {stats.media_geral?.toFixed(1) || '0.0'}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.muted }}>
                        {stats.total_avaliacoes} avaliações
                      </Text>
                    </View>

                    {/* Barra de progresso da média */}
                    <View style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                      <View
                        style={{
                          height: 6,
                          width: `${(stats.media_geral / 5) * 100}%` as any,
                          backgroundColor: obterCorMedia(stats.media_geral),
                          borderRadius: 3,
                        }}
                      />
                    </View>

                    {/* Categorias */}
                    <View style={{ gap: 6 }}>
                      {[
                        ['🤝 Atendimento', stats.media_categorias?.atendimento],
                        ['⏱️ Tempo de Espera', stats.media_categorias?.tempo_espera],
                        ['🧹 Limpeza', stats.media_categorias?.limpeza],
                        ['🏗️ Estrutura', stats.media_categorias?.estrutura],
                      ].map(([label, val]: any) => val > 0 && (
                        <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: 12, color: colors.muted }}>{label}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <View style={{ width: 60, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
                              <View style={{ height: 4, width: `${(val / 5) * 100}%` as any, backgroundColor: obterCorMedia(val), borderRadius: 2 }} />
                            </View>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.foreground, width: 28 }}>
                              {val?.toFixed(1)}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </Pressable>
              ))}

              {/* Botões de ação */}
              <View style={{ gap: 8, marginTop: 8 }}>
                <Pressable
                  onPress={carregarDados}
                  style={({ pressed }) => [styles.botaoAcao, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}
                >
                  <Text style={styles.botaoAcaoText}>🔄 Atualizar Dados</Text>
                </Pressable>

                <Pressable
                  onPress={handleExportarExcel}
                  style={({ pressed }) => [styles.botaoAcao, { backgroundColor: '#10B981', opacity: pressed ? 0.8 : 1 }]}
                >
                  <Text style={styles.botaoAcaoText}>📥 Exportar Excel</Text>
                </Pressable>

                <Pressable
                  onPress={async () => {
                    await registrarAuditoriaBackend('LOGOUT', 'Logout via botão Voltar');
                    await logout();
                    router.push('/welcome');
                  }}
                  style={({ pressed }) => [styles.botaoAcao, { backgroundColor: '#EF4444', opacity: pressed ? 0.8 : 1 }]}
                >
                  <Text style={styles.botaoAcaoText}>← Voltar à Página Inicial</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerBtns: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  filtrosBox: { backgroundColor: '#F0F9FF', borderRadius: 12, padding: 12, borderWidth: 1 },
  periodoRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  periodoBotao: {
    borderWidth: 1.5, borderRadius: 8,
    paddingVertical: 8, paddingHorizontal: 12,
    flex: 1, minWidth: '48%', alignItems: 'center',
  },
  vazioBox: { borderRadius: 12, padding: 32, alignItems: 'center' },
  resumoRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  resumoCard: { flex: 1, minWidth: '31%', borderRadius: 12, padding: 12, alignItems: 'center', gap: 4 },
  resumoNum: { fontSize: 30, fontWeight: '700' },
  resumoLabel: { fontSize: 11, color: '#687076', textAlign: 'center' },
  botaoAcao: { borderRadius: 12, padding: 16, alignItems: 'center' },
  botaoAcaoText: { fontSize: 15, fontWeight: '600', color: 'white' },
});
