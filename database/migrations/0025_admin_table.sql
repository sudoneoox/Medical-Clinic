
CREATE TABLE IF NOT EXISTS admins (
    admin_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    admin_employee_id INTEGER NOT NULL,
    admin_fname VARCHAR(50) NOT NULL,
    admin_lname VARCHAR(50) NOT NULL,
    user_id INTEGER UNIQUE NOT NULL,
    can_manage_users TINYINT DEFAULT 1,
    can_manage_billing TINYINT DEFAULT 1,
    can_manage_appointments TINYINT DEFAULT 1,
    can_view_reports TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_access TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(admin_id),
    UNIQUE(admin_employee_id)
);
