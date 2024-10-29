
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    notification_type ENUM(
        'APPOINTMENT_REMINDER',
        'TEST_RESULTS',
        'PRESCRIPTION_READY',
        'BILLING_REMINDER',
        'MESSAGE',
        'EMERGENCY_ALERT',
        'SCHEDULE_CHANGE',
        'INSURANCE_UPDATE',
        'DOCUMENT_READY',
        'GENERAL'
    ) NOT NULL,
    notification_title VARCHAR(100) NOT NULL,
    notification_content TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    is_read TINYINT DEFAULT 0,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    metadata JSON,
    UNIQUE(notification_id)
);
