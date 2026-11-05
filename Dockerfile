# syntax=docker/dockerfile:1
# -----------------------------------------------------------------------------
# Stage 1: Dependencies Resolution
# -----------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Tambahkan dependensi kompatibilitas sistem jika diperlukan
RUN apk add --no-cache libc6-compat

# Salin berkas manifes dependensi untuk instalasi deterministik
COPY package.json package-lock.json ./
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 2: Source Compilation & Application Build
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client sebelum build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Minimal Production Runtime (Hardened Non-Root Container)
# -----------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Hardening: Buat user dan group khusus tanpa hak akses root (UID/GID 1001)
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Salin hanya artefak build mandiri (standalone) dengan kepemilikan non-root
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Jalankan proses sebagai non-root
USER nextjs
EXPOSE 3000

# Perintah eksekusi runtime mandiri
CMD ["node", "server.js"]

