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
	rm -rf .env env/.env.basic env/.env.experiment env/.env.preview env/.env.production

##############
#  Variables #
##############

DC = BUILDKIT_PROGRESS=plain COMPOSE_BAKE=true docker compose

POSTGRES = docker/compose.postgres.yml
BASIC = docker/compose.basic.yml

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
	@if [ ! -f node_modules/.modules.yaml ] || [ pnpm-lock.yaml -nt node_modules/.modules.yaml ]; then \
		pnpm install; \
	fi
	@pnpm db:setup
	@if [ ! -d prisma/client ] || [ prisma/schema.prisma -nt prisma/client ]; then \
		pnpm prisma:generate; \
	fi
	@pnpm prisma:deploy
	@pnpm fixtures:setup

################
#  Dev / Start #
################

# Local development server -> http://localhost:3000
.PHONY: dev start

dev: postgres app-setup
	@pnpm dev; make postgres-stop

# Local build server for testing -> http://localhost:3000
start: postgres app-setup
	@pnpm build && pnpm start; make postgres-stop

################
#  Make Basic  #
################

# Fully containerized environment for local testing
.PHONY: basic basic-stop basic-clear

basic: setup-env
	@$(DC) --env-file env/.env.basic -f $(BASIC) up -d --build && \
	echo "🚀 Nextjs Server: http://localhost:3000 ✅" && \
	echo "📚 Prisma Studio: http://localhost:5555 🔥"

basic-stop:
	@$(DC) --env-file env/.env.basic -f $(BASIC) down

basic-clear:
	@$(DC) --env-file env/.env.basic -f $(BASIC) down -v

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

#####################
#   Dump Database   #
#####################

.PHONY: dump

# Dump the database schema from the running Postgres container
# -> Exports to prisma/dump.sql
dump:
	@docker exec postgres-dev-nextjs-deploy pg_dump -U postgres -d nextjs-deploy-db --schema-only --clean --if-exists --no-owner --no-privileges > prisma/dump.sql
	@echo "✅ Schema dumped to prisma/dump.sql"
