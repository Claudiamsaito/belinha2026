import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import * as Haptics from "expo-haptics";

interface StarRatingProps {
  value: number;          // 0–5 (pode ser decimal para exibição)
  onChange?: (value: number) => void; // se undefined, modo somente leitura
  size?: number;
  color?: string;
  showValue?: boolean;
  label?: string;
}

export function StarRating({
  value,
  onChange,
  size = 28,
  color = "#F59E0B",
  showValue = false,
  label,
}: StarRatingProps) {
  const readOnly = !onChange;

  const handlePress = (star: number) => {
    if (readOnly) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange!(star);
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = value >= star;
          const half = !filled && value >= star - 0.5;
          return (
            <Pressable
              key={star}
              onPress={() => handlePress(star)}
              disabled={readOnly}
              style={({ pressed }) => [
                styles.starBtn,
                { width: size + 8, height: size + 8 },
                !readOnly && pressed && { transform: [{ scale: 1.2 }] },
              ]}
            >
              <Text
                style={[
                  styles.star,
                  {
                    fontSize: size,
                    color: filled || half ? color : "#D1D5DB",
                    lineHeight: size * 1.2,
                  },
                ]}
              >
                {filled ? "★" : half ? "⯨" : "☆"}
              </Text>
            </Pressable>
          );
        })}
        {showValue && value > 0 && (
          <Text style={[styles.valueText, { color }]}>
            {value.toFixed(1)}
          </Text>
        )}
      </View>
    </View>
  );
}

// Barra de distribuição de estrelas (ex: histograma de avaliações)
interface DistribuicaoBarProps {
  distribuicao: Record<1 | 2 | 3 | 4 | 5, number>;
  total: number;
}

export function DistribuicaoBar({ distribuicao, total }: DistribuicaoBarProps) {
  return (
    <View style={styles.distContainer}>
      {([5, 4, 3, 2, 1] as const).map((star) => {
        const count = distribuicao[star] ?? 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <View key={star} style={styles.distRow}>
            <Text style={styles.distLabel}>{star}★</Text>
            <View style={styles.distBarBg}>
              <View
                style={[
                  styles.distBarFill,
                  { width: `${pct}%` as any },
                  star >= 4
                    ? { backgroundColor: "#22C55E" }
                    : star === 3
                    ? { backgroundColor: "#F59E0B" }
                    : { backgroundColor: "#EF4444" },
                ]}
              />
            </View>
            <Text style={styles.distCount}>{count}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#546E7A",
    marginBottom: 2,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  starBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    textAlign: "center",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 6,
  },
  distContainer: {
    gap: 6,
  },
  distRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  distLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#546E7A",
    width: 24,
    textAlign: "right",
  },
  distBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 5,
    overflow: "hidden",
  },
  distBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  distCount: {
    fontSize: 11,
    color: "#90A4AE",
    width: 20,
    textAlign: "right",
  },
});
