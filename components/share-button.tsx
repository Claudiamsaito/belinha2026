import React, { useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Alert,
  Platform,
  Share,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";

const SHARE_MESSAGE =
  "🏥 Conheça o jogo da Belinha da Santa Casa de Ilhabela!\n\n" +
  "Aprenda como avaliar o atendimento de saúde da nossa ilha de forma simples e divertida. " +
  "Sua opinião transforma o cuidado de toda a comunidade! 💚\n\n" +
  "Baixe o app: https://missao-saude-ilhabela.manus.space";

interface ShareButtonProps {
  variant?: "primary" | "secondary" | "floating";
  label?: string;
}

export function ShareButton({
  variant = "secondary",
  label = "📤 Compartilhar com Amigos",
}: ShareButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleShare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      if (Platform.OS === "web") {
        // Use Web Share API on web
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(SHARE_MESSAGE);
        } else {
          // Fallback: copy to clipboard via alert
          Alert.alert(
            "Compartilhar",
            "Copie o texto abaixo e envie para seus amigos:\n\n" + SHARE_MESSAGE,
            [{ text: "OK" }]
          );
        }
      } else {
        // Use React Native's built-in Share on iOS/Android (supports text sharing natively)
        await Share.share({
          message: SHARE_MESSAGE,
          title: "Missão Saúde Ilhabela — Jogo da Belinha",
        });
      }
    } catch {
      // User cancelled or error — do nothing
    }
  };

  if (variant === "floating") {
    return (
      <Animated.View style={[floatingStyles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
        <Pressable
          style={({ pressed }) => [
            floatingStyles.button,
            pressed && { opacity: 0.85 },
          ]}
          onPress={handleShare}
        >
          <Text style={floatingStyles.icon}>📤</Text>
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === "primary") {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          style={({ pressed }) => [
            primaryStyles.button,
            pressed && { opacity: 0.85 },
          ]}
          onPress={handleShare}
        >
          <Text style={primaryStyles.text}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  // Default: secondary
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={({ pressed }) => [
          secondaryStyles.button,
          pressed && { opacity: 0.85 },
        ]}
        onPress={handleShare}
      >
        <Text style={secondaryStyles.text}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const primaryStyles = StyleSheet.create({
  button: {
    backgroundColor: "#1565C0",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  text: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

const secondaryStyles = StyleSheet.create({
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1565C0",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1565C0",
  },
});

const floatingStyles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 24,
    right: 20,
    zIndex: 100,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1565C0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  icon: {
    fontSize: 22,
  },
});
