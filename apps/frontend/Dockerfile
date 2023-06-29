FROM node:18-alpine AS base

WORKDIR /app

COPY package.json ./
COPY ../../package-lock.json ./

RUN npm ci

COPY . .

FROM base AS builder

RUN npm run build

FROM builder AS start

ENTRYPOINT [ "npm", "run", "preview" ]

FROM base AS dev

ENTRYPOINT [ "npm", "run", "dev" ]