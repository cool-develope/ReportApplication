FROM node:12.18.4

WORKDIR /app

COPY ./yarn.lock ./

COPY ./package.json ./

RUN yarn install

COPY . .

CMD ["yarn", "start"]