import { COOKIE_NAME } from "../shared/const.js";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  avaliacoes: router({
    salvar: publicProcedure
      .input(
        z.object({
          unidadeId: z.string(),
          atendimentoRecepcao: z.string(),
          tempoEsperaRecepcao: z.string(),
          tempoEsperaConsulta: z.string(),
          infraestrutura: z.string(),
          retornoElogio: z.string(),
          comentario: z.string().optional(),
        })
      )
      .mutation(({ input, ctx }) => {
        return db.salvarAvaliacaoBackend({
          unidadeId: input.unidadeId,
          atendimentoRecepcao: input.atendimentoRecepcao as any,
          tempoEsperaRecepcao: input.tempoEsperaRecepcao as any,
          tempoEsperaConsulta: input.tempoEsperaConsulta as any,
          infraestrutura: input.infraestrutura as any,
          retornoElogio: input.retornoElogio as any,
          comentario: input.comentario || null,
          ipAddress: (ctx.req as any)?.ip || null,
          userAgent: (ctx.req as any)?.headers?.["user-agent"] || null,
        });
      }),

    obterUnidade: publicProcedure
      .input(z.object({ unidadeId: z.string() }))
      .query(({ input }) => db.obterAvaliacoesUnidade(input.unidadeId)),

    obterTodas: publicProcedure.query(() => db.obterTodasAvaliacoes()),

    stats: publicProcedure
      .input(z.object({ unidadeId: z.string() }))
      .query(({ input }) => db.obterStatsUnidadeBackend(input.unidadeId)),
  })
});

export type AppRouter = typeof appRouter;
