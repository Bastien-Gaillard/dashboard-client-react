import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserModal from './UserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleUserSave = (savedUser) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(user => 
        user._id === savedUser._id ? savedUser : user
      ));
    } else {
      // Add new user
      setUsers([...users, savedUser]);
    }
    handleModalClose();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Chargement des utilisateurs...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Gestion des Utilisateurs</h1>
        <button 
          onClick={handleCreateUser}
          className="btn btn-primary"
        >
          Ajouter un Utilisateur
        </button>
      </div>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Rechercher des utilisateurs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Nom d'utilisateur</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user._id.slice(-6)}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <span 
                    className={`status-badge ${user.status === 'actif' ? 'status-active' : 'status-inactive'}`}
                    style={{ 
                      backgroundColor: user.status === 'actif' ? '#28a745' : '#dc3545',
                      color: 'white'
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="btn btn-primary"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="btn btn-danger"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            Aucun utilisateur trouvé.
          </div>
        )}
      </div>

      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={handleModalClose}
          onSave={handleUserSave}
        />
      )}
    </div>
  );
};

export default UserManagement;
