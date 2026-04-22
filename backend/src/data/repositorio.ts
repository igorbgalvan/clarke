import { fornecedores, ofertas } from "./fornecedores.js";
import type { FornecedorMock, Oferta, TipoSolucao } from "./types.js";

const mapa = new Map(fornecedores.map((f) => [f.id, f]));

export function fornecedorPorId(id: string): FornecedorMock | undefined {
  return mapa.get(id);
}

export function ofertasPorUf(uf: string): Oferta[] {
  const u = uf.toUpperCase();
  return ofertas.filter((o) => o.uf === u);
}

export function solucoesPresentesNoUf(uf: string): TipoSolucao[] {
  const set = new Set<TipoSolucao>();
  for (const o of ofertasPorUf(uf)) {
    set.add(o.solucao);
  }
  return [...set];
}
