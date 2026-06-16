# config.example.py
# Copy this file to config.py and modify values as needed

# ===========================
# FLASK CONFIGURATION
# ===========================

# Set to 'development' or 'production'
FLASK_ENV = 'development'

# Enable debug mode (set to False in production)
DEBUG = True

# Secret key for sessions (change this in production)
SECRET_KEY = 'dev-secret-key-change-in-production'

# ===========================
# API CONFIGURATION
# ===========================

# Backend host and port
API_HOST = 'localhost'
API_PORT = 5000

# Enable CORS
CORS_ENABLED = True

# ===========================
# PREDICTION CONFIGURATION
# ===========================

# Default number of world cup simulations
DEFAULT_SIMULATIONS = 1000

# Min/Max simulations allowed
MIN_SIMULATIONS = 100
MAX_SIMULATIONS = 10000

# ===========================
# TEAMS & VENUES
# ===========================

# Main teams in the system
TEAMS = [
    'India',
    'Australia',
    'Pakistan',
    'New Zealand',
    'England',
    'South Africa',
    'West Indies',
    'Afghanistan',
    'Ireland',
    'Sri Lanka',
    'Bangladesh',
    'Netherlands',
    'Namibia',
    'Papua New Guinea',
    'Oman',
    'UAE'
]

# Main venues
VENUES = [
    'Melbourne Cricket Ground',
    'Sydney Cricket Ground',
    'MCG',
    'Eden Gardens',
    'Wankhede Stadium',
    'Arun Jaitley Stadium',
    'The Oval',
    "Lord's Cricket Ground",
    'Edgbaston',
    'Auckland Domain',
    'Basin Reserve',
    'Johannesburg',
    'Cape Town',
    'Bridgetown',
    'Kingston'
]

# ===========================
# TEAM RATINGS
# ===========================

# Modify these to adjust team strength
TEAM_RATINGS = {
    'India': 92,
    'Australia': 94,
    'Pakistan': 84,
    'New Zealand': 88,
    'England': 86,
    'South Africa': 85,
    'West Indies': 78,
    'Afghanistan': 80,
    'Ireland': 76,
    'Sri Lanka': 82,
    'Bangladesh': 74,
    'Netherlands': 70,
    'Namibia': 68,
    'Papua New Guinea': 65,
    'Oman': 67,
    'UAE': 69
}

# ===========================
# VENUE ADVANTAGES
# ===========================

# Teams that have home advantage at certain venues
VENUE_ADVANTAGE = {
    'India': ['Eden Gardens', 'Wankhede Stadium', 'Arun Jaitley Stadium'],
    'Australia': ['Melbourne Cricket Ground', 'Sydney Cricket Ground', 'MCG'],
    'England': ['The Oval', "Lord's Cricket Ground", 'Edgbaston'],
    'New Zealand': ['Auckland Domain', 'Basin Reserve'],
    'South Africa': ['Johannesburg', 'Cape Town'],
    'West Indies': ['Bridgetown', 'Kingston'],
}

# ===========================
# MACHINE LEARNING
# ===========================

# Path to trained model (when integrating XGBoost)
# MODEL_PATH = './models/xgboost_model.pkl'

# Feature scaling
USE_FEATURE_SCALING = True

# ===========================
# FRONTEND CONFIGURATION
# ===========================

# Base URL for API calls (from frontend perspective)
FRONTEND_API_BASE = 'http://localhost:5000/api'

# Enable animations
ENABLE_ANIMATIONS = True

# Dark mode default
DEFAULT_DARK_MODE = True

# ===========================
# LOGGING
# ===========================

# Log level: DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_LEVEL = 'DEBUG'

# Log file path (optional)
# LOG_FILE = './logs/app.log'

# ===========================
# DATABASE (FOR FUTURE USE)
# ===========================

# Database URL (if using SQLAlchemy)
# DATABASE_URL = 'sqlite:///cricket.db'
# DATABASE_URL = 'postgresql://user:password@localhost/cricket'

# ===========================
# EMAIL (FOR FUTURE USE)
# ===========================

# Email configuration for notifications
# SMTP_SERVER = 'smtp.gmail.com'
# SMTP_PORT = 587
# SENDER_EMAIL = 'your_email@gmail.com'
# SENDER_PASSWORD = 'your_app_password'

# ===========================
# CACHING (FOR FUTURE USE)
# ===========================

# Cache predictions for performance
# ENABLE_CACHE = True
# CACHE_TTL = 3600  # seconds
