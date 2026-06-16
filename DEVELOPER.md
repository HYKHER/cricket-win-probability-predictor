# 👨‍💻 Developer Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│             Frontend (Vanilla JS)                       │
│  ┌──────────────┬──────────────┬──────────────────┐    │
│  │  index.html  │  styles.css  │  app.js          │    │
│  │  (structure) │  (design)    │  (logic)         │    │
│  └──────────────┴──────────────┴──────────────────┘    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  predictions.js   │  world-cup.js                │  │
│  │  (match page)     │  (tournament page)           │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP JSON API
                         ↓
┌─────────────────────────────────────────────────────────┐
│           Backend (Python Flask)                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  app.py (routes & API endpoints)                 │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  predictions.py (ML logic & simulations)         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## File Structure & Responsibilities

### Frontend

**index.html**
- Single-page application with 3 pages
- Navigation between pages using JS (no page reload)
- Form inputs and result display containers
- Semantic HTML structure

**css/styles.css**
- Glassmorphism design system
- CSS variables for theming
- Responsive breakpoints
- Animations & transitions
- Dark/light mode support

**js/app.js** (Core Application Logic)
```javascript
// Exports:
window.app = {
  navigateTo(pageId)           // Page navigation
  fetchTeams()                  // API: Get teams
  fetchVenues()                 // API: Get venues
  predictMatch(...)             // API: Predict match
  simulateWorldCup(...)         // API: Simulate tournament
  getCountryFlag(teamName)      // Utility: Get emoji flag
}
```

**js/predictions.js** (Match Predictor Page)
```javascript
// Handles:
- Form population (teams, venues)
- Form submission & validation
- API call to /api/predict-match
- Results visualization
- Loading/error states
```

**js/world-cup.js** (World Cup Page)
```javascript
// Handles:
- Simulate button click
- API call to /api/simulate-world-cup
- Results display (table, cards, chart)
- Probability visualization
```

### Backend

**app.py** (Flask Application)
```python
# Routes:
GET  /api/health              # Health check
GET  /api/teams               # List teams
GET  /api/venues              # List venues
POST /api/predict-match       # Match prediction
POST /api/simulate-world-cup  # Tournament simulation
```

**predictions.py** (Prediction Engine)
```python
# Functions:
def predict_match(team1, team2, venue, toss_winner, toss_decision)
def simulate_world_cup(num_simulations=1000)
def get_team_stats(team)
def calculate_head_to_head(team1, team2)

# Constants:
TEAM_RATINGS = {...}          # Team strength values
VENUE_ADVANTAGE = {...}       # Home field advantage
```

## How to Extend

### Add a New Team

1. **predictions.py**: Add to `TEAM_RATINGS`
```python
TEAM_RATINGS = {
    # ...
    'New Team': 85,
}
```

2. **app.py**: Add to `TEAMS` list
```python
TEAMS = [
    # ...
    'New Team',
]
```

3. **Automatic**: Team appears in all dropdowns!

### Add a New Venue

1. **app.py**: Add to `VENUES` list
```python
VENUES = [
    # ...
    'New Stadium',
]
```

2. **predictions.py**: (Optional) Add home advantage
```python
VENUE_ADVANTAGE = {
    # ...
    'Some Team': ['New Stadium'],
}
```

### Integrate Real ML Model

**Current flow:**
```
User Form → API Call → Mock Prediction Logic → Results
```

**Integrate XGBoost:**

1. Load model in `predictions.py`:
```python
import pickle
import numpy as np

# Load trained model
with open('models/xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

def extract_features(team1, team2, venue, toss_winner, toss_decision):
    """Extract features for ML model"""
    # Create feature vector based on your training data
    features = [
        team_rating_1,
        team_rating_2,
        venue_index,
        toss_winner_index,
        # ... more features (293 features!)
    ]
    return np.array(features).reshape(1, -1)

def predict_match(team1, team2, venue, toss_winner, toss_decision):
    """Use ML model for prediction"""
    features = extract_features(team1, team2, venue, toss_winner, toss_decision)
    prediction = model.predict_proba(features)[0]
    
    return {
        'predicted_winner': team1 if prediction[0] > 0.5 else team2,
        'team1_win_probability': prediction[0],
        'team2_win_probability': prediction[1],
        # ...
    }
```

2. No frontend changes needed! Same API contract

### Add a New Page

1. **index.html**: Add new page container
```html
<main id="new-page" class="page">
  <div class="container">
    <!-- Your content here -->
  </div>
</main>
```

2. **Create js/new-page.js**:
```javascript
function initNewPage() {
  // Initialization code
}

document.addEventListener('DOMContentLoaded', initNewPage);
```

3. **Add script tag** in index.html:
```html
<script src="js/new-page.js"></script>
```

4. **Update nav** in index.html:
```html
<li><a href="#new-page">New Page</a></li>
```

5. Navigation works automatically!

### Customize Styling

**Colors:**
```css
:root {
  --primary: #1e88e5;        /* Main blue */
  --secondary: #26c6da;      /* Cyan accent */
  --accent: #ff6b35;         /* Orange accent */
  --dark-bg: #0d1117;        /* Dark background */
}
```

**Animations:**
```css
@keyframes customAnimation {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: customAnimation 0.5s ease-out;
}
```

**Fonts:**
```css
body {
  font-family: 'Your Font', sans-serif;
}
```

### Add Database Integration

1. **Install SQLAlchemy**:
```bash
pip install sqlalchemy
```

2. **Create models.py**:
```python
from sqlalchemy import Column, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Prediction(Base):
    __tablename__ = 'predictions'
    
    id = Column(Integer, primary_key=True)
    team1 = Column(String)
    team2 = Column(String)
    winner = Column(String)
    probability = Column(Float)
    timestamp = Column(DateTime)
```

3. **Update app.py**:
```python
from flask_sqlalchemy import SQLAlchemy
from models import Prediction

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cricket.db'
db = SQLAlchemy(app)

@app.route('/api/predict-match', methods=['POST'])
def predict_match_endpoint():
    # ... prediction logic ...
    
    # Save to database
    prediction = Prediction(
        team1=data['team1'],
        team2=data['team2'],
        winner=result['predicted_winner'],
        probability=result['confidence']
    )
    db.session.add(prediction)
    db.session.commit()
    
    return jsonify(result), 200
```

### Add User Authentication

1. **Install Flask-Login**:
```bash
pip install flask-login
```

2. **Create auth.py**:
```python
from flask_login import UserMixin
from werkzeug.security import generate_password_hash

class User(UserMixin):
    def __init__(self, username, password):
        self.username = username
        self.password = generate_password_hash(password)
```

3. **Update app.py** with login routes:
```python
@app.route('/api/login', methods=['POST'])
def login():
    # Authentication logic
    pass
```

### Add API Documentation

Use Swagger/OpenAPI:

```bash
pip install flasgger
```

```python
from flasgger import Swagger

app = Flask(__name__)
Swagger(app)

@app.route('/api/predict-match', methods=['POST'])
def predict_match_endpoint():
    """
    Predict cricket match winner
    ---
    parameters:
      - name: team1
        in: body
        type: string
      - name: team2
        in: body
        type: string
    responses:
      200:
        description: Match prediction result
    """
    # ...
```

Visit: `http://localhost:5000/apidocs`

## Testing

### Frontend Testing (Manual)
1. Test all pages load correctly
2. Test dark/light mode toggle
3. Test form validation
4. Test API error handling
5. Test responsive design

### Backend Testing
```python
# test_predictions.py
import unittest
from app import app
from predictions import predict_match

class TestPredictions(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
    
    def test_predict_match(self):
        result = predict_match('India', 'Australia', 'MCG', 'India', 'bat')
        self.assertIn('predicted_winner', result)
        self.assertIn('team1_win_probability', result)
    
    def test_api_teams(self):
        response = self.app.get('/api/teams')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)

if __name__ == '__main__':
    unittest.main()
```

Run tests:
```bash
python -m unittest discover
```

## Performance Tips

1. **Cache predictions** for frequently predicted matchups
2. **Lazy load** team/venue dropdowns
3. **Compress** CSS/JS files
4. **Use CDN** for static assets
5. **Database indices** on frequently queried fields
6. **Implement pagination** for large result sets

## Security Considerations

1. **Validate all inputs** (team names, venues)
2. **Sanitize HTML** to prevent XSS
3. **CORS** already configured, review whitelist
4. **Rate limiting** for API endpoints
5. **HTTPS** in production
6. **Environment variables** for secrets

```python
import os
API_SECRET = os.getenv('API_SECRET', 'dev-key')
```

## Deployment

### Heroku
```bash
# Create Procfile
web: python backend/app.py

# Deploy
git push heroku main
```

### Docker
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "backend/app.py"]
```

### AWS/GCP
- Use App Engine or Elastic Beanstalk
- Host frontend on S3/CloudStorage
- Use CDN for assets

## Troubleshooting Guide

| Error | Cause | Solution |
|-------|-------|----------|
| CORS error | Backend CORS not enabled | Check Flask-CORS import |
| 404 API | Wrong endpoint | Check URL in app.js |
| Slow predictions | Heavy computation | Add caching |
| Form not submitting | JS error | Check console (F12) |

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Tricks](https://css-tricks.com/)
- [XGBoost Docs](https://xgboost.readthedocs.io/)

---

Happy coding! 🚀
