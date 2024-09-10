-- base table for authentication and logging in 
-- long passwd in case we want to hash? 
-- phone number is a composite type for analysis with area codes and country codes
-- created_at and last_login are timestamps for when the user was created and last logged in
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwd VARCHAR(255) NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL,
    phone phone_num UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE);
