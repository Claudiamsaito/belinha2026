import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { SantaCasaHeader } from "@/components/santa-casa-header";
import { Belinha } from "@/components/belinha";
import { ProgressBar } from "@/components/progress-bar";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const PASSOS = [
  {
    emoji: "🗺️",
    titulo: "Conheça nossa rede",
    descricao: "Veja todas as unidades da Santa Casa em Ilhabela onde você pode avaliar.",
    cor: "#E3F2FD",
    corBorda: "#90CAF9",
    corTexto: "#1565C0",
  },
  {
    emoji: "📋",
    titulo: "Escolha seu caminho",
    descricao: "QR Code, formulário impresso ou WhatsApp — você decide como avaliar!",
    cor: "#E8F5E9",
    corBorda: "#A5D6A7",
    corTexto: "#2E7D32",
  },
  {
    emoji: "✅",
    titulo: "Responda o questionário",
    descricao: "São poucas perguntas rápidas sobre o atendimento que você recebeu.",
    cor: "#FFF8E1",
    corBorda: "#FFE082",
    corTexto: "#F57F17",
  },
  {
    emoji: "🏆",
    titulo: "Ganhe seu Selo!",
    descricao: "Ao concluir, você recebe o Selo de Amigo da Saúde de Ilhabela.",
    cor: "#FCE4EC",
    corBorda: "#F48FB1",
    corTexto: "#C62828",
  },
];

export default function InstrucoesScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/mapa" as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <SantaCasaHeader compact />
      <ProgressBar current={1} total={6} label="Como funciona a Missão" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Belinha com mensagem */}
          <View style={styles.belinhaSection}>
            <Belinha
              message="Antes de começarmos, deixa eu te explicar como funciona nossa Missão Saúde! É simples, rápido e muito importante para melhorar o atendimento de toda a ilha! 🌟"
              size="medium"
            />
          </View>

          {/* Título */}
          <Text style={styles.title}>Como funciona?</Text>
          <Text style={styles.subtitle}>
            Em apenas 4 passos simples, você ajuda a transformar a saúde de Ilhabela:
          </Text>

          {/* Passos */}
          <View style={styles.passosContainer}>
            {PASSOS.map((passo, index) => (
              <View
                key={index}
                style={[
                  styles.passoCard,
                  { backgroundColor: passo.cor, borderColor: passo.corBorda },
                ]}
              >
                <View style={styles.passoNumeroContainer}>
                  <View style={[styles.passoNumero, { backgroundColor: passo.corTexto }]}>
                    <Text style={styles.passoNumeroText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.passoEmoji}>{passo.emoji}</Text>
                </View>
                <View style={styles.passoInfo}>
                  <Text style={[styles.passoTitulo, { color: passo.corTexto }]}>
                    {passo.titulo}
                  </Text>
                  <Text style={styles.passoDescricao}>{passo.descricao}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Bloco de destaque: por que é importante */}
          <View style={styles.importanciaCard}>
            <Text style={styles.importanciaEmoji}>💡</Text>
            <View style={styles.importanciaInfo}>
              <Text style={styles.importanciaTitulo}>Por que isso importa?</Text>
              <Text style={styles.importanciaTexto}>
                Cada resposta vai direto para a equipe da Santa Casa. Com base nas suas
                avaliações, melhoramos o atendimento, a limpeza, a estrutura e muito mais —
                para você e para toda a comunidade de Ilhabela!
              </Text>
            </View>
          </View>

          {/* Bloco de garantias */}
          <View style={styles.garantiasCard}>
            <Text style={styles.garantiasTitulo}>🔒 Suas garantias:</Text>
            <View style={styles.garantiaItem}>
              <Text style={styles.garantiaCheck}>✓</Text>
              <Text style={styles.garantiaTexto}>
                <Text style={styles.bold}>Anônimo</Text> — ninguém saberá quem respondeu
              </Text>
            </View>
            <View style={styles.garantiaItem}>
              <Text style={styles.garantiaCheck}>✓</Text>
              <Text style={styles.garantiaTexto}>
                <Text style={styles.bold}>Rápido</Text> — menos de 2 minutos para completar
              </Text>
            </View>
            <View style={styles.garantiaItem}>
              <Text style={styles.garantiaCheck}>✓</Text>
              <Text style={styles.garantiaTexto}>
                <Text style={styles.bold}>Seguro</Text> — dados protegidos pela Santa Casa
              </Text>
            </View>
            <View style={styles.garantiaItem}>
              <Text style={styles.garantiaCheck}>✓</Text>
              <Text style={styles.garantiaTexto}>
                <Text style={styles.bold}>Gratuito</Text> — sem custo algum para você
              </Text>
            </View>
          </View>

          {/* Botão iniciar */}
          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleStart}
          >
            <Text style={styles.startButtonText}>🚀 Entendi! Vamos começar</Text>
          </Pressable>

          <Text style={styles.footerText}>
            Sua opinião é o remédio que a saúde de Ilhabela precisa! 💚
          </Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B2631",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#546E7A",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  passosContainer: {
    gap: 10,
  },
  passoCard: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1.5,
  },
  passoNumeroContainer: {
    alignItems: "center",
    gap: 4,
  },
  passoNumero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  passoNumeroText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  passoEmoji: {
    fontSize: 22,
  },
  passoInfo: {
    flex: 1,
    gap: 3,
  },
  passoTitulo: {
    fontSize: 15,
    fontWeight: "800",
  },
  passoDescricao: {
    fontSize: 13,
    color: "#546E7A",
    lineHeight: 19,
  },
  importanciaCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  importanciaEmoji: {
    fontSize: 28,
    marginTop: 2,
  },
  importanciaInfo: {
    flex: 1,
    gap: 6,
  },
  importanciaTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2E7D32",
  },
  importanciaTexto: {
    fontSize: 13,
    color: "#37474F",
    lineHeight: 20,
  },
  garantiasCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  garantiasTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1B2631",
    marginBottom: 2,
  },
  garantiaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  garantiaCheck: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2E7D32",
    marginTop: 1,
  },
  garantiaTexto: {
    fontSize: 14,
    color: "#37474F",
    flex: 1,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "700",
    color: "#1B2631",
  },
  startButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 4,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  footerText: {
    fontSize: 13,
    color: "#78909C",
    textAlign: "center",
    fontStyle: "italic",
    paddingBottom: 8,
  },
});
