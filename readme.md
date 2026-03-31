# 🚗 CSE 340 Final Project - Car Dealership

A full-stack used car dealership web application built with **Node.js, Express, PostgreSQL, and EJS**. Users can browse vehicles, leave reviews, and submit service requests. Employees and owners have dashboards for managing the platform.

---

## 📋 Project Description

This site serves as a used car dealership platform where customers can browse inventory, submit service requests, and leave vehicle reviews. Employees manage service requests and moderate content. The owner has full control over all system data.

---

## ✨ Project Features

- User registration and login
- Password hashing with bcrypt
- Session-based authentication
- Role-based access control (user, employee, owner)
- Vehicle inventory page with availability status
- Vehicle detail page with reviews
- Reviews system — users can create, edit, and delete their own reviews
- Service request system with status tracking
- Employee dashboard — manage requests, vehicles, reviews, contact messages
- Owner dashboard — manage users, vehicles, categories
- Contact form (saved to database)
- Profile page with service request history

---

## 👥 User Roles

### 🔹 User
- Browse vehicles
- View vehicle details
- Leave, edit, and delete their own reviews
- Submit service requests
- View service request history and status
- Update profile (name, email, password)

### 🔹 Employee
- Everything a user can do, plus:
- View and update service request status
- Add notes to service requests
- Edit vehicle details (price, description, availability)
- Delete inappropriate reviews
- View contact form submissions

### 🔹 Owner
- Everything an employee can do, plus:
- Add, edit, and delete vehicles
- Add, edit, and delete vehicle categories
- Manage user roles
- Delete users

---

## 🗄 Database Tables

- **users** – stores user accounts and roles
- **vehicles** – stores vehicle inventory
- **categories** – stores vehicle categories
- **reviews** – stores user reviews for vehicles
- **service_requests** – stores service requests with status and notes
- **contact_messages** – stores contact form submissions
- **vehicle_images** – stores vehicle image references

---

## 🧠 Database Schema (ERD)

![ERD](./erd.png)

---

## 👤 Test Accounts

Use `P@$$w0rd!` as the password for all test accounts.

| Role     | Email                 |
|----------|-----------------------|
| Owner    | owner@dealer.com      |
| Employee | employee@dealer.com   |
| User     | customer@dealer.com   |

---

## ⚙️ How to Run Locally
```bash
npm install
npm run dev
```