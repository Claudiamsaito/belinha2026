import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColors } from '@/hooks/use-colors';

interface TrendData {
  data: string;
  media: number;
  total: number;
}

interface LineChartTrendsProps {
  data: TrendData[];
  title?: string;
  height?: number;
}

export function LineChartTrends({ data, title = 'Tendência de Avaliações', height = 250 }: LineChartTrendsProps) {
  const colors = useColors();

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.emptyText, { color: colors.muted }]}>Sem dados disponíveis</Text>
      </View>
    );
  }

  // Preparar dados para o gráfico (últimos 14 dias)
  const ultimosDias = data.slice(-14);
  const labels = ultimosDias.map(d => {
    const date = new Date(d.data);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  const valores = ultimosDias.map(d => d.media);

  const chartData = {
    labels,
    datasets: [
      {
        data: valores,
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
        <LineChart
          data={chartData}
          width={320}
          height={height}
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
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: colors.primary,
            },
            propsForBackgroundLines: {
              strokeDasharray: '0',
              stroke: colors.border,
              strokeOpacity: 0.5,
            },
          }}
          bezier
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
