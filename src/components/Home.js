import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Domi Tracker</h1>
      <div className="menu-grid">
        <Link to="/timetracker" className="menu-item">
          <h2>Time Tracker</h2>
          <p>Track your work hours and earnings</p>
        </Link>
        <Link to="/deliveries" className="menu-item">
          <h2>Deliveries</h2>
          <p>Manage your deliveries</p>
        </Link>
        <Link to="/statistics" className="menu-item">
          <h2>Statistics</h2>
          <p>View your performance analytics</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
