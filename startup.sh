#!/bin/bash

# Cricket Analytics Platform - Startup Script for Mac/Linux

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        Cricket Analytics Platform - Startup                ║"
echo "║             Mac/Linux Setup & Launch Script                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "📥 Please install Python from: https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python found"
python3 --version

# Navigate to backend
cd backend || exit 1

# Install dependencies
echo ""
echo "📦 Installing backend dependencies..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"

# Start backend in background
echo ""
echo "🚀 Starting Flask Backend..."
echo "📍 Backend running on http://localhost:5000"
echo ""
python3 app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Navigate to frontend
cd ../frontend || exit 1

# Start frontend server
echo ""
echo "🌐 Starting Frontend Server..."
echo "📍 Frontend running on http://localhost:8000"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   Ready to Use! 🎉                         ║"
echo "║                                                             ║"
echo "║  Backend:  http://localhost:5000                           ║"
echo "║  Frontend: http://localhost:8000                           ║"
echo "║                                                             ║"
echo "║  🌐 Open http://localhost:8000 in your browser            ║"
echo "║  or double-click index.html                                ║"
echo "║                                                             ║"
echo "║  Press Ctrl+C to stop the servers                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

python3 -m http.server 8000

# Kill backend when frontend server stops
kill $BACKEND_PID
