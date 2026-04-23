import { useEffect, useState, type FormEvent } from "react";
import { graphqlRequest } from "./api/graphql.ts";
import { Q_SIMULACAO, Q_UFS } from "./api/queries.ts";
import type { ComparacaoFornecedor, Simulacao, SimulacaoData, UfsData } from "./api/types.ts";
import { labelSolucao } from "./labels.ts";
import { blocosOfertasPorSolucao } from "./ordenarOfertas.ts";
import "./App.css";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const n2 = (x: number) => x.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

function fmtPct(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${(n * 100).toFixed(1).replace(".", ",")}%`;
}

function LogoFornecedor({ nome, url }: { nome: string; url: string }) {
  return (
    <img
      className="app__fornec-logo"
      src={url}
      alt={`Logo ${nome}`}
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
    />
  );
}

function TabelaOfertas({ linhas }: { linhas: ComparacaoFornecedor[] }) {
  if (linhas.length === 0) {
    return null;
  }
  return (
    <div className="tablewrap">
      <table>
        <caption className="sr">Demais ofertas</caption>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Fornecedor</th>
            <th>UF</th>
            <th className="num">R$/kWh</th>
            <th className="num">Custo c/ oferta</th>
            <th className="num">Economia</th>
            <th className="num">%</th>
            <th className="num">Clientes</th>
            <th className="num">Nota</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((c) => (
            <tr key={`${c.fornecedor.id}-${c.solucao}-${c.custoKwh}`}>
              <td>
                <LogoFornecedor nome={c.fornecedor.nome} url={c.fornecedor.logoUrl} />
              </td>
              <td>
                <span className="fn">{c.fornecedor.nome}</span>
              </td>
              <td>{c.fornecedor.estadoOrigem}</td>
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
  );
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
      <div className="app__strip" aria-hidden />
      <header className="app__brand">
        <img className="app__logo" src="/clarke-logo.png" alt="Clarke Energia" />
        <h1>Simulador de economia</h1>
        <p className="app__tagline">Dados fictícios — escolha a UF, informe o consumo mensal e veja a melhor oferta por solução.</p>
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
          {carregando ? "Calculando…" : "Simular economia"}
        </button>
      </form>

      {erro ? <p className="app__erro" role="alert">{erro}</p> : null}

      {resultado ? (
        <section className="app__result" aria-live="polite">
          <h2>Resultado</h2>
          <p className="app__ref">
            <strong>Referência no {resultado.uf}:</strong> {n2(resultado.tarifaBaseKwh)} R$/kWh · Custo base estimado{" "}
            {brl.format(resultado.custoBase)} (consumo {n2(resultado.consumoKwh)} kWh)
          </p>

          {resultado.comparacoes.length === 0 ? (
            <p>Sem ofertas neste UF (mock).</p>
          ) : (
            <div className="app__blocos">
              {blocosOfertasPorSolucao(resultado.comparacoes).map(({ tipo, melhor, outras }) => (
                <div key={tipo} className="app__bloco-solucao">
                  <h3>{labelSolucao(tipo)}</h3>

                  <div className="app__oferta-destaque">
                    <p className="app__oferta-rotulo">Melhor oferta nesta solução</p>
                    <div className="app__oferta-headline">
                      <LogoFornecedor nome={melhor.fornecedor.nome} url={melhor.fornecedor.logoUrl} />
                      <p className="app__oferta-tit">
                        <strong>{melhor.fornecedor.nome}</strong>
                      </p>
                    </div>
                    <dl className="app__defgrid">
                      <div>
                        <dt>Economia</dt>
                        <dd>
                          <strong>{brl.format(melhor.economia)}</strong> ({fmtPct(melhor.economiaPercentual)})
                        </dd>
                      </div>
                      <div>
                        <dt>Preço</dt>
                        <dd>
                          <strong>{n2(melhor.custoKwh)} R$/kWh</strong> · Custo: {brl.format(melhor.custoComFornecedor)}
                        </dd>
                      </div>
                      <div>
                        <dt>Clientes / nota</dt>
                        <dd>
                          <strong>{melhor.fornecedor.totalDeClientes.toLocaleString("pt-BR")}</strong> · Nota{" "}
                          <strong>{melhor.fornecedor.avaliacaoMedia.toFixed(1)}</strong> · {melhor.fornecedor.estadoOrigem}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {outras.length > 0 ? (
                    <>
                      <h4 className="app__subh">Demais ofertas</h4>
                      <TabelaOfertas linhas={outras} />
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
