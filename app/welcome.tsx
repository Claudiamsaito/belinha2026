import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ShareButton } from "@/components/share-button";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const BELINHA_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663403414321/FrJTcCtZDHKP3Yh8CCXrvy/Belinhasemfundo_1634463a.png";
const SANTA_CASA_LOGO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663403414321/FrJTcCtZDHKP3Yh8CCXrvy/logopng_0e29452f.png";

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const belinhaScale = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
      Animated.spring(belinhaScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleStart = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/instrucoes" as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com logo Santa Casa */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Image
            source={{ uri: SANTA_CASA_LOGO }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Belinha */}
        <Animated.View
          style={[
            styles.belinhaContainer,
            {
              transform: [{ scale: belinhaScale }],
              opacity: fadeAnim,
            },
          ]}
        >
          <Image
            source={{ uri: BELINHA_IMAGE }}
            style={styles.belinhaImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Conteúdo principal */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.greeting}>Olá! Eu sou a Belinha! 👋</Text>
          <Text style={styles.title}>Missão Saúde Ilhabela</Text>
          <Text style={styles.subtitle}>O Ciclo da Melhoria</Text>

          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              "Sou a <Text style={styles.bold}>Guardiã do Cuidado</Text> da Santa Casa de Ilhabela e estou aqui para te mostrar como sua opinião pode{" "}
              <Text style={styles.bold}>transformar a saúde da nossa ilha!</Text>
            </Text>
            <Text style={styles.messageText}>
              Cada avaliação que você faz é uma peça do nosso{" "}
              <Text style={styles.bold}>Ciclo da Melhoria</Text> — juntos, construímos um atendimento nota 10 para toda a comunidade!"
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8+</Text>
              <Text style={styles.statLabel}>UBSs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>6+</Text>
              <Text style={styles.statLabel}>Centros</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1943</Text>
              <Text style={styles.statLabel}>Fundação</Text>
            </View>
          </View>

          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}
              onPress={handleStart}
            >
              <Text style={styles.startButtonText}>🚀 Iniciar Missão</Text>
            </Pressable>
          </Animated.View>

          <ShareButton variant="secondary" label="📤 Compartilhar com Amigos" />

          <Pressable
            style={({ pressed }) => [
              styles.sobreButton,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push("/sobre" as never)}
          >
            <Text style={styles.sobreButtonText}>🏥 Conheça a Santa Casa</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.dashboardButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
            ]}
            onPress={() => router.push("/dashboard" as never)}
          >
            <Text style={styles.dashboardButtonText}>📊 Ver Dashboard de Avaliações</Text>
          </Pressable>

          <Text style={styles.footer}>
            Desde 1943 cuidando de Ilhabela com amor ❤️
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
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 8,
  },
  logoImage: {
    width: 260,
    height: 80,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  institutionName: {
    fontSize: 13,
    color: "#546E7A",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  institutionCity: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  belinhaContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  belinhaImage: {
    width: 200,
    height: 220,
    borderRadius: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1B2631",
    textAlign: "center",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: "#546E7A",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: -8,
  },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 10,
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
    lineHeight: 23,
    color: "#1B2631",
    fontStyle: "italic",
  },
  bold: {
    fontWeight: "700",
    fontStyle: "normal",
    color: "#2E7D32",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 12,
    color: "#546E7A",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#C8E6C9",
  },
  startButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 13,
    color: "#81C784",
    textAlign: "center",
    paddingBottom: 8,
  },
  sobreButton: {
    borderWidth: 1.5,
    borderColor: "#A5D6A7",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "transparent",
    marginHorizontal: 24,
  },
  sobreButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
  },
  dashboardButton: {
    borderWidth: 1.5,
    borderColor: "#64B5F6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    marginHorizontal: 24,
  },
  dashboardButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1976D2",
  },
});
