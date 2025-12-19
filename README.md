# Task Manager Application

## Description

This is a project and task management application that allows users to create projects, add tasks to them, mark tasks as complete, and track overall progress. The application uses a microservices architecture with a modern web frontend.

## Technologies Used

**Backend:**
- Java 17
- Spring Boot 3.2
- Spring Cloud (Eureka, Gateway)
- Spring Security with JWT authentication
- Spring Data JPA
- MySQL database

**Frontend:**
- React 18
- React Router for navigation
- Axios for API calls

**Database:**
- MySQL 8

## Project Structure

The application consists of 5 backend microservices and 1 frontend application:

- discovery-service: Service registry running on port 8761
- gateway-service: API gateway running on port 8080
- auth-service: Handles user authentication on port 8081
- project-service: Manages projects on port 8082
- task-service: Manages tasks on port 8083
- frontend: React application running on port 3000

## Database Setup

1. Install MySQL 8 if not already installed
2. Start the MySQL server
3. The database named "taskmanager" will be created automatically when you start the services
4. If your MySQL has a password, update the password field in the application.properties files located in auth-service, project-service, and task-service under src/main/resources

## How to Run Backend

The services must be started in a specific order. Open a terminal for each service.

**Step 1: Start Discovery Service**
Navigate to the discovery-service folder and run mvn spring-boot:run
Wait until you see "Tomcat started on port 8761"

**Step 2: Start Gateway Service**
Navigate to the gateway-service folder and run mvn spring-boot:run
Wait until you see "Tomcat started on port 8080"

**Step 3: Start Auth Service**
Navigate to the auth-service folder and run mvn spring-boot:run
Wait until you see "Tomcat started on port 8081"

**Step 4: Start Project Service**
Navigate to the project-service folder and run mvn spring-boot:run
Wait until you see "Tomcat started on port 8082"

**Step 5: Start Task Service**
Navigate to the task-service folder and run mvn spring-boot:run
Wait until you see "Tomcat started on port 8083"

## How to Run Frontend

Navigate to the frontend folder and run npm install to install dependencies.
After installation completes, run npm start to launch the application.
The application will open automatically at http://localhost:3000

## Test Accounts

The application creates two test accounts on startup:

Email: admin@test.com / Password: admin123
Email: user@test.com / Password: user123

## Features

- User registration and login with JWT tokens
- Create, view, update and delete projects
- Add tasks to projects with title, description and due date
- Mark tasks as completed
- View progress percentage for each project
- Responsive design that works on mobile and desktop
