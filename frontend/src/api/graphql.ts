/**
 * Uma função, um POST, um JSON: é isto o protocolo GraphQL over HTTP.
 * (Sem Apollo/urql para a curva de aprendizagem ser só React + o contrato.)
 */
const defaultUrl = "http://localhost:4000/graphql";

function graphqlUrl(): string {
  return import.meta.env.VITE_GRAPHQL_URL ?? defaultUrl;
}

type GraphQLErrorResponse = { errors: { message: string }[] };
type GraphQLOK<T> = { data: T; errors?: undefined };

export async function graphqlRequest<TData>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> {
  const res = await fetch(graphqlUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `HTTP ${res.status}`);
  }
  const body = (await res.json()) as
    | GraphQLOK<TData>
    | (GraphQLErrorResponse & { data?: TData });

  if (body.errors?.length) {
    throw new Error(body.errors[0].message);
  }
  if (!("data" in body) || body.data === undefined || body.data === null) {
    throw new Error("Resposta GraphQL sem dados.");
  }
  return body.data;
}
