FROM node:18.17.1-alpine

WORKDIR /app

ARG NODE_ENV=production

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]