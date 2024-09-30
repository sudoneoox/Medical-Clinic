
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

-- Drop all functions
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

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- print completion
SELECT 'All tables, views, and routines have been dropped.' AS Result;
