CREATE TABLE IF NOT EXISTS nurse_offices (
    nurse_id INT NOT NULL,
    office_id INT NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    PRIMARY KEY (nurse_id, office_id)
);