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

  // Ref to accumulate final transcript chunks
  const accumulatedRef = useRef('');
  // Callback to deliver complete transcript to consumer
  const onCompleteRef = useRef(null);

  // Wire up voiceService callbacks
  useEffect(() => {
    voiceService.onSpeakStart = () => setIsSpeaking(true);
    voiceService.onSpeakEnd = () => setIsSpeaking(false);
    voiceService.onListenStart = () => {
      setIsListening(true);
      setInterimTranscript('');
      accumulatedRef.current = '';
    };
    voiceService.onListenEnd = () => {
      setIsListening(false);
      // Deliver accumulated transcript
      if (accumulatedRef.current.trim() && onCompleteRef.current) {
        onCompleteRef.current(accumulatedRef.current.trim());
        accumulatedRef.current = '';
      }
      setInterimTranscript('');
    };
    voiceService.onTranscript = (text) => setInterimTranscript(text);
    voiceService.onFinalTranscript = (text) => {
      accumulatedRef.current += ' ' + text;
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
    if (!sttEnabled) return;
    // Stop interviewer speech before listening
    voiceService.stopSpeaking();
    onCompleteRef.current = onComplete || null;
    voiceService.startListening();
  }, [sttEnabled]);

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
