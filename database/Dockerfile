# Usamos la imagen SQL 2022 y definimos las credenciales
FROM mcr.microsoft.com/mssql/server:2022-latest

ENV ACCEPT_EULA=Y
ENV MSSQL_SA_PASSWORD=MovieDux@2024
ENV MSSQL_PID=Express

# Ejecucion del Script del proceso SQL
USER root

COPY init.sql /init.sql
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 1433

CMD ["/entrypoint.sh"]
