#!/bin/bash
FILENAME=$1
DB_NAME=$2
psql -U $USER -d $DB_NAME < $FILENAME.sql