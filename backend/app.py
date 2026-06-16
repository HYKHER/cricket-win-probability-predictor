"""
Cricket Analytics Platform - Flask Backend
Provides API endpoints for match prediction and world cup simulation
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from predictions import predict_match, simulate_world_cup

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ===========================
# SAMPLE DATA
# ===========================

TEAMS = [
    'India', 'Australia', 'Pakistan', 'New Zealand', 'England',
    'South Africa', 'West Indies', 'Afghanistan', 'Ireland',
    'Sri Lanka', 'Bangladesh', 'Netherlands', 'Namibia',
    'Papua New Guinea', 'Oman', 'UAE'
]

VENUES = [
    'Melbourne Cricket Ground', 'Sydney Cricket Ground', 'MCG',
    'Eden Gardens', 'Wankhede Stadium', 'Arun Jaitley Stadium',
    'The Oval', 'Lord\'s Cricket Ground', 'Edgbaston',
    'Auckland Domain', 'Basin Reserve', 'Johannesburg',
    'Cape Town', 'Bridgetown', 'Kingston'
]

# ===========================
# API ENDPOINTS
# ===========================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'API is running'}), 200

@app.route('/api/teams', methods=['GET'])
def get_teams():
    """Get list of available teams"""
    return jsonify(TEAMS), 200

@app.route('/api/venues', methods=['GET'])
def get_venues():
    """Get list of available venues"""
    return jsonify(VENUES), 200

@app.route('/api/predict-match', methods=['POST'])
def predict_match_endpoint():
    """
    Predict match winner
    
    Expected JSON:
    {
        "team1": "India",
        "team2": "Australia",
        "venue": "MCG",
        "toss_winner": "India",
        "toss_decision": "bat"
    }
    """
    try:
        data = request.json
        
        # Validate input
        required_fields = ['team1', 'team2', 'venue', 'toss_winner', 'toss_decision']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Get prediction
        result = predict_match(
            team1=data['team1'],
            team2=data['team2'],
            venue=data['venue'],
            toss_winner=data['toss_winner'],
            toss_decision=data['toss_decision']
        )
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/simulate-world-cup', methods=['POST'])
def simulate_world_cup_endpoint():
    """
    Simulate 2027 ODI World Cup
    
    Expected JSON:
    {
        "simulations": 1000
    }
    """
    try:
        data = request.json
        simulations = data.get('simulations', 1000)
        
        # Validate
        if not isinstance(simulations, int) or simulations < 1 or simulations > 10000:
            return jsonify({'error': 'Simulations must be between 1 and 10000'}), 400
        
        # Run simulation
        result = simulate_world_cup(simulations)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===========================
# ERROR HANDLERS
# ===========================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ===========================
# MAIN
# ===========================

if __name__ == '__main__':
    print("""
    +------------------------------------------------------------+
    |  Cricket Analytics Platform - Backend API                  |
    |  Running on http://localhost:5000                          |
    |  Features:                                                 |
    |     - Match Prediction API                                  |
    |     - World Cup Simulation API                              |
    |     - Real-time Analytics                                   |
    +------------------------------------------------------------+
    """)
    
    app.run(debug=True, host='localhost', port=5000)
