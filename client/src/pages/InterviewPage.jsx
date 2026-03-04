import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { COMPANIES, ROUNDS } from '../utils/constants';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { FiSend, FiCode, FiStopCircle, FiClock, FiAlertTriangle, FiMaximize2, FiVolume2, FiVolumeX, FiMic } from 'react-icons/fi';
import { useVoice } from '../context/VoiceContext';
import { MicButton, SpeakingIndicator, ListeningIndicator, SpeakMessageButton, VoiceSettings } from '../components/Interview/VoiceComponents';

/**
 * Prominent voice controls in the interview header
 */
function VoiceHeaderControls({ isSpeaking, stopSpeaking, session, messages }) {
  const { autoSpeak, setAutoSpeak, speakManual, ttsSupported } = useVoice();

  if (!ttsSupported) return null;

  const handleToggleSpeaker = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      setAutoSpeak(!autoSpeak);
    }
  };

  const handleReplayLast = () => {
    // Find last interviewer message and speak it
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'interviewer') {
        speakManual(messages[i].content, session?.company);
        break;
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* Speaker ON/OFF toggle */}
      <button
        className={`btn btn-sm ${autoSpeak ? 'voice-toggle-on' : 'btn-secondary'}`}
        onClick={handleToggleSpeaker}
        title={isSpeaking ? 'Stop speaking' : autoSpeak ? 'Auto-speak ON (click to turn OFF)' : 'Auto-speak OFF (click to turn ON)'}
      >
        {isSpeaking ? <FiVolumeX size={15} /> : autoSpeak ? <FiVolume2 size={15} /> : <FiVolumeX size={15} />}
        <span style={{ fontSize: 12 }}>{isSpeaking ? 'Stop' : autoSpeak ? 'Speaker ON' : 'Speaker OFF'}</span>
      </button>

      {/* Replay last message button */}
      {!isSpeaking && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleReplayLast}
          title="Replay last interviewer message"
        >
          🔊
        </button>
      )}

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="voice-waveform" style={{ marginLeft: 4 }}>
          <span className="voice-bar" /><span className="voice-bar" />
          <span className="voice-bar" /><span className="voice-bar" />
        </div>
      )}
    </div>
  );
}

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
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { speak, isSpeaking, isListening, stopSpeaking, stopListening, interimTranscript, autoSpeak, setAutoSpeak, ttsSupported, sttSupported, speakManual } = useVoice();
  const lastSpokenIdx = useRef(-1);

  // Auto-speak new interviewer messages
  useEffect(() => {
    if (!session || !autoSpeak) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'interviewer' && messages.length - 1 > lastSpokenIdx.current) {
      lastSpokenIdx.current = messages.length - 1;
      speak(lastMsg.content, session.company);
    }
  }, [messages, session, speak, autoSpeak]);

  // Stop voice when interview ends
  useEffect(() => {
    if (status === 'completed' || status === 'ending') {
      stopSpeaking();
      stopListening();
    }
  }, [status, stopSpeaking, stopListening]);

  // Show interim transcript in input while listening
  useEffect(() => {
    if (isListening && interimTranscript) {
      // Show live transcript as a preview (don't replace typed text)
    }
  }, [isListening, interimTranscript]);

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
    // Stop listening/speaking when sending
    stopSpeaking();
    stopListening();
    const msg = input.trim();
    setInput('');
    try {
      await sendMessage(msg);
    } catch {
      toast.error('Failed to send message');
    }
    inputRef.current?.focus();
  }, [input, isLoading, sendMessage, stopSpeaking, stopListening]);

  // Handle completed voice transcript
  const handleVoiceTranscript = useCallback((transcript) => {
    if (transcript.trim()) {
      setInput(prev => (prev ? prev + ' ' : '') + transcript);
      inputRef.current?.focus();
    }
  }, []);

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Prominent voice controls */}
          <VoiceHeaderControls
            isSpeaking={isSpeaking}
            stopSpeaking={stopSpeaking}
            session={session}
            messages={messages}
          />

          {/* Voice settings dropdown */}
          {(ttsSupported || sttSupported) && (
            <div style={{ position: 'relative' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowVoiceSettings(!showVoiceSettings)} title="Voice Settings">
                ⚙️
              </button>
              {showVoiceSettings && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, zIndex: 50, width: 280 }}>
                  <div className="card" style={{ padding: 16 }}>
                    <VoiceSettings />
                  </div>
                </div>
              )}
            </div>
          )}

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
                  {msg.role === 'interviewer' && (
                    <SpeakMessageButton text={msg.content} company={session.company} />
                  )}
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

          {isSpeaking && (
            <SpeakingIndicator name={session.interviewerName} />
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          {isListening && <ListeningIndicator />}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
            💡 Think aloud — explain your reasoning as you go
            {sttSupported && <span style={{ marginLeft: 8 }}>| 🎙️ Click mic to speak</span>}
          </div>
          <div className="chat-input-wrapper">
            <MicButton onTranscript={handleVoiceTranscript} />
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder={isListening ? '🎙️ Listening... speak your answer' : isLoading ? 'Waiting for interviewer...' : 'Type your response... (Enter to send, Shift+Enter for new line)'}
              value={isListening ? (input + (interimTranscript ? ' ' + interimTranscript : '')) : input}
              onChange={e => { if (!isListening) setInput(e.target.value); }}
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
