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
import { Belinha } from "@/components/belinha";
import { ProgressBar } from "@/components/progress-bar";
import { SantaCasaHeader } from "@/components/santa-casa-header";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const CAMINHOS = [
  {
    id: "qrcode",
    emoji: "📱",
    titulo: "QR Code",
    descricao: "Aponte a câmera para o código nas paredes ou balcões",
    cor: "#1565C0",
    corFundo: "#E3F2FD",
    corBorda: "#90CAF9",
    rota: "/qrcode",
  },
  {
    id: "formulario",
    emoji: "📋",
    titulo: "Formulário Impresso",
    descricao: "Pegue o formulário na recepção e deposite na urna",
    cor: "#E65100",
    corFundo: "#FFF3E0",
    corBorda: "#FFCC80",
    rota: "/formulario",
  },
  {
    id: "whatsapp",
    emoji: "💬",
    titulo: "WhatsApp",
    descricao: "Receba um link após sua consulta para avaliar o médico",
    cor: "#1B5E20",
    corFundo: "#E8F5E9",
    corBorda: "#A5D6A7",
    rota: "/whatsapp",
  },
];

export default function CaminhosScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnims = useRef(CAMINHOS.map(() => new Animated.Value(30))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    CAMINHOS.forEach((_, i) => {
      Animated.timing(slideAnims[i], {
        toValue: 0,
        duration: 400,
        delay: i * 120,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleSelect = (rota: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(rota as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <SantaCasaHeader compact />
      <ProgressBar current={3} total={6} label="Passo 3 de 6 — Escolha seu caminho" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.belinhaSection}>
            <Belinha
              message="Oi de novo! Para o nosso Ciclo da Melhoria começar, eu preciso te mostrar como abrir o seu formulário de opiniões. É super simples e você escolhe o jeito que achar mais fácil! 😊"
              size="medium"
            />
          </View>

          <Text style={styles.title}>Como você quer avaliar?</Text>
          <Text style={styles.subtitle}>
            Escolha o caminho mais fácil para você:
          </Text>
        </Animated.View>

        {CAMINHOS.map((caminho, idx) => (
          <Animated.View
            key={caminho.id}
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnims[idx] }],
            }}
          >
            <Pressable
              style={({ pressed }) => [
                styles.caminhoCard,
                { borderColor: caminho.corBorda },
                pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => handleSelect(caminho.rota)}
            >
              <View style={[styles.emojiContainer, { backgroundColor: caminho.corFundo }]}>
                <Text style={styles.emoji}>{caminho.emoji}</Text>
              </View>
              <View style={styles.caminhoInfo}>
                <Text style={[styles.caminhoTitulo, { color: caminho.cor }]}>
                  {caminho.titulo}
                </Text>
                <Text style={styles.caminhoDescricao}>{caminho.descricao}</Text>
              </View>
              <Text style={[styles.arrow, { color: caminho.cor }]}>›</Text>
            </Pressable>
          </Animated.View>
        ))}

        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📌 Resumo rápido:</Text>
            <Text style={styles.infoText}>
              📱 <Text style={styles.bold}>QR Code</Text> — Para avaliar recepção e limpeza
            </Text>
            <Text style={styles.infoText}>
              📋 <Text style={styles.bold}>Formulário</Text> — Para quem prefere papel
            </Text>
            <Text style={styles.infoText}>
              💬 <Text style={styles.bold}>WhatsApp</Text> — Para avaliar o médico após a consulta
            </Text>
          </View>
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
    gap: 14,
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
  },
  caminhoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  emojiContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 32,
  },
  caminhoInfo: {
    flex: 1,
    gap: 4,
  },
  caminhoTitulo: {
    fontSize: 18,
    fontWeight: "800",
  },
  caminhoDescricao: {
    fontSize: 13,
    color: "#546E7A",
    lineHeight: 19,
  },
  arrow: {
    fontSize: 28,
    fontWeight: "300",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B2631",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#546E7A",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
    color: "#1B2631",
  },
});
