# Admin Dashboard Full-Stack Application

A modern full-stack admin dashboard application built with React frontend and Express backend.

## Features

### Frontend (React)
- **Authentication**: JWT-based login system
- **Dashboard**: Interactive charts and statistics with Recharts
- **User Management**: Complete CRUD operations for users
- **Responsive Design**: Modern UI with clean styling
- **Protected Routes**: Authentication-based routing

### Backend (Express)
- **RESTful API**: Complete REST endpoints for all operations
- **Authentication**: JWT token-based authentication
- **User Management**: CRUD operations for user management
- **Dashboard Data**: Statistics and chart data endpoints
- **CORS Support**: Cross-origin resource sharing enabled

## Tech Stack

- **Frontend**: React, React Router, Recharts, Axios
- **Backend**: Express.js, JWT, bcryptjs, CORS
- **Authentication**: JWT tokens
- **Charts**: Recharts library
- **Styling**: Pure CSS with modern design

## Project Structure

```
admin/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── UserManagement.js
│   │   │   ├── UserModal.js
│   │   │   └── Navbar.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Express backend
│   ├── index.js           # Main server file
│   ├── .env               # Environment variables
│   └── package.json
└── package.json           # Root package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd admin
   ```

2. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

3. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

### Manual Setup

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

## Usage

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Default Login Credentials
- **Username**: admin
- **Password**: admin123

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/chart-data` - Get chart data

#### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Health Check
- `GET /api/health` - Server health check

## Features in Detail

### Dashboard
- **Statistics Cards**: Total users, active users, total sales, revenue
- **Line Chart**: User growth and sales trends over time
- **Pie Chart**: Revenue distribution by category
- **Bar Chart**: Monthly revenue visualization

### User Management
- **User List**: Display all users with pagination and search
- **Add User**: Create new users with form validation
- **Edit User**: Update existing user information
- **Delete User**: Remove users with confirmation
- **Search**: Filter users by name or email
- **Role Management**: Assign different roles (admin, user, moderator)
- **Status Control**: Set user status (active/inactive)

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Session Persistence**: Remember login state across browser sessions
- **Logout**: Clear session and redirect to login

## Development

### Available Scripts

In the project directory:
- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the React frontend
- `npm run server` - Start only the Express backend
- `npm run build` - Build the React app for production
- `npm run install-all` - Install all dependencies for root, client, and server

### Environment Variables

Create a `.env` file in the `server` directory:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy Backend
1. Deploy the `server` directory to your hosting platform
2. Set environment variables
3. Start with `npm start`

### Deploy Frontend
1. Build the React app: `npm run build`
2. Deploy the `build` folder to a static hosting service
3. Update API endpoints to point to your backend server

## Security Considerations

- Change the JWT secret in production
- Implement proper password hashing (already included)
- Add rate limiting for API endpoints
- Use HTTPS in production
- Validate and sanitize all user inputs
- Implement proper error handling

## Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- Real-time updates with WebSocket
- File upload functionality
- Email notifications
- Advanced user permissions
- API documentation with Swagger
- Unit and integration tests
- Docker containerization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
