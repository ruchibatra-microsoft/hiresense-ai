/**
 * HireSense AI — Voice Service
 *
 * Wraps the Web Speech API for:
 *   • Text-to-Speech (TTS) — interviewer reads messages aloud
 *   • Speech-to-Text (STT) — candidate speaks answers via microphone
 *
 * Uses ONLY browser-native APIs — no external keys or services needed.
 * Works in Chrome, Edge, Safari. Firefox has partial support.
 *
 * Each company interviewer gets a distinct voice profile so they
 * sound different (pitch, rate, voice selection).
 */

// ─── Company-specific voice profiles ───
const VOICE_PROFILES = {
  google: { name: 'Priya', pitch: 1.05, rate: 0.95, preferredVoice: ['Google UK English Female', 'Microsoft Zira', 'Samantha', 'Karen'] },
  amazon: { name: 'Marcus', pitch: 0.9, rate: 1.0, preferredVoice: ['Google US English', 'Microsoft David', 'Alex', 'Daniel'] },
  microsoft: { name: 'Sarah', pitch: 1.1, rate: 0.92, preferredVoice: ['Microsoft Zira', 'Google UK English Female', 'Samantha', 'Karen'] },
  meta: { name: 'Alex', pitch: 0.95, rate: 1.08, preferredVoice: ['Google US English', 'Microsoft David', 'Alex', 'Daniel'] },
  apple: { name: 'James', pitch: 0.85, rate: 0.9, preferredVoice: ['Daniel', 'Google UK English Male', 'Microsoft Mark', 'Alex'] },
  netflix: { name: 'Jordan', pitch: 1.0, rate: 0.95, preferredVoice: ['Google US English', 'Alex', 'Microsoft David', 'Daniel'] },
};

class VoiceService {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.recognition = null;
    this.voices = [];
    this.isSpeaking = false;
    this.isListening = false;
    this.currentUtterance = null;

    // Callbacks
    this.onSpeakStart = null;
    this.onSpeakEnd = null;
    this.onListenStart = null;
    this.onListenEnd = null;
    this.onTranscript = null;        // interim results
    this.onFinalTranscript = null;   // final result
    this.onError = null;

    // Settings
    this.ttsEnabled = true;
    this.sttEnabled = true;
    this.volume = 1.0;
    this.autoSpeak = true;

    this._loadVoices();
  }

  // ═══════════════════════════════════════════
  // Feature Detection
  // ═══════════════════════════════════════════

  get ttsSupported() {
    return !!this.synth;
  }

  get sttSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  // ═══════════════════════════════════════════
  // Text-to-Speech (Interviewer speaks)
  // ═══════════════════════════════════════════

  _loadVoices() {
    if (!this.synth) return;

    const load = () => {
      this.voices = this.synth.getVoices();
    };

    load();
    // Chrome loads voices async
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = load;
    }
  }

  _pickVoice(company) {
    if (this.voices.length === 0) {
      this.voices = this.synth?.getVoices() || [];
    }

    const profile = VOICE_PROFILES[company] || VOICE_PROFILES.google;

    // Try to match preferred voices
    for (const preferred of profile.preferredVoice) {
      const match = this.voices.find(v =>
        v.name.includes(preferred) || v.voiceURI.includes(preferred)
      );
      if (match) return match;
    }

    // Fall back to first English voice
    const english = this.voices.find(v => v.lang.startsWith('en'));
    return english || this.voices[0] || null;
  }

  /**
   * Speak text aloud as the interviewer
   */
  speak(text, company = 'google') {
    if (!this.synth || !this.ttsEnabled || !text) return Promise.resolve();

    // Stop any current speech
    this.stopSpeaking();

    return new Promise((resolve) => {
      // Clean text for speech (remove markdown, code blocks, etc.)
      const cleanText = this._cleanForSpeech(text);

      const profile = VOICE_PROFILES[company] || VOICE_PROFILES.google;
      const utterance = new SpeechSynthesisUtterance(cleanText);

      utterance.voice = this._pickVoice(company);
      utterance.pitch = profile.pitch;
      utterance.rate = profile.rate;
      utterance.volume = this.volume;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentUtterance = utterance;
        this.onSpeakStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.onSpeakEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (e.error !== 'canceled') {
          this.onError?.('TTS error: ' + e.error);
        }
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Clean markdown/code for natural speech
   */
  _cleanForSpeech(text) {
    return text
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '... (code omitted) ...')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove markdown bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove markdown links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove markdown bullets
      .replace(/^[\s]*[-*+]\s+/gm, '')
      // Limit length for speech (don't read 2000-word responses)
      .substring(0, 1500)
      .trim();
  }

  // ═══════════════════════════════════════════
  // Speech-to-Text (Candidate speaks)
  // ═══════════════════════════════════════════

  /**
   * Start listening to the microphone
   */
  startListening() {
    if (!this.sttSupported || !this.sttEnabled) return;

    // Stop any current listening
    this.stopListening();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onListenStart?.();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        this.onTranscript?.(interimTranscript);
      }
      if (finalTranscript) {
        this.onFinalTranscript?.(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      this.onError?.('Mic error: ' + event.error);
      this.isListening = false;
      this.onListenEnd?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onListenEnd?.();
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.onError?.('Could not start microphone: ' + e.message);
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Already stopped
      }
      this.recognition = null;
      this.isListening = false;
    }
  }

  // ═══════════════════════════════════════════
  // Utility
  // ═══════════════════════════════════════════

  getAvailableVoices() {
    return this.voices.map(v => ({
      name: v.name,
      lang: v.lang,
      default: v.default,
      localService: v.localService
    }));
  }

  destroy() {
    this.stopSpeaking();
    this.stopListening();
  }
}

// Singleton
const voiceService = new VoiceService();
export default voiceService;
export { VOICE_PROFILES };
