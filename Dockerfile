FROM node:18.17.1-alpine

WORKDIR /app

ARG NODE_ENV=production

COPY ./app/package*.json ./

RUN npm install

COPY ./app/* .

CMD ["npm", "run", "start"]
