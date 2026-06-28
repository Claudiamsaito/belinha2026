import { View, Text, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function Index() {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      router.replace("/welcome" as never);
    }, [router])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Missão Saúde Ilhabela</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F8E9",
  },
  text: {
    fontSize: 16,
    color: "#546E7A",
  },
});
