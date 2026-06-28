'use client';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { SantaCasaHeader } from '@/components/santa-casa-header';
import { useColors } from '@/hooks/use-colors';
import { obterLogs, exportarLogsCSV, type AuditLog } from '@/lib/admin-audit-store';

export default function AdminAuditLogsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroAcao, setFiltroAcao] = useState<AuditLog['action'] | 'TODAS'>('TODAS');

  useEffect(() => {
    carregarLogs();
  }, []);

  const carregarLogs = async () => {
    try {
      setCarregando(true);
      const todosOsLogs = await obterLogs();
      setLogs(todosOsLogs.reverse()); // Mais recentes primeiro
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setCarregando(false);
    }
  };

  const logsFiltrados = filtroAcao === 'TODAS' ? logs : logs.filter((log) => log.action === filtroAcao);

  const obterCorAcao = (acao: AuditLog['action']): string => {
    switch (acao) {
      case 'LOGIN':
        return '#22C55E';
      case 'LOGOUT':
        return '#F59E0B';
      case 'EXPORT_DATA':
        return '#3B82F6';
      case 'VIEW_DASHBOARD':
        return '#8B5CF6';
      case 'CHANGE_PASSWORD':
        return '#EC4899';
      case 'VIEW_REPORTS':
        return '#06B6D4';
      default:
        return '#6B7280';
    }
  };

  const obterIconeAcao = (acao: AuditLog['action']): string => {
    switch (acao) {
      case 'LOGIN':
        return '🔓';
      case 'LOGOUT':
        return '🔒';
      case 'EXPORT_DATA':
        return '📥';
      case 'VIEW_DASHBOARD':
        return '📊';
      case 'CHANGE_PASSWORD':
        return '🔐';
      case 'VIEW_REPORTS':
        return '📈';
      default:
        return '📝';
    }
  };

  const handleExportarLogs = async () => {
    try {
      const csv = await exportarLogsCSV();
      // Em produção, aqui seria feito download do arquivo
      console.log('Logs exportados em CSV');
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
    }
  };

  const renderLogItem = ({ item }: { item: AuditLog }) => (
    <View
      style={[
        styles.logItem,
        {
          backgroundColor: colors.surface,
          borderLeftColor: obterCorAcao(item.action),
        },
      ]}
    >
      <View style={styles.logHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 20 }}>{obterIconeAcao(item.action)}</Text>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.foreground,
              }}
            >
              {item.action}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {item.username}
            </Text>
          </View>
        </View>
      </View>

      <Text style={{ fontSize: 13, color: colors.foreground, marginVertical: 8 }}>
        {item.details}
      </Text>

      <Text style={{ fontSize: 11, color: colors.muted }}>
        {new Date(item.timestamp).toLocaleString('pt-BR')}
      </Text>
    </View>
  );

  if (carregando) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <SantaCasaHeader />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4 gap-4">
          {/* Cabeçalho */}
          <View style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.foreground,
              }}
            >
              📋 Auditoria de Acesso
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
              Total de registros: <Text style={{ fontWeight: '600' }}>{logs.length}</Text>
            </Text>
          </View>

          {/* Filtros de ação */}
          <View style={styles.filtrosContainer}>
            <Pressable
              onPress={() => setFiltroAcao('TODAS')}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    filtroAcao === 'TODAS' ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: filtroAcao === 'TODAS' ? 'white' : colors.foreground,
                  fontWeight: '600',
                  fontSize: 12,
                }}
              >
                Todas
              </Text>
            </Pressable>

            {(['LOGIN', 'LOGOUT', 'EXPORT_DATA', 'CHANGE_PASSWORD'] as const).map(
              (acao) => (
                <Pressable
                  key={acao}
                  onPress={() => setFiltroAcao(acao)}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor:
                        filtroAcao === acao ? obterCorAcao(acao) : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: filtroAcao === acao ? 'white' : colors.foreground,
                      fontWeight: '600',
                      fontSize: 12,
                    }}
                  >
                    {acao}
                  </Text>
                </Pressable>
              )
            )}
          </View>

          {/* Lista de logs */}
          {logsFiltrados.length > 0 ? (
            <FlatList
              data={logsFiltrados}
              renderItem={renderLogItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 32,
              }}
            >
              <Text style={{ fontSize: 16, color: colors.muted }}>
                Nenhum log encontrado
              </Text>
            </View>
          )}

          {/* Botões de ação */}
          <View style={{ gap: 8, marginTop: 16 }}>
            <Pressable
              onPress={handleExportarLogs}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: '#3B82F6',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={styles.buttonText}>📥 Exportar Logs (CSV)</Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.buttonSecondary,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonSecondaryText,
                  { color: colors.primary },
                ]}
              >
                ← Voltar
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filtrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logItem: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  buttonSecondary: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
