import React from 'react';
import { Check, Trash2 } from 'lucide-react';

/**
 * Individual task item component
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object with id, text, completed properties
 * @param {Function} props.onToggle - Function to toggle task completion
 * @param {Function} props.onDelete - Function to delete task
 */
const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
      task.completed 
        ? 'bg-gray-50 border-gray-200' 
        : 'bg-white border-gray-300 hover:border-blue-300'
    }`}>
      {/* Completion Toggle Button */}
      <button
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
          task.completed 
            ? 'bg-green-500 border-green-500 text-white transform scale-110' 
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
        }`}
      >
        {task.completed && <Check size={12} />}
      </button>
      
      {/* Task Text */}
      <span className={`flex-1 transition-all duration-200 ${
        task.completed 
          ? 'line-through text-gray-500' 
          : 'text-gray-800'
      }`}>
        {task.text}
      </span>
      
      {/* Delete Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
        title="Delete task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TaskItem;