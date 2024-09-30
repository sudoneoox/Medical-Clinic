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
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    ethnicity smallint,
    race smallint,
    gender smallint,
    dob DATE,
    created_by INTEGER,
    created_at DATE,
    updated_by INTEGER,
    updated_at DATE-- ,
);