# Quick Setup Guide

Follow these steps to get the Todo App running on your machine:

## Step 1: Prerequisites

- Install Node.js (v16+)
- Install MySQL Server
- Have a terminal/command prompt ready

## Step 2: Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ToDoApp
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   cd ..
   ```

## Step 3: Database Setup

1. **Create MySQL database**

   ```sql
   CREATE DATABASE todo_db;
   ```

2. **Run initialization script**
   ```bash
   mysql -u your_username -p todo_db < db/init.sql
   ```

## Step 4: Environment Configuration

1. **Backend environment** (`backend/.env`):

   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=todo_db
   JWT_SECRET=your_secret_key_here
   ```

2. **Frontend environment** (`frontend/.env`):
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

## Step 5: Start the Application

### Option A: Use startup scripts

**Windows:**

```bash
# Terminal 1
./start-backend.bat

# Terminal 2
./start-frontend.bat
```

**Linux/Mac:**

```bash
# Make executable first
chmod +x start-backend.sh start-frontend.sh

# Terminal 1
./start-backend.sh

# Terminal 2
./start-frontend.sh
```

### Option B: Manual start

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

## Step 6: Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## You're Done!

You can now:

1. Create an account at http://localhost:5173/signup
2. Sign in with your credentials
3. Start managing your tasks

## Need Help?

Check the main README.md for detailed documentation and troubleshooting guide.
