import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
                <Login onLogin={handleLogin} /> : 
                <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Dashboard /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/users" 
            element={
              isAuthenticated ? 
                <UserManagement /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
