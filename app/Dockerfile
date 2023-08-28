FROM node:18.17.1-alpine

WORKDIR /app

ARG NODE_ENV=production

COPY ./package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
