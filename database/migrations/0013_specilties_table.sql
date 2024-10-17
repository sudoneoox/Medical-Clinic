CREATE TABLE IF NOT EXISTS specialties_code (
    specialty_code TINYINT NOT NULL PRIMARY KEY,
    specialty_name VARCHAR(30) NOT NULL,
    UNIQUE(specialty_code),
    UNIQUE(specialty_name)
);