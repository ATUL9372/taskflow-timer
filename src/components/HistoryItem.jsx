import React from 'react';
import { TIMER_PRESETS } from '../utils/constants';
import { getDurationText } from '../utils/timeUtils';

/**
 * History item component for displaying timer sessions
 * @param {Object} props - Component props
 * @param {Object} props.session - Session object with type, duration, completed, timestamp
 */
const HistoryItem = ({ session }) => {
  const preset = TIMER_PRESETS[session.type] || TIMER_PRESETS.custom;
  const durationText = getDurationText(session.duration);
  
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      {/* Status Indicator */}
      <div className={`w-3 h-3 rounded-full ${preset.color}`}></div>
      
      {/* Session Details */}
      <div className="flex-1">
        <div className="font-medium text-gray-900">{preset.name}</div>
        <div className="text-sm text-gray-600">
          {durationText} • {session.timestamp}
          {session.date && (
            <span className="ml-2 text-gray-400">
              • {session.date}
            </span>
          )}
        </div>
      </div>
      
      {/* Completion Status Badge */}
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        session.completed 
          ? 'bg-green-100 text-green-800' 
          : 'bg-orange-100 text-orange-800'
      }`}>
        {session.completed ? 'Completed' : 'Stopped'}
      </div>
    </div>
  );
};

export default HistoryItem;