CREATE TABLE IF NOT EXISTS race_code (
    race_code TINYINT NOT NULL ,
    race_text VARCHAR(50) NOT NULL ,
    UNIQUE(race_code),
    UNIQUE(race_text),
    PRIMARY KEY(race_code, race_text)
);

CREATE TABLE IF NOT EXISTS gender_code (
    gender_code TINYINT NOT NULL ,
    gender_text VARCHAR(50) NOT NULL ,
    UNIQUE(gender_code),
    UNIQUE(gender_text),
    PRIMARY KEY (gender_code, gender_text)
);

CREATE TABLE IF NOT EXISTS ethnicity_code (
    ethnicity_code TINYINT NOT NULL ,
    ethnicity_text VARCHAR(50) NOT NULL ,
    UNIQUE(ethnicity_code),
    UNIQUE(ethnicity_text),
    PRIMARY KEY (ethnicity_code, ethnicity_text)
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
