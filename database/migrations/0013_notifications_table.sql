-- notifications for UI
CREATE TABLE notifications (
    notification_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    type_notif notification_type NOT NULL,
    message TEXT NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    read_at DATE,
    is_read BOOLEAN DEFAULT FALSE,
    -- appointment, medical_record, ie what entity is related to this notification
    related_entitiy_type VARCHAR(30),
    related_entity_id INTEGER,
    CONSTRAINT fk_notification_sender FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_receiver FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_notif CHECK (type_notif IN ('APPOINTMENT REMINDER', 'TEST_RESULT_AVAILABLE', 'PRESCRIPTION READY', 'BILLING REMINDER', 'GENERAL NOTIFICATION'))
);

