#!/bin/sh
set -e

echo "[Entrypoint] Database Migrations"
npm run typeorm:migrations:up

echo "[Entrypoint] Launch Crond"
exec "$@"
