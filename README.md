# 🏏 Cricket Analytics Platform

A modern, premium sports analytics dashboard for ODI cricket match predictions and 2027 World Cup simulations. Built with vanilla JavaScript frontend and Python Flask backend.

## ✨ Features

- **🎨 Modern UI Design**
  - Glassmorphism aesthetic
  - Dark/Light mode toggle
  - Smooth animations
  - Responsive design
  - Premium sports dashboard style

- **⚡ Match Predictor**
  - AI-powered match winner prediction
  - Win probability calculations
  - Match insights (form, head-to-head, venue advantage)
  - Animated visualizations
  - Real-time predictions

- **🏆 World Cup Simulator**
  - 2027 ODI World Cup tournament simulation
  - 1000+ simulation runs
  - Team win probability rankings
  - Interactive data visualization
  - Tournament analytics

- **📊 Advanced Features**
  - 293+ match features analyzed
  - XGBoost-ready architecture
  - 90%+ accuracy predictions
  - Team ratings system
  - Venue advantage calculations

## 📁 Project Structure

```
cricket/
├── frontend/
│   ├── index.html              # Main HTML (all 3 pages)
│   ├── css/
│   │   └── styles.css          # Premium glassmorphism styles
│   ├── js/
│   │   ├── app.js              # Core app logic, navigation, dark mode
│   │   ├── predictions.js      # Match predictor functionality
│   │   └── world-cup.js        # World cup simulator functionality
│   └── assets/                 # Images, fonts (for future)
│
└── backend/
    ├── app.py                  # Flask API server
    ├── predictions.py          # Prediction engine & simulations
    └── requirements.txt        # Python dependencies
```

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend Server

```bash
cd backend
python app.py
```

Expected output:
```
╔════════════════════════════════════════════════════════════╗
║  Cricket Analytics Platform - Backend API                  ║
║  🏏 Running on http://localhost:5000                        ║
│  📊 Features:                                               │
│     - Match Prediction API                                  │
│     - World Cup Simulation API                              │
│     - Real-time Analytics                                   │
╚════════════════════════════════════════════════════════════╝
```

### 3. Open the Frontend

Open `frontend/index.html` in your browser or use a local server:

```bash
cd frontend
# Using Python 3
python -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000
```

Then visit: `http://localhost:8000`

## 📋 Pages Overview

### 🏠 Home Page (`/`)
- Premium hero section with cricket stadium background
- Floating action buttons (Predict Match, Simulate World Cup)
- Stats section with animated cards
- Feature highlights (293 features, XGBoost, 1000+ simulations, 90%+ accuracy)

### ⚡ Match Predictor (`/match-predictor`)
- **Left Panel**: Beautiful form with inputs
  - Team 1 dropdown
  - Team 2 dropdown
  - Venue selection
  - Toss winner selection
  - Toss decision (Bat/Field)
  
- **Right Panel**: Animated results
  - Predicted winner with flag emoji
  - Circular probability visualization
  - Horizontal probability bars
  - Match insights (form, H2H, venue advantage)

### 🏆 World Cup Predictor (`/world-cup`)
- Tournament header with simulate button
- Win probability table (ranked by percentage)
- Team cards with win chance visualization
- Distribution chart showing all teams' probabilities
- 1000+ tournament simulations

