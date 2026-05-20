#!/bin/bash

# Iniciar SQL Server en background
/opt/mssql/bin/sqlservr &
SQL_PID=$!

echo "Esperando que SQL Server arranque..."
until /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "$MSSQL_SA_PASSWORD" -C -Q "SELECT 1" &>/dev/null; do
  echo "SQL Server no está listo aún, reintentando..."
  sleep 3
done
echo "SQL Server listo."

echo "Ejecutando script de inicialización..."
/opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U SA \
  -P "$MSSQL_SA_PASSWORD" \
  -i /init.sql \
  -C \
  -b

echo "Base de datos inicializada correctamente."

# Mantener el proceso de SQL Server en primer plano
wait $SQL_PID
