CREATE TABLE IF NOT EXISTS appointment_cancellations (
    cancellation_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    canceled_reason TEXT,
    canceled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    --DATETIME does not support time zones, should manage timezonesa at the application level?
    CONSTRAINT fk_cancellation_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE
);