import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { COMPANIES, ROUNDS, DIFFICULTIES } from '../utils/constants';
import { FiArrowRight, FiClock, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CompanyPage() {
  const [step, setStep] = useState(1); // 1: company, 2: round, 3: difficulty, 4: confirm
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const { startInterview, status } = useInterview();
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      await startInterview(selectedCompany, selectedRound, selectedDifficulty);
      navigate('/interview');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start interview');
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 40, padding: '20px 0' }}>
        {['Company', 'Round', 'Difficulty', 'Begin'].map((label, i) => (
          <React.Fragment key={label}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
              background: step > i ? 'var(--accent-primary)' : step === i + 1 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)',
              color: step >= i + 1 ? 'white' : 'var(--text-muted)'
            }}>{i + 1}</div>
            <span style={{ fontSize: 13, color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: step === i + 1 ? 600 : 400 }}>{label}</span>
            {i < 3 && <div style={{ width: 40, height: 2, background: step > i + 1 ? 'var(--accent-primary)' : 'var(--border-color)' }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Company Selection */}
      {step === 1 && (
        <>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Select Company</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 32 }}>Each company has unique interview culture and evaluation criteria</p>
          <div className="company-grid">
            {Object.entries(COMPANIES).map(([key, company]) => (
              <div
                key={key}
                className={`card company-card company-${key}`}
                style={{ cursor: 'pointer', border: selectedCompany === key ? `2px solid ${company.color}` : undefined }}
                onClick={() => { setSelectedCompany(key); setStep(2); }}
              >
                <div className="company-card-accent" style={{ background: company.color }} />
                <div style={{ padding: '12px 0' }}>
                  <div className="company-card-logo">{company.logo}</div>
                  <div className="company-card-name">{company.name}</div>
                  <div className="company-card-desc">{company.tagline}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 2: Round Selection */}
      {step === 2 && (
        <>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
            {COMPANIES[selectedCompany].logo} {COMPANIES[selectedCompany].name} — Select Round
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 32 }}>Choose the type of interview round</p>
          <div className="round-grid">
            {Object.entries(ROUNDS).map(([key, round]) => (
              <div
                key={key}
                className={`card round-card ${selectedRound === key ? 'selected' : ''}`}
                style={{ padding: 28, cursor: 'pointer' }}
                onClick={() => { setSelectedRound(key); setStep(3); }}
              >
                <div className="round-card-icon">{round.icon}</div>
                <div className="round-card-name">{round.name}</div>
                <div className="round-card-duration"><FiClock size={12} /> {round.duration}</div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{round.description}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
          </div>
        </>
      )}

      {/* Step 3: Difficulty Selection */}
      {step === 3 && (
        <>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Select Difficulty</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 32 }}>
            {COMPANIES[selectedCompany].name} — {ROUNDS[selectedRound].name}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 32 }}>
            {Object.entries(DIFFICULTIES).map(([key, diff]) => (
              <div
                key={key}
                className="card"
                style={{
                  padding: '32px 40px', textAlign: 'center', cursor: 'pointer', minWidth: 160,
                  border: selectedDifficulty === key ? `2px solid ${diff.color}` : undefined
                }}
                onClick={() => setSelectedDifficulty(key)}
              >
                <div style={{ fontSize: 24, fontWeight: 700, color: diff.color, marginBottom: 4 }}>{diff.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {key === 'easy' ? 'Warm-up level' : key === 'medium' ? 'Standard interview' : 'Top-bar difficulty'}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ marginRight: 12 }}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(4)}>Continue <FiArrowRight /></button>
          </div>
        </>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>Ready to Begin?</h2>
          <div className="card" style={{ maxWidth: 500, margin: '0 auto', padding: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Company</span>
                <span style={{ fontWeight: 700 }}>{COMPANIES[selectedCompany].logo} {COMPANIES[selectedCompany].name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Round</span>
                <span style={{ fontWeight: 700 }}>{ROUNDS[selectedRound].icon} {ROUNDS[selectedRound].name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Difficulty</span>
                <span style={{ fontWeight: 700, color: DIFFICULTIES[selectedDifficulty].color }}>{DIFFICULTIES[selectedDifficulty].name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Duration</span>
                <span style={{ fontWeight: 700 }}>{ROUNDS[selectedRound].duration}</span>
              </div>
            </div>

            <div style={{ margin: '24px 0', padding: 16, background: 'rgba(251, 191, 36, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--accent-warning)', fontWeight: 600, fontSize: 14 }}>
                <FiAlertTriangle /> Interview Rules
              </div>
              <ul style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 20, lineHeight: 1.8 }}>
                <li>Timer starts immediately — no pausing</li>
                <li>No hints or solutions will be revealed</li>
                <li>Previous answers cannot be edited</li>
                <li>Auto-submit when time expires</li>
                <li>Think aloud — the AI evaluates your process</li>
                <li>This is a simulation — treat it like a real interview</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setStep(3)}>← Back</button>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleStart}
                disabled={status === 'starting'}
              >
                {status === 'starting' ? 'Starting...' : 'Begin Interview'} <FiArrowRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
