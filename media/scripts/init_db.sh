#!/usr/bin/env bash
set -euo pipefail

# Ensure psql is available
if ! command -v psql >/dev/null 2>&1; then
  echo "Error: psql client is not installed or not in PATH." >&2
  exit 1
fi

# Load .env if DATABASE_URL not set
if [[ -z "${DATABASE_URL:-}" ]]; then
  # Try media/.env then project .env
  if [[ -f "$(dirname "$0")/../media/.env" ]]; then
    set -a; source "$(dirname "$0")/../media/.env"; set +a
  elif [[ -f "$(dirname "$0")/../.env" ]]; then
    set -a; source "$(dirname "$0")/../.env"; set +a
  fi
fi

# Ensure DATABASE_URL is provided after sourcing
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Error: DATABASE_URL environment variable is not set." >&2
  echo "Set it in media/.env or export it before running." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/../sql/articles.sql"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Error: SQL file not found: $SQL_FILE" >&2
  exit 1
fi

echo "Applying schema via psql using DATABASE_URL..."
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SQL_FILE"
echo "Done."
