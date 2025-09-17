#####################
#   Nextjs server   #
#####################

DC = COMPOSE_BAKE=true docker compose

BASIC = compose.basic.yml
LOCAL = compose.local.yml
VPS = compose.vps.yml

.PHONY: basic basic-stop local local-stop vps vps-stop

# Build (without portainer)
basic:
	$(DC) -f $(BASIC) up -d --build

basic-stop:
	$(DC) -f $(BASIC) down

# Build (for portainer local)
local:
	$(DC) -f $(LOCAL) up -d --build

local-stop:
	$(DC) -f $(LOCAL) down

# Build (for portainer vps)
vps:
	$(DC) -f $(VPS) up -d --build

vps-stop:
	$(DC) -f $(VPS) down
