import React from "react";
import { View, Image, StyleSheet } from "react-native";

const SANTA_CASA_LOGO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663403414321/FrJTcCtZDHKP3Yh8CCXrvy/logopng_0e29452f.png";

interface SantaCasaHeaderProps {
  compact?: boolean;
}

/**
 * Cabeçalho padrão com o logo da Santa Casa de Ilhabela.
 * Usar em todas as telas para manter identidade visual consistente.
 */
export function SantaCasaHeader({ compact = false }: SantaCasaHeaderProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <Image
        source={{ uri: SANTA_CASA_LOGO }}
        style={[styles.logo, compact && styles.logoCompact]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F5E9",
    backgroundColor: "#FFFFFF",
  },
  containerCompact: {
    paddingTop: 10,
    paddingBottom: 6,
  },
  logo: {
    width: 220,
    height: 60,
  },
  logoCompact: {
    width: 180,
    height: 48,
  },
});
