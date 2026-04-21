# 📓 Personal Diary Application (MERN Stack)

A secure, full-stack web application designed for personal journaling. Built with the MERN (MongoDB, Express, React, Node.js) stack, featuring custom CSS (No frameworks) and JWT-based authentication.

---

## 🛠️ Phase 1: Development Steps (How it was Created)

### 1. Backend Foundation (Server-side)
* **Environment Setup**: Initialized Node.js and installed essential packages: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, and `cors`.
* **Database Modeling**: Defined Mongoose schemas for **Users** (name, email, password) and **Entries** (title, content, user-reference).
* **Security Implementation**: Created an `authMiddleware.js` to protect routes. This ensures only logged-in users with a valid "Bearer Token" can read or write entries.
* **API Development**: 
    - **Auth Routes**: Handle registration and login.
    - **Entry Routes**: Handle fetching, creating, and deleting diary notes.

### 2. Frontend Architecture (Client-side)
* **Project Bootstrapping**: Used **Vite** for a fast development environment.
* **State & Routing**: Implemented `react-router-dom` for navigation and used `useState`/`useEffect` hooks to manage the data lifecycle.
* **API Integration**: Configured **Axios** with an "Interceptor" to automatically inject the JWT token from `localStorage` into every outgoing request.
* **UI/UX Design**: Built a custom responsive layout using CSS variables, Flexbox, and transition effects to provide a modern feel without external libraries.

---

## 🚀 Phase 2: How to Run the Project

### Step 1: Clone and Install
Open your terminal and run:
```bash
# Clone the repository
git clone <your-repository-link>
cd personal-diary-app

# Install Backend Dependencies
cd server
npm install


Step 2: Environment Configuration
Create a .env file inside the server folder:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here

# Install Frontend Dependencies
cd ../client
npm install

Step 3: Execution
You must run both the server and the client simultaneously.

Terminal 1 (Backend):

Bash
cd server
npm run dev
Terminal 2 (Frontend):

Bash
cd client
npm run dev
