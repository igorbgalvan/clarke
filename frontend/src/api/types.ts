export type TipoSolucao = "GD" | "MERCADO_LIVRE";

export interface UfsData {
  ufs: string[];
}

export interface FornecedorGql {
  id: string;
  nome: string;
  logoUrl: string;
  estadoOrigem: string;
  totalDeClientes: number;
  avaliacaoMedia: number;
}

export interface ResumoSolucao {
  tipo: TipoSolucao;
  custoBase: number;
  melhorEconomia: number | null;
  melhorEconomiaPercentual: number | null;
  fornecedorMelhor: { id: string; nome: string } | null;
}

export interface ComparacaoFornecedor {
  solucao: TipoSolucao;
  custoKwh: number;
  custoComFornecedor: number;
  economia: number;
  economiaPercentual: number | null;
  fornecedor: FornecedorGql;
}

export interface Simulacao {
  uf: string;
  consumoKwh: number;
  tarifaBaseKwh: number;
  custoBase: number;
  resumoPorSolucao: ResumoSolucao[];
  comparacoes: ComparacaoFornecedor[];
}

export interface SimulacaoData {
  simulacao: Simulacao;
}
