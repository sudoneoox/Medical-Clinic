#!/bin/bash
FILENAME=$1
DB_NAME=$2
pg_dump -U $USER -d $DB_NAME -s > $FILENAME.sql