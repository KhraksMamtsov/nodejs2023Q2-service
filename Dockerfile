FROM node:18-alpine as dependencies
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/app
COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig*.json ./
RUN npm ci && \
    npm cache clean --force && \
    npm run db:client:generate

FROM node:18-alpine as builder
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/app
COPY --from=dependencies /usr/app .
COPY src ./
COPY prisma ./prisma
COPY nest-cli.json ./
COPY tsconfig*.json ./
RUN npm run build

FROM node:18-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/app
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/dist ./dist
COPY prisma ./prisma
COPY package*.json ./
CMD ["npm", "run", "start:prod:docker"]