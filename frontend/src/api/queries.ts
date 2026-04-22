export const Q_UFS = `query { ufs }`;

export const Q_SIMULACAO = /* GraphQL */ `
  query Simulacao($u: String!, $c: Float!) {
    simulacao(uf: $u, consumoKwh: $c) {
      uf
      consumoKwh
      tarifaBaseKwh
      custoBase
      resumoPorSolucao {
        tipo
        custoBase
        melhorEconomia
        melhorEconomiaPercentual
        fornecedorMelhor {
          id
          nome
        }
      }
      comparacoes {
        solucao
        custoKwh
        custoComFornecedor
        economia
        economiaPercentual
        fornecedor {
          id
          nome
          logoUrl
          estadoOrigem
          totalDeClientes
          avaliacaoMedia
        }
      }
    }
  }
`;
