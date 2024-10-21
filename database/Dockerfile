FROM mysql:8.0

WORKDIR /migrations
COPY migrations/ /migrations/
COPY scripts/syncdb.sh /migrations/

CMD ["./syncdb.sh $DB_PASSWORD"]
