# 🚀 Complete Setup Guide

## Quick Start (Recommended)

### Windows
1. Double-click `startup.bat`
2. Wait for both servers to start
3. Frontend will automatically open

### Mac/Linux
```bash
chmod +x startup.sh
./startup.sh
```

---

## Manual Setup

### Step 1: Install Python (if not already installed)

**Windows:**
- Download from https://www.python.org/downloads/
- Run installer and check "Add Python to PATH"
- Verify: Open Command Prompt and type `python --version`

**Mac:**
```bash
# Using Homebrew
brew install python3

# Or download from python.org
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip
```

### Step 2: Install Backend Dependencies

Navigate to the backend folder:
```bash
cd backend
```

Install Flask and dependencies:
```bash
pip install -r requirements.txt
```

If you get permission errors on Mac/Linux, try:
```bash
pip3 install --user -r requirements.txt
```

### Step 3: Start the Backend Server

From the `backend` folder:
```bash
python app.py
```

Or with Python 3:
```bash
python3 app.py
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║  Cricket Analytics Platform - Backend API                  ║
║  🏏 Running on http://localhost:5000                        ║
```

**Keep this terminal open!**

### Step 4: Start the Frontend Server

Open a NEW terminal/command prompt, navigate to frontend folder:
```bash
cd frontend
```

Start the HTTP server:

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000 ...
```

### Step 5: Open in Browser

Open your browser and navigate to:
```
http://localhost:8000
```

---

## Troubleshooting

### ❌ "Port 5000 already in use"

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

Or modify `backend/app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5001)  # Change to 5001
```

Then update frontend `js/app.js`:
```javascript
const API_BASE = 'http://localhost:5001/api';  // Update this
```

### ❌ "Port 8000 already in use"

Use a different port:
```bash
python -m http.server 8001
```

Then open: `http://localhost:8001`

### ❌ "Module not found" errors

Make sure you're in the backend folder when installing:
```bash
cd backend
pip install -r requirements.txt
```

Or install individually:
```bash
pip install Flask Flask-CORS
```

### ❌ CORS errors in browser console

1. Verify backend is running on http://localhost:5000
2. Check that Flask-CORS is installed:
   ```bash
   pip install Flask-CORS
   ```
3. Restart both servers

### ❌ "Cannot open frontend/index.html"

Option 1: Use HTTP server (recommended)
```bash
cd frontend
python -m http.server 8000
```

Option 2: Double-click index.html (limited functionality)

Option 3: Use VS Code Live Server extension

### ❌ Backend returns "404 Not Found"

Check that API endpoints are correct:
- `http://localhost:5000/api/health` should return `{"status": "ok"}`
- Check browser DevTools (F12) Network tab for request details
- Verify backend console for errors

### ❌ Predictions not showing

1. Open DevTools (F12) → Console tab
2. Look for red errors
3. Check Network tab to see API responses
4. Verify backend is running: `http://localhost:5000/api/teams`

---

## Verification Checklist

### Backend Running?
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","message":"API is running"}
```

### Can Get Teams?
```bash
curl http://localhost:5000/api/teams
# Should return: ["India","Australia","Pakistan",...]
```

### Frontend Working?
- Open http://localhost:8000 in browser
- Check for errors in DevTools (F12)
- Try navigating between pages

---

## Advanced Configuration

### Use Different Python Version

Check available versions:
```bash
python3.10 --version
```

Install for specific version:
```bash
python3.10 -m pip install -r requirements.txt
python3.10 app.py
```

### Virtual Environment (Recommended for Production)

Create virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

Then install:
```bash
pip install -r requirements.txt
python app.py
```

### Enable HTTPS

Update `backend/app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, ssl_context='adhoc')
```

Install required package:
```bash
pip install pyopenssl
```

### Change API Port

Edit `backend/app.py`:
```python
app.run(debug=True, host='localhost', port=5001)
```

Edit `frontend/js/app.js`:
```javascript
const API_BASE = 'http://localhost:5001/api';
```

### Deploy Frontend to Different Server

Change `API_BASE` in `frontend/js/app.js`:
```javascript
const API_BASE = 'https://api.yourserver.com/api';
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Connection refused" | Check both servers are running |
| "CORS error" | Install Flask-CORS, restart backend |
| "Page not loading" | Check browser console (F12), reload |
| "Predictions show error" | Check API response in Network tab |
| "Dark mode not working" | Check localStorage in DevTools |
| "Forms not responding" | Check browser console for JS errors |

---

## Next Steps

1. ✅ Backend running on localhost:5000
2. ✅ Frontend running on localhost:8000
3. 🎯 Test the application
4. 🔧 Customize teams and venues
5. 🤖 Integrate real ML model
6. 🚀 Deploy to production

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console (F12)
3. Check backend terminal for errors
4. Verify all ports are correct
5. Try restarting both servers

Good luck! 🏏✨
