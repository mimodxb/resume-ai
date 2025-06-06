FROM node:23-alpine AS builder

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node /home/node/app

USER node

COPY --chown=node:node . .

RUN npm install && npm run build


FROM bitnami/nginx:latest

COPY --from=builder /home/node/app/build /app/
