# Clarke Energia — desafio técnico

Monorepo com **React** (`frontend/`) e **Node** (`backend/`). Requisitos: ver `8bdd9de015673b5879116a6f1af0178f/desafio_clarke_2026.md`.

## Requisitos

- Node.js 20+ (recomendado 20.19+ para o ecossistema ESLint mais recente)

## Comandos

- `npm install` — instala `frontend` e `backend` (workspaces)
- `npm run dev:web` — Vite (frontend, `http://localhost:5173` com proxy implícito via CORS; em dev, `VITE_GRAPHQL_URL` aponta para a API; ver `frontend/.env.example`)
- `npm run dev:api` — API Express em `PORT` (padrão `4000`); **GraphQL** em `http://localhost:4000/graphql` (GraphiQL no browser; `GET /health` para liveness)
- `npm run build` — compila `backend` e `frontend`
- `npm run test:api` — testes unitários do backend (Vitest: domínio, repositório, simulação)
- `npm run test:web` — testes do frontend (Vitest + Testing Library: `fetch`, `App`)
- `npm test` — backend + frontend

## Docker (local)

```bash
docker compose up --build
```

- **Interface:** <http://localhost:8080> (Nginx a servir o front; `/graphql` faz *proxy* para a API, para o *browser* usar a mesma origem).
- **API direto (debug):** <http://localhost:4000> (`/health`, `/graphql`).

*Nota:* a imagem do *front* é construída com `VITE_GRAPHQL_URL=/graphql` para bater com o Nginx. Em VPS podes ajustar portas ou pôr um *reverse proxy* à frente.
