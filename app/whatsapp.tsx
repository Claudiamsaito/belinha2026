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

function WhatsAppMockup() {
  const notifAnim = useRef(new Animated.Value(0)).current;
  const vibrateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in notification
    Animated.timing(notifAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Vibrate animation
    const vibrate = Animated.loop(
      Animated.sequence([
        Animated.timing(vibrateAnim, {
          toValue: 3,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(vibrateAnim, {
          toValue: -3,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(vibrateAnim, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    );
    vibrate.start();

    return () => vibrate.stop();
  }, []);

  return (
    <View style={mockStyles.container}>
      {/* Phone mockup */}
      <Animated.View
        style={[
          mockStyles.phone,
          { transform: [{ translateX: vibrateAnim }] },
        ]}
      >
        {/* Status bar */}
        <View style={mockStyles.statusBar}>
          <Text style={mockStyles.statusTime}>9:41</Text>
          <Text style={mockStyles.statusIcons}>📶 🔋</Text>
        </View>

        {/* WhatsApp header */}
        <View style={mockStyles.waHeader}>
          <View style={mockStyles.waAvatar}>
            <Text style={mockStyles.waAvatarText}>✚</Text>
          </View>
          <View style={mockStyles.waHeaderInfo}>
            <Text style={mockStyles.waName}>Santa Casa Ilhabela</Text>
            <Text style={mockStyles.waStatus}>Online</Text>
          </View>
        </View>

        {/* Chat area */}
        <View style={mockStyles.chatArea}>
          {/* Received message */}
          <Animated.View style={[mockStyles.messageBubble, { opacity: notifAnim }]}>
            <Text style={mockStyles.messageText}>
              Olá! Sou a Belinha da Santa Casa de Ilhabela 👩‍⚕️
            </Text>
            <Text style={mockStyles.messageText}>
              Sua consulta foi concluída. Poderia avaliar o atendimento médico que recebeu? É rapidinho! 🌟
            </Text>
            <View style={mockStyles.ctaButton}>
              <Text style={mockStyles.ctaText}>👆 Eu Topo!</Text>
            </View>
            <Text style={mockStyles.messageTime}>Agora ✓✓</Text>
          </Animated.View>
        </View>

        {/* Notification badge */}
        <Animated.View style={[mockStyles.badge, { opacity: notifAnim }]}>
          <Text style={mockStyles.badgeText}>1</Text>
        </Animated.View>
      </Animated.View>

      <Text style={mockStyles.hint}>Fique de olho no seu celular! 👀</Text>
    </View>
  );
}

const mockStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  phone: {
    width: 220,
    backgroundColor: "#ECE5DD",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#1B2631",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  statusBar: {
    backgroundColor: "#075E54",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusTime: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statusIcons: {
    fontSize: 9,
  },
  waHeader: {
    backgroundColor: "#075E54",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  waAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  waAvatarText: {
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "800",
  },
  waHeaderInfo: {
    gap: 1,
  },
  waName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  waStatus: {
    fontSize: 10,
    color: "#B2DFDB",
  },
  chatArea: {
    padding: 10,
    minHeight: 120,
    gap: 8,
  },
  messageBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderTopLeftRadius: 2,
    padding: 10,
    gap: 6,
    maxWidth: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  messageText: {
    fontSize: 11,
    color: "#1B2631",
    lineHeight: 17,
  },
  ctaButton: {
    backgroundColor: "#25D366",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    marginTop: 4,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  messageTime: {
    fontSize: 9,
    color: "#546E7A",
    textAlign: "right",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  hint: {
    fontSize: 13,
    color: "#546E7A",
    fontStyle: "italic",
  },
});

export default function WhatsAppScreen() {
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
      <ProgressBar current={4} total={6} label="Passo 4 de 6 — Caminho do WhatsApp" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, gap: 16 }}>
          <View style={styles.belinhaSection}>
            <Belinha
              message="Atenção máxima aqui! Vou te enviar um link especial para você me contar como foi o seu atendimento pós-consulta diretamente no seu WhatsApp! 💬"
              size="medium"
            />
          </View>

          <Text style={styles.title}>💬 Caminho do WhatsApp</Text>

          <WhatsAppMockup />

          <View style={styles.alertCard}>
            <Text style={styles.alertEmoji}>⚠️</Text>
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Formulário Exclusivo para o Médico</Text>
              <Text style={styles.alertText}>
                Este formulário é exclusivo para avaliar o{" "}
                <Text style={styles.bold}>atendimento médico</Text> após sua consulta.
              </Text>
            </View>
          </View>

          <View style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>Como funciona:</Text>
            {[
              { num: "1", text: "Após sua consulta, fique atento ao celular" },
              { num: "2", text: "Você receberá uma mensagem oficial da Santa Casa" },
              { num: "3", text: "Clique em 'Eu Topo!' na mensagem" },
              { num: "4", text: "Avalie o médico: atenção, explicações e horário" },
            ].map((step) => (
              <View key={step.num} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.num}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.avaliaCard}>
            <Text style={styles.avaliaTitle}>📋 Você vai avaliar:</Text>
            {[
              "Se o médico foi atencioso",
              "Se explicou direitinho o diagnóstico",
              "Se o horário foi cumprido",
              "Se tirou todas as suas dúvidas",
            ].map((item, i) => (
              <View key={i} style={styles.avaliaItem}>
                <Text style={styles.avaliaCheck}>✓</Text>
                <Text style={styles.avaliaText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              "Não deixe de responder, é rapidinho! Sua opinião sobre o médico é valiosa para completarmos nossa missão!" 🌟
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.secondaryButtonText}>Entendi! Continuar →</Text>
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
  alertCard: {
    backgroundColor: "#FFFDE7",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: "#FFF176",
  },
  alertEmoji: {
    fontSize: 24,
  },
  alertInfo: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F57F17",
  },
  alertText: {
    fontSize: 13,
    color: "#546E7A",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "700",
    color: "#1B2631",
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
    backgroundColor: "#25D366",
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
  avaliaCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  avaliaTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 4,
  },
  avaliaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avaliaCheck: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "800",
  },
  avaliaText: {
    fontSize: 14,
    color: "#1B2631",
    flex: 1,
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
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2E7D32",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
  },
});
