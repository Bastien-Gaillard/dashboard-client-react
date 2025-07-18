const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (in production, use a real database)
let users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    password: bcrypt.hashSync('password123', 10)
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-02-20'),
    password: bcrypt.hashSync('password123', 10)
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'moderator',
    status: 'inactive',
    createdAt: new Date('2024-03-10'),
    password: bcrypt.hashSync('password123', 10)
  }
];

// Admin credentials
const adminCredentials = {
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10)
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Authentication
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check admin credentials
    if (username === adminCredentials.username && 
        bcrypt.compareSync(password, adminCredentials.password)) {
      
      const token = jwt.sign(
        { id: 'admin', username: 'admin', role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: { id: 'admin', username: 'admin', role: 'admin' }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalSales: 1245,
    revenue: 98750
  };
  res.json(stats);
});

// Dashboard chart data
app.get('/api/dashboard/chart-data', authenticateToken, (req, res) => {
  const chartData = {
    lineData: [
      { month: 'Jan', users: 65, sales: 28, revenue: 15000 },
      { month: 'Feb', users: 89, sales: 48, revenue: 18000 },
      { month: 'Mar', users: 120, sales: 65, revenue: 22000 },
      { month: 'Apr', users: 145, sales: 78, revenue: 25000 },
      { month: 'May', users: 168, sales: 95, revenue: 28000 },
      { month: 'Jun', users: 195, sales: 112, revenue: 32000 }
    ],
    pieData: [
      { name: 'Products', value: 400 },
      { name: 'Services', value: 300 },
      { name: 'Subscriptions', value: 200 },
      { name: 'Other', value: 100 }
    ]
  };
  res.json(chartData);
});

// User management
app.get('/api/users', authenticateToken, (req, res) => {
  // Remove passwords from response
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

app.get('/api/users/:id', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

app.post('/api/users', authenticateToken, (req, res) => {
  const { name, email, role, status } = req.body;

  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newUser = {
    id: Math.max(...users.map(u => u.id)) + 1,
    name,
    email,
    role: role || 'user',
    status: status || 'active',
    createdAt: new Date(),
    password: bcrypt.hashSync('defaultPassword123', 10)
  };

  users.push(newUser);
  
  const { password, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, role, status } = req.body;

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if email already exists for other users
  const existingUser = users.find(u => u.email === email && u.id !== userId);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    role,
    status
  };

  const { password, ...safeUser } = users[userIndex];
  res.json(safeUser);
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Admin credentials: username: admin, password: admin123`);
});
