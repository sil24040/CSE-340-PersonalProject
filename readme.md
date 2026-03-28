# 🚗 CSE 340 Personal Project - Car Dealership

This project is a full-stack car dealership web application built using **Node.js, Express, PostgreSQL, and EJS**. It allows users to browse vehicles, leave reviews, submit service requests, and provides role-based dashboards for employees and owners.

---

## ✨ Project Features

- User registration and login
- Password hashing with bcrypt
- Session-based authentication
- Role-based access control (user, employee, owner)
- Vehicle inventory page
- Vehicle detail page
- Reviews system (per vehicle)
- Service request system
- Employee dashboard (manage service requests)
- Owner dashboard (manage users, vehicles, categories)
- Contact form
- Profile update page

---

## 👥 User Roles

### 🔹 User
- Browse vehicles
- View vehicle details
- Leave reviews
- Submit service requests
- Update profile

### 🔹 Employee
- View all service requests
- Update service request status

### 🔹 Owner
- Full access to the system
- Manage users and roles
- Manage vehicles
- Manage categories
- View all service requests

---

## 🗄 Database Tables

- **users** – stores user accounts and roles  
- **vehicles** – stores vehicle inventory  
- **reviews** – stores user reviews for vehicles  
- **service_requests** – stores service requests  
- **contact_messages** – stores contact form messages  
- **categories** – stores vehicle categories  
- **vehicle_images** – stores vehicle images  

---

## 🔗 Database Relationships

- A **user** can create many **reviews**
- A **user** can create many **service requests**
- A **vehicle** can have many **reviews**
- A **vehicle** can have many **service requests**
- Each **review** belongs to one **user** and one **vehicle**
- Each **service request** belongs to one **user** and one **vehicle**

---

## 🧠 Database Schema (ERD)

![ERD](./erd.png)

---

## 👤 Test Accounts

Use these accounts to test different roles:

- **Owner**  
  Email: sdasilveira@byupathway.edu
  password: havaianas99

- **Employee**  
  Email: `employee@dealer.com`  

- **User**  
  Email: `customer@dealer.com`  

👉 Use your class test password for all accounts.

---

## ⚙️ How to Run Locally

```bash
npm install
npm run dev