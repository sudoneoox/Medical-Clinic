CREATE TABLE IF NOT EXISTS receptionist (
    receptionist_id INT,
    user_id INT NOT NULL,
    receptionist_name VARCHAR(50) NOT NULL,
    office_id INT NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL
)