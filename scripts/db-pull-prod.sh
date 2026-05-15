#!/bin/bash

# Pull production database snapshot to local development environment.
#
# Streams a pg_dump from the production VPS container (over SSH / Tailscale)
# and restores it into the local PostgreSQL instance, replacing the current
# local database.
#
# Usage:
#   ./scripts/db-pull-prod.sh              # dump + restore (default)
#   ./scripts/db-pull-prod.sh --dump       # dump only (file in dumps/)
#   ./scripts/db-pull-prod.sh --restore    # restore latest dump locally
#   ./scripts/db-pull-prod.sh --file <path>  # restore a specific dump
#   ./scripts/db-pull-prod.sh --yes        # skip confirmation prompt
#
# Requirements:
# - SSH access to the host configured via PROD_SSH_HOST in .env
# - PROD_DB_CONTAINER set to the docker container name prefix in .env
#   (both vars are managed by env/env.config.mjs > dbPullProd group)
# - Local PostgreSQL running (make postgres)
# - psql + pg_restore installed locally (PostgreSQL 16 client recommended)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error()   { echo -e "${RED}❌ $1${NC}"; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DUMPS_DIR="$PROJECT_DIR/dumps"

# Args
MODE="full"   # full | dump | restore
DUMP_FILE=""
SKIP_CONFIRM=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dump)    MODE="dump"; shift ;;
        --restore) MODE="restore"; shift ;;
        --file)    DUMP_FILE="$2"; shift 2 ;;
        --yes|-y)  SKIP_CONFIRM=true; shift ;;
        --help|-h)
            sed -n '3,17p' "$0" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *) print_error "Unknown arg: $1"; exit 1 ;;
    esac
done

# Load .env for local POSTGRES_* and PROD_* (always needed — dump uses
# PROD_SSH_HOST / PROD_DB_CONTAINER, restore uses POSTGRES_* + POSTGRES_DB
# for dump filename derivation)
if [ -f "$PROJECT_DIR/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    source "$PROJECT_DIR/.env"
    set +a
else
    print_error "No .env file found — cannot resolve credentials"
    exit 1
fi

# Validate prod-script env vars (defined in env/env.config.mjs > dbPullProd
# group, dev-only — excluded from all other environments via EXCLUDE)
if [ "$MODE" != "restore" ]; then
    if [ -z "$PROD_SSH_HOST" ] || [ -z "$PROD_DB_CONTAINER" ]; then
        print_error "Missing PROD_SSH_HOST / PROD_DB_CONTAINER in .env"
        print_info "Set them in env/env.config.mjs (dbPullProd group) and run: make setup-env"
        exit 1
    fi
fi

mkdir -p "$DUMPS_DIR"

# === DUMP from production via SSH + docker exec ===
do_dump() {
    print_info "Locating production database container..."
    local container
    container=$(ssh "$PROD_SSH_HOST" "docker ps --filter name=$PROD_DB_CONTAINER --format '{{.Names}}' | head -1" | tr -d '\r')

    if [ -z "$container" ]; then
        print_error "No container matching the configured pattern on remote host"
        exit 1
    fi
    print_info "Container resolved"

    print_info "Reading remote DB name/user (password stays in container)..."
    local remote_db remote_user
    remote_db=$(ssh "$PROD_SSH_HOST" "docker exec $container printenv POSTGRES_DB" | tr -d '\r')
    remote_user=$(ssh "$PROD_SSH_HOST" "docker exec $container printenv POSTGRES_USER" | tr -d '\r')

    if [ -z "$remote_db" ] || [ -z "$remote_user" ]; then
        print_error "Could not read POSTGRES_DB / POSTGRES_USER from container"
        exit 1
    fi

    local timestamp
    timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    DUMP_FILE="$DUMPS_DIR/${remote_db}_$timestamp.dump"

    # PGPASSWORD is resolved inside the container ($POSTGRES_PASSWORD), so the
    # prod password never touches the local machine, shell history, or .env.
    print_info "Streaming dump..."
    ssh "$PROD_SSH_HOST" "docker exec -i $container sh -c 'PGPASSWORD=\"\$POSTGRES_PASSWORD\" pg_dump -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\" -Fc --no-owner --no-acl'" > "$DUMP_FILE"

    if [ ! -s "$DUMP_FILE" ]; then
        print_error "Dump file is empty"
        rm -f "$DUMP_FILE"
        exit 1
    fi

    local size
    size=$(du -h "$DUMP_FILE" | cut -f1)
    print_success "Dump created: $DUMP_FILE ($size)"
}

# === RESTORE to local Postgres ===
do_restore() {
    if [ -z "$DUMP_FILE" ]; then
        DUMP_FILE=$(ls -t "$DUMPS_DIR"/*.dump 2>/dev/null | head -1)
        if [ -z "$DUMP_FILE" ]; then
            print_error "No dump file found in $DUMPS_DIR"
            exit 1
        fi
    fi

    if [ ! -f "$DUMP_FILE" ]; then
        print_error "Dump file not found: $DUMP_FILE"
        exit 1
    fi

    if [ -z "$POSTGRES_DB" ] || [ -z "$POSTGRES_PASSWORD" ]; then
        print_error "Local POSTGRES_DB / POSTGRES_PASSWORD not set (check .env)"
        exit 1
    fi

    local host="${POSTGRES_HOST:-localhost}"
    local port="${POSTGRES_PORT:-5432}"
    local user="${POSTGRES_USER:-postgres}"

    print_warning "About to OVERWRITE local DB '$POSTGRES_DB' on $host:$port"
    print_warning "Dump file: $DUMP_FILE"

    if [ "$SKIP_CONFIRM" != true ]; then
        read -p "Continue? (yes/no) " -r REPLY
        if [[ ! "$REPLY" =~ ^[Yy](es)?$ ]]; then
            print_info "Aborted"
            exit 0
        fi
    fi

    export PGPASSWORD="$POSTGRES_PASSWORD"

    print_info "Dropping and recreating local database..."
    psql -h "$host" -p "$port" -U "$user" -d postgres -c "DROP DATABASE IF EXISTS \"$POSTGRES_DB\";" >/dev/null
    psql -h "$host" -p "$port" -U "$user" -d postgres -c "CREATE DATABASE \"$POSTGRES_DB\";" >/dev/null

    print_info "Restoring dump (this may take a moment)..."
    # pg_restore can return non-zero on benign warnings (extension exists, etc.)
    # with --no-owner --no-acl. We tolerate exit code 1 but surface real errors.
    if ! pg_restore -h "$host" -p "$port" -U "$user" -d "$POSTGRES_DB" --no-owner --no-acl "$DUMP_FILE"; then
        print_warning "pg_restore reported warnings — check output above"
    fi

    unset PGPASSWORD

    print_success "Local DB '$POSTGRES_DB' restored from production snapshot"
    print_info "If schemas drift from local Prisma, run: bun run prisma:migrate"
}

case $MODE in
    full)    do_dump; do_restore ;;
    dump)    do_dump ;;
    restore) do_restore ;;
esac
