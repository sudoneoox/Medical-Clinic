CREATE TABLE IF NOT EXISTS audit_log (
    audit_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_by INTEGER NOT NULL,
    old_value JSON,
    new_value JSON,
    FOREIGN KEY (action_by) REFERENCES users(user_id)
);