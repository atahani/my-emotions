FROM node:lts-alpine3.11

LABEL maintainer="Rastech Developers <developers@rastech.ir>"

WORKDIR /app

COPY packages/backend/ ./packages/backend/
COPY packages/types/ ./packages/types/
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY lerna.json .
COPY package.json .
COPY yarn.lock .

# install all of the dependences
RUN yarn install

WORKDIR /app/packages/backend
RUN yarn run build

WORKDIR /app/packages/backend/dist

CMD ["npm", "run", "start:prod"]