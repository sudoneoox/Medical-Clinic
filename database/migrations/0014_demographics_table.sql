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
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    ethnicity smallint,
    race smallint,
    gender smallint,
    dob DATE,
    created_by INT,
    created_at DATE,
    updated_by INT,
    updated_at DATE,
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL,
    -- CONSTRAINT fk_race_code FOREIGN KEY (race) REFERENCES race_code(race_code) ON DELETE SET NULL, 
    -- CONSTRAINT fk_gender_code FOREIGN KEY (gender) REFERENCES gender_code(gender_code) ON DELETE SET NULL,
    -- CONSTRAINT fk_ethnicity_code FOREIGN KEY (ethnicity) REFERENCES ethnicity_code(ethnicity_code) ON DELETE SET NULL
);