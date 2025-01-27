import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'domi-tracker-data';
const CURRENT_SESSION_KEY = 'domi-tracker-current-session';

const TimeTrackerContext = createContext();

export const useTimeTracker = () => {
  const context = useContext(TimeTrackerContext);
  if (!context) {
    throw new Error('useTimeTracker must be used within a TimeTrackerProvider');
  }
  return context;
};

export const TimeTrackerProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(() => {
    const savedState = localStorage.getItem(CURRENT_SESSION_KEY);
    return savedState ? JSON.parse(savedState).isRunning : false;
  });
  
  const [isPaused, setIsPaused] = useState(() => {
    const savedState = localStorage.getItem(CURRENT_SESSION_KEY);
    return savedState ? JSON.parse(savedState).isPaused : false;
  });
  
  const [time, setTime] = useState(() => {
    const savedState = localStorage.getItem(CURRENT_SESSION_KEY);
    return savedState ? JSON.parse(savedState).time : 0;
  });
  
  const [hourlyRate, setHourlyRate] = useState(() => {
    const savedRate = localStorage.getItem('hourly-rate');
    return savedRate ? parseFloat(savedRate) : 0;
  });
  
  const [sessions, setSessions] = useState(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  // Save current session state to localStorage
  useEffect(() => {
    const currentSession = {
      isRunning,
      isPaused,
      time,
      lastUpdated: Date.now()
    };
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(currentSession));
  }, [isRunning, isPaused, time]);

  // Handle time updates
  useEffect(() => {
    let intervalId;
    if (isRunning && !isPaused) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, isPaused]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Save hourly rate to localStorage
  useEffect(() => {
    localStorage.setItem('hourly-rate', hourlyRate.toString());
  }, [hourlyRate]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Save current time when page becomes hidden
        const currentSession = {
          isRunning,
          isPaused,
          time,
          lastUpdated: Date.now()
        };
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(currentSession));
      } else {
        // Update time when page becomes visible again
        const savedSession = localStorage.getItem(CURRENT_SESSION_KEY);
        if (savedSession) {
          const { isRunning: wasRunning, isPaused: wasPaused, time: savedTime, lastUpdated } = JSON.parse(savedSession);
          if (wasRunning && !wasPaused) {
            const timeDiff = Math.floor((Date.now() - lastUpdated) / 1000);
            setTime(savedTime + timeDiff);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, isPaused, time]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const calculateEarnings = () => {
    const hours = time / 3600;
    return (hours * hourlyRate).toFixed(2);
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    const earnings = calculateEarnings();
    const session = {
      duration: formatTime(time),
      earnings: earnings,
      timestamp: new Date().toLocaleString()
    };
    setSessions([session, ...sessions]);
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      setSessions([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = {
    isRunning,
    isPaused,
    time,
    hourlyRate,
    sessions,
    setHourlyRate,
    formatTime,
    calculateEarnings,
    handleStart,
    handlePause,
    handleResume,
    handleStop,
    handleReset,
    handleClearHistory
  };

  return (
    <TimeTrackerContext.Provider value={value}>
      {children}
    </TimeTrackerContext.Provider>
  );
};
