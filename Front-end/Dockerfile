FROM node:14

WORKDIR /app

COPY package* yarn.lock ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]