#!/usr/bin/env bash
set -e
set -o allexport

# load .env from the same directory as this script
source "$(dirname "$0")/.env"

set +o allexport

# hit your endpoints; output goes to Railway logs
curl -X POST -s "${BACKEND_URL}/api/scrape"
curl -X POST -s "${BACKEND_URL}/api/threshold"
