import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { COMPANIES, ROUNDS } from '../utils/constants';
import ReactMarkdown from 'react-markdown';
import { FiArrowLeft, FiClock, FiMessageSquare, FiCode, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function ResultsPage() {
  const { sessionId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await dashboardAPI.getResult(sessionId);
        setResult(data);
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="loading-dots"><span></span><span></span><span></span></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="main-content" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h2>Result not found</h2>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Dashboard</Link>
      </div>
    );
  }

  const company = COMPANIES[result.company] || {};
  const round = ROUNDS[result.roundType] || {};
  const decision = result.finalDecision?.decision || 'unknown';
  const score = result.finalDecision?.overallScore || 0;

  const getScoreColor = (s) => {
    if (s >= 76) return 'var(--accent-success)';
    if (s >= 60) return 'var(--accent-warning)';
    return 'var(--accent-danger)';
  };

  const getDecisionLabel = (d) => {
    switch (d) {
      case 'hire': return 'HIRE ✅';
      case 'lean-hire': return 'LEAN HIRE ⚠️';
      case 'no-hire': return 'NO HIRE ❌';
      default: return d;
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: 900, margin: '0 auto' }}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        <FiArrowLeft /> Back to Dashboard
      </Link>

      {/* Decision Header */}
      <div className="card result-decision" style={{ borderLeft: `4px solid ${getScoreColor(score)}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>{company.logo}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{company.name} — {round.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{result.difficulty} difficulty</div>
          </div>
        </div>

        <div className="result-score-ring" style={{
          border: `4px solid ${getScoreColor(score)}`,
          color: getScoreColor(score)
        }}>
          {score}
        </div>

        <div className="result-decision-label">Final Decision</div>
        <div className={`result-decision-value ${decision}`}>
          {getDecisionLabel(decision)}
        </div>
      </div>

      {/* Timing Info */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <FiClock size={20} style={{ color: 'var(--accent-primary)' }} />
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Time Used</div>
            <div style={{ fontWeight: 700 }}>{Math.round(result.timing?.timeUsed / 60)} min</div>
          </div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <FiMessageSquare size={20} style={{ color: 'var(--accent-primary)' }} />
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Messages</div>
            <div style={{ fontWeight: 700 }}>{result.messageCount}</div>
          </div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <FiCode size={20} style={{ color: 'var(--accent-primary)' }} />
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Code Submissions</div>
            <div style={{ fontWeight: 700 }}>{result.codeSubmissions}</div>
          </div>
        </div>
      </div>

      {/* Section Breakdown */}
      {result.evaluation?.criteria && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <span className="card-title">📊 Section Breakdown</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(result.finalDecision?.sectionBreakdown || result.evaluation?.criteria || {}).map(([key, val]) => {
              if (!val || typeof val !== 'object') return null;
              const s = val.score || 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span style={{ fontWeight: 700, color: getScoreColor(s) }}>{s}/100</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s}%`, background: getScoreColor(s), borderRadius: 3, transition: 'width 1s ease' }} />
                  </div>
                  {val.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{val.notes}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title" style={{ color: 'var(--accent-success)' }}>💪 Strengths</span></div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(result.evaluation?.strengths || []).map((s, i) => (
              <li key={i} style={{ fontSize: 14, padding: '8px 12px', background: 'rgba(52, 211, 153, 0.05)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-success)' }}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title" style={{ color: 'var(--accent-danger)' }}>⚠️ Weaknesses</span></div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(result.evaluation?.weaknesses || []).map((w, i) => (
              <li key={i} style={{ fontSize: 14, padding: '8px 12px', background: 'rgba(248, 113, 113, 0.05)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-danger)' }}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missed Opportunities & Red Flags */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {result.evaluation?.missedOpportunities?.length > 0 && (
          <div className="card">
            <div className="card-header"><span className="card-title">💡 Missed Opportunities</span></div>
            <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
              {result.evaluation.missedOpportunities.map((m, i) => (
                <li key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 6 }}>{m}</li>
              ))}
            </ul>
          </div>
        )}
        {result.evaluation?.redFlags?.length > 0 && (
          <div className="card">
            <div className="card-header"><span className="card-title" style={{ color: 'var(--accent-danger)' }}>🚩 Red Flags</span></div>
            <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
              {result.evaluation.redFlags.map((r, i) => (
                <li key={i} style={{ fontSize: 14, color: 'var(--accent-danger)', marginBottom: 6 }}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed Reasoning */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><span className="card-title">📝 Detailed Reasoning</span></div>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          <ReactMarkdown>{result.finalDecision?.reasoning || 'No detailed reasoning available.'}</ReactMarkdown>
        </div>
        {result.finalDecision?.companyToneEvaluation && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>{company.name} Culture Fit Notes</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.finalDecision.companyToneEvaluation}</p>
          </div>
        )}
      </div>

      {/* Interview Transcript */}
      <div className="card" style={{ marginBottom: 40 }}>
        <div className="card-header" style={{ cursor: 'pointer' }} onClick={() => setShowTranscript(!showTranscript)}>
          <span className="card-title">💬 Interview Transcript</span>
          {showTranscript ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {showTranscript && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 500, overflowY: 'auto', paddingTop: 12 }}>
            {(result.transcript || []).map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`} style={{ maxWidth: '90%' }}>
                <div className="chat-message-meta">
                  {msg.role === 'interviewer' ? '🎤 Interviewer' : '👤 You'}
                </div>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
