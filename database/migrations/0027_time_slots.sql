CREATE TABLE IF NOT EXISTS time_slots (
    slot_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    UNIQUE(start_time, end_time)
);

-- Populate with common 30-minute slots
INSERT INTO time_slots (start_time, end_time) 
VALUES 
    ('09:00:00', '09:30:00'),
    ('09:30:00', '10:00:00'),
    ('10:00:00', '10:30:00'),
    ('10:30:00', '11:00:00'),
    ('11:00:00', '11:30:00'),
    ('11:30:00', '12:00:00'),
    ('12:00:00', '12:30:00'),
    ('12:30:00', '13:00:00'),
    ('13:00:00', '13:30:00'),
    ('13:30:00', '14:00:00'),
    ('14:00:00', '14:30:00'),
    ('14:30:00', '15:00:00'),
    ('15:00:00', '15:30:00'),
    ('15:30:00', '16:00:00'),
    ('16:00:00', '16:30:00'),
    ('16:30:00', '17:00:00');
