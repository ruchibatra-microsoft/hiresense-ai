import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Hide navbar during active interview
  if (location.pathname === '/interview') return null;

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🧠 <span>HireSense AI</span>
      </Link>

      {isAuthenticated && (
        <div className="navbar-links">
          <Link to="/companies" className={isActive('/companies')}>Interview</Link>
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        </div>
      )}

      <div className="navbar-actions">
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

        {isAuthenticated ? (
          <>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiUser size={14} /> {user?.name}
            </span>
            <button onClick={logout} className="btn btn-secondary btn-sm">
              <FiLogOut size={14} /> Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
