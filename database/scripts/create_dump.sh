#!/bin/bash
DB_USER=$1
DB_NAME=$2
mysqldump -u $DB_USER -p $DB_NAME > db_backup.sql