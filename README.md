## WSYK Clinic
Hosted Web Link: http://4.156.152.174/

The app will prompt you to create a new account when you click "Book Appointment" to try to schedule an appointment. There are five different user roles: patients, doctors, receptionists, nurses, and administrators. Each role has access to different dashboards to accomplish specific tasks associated with their role.

Note: Employees require a valid employee id to register for an account, which can be given to them by an admin who made the id through the admin portal (the user management sidebar item).

Once logged in, you'll be able to perform various tasks, such as scheduling appointments, viewing patient details, and generating reports. Simply follow the on-screen instructions to navigate and utilize the app's features.

## Running the App
- For our project, we used MySQL for the database, NodeJS for backend, and React for frontend.
  - If not already installed:
    - MySQL: https://dev.mysql.com/downloads/
    - NodeJS: https://nodejs.org/en/download/package-manager
- Create the database:
  - Open MySQL Workbench and create a new database schema for the web application.
  - Import schema found in project folder `database` titled `combined_migrations.sql`.
- Configure .env file:
  - DB_PASSWORD=`<your password>`
  - DB_USER=`root`
  - DB_PORT=`3306`
  - DB_HOST=`<localhost>`
  - DB_NAME=`MEDICAL_CLINIC`
  - JWT_SECRET=`<your secret token>`

## Project Directory Structure
### backend
- contains the server-side code for handling API requests and responses using Node.js and a REST API and Sequelize for backend queries and database management.
    - /src: 
        - /config: Configuration files, such as db connection settings.
        - /models: Defines the data models that correspond to db tables.
        - /routes: Defines the API endpoints and their corresponding handlers.
        - /tests: Tests directory to see db connection details, try to modify db from backend API, etc.
    - server.js: The main entry point for backend

### frontend
- client-side code for the UI using React.js and Tailwind CSS for styling, with React Router for site routing.
    - /public: static files served directly to the client.
    - index.html: main HTML entry point
    - /src: 
        - /components: Reusable React components.
        - /routes: Components and logic related to different routes (pages) in website
        - /styles: Custom CSS or style-related files.
        - /utils: Util functions and helpers
    - index.jsx: The main entry point for React

### database
- manages the db schema and data synchronization between ourselves locally using MySQL
    - /migrations: we will use this directory to sync our databases
    - /scripts: utility scripts to create, restore, and sync the db

### Contributors
- Diego Coronado
- Kelsey Wong
- Rahul Sunil
- Daniil Bondar
