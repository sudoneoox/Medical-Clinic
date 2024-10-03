CREATE TABLE IF NOT EXISTS detailed_allergies (
    allergy_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    medical_record_id INTEGER NOT NULL,
    allergy_type ENUM('FOOD', 'MEDICATION', 'ENVIRONMENTAL') NOT NULL,
    allergen VARCHAR(100) NOT NULL,
    reaction TEXT,
    severity ENUM('MILD', 'MODERATE', 'SEVERE') NOT NULL,
    onset_date DATE
);