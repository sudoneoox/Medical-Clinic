#!/bin/bash

# Database connection parameters
DB_NAME=${DB_NAME:-medical_clinic}
DB_USER=${DB_USER:-admin}
DB_PASSWORD=${DB_PASSWORD:-abc}
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}

# Directories and files
MIGRATIONS_DIR="/migrations/migrations"
COMBINED_SQL_FILE="/tmp/combined_migrations.sql"

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

# Function to execute SQL file
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

# Function to drop all tables
drop_tables() {
    echo "Dropping all database objects..."
    mariadb -h "$DB_HOST" -u "$DB_USER" --password="$DB_PASSWORD" "$DB_NAME" <<'EOSQL'
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables
DROP PROCEDURE IF EXISTS drop_all_tables;
DELIMITER //
CREATE PROCEDURE drop_all_tables()
BEGIN
    DECLARE _done INT DEFAULT FALSE;
    DECLARE _tableName VARCHAR(255);
    DECLARE _cursor CURSOR FOR 
        SELECT table_name 
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_type = 'BASE TABLE';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET _done = TRUE;
    
    OPEN _cursor;
    REPEAT
        FETCH _cursor INTO _tableName;
        IF NOT _done THEN
            SET @stmt = CONCAT('DROP TABLE IF EXISTS `', _tableName, '` CASCADE');
            PREPARE stmt FROM @stmt;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END IF;
    UNTIL _done END REPEAT;
    CLOSE _cursor;
END //
DELIMITER ;

CALL drop_all_tables();
DROP PROCEDURE IF EXISTS drop_all_tables;

-- Drop all views
DROP PROCEDURE IF EXISTS drop_all_views;
DELIMITER //
CREATE PROCEDURE drop_all_views()
BEGIN
    DECLARE _done INT DEFAULT FALSE;
    DECLARE _viewName VARCHAR(255);
    DECLARE _cursor CURSOR FOR 
        SELECT table_name 
        FROM information_schema.views
        WHERE table_schema = DATABASE();
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET _done = TRUE;
    
    OPEN _cursor;
    REPEAT
        FETCH _cursor INTO _viewName;
        IF NOT _done THEN
            SET @stmt = CONCAT('DROP VIEW IF EXISTS `', _viewName, '`');
            PREPARE stmt FROM @stmt;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END IF;
    UNTIL _done END REPEAT;
    CLOSE _cursor;
END //
DELIMITER ;

CALL drop_all_views();
DROP PROCEDURE IF EXISTS drop_all_views;

-- Drop all functions and procedures
DROP PROCEDURE IF EXISTS drop_all_routines;
DELIMITER //
CREATE PROCEDURE drop_all_routines()
BEGIN
    DECLARE _done INT DEFAULT FALSE;
    DECLARE _routineName VARCHAR(255);
    DECLARE _routineType VARCHAR(20);
    DECLARE _cursor CURSOR FOR 
        SELECT routine_name, routine_type
        FROM information_schema.routines
        WHERE routine_schema = DATABASE();
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET _done = TRUE;
    
    OPEN _cursor;
    REPEAT
        FETCH _cursor INTO _routineName, _routineType;
        IF NOT _done THEN
            SET @stmt = CONCAT('DROP ', _routineType, ' IF EXISTS `', _routineName, '`');
            PREPARE stmt FROM @stmt;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END IF;
    UNTIL _done END REPEAT;
    CLOSE _cursor;
END //
DELIMITER ;

CALL drop_all_routines();
DROP PROCEDURE IF EXISTS drop_all_routines;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'All tables, views, and routines have been dropped.' AS Result;
EOSQL

    local status=$?
    if [ $status -ne 0 ]; then
        echo "Error dropping database objects (status: $status)"
        exit 1
    fi
    echo "Successfully dropped all database objects"
}

# Function to run migrations
run_migrations() {
    # Check if migrations directory exists
    if [ ! -d "$MIGRATIONS_DIR" ]; then
        echo "Migrations directory not found: $MIGRATIONS_DIR"
        ls -la /migrations  # Debug: list contents
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
}

# Main execution
case "$1" in
    "drop")
        wait_for_db
        drop_tables
        ;;
    "migrate")
        wait_for_db
        run_migrations
        ;;
    "reset")
        wait_for_db
        drop_tables
        run_migrations
        ;;
    *)
        echo "Usage: $0 {drop|migrate|reset}"
        exit 1
        ;;
esac
