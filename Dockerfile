# syntax=docker/dockerfile:1

# Multi-stage so the shipped image carries the compiled server and nothing
# else: no source, no dev dependencies, no build toolchain.

# ---- deps ------------------------------------------------------------------
# Separated from the build so a source change does not reinstall node_modules.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ---------------------------------------------------------------
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# next build wants these present, but the sign-up route only reads DATABASE_URL
# at request time, so a placeholder is enough to compile against.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner ----------------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Never run the server as root.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# output: "standalone" traces the imports and emits a server with only the
# packages it actually uses, which is why node_modules is not copied here.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Migrations run from the image too, so the scripts and their one dependency
# come along.
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/waitlist-sql.ts ./src/lib/waitlist-sql.ts

USER nextjs
EXPOSE 3000

# Reports the container unhealthy if the app stops answering, so an
# orchestrator restarts it instead of leaving a dead container in rotation.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
