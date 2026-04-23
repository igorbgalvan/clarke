# Build estático do Vite + Nginx a servir o SPA (contexto: raiz do monorepo).
FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_GRAPHQL_URL=/graphql
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY frontend ./frontend
RUN npm ci
RUN npm run build -w frontend

FROM nginx:1.27-alpine
COPY docker/nginx-spa.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
