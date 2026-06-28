import { obterAuditLogsBackend, registrarAuditoriaBackend } from './api';

export interface AuditLog {
  id: string | number;
  timestamp?: string;
  created_at?: string;
  username?: string;
  admin_email?: string;
  action: string;
  details: string;
  ip_address?: string;
}

export async function registrarAuditoria(
  username: string,
  action: string,
  details: string
): Promise<void> {
  await registrarAuditoriaBackend(action, details).catch(() => {});
}

export async function obterLogs(): Promise<AuditLog[]> {
  try {
    const logs = await obterAuditLogsBackend(200);
    return logs.map((l: any) => ({
      id: l.id,
      timestamp: l.created_at,
      created_at: l.created_at,
      username: l.admin_email,
      admin_email: l.admin_email,
      action: l.action,
      details: l.details || '',
      ip_address: l.ip_address,
    }));
  } catch {
    return [];
  }
}

export async function exportarLogsCSV(): Promise<string> {
  const logs = await obterLogs();
  if (logs.length === 0) return 'ID,Data/Hora,Usuário,Ação,Detalhes\n';
  const headers = 'ID,Data/Hora,Usuário,Ação,Detalhes\n';
  const rows = logs
    .map((l) => `"${l.id}","${l.timestamp || l.created_at}","${l.username || l.admin_email}","${l.action}","${l.details}"`)
    .join('\n');
  return headers + rows;
}
