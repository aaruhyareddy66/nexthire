import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Coding() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('# Write your solution here\n');
  const [output, setOutput] = useState('');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    axios.get('https://nexthire-backend-1byv.onrender.com/coding/problems')
      .then(res => setProblems(res.data.problems))
      .catch(() => toast.error('Failed to load problems'));
  }, []);

  const selectProblem = (problem) => {
    setSelectedProblem(problem);
    setCode('# Write your solution here\n');
    setOutput('');
    setReview(null);
  };

  const runCode = () => {
    setLoading(true);
    try {
      let outf = "";
      function outfun(text) { outf += text; }
      function builtinRead(x) {
        if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined)
          throw new Error("File not found: '" + x + "'");
        return window.Sk.builtinFiles["files"][x];
      }
      window.Sk.configure({ output: outfun, read: builtinRead });
      window.Sk.misceval.asyncToPromise(() =>
        window.Sk.importMainWithBody("<stdin>", false, code, true)
      ).then(() => {
        setOutput(outf || "No output");
        setLoading(false);
      }).catch(err => {
        setOutput(err.toString());
        setLoading(false);
      });
    } catch (err) {
      setOutput(err.toString());
      setLoading(false);
    }
  };

  const reviewCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/coding/review', {
        code: code,
        problem: selectedProblem.title,
        language: 'python'
      });
      const parsed = JSON.parse(response.data.review);
      setReview(parsed);
      localStorage.setItem('code_score', parsed.score);
      toast.success('Code reviewed!');
    } catch (error) {
      toast.error('Failed to review code!');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 style={{ marginBottom: '8px' }}>Coding Round</h1>
      <p style={{ color: '#aaa', marginBottom: '32px' }}>Solve the problem and get your code reviewed by AI</p>

      {!selectedProblem ? (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Pick a Problem</h2>
          {problems.map((problem) => (
            <div key={problem.id} className="card" style={{ cursor: 'pointer' }} onClick={() => selectProblem(problem)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{problem.title}</h3>
                <span className="tag" style={{ color: '#4caf50' }}>{problem.difficulty}</span>
              </div>
              <p style={{ color: '#aaa', marginTop: '8px' }}>{problem.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2>{selectedProblem.title}</h2>
              <button className="btn btn-secondary" onClick={() => setSelectedProblem(null)}>← Back</button>
            </div>
            <p style={{ color: '#aaa', marginBottom: '8px' }}>{selectedProblem.description}</p>
            <p style={{ color: '#6c63ff', fontSize: '14px' }}>{selectedProblem.examples}</p>
          </div>

          <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', border: '1px solid #333' }}>
            <Editor
              height="350px"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button className="btn btn-primary" onClick={runCode} disabled={loading}>
              {loading ? 'Running...' : '▶ Run Code'}
            </button>
            <button className="btn btn-secondary" onClick={reviewCode} disabled={loading}>
              {loading ? 'Reviewing...' : 'AI Review'}
            </button>
          </div>

          {output && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '8px' }}>Output</h3>
              <pre style={{ color: '#4caf50', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{output}</pre>
            </div>
          )}

          {review && (
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>AI Code Review</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#6c63ff' }}>{review.score}</div>
                  <div style={{ color: '#aaa' }}>Score</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#4caf50' }}>{review.time_complexity}</div>
                  <div style={{ color: '#aaa' }}>Time</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#ff9800' }}>{review.space_complexity}</div>
                  <div style={{ color: '#aaa' }}>Space</div>
                </div>
              </div>
              <p style={{ color: '#aaa', marginBottom: '12px' }}>{review.feedback}</p>
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <a href="/scorecard"><button className="btn btn-primary">View Final Scorecard →</button></a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Coding;
