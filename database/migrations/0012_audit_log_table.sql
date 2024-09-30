-- audit log to track changes in system
CREATE TABLE IF NOT EXISTS AUDIT_LOG(
   log_id INT PRIMARY KEY AUTO_INCREMENT,
   table_name VARCHAR(30) NOT NULL,
   record_id INT NOT NULL,
   audit_action VARCHAR(10) NOT NULL,
   changed_by INT NULL,
   changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
   old_values JSON,
   new_values JSON-- ,

);