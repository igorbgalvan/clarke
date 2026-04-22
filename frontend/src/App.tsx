import { useEffect, useState, type FormEvent } from "react";
import { graphqlRequest } from "./api/graphql.ts";
import { Q_SIMULACAO, Q_UFS } from "./api/queries.ts";
import type { Simulacao, SimulacaoData, UfsData } from "./api/types.ts";
import { labelSolucao } from "./labels.ts";
import "./App.css";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const n2 = (x: number) => x.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

function fmtPct(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${(n * 100).toFixed(1).replace(".", ",")}%`;
}

export default function App() {
  const [ufs, setUfs] = useState<string[]>([]);
  const [ufsErro, setUfsErro] = useState<string | null>(null);

  const [uf, setUf] = useState("SP");
  const [consumo, setConsumo] = useState("30000");

  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<Simulacao | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let v = true;
    (async () => {
      try {
        const d = await graphqlRequest<UfsData>(Q_UFS);
        if (v) {
          setUfs(d.ufs);
          setUf((current) => (d.ufs.includes(current) ? current : (d.ufs[0] ?? "SP")));
        }
      } catch (e) {
        if (v) {
          setUfsErro(e instanceof Error ? e.message : "Falha ao listar UFs. A API está em 4000?");
        }
      }
    })();
    return () => {
      v = false;
    };
  }, []);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    const consumoKwh = Number(String(consumo).replace(/\s/g, "").replace(",", "."));
    if (!Number.isFinite(consumoKwh) || consumoKwh <= 0) {
      setErro("Informe um consumo em kWh maior que zero.");
      return;
    }
    setCarregando(true);
    setResultado(null);
    try {
      const d = await graphqlRequest<SimulacaoData>(Q_SIMULACAO, {
        u: uf,
        c: consumoKwh,
      });
      setResultado(d.simulacao);
    } catch (x) {
      setErro(x instanceof Error ? x.message : "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="app">
      <header className="app__head">
        <h1>Simulador (dados fictícios)</h1>
        <p>Escolha a UF, informe o consumo mensal e compare economia por solução e por fornecedor.</p>
      </header>

      {ufsErro ? <p className="app__warn">{ufsErro}</p> : null}

      <form className="app__form" onSubmit={enviar}>
        <div className="row">
          <label htmlFor="uf">UF</label>
          <select
            id="uf"
            value={uf}
            onChange={(e) => {
              setUf(e.target.value);
            }}
            required
            disabled={ufs.length === 0}
          >
            {ufs.length === 0 ? (
              <option>Carregando…</option>
            ) : (
              ufs.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="row">
          <label htmlFor="consumo">Consumo (kWh / mês)</label>
          <input
            id="consumo"
            type="text"
            inputMode="decimal"
            value={consumo}
            onChange={(e) => {
              setConsumo(e.target.value);
            }}
            required
            placeholder="ex.: 30000"
            autoComplete="off"
          />
        </div>
        <button className="btn" type="submit" disabled={carregando || ufs.length === 0}>
          {carregando ? "Calculando…" : "Simular"}
        </button>
      </form>

      {erro ? <p className="app__erro" role="alert">{erro}</p> : null}

      {resultado ? (
        <section className="app__result" aria-live="polite">
          <h2>Resultado</h2>
          <p className="app__ref">
            Tarifa de referência no UF: {n2(resultado.tarifaBaseKwh)} R$/kWh · Custo base estimado:{" "}
            <strong>{brl.format(resultado.custoBase)}</strong> (consumo {n2(resultado.consumoKwh)} kWh)
          </p>

          <h3>Melhor economia por solução</h3>
          {resultado.resumoPorSolucao.length === 0 ? (
            <p>Sem ofertas neste UF (mock).</p>
          ) : (
            <ul className="cards">
              {resultado.resumoPorSolucao.map((r) => (
                <li key={r.tipo} className="card">
                  <strong>{labelSolucao(r.tipo)}</strong>
                  {r.melhorEconomia != null ? (
                    <>
                      <p>
                        Melhor economia: <em>{brl.format(r.melhorEconomia)}</em> ({fmtPct(r.melhorEconomiaPercentual)})
                      </p>
                      {r.fornecedorMelhor ? (
                        <p className="mut">
                          Fornecedor: {r.fornecedorMelhor.nome} ({r.fornecedorMelhor.id})
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p>—</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <h3>Comparar fornecedores (por oferta e solução)</h3>
          <p className="app__hint">Filtre mentalmente por coluna <strong>Sol.</strong> para comparar ofertas na mesma solução.</p>
          {resultado.comparacoes.length === 0 ? null : (
            <div className="tablewrap">
              <table>
                <caption className="sr">Comparação por fornecedor</caption>
                <thead>
                  <tr>
                    <th>Fornecedor</th>
                    <th>UF</th>
                    <th>Sol.</th>
                    <th className="num">R$/kWh</th>
                    <th className="num">Custo c/ oferta</th>
                    <th className="num">Economia</th>
                    <th className="num">%</th>
                    <th className="num">Clientes</th>
                    <th className="num">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {[...resultado.comparacoes]
                    .sort(
                      (a, b) =>
                        a.solucao.localeCompare(b.solucao) || a.fornecedor.nome.localeCompare(b.fornecedor.nome)
                    )
                    .map((c) => (
                    <tr key={`${c.fornecedor.id}-${c.solucao}-${c.custoKwh}`}>
                      <td>
                        <span className="fn">{c.fornecedor.nome}</span>
                      </td>
                      <td>{c.fornecedor.estadoOrigem}</td>
                      <td>{c.solucao === "GD" ? "GD" : "ML"}</td>
                      <td className="num">{n2(c.custoKwh)}</td>
                      <td className="num">{brl.format(c.custoComFornecedor)}</td>
                      <td className="num">{brl.format(c.economia)}</td>
                      <td className="num">{fmtPct(c.economiaPercentual)}</td>
                      <td className="num">{c.fornecedor.totalDeClientes.toLocaleString("pt-BR")}</td>
                      <td className="num">{c.fornecedor.avaliacaoMedia.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
