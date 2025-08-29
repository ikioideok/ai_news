# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm ci
COPY . .
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node","server.cjs"]
