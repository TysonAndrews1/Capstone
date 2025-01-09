# Phase3-Backend
 This is a repository for the backend and database for Shift Solutions Employee Management App Prototype

Prerequisites
- Java JDK 23
- MySQL Community Server Innovation 9.10 Link: https://dev.mysql.com/downloads/mysql/ 
    - I used the MSI Installer. The installer will ask for a root password I used: P@ssword123 if you want to use the same.
    - You might need to add the MySQL Folder to your environment variable for MySQL to work fully.
        - Search "Edit the system environment variables" on your computer.
        - In the system properties popup click on "Environmental Variables"
        - Click on PATH in the user variables and click edit
        - Click on new and input the address where your MySQL Server 9.1\bin folder is located
            - Mine was: "C:\Program Files\MySQL\MySQL Server 9.1\bin"
        - Repeat the same step for the system variables
        - Restart computer and you should be good to go

Optional 
- MySQL Workbench 8.0.40
- VScode

Run the test.sql file
1. Make sure you have MySQL Community Server Innovation 9.10 installed and configured an account.
2. Open command prompt and change file directory to where the test.sql is located, or type CMD in the file address bar where the test.sql is located.
3. Log into your account using "mysql -u root -p" in the command prompt.
4. After logging in, run the test.sql file using "SOURCE test.sql;".
5. To verify if the database was created properly use "SHOW DATABASES;" and check if the employee_management database was created.
6. You should be able to view the tables inside the employee_management database. You can try "SELECT * FROM banquet_events;"

To run the backend server.
1. Inside the demo folder, navigate to backend > demo
2. Run the DemoApplication.java to start the backend server by entering "mvn spring-boot:run"
3. See all events created in the database using "http://localhost:8080/api/events" in your browser.
4. http://localhost:8080/api/events/filter?timeframe=past to see all past events.
5. http://localhost:8080/api/events/filter?timeframe=upcoming to see all upcoming events.

*Working on connecting the frontend to the backend. 