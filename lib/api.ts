import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@missao_saude:admin_jwt";

// URL base do backend Flask
function getBackendUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_FLASK_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  if (Platform.OS === "web" && typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    // Expo roda na 8081, Flask na 5000
    const apiHost = hostname.replace(/^8081-/, "5000-");
    if (apiHost !== hostname) return `${protocol}//${apiHost}`;
    // localhost: troca porta
    if (hostname === "localhost") return `${protocol}//localhost:5000`;
  }

  return "http://localhost:5000";
}

async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = false
): Promise<T> {
  const base = getBackendUrl();
  const url = `${base}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (requireAuth) {
    const token = await getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(url, { ...options, headers });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ erro: resp.statusText }));
    throw new Error((err as any).erro || `Erro ${resp.status}`);
  }

  return resp.json() as Promise<T>;
}

// ─── Avaliações ───────────────────────────────────────────────────────────────

export interface AvaliacaoPayload {
  unidade_id: string;
  atendimento_recepcao: number;
  tempo_espera_recepcao: number;
  tempo_espera_consulta: number;
  infraestrutura: number;
  elogio_retorno: string;
  comentario?: string;
}

export async function salvarAvaliacaoBackend(data: AvaliacaoPayload): Promise<void> {
  await apiFetch("/api/avaliacoes", { method: "POST", body: JSON.stringify(data) });
}

export async function obterTodasAvaliacoesBackend(periodo?: string): Promise<any[]> {
  const q = periodo ? `?periodo=${periodo}` : "";
  return apiFetch(`/api/avaliacoes${q}`, {}, true);
}

export async function obterAvaliacoesUnidade(unidadeId: string): Promise<any[]> {
  return apiFetch(`/api/avaliacoes/unidade/${unidadeId}`);
}

export async function obterStatsUnidadeBackend(
  unidadeId: string,
  periodo?: string
): Promise<any> {
  const q = periodo ? `?periodo=${periodo}` : "";
  return apiFetch(`/api/avaliacoes/stats/${unidadeId}${q}`);
}

export async function obterTodasStatsBackend(periodo?: string): Promise<Record<string, any>> {
  const q = periodo ? `?periodo=${periodo}` : "";
  return apiFetch(`/api/avaliacoes/stats${q}`);
}

// ─── Auth Admin ───────────────────────────────────────────────────────────────

export interface AdminInfo {
  id: number;
  email: string;
  nome: string;
  role: string;
}

export async function loginComEmailSenha(
  email: string,
  senha: string
): Promise<{ token: string; admin: AdminInfo }> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export async function loginComGoogleToken(
  idToken: string
): Promise<{ token: string; admin: AdminInfo }> {
  return apiFetch("/api/auth/google/verify", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });
}

export async function getGoogleAuthUrl(): Promise<string> {
  const redirectFrontend = typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:8081";
  const data = await apiFetch<{ url: string }>(
    `/api/auth/google/url?redirect=${encodeURIComponent(redirectFrontend + "/oauth/callback")}`
  );
  return data.url;
}

export async function verificarTokenBackend(): Promise<AdminInfo | null> {
  try {
    return await apiFetch<AdminInfo>("/api/auth/me", {}, true);
  } catch {
    return null;
  }
}

export async function logoutBackend(): Promise<void> {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" }, true);
  } catch {}
  await clearToken();
}

export async function alterarSenhaBackend(
  senhaAtual: string,
  novaSenha: string
): Promise<void> {
  await apiFetch(
    "/api/auth/alterar-senha",
    { method: "POST", body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha }) },
    true
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export async function obterDashboardBackend(periodo?: string): Promise<any> {
  const q = periodo ? `?periodo=${periodo}` : "";
  return apiFetch(`/api/admin/dashboard${q}`, {}, true);
}

export async function registrarAuditoriaBackend(
  action: string,
  details: string = ""
): Promise<void> {
  try {
    await apiFetch(
      "/api/admin/audit",
      { method: "POST", body: JSON.stringify({ action, details }) },
      true
    );
  } catch {}
}

export async function obterAuditLogsBackend(limite = 100): Promise<any[]> {
  return apiFetch(`/api/admin/audit?limite=${limite}`, {}, true);
}

export async function downloadExcelBackend(periodo?: string): Promise<Blob> {
  const base = getBackendUrl();
  const q = periodo ? `?periodo=${periodo}` : "";
  const url = `${base}/api/admin/export/excel${q}`;
  const token = await getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ erro: resp.statusText }));
    throw new Error((err as any).erro || `Erro ${resp.status}`);
  }
  return resp.blob();
}

export function getExcelDownloadUrl(periodo?: string): string {
  const base = getBackendUrl();
  const q = periodo ? `?periodo=${periodo}` : "";
  return `${base}/api/admin/export/excel${q}`;
}
