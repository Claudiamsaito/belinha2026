import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { SantaCasaHeader } from '@/components/santa-casa-header';
import { useColors } from '@/hooks/use-colors';
import { obterEstadoAuth, alterarSenha } from '@/lib/admin-auth-store';

export default function AdminSettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [nomeAdmin, setNomeAdmin] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');

  useEffect(() => {
    carregarInfoAdmin();
  }, []);

  const carregarInfoAdmin = async () => {
    try {
      const estado = await obterEstadoAuth();
      setNomeAdmin(estado.username || 'Administrador');
      setEmailAdmin(estado.email || '');
    } catch (error) {
      console.error('Erro ao carregar informações do admin:', error);
    }
  };

  const validarSenha = (senha: string): boolean => {
    // Mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
  };

  const handleAlterarSenha = async () => {
    // Validações
    if (!senhaAtual.trim()) {
      Alert.alert('Erro', 'Por favor, digite sua senha atual');
      return;
    }

    if (!novaSenha.trim()) {
      Alert.alert('Erro', 'Por favor, digite a nova senha');
      return;
    }

    if (!confirmarSenha.trim()) {
      Alert.alert('Erro', 'Por favor, confirme a nova senha');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }

    if (senhaAtual === novaSenha) {
      Alert.alert('Erro', 'A nova senha deve ser diferente da senha atual');
      return;
    }

    if (!validarSenha(novaSenha)) {
      Alert.alert(
        'Senha fraca',
        'A senha deve ter:\n• Mínimo 8 caracteres\n• Pelo menos 1 letra maiúscula\n• Pelo menos 1 letra minúscula\n• Pelo menos 1 número\n• Pelo menos 1 caractere especial (@$!%*?&)'
      );
      return;
    }

    setCarregando(true);
    try {
      await alterarSenha(senhaAtual, novaSenha);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Ocorreu um erro ao alterar a senha');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <SantaCasaHeader />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4 gap-4">
          {/* Cabeçalho */}
          <View style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.foreground,
              }}
            >
              ⚙️ Configurações
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
              Usuário: <Text style={{ fontWeight: '600' }}>{nomeAdmin}</Text>
            </Text>
            {emailAdmin ? (
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                {emailAdmin}
              </Text>
            ) : null}
          </View>

          {/* Card de alteração de senha */}
          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.foreground,
                marginBottom: 16,
              }}
            >
              🔐 Alterar Senha
            </Text>

            {/* Campo de senha atual */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Senha Atual
              </Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="Digite sua senha atual"
                  placeholderTextColor={colors.muted}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  secureTextEntry={!mostrarSenhas}
                  editable={!carregando}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  onPress={() => setMostrarSenhas(!mostrarSenhas)}
                  disabled={carregando}
                >
                  <Text style={styles.toggleSenhaText}>
                    {mostrarSenhas ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Campo de nova senha */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Nova Senha
              </Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="Digite a nova senha"
                  placeholderTextColor={colors.muted}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  secureTextEntry={!mostrarSenhas}
                  editable={!carregando}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <Text style={[styles.helperText, { color: colors.muted }]}>
                • Mínimo 8 caracteres
                {'\n'}• 1 letra maiúscula, 1 minúscula
                {'\n'}• 1 número e 1 caractere especial (@$!%*?&)
              </Text>
            </View>

            {/* Campo de confirmação */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Confirmar Nova Senha
              </Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="Confirme a nova senha"
                  placeholderTextColor={colors.muted}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!mostrarSenhas}
                  editable={!carregando}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Botões de ação */}
            <View style={{ gap: 8, marginTop: 16 }}>
              <Pressable
                onPress={handleAlterarSenha}
                disabled={carregando}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: carregando ? colors.muted : '#2E7D32',
                    opacity: pressed && !carregando ? 0.8 : 1,
                  },
                ]}
              >
                {carregando ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.buttonText}>✓ Salvar Nova Senha</Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => router.push('/admin-audit-logs')}
                disabled={carregando}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: '#8B5CF6',
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={styles.buttonText}>📋 Ver Logs de Auditoria</Text>
              </Pressable>

              <Pressable
                onPress={() => router.back()}
                disabled={carregando}
                style={({ pressed }) => [
                  styles.buttonSecondary,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.buttonSecondaryText,
                    { color: colors.primary },
                  ]}
                >
                  ← Voltar
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Informações de segurança */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: '#FEF3C7', borderLeftColor: '#F59E0B' },
            ]}
          >
            <Text style={styles.infoTitle}>⚠️ Dicas de Segurança</Text>
            <Text style={styles.infoText}>
              • Use uma senha forte e única{'\n'}• Não compartilhe sua senha com
              ninguém{'\n'}• Altere sua senha regularmente{'\n'}• Faça logout ao
              terminar
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  passwordContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  toggleSenhaText: {
    fontSize: 18,
    marginLeft: 8,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  buttonSecondary: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 12,
    gap: 4,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  infoText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
});
