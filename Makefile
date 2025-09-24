########################
#    Merge Env Files   #
########################

BASE = .env
OUTPUT = .env.merged
OUTPUT_VPS = .env.override.vps

OVERRIDE_BASIC = .env.override.basic
OVERRIDE_LOCAL = .env.override.local
OVERRIDE_VPS = .env.override.vps

.PHONY: merge-env-basic merge-env-local

merge-env-basic:
	@./scripts/merge-env.sh --base $(BASE) --override $(OVERRIDE_BASIC) --output $(OUTPUT)

merge-env-local:
	@./scripts/merge-env.sh --base $(BASE) --override $(OVERRIDE_LOCAL) --output $(OUTPUT)

merge-env-vps:
	@./scripts/merge-env.sh --base $(BASE) --override $(OVERRIDE_VPS) --output $(OUTPUT_VPS)

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
.PHONY: postgres postgres-stop postgres-clean

postgres:
	$(DC) -f $(POSTGRES) up -d --build
	@echo "🚀 Postgres is running on port 5432 ✅"
	@echo "📝 Now start Nextjs with 'pnpm auto'"

postgres-stop:
	$(DC) -f $(POSTGRES) down

postgres-clean:
	$(DC) -f $(POSTGRES) down -v

# Build (without portainer)
.PHONY: basic basic-stop basic-clean

basic:
	@make merge-env-basic
	$(DC) $(ENV_MERGED) -f $(BASIC) up -d --build
	@echo "🚀 Access the app at: http://localhost:3000 ✅"

basic-stop:
	@make merge-env-basic
	$(DC) $(ENV_MERGED) -f $(BASIC) down

basic-clean:
	@make merge-env-basic
	$(DC) $(ENV_MERGED) -f $(BASIC) down -v

# Build (for portainer local)
.PHONY: local local-stop local-clean

local:
	@make merge-env-local
	$(DC) $(ENV_MERGED) -f $(LOCAL) up -d --build
	@echo "🚀 Access the app at: https://front.local.dev ✅"

local-stop:
	@make merge-env-local
	$(DC) $(ENV_MERGED) -f $(LOCAL) down

local-clean:
	@make merge-env-local
	$(DC) $(ENV_MERGED) -f $(LOCAL) down -v
