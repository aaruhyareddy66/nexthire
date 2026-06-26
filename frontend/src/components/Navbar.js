import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">NextHire</Link>
      </div>
      <div className="navbar-links">
        <Link className={location.pathname === '/' ? 'active' : ''} to="/">Home</Link>
        <Link className={location.pathname === '/resume' ? 'active' : ''} to="/resume">Resume</Link>
        <Link className={location.pathname === '/interview' ? 'active' : ''} to="/interview">Interview</Link>
        <Link className={location.pathname === '/coding' ? 'active' : ''} to="/coding">Coding</Link>
        <Link className={location.pathname === '/scorecard' ? 'active' : ''} to="/scorecard">Scorecard</Link>
      </div>
    </nav>
  );
}

export default Navbar;