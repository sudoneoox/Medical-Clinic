-- composite value phone number
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    passwd VARCHAR(255),
    -- long in case we want to hash?
    email VARCHAR(100) UNIQUE,
    phone phone_num UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    role user_role,
    gender VARCHAR(30),
);