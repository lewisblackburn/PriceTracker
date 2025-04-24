#!/usr/bin/env bash
set -e

echo "Running cron job…"

echo "Scraping data from ${BACKEND_URL}/api/scrape"
curl -X POST -s "${BACKEND_URL}/api/scrape"

echo "Setting threshold from ${BACKEND_URL}/api/threshold"
curl -X POST -s "${BACKEND_URL}/api/threshold"
