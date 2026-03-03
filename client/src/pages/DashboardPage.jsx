import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { COMPANIES, ROUNDS } from '../utils/constants';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FiTrendingUp, FiAward, FiTarget, FiBarChart2, FiArrowRight } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend, Filler);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: dashData } = await dashboardAPI.getOverview();
        setData(dashData);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="loading-dots"><span></span><span></span><span></span></div>
      </div>
    );
  }

  if (!data || data.overview.totalInterviews === 0) {
    return (
      <div className="main-content" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>No Interview Data Yet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Complete your first mock interview to see analytics here.</p>
        <Link to="/companies" className="btn btn-primary">Start Your First Interview <FiArrowRight /></Link>
      </div>
    );
  }

  const { overview, companyPerformance, roundPerformance, topicWeaknesses, scoreHistory, recentSessions } = data;

  // Score trend chart
  const trendChart = {
    labels: scoreHistory.map(s => new Date(s.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Score',
      data: scoreHistory.map(s => s.score),
      borderColor: '#818cf8',
      backgroundColor: 'rgba(129, 140, 248, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: scoreHistory.map(s =>
        s.decision === 'hire' ? '#34d399' : s.decision === 'lean-hire' ? '#fbbf24' : '#f87171'
      )
    }]
  };

  // Decision distribution chart
  const decisionChart = {
    labels: ['Hire', 'Lean Hire', 'No Hire'],
    datasets: [{
      data: [overview.decisions.hire, overview.decisions.leanHire, overview.decisions.noHire],
      backgroundColor: ['rgba(52, 211, 153, 0.8)', 'rgba(251, 191, 36, 0.8)', 'rgba(248, 113, 113, 0.8)'],
      borderWidth: 0
    }]
  };

  // Round performance chart
  const roundChart = {
    labels: Object.keys(roundPerformance).map(r => ROUNDS[r]?.name || r),
    datasets: [{
      label: 'Avg Score',
      data: Object.values(roundPerformance).map(r => r.avgScore),
      backgroundColor: ['rgba(96, 165, 250, 0.6)', 'rgba(52, 211, 153, 0.6)', 'rgba(167, 139, 250, 0.6)', 'rgba(251, 191, 36, 0.6)'],
      borderWidth: 0,
      borderRadius: 6
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b6b80' } },
      x: { grid: { display: false }, ticks: { color: '#6b6b80' } }
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>📊 Dashboard</h1>
        <Link to="/companies" className="btn btn-primary btn-sm">New Interview <FiArrowRight /></Link>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-value">{overview.totalInterviews}</div>
          <div className="stat-label">Total Interviews</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{overview.avgScore}</div>
          <div className="stat-label">Average Score</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-success)', WebkitTextFillColor: 'var(--accent-success)' }}>
            {overview.decisions.hire}
          </div>
          <div className="stat-label">Hire Decisions</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ fontSize: 20, WebkitTextFillColor: 'var(--text-primary)' }}>
            {overview.bestCompany ? COMPANIES[overview.bestCompany]?.logo + ' ' + COMPANIES[overview.bestCompany]?.name : '—'}
          </div>
          <div className="stat-label">Best Performance</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title"><FiTrendingUp size={18} /> Score Trend</span>
          </div>
          <div style={{ height: 280 }}>
            <Line data={trendChart} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title"><FiTarget size={18} /> Decisions</span>
          </div>
          <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={decisionChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#a0a0b8', padding: 16 } } } }} />
          </div>
        </div>
      </div>

      {/* Round Performance */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title"><FiBarChart2 size={18} /> Performance by Round</span>
          </div>
          <div style={{ height: 250 }}>
            <Bar data={roundChart} options={chartOptions} />
          </div>
        </div>

        {/* Topic Weaknesses Heatmap */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🔥 Weak Topics</span>
          </div>
          {Object.keys(topicWeaknesses).length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(topicWeaknesses)
                .sort((a, b) => b[1] - a[1])
                .map(([topic, count]) => (
                  <div key={topic} style={{
                    padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                    background: `rgba(248, 113, 113, ${Math.min(0.1 + count * 0.15, 0.8)})`,
                    color: '#f87171', fontSize: 13, fontWeight: 600
                  }}>
                    {topic} ({count})
                  </div>
                ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No weak topics identified yet</p>
          )}
        </div>
      </div>

      {/* Company Performance */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title"><FiAward size={18} /> Company Performance</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {Object.entries(companyPerformance).map(([company, perf]) => (
            <div key={company} className={`card company-${company}`} style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{COMPANIES[company]?.logo}</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{COMPANIES[company]?.name}</div>
              <div className={`score-badge ${perf.avgScore >= 70 ? 'score-high' : perf.avgScore >= 50 ? 'score-mid' : 'score-low'}`}
                style={{ margin: '0 auto', marginBottom: 8 }}>
                {perf.avgScore}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{perf.total} interviews</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">📋 Recent Interviews</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Company</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Round</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Difficulty</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Score</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Decision</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map(s => (
                <tr key={s.sessionId} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                  onClick={() => window.location.href = `/results/${s.sessionId}`}>
                  <td style={{ padding: '12px' }}>
                    <span>{COMPANIES[s.company]?.logo} {COMPANIES[s.company]?.name}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`tag tag-${s.roundType}`}>{ROUNDS[s.roundType]?.name}</span>
                  </td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>{s.difficulty}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>{s.score}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span className={`tag tag-${s.decision}`}>{s.decision?.replace('-', ' ').toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-muted)', fontSize: 13 }}>
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
