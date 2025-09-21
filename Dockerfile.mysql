####################
#       Base       #
####################
FROM node:24-alpine AS base

WORKDIR /app

# Import ENV variables for build time
ARG NODE_ENV
ARG NEXTJS_STANDALONE
ARG DATABASE_URL
ARG MYSQL_HOST

# Check import
# RUN echo "=====> Build Arguments <====="
# RUN echo "NODE_ENV -> $NODE_ENV"
# RUN echo "NEXTJS_STANDALONE -> $NEXTJS_STANDALONE"
# RUN echo "DATABASE_URL -> $DATABASE_URL"
# RUN echo "MYSQL_HOST -> $MYSQL_HOST"
# RUN echo "============================="

RUN npm install -g pnpm
RUN apk add --no-cache mysql-client mariadb-connector-c

# Recommended by NextJS
RUN apk add --no-cache libc6-compat

########################
#   Dev Dependencies   #
########################
FROM base AS dev-deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

#########################
#   Prod Dependencies   #
#########################
FROM base AS prod-deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

####################
#     Builder      #
####################
FROM dev-deps AS builder

COPY . .

RUN pnpm prisma:generate
RUN pnpm build

####################
#     Runner       #
####################
FROM prod-deps AS runner

# Build files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/fixtures ./fixtures
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib
COPY --from=builder --chown=nextjs:nodejs /app/utils ./utils

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Switch to non-root user
USER nextjs
# EXPOSE 3000

# Set prod env
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["/bin/sh", "-c", "\
    pnpm db:setup --docker --ssl && \
    pnpm prisma:deploy && \
    pnpm fixtures:setup && \
    node server.js \
"]
