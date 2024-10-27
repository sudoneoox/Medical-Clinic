FROM mariadb:latest

WORKDIR /migrations

# Copy migrations and scripts
COPY migrations/ /migrations/migrations/
COPY scripts/ /migrations/scripts/
COPY scripts/reset-db.sh /migrations/scripts/

RUN chmod +x /migrations/scripts/reset-db.sh

CMD ["/migrations/scripts/reset-db.sh", "reset"]
