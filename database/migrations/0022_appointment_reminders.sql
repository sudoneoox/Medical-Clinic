CREATE TABLE IF NOT EXISTS appointment_reminders (
    reminder_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    reminder_status ENUM('Pending', 'Sent', 'Failed') NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    sent_time TIMESTAMP NOT NULL
);