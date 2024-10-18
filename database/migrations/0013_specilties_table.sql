CREATE TABLE IF NOT EXISTS specialties_code (
    specialty_code TINYINT NOT NULL PRIMARY KEY,
    specialty_name VARCHAR(30) NOT NULL,
    specialty_desc VARCHAR(500),
    UNIQUE(specialty_code),
    UNIQUE(specialty_name)
);