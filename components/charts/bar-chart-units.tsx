import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useColors } from '@/hooks/use-colors';

interface UnitData {
  nome: string;
  media: number;
  avaliacoes: number;
}

interface BarChartUnitsProps {
  data: UnitData[];
  title?: string;
  height?: number;
}

export function BarChartUnits({ data, title = 'Avaliações por Unidade', height = 250 }: BarChartUnitsProps) {
  const colors = useColors();

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.emptyText, { color: colors.muted }]}>Sem dados disponíveis</Text>
      </View>
    );
  }

  // Limitar a 6 unidades para melhor visualização
  const unidadesMostradas = data.slice(0, 6);
  const labels = unidadesMostradas.map(u => u.nome.substring(0, 12));
  const valores = unidadesMostradas.map(u => u.media);

  const chartData = {
    labels,
    datasets: [
      {
        data: valores,
        color: () => colors.primary,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
        <BarChart
          data={chartData}
          width={320}
          height={height}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: colors.surface,
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            decimalPlaces: 1,
            color: () => colors.border,
            labelColor: () => colors.muted,
            style: {
              borderRadius: 8,
            },
            barPercentage: 0.7,
            propsForBackgroundLines: {
              strokeDasharray: '0',
              stroke: colors.border,
              strokeOpacity: 0.5,
            },
          }}
          style={{
            borderRadius: 8,
          }}
        />
      </View>
      <View style={styles.legend}>
        <View style={[styles.legendItem, { borderLeftColor: colors.primary }]}>
          <Text style={[styles.legendLabel, { color: colors.muted }]}>Média de Avaliações</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chartContainer: {
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  legend: {
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    borderLeftWidth: 3,
  },
  legendLabel: {
    fontSize: 12,
    marginLeft: 8,
  },
});
