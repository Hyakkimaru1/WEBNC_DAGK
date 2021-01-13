FROM node:14-slim

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "yarn", "start" ]