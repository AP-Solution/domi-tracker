import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.scss';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <Link to="/">
          <img src="./images/d-icon.png" alt="Domi Tracker Logo" />
          Domi Tracker
        </Link>
      </div>
      <div className="nav-links">
        <Link 
          to="/timetracker" 
          className={location.pathname === '/timetracker' ? 'active' : ''}
        >
          Time Tracker
        </Link>
        <Link 
          to="/deliveries" 
          className={location.pathname === '/deliveries' ? 'active' : ''}
        >
          Deliveries
        </Link>
        <Link 
          to="/statistics" 
          className={location.pathname === '/statistics' ? 'active' : ''}
        >
          Statistics
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
