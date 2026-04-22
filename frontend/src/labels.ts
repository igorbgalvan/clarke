import type { TipoSolucao } from "./api/types.js";

const map: Record<TipoSolucao, string> = {
  GD: "Geração distribuída (GD)",
  MERCADO_LIVRE: "Mercado livre (ML)",
};

export function labelSolucao(t: TipoSolucao): string {
  return map[t] ?? t;
}
