FROM mariadb:latest
WORKDIR /migrations
COPY migrations/ /migrations/
COPY scripts/syncdb.sh /migrations/
RUN chmod +x /migrations/syncdb.sh
CMD ["/migrations/syncdb.sh"]
