'use client';

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
  Image,
  Platform,
  Linking,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { login, loginComToken } from '@/lib/admin-auth-store';
import { registrarAuditoriaBackend, getGoogleAuthUrl, loginComGoogleToken } from '@/lib/api';

WebBrowser.maybeCompleteAuthSession();

const SANTA_CASA_LOGO =
  'https://storage.googleapis.com/manus-public-assets/2025-02-26/4e8c8c3a-7e3e-4f5e-9e3e-4f5e9e3e4f5e/logopng.png';

export default function AdminLoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  // Listener para callback OAuth via deep link ou parâmetro de URL (web)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const nomeParam = params.get('nome');
      const erroParam = params.get('erro');

      if (token) {
        _processarTokenGoogle(token, nomeParam || 'Admin');
      } else if (erroParam) {
        setErro(_traduzirErroOAuth(erroParam));
      }
    }
  }, []);

  const _traduzirErroOAuth = (erro: string): string => {
    const mapa: Record<string, string> = {
      oauth_cancelado: 'Login com Google foi cancelado.',
      oauth_token_falhou: 'Falha ao obter token do Google. Tente novamente.',
      email_nao_autorizado: 'Este email não tem permissão de acesso admin.',
    };
    return mapa[erro] || 'Erro no login com Google.';
  };

  const _processarTokenGoogle = async (token: string, nome: string) => {
    setCarregandoGoogle(true);
    try {
      await loginComToken(token, {
        id: 0,
        email: '',
        nome,
        role: 'admin',
      });
      // Limpa parâmetros da URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname);
      }
      router.replace('/dashboard');
    } catch {
      setErro('Erro ao processar login Google.');
    } finally {
      setCarregandoGoogle(false);
    }
  };

  const handleLogin = async () => {
    setErro('');
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha email e senha');
      return;
    }

    setCarregando(true);
    try {
      const sucesso = await login(email.trim().toLowerCase(), senha);
      if (sucesso) {
        await registrarAuditoriaBackend('LOGIN', 'Login via email/senha');
        setEmail('');
        setSenha('');
        router.replace('/dashboard');
      } else {
        setErro('Email ou senha incorretos');
      }
    } catch {
      setErro('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    } finally {
      setCarregando(false);
    }
  };

  const handleLoginGoogle = async () => {
    setErro('');
    setCarregandoGoogle(true);
    try {
      const googleUrl = await getGoogleAuthUrl();

      if (Platform.OS === 'web') {
        // Web: redireciona para Google
        window.location.href = googleUrl;
      } else {
        // Mobile: abre no browser do sistema
        const result = await WebBrowser.openAuthSessionAsync(
          googleUrl,
          'missao-saude://oauth/callback'
        );

        if (result.type === 'success' && result.url) {
          const url = new URL(result.url);
          const token = url.searchParams.get('token');
          const nome = url.searchParams.get('nome') || 'Admin';
          if (token) {
            await _processarTokenGoogle(token, nome);
            return;
          }
        }
        setErro('Login com Google cancelado ou falhou.');
      }
    } catch (e: any) {
      if (e?.message?.includes('não configurado')) {
        setErro('Google OAuth não configurado no servidor. Use email/senha.');
      } else {
        setErro('Erro ao iniciar login com Google.');
      }
    } finally {
      setCarregandoGoogle(false);
    }
  };

  const isCarregando = carregando || carregandoGoogle;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Image source={{ uri: SANTA_CASA_LOGO }} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.title, { color: colors.foreground }]}>Acesso Administrativo</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>Dashboard de Avaliações</Text>
          </View>

          {/* Formulário */}
          <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>

            {/* Botão Google */}
            <Pressable
              onPress={handleLoginGoogle}
              disabled={isCarregando}
              style={({ pressed }) => [
                styles.googleButton,
                pressed && { opacity: 0.8 },
                isCarregando && { opacity: 0.5 },
              ]}
            >
              {carregandoGoogle ? (
                <ActivityIndicator color="#3C4043" size="small" />
              ) : (
                <>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>Entrar com Google</Text>
                </>
              )}
            </Pressable>

            {/* Divisor */}
            <View style={styles.divisorContainer}>
              <View style={[styles.divisorLinha, { backgroundColor: colors.border }]} />
              <Text style={[styles.divisorTexto, { color: colors.muted }]}>ou</Text>
              <View style={[styles.divisorLinha, { backgroundColor: colors.border }]} />
            </View>

            {/* Campo email */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.foreground }]}>📧 Email</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.background }]}
                placeholder="admin@santacasa.ilhabela.sp.gov.br"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                editable={!isCarregando}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            {/* Campo senha */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.foreground }]}>🔐 Senha</Text>
              <View style={[styles.passwordContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <TextInput
                  style={[styles.passwordInput, { color: colors.foreground }]}
                  placeholder="Digite sua senha"
                  placeholderTextColor={colors.muted}
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  editable={!isCarregando}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} disabled={isCarregando}>
                  <Text style={styles.toggleSenhaText}>{mostrarSenha ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
              </View>
            </View>

            {/* Mensagem de erro */}
            {!!erro && (
              <View style={styles.erroBox}>
                <Text style={styles.erroTexto}>⚠️ {erro}</Text>
              </View>
            )}

            {/* Botão login */}
            <Pressable
              onPress={handleLogin}
              disabled={isCarregando}
              style={({ pressed }) => [
                styles.loginButton,
                { backgroundColor: isCarregando ? colors.muted : '#2E7D32', opacity: pressed && !isCarregando ? 0.8 : 1 },
              ]}
            >
              {carregando ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>🔓 Entrar com Email</Text>
              )}
            </Pressable>

            {/* Aviso segurança */}
            <View style={[styles.infoBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.infoTitle}>⚠️ Segurança</Text>
              <Text style={styles.infoText}>
                Acesso restrito a administradores autorizados. Não compartilhe suas credenciais.
              </Text>
            </View>
          </View>

          {/* Links inferiores */}
          <Pressable
            onPress={() => router.push('/admin-forgot-password')}
            disabled={isCarregando}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          >
            <Text style={[styles.backButtonText, { color: colors.primary }]}>
              🔑 Esqueci minha senha
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          >
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  headerContainer: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  logo: { width: 200, height: 60, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, fontWeight: '500' },
  formContainer: { borderRadius: 16, padding: 20, gap: 16, marginBottom: 24 },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DADCE0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  googleIcon: { fontSize: 18, fontWeight: '700', color: '#4285F4' },
  googleButtonText: { fontSize: 15, fontWeight: '600', color: '#3C4043' },
  divisorContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  divisorLinha: { flex: 1, height: 1 },
  divisorTexto: { fontSize: 13, fontWeight: '500' },
  fieldContainer: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
  },
  passwordContainer: {
    borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  passwordInput: { flex: 1, fontSize: 16 },
  toggleSenhaText: { fontSize: 18, marginLeft: 8 },
  erroBox: {
    backgroundColor: '#FEE2E2', borderRadius: 8, padding: 12,
    borderLeftWidth: 4, borderLeftColor: '#EF4444',
  },
  erroTexto: { fontSize: 13, color: '#B91C1C', fontWeight: '500' },
  loginButton: {
    borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
    shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  loginButtonText: { fontSize: 16, fontWeight: '700', color: 'white' },
  infoBox: { borderRadius: 12, padding: 12, gap: 4, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  infoTitle: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  infoText: { fontSize: 12, color: '#78350F', lineHeight: 18 },
  backButton: { paddingVertical: 12, alignItems: 'center' },
  backButtonText: { fontSize: 14, fontWeight: '600' },
});
