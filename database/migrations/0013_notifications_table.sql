-- notifications for UI
CREATE TABLE notifications (
    notification_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    type_notif notification_type NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT FALSE,
    related_entitiy_type VARCHAR(50), -- appointment, medical_record, ie what entity is related to this notification
    related_entity_id INTEGER,
    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);