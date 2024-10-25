#!/bin/bash

# Database connection
DB_NAME=medical_clinic
DB_USER=admin
DB_PASSWORD=abc
DB_HOST=localhost
DB_PORT=3306

# Directory holding migration sql files
MIGRATIONS_DIR="../migrations"
COMBINED_SQL_FILE="./combined_migrations.sql"

# Function to wait for database to be ready
wait_for_db() {
    echo "Waiting for database to be ready..."
    for i in {1..30}; do
        if mariadb-admin ping -h "$DB_HOST" -u "$DB_USER" --password="$DB_PASSWORD" 2>/dev/null; then
            echo "Database is ready!"
            return 0
        fi
        echo "Waiting for database... attempt $i/30"
        sleep 2
    done
    echo "Database connection timeout"
    exit 1
}

execute_sql_file() {
    local file=$1
    echo "Executing $file..."
    mariadb -h "$DB_HOST" -u "$DB_USER" --password="$DB_PASSWORD" "$DB_NAME" < "$file"
    local status=$?
    if [ $status -ne 0 ]; then
        echo "Error executing $file (status: $status)"
        exit 1
    fi
    echo "Successfully executed $file"
}

# Wait for database to be ready
wait_for_db

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "Migrations directory not found: $MIGRATIONS_DIR"
    ls -la $MIGRATION_DIR  # Debug: list contents
    exit 1
fi

# Find and sort migration files
echo "Looking for migration files in $MIGRATIONS_DIR"
migration_files=($(find "$MIGRATIONS_DIR" -name '[0-9][0-9][0-9][0-9]_*.sql' | sort -n))

# Check if any migration files were found
if [ ${#migration_files[@]} -eq 0 ]; then
    echo "No migration files found in $MIGRATIONS_DIR"
    ls -la "$MIGRATIONS_DIR"  # Debug: list contents
    exit 0
fi

echo "Found ${#migration_files[@]} migration files"

# Concatenate all migration files
echo "Concatenating migration files into $COMBINED_SQL_FILE..."
cat "${migration_files[@]}" > "$COMBINED_SQL_FILE"

# Execute combined SQL file
echo "Executing combined migrations..."
execute_sql_file "$COMBINED_SQL_FILE"

# Cleanup
rm -f "$COMBINED_SQL_FILE"

echo "All migrations completed successfully!"
