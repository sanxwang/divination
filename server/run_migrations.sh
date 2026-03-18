#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Please set DATABASE_URL environment variable (postgres://user:pass@host:port/db)"
  exit 1
fi

echo "Running migrations against $DATABASE_URL"
psql "$DATABASE_URL" -f "$(dirname "$0")/migrations/001_init.sql"
echo "Migrations applied."
