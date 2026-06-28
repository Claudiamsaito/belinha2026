import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { SantaCasaHeader } from "@/components/santa-casa-header";
import { StarRating, DistribuicaoBar } from "@/components/star-rating";
import {
  salvarAvaliacao,
  obterStatsUnidade,
  carregarAvaliacoes,
  excluirAvaliacao,
  type Avaliacao,
  type UnidadeStats,
} from "@/lib/avaliacoes-store";
import { UNIDADES, CATEGORIA_CONFIG } from "@/components/unidades-map";
import { salvarAvaliacaoBackend } from "@/lib/api";

const BELINHA_URL =
  "https://static.manus.space/webdev/missao-saude-ilhabela/Belinhasemfundo.png";

// Estrutura das 5 perguntas do Google Forms
type RespostaFormulario = {
  atendimentoRecepcao: number; // 1-5
  tempoEsperaRecepcao: number; // 1-5
  tempoEsperaConsulta: number; // 1-5
  infraestrutura: number; // 1-5
  elogioRetorno: "retornoRapido" | "retornoDemorado" | "nunca" | "naoFez";
  comentario: string;
};

const OPCOES_RESPOSTA = [
  { label: "Ótimo", value: 5, color: "#22C55E" },
  { label: "Bom", value: 4, color: "#84CC16" },
  { label: "Regular", value: 3, color: "#EAB308" },
  { label: "Ruim", value: 2, color: "#F97316" },
  { label: "Péssimo", value: 1, color: "#EF4444" },
  { label: "Não sabe", value: 0, color: "#9CA3AF" },
];

const OPCOES_RETORNO = [
  { label: "Tive retorno rápido", value: "retornoRapido" },
  { label: "Tive retorno demorado", value: "retornoDemorado" },
  { label: "Nunca tive retorno", value: "nunca" },
  { label: "Nunca fiz", value: "naoFez" },
];

export default function AvaliacaoScreen() {
  const { unidadeId } = useLocalSearchParams<{ unidadeId: string }>();
  const router = useRouter();

  const unidade = UNIDADES.find((u) => u.id === unidadeId);
  const cfg = unidade ? CATEGORIA_CONFIG[unidade.categoria] : null;

  // Form state
  const [respostas, setRespostas] = useState<RespostaFormulario>({
    atendimentoRecepcao: 0,
    tempoEsperaRecepcao: 0,
    tempoEsperaConsulta: 0,
    infraestrutura: 0,
    elogioRetorno: "naoFez",
    comentario: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [stats, setStats] = useState<UnidadeStats | null>(null);
  const [historico, setHistorico] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<"avaliar" | "historico">("avaliar");

  const carregarDados = useCallback(async () => {
    if (!unidadeId) return;
    setCarregando(true);
    const [s, todas] = await Promise.all([
      obterStatsUnidade(unidadeId),
      carregarAvaliacoes(),
    ]);
    setStats(s);
    setHistorico(todas.filter((a) => a.unidadeId === unidadeId).reverse());
    setCarregando(false);
  }, [unidadeId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const todasRespostasPreenchidas =
    respostas.atendimentoRecepcao > 0 &&
    respostas.tempoEsperaRecepcao > 0 &&
    respostas.tempoEsperaConsulta > 0 &&
    respostas.infraestrutura > 0;

  const handleEnviar = async () => {
    if (!todasRespostasPreenchidas) {
      Alert.alert(
        "Avaliação incompleta",
        "Por favor, responda todas as 4 perguntas antes de enviar."
      );
      return;
    }
    if (!unidadeId) return;

    setEnviando(true);
    if (Platform.OS !== "web")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // Salvar localmente (AsyncStorage) — garante offline
      await salvarAvaliacao(
        unidadeId,
        {
          atendimento: respostas.atendimentoRecepcao,
          limpeza: respostas.infraestrutura,
          tempoEspera: respostas.tempoEsperaRecepcao,
          estrutura: respostas.infraestrutura,
        },
        respostas.comentario
      );

      // Enviar para backend Flask (não bloqueia se falhar)
      salvarAvaliacaoBackend({
        unidade_id: unidadeId,
        atendimento_recepcao: respostas.atendimentoRecepcao,
        tempo_espera_recepcao: respostas.tempoEsperaRecepcao,
        tempo_espera_consulta: respostas.tempoEsperaConsulta,
        infraestrutura: respostas.infraestrutura,
        elogio_retorno: respostas.elogioRetorno,
        comentario: respostas.comentario,
      }).catch(() => {/* offline — ok, já salvou local */});

      setEnviado(true);
      await carregarDados();
      setTimeout(() => {
        setEnviando(false);
        Alert.alert(
          "Obrigado!",
          "Sua avaliação foi registrada com sucesso.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }, 800);
    } catch (error) {
      setEnviando(false);
      Alert.alert("Erro", "Não foi possível enviar a avaliação. Tente novamente.");
    }
  };

  if (carregando) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <SantaCasaHeader />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4 gap-4">
          {/* Belinha com instrução */}
          <View className="flex-row gap-3 items-flex-start">
            <Image
              source={{ uri: BELINHA_URL }}
              style={{ width: 80, height: 120 }}
              contentFit="contain"
            />
            <View
              style={{
                flex: 1,
                backgroundColor: "#E0F2FE",
                borderRadius: 12,
                padding: 12,
                borderLeftWidth: 4,
                borderLeftColor: "#0284C7",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#0c4a6e",
                  fontWeight: "600",
                  lineHeight: 20,
                }}
              >
                Sua opinião é importante! Responda as 4 perguntas abaixo sobre
                sua experiência na {unidade?.nome}.
              </Text>
            </View>
          </View>

          {/* Abas */}
          <View className="flex-row gap-2 border-b border-border">
            <Pressable
              onPress={() => setAbaAtiva("avaliar")}
              style={[
                styles.abaBotao,
                abaAtiva === "avaliar" && styles.abaAtivaBotao,
              ]}
            >
              <Text
                style={[
                  styles.abaTexto,
                  abaAtiva === "avaliar" && styles.abaAtivaTexto,
                ]}
              >
                📝 Avaliar
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAbaAtiva("historico")}
              style={[
                styles.abaBotao,
                abaAtiva === "historico" && styles.abaAtivaBotao,
              ]}
            >
              <Text
                style={[
                  styles.abaTexto,
                  abaAtiva === "historico" && styles.abaAtivaTexto,
                ]}
              >
                📊 Histórico ({historico.length})
              </Text>
            </Pressable>
          </View>

          {abaAtiva === "avaliar" ? (
            <>
              {/* Pergunta 1 */}
              <View style={styles.perguntaCard}>
                <Text style={styles.perguntaTitulo}>
                  1️⃣ Como você avalia o ATENDIMENTO recebido pela RECEPCIONISTA?
                </Text>
                <View style={styles.opcoesFila}>
                  {OPCOES_RESPOSTA.map((opt) => (
                    <Pressable
                      key={opt.value}
                      onPress={() =>
                        setRespostas({
                          ...respostas,
                          atendimentoRecepcao: opt.value,
                        })
                      }
                      style={[
                        styles.opcaoBotao,
                        respostas.atendimentoRecepcao === opt.value &&
                          styles.opcaoSelecionada,
                        { borderColor: opt.color },
                      ]}
                    >
                      <Text
                        style={[
                          styles.opcaoTexto,
                          respostas.atendimentoRecepcao === opt.value && {
                            color: opt.color,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Pergunta 2 */}
              <View style={styles.perguntaCard}>
                <Text style={styles.perguntaTitulo}>
                  2️⃣ Como você avalia o TEMPO que ESPEROU para ser ATENDIDO na
                  recepção?
                </Text>
                <View style={styles.opcoesFila}>
                  {OPCOES_RESPOSTA.map((opt) => (
                    <Pressable
                      key={opt.value}
                      onPress={() =>
                        setRespostas({
                          ...respostas,
                          tempoEsperaRecepcao: opt.value,
                        })
                      }
                      style={[
                        styles.opcaoBotao,
                        respostas.tempoEsperaRecepcao === opt.value &&
                          styles.opcaoSelecionada,
                        { borderColor: opt.color },
                      ]}
                    >
                      <Text
                        style={[
                          styles.opcaoTexto,
                          respostas.tempoEsperaRecepcao === opt.value && {
                            color: opt.color,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Pergunta 3 */}
              <View style={styles.perguntaCard}>
                <Text style={styles.perguntaTitulo}>
                  3️⃣ Como você avalia o tempo de ESPERA entre o AGENDAMENTO e a
                  Consulta?
                </Text>
                <View style={styles.opcoesFila}>
                  {OPCOES_RESPOSTA.map((opt) => (
                    <Pressable
                      key={opt.value}
                      onPress={() =>
                        setRespostas({
                          ...respostas,
                          tempoEsperaConsulta: opt.value,
                        })
                      }
                      style={[
                        styles.opcaoBotao,
                        respostas.tempoEsperaConsulta === opt.value &&
                          styles.opcaoSelecionada,
                        { borderColor: opt.color },
                      ]}
                    >
                      <Text
                        style={[
                          styles.opcaoTexto,
                          respostas.tempoEsperaConsulta === opt.value && {
                            color: opt.color,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Pergunta 4 */}
              <View style={styles.perguntaCard}>
                <Text style={styles.perguntaTitulo}>
                  4️⃣ Como você avalia a INFRAESTRUTURA e a CONSERVAÇÃO de
                  Unidade de Saúde (limpeza, espaço, ventilação, acessibilidade,
                  sinalização, etc.)?
                </Text>
                <View style={styles.opcoesFila}>
                  {OPCOES_RESPOSTA.map((opt) => (
                    <Pressable
                      key={opt.value}
                      onPress={() =>
                        setRespostas({
                          ...respostas,
                          infraestrutura: opt.value,
                        })
                      }
                      style={[
                        styles.opcaoBotao,
                        respostas.infraestrutura === opt.value &&
                          styles.opcaoSelecionada,
                        { borderColor: opt.color },
                      ]}
                    >
                      <Text
                        style={[
                          styles.opcaoTexto,
                          respostas.infraestrutura === opt.value && {
                            color: opt.color,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Pergunta 5 - Elogio/Sugestão */}
              <View style={styles.perguntaCard}>
                <Text style={styles.perguntaTitulo}>
                  5️⃣ Você já fez algum ELOGIO, SUGESTÃO ou COMENTÁRIO para esta
                  Unidade de Saúde? Teve RETORNO?
                </Text>
                <View style={styles.opcoesFila}>
                  {OPCOES_RETORNO.map((opt) => (
                    <Pressable
                      key={opt.value}
                      onPress={() =>
                        setRespostas({
                          ...respostas,
                          elogioRetorno: opt.value as any,
                        })
                      }
                      style={[
                        styles.opcaoBotao,
                        respostas.elogioRetorno === opt.value &&
                          styles.opcaoSelecionada,
                      ]}
                    >
                      <Text
                        style={[
                          styles.opcaoTexto,
                          respostas.elogioRetorno === opt.value && {
                            color: "#0284C7",
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Comentário opcional */}
              <View style={styles.perguntaCard}>
                <Text style={styles.perguntaTitulo}>
                  💬 Gostaria de deixar algum ELOGIO, SUGESTÃO ou COMENTÁRIO
                  sobre o atendimento que recebeu na RECEPÇÃO? (opcional)
                </Text>
                <TextInput
                  style={styles.comentarioInput}
                  placeholder="Digite seu comentário..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  value={respostas.comentario}
                  onChangeText={(text) =>
                    setRespostas({ ...respostas, comentario: text })
                  }
                />
              </View>

              {/* Botão Enviar */}
              <Pressable
                onPress={handleEnviar}
                disabled={!todasRespostasPreenchidas || enviando}
                style={[
                  styles.botaoEnviar,
                  (!todasRespostasPreenchidas || enviando) &&
                    styles.botaoEnviarDesabilitado,
                ]}
              >
                {enviando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.botaoEnviarTexto}>
                    ✅ Enviar Avaliação
                  </Text>
                )}
              </Pressable>

              <View style={{ height: 20 }} />
            </>
          ) : (
            <>
              {/* Histórico */}
              {historico.length === 0 ? (
                <View style={styles.vazio}>
                  <Text style={styles.vazioTexto}>
                    Nenhuma avaliação registrada ainda.
                  </Text>
                </View>
              ) : (
                historico.map((av, idx) => (
                  <View key={idx} style={styles.itemHistorico}>
                    <View style={styles.itemCabecalho}>
                      <Text style={styles.itemData}>
                        {new Date(av.data).toLocaleDateString("pt-BR")}
                      </Text>
                      <Text style={styles.itemMedia}>
                        ⭐ {av.nota.toFixed(1)}
                      </Text>
                    </View>
                    {av.comentario && (
                      <Text style={styles.itemComentario}>"{av.comentario}"</Text>
                    )}
                    <Pressable
                      onPress={() => excluirAvaliacao(av.id)}
                      style={styles.botaoExcluir}
                    >
                      <Text style={styles.botaoExcluirTexto}>🗑️ Excluir</Text>
                    </Pressable>
                  </View>
                ))
              )}
              <View style={{ height: 20 }} />
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  abaBotao: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  abaAtivaBotao: {
    borderBottomColor: "#0a7ea4",
  },
  abaTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#687076",
  },
  abaAtivaTexto: {
    color: "#0a7ea4",
  },
  perguntaCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0a7ea4",
  },
  perguntaTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 12,
    lineHeight: 22,
  },
  opcoesFila: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  opcaoBotao: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  opcaoSelecionada: {
    backgroundColor: "#f0f9ff",
    borderWidth: 2,
  },
  opcaoTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: "#687076",
  },
  comentarioInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#11181C",
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  botaoEnviar: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  botaoEnviarDesabilitado: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  botaoEnviarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  vazio: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  vazioTexto: {
    fontSize: 14,
    color: "#687076",
  },
  itemHistorico: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemCabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemData: {
    fontSize: 12,
    color: "#687076",
  },
  itemMedia: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0a7ea4",
  },
  itemComentario: {
    fontSize: 13,
    color: "#11181C",
    fontStyle: "italic",
    marginBottom: 8,
  },
  botaoExcluir: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fee2e2",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  botaoExcluirTexto: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "600",
  },
});
