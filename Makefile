#################
#  Import .env  #
#################

# Import environment variables from .env if it exists
ifneq (,$(wildcard .env))
    include .env
endif

################################
#  Clear non versionned files  #
################################

.PHONY: clear

clear:
	rm -rf .husky/_
	rm -rf .next
	rm -rf node_modules
	rm -rf prisma/client
	rm -f next-env.d.ts tsconfig.tsbuildinfo
	rm -rf .env env/.env.docker env/.env.experiment env/.env.preview env/.env.production

##############
#  Variables #
##############

DC = BUILDKIT_PROGRESS=plain COMPOSE_BAKE=true docker compose

POSTGRES = docker/compose.postgres.yml
DOCKER = docker/compose.docker.yml

#################
#   Setup Env   #
#################

# Generate .env files from env/env.config.mjs (plain Node.js, no deps)
# Auto-skip: .env exists AND newer than env/env.config.mjs
.PHONY: setup-env

setup-env:
	@if [ ! -f env/env.config.mjs ] || [ ! -f .env ] || [ env/env.config.mjs -nt .env ]; then \
		node scripts/setup-env.mjs; \
	fi

################
#   Postgres   #
################

# Start Postgres + Prisma Studio containers
.PHONY: postgres postgres-stop postgres-clear

postgres: setup-env
	@$(DC) --env-file .env -f $(POSTGRES) up -d --build --wait

postgres-stop:
	@$(DC) --env-file .env -f $(POSTGRES) down

postgres-clear:
	@$(DC) --env-file .env -f $(POSTGRES) down -v

################
#  App Setup   #
################

# Install deps + setup database + Prisma client + migrations + fixtures
# Each step auto-skips if already done
.PHONY: app-setup

app-setup:
	@if [ ! -f node_modules/.package-lock.json ] || [ bun.lock -nt node_modules/.package-lock.json ]; then \
		bun install; \
	fi
	@if [ -d vendor/better-auth ]; then \
		$(MAKE) better-auth-link > /dev/null 2>&1; \
	fi
	@bun run db:setup
	@if [ ! -d prisma/client ] || [ prisma/schema.prisma -nt prisma/client ]; then \
		bun run prisma:generate; \
	fi
	@bun run prisma:deploy
	@bun run fixtures:setup

################
#  Dev / Start #
################

# Local development server -> http://localhost:3000
.PHONY: dev start

dev: postgres app-setup
	@echo ""
	@echo "🚀 Nextjs Server: http://localhost:3000 ✅"
	@echo "📚 Prisma Studio: http://localhost:5555 🔥"
	@echo "📬 Mailpit: http://localhost:8025 📤"
	@bun run dev; make postgres-stop

# Local build server for testing -> http://localhost:3000
start: postgres app-setup
	@bun run build
	@echo ""
	@echo "🚀 Nextjs Server: http://localhost:3000 ✅"
	@echo "📚 Prisma Studio: http://localhost:5555 🔥"
	@echo "📬 Mailpit: http://localhost:8025 📤"
	@bun run start; make postgres-stop

##############
#   Tests    #
##############

.PHONY: test test-unit test-unit-auth test-unit-email test-unit-contact test-integration test-functional test-e2e test-all

# Unit tests (no infra needed)
test-unit:
	@bun run test:unit

test-unit-api:
	@bun run test:unit -- test/unit/api

test-unit-auth:
	@bun run test:unit -- test/unit/auth

test-unit-email:
	@bun run test:unit -- test/unit/email

test-unit-contact:
	@bun run test:unit -- test/unit/contact

# Integration tests (requires Docker: Postgres + Mailpit)
# -> trap ensures Docker stops even on Ctrl+C
test-integration: postgres app-setup
	@bun run fixtures:reload
	@bash -c 'trap "make postgres-stop" EXIT; bun run test:integration'

# Functional tests (requires Docker + mocks external APIs via MSW)
test-functional: postgres app-setup
	@bun run fixtures:reload
	@bash -c 'trap "make postgres-stop" EXIT; bun run test:functional'

# E2E server (interactive: starts server, run tests manually in another terminal)
test: postgres app-setup
	@bun run fixtures:reload
	@bun run build
	@echo ""
	@echo "🚀 Nextjs Server: http://localhost:3000 ✅"
	@echo "📚 Prisma Studio: http://localhost:5555 🔥"
	@echo "📬 Mailpit: http://localhost:8025"
	@echo "👉 Run 'bun run test:e2e' in another terminal"
	@NODE_ENV=test bun run start; make postgres-stop

# E2E tests (automated: build, start server, run tests, stop everything)
# -> trap ensures server + Docker stop even on Ctrl+C or test failure
test-e2e: postgres app-setup
	@bun run fixtures:reload
	@bun run build
	@bash -c '\
		cleanup() { kill $$(lsof -ti :3000) 2>/dev/null; sleep 1; kill $$(lsof -ti :3000) 2>/dev/null; make postgres-stop; }; \
		trap cleanup EXIT; \
		NODE_ENV=test bun run start 2>/dev/null & \
		sleep 3; \
		bun run test:e2e'

##################
#  Make Docker   #
##################

# Build and run Next.js Docker image with DB access (for generateStaticParams)
# Requires: make postgres (auto-started as dependency)
.PHONY: docker docker-stop docker-clear

docker: setup-env
	@$(DC) --env-file env/.env.docker -f $(POSTGRES) up -d --build --wait
	@$(DC) --env-file env/.env.docker -f $(DOCKER) up -d --build && \
	echo "" && \
	echo "🚀 Nextjs Server: http://localhost:3000 ✅" && \
	echo "📚 Prisma Studio: http://localhost:5555 🔥" && \
	echo "📬 Mailpit: http://localhost:8025 📤"

docker-stop:
	@$(DC) --env-file env/.env.docker -f $(DOCKER) down
	@$(DC) --env-file env/.env.docker -f $(POSTGRES) down

docker-clear:
	@$(DC) --env-file env/.env.docker -f $(DOCKER) down
	@$(DC) --env-file env/.env.docker -f $(POSTGRES) down -v

#####################
#    Ngrok Tunnel   #
#####################

.PHONY: ngrok

# Ngrok Tunnel to expose local webserver through a static public URL
# -> Make `localhost:3000` accessible through `https://your-static-url.ngrok-free.app`
# -> Useful for mobile debugging, functional testing or sharing with others
ngrok:
	@if [ -z "$(NGROK_URL)" ]; then \
		echo; \
		echo "ℹ️ NGROK_URL is not set in .env file"; \
		echo; \
		echo "1. Create an account at https://ngrok.com/"; \
		echo "2. Setup your authtoken from https://dashboard.ngrok.com/get-started/setup"; \
		echo "3. Get a static URL for free at https://dashboard.ngrok.com/domains"; \
		echo "4. Add the NGROK_URL to your .env file"; \
		echo; \
		echo "Then, run 'make ngrok' to start the tunnel 🔥"; \
		echo; \
	else \
		if curl -s http://localhost:3000 > /dev/null 2>&1; then \
			echo "🚀 Starting ngrok tunnel for: $(NGROK_URL)"; \
			ngrok http --url="$(NGROK_URL)" http://localhost:3000; \
		else \
			echo; \
			echo "👋 Nextjs server is not running..."; \
			echo; \
			echo "1. In a first terminal instance, start the Nextjs server with:"; \
			echo "NEXT_PUBLIC_BASE_URL=$(NGROK_URL) make dev"; \
			echo; \
			echo "2. In a second terminal instance, start Ngrok Tunnel with :"; \
			echo "make ngrok"; \
			echo; \
			echo "Then, access the app at: $(NGROK_URL) ✅"; \
			echo; \
		fi \
	fi

##########################
#   Better Auth (fork)   #
##########################

.PHONY: better-auth-install better-auth-build better-auth-dev better-auth-link

BA_DIR = vendor/better-auth

# Install fork dependencies (pnpm monorepo)
better-auth-install:
	@cd $(BA_DIR) && pnpm install

# Build fork packages (core + telemetry + better-auth + passkey)
better-auth-build:
	@cd $(BA_DIR) && pnpm --filter @better-auth/core build && pnpm --filter @better-auth/telemetry build && pnpm --filter @better-auth/kysely-adapter build && pnpm --filter @better-auth/prisma-adapter build && pnpm --filter @better-auth/memory-adapter build && pnpm --filter better-auth build && pnpm --filter @better-auth/passkey build

# Watch mode (rebuild on changes)
better-auth-dev:
	@cd $(BA_DIR) && pnpm --filter @better-auth/core build && pnpm --filter @better-auth/telemetry build && pnpm --filter better-auth dev & pnpm --filter @better-auth/passkey dev

# Link fork packages to this project (run after build)
better-auth-link:
	@cd $(BA_DIR)/packages/core && bun link
	@cd $(BA_DIR)/packages/telemetry && bun link
	@cd $(BA_DIR)/packages/better-auth && bun link
	@cd $(BA_DIR)/packages/passkey && bun link
	@bun link better-auth @better-auth/passkey @better-auth/core @better-auth/telemetry

#####################
#   Dump Database   #
#####################

.PHONY: dump

# Dump the database schema from the running Postgres container
# -> Exports to prisma/dump.sql
dump:
	@docker exec postgres-dev-nextjs-deploy pg_dump -U postgres -d nextjs-deploy-db --schema-only --clean --if-exists --no-owner --no-privileges > prisma/dump.sql
	@echo "✅ Schema dumped to prisma/dump.sql"
