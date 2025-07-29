import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with React state synchronization
 * @param {string} key - localStorage key
 * @param {any} initialValue - Default value if no stored value exists
 * @returns {[any, function]} [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Custom hook for managing timer history with localStorage
 * @returns {[Array, function, function]} [history, addSession, clearHistory]
 */
export const useTimerHistory = () => {
  const [history, setHistory] = useLocalStorage('taskflow-history-v9', []);

  const addSession = (session) => {
    const newSession = {
      ...session,
      id: Date.now(),
      timestamp: formatTimestamp(),
      date: new Date().toDateString()
    };
    
    setHistory(prev => [newSession, ...prev].slice(0, 100)); // Keep last 100 sessions
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return [history, addSession, clearHistory];
};