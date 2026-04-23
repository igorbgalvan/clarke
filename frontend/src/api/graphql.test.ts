import { afterEach, describe, expect, it, vi } from "vitest";
import { graphqlRequest } from "./graphql.ts";

describe("graphqlRequest", () => {
  const orig = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = orig;
    vi.restoreAllMocks();
  });

  it("faz POST com query e variáveis no corpo JSON", async () => {
    const fetchM = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    globalThis.fetch = fetchM as unknown as typeof fetch;

    const data = await graphqlRequest<{ ok: boolean }>(`query { ok }`, { a: 1 });
    expect(data.ok).toBe(true);
    expect(fetchM).toHaveBeenCalledTimes(1);
    const [url, init] = fetchM.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:4000/graphql");
    expect(init?.method).toBe("POST");
    const body = JSON.parse(String(init?.body)) as { query: string; variables: Record<string, number> };
    expect(body.query).toContain("ok");
    expect(body.variables).toEqual({ a: 1 });
  });

  it("lança com a mensagem do primeiro erro GraphQL se errors existir", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ errors: [{ message: "UF inválida" }], data: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    ) as unknown as typeof fetch;

    await expect(graphqlRequest("query { x }", undefined)).rejects.toThrow("UF inválida");
  });

  it("lança se HTTP não for 2xx", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response("not json", { status: 500 })
    ) as unknown as typeof fetch;

    await expect(graphqlRequest("query { x }", undefined)).rejects.toThrow();
  });
});
