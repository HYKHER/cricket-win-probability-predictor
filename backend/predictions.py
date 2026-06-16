"""
Cricket Prediction Engine
Provides match prediction and world cup simulation functions
"""

import random
import json
from datetime import datetime

# ===========================
# TEAM RATINGS (MOCK DATA)
# ===========================

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

VENUE_ADVANTAGE = {
    'India': ['Eden Gardens', 'Wankhede Stadium', 'Arun Jaitley Stadium'],
    'Australia': ['Melbourne Cricket Ground', 'Sydney Cricket Ground', 'MCG'],
    'England': ['The Oval', "Lord's Cricket Ground", 'Edgbaston'],
    'New Zealand': ['Auckland Domain', 'Basin Reserve'],
    'South Africa': ['Johannesburg', 'Cape Town'],
    'West Indies': ['Bridgetown', 'Kingston'],
}

# ===========================
# PREDICTION FUNCTIONS
# ===========================

def predict_match(team1, team2, venue, toss_winner, toss_decision):
    """
    Predict ODI match winner using team ratings and factors
    
    Args:
        team1: First team name
        team2: Second team name
        venue: Match venue
        toss_winner: Which team won the toss
        toss_decision: 'bat' or 'field'
    
    Returns:
        Dictionary with prediction results
    """
    
    # Get base team ratings
    team1_rating = TEAM_RATINGS.get(team1, 75)
    team2_rating = TEAM_RATINGS.get(team2, 75)
    
    # Start with base probabilities
    team1_prob = team1_rating
    team2_prob = team2_rating
    
    # Toss advantage bonus (5-10%)
    toss_bonus = random.uniform(5, 10)
    if toss_winner == team1:
        team1_prob += toss_bonus
    else:
        team2_prob += toss_bonus
    
    # Venue advantage bonus (3-7%)
    venue_bonus = random.uniform(3, 7)
    if any(v in venue for v in VENUE_ADVANTAGE.get(team1, [])):
        team1_prob += venue_bonus
    if any(v in venue for v in VENUE_ADVANTAGE.get(team2, [])):
        team2_prob += venue_bonus
    
    # Add some randomness
    team1_prob += random.uniform(-5, 5)
    team2_prob += random.uniform(-5, 5)
    
    # Normalize to percentages
    total = team1_prob + team2_prob
    team1_win_probability = (team1_prob / total) * 100
    team2_win_probability = (team2_prob / total) * 100
    
    # Determine winner
    predicted_winner = team1 if team1_win_probability > team2_win_probability else team2
    
    # Generate insights
    insights = {
        'recent_form': f'{team1 if random.random() > 0.5 else team2} has recent form advantage',
        'head_to_head': f'{team1 if random.random() > 0.5 else team2} leads head to head',
        'venue_advantage': f'{team1 if any(v in venue for v in VENUE_ADVANTAGE.get(team1, [])) else team2 if any(v in venue for v in VENUE_ADVANTAGE.get(team2, [])) else "Neutral venue"}',
    }
    
    return {
        'predicted_winner': predicted_winner,
        'team1': team1,
        'team2': team2,
        'team1_win_probability': team1_win_probability / 100,
        'team2_win_probability': team2_win_probability / 100,
        'confidence': max(team1_win_probability, team2_win_probability),
        'venue': venue,
        'toss_winner': toss_winner,
        'toss_decision': toss_decision,
        'insights': insights,
        'timestamp': datetime.now().isoformat()
    }

def simulate_world_cup(num_simulations=1000):
    """
    Simulate 2027 ODI World Cup tournament
    
    Args:
        num_simulations: Number of tournament simulations to run
    
    Returns:
        Dictionary with tournament simulation results
    """
    
    teams = list(TEAM_RATINGS.keys())
    win_counts = {team: 0 for team in teams}
    
    # Run simulations
    for _ in range(num_simulations):
        # Shuffle teams for group stage
        shuffled_teams = teams.copy()
        random.shuffle(shuffled_teams)
        
        # Simulate group matches
        group_points = {team: 0 for team in teams}
        
        for i in range(len(teams)):
            for j in range(i + 1, len(teams)):
                team_a = teams[i]
                team_b = teams[j]
                
                # Predict match
                rating_a = TEAM_RATINGS[team_a]
                rating_b = TEAM_RATINGS[team_b]
                
                total = rating_a + rating_b + random.uniform(0, 20)
                prob_a = rating_a / total
                
                winner = team_a if random.random() < prob_a else team_b
                
                # Award points (3 for win, 1 for tie)
                if random.random() < 0.1:  # 10% chance of tie
                    group_points[team_a] += 1
                    group_points[team_b] += 1
                else:
                    group_points[winner] += 3
        
        # Get top 4 teams from group stage
        qualified_teams = sorted(group_points.items(), key=lambda x: x[1], reverse=True)[:4]
        qualified_teams = [team[0] for team in qualified_teams]
        
        # Semi-finals
        semifinal_winners = []
        for i in range(0, len(qualified_teams), 2):
            team_a = qualified_teams[i]
            team_b = qualified_teams[i + 1]
            
            rating_a = TEAM_RATINGS[team_a]
            rating_b = TEAM_RATINGS[team_b]
            
            total = rating_a + rating_b + random.uniform(0, 20)
            prob_a = rating_a / total
            
            winner = team_a if random.random() < prob_a else team_b
            semifinal_winners.append(winner)
        
        # Final
        if len(semifinal_winners) >= 2:
            team_a = semifinal_winners[0]
            team_b = semifinal_winners[1]
            
            rating_a = TEAM_RATINGS[team_a]
            rating_b = TEAM_RATINGS[team_b]
            
            total = rating_a + rating_b + random.uniform(0, 20)
            prob_a = rating_a / total
            
            champion = team_a if random.random() < prob_a else team_b
            win_counts[champion] += 1
    
    # Calculate win probabilities
    results = []
    for team in teams:
        win_prob = win_counts[team] / num_simulations
        results.append({
            'team': team,
            'win_count': win_counts[team],
            'win_probability': win_prob,
            'simulations': num_simulations
        })
    
    # Sort by win probability
    results.sort(key=lambda x: x['win_probability'], reverse=True)
    
    # Prepare chart data
    chart_data = {
        'teams': [r['team'] for r in results[:10]],
        'probabilities': [r['win_probability'] for r in results[:10]]
    }
    
    return {
        'results': results,
        'chart_data': chart_data,
        'total_simulations': num_simulations,
        'top_contender': results[0]['team'] if results else None,
        'timestamp': datetime.now().isoformat()
    }

# ===========================
# UTILITY FUNCTIONS
# ===========================

def get_team_stats(team):
    """Get statistics for a team"""
    return {
        'team': team,
        'rating': TEAM_RATINGS.get(team, 70),
        'home_venues': VENUE_ADVANTAGE.get(team, [])
    }

def calculate_head_to_head(team1, team2):
    """Calculate hypothetical head-to-head probability"""
    rating1 = TEAM_RATINGS.get(team1, 75)
    rating2 = TEAM_RATINGS.get(team2, 75)
    total = rating1 + rating2
    return {
        'team1': team1,
        'team2': team2,
        'team1_probability': rating1 / total,
        'team2_probability': rating2 / total
    }
