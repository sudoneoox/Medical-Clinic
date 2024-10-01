CREATE TABLE IF NOT EXISTS race_code (
    race_code smallint PRIMARY KEY,
    race_text VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS gender_code (
    gender_code smallint PRIMARY KEY,
    gender_text VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS ethnicity_code (
    ethnicity_code smallint PRIMARY KEY,
    ethnicity_text VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS demographics (
    demographics_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NULL,
    ethnicity smallint NULL,
    race smallint NULL,
    gender smallint NULL,
    dob DATE,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_at DATE
);
