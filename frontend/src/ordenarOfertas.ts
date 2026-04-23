import type { ComparacaoFornecedor, TipoSolucao } from "./api/types.ts";

/** Geração distribuída antes de mercado livre, como no negócio. */
export const ORDEM_TIPO: TipoSolucao[] = ["GD", "MERCADO_LIVRE"];

export type BlocoSolucao = {
  tipo: TipoSolucao;
  melhor: ComparacaoFornecedor;
  outras: ComparacaoFornecedor[];
};

/**
 * Uma oferta vencedora por solução (maior economia) e o resto para tabela
 * (mesmo critério de ordenação que a API para “melhor”).
 */
export function blocosOfertasPorSolucao(comparacoes: ComparacaoFornecedor[]): BlocoSolucao[] {
  const blocos: BlocoSolucao[] = [];
  for (const tipo of ORDEM_TIPO) {
    const linhas = comparacoes.filter((c) => c.solucao === tipo);
    if (linhas.length === 0) {
      continue;
    }
    const ordenado = [...linhas].sort(
      (a, b) => b.economia - a.economia || a.fornecedor.nome.localeCompare(b.fornecedor.nome)
    );
    const [melhor, ...outras] = ordenado;
    if (melhor) {
      blocos.push({ tipo, melhor, outras });
    }
  }
  return blocos;
}
