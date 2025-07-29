import React from 'react';
import { Play, Pause, Square, RotateCcw, X } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';
import { TIMER_PRESETS } from '../utils/constants';

/**
 * Full screen timer component with beautiful animations
 * @param {Object} props - Component props
 * @param {Object} props.currentTimer - Current timer state
 * @param {Function} props.startTimer - Function to start timer
 * @param {Function} props.pauseTimer - Function to pause timer
 * @param {Function} props.stopTimer - Function to stop timer
 * @param {Function} props.resetTimer - Function to reset timer
 * @param {Function} props.exitFullScreen - Function to exit full screen
 * @param {Function} props.setTimerType - Function to change timer type
 */
const FullScreenTimer = ({
  currentTimer,
  startTimer,
  pauseTimer,
  stopTimer,
  resetTimer,
  exitFullScreen,
  setTimerType
}) => {
  const preset = TIMER_PRESETS[currentTimer.type] || TIMER_PRESETS.custom;

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="floating-blob top-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-600 animate-glow"></div>
      <div className="floating-blob bottom-32 left-16 w-80 h-80 bg-gradient-to-br from-purple-500 to-pink-500 animation-delay-1000"></div>
      <div className="floating-blob top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 animation-delay-2000"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white p-4">
        {/* Timer Type Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['pomodoro', 'shortBreak', 'longBreak'].map((type) => {
            const timerPreset = TIMER_PRESETS[type];
            return (
              <button
                key={type}
                onClick={() => setTimerType(type)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  currentTimer.type === type
                    ? 'bg-white text-purple-900 shadow-lg scale-105'
                    : 'glass-effect text-white hover:bg-opacity-30'
                }`}
              >
                {timerPreset.name}
              </button>
            );
          })}
        </div>

        {/* Large Timer Display */}
        <div className={`text-center mb-12 transition-all duration-500 ${
          currentTimer.isActive ? 'scale-105' : 'scale-100'
        }`}>
          <div className="text-9xl md:text-[12rem] font-bold mb-4 tracking-tight font-mono">
            {formatTime(currentTimer.timeLeft)}
          </div>
          
          {/* Timer Status */}
          <div className="text-xl text-gray-200 mb-2">
            {currentTimer.isActive ? 'Focus Time' : 'Paused'}
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white bg-opacity-20 rounded-full mx-auto">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ 
                width: `${((currentTimer.originalTime - currentTimer.timeLeft) / currentTimer.originalTime) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-6 mb-8">
          {/* Play/Pause Button */}
          {!currentTimer.isActive ? (
            <button
              onClick={startTimer}
              className="flex items-center gap-3 px-8 py-4 glass-effect text-white rounded-full hover:bg-opacity-30 transition-all duration-300 text-lg font-medium transform hover:scale-105"
            >
              <Play size={24} />
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-3 px-8 py-4 glass-effect text-white rounded-full hover:bg-opacity-30 transition-all duration-300 text-lg font-medium transform hover:scale-105"
            >
              <Pause size={24} />
              Pause
            </button>
          )}
          
          {/* Stop Button */}
          <button
            onClick={stopTimer}
            className="p-4 glass-effect text-white rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105"
            title="Stop Timer"
          >
            <Square size={24} />
          </button>
          
          {/* Reset Button */}
          <button
            onClick={resetTimer}
            className="p-4 glass-effect text-white rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105"
            title="Reset Timer"
          >
            <RotateCcw size={24} />
          </button>
        </div>
        
        {/* Timer Description */}
        <div className="text-center max-w-md">
          <p className="text-gray-200 text-lg">
            {preset.description}
          </p>
        </div>
      </div>
      
      {/* Exit Full Screen Button */}
      <button
        onClick={exitFullScreen}
        className="fixed top-6 right-6 p-3 glass-effect text-white rounded-lg hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105"
        title="Exit Full Screen"
      >
        <X size={24} />
      </button>
      
      {/* Keyboard Shortcuts Info */}
      <div className="fixed bottom-4 left-4 text-white text-sm opacity-60">
        <div>Space: Play/Pause</div>
        <div>R: Reset</div>
        <div>Esc: Exit</div>
      </div>
    </div>
  );
};

export default FullScreenTimer;