import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Interview() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const messagesEndRef = useRef(null);

  const resumeSummary = localStorage.getItem('resume_summary') || '';

  useEffect(() => {
    startInterview();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://nexthire-backend-1byv.onrender.com/interview/start', {
        message: 'Hello, I am ready for the interview.',
        history: [],
        resume_summary: resumeSummary
      });
      setMessages([{ role: 'assistant', content: response.data.response }]);
    } catch (error) {
      toast.error('Failed to start interview!');
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/interview/start', {
        message: input,
        history: newMessages,
        resume_summary: resumeSummary
      });
      setMessages([...newMessages, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      toast.error('Something went wrong!');
    }
    setLoading(false);
  };

  const finishInterview = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/interview/evaluate', {
        message: '',
        history: messages
      });
      const parsed = JSON.parse(response.data.evaluation);
      setEvaluation(parsed);
      localStorage.setItem('communication_score', parsed.communication_score);
      localStorage.setItem('technical_score', parsed.technical_score);
      setFinished(true);
      toast.success('Interview completed!');
    } catch (error) {
      toast.error('Failed to evaluate!');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 style={{ marginBottom: '8px' }}>AI Interview</h1>
      <p style={{ color: '#aaa', marginBottom: '32px' }}>Answer the questions naturally — just like a real interview</p>

      <div className="card" style={{ height: '450px', overflowY: 'auto', marginBottom: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: msg.role === 'user' ? '#6c63ff' : '#2a2a2a',
              color: '#fff',
              fontSize: '15px',
              lineHeight: '1.5'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: '#aaa', fontStyle: 'italic' }}>Interviewer is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!finished ? (
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your answer here..."
            disabled={loading}
          />
          <button className="btn btn-primary" onClick={sendMessage} disabled={loading}>Send</button>
          <button className="btn btn-secondary" onClick={finishInterview} disabled={loading}>Finish</button>
        </div>
      ) : (
        evaluation && (
          <div>
            <div className="card">
              <h2 style={{ marginBottom: '16px' }}>Interview Results</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#6c63ff' }}>{evaluation.score}</div>
                  <div style={{ color: '#aaa' }}>Overall</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#4caf50' }}>{evaluation.communication_score}</div>
                  <div style={{ color: '#aaa' }}>Communication</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#ff9800' }}>{evaluation.technical_score}</div>
                  <div style={{ color: '#aaa' }}>Technical</div>
                </div>
              </div>
              <p style={{ color: '#aaa' }}>{evaluation.feedback}</p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <a href="/coding"><button className="btn btn-primary">Start Coding Round →</button></a>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Interview;