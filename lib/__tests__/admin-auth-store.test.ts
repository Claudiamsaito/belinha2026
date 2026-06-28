import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  login,
  logout,
  verificarAutenticacao,
  obterEstadoAuth,
} from '../admin-auth-store';

// Mock AsyncStorage
let mockStore: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => {
  return {
    default: {
      getItem: vi.fn((key: string) => Promise.resolve(mockStore[key] || null)),
      setItem: vi.fn((key: string, value: string) => {
        mockStore[key] = value;
        return Promise.resolve();
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStore[key];
        return Promise.resolve();
      }),
      clear: vi.fn(() => {
        mockStore = {};
        return Promise.resolve();
      }),
    },
  };
});

describe('admin-auth-store', () => {
  beforeEach(() => {
    mockStore = {};
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('deve fazer login com credenciais corretas', async () => {
      const resultado = await login('admin', 'SantaCasa2024!');
      expect(resultado).toBe(true);
    });

    it('deve falhar com senha incorreta', async () => {
      const resultado = await login('admin', 'senhaerrada');
      expect(resultado).toBe(false);
    });

    it('deve falhar com usuário incorreto', async () => {
      const resultado = await login('usuario_errado', 'SantaCasa2024!');
      expect(resultado).toBe(false);
    });
  });

  describe('logout', () => {
    it('deve fazer logout sem erros', async () => {
      await login('admin', 'SantaCasa2024!');
      await expect(logout()).resolves.toBeUndefined();
    });
  });

  describe('verificarAutenticacao', () => {
    it('deve retornar false quando não autenticado', async () => {
      mockStore = {};
      const resultado = await verificarAutenticacao();
      expect(resultado).toBe(false);
    });

    it('deve retornar true quando autenticado', async () => {
      await login('admin', 'SantaCasa2024!');
      const resultado = await verificarAutenticacao();
      expect(resultado).toBe(true);
    });
  });

  describe('obterEstadoAuth', () => {
    it('deve retornar estado autenticado após login', async () => {
      mockStore = {};
      await login('admin', 'SantaCasa2024!');
      const estado = await obterEstadoAuth();
      expect(estado.isAuthenticated).toBe(true);
      expect(estado.username).toBe('admin');
      expect(estado.loginTime).toBeGreaterThan(0);
    });
  });
});
