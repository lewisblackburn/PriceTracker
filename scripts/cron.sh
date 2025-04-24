#!/usr/bin/env bash
set -e

echo "Running cron job…"

# NOTE: Run jobs with explicit url as .env not working, this is fine as marker won't need to run cron jobs.
curl -X POST -s "https://backend-production-4c99.up.railway.app/api/scrape"
curl -X POST -s "https://backend-production-4c99.up.railway.app/api/threshold"
