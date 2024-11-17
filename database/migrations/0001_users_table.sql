-- base table for authentication and logging in 
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_username VARCHAR(50) UNIQUE NOT NULL,
    -- long passwd in case we want to hash? 
    user_password VARCHAR(200) NOT NULL,
    user_email VARCHAR(50) UNIQUE NOT NULL,
    user_phone VARCHAR(20) UNIQUE NOT NULL,
    account_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_role ENUM(
        "ADMIN",
        "PATIENT",
        "DOCTOR",
        "RECEPTIONIST",
        "NURSE"
    ) NOT NULL,
    demographics_id INTEGER NOT NULL,
    portal_last_login TIMESTAMP,
    is_deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE(user_id),
    UNIQUE(user_email),
    UNIQUE(user_username)
);
