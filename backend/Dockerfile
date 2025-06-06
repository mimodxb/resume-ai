FROM node:23-alpine

RUN \
  mkdir -p /home/node/app/node_modules /home/node/app/output \
  && \
  apk add pandoc

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node /home/node/app

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 5001

CMD [ "npm", "start" ]
