import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";
import { UnidadesMap } from "@/components/unidades-map";

const SANTA_CASA_LOGO =
  "https://static.manus.space/webdev/missao-saude-ilhabela/logopng.png";

const LINHA_DO_TEMPO = [
  {
    ano: "1943",
    titulo: "Fundação",
    descricao:
      "Em 02 de setembro, um grupo de pessoas da comunidade funda a Santa Casa de Misericórdia de Ilhabela, em terreno cedido pela Mitra Arquidiocesana, ao lado da Igreja Matriz.",
    cor: "#1565C0",
  },
  {
    ano: "1970s",
    titulo: "Hospital Geral",
    descricao:
      "A Santa Casa passa a funcionar como hospital geral com 20 leitos nas especialidades básicas, sendo o único pronto-socorro e hospital do município por mais de 20 anos.",
    cor: "#2E7D32",
  },
  {
    ano: "1988",
    titulo: "Convênio SUS",
    descricao:
      "Assinatura do convênio com o Sistema Único de Saúde (SUS), ampliando o acesso da população ilhabelense aos serviços de saúde.",
    cor: "#F57F17",
  },
  {
    ano: "2002",
    titulo: "Parceria Municipal",
    descricao:
      "Firmada parceria com a Prefeitura de Ilhabela. O prédio histórico é reformado e passa a abrigar o Centro de Especialidades, Reabilitação e Laboratório de Análises Clínicas.",
    cor: "#6A1B9A",
  },
  {
    ano: "2023",
    titulo: "Ampliação e Modernização",
    descricao:
      "Início de um amplo processo de ampliação e modernização da estrutura, preparando a Santa Casa para atender a população pelos próximos 30 anos.",
    cor: "#C62828",
  },
];

const CONTATOS = [
  {
    emoji: "🏥",
    nome: "Sede / Administração",
    endereco: "Rua Padre Bronislau Chereck, 15 — Centro, Ilhabela/SP — CEP 11.630-000",
    telefones: ["(12) 3896-1710"],
    emails: ["santacasa-ilhabela@hotmail.com", "presidencia@santacasailhabela.org.br"],
    cor: "#E3F2FD",
    corBorda: "#90CAF9",
    corTitulo: "#1565C0",
  },
  {
    emoji: "🔬",
    nome: "Laboratório de Análises Clínicas",
    endereco: "Rua Padre Bronislau Chereck, 15 — Centro, Ilhabela/SP",
    telefones: ["(12) 3895-3530"],
    emails: [],
    cor: "#E8F5E9",
    corBorda: "#A5D6A7",
    corTitulo: "#2E7D32",
  },
  {
    emoji: "🏨",
    nome: "Hospital Municipal Gov. Mario Covas",
    endereco: "Rua Padre Bronislau Chereck, 15 — Centro, Ilhabela/SP",
    telefones: ["(12) 3895-3520"],
    emails: [],
    cor: "#FFF8E1",
    corBorda: "#FFE082",
    corTitulo: "#F57F17",
  },
  {
    emoji: "🚑",
    nome: "API — Atenção Primária Integrada",
    endereco: "Ilhabela/SP",
    telefones: ["(12) 98833-1438"],
    emails: [],
    cor: "#FCE4EC",
    corBorda: "#F48FB1",
    corTitulo: "#C62828",
  },
  {
    emoji: "👥",
    nome: "Recursos Humanos",
    endereco: "Rua Padre Bronislau Chereck, 15 — Centro, Ilhabela/SP",
    telefones: ["(12) 3896-5766"],
    emails: [],
    cor: "#F3E5F5",
    corBorda: "#CE93D8",
    corTitulo: "#6A1B9A",
  },
];

function handleCall(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  Linking.openURL(`tel:${cleaned}`);
}

function handleEmail(email: string) {
  Linking.openURL(`mailto:${email}`);
}

function handleWebsite() {
  Linking.openURL("https://www.santacasailhabela.org.br");
}

export default function SobreScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleBack = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
      {/* Header com logo e botão voltar */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>
        <Image
          source={{ uri: SANTA_CASA_LOGO }}
          style={styles.headerLogo}
          contentFit="contain"
        />
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* Título da tela */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Sobre a Santa Casa</Text>
            <Text style={styles.subtitle}>
              Conheça a mais antiga instituição filantrópica de Ilhabela
            </Text>
          </View>

          {/* Card institucional */}
          <View style={styles.institucionalCard}>
            <Text style={styles.institucionalEmoji}>🏛️</Text>
            <View style={styles.institucionalInfo}>
              <Text style={styles.institucionalTitulo}>Santa Casa de Misericórdia de Ilhabela</Text>
              <Text style={styles.institucionalTexto}>
                Fundada em <Text style={styles.bold}>02 de setembro de 1943</Text>, a Santa Casa
                nasceu da iniciativa de pessoas da comunidade para oferecer saúde a um município
                que não possuía qualquer estrutura pública nessa área. Entidade civil de direito
                privado, com caráter <Text style={styles.bold}>filantrópico e sem fins lucrativos</Text>,
                atua em parceria com o SUS desde 1988.
              </Text>
            </View>
          </View>

          {/* Missão, Visão e Valores */}
          <Text style={styles.sectionTitle}>🎯 Missão, Visão e Valores</Text>
          <View style={styles.mvvContainer}>
            <View style={[styles.mvvCard, { backgroundColor: "#E3F2FD", borderColor: "#90CAF9" }]}>
              <Text style={[styles.mvvTitulo, { color: "#1565C0" }]}>🎯 Missão</Text>
              <Text style={styles.mvvTexto}>
                Prestar serviços de saúde de qualidade à população de Ilhabela e região, com
                atendimento humanizado, ético e comprometido com o bem-estar da comunidade.
              </Text>
            </View>
            <View style={[styles.mvvCard, { backgroundColor: "#E8F5E9", borderColor: "#A5D6A7" }]}>
              <Text style={[styles.mvvTitulo, { color: "#2E7D32" }]}>🔭 Visão</Text>
              <Text style={styles.mvvTexto}>
                Ser reconhecida como referência em saúde pública na região, com excelência no
                atendimento, modernização contínua e parceria sólida com o poder público e a
                comunidade.
              </Text>
            </View>
            <View style={[styles.mvvCard, { backgroundColor: "#FFF8E1", borderColor: "#FFE082" }]}>
              <Text style={[styles.mvvTitulo, { color: "#F57F17" }]}>💎 Valores</Text>
              <Text style={styles.mvvTexto}>
                Humanização · Ética · Transparência · Comprometimento com a comunidade ·
                Qualidade no atendimento · Responsabilidade social
              </Text>
            </View>
          </View>

          {/* Linha do tempo */}
          <Text style={styles.sectionTitle}>📅 Nossa História</Text>
          <View style={styles.timelineContainer}>
            {LINHA_DO_TEMPO.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: item.cor }]} />
                  {index < LINHA_DO_TEMPO.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <View style={[styles.timelineAnoBadge, { backgroundColor: item.cor }]}>
                    <Text style={styles.timelineAnoText}>{item.ano}</Text>
                  </View>
                  <Text style={styles.timelineTitulo}>{item.titulo}</Text>
                  <Text style={styles.timelineDescricao}>{item.descricao}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Números */}
          <View style={styles.numerosCard}>
            <Text style={styles.numerosTitulo}>📊 Santa Casa em números</Text>
            <View style={styles.numerosGrid}>
              <View style={styles.numeroItem}>
                <Text style={styles.numeroValor}>1943</Text>
                <Text style={styles.numeroLabel}>Ano de fundação</Text>
              </View>
              <View style={styles.numeroItem}>
                <Text style={styles.numeroValor}>80+</Text>
                <Text style={styles.numeroLabel}>Anos de história</Text>
              </View>
              <View style={styles.numeroItem}>
                <Text style={styles.numeroValor}>8+</Text>
                <Text style={styles.numeroLabel}>UBSs atendidas</Text>
              </View>
              <View style={styles.numeroItem}>
                <Text style={styles.numeroValor}>6+</Text>
                <Text style={styles.numeroLabel}>Centros de saúde</Text>
              </View>
            </View>
          </View>

          {/* Contatos */}
          <Text style={styles.sectionTitle}>🗺️ Mapa das Unidades</Text>
          <UnidadesMap height={320} />

          <Text style={styles.sectionTitle}>📞 Contatos e Unidades</Text>
          <View style={styles.contatosContainer}>
            {CONTATOS.map((contato, index) => (
              <View
                key={index}
                style={[
                  styles.contatoCard,
                  { backgroundColor: contato.cor, borderColor: contato.corBorda },
                ]}
              >
                <View style={styles.contatoHeader}>
                  <Text style={styles.contatoEmoji}>{contato.emoji}</Text>
                  <Text style={[styles.contatoNome, { color: contato.corTitulo }]}>
                    {contato.nome}
                  </Text>
                </View>
                <Text style={styles.contatoEndereco}>📍 {contato.endereco}</Text>
                {contato.telefones.map((tel, i) => (
                  <Pressable
                    key={i}
                    style={({ pressed }) => [
                      styles.contatoTelBtn,
                      { borderColor: contato.corBorda },
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => handleCall(tel)}
                  >
                    <Text style={[styles.contatoTelText, { color: contato.corTitulo }]}>
                      📱 {tel}
                    </Text>
                  </Pressable>
                ))}
                {contato.emails.map((email, i) => (
                  <Pressable
                    key={i}
                    style={({ pressed }) => [
                      styles.contatoEmailBtn,
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => handleEmail(email)}
                  >
                    <Text style={styles.contatoEmailText}>✉️ {email}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>

          {/* Website */}
          <Pressable
            style={({ pressed }) => [
              styles.websiteButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleWebsite}
          >
            <Text style={styles.websiteButtonText}>🌐 Acessar site oficial da Santa Casa</Text>
          </Pressable>

          {/* Rodapé institucional */}
          <View style={styles.rodapeCard}>
            <Text style={styles.rodapeTexto}>
              A Santa Casa de Misericórdia de Ilhabela é uma entidade filantrópica, sem fins
              lucrativos, registrada sob o CNPJ Matriz:{" "}
              <Text style={styles.bold}>50.320.605/0001-38</Text>
            </Text>
          </View>

          {/* Botão voltar ao jogo */}
          <Pressable
            style={({ pressed }) => [
              styles.voltarButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleBack}
          >
            <Text style={styles.voltarButtonText}>🚀 Voltar e iniciar a Missão</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    minWidth: 70,
  },
  backButtonText: {
    fontSize: 15,
    color: "#2E7D32",
    fontWeight: "700",
  },
  backButtonPlaceholder: {
    minWidth: 70,
  },
  headerLogo: {
    width: 130,
    height: 44,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 16,
    gap: 16,
    paddingTop: 16,
  },
  titleSection: {
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1B2631",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#546E7A",
    textAlign: "center",
    lineHeight: 20,
  },
  institucionalCard: {
    backgroundColor: "#F1F8E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#AED581",
  },
  institucionalEmoji: {
    fontSize: 32,
    marginTop: 2,
  },
  institucionalInfo: {
    flex: 1,
    gap: 8,
  },
  institucionalTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2E7D32",
    lineHeight: 22,
  },
  institucionalTexto: {
    fontSize: 13,
    color: "#37474F",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "700",
    color: "#1B2631",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1B2631",
    marginTop: 4,
  },
  mvvContainer: {
    gap: 10,
  },
  mvvCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  mvvTitulo: {
    fontSize: 15,
    fontWeight: "800",
  },
  mvvTexto: {
    fontSize: 13,
    color: "#37474F",
    lineHeight: 20,
  },
  timelineContainer: {
    gap: 0,
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 14,
    minHeight: 80,
  },
  timelineLeft: {
    alignItems: "center",
    width: 20,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
    flexShrink: 0,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 4,
    marginBottom: -4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
    gap: 4,
  },
  timelineAnoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  timelineAnoText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  timelineTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1B2631",
  },
  timelineDescricao: {
    fontSize: 13,
    color: "#546E7A",
    lineHeight: 19,
  },
  numerosCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  numerosTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1B2631",
  },
  numerosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  numeroItem: {
    flex: 1,
    minWidth: "40%",
    backgroundColor: "#F1F8E9",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  numeroValor: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2E7D32",
  },
  numeroLabel: {
    fontSize: 12,
    color: "#546E7A",
    textAlign: "center",
    lineHeight: 16,
  },
  contatosContainer: {
    gap: 10,
  },
  contatoCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    gap: 8,
  },
  contatoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contatoEmoji: {
    fontSize: 22,
  },
  contatoNome: {
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
    lineHeight: 20,
  },
  contatoEndereco: {
    fontSize: 12,
    color: "#546E7A",
    lineHeight: 18,
  },
  contatoTelBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  contatoTelText: {
    fontSize: 14,
    fontWeight: "700",
  },
  contatoEmailBtn: {
    paddingVertical: 4,
  },
  contatoEmailText: {
    fontSize: 12,
    color: "#546E7A",
    textDecorationLine: "underline",
  },
  websiteButton: {
    backgroundColor: "#1565C0",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  websiteButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  rodapeCard: {
    backgroundColor: "#ECEFF1",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#CFD8DC",
  },
  rodapeTexto: {
    fontSize: 12,
    color: "#546E7A",
    lineHeight: 18,
    textAlign: "center",
  },
  voltarButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 8,
  },
  voltarButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
