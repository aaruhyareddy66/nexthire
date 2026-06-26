import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px' }}>
          Welcome to <span style={{ color: '#6c63ff' }}>NextHire</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          Upload your resume, go through an AI interview, solve coding problems and get your final score — all in one place.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/resume')}>
            Start Now
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/scorecard')}>
            View Scorecard
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '40px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
            <h3 style={{ marginBottom: '8px' }}>Resume Analysis</h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Upload your PDF resume and get instant AI feedback and score</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎤</div>
            <h3 style={{ marginBottom: '8px' }}>AI Interview</h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Practice with an AI interviewer that adapts to your resume</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💻</div>
            <h3 style={{ marginBottom: '8px' }}>Coding Round</h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Solve real coding problems in the browser with live execution</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
            <h3 style={{ marginBottom: '8px' }}>Final Scorecard</h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Get your complete placement readiness score with breakdown</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;