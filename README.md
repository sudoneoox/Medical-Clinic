## WSYK Clinic
COSC 3380 Database Systems Class Project

The app will prompt you to create a new account when you click "Book Appointment" to try to schedule an appointment. There are five different user roles: patients, doctors, receptionists, nurses, and administrators. Each role has access to different dashboards to accomplish specific tasks associated with their role.

Note: Employees require a valid employee id to register for an account, which can be given to them by an admin who made the id through the admin portal (the user management sidebar item).

Once logged in, you'll be able to perform various tasks, such as scheduling appointments, viewing patient details, and generating reports. Simply follow the on-screen instructions to navigate and utilize the app's features.

## Running the App
- For our project, we used MySQL for the database, NodeJS for backend, and React for frontend.
  - If not already installed:
    - MySQL: https://dev.mysql.com/downloads/
    - NodeJS: https://nodejs.org/en/download/package-manager

Steps for running the web app
1. Navigate to the root project directory and run
```bash
cd backend && npm i && cd ../frontend && npm i 
```

2. Setup the database
This is assuming you have a unix based laptop
- setup a user with privileged access through the mysql terminal
https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql
- create a database that the newly added user has access to
```bash
#in the mysql terminal
create database $DB_NAME;
use $DB_NAME;
```
- run our combined migrations sql script that holds our db schema and data
```bash
#assuming your in the root project directory
cd database/scripts 

# make sure you replace these with what you defined whenever you created your database
mysql -h "$DB_HOST" -u "$DB_USER" --password="$DB_PASSWORD" "$DB_NAME" < combined_migrations.sql
```
3. Create a .env file in the root backend directory
```bash
# Assuming your in the root project directory
cd backend && touch .env
```
An example .env file so that the backend can connect to your database 
- DB_PASSWORD=`<your password for the  created user with db privileges>`
- DB_USER=`<your database user with privilege to the database>`
- DB_PORT=`3306`
- DB_HOST=`<localhost>`
- DB_NAME=`<your database name>`

4. Assuming you configured your database correctly and got your .env file setup you can now start the project in a local server
```bash
# start the backend server
cd backend && npm start

# start the frontend server
cd frontend && npm start
```

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
