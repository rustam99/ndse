FROM node:20.9.0-alpine3.18

WORKDIR /app

COPY ./package*.json ./

RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]