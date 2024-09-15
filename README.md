```mermaid
erDiagram
    USERS {
        int user_id PK
        string username UK
        string passwd
        string email UK
        composite phone_num
        date created_at
        date last_login
        enum user_role
    }
    DOCTOR {
        int doctor_id PK
        int user_id UK, FK
        composite doctor_name
        string license_number
        int specialty_id FK
        int years_of_experience
    }
    PATIENT {
        int patient_id PK
        int user_id UK, FK
        composite patient_name
        multivalued emergency_contacts
        int primary_doctor_id FK
    }
    PATIENT_DOCTOR {
        int patient_id PK, FK
        int doctor_id PK, FK
        bool is_primary
    }
    OFFICE {
        int office_id PK
        string name
        composite address
        composite phone
        string email
        multivalued services
    }
    DOCTOR_OFFICES {
        int doctor_id PK, FK
        int office_id PK, FK
    }
    APPOINTMENTS {
        int appointment_id PK
        int patient_id FK
        int doctor_id FK
        int office_id FK
        date appointment_datetime
        interval duration
        string reason
        enum status
        date created_at
        date updated_at
    }
    MEDICAL_RECORDS {
        int record_id PK
        int patient_id FK
        int doctor_id FK
        int appointment_id FK
        date created_at
        date updated_at
        string diagnosis
        string notes
        json test_results
    }
    PRESCRIPTION {
        int prescription_id PK
        int record_id FK
        composite medication_info
        timestamp date_issued
        json pharmacy_details
    }
    SPECIALIST_APPROVALS {
        int approval_id PK
        int patient_id FK
        int requesting_doctor_id FK
        int specialist_id FK
        timestamp requested_at
        timestamp approved_at
        enum status
    }
    BILLING {
        int billing_id PK
        int patient_id FK
        int appointment_id FK
        decimal amount_due
        decimal amount_paid
        enum payment_status
        date billing_due
        date created_at
        date updated_at
    }
    INSURANCES {
        int insurance_id PK
        int patient_id FK
        composite insurance_info
        bool is_active
    }
    AUDIT_LOG {
        int log_id PK
        string table_name
        int record_id
        string action
        int changed_by FK
        timestamp changed_at
        json old_values
        json new_values
    }
    NOTIFICATIONS {
        int notification_id PK
        int user_id FK
        enum type_notif
        string message
        date created_at
        date read_at
        bool is_read
        string related_entity_type
        int related_entity_id
    }
    RACE_CODE {
        smallint race_code PK
        string race_text
    }
    GENDER_CODE {
        smallint gender_code PK
        string gender_text
    }
    ETHNICITY_CODE {
        smallint ethnicity_code PK
        string ethnicity_text
    }
    DEMOGRAPHICS {
        int user_id PK, FK
        smallint ethnicity FK
        smallint race FK
        smallint gender FK
        date dob
        int created_by
        date created_at
        int updated_by
        date updated_at
    }
    SPECIALTIES {
        int specialty_id PK
        string specialty_name
    }

    USERS ||--o{ DOCTOR : "is a"
    USERS ||--o{ PATIENT : "is a"
    DOCTOR ||--o{ PATIENT_DOCTOR : "has"
    PATIENT ||--o{ PATIENT_DOCTOR : "has"
    DOCTOR ||--o{ DOCTOR_OFFICES : "works at"
    OFFICE ||--o{ DOCTOR_OFFICES : "hosts"
    PATIENT ||--o{ APPOINTMENTS : "has"
    DOCTOR ||--o{ APPOINTMENTS : "conducts"
    OFFICE ||--o{ APPOINTMENTS : "hosts"
    PATIENT ||--o{ MEDICAL_RECORDS : "has"
    DOCTOR ||--o{ MEDICAL_RECORDS : "creates"
    APPOINTMENTS ||--o{ MEDICAL_RECORDS : "results in"
    MEDICAL_RECORDS ||--o{ PRESCRIPTION : "includes"
    PATIENT ||--o{ SPECIALIST_APPROVALS : "requests"
    DOCTOR ||--o{ SPECIALIST_APPROVALS : "requests/approves"
    PATIENT ||--o{ BILLING : "receives"
    APPOINTMENTS ||--|| BILLING : "generates"
    PATIENT ||--o{ INSURANCES : "has"
    USERS ||--o{ AUDIT_LOG : "generates"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--|| DEMOGRAPHICS : "has"
    RACE_CODE ||--o{ DEMOGRAPHICS : "categorizes"
    GENDER_CODE ||--o{ DEMOGRAPHICS : "categorizes"
    ETHNICITY_CODE ||--o{ DEMOGRAPHICS : "categorizes"
    DOCTOR ||--|| SPECIALTIES : "has"
```

## Project Directory Structure
### Backend
contains the server-side code for handling API requests and responses using Node.js and a REST API
and Sequelize for backend queries and database management.
- /src: 
  - /config: Configuration files, like db connection settings.
  - /models: Defines the data models that correspond to db tables.
  - /routes: Defines the API endpoints and their corresponding handlers.
  - testDbConnection.js: util script to test the db connection.
- server.js: The main entry point for backend.

### Frontend
 client-side code for the UI using React.js and Tailwind CSS for styling, with React Router for site routing.
- /public: static files served directly to the client.
- index.html: main HTML entry point
- /src: 
  - /components: Reusable React components.
  - /routes: Components and logic related to different routes (pages) in website
  - /styles: Custom CSS or style-related files.
  - /utils: Util functions and helpers
- index.jsx: The main entry point for React

### Database
manages the db schema and data synchronization between ourselves locally using PostgreSQL
- /migrations: we will use this directory to sync our databases
- /scripts: utility scripts to create, restore, and sync the db
