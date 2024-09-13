#!/bin/bash

DBNAME=$1
USER=$2

# Database connection
DB_NAME=$1
DB_USER=$2
DB_HOST="localhost"
DB_PORT="5432"

# Directory holding migration sql files
MIGRATIONS_DIR="../migrations"
COMBINED_SQL_FILE="combined_migrations.sql"

execute_sql_file() {
    local file=$1
    echo "Executing $file..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file"
    if [ $? -ne 0 ]; then
        echo "Error executing $file"
        exit 1
    fi
}

# Check if migrations directory is there
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "Migrations directory not found: $MIGRATIONS_DIR"
    exit 1
fi

# sort migration files matching pattern XXXX_.sql
migration_files=($(ls -v $MIGRATIONS_DIR/[0-9][0-9][0-9][0-9]_*.sql))

# Check if migrations directory is empty
if [ ${#migration_files[@]} -eq 0 ]; then
    echo "No migration files found in $MIGRATIONS_DIR"
    exit 0
fi

# Concatenate all migration files into one
echo "Concatenating migration files into $COMBINED_SQL_FILE..."
cat "${migration_files[@]}" > $COMBINED_SQL_FILE

# Execute combined SQL file
if [[$3 == "run"]] ; then
    execute_sql_file "$COMBINED_SQL_FILE"
fi
# Cleanup the combined SQL file after execution
# rm $COMBINED_SQL_FILE

echo "All migrations completed successfully."