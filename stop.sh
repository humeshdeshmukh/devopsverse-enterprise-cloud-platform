#!/bin/bash

echo "========================================================"
echo "   🛑 TEARING DOWN DEVOPSVERSE ENTERPRISE CLOUD PLATFORM  "
echo "========================================================"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

USE_COMPOSE=false
COMPOSE_CMD=""

if command -v docker-compose >/dev/null 2>&1; then
  USE_COMPOSE=true
  COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
  USE_COMPOSE=true
  COMPOSE_CMD="docker compose"
fi

if [ "$USE_COMPOSE" = true ]; then
  $COMPOSE_CMD down --remove-orphans -v
else
  echo "⚠️  Docker Compose not found. Stopping standalone containers..."
  docker rm -f devopsverse-db devopsverse-redis devopsverse-backend devopsverse-frontend 2>/dev/null || true
  docker network rm devopsverse-net 2>/dev/null || true
fi

echo "✅ Teardown complete. All services and volumes cleaned."
