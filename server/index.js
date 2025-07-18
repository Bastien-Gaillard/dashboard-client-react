const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Database file path
const DB_FILE = path.join(__dirname, 'data', 'users.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions for JSON database
const ensureDataDir = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
};

const readUsersFromFile = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur lecture fichier:', error);
  }
  return [];
};

const writeUsersToFile = (users) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Erreur écriture fichier:', error);
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Initialize database with sample data
const initializeData = () => {
  let users = readUsersFromFile();
  
  if (users.length === 0) {
    console.log('Initialisation des données de démonstration...');
    
    users = [
      {
        _id: generateId(),
        name: 'Administrateur',
        email: 'admin@admin.com',
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        status: 'actif',
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Jean Dupont',
        email: 'jean@exemple.com',
        username: 'jean.dupont',
        password: bcrypt.hashSync('password123', 10),
        role: 'utilisateur',
        status: 'actif',
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Marie Martin',
        email: 'marie@exemple.com',
        username: 'marie.martin',
        password: bcrypt.hashSync('password123', 10),
        role: 'modérateur',
        status: 'actif',
        createdAt: new Date().toISOString()
      }
    ];
    
    writeUsersToFile(users);
    console.log('Données de démonstration créées');
  }
};

// Initialize data on startup
initializeData();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Jeton d\'accès requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Jeton invalide' });
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
    const users = readUsersFromFile();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        name: user.name,
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const users = readUsersFromFile();
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'actif').length;
    
    const stats = {
      totalUsers,
      activeUsers,
      totalSales: 1245,
      revenue: 98750
    };
    res.json(stats);
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Dashboard chart data
app.get('/api/dashboard/chart-data', authenticateToken, (req, res) => {
  const chartData = {
    lineData: [
      { month: 'Jan', users: 65, sales: 28, revenue: 15000 },
      { month: 'Fév', users: 89, sales: 48, revenue: 18000 },
      { month: 'Mar', users: 120, sales: 65, revenue: 22000 },
      { month: 'Avr', users: 145, sales: 78, revenue: 25000 },
      { month: 'Mai', users: 168, sales: 95, revenue: 28000 },
      { month: 'Juin', users: 195, sales: 112, revenue: 32000 }
    ],
    pieData: [
      { name: 'Produits', value: 400 },
      { name: 'Services', value: 300 },
      { name: 'Abonnements', value: 200 },
      { name: 'Autres', value: 100 }
    ]
  };
  res.json(chartData);
});

// User management
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = readUsersFromFile();
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const users = readUsersFromFile();
    const user = users.find(u => u._id === req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  const { name, email, username, role, status, password } = req.body;

  try {
    const users = readUsersFromFile();
    
    // Check if email or username already exists
    const existingUser = users.find(u => u.email === email || u.username === username);

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'L\'email existe déjà' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Le nom d\'utilisateur existe déjà' });
      }
    }

    const newUser = {
      _id: generateId(),
      name,
      email,
      username: username || email.split('@')[0],
      password: bcrypt.hashSync(password || 'defaultPassword123', 10),
      role: role || 'utilisateur',
      status: status || 'actif',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsersToFile(users);
    
    const { password: pwd, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { name, email, username, role, status } = req.body;

  try {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u._id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Check if email or username already exists for other users
    const existingUser = users.find(u => 
      u._id !== req.params.id && (u.email === email || u.username === username)
    );

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'L\'email existe déjà' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Le nom d\'utilisateur existe déjà' });
      }
    }

    users[userIndex] = {
      ...users[userIndex],
      name,
      email,
      username,
      role,
      status
    };

    writeUsersToFile(users);
    
    const { password, ...safeUser } = users[userIndex];
    res.json(safeUser);
  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u._id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    users.splice(userIndex, 1);
    writeUsersToFile(users);

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  console.log(`Base de données JSON: ${DB_FILE}`);
  console.log(`Identifiants administrateur : nom d'utilisateur: admin, mot de passe: admin123`);
});
