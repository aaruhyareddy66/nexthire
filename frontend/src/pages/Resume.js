import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Resume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a PDF file first!');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('https://nexthire-production-092e.up.railway.app/resume/analyze', formData);
      const parsed = JSON.parse(response.data.raw_analysis);
      setResult({ ...parsed, skills_found: response.data.skills_found });
      localStorage.setItem('resume_score', parsed.score);
      localStorage.setItem('resume_summary', parsed.summary);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      toast.error('Something went wrong. Try again!');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 style={{ marginBottom: '8px' }}>Resume Analysis</h1>
      <p style={{ color: '#aaa', marginBottom: '32px' }}>Upload your PDF resume and get instant AI feedback</p>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Upload Resume</h3>
        <input type="file" accept=".pdf" onChange={handleFileChange} style={{ marginBottom: '16px' }} />
        {file && <p style={{ color: '#aaa', marginBottom: '16px' }}>Selected: {file.name}</p>}
        <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {result && (
        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Resume Score</h2>
              <div style={{ fontSize: '48px', fontWeight: '700', color: '#6c63ff' }}>{result.score}/100</div>
            </div>
            <p style={{ color: '#aaa', marginTop: '8px' }}>{result.summary}</p>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>Skills Found</h3>
            <div>{result.skills_found.map((skill, i) => <span key={i} className="tag">{skill}</span>)}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card">
              <h3 style={{ marginBottom: '12px', color: '#4caf50' }}>Strengths</h3>
              {result.strengths && result.strengths.map((s, i) => (
                <p key={i} style={{ color: '#aaa', marginBottom: '8px' }}>✅ {s}</p>
              ))}
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '12px', color: '#f44336' }}>Weaknesses</h3>
              {result.weaknesses && result.weaknesses.map((w, i) => (
                <p key={i} style={{ color: '#aaa', marginBottom: '8px' }}>⚠️ {w}</p>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <a href="/interview"><button className="btn btn-primary">Start Interview →</button></a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resume;