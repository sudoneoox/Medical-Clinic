CREATE TABLE IF NOT EXISTS nurse_offices (
    nurse_id INTEGER,
    office_id INTEGER,
    PRIMARY KEY (nurse_id, office_id),
    CONSTRAINT fk_nurse_offices_nurse
        FOREIGN KEY (nurse_id) 
        REFERENCES nurse(nurse_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_nurse_offices_office
        FOREIGN KEY (office_id)
        REFERENCES office(office_id)
        ON DELETE CASCADE
);