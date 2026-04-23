import { describe, expect, it } from "vitest";
import {
  custoComFornecedor,
  custoComTarifaBase,
  economiaPercentual,
  economiaReais,
} from "./economia.js";

describe("custoComTarifaBase", () => {
  it("multiplica consumo pela tarifa", () => {
    expect(custoComTarifaBase(30_000, 0.62)).toBe(18_600);
  });

  it("aceita decimais de consumo", () => {
    expect(custoComTarifaBase(10.5, 2)).toBe(21);
  });
});

describe("custoComFornecedor", () => {
  it("multiplica consumo pelo custo do fornecedor naquela solução", () => {
    expect(custoComFornecedor(30_000, 0.43)).toBe(12_900);
  });
});

describe("economiaReais (regra do desafio: base − custo fornecedor)", () => {
  it("SP 30000 kWh com oferta 0,43 R$/kWh: 18600 − 12900 = 5700", () => {
    const consumo = 30_000;
    const tarifa = 0.62;
    const custoKwh = 0.43;
    expect(economiaReais(consumo, tarifa, custoKwh)).toBe(5700);
  });

  it("quando o fornecedor é mais caro que a base, economia negativa", () => {
    expect(economiaReais(1000, 0.5, 0.8)).toBe(-300);
  });
});

describe("economiaPercentual (opcional no enunciado: economia / custo_base)", () => {
  it("retorna a fração do custo base, não o valor em %", () => {
    const consumo = 30_000;
    const tarifa = 0.62;
    const custoKwh = 0.43;
    const base = consumo * tarifa;
    const economia = economiaReais(consumo, tarifa, custoKwh);
    const pct = economiaPercentual(consumo, tarifa, custoKwh);
    expect(pct).toBe(economia / base);
    expect(pct).toBeCloseTo(5700 / 18_600, 12);
  });

  it("com custo base zero, devolve null (evita divisão por zero)", () => {
    expect(economiaPercentual(0, 0.5, 0.1)).toBeNull();
  });
});
