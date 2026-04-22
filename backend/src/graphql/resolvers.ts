import { GraphQLError } from "graphql";
import { listarUfsComTarifa } from "../data/tarifas.js";
import { obterSimulacao } from "../domain/simulacao.js";

function mapErroSimulacao(e: unknown): never {
  const msg = e instanceof Error ? e.message : "Erro ao simular";
  if (msg.includes("UF sem tarifa") || msg.includes("consumoKwh")) {
    throw new GraphQLError(msg, { extensions: { code: "BAD_USER_INPUT" } });
  }
  throw new GraphQLError("Erro interno", { extensions: { code: "INTERNAL" }, originalError: e as Error });
}

export const resolvers = {
  Query: {
    ufs: () => [...listarUfsComTarifa()].sort(),

    simulacao: (
      _parent: unknown,
      args: { uf: string; consumoKwh: number }
    ) => {
      try {
        return obterSimulacao(args.uf, args.consumoKwh);
      } catch (e) {
        mapErroSimulacao(e);
      }
    },
  },
};
