CREATE TABLE IF NOT EXISTS receptionists (
    receptionist_id INTEGER NOT NULL AUTO_INCREMENT,
    receptionist_employee_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL, -- fk
    receptionist_name VARCHAR(50) NOT NULL,
    PRIMARY KEY(receptionist_id, receptionist_employee_id)
);