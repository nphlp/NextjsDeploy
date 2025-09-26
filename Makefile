include .env

########################
#    Merge Env Files   #
########################

BASE = .env
OUTPUT = .env.merged

OVERRIDE_BASIC = .env.override.basic
OVERRIDE_LOCAL = .env.override.local
OVERRIDE_VPS = .env.override.vps

.PHONY: merge-env-basic merge-env-local

merge-env-basic:
	@./scripts/merge-env.sh --base $(BASE) --override $(OVERRIDE_BASIC) --output $(OUTPUT)

merge-env-local:
	@./scripts/merge-env.sh --base $(BASE) --override $(OVERRIDE_LOCAL) --output $(OUTPUT)

merge-env-vps:
	@./scripts/merge-env.sh --base $(BASE) --override $(OVERRIDE_VPS) --output .env.vps

#####################
#   Nextjs server   #
#####################

DC = BUILDKIT_PROGRESS=plain COMPOSE_BAKE=true docker compose
ENV_MERGED = --env-file .env.merged

POSTGRES = compose.postgres.yml
BASIC = compose.basic.yml
LOCAL = compose.local.yml
VPS = compose.vps.yml

# Postgres standalone (for dev with nextjs terminal server)
.PHONY: postgres postgres-stop postgres-clear

postgres:
	$(DC) -f $(POSTGRES) up -d --build
	@echo "🚀 Postgres is running on port 5432 ✅"
	@echo "📝 Now start Nextjs with 'pnpm auto'"

postgres-stop:
	$(DC) -f $(POSTGRES) down

postgres-clear:
	$(DC) -f $(POSTGRES) down -v

# Dev and prod shortcut (nextjs in terminal + postgres in docker)
.PHONY: dev prod ngrok

dev:
	@make postgres
	@pnpm auto && make postgres-stop && make postgres-stop
	@echo "🚀 Access the app at: http://localhost:3000 ✅"

prod:
	@make postgres
	@pnpm auto:prod && make postgres-stop && make postgres-stop
	@echo "🚀 Access the app at: http://localhost:3000 ✅"

ngrok:
	@if [ -z "$(NGROK_URL)" ]; then \
		echo "ℹ️ NGROK_URL is not set in .env file"; \
		echo; \
		echo "1. Create an account at https://ngrok.com/"; \
		echo "2. Setup your authtoken from https://dashboard.ngrok.com/get-started/setup"; \
		echo "3. Get a static URL for free at https://dashboard.ngrok.com/domains"; \
		echo "4. Add the NGROK_URL to your .env file"; \
		echo "5. Run 'make ngrok' to start the tunnel 🌐"; \
		exit 1; \
	fi
	@if curl -s http://localhost:3000 > /dev/null 2>&1; then \
		echo "🚀 Starting ngrok tunnel for: $(NGROK_URL)"; \
		ngrok http --url="$(NGROK_URL)" http://localhost:3000; \
	else \
		echo; \
		echo "👋 Please, start the Nextjs server first with the following command"; \
		echo; \
		echo "NEXT_PUBLIC_BASE_URL=$(NGROK_URL) make dev"; \
		echo; \
		echo "🔥 Then, restart Ngrok Tunnel in another terminal instance with : make ngrok"; \
		echo; \
	fi

# Build (without portainer)
.PHONY: basic basic-stop basic-clear

basic:
	@make merge-env-basic
	$(DC) $(ENV_MERGED) -f $(BASIC) up -d --build
	@echo "🚀 Access the app at: http://localhost:3000 ✅"

basic-stop:
	@make merge-env-basic
	$(DC) $(ENV_MERGED) -f $(BASIC) down

basic-clear:
	@make merge-env-basic
	$(DC) $(ENV_MERGED) -f $(BASIC) down -v

# Build (for portainer local)
.PHONY: local local-stop local-clear

local:
	@make merge-env-local
	$(DC) $(ENV_MERGED) -f $(LOCAL) up -d --build
	@echo "🚀 Access the app at: https://front.local.dev ✅"

local-stop:
	@make merge-env-local
	$(DC) $(ENV_MERGED) -f $(LOCAL) down

local-clear:
	@make merge-env-local
	$(DC) $(ENV_MERGED) -f $(LOCAL) down -v
