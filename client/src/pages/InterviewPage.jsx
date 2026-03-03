import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { COMPANIES, ROUNDS } from '../utils/constants';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { FiSend, FiCode, FiStopCircle, FiClock, FiAlertTriangle, FiMaximize2 } from 'react-icons/fi';

export default function InterviewPage() {
  const {
    session, messages, isLoading, timeRemaining, timeWarning,
    status, evaluation, sendMessage, submitCode, endInterview, resetInterview
  } = useInterview();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [code, setCode] = useState('// Write your solution here\n\n');
  const [language, setLanguage] = useState('javascript');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Redirect if no active session
  useEffect(() => {
    if (status === 'idle' && !session) {
      navigate('/companies');
    }
  }, [status, session, navigate]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show time warning
  useEffect(() => {
    if (timeWarning) {
      toast(timeWarning, { icon: '⏰', duration: 5000 });
    }
  }, [timeWarning]);

  // Navigate to results when completed
  useEffect(() => {
    if (status === 'completed' && evaluation) {
      navigate(`/results/${session.sessionId}`);
    }
  }, [status, evaluation, session, navigate]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    try {
      await sendMessage(msg);
    } catch {
      toast.error('Failed to send message');
    }
    inputRef.current?.focus();
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) return;
    try {
      await submitCode(code, language);
      toast.success('Code submitted for review');
    } catch {
      toast.error('Failed to submit code');
    }
  };

  const handleEndInterview = async () => {
    setShowEndConfirm(false);
    try {
      await endInterview();
    } catch {
      toast.error('Failed to end interview');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeRemaining <= 60) return 'timer timer-danger';
    if (timeRemaining <= 300) return 'timer timer-warning';
    return 'timer timer-normal';
  };

  if (!session) return null;

  const company = COMPANIES[session.company] || {};
  const round = ROUNDS[session.roundType] || {};
  const isDSA = session.roundType === 'dsa';

  return (
    <div className="interview-room">
      {/* Header */}
      <div className="interview-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 20 }}>{company.logo}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{company.name} — {round.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Interviewer: {session.interviewerName}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className={getTimerClass()}>
            <FiClock size={16} />
            {formatTime(timeRemaining)}
          </div>

          {status === 'in-progress' && (
            <button className="btn btn-danger btn-sm" onClick={() => setShowEndConfirm(true)}>
              <FiStopCircle /> End Interview
            </button>
          )}

          {status === 'ending' && (
            <span style={{ color: 'var(--accent-warning)', fontSize: 13, fontWeight: 600 }}>
              Evaluating...
            </span>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="interview-chat-panel">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              {msg.role !== 'system' && (
                <div className="chat-message-meta">
                  {msg.role === 'interviewer' ? `🎤 ${session.interviewerName}` : '👤 You'}
                  {msg.metadata?.isFollowUp && <span className="tag tag-dsa" style={{ fontSize: 10, padding: '1px 6px' }}>Follow-up</span>}
                  {msg.metadata?.isProbing && <span className="tag tag-behavioral" style={{ fontSize: 10, padding: '1px 6px' }}>Probing</span>}
                </div>
              )}
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message interviewer">
              <div className="chat-message-meta">🎤 {session.interviewerName}</div>
              <div className="loading-dots"><span></span><span></span><span></span></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
            💡 Think aloud — explain your reasoning as you go
          </div>
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder={isLoading ? 'Waiting for interviewer...' : 'Type your response... (Enter to send, Shift+Enter for new line)'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || status !== 'in-progress'}
              rows={2}
            />
            <button
              className="btn btn-primary"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading || status !== 'in-progress'}
              style={{ alignSelf: 'flex-end' }}
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>

      {/* Code Panel (DSA) or Notes Panel */}
      <div className="interview-code-panel">
        <div className="interview-code-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiCode size={16} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{isDSA ? 'Code Editor' : 'Notes & Design'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isDSA && (
              <select
                className="input"
                style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="typescript">TypeScript</option>
                <option value="go">Go</option>
              </select>
            )}
            {isDSA && status === 'in-progress' && (
              <button className="btn btn-success btn-sm" onClick={handleSubmitCode} disabled={isLoading}>
                <FiCode /> Submit Code
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            language={isDSA ? language : 'markdown'}
            theme="vs-dark"
            value={code}
            onChange={value => setCode(value || '')}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              readOnly: status !== 'in-progress'
            }}
          />
        </div>
      </div>

      {/* End Interview Confirmation Modal */}
      {showEndConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: 400, padding: 32, textAlign: 'center' }}>
            <FiAlertTriangle size={32} style={{ color: 'var(--accent-warning)', marginBottom: 16 }} />
            <h3 style={{ marginBottom: 8 }}>End Interview?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
              This will submit your interview for evaluation. You cannot continue after this. Are you sure?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowEndConfirm(false)}>Continue Interview</button>
              <button className="btn btn-danger" onClick={handleEndInterview}>End & Evaluate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
