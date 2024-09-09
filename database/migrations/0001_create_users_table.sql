-- composite value phone number
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwd VARCHAR(255) NOT NULL,
    -- long in case we want to hash?
    email VARCHAR(100) UNIQUE NOT NULL,
    phone phone_num UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role user_role NOT NULL,
    gender VARCHAR(30),
);
