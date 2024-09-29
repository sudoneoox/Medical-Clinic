CREATE TABLE IF NOT EXISTS receptionist_offices (
    receptionist_id INT,
    office_id INT,
    PRIMARY KEY (receptionist_id, office_id),
    --CONSTRAINT fk_receptionist_offices_receptionist
        --FOREIGN KEY (receptionist_id) 
        --REFERENCES receptionist(receptionist_id)
        --ON DELETE CASCADE,
    --CONSTRAINT fk_receptionist_offices_office
        --FOREIGN KEY (office_id)
        --REFERENCES office(office_id)
        --ON DELETE CASCADE
);