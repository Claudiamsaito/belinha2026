import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loginComEmailSenha,
  verificarTokenBackend,
  logoutBackend,
  setToken,
  clearToken,
  alterarSenhaBackend,
  type AdminInfo,
} from "./api";

const AUTH_KEY = "@missao_saude:admin_auth";

export interface AdminAuthState {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  loginTime: number | null;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function verificarAutenticacao(): Promise<boolean> {
  try {
    const info = await verificarTokenBackend();
    if (info) {
      // Atualiza cache local
      await AsyncStorage.setItem(
        AUTH_KEY,
        JSON.stringify({
          isAuthenticated: true,
          username: info.nome,
          email: info.email,
          loginTime: Date.now(),
        })
      );
      return true;
    }
  } catch {}

  // Fallback: verifica cache local (offline)
  try {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const state: AdminAuthState = JSON.parse(raw);
    const umDia = 24 * 60 * 60 * 1000;
    if (state.loginTime && Date.now() - state.loginTime > umDia) {
      await logout();
      return false;
    }
    return state.isAuthenticated;
  } catch {
    return false;
  }
}

export async function login(emailOrUsuario: string, senha: string): Promise<boolean> {
  try {
    // Tenta email direto ou constrói email padrão para usuários legados
    const email = emailOrUsuario.includes("@")
      ? emailOrUsuario
      : `${emailOrUsuario}@santacasa.ilhabela.sp.gov.br`;

    const result = await loginComEmailSenha(email, senha);
    await setToken(result.token);
    await AsyncStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        isAuthenticated: true,
        username: result.admin.nome,
        email: result.admin.email,
        loginTime: Date.now(),
      })
    );
    return true;
  } catch {
    return false;
  }
}

export async function loginComToken(token: string, admin: AdminInfo): Promise<void> {
  await setToken(token);
  await AsyncStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      isAuthenticated: true,
      username: admin.nome,
      email: admin.email,
      loginTime: Date.now(),
    })
  );
}

export async function logout(): Promise<void> {
  await logoutBackend();
  await clearToken();
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function obterEstadoAuth(): Promise<AdminAuthState> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { isAuthenticated: false, username: null, email: null, loginTime: null };
}

export async function alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
  await alterarSenhaBackend(senhaAtual, novaSenha);
}

// Mantido por compatibilidade — não faz nada no novo fluxo
export async function carregarSenhaArmazenada(): Promise<void> {}
