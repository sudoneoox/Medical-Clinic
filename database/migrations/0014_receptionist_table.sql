CREATE TABLE IF NOT EXISTS receptionists (
    receptionist_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    receptionist_employee_id INTEGER NOT NULL,
    receptionist_fname VARCHAR(50) NOT NULL,
    receptionist_lname VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL, -- fk
    UNIQUE(receptionist_id),
    UNIQUE(user_id)
);
