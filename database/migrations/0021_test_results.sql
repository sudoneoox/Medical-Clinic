CREATE TABLE IF NOT EXISTS test_results (
    -- primary keys
    test_results_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    test_type ENUM('BLOOD', 'XRAY', 'URINE'),
    test_name VARCHAR(30),
    test_conducted_date DATE,
    test_result JSON,
    test_units VARCHAR(10),
    test_interpretation ENUM("BELOW", "NORMAL", "ABOVE"),
    test_status ENUM("PENDING", "COMPLETED"),
    -- foreign keys
    test_performed_by INTEGER NOT NULL,
    medical_record_id INTEGER NOT NULL,
    UNIQUE(test_results_id)
);