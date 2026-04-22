import type { FornecedorMock, Oferta } from "./types.js";

export const fornecedores: FornecedorMock[] = [
  {
    id: "f-aurora",
    nome: "Aurora Sustentável S.A.",
    logoUrl: "https://placehold.co/64x64/0d9488/ffffff?text=AS",
    estadoOrigem: "SP",
    totalDeClientes: 4200,
    avaliacaoMedia: 4.6,
  },
  {
    id: "f-brisa",
    nome: "Brisa Comercializadora",
    logoUrl: "https://placehold.co/64x64/2563eb/ffffff?text=Br",
    estadoOrigem: "MG",
    totalDeClientes: 3100,
    avaliacaoMedia: 4.3,
  },
  {
    id: "f-horizonte",
    nome: "Horizonte ML Ltda",
    logoUrl: "https://placehold.co/64x64/dc2626/ffffff?text=HM",
    estadoOrigem: "RJ",
    totalDeClientes: 8900,
    avaliacaoMedia: 4.8,
  },
  {
    id: "f-zenite",
    nome: "Zênite GD",
    logoUrl: "https://placehold.co/64x64/7c3aed/ffffff?text=Z",
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
