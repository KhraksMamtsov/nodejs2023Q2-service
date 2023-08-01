FROM node:18-alpine as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]