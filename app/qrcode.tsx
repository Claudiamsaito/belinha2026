import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Belinha } from "@/components/belinha";
import { ProgressBar } from "@/components/progress-bar";
import { SantaCasaHeader } from "@/components/santa-casa-header";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const FORM_URL = "https://forms.gle/r48ujrBz3yWX15on8";

function QRCodeAnimation() {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const cornerPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Scanning line animation
    const scan = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    scan.start();

    // Corner pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(cornerPulse, {
          toValue: 1.15,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(cornerPulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      scan.stop();
      pulse.stop();
    };
  }, []);

  const scanLineY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

  return (
    <View style={qrStyles.container}>
      {/* QR Code mockup */}
      <View style={qrStyles.qrFrame}>
        {/* Corners */}
        <Animated.View
          style={[qrStyles.corner, qrStyles.topLeft, { transform: [{ scale: cornerPulse }] }]}
        />
        <Animated.View
          style={[qrStyles.corner, qrStyles.topRight, { transform: [{ scale: cornerPulse }] }]}
        />
        <Animated.View
          style={[qrStyles.corner, qrStyles.bottomLeft, { transform: [{ scale: cornerPulse }] }]}
        />
        <Animated.View
          style={[qrStyles.corner, qrStyles.bottomRight, { transform: [{ scale: cornerPulse }] }]}
        />

        {/* QR Code pattern */}
        <View style={qrStyles.qrPattern}>
          <View style={qrStyles.qrRow}>
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
          </View>
          <View style={qrStyles.qrRow}>
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
          </View>
          <View style={qrStyles.qrRow}>
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
          </View>
          <View style={qrStyles.qrRow}>
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
          </View>
          <View style={qrStyles.qrRow}>
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
            <View style={[qrStyles.qrBlock, qrStyles.light]} />
            <View style={[qrStyles.qrBlock, qrStyles.dark]} />
          </View>
        </View>

        {/* Scan line */}
        <Animated.View
          style={[
            qrStyles.scanLine,
            { transform: [{ translateY: scanLineY }] },
          ]}
        />
      </View>
      <Text style={qrStyles.hint}>Aponte a câmera para o código</Text>
    </View>
  );
}

const qrStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  qrFrame: {
    width: 180,
    height: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#1565C0",
    borderWidth: 3,
  },
  topLeft: {
    top: 8,
    left: 8,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 8,
    right: 8,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 8,
    left: 8,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 8,
    right: 8,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  qrPattern: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  qrRow: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
  },
  qrBlock: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  dark: {
    backgroundColor: "#1B2631",
  },
  light: {
    backgroundColor: "#E5E7EB",
  },
  scanLine: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: "#1565C0",
    opacity: 0.7,
    borderRadius: 1,
    top: 16,
  },
  hint: {
    fontSize: 13,
    color: "#546E7A",
    fontStyle: "italic",
  },
});

export default function QRCodeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleOpenForm = async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await Linking.openURL(FORM_URL);
    router.push("/conclusao" as never);
  };

  const handleContinue = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/conclusao" as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <SantaCasaHeader compact />
      <ProgressBar current={4} total={6} label="Passo 4 de 6 — Caminho do QR Code" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, gap: 16 }}>
          <View style={styles.belinhaSection}>
            <Belinha
              message="Viu esses adesivos com um quadradinho preto e branco nas nossas paredes ou no balcão? É o nosso Portal de Opinião! Vou te mostrar como usar! 📱"
              size="medium"
            />
          </View>

          <Text style={styles.title}>📱 Caminho do QR Code</Text>

          <QRCodeAnimation />

          <View style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>Como fazer:</Text>
            {[
              { num: "1", text: "Pegue seu celular" },
              { num: "2", text: "Abra a câmera" },
              { num: "3", text: "Aponte para o código nas paredes ou balcão" },
              { num: "4", text: "Toque no link que aparecer na tela" },
            ].map((step) => (
              <View key={step.num} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.num}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>📋</Text>
            <Text style={styles.infoText}>
              Você vai avaliar a <Text style={styles.bold}>limpeza</Text>,{" "}
              <Text style={styles.bold}>recepção</Text> e{" "}
              <Text style={styles.bold}>tempo de espera</Text> da unidade.
            </Text>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleOpenForm}
          >
            <Text style={styles.primaryButtonText}>🔗 Responder Agora</Text>
            <Text style={styles.primaryButtonSub}>Clique aqui para abrir o formulário</Text>
          </Pressable>

          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              "É rápido como um mergulho no mar! Clique no botão azul e eu te levo direto para as perguntas agora mesmo!" 🌊
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.secondaryButtonText}>Já respondi, continuar →</Text>
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
    backgroundColor: "#1565C0",
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
  infoCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#90CAF9",
  },
  infoEmoji: {
    fontSize: 28,
  },
  infoText: {
    fontSize: 14,
    color: "#1B2631",
    flex: 1,
    lineHeight: 21,
  },
  bold: {
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#C8E6C9",
  },
  dividerText: {
    fontSize: 13,
    color: "#546E7A",
  },
  primaryButton: {
    backgroundColor: "#1565C0",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 4,
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  primaryButtonSub: {
    fontSize: 12,
    color: "#BBDEFB",
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
