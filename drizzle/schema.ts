import { pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Columns use camelCase to match both database fields and generated types.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const avaliacaoEnum = pgEnum("avaliacao_opcao", [
  "Ótimo",
  "Bom",
  "Regular",
  "Ruim",
  "Péssimo",
  "Não sabe/Não opinou",
]);

export const retornoEnum = pgEnum("retorno_opcao", [
  "Eu fiz e tive retorno rápido",
  "Eu fiz e tive retorno demorado",
  "Eu fiz e nunca tive retorno",
  "Eu nunca fiz",
]);

// Avaliações das unidades de saúde
export const avaliacoes = pgTable("avaliacoes", {
  id: serial("id").primaryKey(),
  unidadeId: varchar("unidadeId", { length: 64 }).notNull(),
  atendimentoRecepcao: avaliacaoEnum("atendimentoRecepcao").notNull(),
  tempoEsperaRecepcao: avaliacaoEnum("tempoEsperaRecepcao").notNull(),
  tempoEsperaConsulta: avaliacaoEnum("tempoEsperaConsulta").notNull(),
  infraestrutura: avaliacaoEnum("infraestrutura").notNull(),
  retornoElogio: retornoEnum("retornoElogio").notNull(),
  comentario: text("comentario"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Avaliacao = typeof avaliacoes.$inferSelect;
export type InsertAvaliacao = typeof avaliacoes.$inferInsert;
