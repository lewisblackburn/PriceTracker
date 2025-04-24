#!/usr/bin/env bash
set -e
set -o allexport

source "$(dirname "$0")/.env"

set +o allexport

echo "Running cron job..."

echo "Scraping data from ${BACKEND_URL}/api/scrape"
curl -X POST -s "${BACKEND_URL}/api/scrape"

echo "Setting threshold from ${BACKEND_URL}/api/threshold"
curl -X POST -s "${BACKEND_URL}/api/threshold"

