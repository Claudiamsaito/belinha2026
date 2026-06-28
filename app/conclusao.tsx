import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  Image,
  BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ProgressBar } from "@/components/progress-bar";
import { SantaCasaHeader } from "@/components/santa-casa-header";
import { ShareButton } from "@/components/share-button";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const BELINHA_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663403414321/FrJTcCtZDHKP3Yh8CCXrvy/Belinhasemfundo_1634463a.png";
const SANTA_CASA_LOGO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663403414321/FrJTcCtZDHKP3Yh8CCXrvy/logopng_0e29452f.png";

const CONFETTI_COLORS = [
  "#2E7D32", "#1565C0", "#F57F17", "#C62828",
  "#25D366", "#9C27B0", "#FF6F00", "#00838F",
];

function ConfettiPiece({ color, delay }: { color: string; delay: number }) {
  const fallAnim = useRef(new Animated.Value(-20)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const xPos = useRef(Math.random() * 340).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fallAnim, {
          toValue: 320,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1400),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: xPos,
        top: 0,
        width: 8,
        height: 8,
        backgroundColor: color,
        borderRadius: 2,
        opacity: fadeAnim,
        transform: [
          { translateY: fallAnim },
          { rotate },
        ],
      }}
    />
  );
}

function ConfettiAnimation() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: i * 80,
  }));

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 340, overflow: "hidden", pointerEvents: "none" }}>
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} color={p.color} delay={p.delay} />
      ))}
    </View>
  );
}

function SealoBadge() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      delay: 600,
      useNativeDriver: true,
    }).start();

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    glow.start();
    return () => glow.stop();
  }, []);

  return (
    <Animated.View
      style={[
        sealStyles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Animated.View style={[sealStyles.glow, { transform: [{ scale: glowAnim }] }]} />
      <View style={sealStyles.badge}>
        <Text style={sealStyles.trophy}>🏆</Text>
        <Text style={sealStyles.title}>Amigo da Saúde</Text>
        <Text style={sealStyles.subtitle}>Santa Casa de Ilhabela</Text>
        <View style={sealStyles.stars}>
          {["⭐", "⭐", "⭐"].map((s, i) => (
            <Text key={i} style={sealStyles.star}>{s}</Text>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const sealStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 8,
  },
  glow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#FFD700",
    opacity: 0.2,
  },
  badge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 4,
    borderColor: "#FF8F00",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  trophy: {
    fontSize: 36,
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4E342E",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 9,
    color: "#6D4C41",
    textAlign: "center",
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 12,
  },
});

export default function ConclusaoScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRestart = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.replace("/welcome" as never);
  };

  const handleExit = () => {
    if (Platform.OS === "android") {
      // Haptic before exit so user gets feedback before app closes
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).then(() => {
        // Small delay to let haptic play, then exit
        setTimeout(() => {
          BackHandler.exitApp();
        }, 200);
      }).catch(() => {
        BackHandler.exitApp();
      });
    } else if (Platform.OS === "ios") {
      // iOS does not allow programmatic app exit per Apple guidelines.
      // Best UX: go back to welcome screen so user can leave naturally.
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/welcome" as never);
    } else {
      // Web: nothing to do
      router.replace("/welcome" as never);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <SantaCasaHeader compact />
      <ProgressBar current={6} total={6} label="Missão Concluída! 🎉" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Confetti */}
        <ConfettiAnimation />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Belinha feliz */}
          <View style={styles.belinhaContainer}>
            <Image
              source={{ uri: BELINHA_IMAGE }}
              style={styles.belinhaImage}
              resizeMode="contain"
            />
            <View style={styles.joinha}>
              <Text style={styles.joinhaText}>👍</Text>
            </View>
          </View>

          <Text style={styles.congratsText}>Missão Cumprida!</Text>
          <Text style={styles.title}>Você é um Guardião da Saúde!</Text>

          {/* Selo */}
          <SealoBadge />

          {/* Mensagem final */}
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              "Você acaba de ajudar a Santa Casa a cuidar melhor de Ilhabela! Seja na UBS do seu bairro, levando seu gatinho no CRA ou em uma emergência no PS, sua opinião através desses formulários é o que nos ajuda a evoluir." 💚
            </Text>
          </View>

          {/* Resumo */}
          <View style={styles.resumoCard}>
            <Text style={styles.resumoTitle}>📌 Lembre-se sempre:</Text>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoEmoji}>📱</Text>
              <View style={styles.resumoInfo}>
                <Text style={styles.resumoLabel}>QR Code</Text>
                <Text style={styles.resumoDesc}>Para recepção e limpeza da unidade</Text>
              </View>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoEmoji}>📋</Text>
              <View style={styles.resumoInfo}>
                <Text style={styles.resumoLabel}>Formulário Impresso</Text>
                <Text style={styles.resumoDesc}>Disponível na recepção, deposite na urna</Text>
              </View>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoEmoji}>💬</Text>
              <View style={styles.resumoInfo}>
                <Text style={styles.resumoLabel}>WhatsApp</Text>
                <Text style={styles.resumoDesc}>Para avaliar o médico após a consulta</Text>
              </View>
            </View>
          </View>

          {/* Alerta WhatsApp */}
          <View style={styles.alertCard}>
            <Text style={styles.alertText}>
              ⚠️ <Text style={styles.bold}>Fique atento ao seu celular!</Text> Haverá um formulário específico enviado via WhatsApp exclusivamente para avaliar a consulta com o profissional de saúde.
            </Text>
          </View>

          {/* Privacidade */}
          <View style={styles.privacyCard}>
            <Text style={styles.privacyTitle}>🔒 Seus dados são protegidos</Text>
            <Text style={styles.privacyText}>
              Todas as informações fornecidas são sigilosas e utilizadas exclusivamente para aprimorar os serviços da Santa Casa de Ilhabela. Sua privacidade é nossa prioridade.
            </Text>
          </View>

          {/* Logo Santa Casa */}
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: SANTA_CASA_LOGO }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <ShareButton variant="primary" label="📤 Compartilhar com Amigos" />

          <Pressable
            style={({ pressed }) => [
              styles.restartButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleRestart}
          >
            <Text style={styles.restartButtonText}>🔄 Voltar ao Início</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.exitButton,
              pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleExit}
          >
            <Text style={styles.exitButtonText}>✅ Missão Cumprida! Sair do App</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    position: "relative",
  },
  content: {
    paddingHorizontal: 20,
    gap: 18,
    paddingTop: 16,
  },
  belinhaContainer: {
    alignItems: "center",
    position: "relative",
  },
  belinhaImage: {
    width: 160,
    height: 180,
    borderRadius: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "#C8E6C9",
  },
  joinha: {
    position: "absolute",
    bottom: 0,
    right: "30%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: "#C8E6C9",
  },
  joinhaText: {
    fontSize: 22,
  },
  congratsText: {
    fontSize: 16,
    color: "#2E7D32",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B2631",
    textAlign: "center",
    lineHeight: 32,
  },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#1B2631",
    fontStyle: "italic",
    textAlign: "center",
  },
  resumoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  resumoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B2631",
    marginBottom: 4,
  },
  resumoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resumoEmoji: {
    fontSize: 24,
  },
  resumoInfo: {
    flex: 1,
    gap: 2,
  },
  resumoLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B2631",
  },
  resumoDesc: {
    fontSize: 12,
    color: "#546E7A",
  },
  alertCard: {
    backgroundColor: "#FFFDE7",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FFF176",
  },
  alertText: {
    fontSize: 14,
    color: "#1B2631",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
  },
  privacyCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
  },
  privacyText: {
    fontSize: 13,
    color: "#546E7A",
    lineHeight: 20,
  },
  logoContainer: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  logoImage: {
    width: 260,
    height: 80,
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoText: {
    fontSize: 26,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  logoName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B2631",
  },
  logoCity: {
    fontSize: 12,
    color: "#546E7A",
  },
  restartButton: {
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
  restartButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  exitButton: {
    backgroundColor: "#ECEFF1",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#B0BEC5",
    marginBottom: 8,
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#546E7A",
  },
});
