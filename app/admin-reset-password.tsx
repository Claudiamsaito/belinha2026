'use client';

import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { validarTokenRecuperacao, usarTokenRecuperacao } from '@/lib/password-recovery-store';
import { alterarSenha } from '@/lib/admin-auth-store';

export default function AdminResetPasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [etapa, setEtapa] = useState<'token' | 'senha'>('token');

  const validarSenha = (senha: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
  };

  const handleValidarToken = async () => {
    if (!token.trim()) {
      Alert.alert('Erro', 'Por favor, digite o token de recuperação');
      return;
    }

    setCarregando(true);
    try {
      const tokenValido = await validarTokenRecuperacao(token);

      if (tokenValido) {
        setEtapa('senha');
        Alert.alert('Sucesso', 'Token válido! Agora defina sua nova senha.');
      } else {
        Alert.alert('Erro', 'Token inválido ou expirado. Solicite um novo link.');
      }
    } catch (error) {
      console.error('Erro ao validar token:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao validar o token');
    } finally {
      setCarregando(false);
    }
  };

  const handleRedefinirSenha = async () => {
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

    if (!validarSenha(novaSenha)) {
      Alert.alert(
        'Senha fraca',
        'A senha deve ter:\n• Mínimo 8 caracteres\n• Pelo menos 1 letra maiúscula\n• Pelo menos 1 letra minúscula\n• Pelo menos 1 número\n• Pelo menos 1 caractere especial (@$!%*?&)'
      );
      return;
    }

    setCarregando(true);
    try {
      // Usar token para marcar como usado
      const tokenUsado = await usarTokenRecuperacao(token);

      if (!tokenUsado) {
        Alert.alert('Erro', 'Token inválido ou já foi utilizado');
        return;
      }

      // Alterar senha com senha vazia como "anterior" (simulação)
      const sucesso = await alterarSenha('SantaCasa2024!', novaSenha);

      if (sucesso) {
        Alert.alert('Sucesso', 'Senha redefinida com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/admin-login');
            },
          },
        ]);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao redefinir a senha');
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao redefinir a senha');
    } finally {
      setCarregando(false);
    }
  };

  if (etapa === 'token') {
    return (
      <ScreenContainer className="p-0">
        <SantaCasaHeader />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="p-4 gap-4 flex-1 justify-center">
            {/* Cabeçalho */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: colors.foreground,
                }}
              >
                🔑 Redefinir Senha
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                Digite o token que você recebeu por email
              </Text>
            </View>

            {/* Card de token */}
            <View
              style={[
                styles.cardContainer,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              {/* Campo de token */}
              <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: colors.foreground }]}>
                  Token de Recuperação
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.foreground,
                      },
                    ]}
                    placeholder="Cole o token do email aqui"
                    placeholderTextColor={colors.muted}
                    value={token}
                    onChangeText={setToken}
                    editable={!carregando}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Botão de validação */}
              <Pressable
                onPress={handleValidarToken}
                disabled={carregando}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: carregando ? colors.muted : '#3B82F6',
                    opacity: pressed && !carregando ? 0.8 : 1,
                  },
                ]}
              >
                {carregando ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.buttonText}>✓ Validar Token</Text>
                )}
              </Pressable>

              {/* Botão voltar */}
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

            {/* Informações */}
            <View
              style={[
                styles.infoBox,
                { backgroundColor: '#FEF3C7', borderLeftColor: '#F59E0B' },
              ]}
            >
              <Text style={styles.infoTitle}>ℹ️ Dica</Text>
              <Text style={styles.infoText}>
                O token foi enviado para seu email. Copie e cole aqui para continuar.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <SantaCasaHeader />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4 gap-4">
          {/* Cabeçalho */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.foreground,
              }}
            >
              🔐 Nova Senha
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
              Defina uma nova senha forte para sua conta
            </Text>
          </View>

          {/* Card de senha */}
          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Campo de nova senha */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Nova Senha
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
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
                <Pressable
                  onPress={() => setMostrarSenhas(!mostrarSenhas)}
                  disabled={carregando}
                >
                  <Text style={styles.toggleSenhaText}>
                    {mostrarSenhas ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </Pressable>
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
                Confirmar Senha
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
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

            {/* Botão de redefinição */}
            <Pressable
              onPress={handleRedefinirSenha}
              disabled={carregando}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: carregando ? colors.muted : '#22C55E',
                  opacity: pressed && !carregando ? 0.8 : 1,
                },
              ]}
            >
              {carregando ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>✓ Redefinir Senha</Text>
              )}
            </Pressable>

            {/* Botão voltar */}
            <Pressable
              onPress={() => setEtapa('token')}
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

          {/* Informações de segurança */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: '#FEF3C7', borderLeftColor: '#F59E0B' },
            ]}
          >
            <Text style={styles.infoTitle}>⚠️ Segurança</Text>
            <Text style={styles.infoText}>
              • Use uma senha única{'\n'}• Não compartilhe sua senha{'\n'}• Altere
              regularmente
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
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
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
    shadowColor: '#22C55E',
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
    borderLeftWidth: 4,
    borderRadius: 12,
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
