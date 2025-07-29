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
          date: new Date().toDateString()
        };
        
        setTimerHistory(prev => [{ ...session, id: Date.now() }, ...prev]);
        setCurrentTimer(prev => ({ ...prev, isActive: false }));
        
        // Play completion sound (optional)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${TIMER_PRESETS[currentTimer.type].name} Completed!`, {
            body: 'Time to take a break or start the next session.',
            icon: '/vite.svg'
          });
        }
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [currentTimer.isActive, currentTimer.timeLeft, currentTimer.type, currentTimer.originalTime, setTimerHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isFullScreenTimer) {
        switch (event.code) {
          case 'Space':
            event.preventDefault();
            currentTimer.isActive ? pauseTimer() : startTimer();
            break;
          case 'KeyR':
            event.preventDefault();
            resetTimer();
            break;
          case 'Escape':
            event.preventDefault();
            exitFullScreen();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullScreenTimer, currentTimer.isActive]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Task Functions
  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [...prev, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
        : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  // Timer Functions
  const startTimer = () => {
    setCurrentTimer(prev => ({ ...prev, isActive: true }));
  };

  const pauseTimer = () => {
    setCurrentTimer(prev => ({ ...prev, isActive: false }));
  };

  const stopTimer = () => {
    if (currentTimer.isActive || currentTimer.timeLeft !== currentTimer.originalTime) {
      const session = {
        type: currentTimer.type,
        duration: currentTimer.originalTime - currentTimer.timeLeft,
        completed: false,
        timestamp: formatTimestamp(),
        date: new Date().toDateString()
      };
      
      // Only add to history if timer ran for at least 1 minute
      if (session.duration >= 60) {
        setTimerHistory(prev => [{ ...session, id: Date.now() }, ...prev]);
      }
    }
    
    setCurrentTimer(prev => ({ 
      ...prev, 
      isActive: false, 
      timeLeft: prev.originalTime 
    }));
  };

  const resetTimer = () => {
    setCurrentTimer(prev => ({ 
      ...prev, 
      isActive: false, 
      timeLeft: prev.originalTime 
    }));
  };

  const setTimerType = (type) => {
    // Stop current timer if running
    if (currentTimer.isActive) {
      stopTimer();
    }
    
    const duration = type === 'custom' ? customMinutes * 60 : TIMER_PRESETS[type].duration;
    setCurrentTimer({
      type,
      timeLeft: duration,
      originalTime: duration,
      isActive: false
    });
    
    // Open full screen for focus timers
    if (['deepWork', 'pomodoro', 'focus30', 'focus60'].includes(type)) {
      setIsFullScreenTimer(true);
    }
  };

  const updateCustomTimer = (minutes) => {
    const validMinutes = Math.max(1, Math.min(300, minutes)); // 1-300 minutes limit
    setCustomMinutes(validMinutes);
    
    if (currentTimer.type === 'custom') {
      const duration = validMinutes * 60;
      setCurrentTimer({
        type: 'custom',
        timeLeft: duration,
        originalTime: duration,
        isActive: false
      });
    }
  };

  const exitFullScreen = () => {
    setIsFullScreenTimer(false);
  };

  const clearHistory = () => {
    setTimerHistory([]);
  };

  // Statistics
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completedSessions = timerHistory.filter(session => session.completed).length;
  const totalFocusTime = timerHistory
    .filter(session => session.completed)
    .reduce((total, session) => total + session.duration, 0);

  // Full Screen Timer View
  if (isFullScreenTimer) {
    return (
      <FullScreenTimer
        currentTimer={currentTimer}
        startTimer={startTimer}
        pauseTimer={pauseTimer}
        stopTimer={stopTimer}
        resetTimer={resetTimer}
        exitFullScreen={exitFullScreen}
        setTimerType={setTimerType}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {APP_CONFIG.name}
              <span className="text-sm font-normal text-gray-500 ml-2">v{APP_CONFIG.version}</span>
            </h1>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{completedTasks}/{totalTasks} tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{completedSessions} sessions</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>{getDurationText(totalFocusTime)} focused</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            {[
              { id: 'timer', label: 'Timer', icon: Clock },
              { id: 'tasks', label: 'Tasks', icon: List },
              { id: 'history', label: 'History', icon: History }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timer Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timer Presets */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Timer Type
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {Object.entries(TIMER_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => setTimerType(key)}
                      className={`p-4 rounded-lg border text-sm font-medium transition-all duration-200 hover:shadow-md ${
                        currentTimer.type === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="font-semibold">{preset.name}</div>
                      {key !== 'custom' && (
                        <div className="text-xs text-gray-500 mt-1">
                          {getDurationText(preset.duration)}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Custom Timer Input */}
                {currentTimer.type === 'custom' && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-700">Duration:</label>
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={customMinutes}
                      onChange={(e) => updateCustomTimer(parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <span className="text-sm text-gray-600">minutes</span>
                  </div>
                )}
              </div>

              {/* Timer Display */}
              <div className="bg-white rounded-xl p-8 shadow-sm border">
                <TimerDisplay 
                  time={currentTimer.timeLeft}
                  isActive={currentTimer.isActive}
                  type={currentTimer.type}
                  originalTime={currentTimer.originalTime}
                />
                
                {/* Timer Controls */}
                <div className="flex justify-center gap-3 mt-6">
                  {!currentTimer.isActive ? (
                    <button
                      onClick={startTimer}
                      className="timer-button bg-green-500 text-white hover:bg-green-600"
                    >
                      <Play size={20} />
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="timer-button bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <Pause size={20} />
                      Pause
                    </button>
                  )}
                  
                  <button
                    onClick={stopTimer}
                    className="timer-button bg-red-500 text-white hover:bg-red-600"
                  >
                    <Square size={20} />
                    Stop
                  </button>
                  
                  <button
                    onClick={resetTimer}
                    className="timer-button bg-gray-500 text-white hover:bg-gray-600"
                  >
                    <RotateCcw size={20} />
                    Reset
                  </button>
                </div>
                
                {/* Full Screen Button */}
                <div className="text-center mt-4">
                  <button
                    onClick={() => setIsFullScreenTimer(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Open in Full Screen
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              {/* Today's Progress */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">Today's Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed Tasks</span>
                    <span className="font-medium">{completedTasks}/{totalTasks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Focus Sessions</span>
                    <span className="font-medium">{completedSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Focus Time</span>
                    <span className="font-medium">{getDurationText(totalFocusTime)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Add Task */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Add Task</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="What needs to be done?"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    onClick={addTask}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Add Task */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus size={20} />
                Add New Task
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="What do you need to accomplish?"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={addTask}
                  className="timer-button bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Plus size={18} />
                  Add Task
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <List size={20} />
                  Tasks ({tasks.filter(t => !t.completed).length} remaining)
                </h2>
                
                {completedTasks > 0 && (
                  <button
                    onClick={clearCompletedTasks}
                    className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  >
                    Clear Completed
                  </button>
                )}
              </div>
              
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <List size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No tasks yet</p>
                  <p className="text-sm">Add your first task above to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Active Tasks */}
                  {tasks.filter(task => !task.completed).map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                  
                  {/* Completed Tasks */}
                  {completedTasks > 0 && (
                    <>
                      <div className="border-t pt-4 mt-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                          Completed ({completedTasks})
                        </h3>
                        {tasks.filter(task => task.completed).map(task => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <History size={20} />
                  Timer History
                </h2>
                
                {timerHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  >
                    Clear History
                  </button>
                )}
              </div>
              
              {timerHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <History size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No timer sessions yet</p>
                  <p className="text-sm">Start a timer to see your focus history!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {timerHistory.map(session => (
                    <HistoryItem key={session.id} session={session} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}