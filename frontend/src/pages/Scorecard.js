import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

function Scorecard() {
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateScorecard = async () => {
    const resumeScore = parseFloat(localStorage.getItem('resume_score')) || 0;
    const communicationScore = parseFloat(localStorage.getItem('communication_score')) || 0;
    const technicalScore = parseFloat(localStorage.getItem('technical_score')) || 0;
    const codeScore = parseFloat(localStorage.getItem('code_score')) || 0;

    setLoading(true);
    try {
      const response = await axios.post('https://nexthire-production-092e.up.railway.app/scorecard/generate', {
        resume_score: resumeScore,
        communication_score: communicationScore,
        technical_score: technicalScore,
        code_score: codeScore
      });
      setScorecard(response.data);
      toast.success('Scorecard generated!');
    } catch (error) {
      toast.error('Failed to generate scorecard!');
    }
    setLoading(false);
  };

  const chartData = scorecard ? [
    { subject: 'Resume', score: scorecard.breakdown.resume.score },
    { subject: 'Communication', score: scorecard.breakdown.communication.score },
    { subject: 'Technical', score: scorecard.breakdown.technical.score },
    { subject: 'Code Quality', score: scorecard.breakdown.code_quality.score },
  ] : [];

  return (
    <div className="page">
      <h1 style={{ marginBottom: '8px' }}>Final Scorecard</h1>
      <p style={{ color: '#aaa', marginBottom: '32px' }}>Your complete placement readiness score</p>

      {!scorecard ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📊</div>
          <h2 style={{ marginBottom: '16px' }}>Ready to see your score?</h2>
          <p style={{ color: '#aaa', marginBottom: '32px' }}>Make sure you have completed Resume Analysis, Interview and Coding rounds first.</p>
          <button className="btn btn-primary" onClick={generateScorecard} disabled={loading}>
            {loading ? 'Generating...' : 'Generate My Scorecard'}
          </button>
        </div>
      ) : (
        <div>
          <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '80px', fontWeight: '700', color: '#6c63ff' }}>{scorecard.final_score}</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Grade: {scorecard.grade}</div>
            <p style={{ color: '#aaa', fontSize: '18px' }}>{scorecard.verdict}</p>
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={chartData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#aaa' }} />
                <Radar name="Score" dataKey="score" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {Object.entries(scorecard.breakdown).map(([key, value]) => (
              <div key={key} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#6c63ff', marginBottom: '4px' }}>{value.score}</div>
                <div style={{ color: '#fff', marginBottom: '4px', textTransform: 'capitalize' }}>{key.replace('_', ' ')}</div>
                <div style={{ color: '#aaa', fontSize: '13px' }}>Weight: {value.weight}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button className="btn btn-secondary" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scorecard;