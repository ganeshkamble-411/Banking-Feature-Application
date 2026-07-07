# 🏦 Banking Feature Application

A full-stack Banking Application developed using **Angular** for the frontend and **Spring Boot** for the backend. The application provides secure banking operations such as user registration, login, account management, fund transfers, deposits, withdrawals, and transaction tracking.

## 🚀 Features

### Authentication
- User Registration
- User Login
- Secure Authentication

### Account Management
- Create Bank Account
- View Account Details
- Dashboard Overview

### Banking Operations
- Deposit Money
- Withdraw Money
- Transfer Funds
- View Transaction History

### Contact Module
- Submit Contact Queries
- Store Customer Messages

### Dashboard
- Total Balance Overview
- Recent Transactions
- Account Summary

---

# 🛠️ Tech Stack

## Frontend
- Angular
- TypeScript
- HTML5
- CSS3
- Angular Router
- HttpClient

## Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Spring Security
- MySQL
- Maven

## Tools
- Git
- GitHub
- Postman
- Swagger/OpenAPI
- VS Code
- IntelliJ IDEA / Eclipse

---

# 📂 Project Structure

```text
Banking-Feature-Application
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   ├── angular.json
│   └── ...
│
├── Backend
│   ├── src
│   ├── pom.xml
│   ├── mvnw
│   └── ...
│
└── README.md
```

---

# ⚙️ Backend Setup

### Clone Repository

```bash
git clone https://github.com/ganeshkamble-411/Banking-Feature-Application.git
```

### Navigate to Backend

```bash
cd Backend
```

### Configure Database

Update `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bankdb
spring.datasource.username=root
spring.datasource.password=your_password
```

### Run Backend

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

# ⚙️ Frontend Setup

### Navigate to Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Run Angular Application

```bash
ng serve
```

Frontend runs on:

```text
http://localhost:4200
```

---

# 📌 Available Modules

- Login
- Register
- Dashboard
- Account Management
- Transactions
- Fund Transfer
- Contact Us
- Navbar
- Sidebar

---

# 🔗 API Documentation

Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```

---

# 📈 Future Enhancements

- JWT Authentication
- Email Notifications
- Profile Management
- Role-Based Access Control
- Account Statements (PDF Export)
- Online Bill Payments

---
