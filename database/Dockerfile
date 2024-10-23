FROM mariadb:latest

WORKDIR /migrations

# Copy migrations and scripts
COPY migrations/ /migrations/migrations/
COPY scripts/ /migrations/scripts/

# Make sure the script is executable
RUN chmod +x /migrations/scripts/syncdb.sh

CMD ["/migrations/scripts/syncdb.sh"]
