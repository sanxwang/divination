#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Please set DATABASE_URL environment variable (postgres://user:pass@host:port/db)"
  exit 1
fi

echo "Seeding products into $DATABASE_URL"
psql "$DATABASE_URL" -f "$(dirname "$0")/seeds/seed_products.sql"
echo "Seeding complete."
