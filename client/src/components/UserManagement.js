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
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
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
        user.id === savedUser.id ? savedUser : user
      ));
    } else {
      // Add new user
      setUsers([...users, savedUser]);
    }
    handleModalClose();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title">User Management</h1>
        <button 
          onClick={handleCreateUser}
          className="btn btn-primary"
        >
          Add New User
        </button>
      </div>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px', width: '300px', fontSize: '14px' }}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span 
                    style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: user.status === 'active' ? '#28a745' : '#dc3545',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => handleEditUser(user)}
                    className="btn btn-primary"
                    style={{ marginRight: '10px', padding: '5px 10px' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="btn btn-danger"
                    style={{ padding: '5px 10px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No users found.
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
