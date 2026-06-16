// ==========================================================================
// Cricket Analytics Platform - Match Predictor Module
// ==========================================================================

let teams = [];
let venues = [];

async function initMatchPredictor() {
  teams = await app.fetchTeams();
  venues = await app.fetchVenues();
  
  populateSelects();
  setupFormHandlers();
  updateTossWinnerOptions();
  updateFlagDisplays();
}

function populateSelects() {
  const team1Select = document.getElementById('team1');
  const team2Select = document.getElementById('team2');
  const venueSelect = document.getElementById('venue');
  
  // Clear any existing options
  team1Select.innerHTML = '<option value="">Select Team 1</option>';
  team2Select.innerHTML = '<option value="">Select Team 2</option>';
  venueSelect.innerHTML = '<option value="">Select Venue</option>';
  
  // Populate teams
  teams.forEach(team => {
    const option1 = document.createElement('option');
    option1.value = team;
    option1.textContent = team;
    team1Select.appendChild(option1);
    
    const option2 = document.createElement('option');
    option2.value = team;
    option2.textContent = team;
    team2Select.appendChild(option2);
  });
  
  // Populate venues
  venues.forEach(venue => {
    const option = document.createElement('option');
    option.value = venue;
    option.textContent = venue;
    venueSelect.appendChild(option);
  });
}

function updateTossWinnerOptions() {
  const team1 = document.getElementById('team1').value;
  const team2 = document.getElementById('team2').value;
  const tossWinnerSelect = document.getElementById('toss-winner');
  
  if (!tossWinnerSelect) return;
  
  const previousValue = tossWinnerSelect.value;
  tossWinnerSelect.innerHTML = '<option value="">Select Toss Winner</option>';
  
  if (team1) {
    const option1 = document.createElement('option');
    option1.value = team1;
    option1.textContent = team1;
    tossWinnerSelect.appendChild(option1);
  }
  
  if (team2 && team2 !== team1) {
    const option2 = document.createElement('option');
    option2.value = team2;
    option2.textContent = team2;
    tossWinnerSelect.appendChild(option2);
  }
  
  // Preserve selection if it's still available
  if (previousValue === team1 || previousValue === team2) {
    tossWinnerSelect.value = previousValue;
  }
}

function updateFlagDisplays() {
  const team1 = document.getElementById('team1').value;
  const team2 = document.getElementById('team2').value;
  const team1Display = document.getElementById('team1-flag-display');
  const team2Display = document.getElementById('team2-flag-display');
  const team1Card = document.getElementById('team1-selector-card');
  const team2Card = document.getElementById('team2-selector-card');
  
  if (team1Display) {
    team1Display.textContent = team1 ? app.getCountryFlag(team1) : '🏏';
  }
  if (team2Display) {
    team2Display.textContent = team2 ? app.getCountryFlag(team2) : '🏏';
  }
  
  // Toggle selection highlight class
  if (team1Card) {
    if (team1) team1Card.classList.add('active-selection');
    else team1Card.classList.remove('active-selection');
  }
  
  if (team2Card) {
    if (team2) team2Card.classList.add('active-selection');
    else team2Card.classList.remove('active-selection');
  }
}

function setupFormHandlers() {
  const team1Select = document.getElementById('team1');
  const team2Select = document.getElementById('team2');
  const predictBtn = document.querySelector('[data-action="predict"]');
  
  if (team1Select) {
    team1Select.addEventListener('change', () => {
      updateTossWinnerOptions();
      updateFlagDisplays();
    });
  }
  
  if (team2Select) {
    team2Select.addEventListener('change', () => {
      updateTossWinnerOptions();
      updateFlagDisplays();
    });
  }
  
  if (predictBtn) {
    predictBtn.addEventListener('click', handlePredict);
  }
}

async function handlePredict() {
  const team1 = document.getElementById('team1').value;
  const team2 = document.getElementById('team2').value;
  const venue = document.getElementById('venue').value;
  const tossWinner = document.getElementById('toss-winner').value;
  const tossDecision = document.getElementById('toss-decision').value;
  
  // Validation
  if (!team1 || !team2 || !venue || !tossWinner || !tossDecision) {
    alert('Please fill in all match parameters.');
    return;
  }
  
  if (team1 === team2) {
    alert('Team 1 and Team 2 must be different.');
    return;
  }
  
  showLoadingState();
  
  const result = await app.predictMatch(team1, team2, venue, tossWinner, tossDecision);
  
  if (result) {
    displayPredictionResults(result, team1, team2);
  } else {
    showErrorState();
  }
}

function showLoadingState() {
  const resultsSection = document.querySelector('.results-section');
  resultsSection.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `;
}

function showErrorState() {
  const resultsSection = document.querySelector('.results-section');
  resultsSection.innerHTML = `
    <div class="empty-state-card" style="border-color: rgba(239, 68, 68, 0.3);">
      <div class="empty-icon" style="opacity: 0.9;">⚠️</div>
      <p>Error calculating telemetry prediction. Please try checking your API connectivity and try again.</p>
    </div>
  `;
}

function displayPredictionResults(result, team1, team2) {
  const resultsSection = document.querySelector('.results-section');
  const winner = result.predicted_winner;
  const confidence = result.confidence || 50;
  const prob1 = result.team1_win_probability * 100;
  const prob2 = result.team2_win_probability * 100;
  const insights = result.insights || {};
  
  resultsSection.innerHTML = `
    <div class="glass-card winner-output-card">
      <span class="winner-crown">🏆</span>
      <h3 style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">Projected Winner</h3>
      <div class="winner-team-title">${app.getCountryFlag(winner)} ${winner}</div>
      <div class="winner-badge">${confidence.toFixed(1)}% Confidence</div>
    </div>
    
    <div class="glass-card h2h-probability-card">
      <h3>Win Probability Split</h3>
      <div class="probability-bar">
        ${app.createProgressBar(team1, prob1)}
        ${app.createProgressBar(team2, prob2)}
      </div>
    </div>
    
    <div class="glass-card insights-card">
      <h3>Match Analytics Insights</h3>
      
      <div class="insight-item">
        <div class="insight-icon">📈</div>
        <div class="insight-details">
          <span class="insight-label">Recent Form Advantage</span>
          <span class="insight-value">${insights.recent_form || 'Form statistics are balanced.'}</span>
        </div>
      </div>
      
      <div class="insight-item">
        <div class="insight-icon">⚔️</div>
        <div class="insight-details">
          <span class="insight-label">Head to Head Analysis</span>
          <span class="insight-value">${insights.head_to_head || 'No recent matching datasets.'}</span>
        </div>
      </div>
      
      <div class="insight-item">
        <div class="insight-icon">🏟️</div>
        <div class="insight-details">
          <span class="insight-label">Venue Factor</span>
          <span class="insight-value">${insights.venue_advantage || 'No strong venue historical skew.'}</span>
        </div>
      </div>
    </div>
  `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMatchPredictor);
} else {
  initMatchPredictor();
}
