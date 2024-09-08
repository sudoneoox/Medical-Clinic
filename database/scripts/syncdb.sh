#!/bin/bash

USER=$1

# Database connection 
DB_NAME="medical_clinic"
DB_USER=$1
DB_HOST="localhost"
DB_PORT="5432"

# Directory holding migration sql files
MIGRATIONS_DIR="database/migrations"

execute_sql_file() {
    local file=$1
    echo "Executing $file..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file"
    if [ $? -ne 0 ]; then
        echo "Error executing $file"
        exit 1
    fi
}

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "Migrations directory not found: $MIGRATIONS_DIR"
    exit 1
fi

# sort migration files 
migration_files=($(ls -v $MIGRATIONS_DIR/*.sql))

# check if theres migration files
if [ ${#migration_files[@]} -eq 0 ]; then
    echo "No migration files found in $MIGRATIONS_DIR"
    exit 0
fi

# Execute migration files in order
for file in "${migration_files[@]}"; do
    execute_sql_file "$file"
done

echo "All migrations completed successfully."