# Etapa 1: build
FROM node:22 AS builder

WORKDIR /app

# Copia arquivos de dependência primeiro (otimiza cache)
COPY package*.json ./
RUN npm install

# Copia todos os arquivos restantes, incluindo .env e src/
COPY . .

# Gera o build de produção
RUN npm run build

# Etapa 2: runner
FROM node:22-alpine AS runner

WORKDIR /app

# Copia arquivos essenciais da build
COPY --from=builder /app/.next .next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env .env

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]