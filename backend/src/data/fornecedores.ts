import type { FornecedorMock, Oferta } from "./types.js";

/** Uma imagem genérica partilhada no front (`public/fornecedor-generico.png`), caminho servido pelo SPA. */
const LOGO_FORNECEDOR_GENERICO = "/fornecedor-generico.png";

export const fornecedores: FornecedorMock[] = [
  {
    id: "f-aurora",
    nome: "Aurora Sustentável S.A.",
    logoUrl: LOGO_FORNECEDOR_GENERICO,
    estadoOrigem: "SP",
    totalDeClientes: 4200,
    avaliacaoMedia: 4.6,
  },
  {
    id: "f-brisa",
    nome: "Brisa Comercializadora",
    logoUrl: LOGO_FORNECEDOR_GENERICO,
    estadoOrigem: "MG",
    totalDeClientes: 3100,
    avaliacaoMedia: 4.3,
  },
  {
    id: "f-horizonte",
    nome: "Horizonte ML Ltda",
    logoUrl: LOGO_FORNECEDOR_GENERICO,
    estadoOrigem: "RJ",
    totalDeClientes: 8900,
    avaliacaoMedia: 4.8,
  },
  {
    id: "f-zenite",
    nome: "Zênite GD",
    logoUrl: LOGO_FORNECEDOR_GENERICO,
    estadoOrigem: "BA",
    totalDeClientes: 1500,
    avaliacaoMedia: 4.1,
  },
];

export const ofertas: Oferta[] = [
  { fornecedorId: "f-aurora", uf: "SP", solucao: "GD", custoKwh: 0.48 },
  { fornecedorId: "f-aurora", uf: "SP", solucao: "MERCADO_LIVRE", custoKwh: 0.51 },
  { fornecedorId: "f-aurora", uf: "RJ", solucao: "MERCADO_LIVRE", custoKwh: 0.49 },
  { fornecedorId: "f-brisa", uf: "SP", solucao: "MERCADO_LIVRE", custoKwh: 0.47 },
  { fornecedorId: "f-brisa", uf: "MG", solucao: "GD", custoKwh: 0.44 },
  { fornecedorId: "f-horizonte", uf: "SP", solucao: "MERCADO_LIVRE", custoKwh: 0.5 },
  { fornecedorId: "f-horizonte", uf: "RJ", solucao: "MERCADO_LIVRE", custoKwh: 0.45 },
  { fornecedorId: "f-horizonte", uf: "RJ", solucao: "GD", custoKwh: 0.46 },
  { fornecedorId: "f-zenite", uf: "SP", solucao: "GD", custoKwh: 0.43 },
  { fornecedorId: "f-zenite", uf: "BA", solucao: "GD", custoKwh: 0.42 },
];
