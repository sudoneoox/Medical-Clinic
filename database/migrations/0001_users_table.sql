-- base table for authentication and logging in 
-- long passwd in case we want to hash? 
-- phone number is a composite type for analysis with area codes and country codes
-- created_at and last_login are timestamps for when the user was created and last logged in
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwd VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    phone phone_num,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    last_login DATE DEFAULT CURRENT_TIMESTAMP,
    role user_role NOT NULL,
    CONSTRAINT chk_role CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT')),
    -- we dont necessarily have to check to make sure that the country code is not null we 
    -- can assume that its in the US +1
    CONSTRAINT chk_phone CHECK (
        phone IS NULL
        OR (phone).area_code IS NOT NULL
        AND (phone).phone_number IS NOT NULL
    ),
    CONSTRAINT chk_email CHECK (email LIKE '%@%')
);