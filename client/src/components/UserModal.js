import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'utilisateur',
    status: 'actif',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        role: user.role || 'utilisateur',
        status: user.status || 'actif',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      let response;
      if (user) {
        // Update existing user
        response = await axios.put(`/api/users/${user._id}`, formData, config);
      } else {
        // Create new user
        response = await axios.post('/api/users', formData, config);
      }

      onSave(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{user ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {!user && (
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!user}
                placeholder="Mot de passe (minimum 6 caractères)"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            >
              <option value="utilisateur">Utilisateur</option>
              <option value="admin">Administrateur</option>
              <option value="modérateur">Modérateur</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Statut</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button 
              type="button" 
              onClick={onClose}
              className="btn"
              style={{ backgroundColor: '#6c757d', color: 'white' }}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (user ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
