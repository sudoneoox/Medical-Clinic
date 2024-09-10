-- audit log to track changes in system
CREATE TABLE IF NOT EXISTS AUDIT_LOG(
   log_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   table_name VARCHAR(50) NOT NULL,
   record_id INTEGER NOT NULL,
   action VARCHAR(10) NOT NULL,
   changed_by INTEGER NOT NULL,
   changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   old_values JSONB,
   new_values JSONB,
   FOREIGN KEY (changed_by) REFERENCES users(user_id)
);

-- need to implement trigger function to log changes to the audit log table
-- CREATE OR REPLACE FUNCTION audit_log_trigger() RETURNS TRIGGER AS $$

