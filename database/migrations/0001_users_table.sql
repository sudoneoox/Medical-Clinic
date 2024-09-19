-- base table for authentication and logging in 
-- long passwd in case we want to hash? 
-- phone number is a composite type for analysis with area codes and country codes
-- created_at and last_login are timestamps for when the user was created and last logged in
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwd VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    last_login DATE DEFAULT CURRENT_TIMESTAMP,
    role user_role NOT NULL,
    CONSTRAINT chk_email CHECK (email LIKE '%@%')
);
