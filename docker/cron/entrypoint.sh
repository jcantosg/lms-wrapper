#!/bin/sh
set -e

# Propagate environment variables for Cron invoked tasks
printenv | grep -v "no_proxy" >>/etc/environment

echo "[Entrypoint] Database Migrations"
npm run typeorm:migrations:up

echo "[Entrypoint] Launch Crond"
exec "$@"
