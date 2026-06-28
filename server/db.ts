import { eq } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Avaliações ─────────────────────────────────────────────────────────────────

import { desc } from "drizzle-orm";
import { avaliacoes, InsertAvaliacao, Avaliacao } from "../drizzle/schema";

/**
 * Salvar uma nova avaliação no banco de dados
 */
export async function salvarAvaliacaoBackend(
  data: InsertAvaliacao
): Promise<Avaliacao | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(avaliacoes).values(data);
    // Retornar a avaliação mais recente (que foi inserida agora)
    const inserted = await db
      .select()
      .from(avaliacoes)
      .where(eq(avaliacoes.unidadeId, data.unidadeId))
      .orderBy(desc(avaliacoes.createdAt))
      .limit(1);
    return inserted[0] || null;
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    return null;
  }
}

/**
 * Obter todas as avaliações de uma unidade
 */
export async function obterAvaliacoesUnidade(
  unidadeId: string
): Promise<Avaliacao[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(avaliacoes)
      .where(eq(avaliacoes.unidadeId, unidadeId))
      .orderBy(desc(avaliacoes.createdAt));
  } catch (error) {
    console.error("Erro ao obter avaliações:", error);
    return [];
  }
}

/**
 * Obter todas as avaliações (para dashboard)
 */
export async function obterTodasAvaliacoes(): Promise<Avaliacao[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(avaliacoes)
      .orderBy(desc(avaliacoes.createdAt));
  } catch (error) {
    console.error("Erro ao obter todas as avaliações:", error);
    return [];
  }
}

/**
 * Obter estatísticas de uma unidade
 */
export async function obterStatsUnidadeBackend(unidadeId: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const avaliacoesList = await db
      .select()
      .from(avaliacoes)
      .where(eq(avaliacoes.unidadeId, unidadeId));

    if (avaliacoesList.length === 0) {
      return {
        totalAvaliacoes: 0,
        mediaGeral: 0,
        distribuicao: {
          "Ótimo": 0,
          "Bom": 0,
          "Regular": 0,
          "Ruim": 0,
          "Péssimo": 0,
          "Não sabe/Não opinou": 0,
        },
        ultimaAvaliacao: null,
      };
    }

    // Contar respostas por categoria
    const contadores = {
      atendimentoRecepcao: {
        "Ótimo": 0,
        "Bom": 0,
        "Regular": 0,
        "Ruim": 0,
        "Péssimo": 0,
        "Não sabe/Não opinou": 0,
      },
      tempoEsperaRecepcao: {
        "Ótimo": 0,
        "Bom": 0,
        "Regular": 0,
        "Ruim": 0,
        "Péssimo": 0,
        "Não sabe/Não opinou": 0,
      },
      tempoEsperaConsulta: {
        "Ótimo": 0,
        "Bom": 0,
        "Regular": 0,
        "Ruim": 0,
        "Péssimo": 0,
        "Não sabe/Não opinou": 0,
      },
      infraestrutura: {
        "Ótimo": 0,
        "Bom": 0,
        "Regular": 0,
        "Ruim": 0,
        "Péssimo": 0,
        "Não sabe/Não opinou": 0,
      },
    };

    avaliacoesList.forEach((av) => {
      contadores.atendimentoRecepcao[av.atendimentoRecepcao]++;
      contadores.tempoEsperaRecepcao[av.tempoEsperaRecepcao]++;
      contadores.tempoEsperaConsulta[av.tempoEsperaConsulta]++;
      contadores.infraestrutura[av.infraestrutura]++;
    });

    return {
      totalAvaliacoes: avaliacoesList.length,
      contadores,
      ultimaAvaliacao: avaliacoesList[0]?.createdAt,
    };
  } catch (error) {
    console.error("Erro ao obter stats:", error);
    return null;
  }
}
