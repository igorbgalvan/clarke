# Imagem da API (Node + GraphQL). Contexto: raiz do monorepo.
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend ./backend
RUN npm ci
RUN npm run build -w backend

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY --from=build /app/backend ./backend
RUN npm ci --omit=dev
EXPOSE 4000
# Escuta em todas as interfaces (rede Docker)
CMD ["node", "backend/dist/index.js"]
