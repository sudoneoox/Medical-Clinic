
CREATE TABLE IF NOT EXISTS receptionist (
    receptionist_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    receptionist_name VARCHAR(50) NOT NULL,
    office_id INTEGER NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    CONSTRAINT fk_receptionist_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);