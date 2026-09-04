FROM postgres:15

# Set environment variables
ENV POSTGRES_DB=LineOA_Hotspot
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres_dev_password


# Copy SQL file with error handling
COPY DatabaseLineOA.sql /docker-entrypoint-initdb.d/00-init.sql
