# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (all, including devDeps for TypeScript compiler)
COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript → dist/
COPY tsconfig.json ./
COPY src/ ./src/
COPY prisma/ ./prisma/
RUN npx prisma generate && npm run build

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Install only production dependencies + generate Prisma client for this OS
COPY package*.json ./
COPY prisma/ ./prisma/
RUN npm ci --omit=dev && npx prisma generate

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# Copy EJS views, CSS, JS (referenced at runtime via path.join(__dirname, '../view'))
COPY view/ ./view/

EXPOSE 3000

# Run DB migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
