########################
#    Merge Env Files   #
########################

.PHONY: merge-env

merge-env:
	@./scripts/merge-env.sh --base .env --override .env.override --output .env.merged

####################
#    Certificates  #
####################

.PHONY: certs-setup certs-reset certs-reload

# Generate SSL certificates if needed
certs-setup:
	@./scripts/ssl-certs.sh setup

# Reset the certs
certs-reset:
	@./scripts/ssl-certs.sh reset

# Reload the certs
certs-reload:
	@./scripts/ssl-certs.sh reload

#####################
#   Nextjs server   #
#####################

DC = COMPOSE_BAKE=true docker compose
ENV_MERGED = --env-file .env.merged

BASIC = compose.basic.yml
LOCAL = compose.local.yml
VPS = compose.vps.yml

.PHONY: basic basic-stop local local-stop vps vps-stop

# Build (without portainer)
basic:
	@make merge-env
	$(DC) $(ENV_MERGED) -f $(BASIC) up -d --build

basic-stop:
	$(DC) $(ENV_MERGED) -f $(BASIC) down

# Build (for portainer local)
local:
	@make merge-env
	$(DC) $(ENV_MERGED) -f $(LOCAL) up -d --build

local-stop:
	@make merge-env
	$(DC) $(ENV_MERGED) -f $(LOCAL) down

# Build (for portainer vps)
vps:
	$(DC) -f $(VPS) up -d --build

vps-stop:
	$(DC) -f $(VPS) down
