import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StarRating } from "@/components/star-rating";
import { obterTodasStats, type UnidadeStats } from "@/lib/avaliacoes-store";

export type UnidadeCategoria = "sede" | "ubs" | "hospital" | "especialidade";

export interface Unidade {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  telefone?: string;
  categoria: UnidadeCategoria;
  latitude: number;
  longitude: number;
}

export const UNIDADES: Unidade[] = [
  {
    id: "sede",
    nome: "Santa Casa — Sede / Administração",
    endereco: "Rua Padre Bronislau Chereck, 15",
    bairro: "Centro",
    telefone: "(12) 3896-1710",
    categoria: "sede",
    latitude: -23.7780,
    longitude: -45.3582,
  },
  {
    id: "hospital",
    nome: "Hospital Municipal Gov. Mário Covas",
    endereco: "Av. Prof. Malaquias de Oliveira Freitas, 154",
    bairro: "Barra Velha",
    telefone: "(12) 3895-3520",
    categoria: "hospital",
    latitude: -23.8052,
    longitude: -45.3620,
  },
  {
    id: "ubs_barra_velha",
    nome: "UBS Barra Velha",
    endereco: "Rua Benedito dos Anjos Sampaio, 225",
    bairro: "Barra Velha",
    telefone: "(12) 3895-7190",
    categoria: "ubs",
    latitude: -23.8040,
    longitude: -45.3615,
  },
  {
    id: "ubs_alto_barra",
    nome: "UBS Alto da Barra",
    endereco: "Rua dos Carijos, 550",
    bairro: "Zabumba",
    telefone: "(12) 3896-9200",
    categoria: "ubs",
    latitude: -23.8090,
    longitude: -45.3650,
  },
  {
    id: "ubs_agua_branca",
    nome: "UBS Água Branca",
    endereco: "Av. Coronel Vicente Daria Lima, 1435",
    bairro: "Água Branca",
    telefone: "(12) 3896-6530",
    categoria: "ubs",
    latitude: -23.7920,
    longitude: -45.3540,
  },
  {
    id: "ubs_itaquanduba",
    nome: "UBS Itaquanduba",
    endereco: "Av. dos Bandeirantes, 230",
    bairro: "Itaquanduba",
    telefone: "(12) 3896-9200",
    categoria: "ubs",
    latitude: -23.7700,
    longitude: -45.3490,
  },
  {
    id: "ubs_pereque",
    nome: "UBS Perequê",
    endereco: "Rua do Quilombo, 73",
    bairro: "Perequê",
    telefone: "(12) 2896-9200",
    categoria: "ubs",
    latitude: -23.7610,
    longitude: -45.3460,
  },
  {
    id: "ubs_costa_norte",
    nome: "UBS Costa Norte",
    endereco: "Av. Leonardo Reale, 4080",
    bairro: "Ponta Azeda",
    telefone: "(12) 3896-1371",
    categoria: "ubs",
    latitude: -23.7200,
    longitude: -45.3250,
  },
  {
    id: "ubs_costa_sul",
    nome: "UBS Costa Sul",
    endereco: "Av. Riachuelo, 6311",
    bairro: "Praia Grande",
    categoria: "ubs",
    latitude: -23.8350,
    longitude: -45.3700,
  },
  {
    id: "centro_saude_iii",
    nome: "Centro de Saúde III",
    endereco: "Rua São Benedito, 151",
    bairro: "Centro",
    telefone: "(12) 3896-1212",
    categoria: "especialidade",
    latitude: -23.7795,
    longitude: -45.3565,
  },
  {
    id: "centro_especialidades",
    nome: "Centro de Especialidades",
    endereco: "Rua Padre Bronislau Cherek, 15",
    bairro: "Centro",
    telefone: "(12) 3896-3400",
    categoria: "especialidade",
    latitude: -23.7783,
    longitude: -45.3580,
  },
  {
    id: "centro_julia_tenorio",
    nome: "Centro Especializado Júlia Tenório",
    endereco: "Av. Princesa Isabel, 1673",
    bairro: "Centro",
    telefone: "(12) 3896-1500",
    categoria: "especialidade",
    latitude: -23.7760,
    longitude: -45.3600,
  },
  {
    id: "ciama",
    nome: "CIAMA",
    endereco: "Rua Carolina Vanderstappen, 275",
    bairro: "Perequê",
    telefone: "(12) 3896-1535",
    categoria: "especialidade",
    latitude: -23.7625,
    longitude: -45.3450,
  },
];

export const CATEGORIA_CONFIG: Record<UnidadeCategoria, { cor: string; emoji: string; label: string; bgColor: string }> = {
  sede:         { cor: "#1565C0", emoji: "🏛️", label: "Sede",          bgColor: "#E3F2FD" },
  hospital:     { cor: "#C62828", emoji: "🏥", label: "Hospital",       bgColor: "#FFEBEE" },
  ubs:          { cor: "#2E7D32", emoji: "🏠", label: "UBS",            bgColor: "#E8F5E9" },
  especialidade:{ cor: "#F57F17", emoji: "⚕️", label: "Especialidade",  bgColor: "#FFF8E1" },
};

function handleCall(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  Linking.openURL(`tel:${cleaned}`);
}

function handleOpenMaps(unidade: Unidade) {
  const query = encodeURIComponent(`${unidade.nome}, ${unidade.endereco}, Ilhabela, SP`);
  const url =
    Platform.OS === "ios"
      ? `maps:?q=${query}`
      : `geo:${unidade.latitude},${unidade.longitude}?q=${query}`;
  Linking.openURL(url).catch(() => {
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  });
}

function handleOpenAllMaps() {
  Linking.openURL(
    "https://www.google.com/maps/search/unidades+de+saude+Ilhabela+SP/@-23.785,-45.358,13z"
  );
}

interface Props {
  height?: number;
}

export function UnidadesMap({ height = 320 }: Props) {
  const router = useRouter();
  const [selectedUnidade, setSelectedUnidade] = useState<Unidade | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<UnidadeCategoria | null>(null);
  const [statsMap, setStatsMap] = useState<Record<string, UnidadeStats>>({});

  useEffect(() => {
    obterTodasStats().then(setStatsMap);
  }, []);

  const handleSelectUnidade = (unidade: Unidade) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedUnidade(unidade === selectedUnidade ? null : unidade);
  };

  const filteredUnidades = filterCategoria
    ? UNIDADES.filter((u) => u.categoria === filterCategoria)
    : UNIDADES;

  const config = selectedUnidade ? CATEGORIA_CONFIG[selectedUnidade.categoria] : null;

  return (
    <View style={styles.container}>
      {/* Filtros de categoria */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtrosScroll}
      >
        <Pressable
          style={({ pressed }) => [
            styles.filtroBtn,
            !filterCategoria && styles.filtroBtnActive,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => setFilterCategoria(null)}
        >
          <Text style={[styles.filtroBtnText, !filterCategoria && styles.filtroBtnTextActive]}>
            Todas ({UNIDADES.length})
          </Text>
        </Pressable>
        {(Object.entries(CATEGORIA_CONFIG) as [UnidadeCategoria, typeof CATEGORIA_CONFIG[UnidadeCategoria]][]).map(([key, val]) => {
          const count = UNIDADES.filter((u) => u.categoria === key).length;
          const isActive = filterCategoria === key;
          return (
            <Pressable
              key={key}
              style={({ pressed }) => [
                styles.filtroBtn,
                { borderColor: val.cor },
                isActive && { backgroundColor: val.cor },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => setFilterCategoria(isActive ? null : key)}
            >
              <Text style={styles.filtroEmoji}>{val.emoji}</Text>
              <Text style={[styles.filtroBtnText, { color: isActive ? "#FFF" : val.cor }]}>
                {val.label} ({count})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Botão abrir mapa completo */}
      <Pressable
        style={({ pressed }) => [styles.openMapBtn, pressed && { opacity: 0.8 }]}
        onPress={handleOpenAllMaps}
      >
        <Text style={styles.openMapBtnText}>🗺️ Abrir mapa completo no Google Maps</Text>
      </Pressable>

      {/* Lista de unidades como cards clicáveis */}
      <View style={styles.listaContainer}>
        {filteredUnidades.map((unidade) => {
          const cfg = CATEGORIA_CONFIG[unidade.categoria];
          const isSelected = selectedUnidade?.id === unidade.id;
          return (
            <Pressable
              key={unidade.id}
              style={({ pressed }) => [
                styles.unidadeCard,
                { borderColor: isSelected ? cfg.cor : cfg.cor + "55", backgroundColor: isSelected ? cfg.bgColor : "#FFFFFF" },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => handleSelectUnidade(unidade)}
            >
              <View style={styles.unidadeCardHeader}>
                <View style={[styles.emojiCircle, { backgroundColor: cfg.bgColor }]}>
                  <Text style={styles.emojiText}>{cfg.emoji}</Text>
                </View>
                <View style={styles.unidadeInfo}>
                  <View style={styles.unidadeTopRow}>
                    <View style={[styles.categoriaBadge, { backgroundColor: cfg.cor }]}>
                      <Text style={styles.categoriaBadgeText}>{cfg.label}</Text>
                    </View>
                    <Text style={styles.bairroText}>{unidade.bairro}</Text>
                  </View>
                  <Text style={styles.unidadeNome} numberOfLines={2}>{unidade.nome}</Text>
                  <Text style={styles.unidadeEndereco} numberOfLines={1}>{unidade.endereco}</Text>
                  {statsMap[unidade.id]?.totalAvaliacoes > 0 && (
                    <View style={styles.miniStarsRow}>
                      <StarRating value={statsMap[unidade.id].mediaGeral} size={13} />
                      <Text style={styles.miniStarsCount}>({statsMap[unidade.id].totalAvaliacoes})</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.chevron, { color: cfg.cor }]}>{isSelected ? "▲" : "▼"}</Text>
              </View>

              {/* Painel expandido */}
              {isSelected && (
                <View style={[styles.expandedPanel, { borderTopColor: cfg.cor + "44" }]}>
                  <Text style={styles.expandedEndereco}>
                    📍 {unidade.endereco} — {unidade.bairro}, Ilhabela/SP
                  </Text>
                  {unidade.telefone && (
                    <Text style={styles.expandedTelefone}>📱 {unidade.telefone}</Text>
                  )}
                  <View style={styles.expandedActions}>
                    {unidade.telefone && (
                      <Pressable
                        style={({ pressed }) => [
                          styles.actionBtn,
                          { backgroundColor: cfg.cor },
                          pressed && { opacity: 0.8 },
                        ]}
                        onPress={() => handleCall(unidade.telefone!)}
                      >
                        <Text style={styles.actionBtnText}>📱 Ligar</Text>
                      </Pressable>
                    )}
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionBtn,
                        styles.actionBtnOutline,
                        { borderColor: cfg.cor },
                        pressed && { opacity: 0.7 },
                      ]}
                      onPress={() => handleOpenMaps(unidade)}
                    >
                      <Text style={[styles.actionBtnText, { color: cfg.cor }]}>🗺️ Como chegar</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.avaliarBtn,
                      { borderColor: cfg.cor },
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => router.push({ pathname: "/avaliacao", params: { unidadeId: unidade.id } })}
                  >
                    <Text style={[styles.avaliarBtnText, { color: cfg.cor }]}>⭐ Avaliar esta unidade</Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.contador}>
        {UNIDADES.length} unidades de saúde em Ilhabela — toque para ver detalhes e como chegar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  filtrosScroll: {
    gap: 8,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  filtroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#B0BEC5",
    backgroundColor: "#FFFFFF",
  },
  filtroBtnActive: {
    backgroundColor: "#1B2631",
    borderColor: "#1B2631",
  },
  filtroEmoji: {
    fontSize: 13,
  },
  filtroBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#546E7A",
  },
  filtroBtnTextActive: {
    color: "#FFFFFF",
  },
  openMapBtn: {
    backgroundColor: "#1565C0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  openMapBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  listaContainer: {
    gap: 8,
  },
  unidadeCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  unidadeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  emojiCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emojiText: {
    fontSize: 20,
  },
  unidadeInfo: {
    flex: 1,
    gap: 3,
  },
  unidadeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoriaBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoriaBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bairroText: {
    fontSize: 11,
    color: "#90A4AE",
    fontWeight: "600",
  },
  unidadeNome: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1B2631",
    lineHeight: 18,
  },
  unidadeEndereco: {
    fontSize: 11,
    color: "#78909C",
    lineHeight: 16,
  },
  chevron: {
    fontSize: 12,
    fontWeight: "700",
    flexShrink: 0,
  },
  expandedPanel: {
    borderTopWidth: 1,
    padding: 12,
    gap: 8,
    backgroundColor: "transparent",
  },
  expandedEndereco: {
    fontSize: 13,
    color: "#37474F",
    lineHeight: 19,
  },
  expandedTelefone: {
    fontSize: 13,
    color: "#546E7A",
    fontWeight: "600",
  },
  expandedActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {