import { describe, expect, it } from "vitest";
import { fornecedorPorId, ofertasPorUf, solucoesPresentesNoUf } from "./repositorio.js";

describe("ofertasPorUf", () => {
  it("trata a UF de forma case-insensitive", () => {
    const a = ofertasPorUf("sp");
    const b = ofertasPorUf("SP");
    expect(a).toEqual(b);
  });

  it("para SP, devolve só ofertas com uf SP (contrato do repositório)", () => {
    for (const o of ofertasPorUf("SP")) {
      expect(o.uf).toBe("SP");
    }
  });
});

describe("fornecedorPorId", () => {
  it("encontra fornecedor conhecido", () => {
    const f = fornecedorPorId("f-aurora");
    expect(f?.nome).toBe("Aurora Sustentável S.A.");
  });

  it("inexistente devolve undefined (evita reaproveitar IDs a torto e a direito)", () => {
    expect(fornecedorPorId("não-existe")).toBeUndefined();
  });
});

describe("solucoesPresentesNoUf", () => {
  it("reúne soluções distintas a partir do mock, sem invencionice", () => {
    const sp = solucoesPresentesNoUf("SP");
    expect(new Set(sp)).toEqual(new Set<"GD" | "MERCADO_LIVRE">(["GD", "MERCADO_LIVRE"]));
  });
});
