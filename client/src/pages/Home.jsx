import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COMPANIES, ROUNDS } from '../utils/constants';
import { FiArrowRight, FiTarget, FiClock, FiMessageSquare, FiBarChart2 } from 'react-icons/fi';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="main-content">
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
          <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HireSense AI
          </span>
        </h1>
        <p style={{ fontSize: 20, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.6 }}>
          The most realistic AI-powered mock interview platform.
          Experience FAANG-level interviews with strict evaluation, dynamic follow-ups, and real hiring decisions.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {isAuthenticated ? (
            <Link to="/companies" className="btn btn-primary btn-lg">
              Start Interview <FiArrowRight />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free <FiArrowRight /></Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '40px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { icon: <FiTarget size={24} />, title: 'Company-Specific', desc: 'Interviews tailored to Google, Amazon, Meta, Microsoft, Apple, and Netflix — each with unique culture and evaluation.' },
            { icon: <FiClock size={24} />, title: 'Timed & Pressured', desc: 'Real countdown timers, auto-submission, and time warnings. Feel the pressure of a real interview.' },
            { icon: <FiMessageSquare size={24} />, title: 'Dynamic AI Interviewer', desc: 'Follow-up questions, interruptions, difficulty escalation, and probing — just like a real human interviewer.' },
            { icon: <FiBarChart2 size={24} />, title: 'Strict Evaluation', desc: 'Hire / Lean Hire / No Hire decisions with section-wise scoring, red flags, and company-tone feedback.' },
          ].map((feat, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ color: 'var(--accent-primary)', marginBottom: 12 }}>{feat.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{feat.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Companies */}
      <section style={{ padding: '40px 0' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
          Simulate Interviews From
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 24 }}>
          {Object.entries(COMPANIES).map(([key, c]) => (
            <div key={key} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '20px 24px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)',
              border: '1px solid var(--border-color)', minWidth: 120
            }}>
              <span style={{ fontSize: 32 }}>{c.logo}</span>
              <span style={{ fontWeight: 700 }}>{c.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>{c.tagline}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Rounds */}
      <section style={{ padding: '40px 0 80px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
          Interview Rounds
        </h2>
        <div className="round-grid" style={{ maxWidth: 900, margin: '0 auto' }}>
          {Object.entries(ROUNDS).map(([key, r]) => (
            <div key={key} className="card round-card" style={{ padding: 24 }}>
              <div className="round-card-icon">{r.icon}</div>
              <div className="round-card-name">{r.name}</div>
              <div className="round-card-duration">{r.duration}</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{r.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
