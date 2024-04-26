FROM node:18.17.1

WORKDIR /usr/app


COPY .yarn ./.yarn
COPY package.json yarn.lock ./RUN yarn

RUN npm install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]