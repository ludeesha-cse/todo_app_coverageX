# Todo App - Full Stack Application

A modern, full-stack Todo application built with React (TypeScript) frontend and Node.js/Express backend with MySQL database.

## Features

- ✅ User Authentication (Sign up, Sign in, Logout)
- ✅ Create, Read, and Mark Tasks as Done
- ✅ Protected Routes
- ✅ Responsive Design with Tailwind CSS
- ✅ JWT Token Authentication
- ✅ MySQL Database Integration
- ✅ RESTful API
- ✅ Error Handling
- ✅ Loading States

## Tech Stack

### Frontend

- React 19 with TypeScript
- Vite for build tooling
- React Router DOM for routing
- Tailwind CSS for styling
- Context API for state management

### Backend

- Node.js with Express
- MySQL for database
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

## Project Structure

```
ToDoApp/
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route components
│   │   ├── services/      # API and auth services
│   │   └── utils/         # Helper functions
│   └── package.json
├── backend/           # Node.js Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middlewares/   # Custom middlewares
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Database connection
│   └── package.json
├── db/               # Database initialization
├── start-backend.bat    # Windows backend startup script
├── start-frontend.bat   # Windows frontend startup script
├── start-backend.sh     # Linux/Mac backend startup script
└── start-frontend.sh    # Linux/Mac frontend startup script
```

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- MySQL Server
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd ToDoApp

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

### 2. Database Setup

1. Create a MySQL database
2. Run the initialization script:

```bash
mysql -u your_username -p your_database < db/init.sql
```

### 3. Environment Configuration

#### Backend (.env in backend folder)

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

#### Frontend (.env in frontend folder)

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Running the Application

#### Using Startup Scripts

**Windows:**

```bash
# Start backend (in one terminal)
./start-backend.bat

# Start frontend (in another terminal)
./start-frontend.bat
```

**Linux/Mac:**

```bash
# Make scripts executable (first time only)
chmod +x start-backend.sh start-frontend.sh

# Start backend (in one terminal)
./start-backend.sh

# Start frontend (in another terminal)
./start-frontend.sh
```

#### Manual Start

```bash
# Backend (in one terminal)
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

#### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
npm start

# Serve frontend build
cd ../frontend
npm run preview
```

## API Endpoints

### Authentication Routes (`/users`)

- `POST /users/signup` - Register new user
- `POST /users/login` - Login user

### Task Routes (`/tasks`) - Requires Authentication

- `GET /tasks` - Get all user tasks
- `POST /tasks` - Create new task
- `PATCH /tasks/:id/done` - Mark task as completed

## Frontend Routes

- `/` - Dashboard (Protected)
- `/signin` - Sign in page
- `/signup` - Sign up page

## Features Implemented

### Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is sent with authenticated requests
4. Protected routes redirect to login if not authenticated

### Task Management

1. Users can create tasks with title and description
2. Tasks are displayed in a card layout
3. Users can mark tasks as completed
4. Completed tasks are removed from the list

### UI/UX Features

- Responsive design for mobile and desktop
- Loading states for all async operations
- Error handling with user-friendly messages
- Form validation
- Modern, clean interface

## Development Features

### Error Handling

- Comprehensive error handling on both frontend and backend
- User-friendly error messages
- Proper HTTP status codes

### Security

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- CORS configuration

### Code Quality

- TypeScript for type safety
- ESLint configuration
- Proper project structure
- Component-based architecture

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run tests with coverage
cd backend
npm run test:coverage
```

## Environment Variables

### Backend Required Variables

- `PORT` - Server port (default: 5000)
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration time

### Frontend Required Variables

- `VITE_API_BASE_URL` - Backend API URL

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Ensure MySQL is running
   - Check database credentials in .env
   - Verify database exists

2. **CORS Issues**

   - Ensure frontend URL is allowed in backend CORS configuration
   - Check API base URL in frontend .env

3. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT secret configuration
   - Verify token expiration settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the ISC License.
