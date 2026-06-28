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

const AVALIACOES = [
  { label: "Péssimo", emoji: "😞", cor: "#C62828", corFundo: "#FFEBEE" },
  { label: "Ruim", emoji: "😕", cor: "#E65100", corFundo: "#FFF3E0" },
  { label: "Regular", emoji: "😐", cor: "#F57F17", corFundo: "#FFFDE7" },
  { label: "Bom", emoji: "🙂", cor: "#2E7D32", corFundo: "#E8F5E9" },
  { label: "Ótimo", emoji: "😄", cor: "#1565C0", corFundo: "#E3F2FD" },
];

function FormularioMockup() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[mockStyles.container, { opacity: fadeAnim }]}>
      <View style={mockStyles.header}>
        <Text style={mockStyles.headerTitle}>✚ Santa Casa de Ilhabela</Text>
        <Text style={mockStyles.headerSub}>Formulário de Satisfação</Text>
      </View>

      <View style={mockStyles.body}>
        <Text style={mockStyles.fieldLabel}>Unidade visitada:</Text>
        <View style={mockStyles.fieldBox}>
          <Text style={mockStyles.fieldPlaceholder}>Ex: UBS Costa Norte</Text>
        </View>

        <Text style={mockStyles.fieldLabel}>Como foi o atendimento?</Text>
        <View style={mockStyles.ratingRow}>
          {AVALIACOES.map((av) => (
            <View
              key={av.label}
              style={[mockStyles.ratingItem, { backgroundColor: av.corFundo }]}
            >
              <Text style={mockStyles.ratingEmoji}>{av.emoji}</Text>
              <Text style={[mockStyles.ratingLabel, { color: av.cor }]}>
                {av.label}
              </Text>
            </View>
          ))}
        </View>

        <Text style={mockStyles.fieldLabel}>Comentários (opcional):</Text>
        <View style={[mockStyles.fieldBox, { height: 48 }]}>
          <Text style={mockStyles.fieldPlaceholder}>Elogios, sugestões...</Text>
        </View>

        <Text style={mockStyles.fieldLabel}>Identificação (opcional):</Text>
        <View style={mockStyles.fieldBox}>
          <Text style={mockStyles.fieldPlaceholder}>Nome / Telefone</Text>
        </View>
      </View>

      <View style={mockStyles.footer}>
        <Text style={mockStyles.footerText}>📥 Deposite na urna ao terminar</Text>
      </View>
    </Animated.View>
  );
}

const mockStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    backgroundColor: "#2E7D32",
    padding: 14,
    alignItems: "center",
    gap: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSub: {
    fontSize: 12,
    color: "#A5D6A7",
  },
  body: {
    padding: 14,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#546E7A",
    marginTop: 4,
  },
  fieldBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
  },
  fieldPlaceholder: {
    fontSize: 12,
    color: "#BDBDBD",
    fontStyle: "italic",
  },
  ratingRow: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
  },
  ratingItem: {
    flex: 1,
    minWidth: 52,
    alignItems: "center",
    padding: 6,
    borderRadius: 8,
    gap: 2,
  },
  ratingEmoji: {
    fontSize: 18,
  },
  ratingLabel: {
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
  },
});

export default function FormularioScreen() {
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
    router.push("/conclusao" as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <SantaCasaHeader compact />
      <ProgressBar current={4} total={6} label="Passo 4 de 6 — Formulário Impresso" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, gap: 16 }}>
          <View style={styles.belinhaSection}>
            <Belinha
              message="Se você prefere o papel, sem problemas! Temos o formulário impresso disponível aqui na recepção. Você preenche e deposita na nossa urna! 📋"
              size="medium"
            />
          </View>

          <Text style={styles.title}>📋 Formulário Impresso</Text>

          <FormularioMockup />

          <View style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>Como preencher:</Text>
            {[
              { num: "1", text: "Pegue o formulário na recepção" },
              { num: "2", text: "Marque qual unidade você está visitando" },
              { num: "3", text: "Avalie o atendimento de Péssimo a Ótimo" },
              { num: "4", text: "Escreva elogios ou sugestões (opcional)" },
              { num: "5", text: "Deposite na urna ao terminar" },
            ].map((step) => (
              <View key={step.num} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.num}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.urnaCard}>
            <Text style={styles.urnaEmoji}>🗳️</Text>
            <View style={styles.urnaInfo}>
              <Text style={styles.urnaTitle}>Urna de Coleta</Text>
              <Text style={styles.urnaText}>
                Localizada no balcão da recepção de cada unidade. Sua voz tem o mesmo peso aqui!
              </Text>
            </View>
          </View>

          <View style={styles.optionalCard}>
            <Text style={styles.optionalTitle}>💬 Comentário especial?</Text>
            <Text style={styles.optionalText}>
              "Tem algum elogio especial, uma ideia ou um comentário sobre a recepção? Escreva no campo de comentários, eu adoro ler suas mensagens!"
            </Text>
            <Text style={styles.optionalText}>
              "Se quiser que eu te responda depois, deixe seu nome e telefone. Mas se preferir ficar no anonimato, não tem problema, sua opinião vale do mesmo jeito!" 😊
            </Text>
          </View>

          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              "Se a bateria acabou ou você prefere o papel, sua voz tem o{" "}
              <Text style={styles.bold}>mesmo peso</Text> que o formulário digital!" 💚
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Entendi! Continuar →</Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1B2631",
    textAlign: "center",
  },
  stepsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B2631",
    marginBottom: 4,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E65100",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  stepText: {
    fontSize: 15,
    color: "#1B2631",
    flex: 1,
    lineHeight: 22,
  },
  urnaCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#FFCC80",
  },
  urnaEmoji: {
    fontSize: 36,
  },
  urnaInfo: {
    flex: 1,
    gap: 4,
  },
  urnaTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E65100",
  },
  urnaText: {
    fontSize: 13,
    color: "#546E7A",
    lineHeight: 20,
  },
  optionalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  optionalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B2631",
  },
  optionalText: {
    fontSize: 14,
    color: "#546E7A",
    lineHeight: 22,
    fontStyle: "italic",
  },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#546E7A",
    fontStyle: "italic",
    textAlign: "center",
  },
  bold: {
    fontWeight: "700",
    fontStyle: "normal",
    color: "#2E7D32",
  },
  continueButton: {
    backgroundColor: "#E65100",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#E65100",
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
