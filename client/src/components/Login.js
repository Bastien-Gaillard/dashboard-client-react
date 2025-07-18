import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            placeholder="Enter username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Demo credentials:</p>
        <p>Username: admin</p>
        <p>Password: admin123</p>
      </div>
    </div>
  );
};

export default Login;
