import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/dashboard" className="navbar-brand">
          Tableau de Bord Admin
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/dashboard" className={isActive('/dashboard')}>
              Tableau de Bord
            </Link>
          </li>
          <li>
            <Link to="/users" className={isActive('/users')}>
              Utilisateurs
            </Link>
          </li>
          <li>
            <button 
              onClick={onLogout}
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
