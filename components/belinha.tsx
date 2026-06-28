import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";

const BELINHA_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663403414321/FrJTcCtZDHKP3Yh8CCXrvy/Belinhasemfundo_1634463a.png";

interface BelinhaProps {
  message: string;
  size?: "small" | "medium" | "large";
  showBubble?: boolean;
}

export function Belinha({ message, size = "medium", showBubble = true }: BelinhaProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [message]);

  const imageWidth = size === "small" ? 70 : size === "large" ? 130 : 100;
  const imageHeight = size === "small" ? 80 : size === "large" ? 150 : 115;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.row}>
        <Image
          source={{ uri: BELINHA_IMAGE }}
          style={[styles.image, { width: imageWidth, height: imageHeight }]}
          resizeMode="contain"
        />
        {showBubble && (
          <View style={styles.bubbleWrapper}>
            <View style={styles.bubbleTail} />
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>{message}</Text>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  image: {
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  bubbleWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: "transparent",
    borderRightWidth: 12,
    borderRightColor: "#FFFFFF",
    borderBottomWidth: 8,
    borderBottomColor: "transparent",
  },
  bubble: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#1B2631",
    fontStyle: "italic",
  },
});
