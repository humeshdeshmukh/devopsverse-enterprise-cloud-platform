#!/bin/bash
set -e

echo "========================================================"
echo "   🚀 BOOTSTRAPPING DEVOPSVERSE ENTERPRISE CLOUD PLATFORM  "
echo "========================================================"

# Make sure we are in the project directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check if docker is running
if ! docker info >/dev/null 2>&1; then
  echo "❌ Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if docker-compose or docker compose is available
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
  echo "📦 Found Docker Compose. Orchestrating stack via '$COMPOSE_CMD'..."
  $COMPOSE_CMD down --remove-orphans
  $COMPOSE_CMD up -d --build
else
  echo "⚠️  Docker Compose not found. Falling back to standalone Docker containers..."
  
  # Setup network
  docker network create devopsverse-net 2>/dev/null || true
  
  # Teardown existing
  docker rm -f devopsverse-db devopsverse-redis devopsverse-backend devopsverse-frontend 2>/dev/null || true
  
  # Run DB
  echo "🗄️ Starting PostgreSQL container..."
  docker run -d \
    --name devopsverse-db \
    --network devopsverse-net \
    -p 5432:5432 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgrespass \
    -e POSTGRES_DB=devopsverse \
    postgres:15-alpine
    
  # Run Redis
  echo "🔑 Starting Redis container..."
  docker run -d \
    --name devopsverse-redis \
    --network devopsverse-net \
    -p 6379:6379 \
    redis:7-alpine
    
  # Build and Run Backend
  echo "⚙️ Building & Starting NestJS Backend..."
  docker build -t devopsverse-backend -f Dockerfile.backend .
  docker run -d \
    --name devopsverse-backend \
    --network devopsverse-net \
    -p 3001:3001 \
    --env-file .env \
    -e POSTGRES_HOST=devopsverse-db \
    -e REDIS_HOST=devopsverse-redis \
    devopsverse-backend
    
  # Build and Run Frontend
  echo "🖥️ Building & Starting Next.js Frontend..."
  docker build -t devopsverse-frontend -f Dockerfile.frontend .
  docker run -d \
    --name devopsverse-frontend \
    --network devopsverse-net \
    -p 3000:3000 \
    --env-file .env \
    -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
    devopsverse-frontend
fi

echo "⏳ Waiting for databases to be ready..."
if [ "$USE_COMPOSE" = true ]; then
  $COMPOSE_CMD exec -T db pg_isready -U postgres -d devopsverse || sleep 5
else
  docker exec -i devopsverse-db pg_isready -U postgres -d devopsverse || sleep 5
fi

echo "========================================================"
echo " 🎉 DevOpsVerse Enterprise Platform is Bootstrapped!"
echo "========================================================"
echo "🖥️  Next.js Frontend: http://localhost:3000"
echo "⚙️  NestJS Backend:  http://localhost:3001"
echo "🗄️  PostgreSQL:      localhost:5432"
echo "🔑 Redis:           localhost:6379"
echo "========================================================"
echo "To view logs: docker-compose logs -f"
echo "To stop:      ./stop.sh"
echo "========================================================"
