import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Interview from './pages/Interview';
import Coding from './pages/Coding';
import Scorecard from './pages/Scorecard';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  React.useEffect(() => {
    const keepAlive = setInterval(() => {
      fetch('https://nexthire-production-092e.up.railway.app/')
        .catch(() => {});
    }, 10 * 60 * 1000);
    return () => clearInterval(keepAlive);
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/coding" element={<Coding />} />
        <Route path="/scorecard" element={<Scorecard />} />
      </Routes>
    </Router>
  );
}

export default App;