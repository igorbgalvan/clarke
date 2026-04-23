import { describe, expect, it } from "vitest";
import { ofertasPorUf } from "../data/repositorio.js";
import { obterTarifaUf } from "../data/tarifas.js";
import type { TipoSolucao } from "../data/types.js";
import { economiaReais } from "./economia.js";
import { obterSimulacao } from "./simulacao.js";

/** Dados conhecidos do mock: SP, 30_000 kWh, tarifa 0,62 R$/kWh. */
const SP = "SP";
const CONSUMO = 30_000;
const TARIFA_SP = 0.62;
const CUSTO_BASE_SP = CONSUMO * TARIFA_SP; // 18_600

describe("obterSimulacao", () => {
  it("normaliza UF em maiúsculas e devolve o mesmo em saida.uf", () => {
    const a = obterSimulacao("sp", 1000);
    const b = obterSimulacao("Sp", 1000);
    expect(a.uf).toBe("SP");
    expect(b.uf).toBe("SP");
  });

  it("rejeita consumo nulo, zero ou negativo", () => {
    expect(() => obterSimulacao("SP", 0)).toThrow(/consumoKwh/);
    expect(() => obterSimulacao("SP", -1)).toThrow(/consumoKwh/);
  });

  it("rejeita UF sem tarifa no mock", () => {
    expect(() => obterSimulacao("ZZ", 1000)).toThrow(/UF sem tarifa/);
  });

  it("SP 30_000 kWh: custo base = 30_000 * 0,62 = 18_600", () => {
    const s = obterSimulacao(SP, CONSUMO);
    expect(s.tarifaBaseKwh).toBe(TARIFA_SP);
    expect(s.custoBase).toBe(CUSTO_BASE_SP);
    expect(s.consumoKwh).toBe(CONSUMO);
  });

  it("gera uma linha de comparação por oferta do mock naquele UF (SP tem 5 ofertas)", () => {
    const s = obterSimulacao(SP, CONSUMO);
    expect(s.comparacoes).toHaveLength(ofertasPorUf(SP).length);
    expect(s.comparacoes).toHaveLength(5);
  });

  it("cada comparação repete a fórmula do desafio (economia = base − consumo×custo_kwh)", () => {
    const s = obterSimulacao(SP, CONSUMO);
    const tarifa = obterTarifaUf(SP)!;
    for (const c of s.comparacoes) {
      const esp = economiaReais(CONSUMO, tarifa, c.custoKwh);
      expect(c.economia).toBe(esp);
      expect(c.custoComFornecedor).toBe(CONSUMO * c.custoKwh);
    }
  });

  it("em SP 30_000, melhor GD é Zênite 0,43 (economia 5_700) e melhor ML é Brisa 0,47 (4_500)", () => {
    const s = obterSimulacao(SP, CONSUMO);
    const g = s.resumoPorSolucao.find((r) => r.tipo === "GD");
    const ml = s.resumoPorSolucao.find((r) => r.tipo === "MERCADO_LIVRE");
    expect(g).toBeDefined();
    expect(ml).toBeDefined();
    expect(g!.melhorEconomia).toBe(5700);
    expect(g!.fornecedorMelhor).toEqual({ id: "f-zenite", nome: "Zênite GD" });
    expect(ml!.melhorEconomia).toBe(4500);
    expect(ml!.fornecedorMelhor).toEqual({ id: "f-brisa", nome: "Brisa Comercializadora" });
  });

  it("o resumo por solução bate com o MÁXIMO de economia nas comparações daquela solução", () => {
    const s = obterSimulacao(SP, CONSUMO);
    const tipos: TipoSolucao[] = ["GD", "MERCADO_LIVRE"];
    for (const t of tipos) {
      const resumo = s.resumoPorSolucao.find((r) => r.tipo === t);
      if (!resumo) {
        continue;
      }
      const naSolucao = s.comparacoes.filter((c) => c.solucao === t);
      const maxE = Math.max(...naSolucao.map((c) => c.economia));
      expect(resumo.melhorEconomia).toBe(maxE);
      const linhaVencedora = naSolucao.find(
        (c) => c.economia === maxE && c.fornecedor.nome === resumo.fornecedorMelhor?.nome
      );
      expect(linhaVencedora).toBeDefined();
    }
  });

  it("MG com uma só oferta GD: um resumo, uma comparação, valores exatos (1000 kWh)", () => {
    const consumo = 1000;
    const s = obterSimulacao("mg", consumo);
    const tarifaMg = 0.55;
    const custoKwh = 0.44;
    const base = consumo * tarifaMg;
    expect(s.comparacoes).toHaveLength(1);
    expect(s.comparacoes[0]!.fornecedor.id).toBe("f-brisa");
    expect(s.comparacoes[0]!.solucao).toBe("GD");
    expect(s.custoBase).toBeCloseTo(base, 10);
    expect(s.comparacoes[0]!.economia).toBeCloseTo(consumo * (tarifaMg - custoKwh), 10);
    expect(s.resumoPorSolucao).toHaveLength(1);
  });
});
