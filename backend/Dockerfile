FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

COPY ormconfig.json .

RUN yarn build
RUN cp -r ./static ./dist/static

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]