/**
 * Format time display with hours when appropriate
 * @param {number} totalSeconds - Total seconds to format
 * @returns {string} Formatted time string (HH:MM:SS or MM:SS)
 */
export const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Get readable duration text
 * @param {number} seconds - Duration in seconds
 * @returns {string} Human readable duration (e.g., "1h 30m", "25 min")
 */
export const getDurationText = (seconds) => {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${totalMinutes} min`;
};

/**
 * Get progress percentage
 * @param {number} timeLeft - Time remaining in seconds
 * @param {number} originalTime - Original timer duration in seconds
 * @returns {number} Progress percentage (0-100)
 */
export const getProgress = (timeLeft, originalTime) => {
  if (originalTime === 0) return 0;
  return Math.round(((originalTime - timeLeft) / originalTime) * 100);
};

/**
 * Format timestamp for display
 * @param {Date} date - Date object
 * @returns {string} Formatted timestamp
 */
export const formatTimestamp = (date = new Date()) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};