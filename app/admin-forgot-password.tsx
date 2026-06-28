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
import { enviarEmailRecuperacao } from '@/lib/password-recovery-store';

export default function AdminForgotPasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [token, setToken] = useState('');

  const validarEmail = (emailTeste: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailTeste);
  };

  const handleSolicitarRecuperacao = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu email');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Por favor, digite um email válido');
      return;
    }

    setCarregando(true);
    try {
      const tokenGerado = await enviarEmailRecuperacao(email);
      setToken(tokenGerado);
      setEnviado(true);

      Alert.alert(
        'Email Enviado',
        'Um link de recuperação foi enviado para seu email. Verifique sua caixa de entrada.'
      );
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao solicitar recuperação de senha');
    } finally {
      setCarregando(false);
    }
  };

  if (enviado) {
    return (
      <ScreenContainer className="p-0">
        <SantaCasaHeader />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="p-4 gap-4 flex-1 justify-center">
            {/* Mensagem de sucesso */}
            <View
              style={[
                styles.successBox,
                { backgroundColor: '#DCFCE7', borderLeftColor: '#22C55E' },
              ]}
            >
              <Text style={{ fontSize: 32, marginBottom: 8 }}>✅</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#166534',
                  marginBottom: 8,
                }}
              >
                Email Enviado com Sucesso!
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#15803D',
                  lineHeight: 20,
                }}
              >
                Um link de recuperação de senha foi enviado para:{'\n'}
                <Text style={{ fontWeight: '600' }}>{email}</Text>
                {'\n\n'}
                Clique no link no email para redefinir sua senha. O link expira em 24 horas.
              </Text>
            </View>

            {/* Token para referência (em desenvolvimento) */}
            <View
              style={[
                styles.infoBox,
                { backgroundColor: '#F3F4F6', borderLeftColor: '#6B7280' },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: 4,
                }}
              >
                🔧 Token de Teste (Desenvolvimento):
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: '#6B7280',
                  fontFamily: 'monospace',
                  marginBottom: 8,
                }}
              >
                {token}
              </Text>
              <Text style={{ fontSize: 10, color: '#9CA3AF' }}>
                Use este token na tela de reset de senha para testar
              </Text>
            </View>

            {/* Botões */}
            <View style={{ gap: 8, marginTop: 16 }}>
              <Pressable
                onPress={() => router.push('/admin-reset-password')}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: '#3B82F6',
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={styles.buttonText}>🔑 Redefinir Senha com Token</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/admin-login')}
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
                  ← Voltar ao Login
                </Text>
              </Pressable>
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
              🔐 Recuperar Senha
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
              Digite seu email para receber um link de recuperação
            </Text>
          </View>

          {/* Card de recuperação */}
          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Campo de email */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Email do Administrador
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
                  placeholder="admin@santacasa.com"
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  editable={!carregando}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>
              <Text style={[styles.helperText, { color: colors.muted }]}>
                Você receberá um email com instruções para redefinir sua senha
              </Text>
            </View>

            {/* Botão de envio */}
            <Pressable
              onPress={handleSolicitarRecuperacao}
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
                <Text style={styles.buttonText}>📧 Enviar Link de Recuperação</Text>
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

          {/* Informações de segurança */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: '#FEF3C7', borderLeftColor: '#F59E0B' },
            ]}
          >
            <Text style={styles.infoTitle}>⚠️ Informações Importantes</Text>
            <Text style={styles.infoText}>
              • O link de recuperação expira em 24 horas{'\n'}• Verifique sua caixa
              de spam{'\n'}• Não compartilhe o link com ninguém{'\n'}• Se não receber
              o email, tente novamente
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
  },
  input: {
    fontSize: 16,
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
    shadowColor: '#3B82F6',
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
  successBox: {
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    gap: 4,
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
