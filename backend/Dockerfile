# Multi-stage Dockerfile for LaundryKu Backend API

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies required for Prisma & native builds on Alpine
RUN apk add --no-cache libc6-compat openssl

# Skip downloading Chrome binary during npm install (we use Alpine system Chromium in runner)
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci || npm install

COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4001
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install Chromium, fonts, and OpenSSL/libc6-compat required by Puppeteer & Prisma on Alpine Linux
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    libc6-compat \
    openssl

COPY package*.json ./
COPY prisma ./prisma/
RUN (npm ci --omit=dev || npm install --omit=dev)

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4001

CMD ["node", "dist/app.js"]


