# 🎯 Taskflow Timer

A modern, beautiful Pomodoro timer and task management application built with React, Vite, and Tailwind CSS.

![Taskflow Timer](https://img.shields.io/badge/version-9.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646cff.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.10-38bdf8.svg)

## ✨ Features

### 🎯 **Timer Management**
- **Multiple Timer Presets**: Pomodoro (25min), Focus 30 (30min), Focus 60 (1hr), Deep Work (2hrs)
- **Break Timers**: Short Break (5min), Long Break (15min)
- **Custom Timers**: Set any duration from 1-300 minutes
- **Full-Screen Mode**: Immersive timer with beautiful animated backgrounds
- **Keyboard Shortcuts**: Space (play/pause), R (reset), Esc (exit fullscreen)

### ✅ **Task Management**
- **Add/Edit Tasks**: Quick task creation with Enter key support
- **Task Completion**: Mark tasks as complete with visual feedback
- **Task Organization**: Separate active and completed tasks
- **Bulk Actions**: Clear all completed tasks at once
- **Persistent Storage**: Tasks saved locally between sessions

### 📊 **Progress Tracking**
- **Timer History**: Track all focus sessions and breaks
- **Session Statistics**: View completion rates and total focus time
- **Daily Progress**: Monitor today's tasks and focus sessions
- **Visual Progress**: Progress bars and completion indicators

### 🎨 **Beautiful Design**
- **Modern UI**: Clean, responsive design with smooth animations
- **Glassmorphism Effects**: Frosted glass elements in full-screen mode
- **Animated Backgrounds**: Floating gradient blobs with CSS animations
- **Mobile Responsive**: Works perfectly on all device sizes
- **Dark Mode Ready**: Easy to extend with dark theme support

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (Download from [nodejs.org](https://nodejs.org))
- **npm** 8+ (comes with Node.js)

### Manual Installation Steps

1. **Git Clone Directory**
   ```bash
   git clone https://github.com/ATUL9372/taskflow-timer.git

   cd taskflow-timer
   ```

2. **Install Dependencies**
   ```
   npm install
   npm install lucide-react
   npm install -D tailwindcss postcss autoprefixer
   ```
3. **Run Project**
   ```
   npm run dev
   ```
### Run With Docker-Compose file

1. **Build Dockerfile using Docker-Compose file**
   ```bash
   docker-compose build
   ```
2. **Run Docker Container Method-1**
   ```bash
   docker run -it -p 3000:3000 <Enter_Image_ID>
   ```
3. **Run Docker Container Method-2**
   ```bash
   docker run -it -p 3000:3000 taskflow-timer:v1
   ```
   Note : change v1 to latest version