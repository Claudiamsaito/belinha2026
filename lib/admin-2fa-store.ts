import AsyncStorage from '@react-native-async-storage/async-storage';

const TWO_FA_KEY = '@missao_saude:2fa_settings';
const TWO_FA_CODES_KEY = '@missao_saude:2fa_codes';

export interface TwoFASettings {
  enabled: boolean;
  method: 'SMS' | 'EMAIL' | 'AUTHENTICATOR';
  phoneNumber?: string;
  email?: string;
  secret?: string;
  createdAt: number;
}

export interface TwoFACode {
  id: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
  attempts: number;
}

/**
 * Habilita 2FA para o administrador
 */
export async function habilitarDoisFatores(
  metodo: 'SMS' | 'EMAIL' | 'AUTHENTICATOR',
  contato?: string
): Promise<boolean> {
  try {
    const settings: TwoFASettings = {
      enabled: true,
      method: metodo,
      phoneNumber: metodo === 'SMS' ? contato : undefined,
      email: metodo === 'EMAIL' ? contato : undefined,
      createdAt: Date.now(),
    };

    await AsyncStorage.setItem(TWO_FA_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Erro ao habilitar 2FA:', error);
    return false;
  }
}

/**
 * Desabilita 2FA
 */
export async function desabilitarDoisFatores(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(TWO_FA_KEY);
    await AsyncStorage.removeItem(TWO_FA_CODES_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao desabilitar 2FA:', error);
    return false;
  }
}

/**
 * Obtém configurações de 2FA
 */
export async function obterConfiguracoesDosFatores(): Promise<TwoFASettings | null> {
  try {
    const settings = await AsyncStorage.getItem(TWO_FA_KEY);
    if (!settings) {
      return null;
    }

    return JSON.parse(settings) as TwoFASettings;
  } catch (error) {
    console.error('Erro ao obter configurações de 2FA:', error);
    return null;
  }
}

/**
 * Gera um código de 2FA
 */
export async function gerarCodigoDoisFatores(): Promise<string> {
  try {
    // Gerar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const codigoObj: TwoFACode = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      code: codigo,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutos
      used: false,
      attempts: 0,
    };

    const codigos = await obterCodigosDoisFatores();
    codigos.push(codigoObj);

    // Manter apenas os últimos 10 códigos
    const codigosLimitados = codigos.slice(-10);

    await AsyncStorage.setItem(TWO_FA_CODES_KEY, JSON.stringify(codigosLimitados));

    return codigo;
  } catch (error) {
    console.error('Erro ao gerar código 2FA:', error);
    throw error;
  }
}

/**
 * Valida um código de 2FA
 */
export async function validarCodigoDoisFatores(codigo: string): Promise<boolean> {
  try {
    const codigos = await obterCodigosDoisFatores();
    const agora = Date.now();

    const codigoValido = codigos.find(
      (c) => c.code === codigo && c.expiresAt > agora && !c.used && c.attempts < 3
    );

    if (!codigoValido) {
      // Incrementar tentativas
      const codigoComTentativa = codigos.find((c) => c.code === codigo);
      if (codigoComTentativa) {
        codigoComTentativa.attempts++;
        await AsyncStorage.setItem(TWO_FA_CODES_KEY, JSON.stringify(codigos));
      }
      return false;
    }

    // Marcar código como usado
    codigoValido.used = true;
    await AsyncStorage.setItem(TWO_FA_CODES_KEY, JSON.stringify(codigos));

    return true;
  } catch (error) {
    console.error('Erro ao validar código 2FA:', error);
    return false;
  }
}

/**
 * Obtém todos os códigos de 2FA
 */
export async function obterCodigosDoisFatores(): Promise<TwoFACode[]> {
  try {
    const codigos = await AsyncStorage.getItem(TWO_FA_CODES_KEY);
    if (!codigos) {
      return [];
    }

    return JSON.parse(codigos) as TwoFACode[];
  } catch (error) {
    console.error('Erro ao obter códigos 2FA:', error);
    return [];
  }
}

/**
 * Simula envio de código 2FA por SMS ou Email
 */
export async function enviarCodigoDoisFatores(
  metodo: 'SMS' | 'EMAIL',
  contato: string
): Promise<string> {
  try {
    const codigo = await gerarCodigoDoisFatores();

    if (metodo === 'SMS') {
      console.log(`SMS enviado para ${contato} com código: ${codigo}`);
      // Em produção: integrar com serviço de SMS (Twilio, AWS SNS, etc)
    } else if (metodo === 'EMAIL') {
      console.log(`Email enviado para ${contato} com código: ${codigo}`);
      // Em produção: integrar com serviço de email
    }

    return codigo;
  } catch (error) {
    console.error('Erro ao enviar código 2FA:', error);
    throw error;
  }
}

/**
 * Gera código de backup para 2FA
 */
export async function gerarCodigosDeBkup(): Promise<string[]> {
  const codigos: string[] = [];

  for (let i = 0; i < 10; i++) {
    const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();
    codigos.push(codigo);
  }

  return codigos;
}

/**
 * Limpa códigos expirados
 */
export async function limparCodigosExpirados(): Promise<void> {
  try {
    const codigos = await obterCodigosDoisFatores();
    const agora = Date.now();

    const codigosValidos = codigos.filter((c) => c.expiresAt > agora);

    await AsyncStorage.setItem(TWO_FA_CODES_KEY, JSON.stringify(codigosValidos));
  } catch (error) {
    console.error('Erro ao limpar códigos expirados:', error);
  }
}
