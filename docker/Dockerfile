####################
#       Base       #
####################
FROM oven/bun:1 AS base

WORKDIR /app

# Import ENV variables for build time
ARG NODE_ENV
ARG NEXTJS_STANDALONE
ARG DATABASE_URL
ARG POSTGRES_HOST
ARG NEXT_PUBLIC_BASE_URL

RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client curl && rm -rf /var/lib/apt/lists/*

########################
#   Dev Dependencies   #
########################
FROM base AS dev-deps

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

#########################
#   Prod Dependencies   #
#########################
FROM base AS prod-deps

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

####################
#     Builder      #
####################
FROM dev-deps AS builder

COPY . .

# Important to set "NEXT_PUBLIC_*" ENVs before nextjs build
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN bun run prisma:generate
RUN bun run build

####################
#     Runner       #
####################
FROM prod-deps AS runner

# Create non-root user BEFORE copying files with --chown
RUN groupadd --gid 1001 nodejs
RUN useradd --uid 1001 --gid nodejs nextjs

# Build files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.mts ./prisma.config.mts
COPY --from=builder --chown=nextjs:nodejs /app/fixtures ./fixtures
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib
COPY --from=builder --chown=nextjs:nodejs /app/utils ./utils
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# Switch to non-root user
USER nextjs

# Set prod env
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["/bin/sh", "-c", "\
    echo '🚀 Starting Next.js application...' && \
    bunx prisma migrate deploy && \
    bun run fixtures:setup && \
    node server.js \
"]
