import { fornecedorPorId, ofertasPorUf } from "../data/repositorio.js";
import { obterTarifaUf } from "../data/tarifas.js";
import type { TipoSolucao } from "../data/types.js";
import { economiaPercentual, economiaReais } from "./economia.js";

export interface FornecedorSaida {
  id: string;
  nome: string;
  logoUrl: string;
  estadoOrigem: string;
  totalDeClientes: number;
  avaliacaoMedia: number;
}

export interface ResumoSolucaoSaida {
  tipo: TipoSolucao;
  custoBase: number;
  melhorEconomia: number | null;
  melhorEconomiaPercentual: number | null;
  fornecedorMelhor: { id: string; nome: string } | null;
}

export interface ComparacaoSaida {
  fornecedor: FornecedorSaida;
  solucao: TipoSolucao;
  custoKwh: number;
  custoComFornecedor: number;
  economia: number;
  economiaPercentual: number | null;
}

export interface SimulacaoSaida {
  uf: string;
  consumoKwh: number;
  tarifaBaseKwh: number;
  custoBase: number;
  resumoPorSolucao: ResumoSolucaoSaida[];
  comparacoes: ComparacaoSaida[];
}

/**
 * Gera a simulação: resumos (melhor por solução) e linhas por fornecedor+solução.
 */
export function obterSimulacao(uf: string, consumoKwh: number): SimulacaoSaida {
  const u = uf.toUpperCase();
  const tarifa = obterTarifaUf(u);
  if (tarifa === undefined) {
    throw new Error(`UF sem tarifa de referência: ${u}`);
  }
  if (consumoKwh <= 0) {
    throw new Error("consumoKwh deve ser maior que zero");
  }

  const custoBase = consumoKwh * tarifa;
  const ofertasUf = ofertasPorUf(u);
  const comparacoes: ComparacaoSaida[] = [];

  for (const o of ofertasUf) {
    const f = fornecedorPorId(o.fornecedorId);
    if (!f) {
      continue;
    }
    const economia = economiaReais(consumoKwh, tarifa, o.custoKwh);
    const economiaP = economiaPercentual(consumoKwh, tarifa, o.custoKwh);
    const custoComF = consumoKwh * o.custoKwh;
    comparacoes.push({
      fornecedor: { ...f },
      solucao: o.solucao,
      custoKwh: o.custoKwh,
      custoComFornecedor: custoComF,
      economia,
      economiaPercentual: economiaP,
    });
  }

  const resumoPorSolucao: ResumoSolucaoSaida[] = [];
  const solucoes: TipoSolucao[] = ["GD", "MERCADO_LIVRE"];

  for (const tipo of solucoes) {
    const linhas = comparacoes.filter((c) => c.solucao === tipo);
    if (linhas.length === 0) {
      continue;
    }
    const melhor = linhas.reduce((a, b) => (a.economia >= b.economia ? a : b));
    resumoPorSolucao.push({
      tipo,
      custoBase,
      melhorEconomia: melhor.economia,
      melhorEconomiaPercentual: melhor.economiaPercentual,
      fornecedorMelhor: { id: melhor.fornecedor.id, nome: melhor.fornecedor.nome },
    });
  }

  return {
    uf: u,
    consumoKwh,
    tarifaBaseKwh: tarifa,
    custoBase,
    resumoPorSolucao,
    comparacoes,
  };
}
