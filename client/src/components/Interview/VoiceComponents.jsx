import React from 'react';
import { useVoice } from '../../context/VoiceContext';
import { FiMic, FiMicOff, FiVolume2, FiVolumeX } from 'react-icons/fi';

/**
 * Animated waveform indicator shown when interviewer is speaking
 */
export function SpeakingIndicator({ name }) {
  return (
    <div className="voice-speaking-indicator">
      <div className="voice-waveform">
        <span className="voice-bar" /><span className="voice-bar" />
        <span className="voice-bar" /><span className="voice-bar" />
        <span className="voice-bar" />
      </div>
      <span className="voice-speaking-label">🎤 {name || 'Interviewer'} is speaking…</span>
    </div>
  );
}

/**
 * Animated pulse indicator shown when microphone is active
 */
export function ListeningIndicator() {
  const { interimTranscript } = useVoice();

  return (
    <div className="voice-listening-indicator">
      <div className="voice-pulse-ring" />
      <FiMic size={18} className="voice-mic-active-icon" />
      {interimTranscript && (
        <span className="voice-interim-text">{interimTranscript}</span>
      )}
    </div>
  );
}

/**
 * Microphone toggle button for the chat input area
 */
export function MicButton({ onTranscript }) {
  const { isListening, toggleListening, sttSupported, sttEnabled, isSpeaking, stopSpeaking } = useVoice();

  // Always show the button — show unsupported state if needed
  const handleClick = () => {
    if (!sttSupported) {
      alert('Speech-to-Text requires Chrome or Edge browser.\n\nPlease open this page in Chrome for microphone support.');
      return;
    }
    // If interviewer is speaking, stop TTS first then start listening
    if (isSpeaking) {
      stopSpeaking();
    }
    toggleListening(onTranscript);
  };

  return (
    <button
      className={`btn voice-mic-btn ${isListening ? 'voice-mic-btn-active' : 'btn-secondary'}`}
      onClick={handleClick}
      disabled={!sttEnabled}
      title={
        !sttSupported ? 'Mic requires Chrome/Edge — click for details'
        : isListening ? 'Stop listening'
        : isSpeaking ? 'Click to interrupt interviewer and speak'
        : 'Click to speak your answer'
      }
      type="button"
    >
      <FiMic size={18} />
      {!isListening && <span style={{ fontSize: 12, marginLeft: 4 }}>{isSpeaking ? 'Interrupt' : 'Speak'}</span>}
    </button>
  );
}

/**
 * Inline speaker button to replay a specific message
 */
export function SpeakMessageButton({ text, company }) {
  const { speakManual, isSpeaking, stopSpeaking, ttsSupported, ttsEnabled } = useVoice();

  if (!ttsSupported || !ttsEnabled) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakManual(text, company);
    }
  };

  return (
    <button
      className="voice-speak-msg-btn"
      onClick={handleClick}
      title={isSpeaking ? 'Stop' : 'Listen to this message'}
      type="button"
    >
      {isSpeaking ? <FiVolumeX size={13} /> : <FiVolume2 size={13} />}
    </button>
  );
}

/**
 * Voice settings panel (shown in interview header or settings)
 */
export function VoiceSettings({ compact = false }) {
  const {
    ttsEnabled, sttEnabled, autoSpeak, volume,
    setTtsEnabled, setSttEnabled, setAutoSpeak, setVolume,
    ttsSupported, sttSupported
  } = useVoice();

  if (!ttsSupported && !sttSupported) {
    return (
      <div className="voice-settings-unsupported">
        Voice features require Chrome, Edge, or Safari.
      </div>
    );
  }

  if (compact) {
    return (
      <div className="voice-settings-compact">
        {ttsSupported && (
          <button
            className={`btn btn-sm ${autoSpeak ? 'voice-toggle-on' : 'btn-secondary'}`}
            onClick={() => setAutoSpeak(!autoSpeak)}
            title={autoSpeak ? 'Interviewer voice ON' : 'Interviewer voice OFF'}
          >
            {autoSpeak ? <FiVolume2 size={14} /> : <FiVolumeX size={14} />}
          </button>
        )}
        {sttSupported && (
          <button
            className={`btn btn-sm ${sttEnabled ? 'voice-toggle-on' : 'btn-secondary'}`}
            onClick={() => setSttEnabled(!sttEnabled)}
            title={sttEnabled ? 'Microphone enabled' : 'Microphone disabled'}
          >
            {sttEnabled ? <FiMic size={14} /> : <FiMicOff size={14} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="voice-settings">
      <div className="voice-settings-title">🎙️ Voice Settings</div>

      {ttsSupported && (
        <div className="voice-setting-row">
          <label className="voice-setting-label">
            <input type="checkbox" checked={ttsEnabled} onChange={e => setTtsEnabled(e.target.checked)} />
            Interviewer Voice (Text-to-Speech)
          </label>
        </div>
      )}

      {ttsSupported && ttsEnabled && (
        <>
          <div className="voice-setting-row">
            <label className="voice-setting-label">
              <input type="checkbox" checked={autoSpeak} onChange={e => setAutoSpeak(e.target.checked)} />
              Auto-speak interviewer messages
            </label>
          </div>
          <div className="voice-setting-row">
            <label className="voice-setting-label">Volume</label>
            <input
              type="range" min="0" max="1" step="0.1"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="voice-volume-slider"
            />
          </div>
        </>
      )}

      {sttSupported && (
        <div className="voice-setting-row">
          <label className="voice-setting-label">
            <input type="checkbox" checked={sttEnabled} onChange={e => setSttEnabled(e.target.checked)} />
            Microphone Input (Speech-to-Text)
          </label>
        </div>
      )}

      <div className="voice-setting-hint">
        Uses your browser's built-in speech engine. No data is sent to external servers.
      </div>
    </div>
  );
}
