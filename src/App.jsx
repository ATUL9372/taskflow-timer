import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Clock, List, History, RotateCcw } from 'lucide-react';

// Components
import TaskItem from './components/TaskItem';
import TimerDisplay from './components/TimerDisplay';
import HistoryItem from './components/HistoryItem';
import FullScreenTimer from './components/FullScreenTimer';

// Hooks and Utils
import { useLocalStorage } from './hooks/useLocalStorage';
import { formatTime, getDurationText, formatTimestamp } from './utils/timeUtils';
import { TIMER_PRESETS, APP_CONFIG } from './utils/constants';

/**
 * Main Application Component
 * Taskflow Timer v9 - A modern Pomodoro timer and task management app
 */
export default function App() {
  // State Management
  const [activeTab, setActiveTab] = useState('timer');
  const [tasks, setTasks] = useLocalStorage(APP_CONFIG.storageKeys.tasks, []);
  const [newTask, setNewTask] = useState('');
  const [isFullScreenTimer, setIsFullScreenTimer] = useState(false);
  
  // Timer State
  const [currentTimer, setCurrentTimer] = useState({
    type: 'pomodoro',
    timeLeft: TIMER_PRESETS.pomodoro.duration,
    originalTime: TIMER_PRESETS.pomodoro.duration,
    isActive: false
  });
  
  const [timerHistory, setTimerHistory] = useLocalStorage(APP_CONFIG.storageKeys.history, []);
  const [customMinutes, setCustomMinutes] = useState(APP_CONFIG.defaultCustomMinutes);
  const intervalRef = useRef(null);

  // Timer Effects
  useEffect(() => {
    if (currentTimer.isActive && currentTimer.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTimer(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      
      // Timer completed
      if (currentTimer.isActive && currentTimer.timeLeft === 0) {
        const session = {
          type: currentTimer.type,
          duration: currentTimer.originalTime,
          completed: true,
          timestamp: formatTimestamp(),
          date: new Date().
        