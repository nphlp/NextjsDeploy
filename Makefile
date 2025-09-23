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
	@./scripts/merge-env.sh --base $(BASE) --override $(OVERRIDE_LOCAL) --override $(OVERRIDE_VPS) --output .env.override.vps

#####################
#   Nextjs server   #
#####################

DC = BUILDKIT_PROGRESS=plain COMPOSE_BAKE=true docker compose
ENV_MERGED = --env-file .env.merged

BASIC = compose.basic.yml
LOCAL = compose.local.yml
VPS = compose.vps.yml

.PHONY: basic basic-stop local local-stop

# Build (without portainer)
basic:
	@make merge-env-basic
	$(DC) $(ENV_MERGED) -f $(BASIC) up -d --build
	@echo "🚀 Access the app at: http://localhost:3000 ✅"

basic-stop:
	@make merge-env-basic
	$(DC) $(ENV_MERGED) -f $(BASIC) down

# Build (for portainer local)
local:
	@make merge-env-local
	$(DC) $(ENV_MERGED) -f $(LOCAL) up -d --build
	@echo "🚀 Access the app at: https://front.local.dev ✅"

local-stop:
	@make merge-env-local
	$(DC) $(ENV_MERGED) -f $(LOCAL) down
