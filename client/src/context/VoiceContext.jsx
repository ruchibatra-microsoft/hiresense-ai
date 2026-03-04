import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import voiceService from '../services/voiceService';

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [sttEnabled, setSttEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const [error, setError] = useState(null);

  // Callback to deliver transcript chunks to consumer (e.g., InterviewPage input)
  const onCompleteRef = useRef(null);

  // Wire up voiceService callbacks
  useEffect(() => {
    voiceService.onSpeakStart = () => setIsSpeaking(true);
    voiceService.onSpeakEnd = () => setIsSpeaking(false);
    voiceService.onListenStart = () => {
      setIsListening(true);
      setInterimTranscript('');
    };
    voiceService.onListenEnd = () => {
      setIsListening(false);
      // Do NOT re-deliver here — onFinalTranscript already delivers in real-time
      // Just clean up
      setInterimTranscript('');
    };
    voiceService.onTranscript = (text) => setInterimTranscript(text);
    voiceService.onFinalTranscript = (text) => {
      // Deliver each final chunk IMMEDIATELY to the input
      if (text.trim() && onCompleteRef.current) {
        onCompleteRef.current(text.trim());
      }
      setInterimTranscript('');
    };
    voiceService.onError = (msg) => {
      setError(msg);
      setTimeout(() => setError(null), 5000);
    };

    return () => voiceService.destroy();
  }, []);

  // Sync settings to voiceService
  useEffect(() => { voiceService.ttsEnabled = ttsEnabled; }, [ttsEnabled]);
  useEffect(() => { voiceService.sttEnabled = sttEnabled; }, [sttEnabled]);
  useEffect(() => { voiceService.autoSpeak = autoSpeak; }, [autoSpeak]);
  useEffect(() => { voiceService.volume = volume; }, [volume]);

  /**
   * Speak text as the interviewer
   */
  const speak = useCallback((text, company) => {
    if (!ttsEnabled || !autoSpeak) return Promise.resolve();
    return voiceService.speak(text, company);
  }, [ttsEnabled, autoSpeak]);

  /**
   * Manually trigger TTS (even if autoSpeak is off)
   */
  const speakManual = useCallback((text, company) => {
    if (!ttsEnabled) return Promise.resolve();
    return voiceService.speak(text, company);
  }, [ttsEnabled]);

  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
  }, []);

  /**
   * Start microphone listening
   * @param {Function} onComplete — called with final transcript when listening stops
   */
  const startListening = useCallback((onComplete) => {
    // Stop interviewer speech before listening
    voiceService.stopSpeaking();
    setIsSpeaking(false);
    onCompleteRef.current = onComplete || null;
    voiceService.startListening();
  }, []);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
  }, []);

  const toggleListening = useCallback((onComplete) => {
    if (isListening) {
      stopListening();
    } else {
      startListening(onComplete);
    }
  }, [isListening, startListening, stopListening]);

  return (
    <VoiceContext.Provider value={{
      // State
      isSpeaking,
      isListening,
      interimTranscript,
      ttsEnabled,
      sttEnabled,
      autoSpeak,
      volume,
      error,
      // Feature detection
      ttsSupported: voiceService.ttsSupported,
      sttSupported: voiceService.sttSupported,
      // Actions
      speak,
      speakManual,
      stopSpeaking,
      startListening,
      stopListening,
      toggleListening,
      // Settings
      setTtsEnabled,
      setSttEnabled,
      setAutoSpeak,
      setVolume,
    }}>
      {children}
    </VoiceContext.Provider>
  );
}

export const useVoice = () => {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoice must be used within VoiceProvider');
  return ctx;
};
