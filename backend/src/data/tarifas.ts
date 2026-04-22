/** Tarifa de referência (reais/kWh) por UF — dado fictício do desafio. */
export const tarifaBaseKwhPorUf: Record<string, number> = {
  SP: 0.62,
  RJ: 0.6,
  MG: 0.55,
  BA: 0.58,
  PR: 0.56,
  RS: 0.59,
  DF: 0.57,
  AM: 0.68,
  PE: 0.61,
  CE: 0.64,
};

export function listarUfsComTarifa(): string[] {
  return Object.keys(tarifaBaseKwhPorUf);
}

export function obterTarifaUf(uf: string): number | undefined {
  return tarifaBaseKwhPorUf[uf.toUpperCase()];
}
