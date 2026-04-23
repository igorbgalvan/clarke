import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.tsx";

function jsonResponse(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/** Resposta mínima da query simulacao para a UI avançar. */
const respostaSimulacao = {
  data: {
    simulacao: {
      uf: "SP",
      consumoKwh: 30_000,
      tarifaBaseKwh: 0.62,
      custoBase: 18_600,
      resumoPorSolucao: [
        {
          tipo: "GD",
          custoBase: 18_600,
          melhorEconomia: 5700,
          melhorEconomiaPercentual: 5700 / 18_600,
          fornecedorMelhor: { id: "f-zenite", nome: "Zênite GD" },
        },
        {
          tipo: "MERCADO_LIVRE",
          custoBase: 18_600,
          melhorEconomia: 4500,
          melhorEconomiaPercentual: 4500 / 18_600,
          fornecedorMelhor: { id: "f-brisa", nome: "Brisa Comercializadora" },
        },
      ],
      comparacoes: [
        {
          fornecedor: {
            id: "f-zenite",
            nome: "Zênite GD",
            logoUrl: "/x.svg",
            estadoOrigem: "BA",
            totalDeClientes: 1500,
            avaliacaoMedia: 4.1,
          },
          solucao: "GD",
          custoKwh: 0.43,
          custoComFornecedor: 12_900,
          economia: 5700,
          economiaPercentual: 5700 / 18_600,
        },
      ],
    },
  },
};

describe("App", () => {
  const orig = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    globalThis.fetch = orig;
  });

  it("após listar UFs, submeter consumo 0 mostra validação (sem segunda chamada GraphQL)", async () => {
    const user = userEvent.setup();
    const fetchM = vi
      .fn()
      .mockImplementation(() => Promise.resolve(jsonResponse({ data: { ufs: ["SP"] } })));
    globalThis.fetch = fetchM as unknown as typeof fetch;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText("UF")).toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText(/Consumo/));
    await user.type(screen.getByLabelText(/Consumo/), "0");
    await user.click(screen.getByRole("button", { name: /Simular economia/ }));

    expect(
      await screen.findByText(/maior que zero|Informe um consumo/i)
    ).toBeInTheDocument();
    expect(fetchM).toHaveBeenCalledTimes(1);
  });

  it("com consumo válido, mostra resultado e melhor oferta (mock de simulação)", async () => {
    const user = userEvent.setup();
    const fetchM = vi
      .fn()
      // 1) ufs
      .mockResolvedValueOnce(jsonResponse({ data: { ufs: ["SP", "MG"] } }))
      // 2) simulacao
      .mockResolvedValueOnce(jsonResponse(respostaSimulacao));
    globalThis.fetch = fetchM as unknown as typeof fetch;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText("UF")).not.toBeDisabled();
    });

    await user.clear(screen.getByLabelText(/Consumo/));
    await user.type(screen.getByLabelText(/Consumo/), "30000");
    await user.click(screen.getByRole("button", { name: /Simular economia/ }));

    expect(
      await screen.findByRole("heading", { name: /Resultado/ })
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Geração distribuída \(GD\)/)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Zênite GD/)
    ).toBeInTheDocument();

    const chamadasGql = fetchM.mock.calls.filter(
      (c) => (c[0] as string)?.includes("graphql")
    );
    expect(chamadasGql).toHaveLength(2);
  });
});
