# ── Build stage ──────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ── Runtime stage ─────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# Run migration then start server
CMD ["sh", "-c", "node src/database/migrate.js && node src/server.js"]
