-- notifications for UI
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    type_notif ENUM('APPOINTMENT REMINDER', 'TEST RESULT AVAILABLE', 'PRESCRIPTION READY', 'BILLING REMINDER', 'GENERAL') NOT NULL,
    message TEXT NOT NULL,
    created_at DATE DEFAULT (CURRENT_DATE) NOT NULL, -- this was causing an issue
    read_at DATE,
    is_read BOOLEAN DEFAULT FALSE,
    -- appointment, medical_record, ie what entity is related to this notification
    related_entity_type VARCHAR(30),
    related_entity_id INTEGER NOT NULL, -- foreign key
);