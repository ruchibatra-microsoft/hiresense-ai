import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { interviewAPI } from '../services/api';

const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeWarning, setTimeWarning] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, starting, in-progress, ending, completed
  const [evaluation, setEvaluation] = useState(null);
  const timerRef = useRef(null);

  const startInterview = useCallback(async (company, roundType, difficulty) => {
    setStatus('starting');
    setIsLoading(true);
    try {
      let response;
      try {
        response = await interviewAPI.startInterview({ company, roundType, difficulty });
      } catch (err) {
        // If there's a stuck active session, force-end it and retry
        if (err.response?.data?.canForceEnd) {
          response = await interviewAPI.startInterview({ company, roundType, difficulty, forceEnd: true });
        } else {
          throw err;
        }
      }
      const { data } = response;
      setSession(data);
      setMessages([{ role: 'interviewer', content: data.interviewerMessage, timestamp: new Date() }]);
      setTimeRemaining(data.duration);
      setStatus('in-progress');

      // Start countdown timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit(data.sessionId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return data;
    } catch (error) {
      setStatus('idle');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (message) => {
    if (!session?.sessionId || isLoading) return;

    // Add candidate message immediately
    setMessages(prev => [...prev, { role: 'candidate', content: message, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const { data } = await interviewAPI.sendMessage(session.sessionId, message);

      setMessages(prev => [...prev, {
        role: 'interviewer',
        content: data.interviewerMessage,
        timestamp: new Date(),
        metadata: data.metadata
      }]);

      if (data.timeWarning) setTimeWarning(data.timeWarning);
      if (data.timeRemaining !== undefined) setTimeRemaining(Math.round(data.timeRemaining));

      return data;
    } catch (error) {
      // Add error message
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date()
      }]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session, isLoading]);

  const submitCode = useCallback(async (code, language) => {
    if (!session?.sessionId || isLoading) return;

    setMessages(prev => [...prev, {
      role: 'candidate',
      content: `[Code submitted in ${language}]\n\`\`\`${language}\n${code}\n\`\`\``,
      timestamp: new Date(),
      metadata: { category: 'code-submission' }
    }]);
    setIsLoading(true);

    try {
      const { data } = await interviewAPI.submitCode(session.sessionId, code, language);

      setMessages(prev => [...prev, {
        role: 'interviewer',
        content: data.interviewerMessage,
        timestamp: new Date(),
        metadata: { category: 'code-review' }
      }]);

      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session, isLoading]);

  const endInterview = useCallback(async () => {
    if (!session?.sessionId) return;

    setStatus('ending');
    setIsLoading(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const { data } = await interviewAPI.endInterview(session.sessionId);
      setEvaluation(data.evaluation);
      setStatus('completed');
      return data;
    } catch (error) {
      setStatus('in-progress');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const handleAutoSubmit = useCallback(async (sessionId) => {
    setMessages(prev => [...prev, {
      role: 'system',
      content: '⏰ Time\'s up! Your interview is being submitted automatically.',
      timestamp: new Date()
    }]);
    setStatus('ending');

    try {
      const { data } = await interviewAPI.endInterview(sessionId);
      setEvaluation(data.evaluation);
      setStatus('completed');
    } catch (error) {
      console.error('Auto-submit failed:', error);
    }
  }, []);

  const resetInterview = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSession(null);
    setMessages([]);
    setIsLoading(false);
    setTimeRemaining(0);
    setTimeWarning(null);
    setStatus('idle');
    setEvaluation(null);
  }, []);

  return (
    <InterviewContext.Provider value={{
      session, messages, isLoading, timeRemaining, timeWarning,
      status, evaluation,
      startInterview, sendMessage, submitCode, endInterview, resetInterview
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) throw new Error('useInterview must be used within InterviewProvider');
  return context;
};
