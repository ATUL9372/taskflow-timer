import React from 'react';
import { formatTime, getDurationText, getProgress } from '../utils/timeUtils';
import { TIMER_PRESETS } from '../utils/constants';

/**
 * Timer display component for normal view
 * @param {Object} props - Component props
 * @param {number} props.time - Current time in seconds
 * @param {boolean} props.isActive - Whether timer is active
 * @param {string} props.type - Timer type key
 * @param {number} props.originalTime - Original timer duration
 */
const TimerDisplay = ({ time, isActive, type, originalTime }) => {
  const preset = TIMER_PRESETS[type] || TIMER_PRESETS.custom;
  const timeDisplay = formatTime(time);
  const progress = getProgress(time, originalTime);

  return (
    <div className="text-center">
      {/* Timer Type Badge */}
      <div className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4 ${preset.color}`}>
        {preset.name}
      </div>
      
      {/* Progress Ring */}
      <div className="relative inline-block mb-4">
        <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${progress * 2.83} 283`}
            className={`${preset.color.replace('bg-', 'text-')} transition-all duration-1000`}
          />
        </svg>
      </div>
      
      {/* Main Timer Display */}
      <div className={`text-6xl font-mono font-bold mb-2 transition-colors duration-300 ${
        isActive ? 'text-gray-900' : 'text-gray-600'
      }`}>
        {timeDisplay}
      </div>
      
      {/* Remaining Time Text */}
      <div className="text-sm text-gray-500">
        {getDurationText(time)} remaining
      </div>
    </div>
  );
};

export default TimerDisplay;