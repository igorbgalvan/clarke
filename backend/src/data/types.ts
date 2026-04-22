export type TipoSolucao = "GD" | "MERCADO_LIVRE";

export interface FornecedorMock {
  id: string;
  nome: string;
  logoUrl: string;
  estadoOrigem: string;
  totalDeClientes: number;
  avaliacaoMedia: number;
}

/** Uma linha: fornecedor atua neste UF com esta solução, com este preço. */
export interface Oferta {
  fornecedorId: string;
  uf: string;
  solucao: TipoSolucao;
  custoKwh: number;
}
