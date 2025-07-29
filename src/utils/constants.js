// Timer Types Configuration
export const TIMER_PRESETS = {
  pomodoro: { 
    name: 'Pomodoro', 
    duration: 25 * 60, 
    color: 'bg-red-500',
    bgColor: 'from-red-600 to-red-800',
    description: 'Classic 25-minute focus session'
  },
  focus30: { 
    name: 'Focus 30', 
    duration: 30 * 60, 
    color: 'bg-orange-500',
    bgColor: 'from-orange-600 to-orange-800',
    description: '30-minute focus session'
  },
  focus60: { 
    name: 'Focus 60', 
    duration: 60 * 60, 
    color: 'bg-indigo-500',
    bgColor: 'from-indigo-600 to-indigo-800',
    description: '1-hour deep focus session'
  },
  deepWork: { 
    name: 'Deep Work', 
    duration: 120 * 60, 
    color: 'bg-gray-700',
    bgColor: 'from-gray-700 to-gray-900',
    description: '2-hour deep work session'
  },
  shortBreak: { 
    name: 'Short Break', 
    duration: 5 * 60, 
    color: 'bg-green-500',
    bgColor: 'from-green-600 to-green-800',
    description: '5-minute break'
  },
  longBreak: { 
    name: 'Long Break', 
    duration: 15 * 60, 
    color: 'bg-blue-500',
    bgColor: 'from-blue-600 to-blue-800',
    description: '15-minute break'
  },
  custom: { 
    name: 'Custom', 
    duration: 10 * 60, 
    color: 'bg-purple-500',
    bgColor: 'from-purple-600 to-purple-800',
    description: 'Custom duration timer'
  }
};

// App configuration
export const APP_CONFIG = {
  name: 'Taskflow Timer',
  version: '9.0.0',
  defaultCustomMinutes: 10,
  storageKeys: {
    tasks: 'taskflow-tasks-v9',
    history: 'taskflow-history-v9',
    settings: 'taskflow-settings-v9'
  }
};