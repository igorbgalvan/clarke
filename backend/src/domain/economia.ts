/**
 * Cálculos do desafio: custo base a partir da tarifa do estado; economia = base − custo fornecedor.
 * Funções puras, sem I/O.
 */

export function custoComTarifaBase(consumoKwh: number, tarifaBaseKwh: number): number {
  return consumoKwh * tarifaBaseKwh;
}

export function custoComFornecedor(consumoKwh: number, custoKwh: number): number {
  return consumoKwh * custoKwh;
}

export function economiaReais(
  consumoKwh: number,
  tarifaBaseKwh: number,
  custoKwhFornecedor: number
): number {
  const base = custoComTarifaBase(consumoKwh, tarifaBaseKwh);
  const fornec = custoComFornecedor(consumoKwh, custoKwhFornecedor);
  return base - fornec;
}

export function economiaPercentual(
  consumoKwh: number,
  tarifaBaseKwh: number,
  custoKwhFornecedor: number
): number | null {
  const base = custoComTarifaBase(consumoKwh, tarifaBaseKwh);
  if (base === 0) {
    return null;
  }
  return economiaReais(consumoKwh, tarifaBaseKwh, custoKwhFornecedor) / base;
}
