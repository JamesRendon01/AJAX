#!/bin/bash
# Script para gestionar PostgreSQL de staging
# Uso: bash pg-staging.sh {start|stop|status}

PG_DIR="/home/james-rendon/proyectos/ajax/pg_staging"
PG_BIN="/usr/lib/postgresql/16/bin"

case "$1" in
  start)
    echo "Iniciando PostgreSQL staging (puerto 5433)..."
    $PG_BIN/pg_ctl -D "$PG_DIR" -l "$PG_DIR/logfile" -o "-p 5433 -k $PG_DIR/socket" start
    ;;
  stop)
    echo "Deteniendo PostgreSQL staging..."
    $PG_BIN/pg_ctl -D "$PG_DIR" stop
    ;;
  status)
    echo "Estado:"
    $PG_BIN/pg_ctl -D "$PG_DIR" status
    ;;
  *)
    echo "Uso: $0 {start|stop|status}"
    exit 1
    ;;
esac
