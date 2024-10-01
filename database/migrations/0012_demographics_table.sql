CREATE TABLE IF NOT EXISTS race_code (
    race_code TINYINT NOT NULL PRIMARY KEY,
    race_text VARCHAR(20) NOT NULL,
    UNIQUE(race_code),
    UNIQUE(race_text)
);

CREATE TABLE IF NOT EXISTS gender_code (
    gender_code TINYINT NOT NULL PRIMARY KEY,
    gender_text VARCHAR(20) NOT NULL,
    UNIQUE(gender_code),
    UNIQUE(gender_text)
);

CREATE TABLE IF NOT EXISTS ethnicity_code (
    ethnicity_code TINYINT NOT NULL PRIMARY KEY,
    ethnicity_text VARCHAR(20) NOT NULL,
    UNIQUE(ethnicity_code),
    UNIQUE(ethnicity_text)
);

CREATE TABLE IF NOT EXISTS demographics (
    demographics_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ethnicity_id TINYINT NULL,
    race_id TINYINT NULL,
    gender_id TINYINT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_at DATE
);