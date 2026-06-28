import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Belinha } from "@/components/belinha";
import { ProgressBar } from "@/components/progress-bar";
import { SantaCasaHeader } from "@/components/santa-casa-header";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const UNIDADES = [
  {
    categoria: "🏥 Atenção Básica (UBSs)",
    cor: "#2E7D32",
    corFundo: "#E8F5E9",
    unidades: [
      "UBS Costa Norte",
      "UBS Vila / Centro de Saúde III",
      "UBS Itaquanduba",
      "UBS Perequê",
      "UBS Barra Velha",
      "UBS Alto da Barra",
      "UBS Água Branca",
      "UBS Costa Sul",
    ],
  },
  {
    categoria: "🔬 Especialidades e Centros",
    cor: "#1565C0",
    corFundo: "#E3F2FD",
    unidades: [
      "CRE — Centro de Referência e Especialidade",
      "CEV — Centro de Especialidade Vila",
      "CEO — Centro de Especialidade Odontológica",
      "CERTEA — Reabilitação e Autismo",
      "CIAMA — Incentivo ao Aleitamento Materno",
      "Academia da Saúde",
    ],
  },
  {
    categoria: "🚑 Urgência e Diagnóstico",
    cor: "#C62828",
    corFundo: "#FFEBEE",
    unidades: [
      "PS — Pronto Socorro",
      "Maternidade",
      "SADT — Apoio Diagnóstico e Terapêutico",
    ],
  },
  {
    categoria: "🐾 Cuidado Animal",
    cor: "#6A1B9A",
    corFundo: "#F3E5F5",
    unidades: ["CRA — Centro de Referência Animal"],
  },
];

export default function MapaScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/caminhos" as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <SantaCasaHeader compact />
      <ProgressBar current={2} total={6} label="Passo 2 de 6 — Conheça nossa rede" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Belinha */}
          <View style={styles.belinhaSection}>
            <Belinha
              message="Oi de novo! Antes de começarmos, deixa eu te mostrar o tamanho do nosso coração! A Santa Casa cuida de Ilhabela em TODOS esses pontos. Sua opinião vale em qualquer um deles! 🗺️"
              size="medium"
            />
          </View>

          <Text style={styles.title}>🗺️ Mapa da Saúde de Ilhabela</Text>
          <Text style={styles.subtitle}>
            Sua avaliação é vital em qualquer um destes pontos de atendimento:
          </Text>

          {UNIDADES.map((grupo, idx) => (
            <View
              key={idx}
              style={[styles.categoriaCard, { borderLeftColor: grupo.cor }]}
            >
              <View style={[styles.categoriaHeader, { backgroundColor: grupo.corFundo }]}>
                <Text style={[styles.categoriaTitle, { color: grupo.cor }]}>
                  {grupo.categoria}
                </Text>
              </View>
              <View style={styles.unidadesList}>
                {grupo.unidades.map((u, i) => (
                  <View key={i} style={styles.unidadeItem}>
                    <View style={[styles.dot, { backgroundColor: grupo.cor }]} />
                    <Text style={styles.unidadeText}>{u}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              "Para que a gente continue cuidando de você, da sua família e até do seu bichinho de estimação com excelência, eu preciso que você complete o{" "}
              <Text style={styles.bold}>Ciclo da Melhoria</Text>. Vamos lá?" 💚
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continuar a Missão →</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
    paddingHorizontal: 16,
    gap: 16,
  },
  belinhaSection: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1B2631",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#546E7A",
    textAlign: "center",
    lineHeight: 21,
  },
  categoriaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  categoriaHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoriaTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  unidadesList: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  unidadeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  unidadeText: {
    fontSize: 13,
    color: "#1B2631",
    lineHeight: 20,
    flex: 1,
  },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#1B2631",
    fontStyle: "italic",
    textAlign: "center",
  },
  bold: {
    fontWeight: "700",
    fontStyle: "normal",
    color: "#2E7D32",
  },
  continueButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
