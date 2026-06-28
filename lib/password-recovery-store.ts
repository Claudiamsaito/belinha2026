import AsyncStorage from '@react-native-async-storage/async-storage';

const RECOVERY_TOKENS_KEY = '@missao_saude:recovery_tokens';
const RECOVERY_EMAIL_KEY = '@missao_saude:recovery_email';

export interface RecoveryToken {
  id: string;
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

/**
 * Gera um token de recuperação de senha
 */
export async function gerarTokenRecuperacao(email: string): Promise<string> {
  try {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    const tokens = await obterTokens();
    const agora = Date.now();
    const umDia = 24 * 60 * 60 * 1000;

    const novoToken: RecoveryToken = {
      id: `${agora}-${Math.random().toString(36).substr(2, 9)}`,
      token,
      email,
      createdAt: agora,
      expiresAt: agora + umDia,
      used: false,
    };

    tokens.push(novoToken);
    await AsyncStorage.setItem(RECOVERY_TOKENS_KEY, JSON.stringify(tokens));
    await AsyncStorage.setItem(RECOVERY_EMAIL_KEY, email);

    return token;
  } catch (error) {
    console.error('Erro ao gerar token de recuperação:', error);
    throw error;
  }
}

/**
 * Valida um token de recuperação
 */
export async function validarTokenRecuperacao(token: string): Promise<boolean> {
  try {
    const tokens = await obterTokens();
    const agora = Date.now();

    const tokenValido = tokens.find(
      (t) => t.token === token && t.expiresAt > agora && !t.used
    );

    return !!tokenValido;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return false;
  }
}

/**
 * Usa um token de recuperação (marca como usado)
 */
export async function usarTokenRecuperacao(token: string): Promise<boolean> {
  try {
    const tokens = await obterTokens();
    const agora = Date.now();

    const tokenIndex = tokens.findIndex(
      (t) => t.token === token && t.expiresAt > agora && !t.used
    );

    if (tokenIndex === -1) {
      return false;
    }

    tokens[tokenIndex].used = true;
    await AsyncStorage.setItem(RECOVERY_TOKENS_KEY, JSON.stringify(tokens));

    return true;
  } catch (error) {
    console.error('Erro ao usar token:', error);
    return false;
  }
}

/**
 * Obtém todos os tokens de recuperação
 */
export async function obterTokens(): Promise<RecoveryToken[]> {
  try {
    const tokens = await AsyncStorage.getItem(RECOVERY_TOKENS_KEY);
    if (!tokens) {
      return [];
    }

    return JSON.parse(tokens) as RecoveryToken[];
  } catch (error) {
    console.error('Erro ao obter tokens:', error);
    return [];
  }
}

/**
 * Obtém o email do último pedido de recuperação
 */
export async function obterEmailRecuperacao(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(RECOVERY_EMAIL_KEY);
  } catch (error) {
    console.error('Erro ao obter email de recuperação:', error);
    return null;
  }
}

/**
 * Limpa tokens expirados
 */
export async function limparTokensExpirados(): Promise<void> {
  try {
    const tokens = await obterTokens();
    const agora = Date.now();

    const tokensValidos = tokens.filter((t) => t.expiresAt > agora);

    await AsyncStorage.setItem(RECOVERY_TOKENS_KEY, JSON.stringify(tokensValidos));
  } catch (error) {
    console.error('Erro ao limpar tokens expirados:', error);
  }
}

/**
 * Simula envio de email com link de recuperação
 * Em produção, isso seria integrado com um serviço de email real
 */
export async function enviarEmailRecuperacao(email: string): Promise<string> {
  try {
    const token = await gerarTokenRecuperacao(email);

    // Simular envio de email
    const linkRecuperacao = `manus-saude://reset-password?token=${token}`;
    
    console.log(`Email de recuperação seria enviado para: ${email}`);
    console.log(`Link de recuperação: ${linkRecuperacao}`);
    console.log(`Token: ${token}`);

    // Em produção, aqui seria feito:
    // await fetch('https://api.seu-servico.com/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: email,
    //     subject: 'Recuperação de Senha - Missão Saúde Ilhabela',
    //     html: `<a href="${linkRecuperacao}">Clique aqui para redefinir sua senha</a>`
    //   })
    // });

    return token;
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    throw error;
  }
}
