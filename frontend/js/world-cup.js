// ==========================================================================
// Cricket Analytics Platform - World Cup Predictor Module
// ==========================================================================

let worldCupData = null;
let tournamentChartInstance = null;

function initWorldCupPredictor() {
  const simulateBtn = document.querySelector('[data-action="simulate"]');
  if (simulateBtn) {
    simulateBtn.addEventListener('click', handleSimulate);
  }

  // Listen to dark toggle clicks to re-render the chart with correct theme colors
  document.querySelector('.dark-toggle')?.addEventListener('click', () => {
    setTimeout(() => {
      if (worldCupData && worldCupData.chart_data) {
        displayChart(worldCupData.chart_data);
      }
    }, 100);
  });
}

async function handleSimulate() {
  showLoadingState();
  
  const result = await app.simulateWorldCup();
  
  if (result) {
    worldCupData = result;
    displayWorldCupResults(result);
  } else {
    showErrorState();
  }
}

function showLoadingState() {
  const dashboard = document.getElementById('world-cup-dashboard');
  const emptyState = document.getElementById('world-cup-empty-state');
  
  if (emptyState) emptyState.style.display = 'none';
  if (dashboard) {
    dashboard.style.display = 'block';
    dashboard.innerHTML = `
      <div class="loading" style="min-height: 400px; display: flex; flex-direction: column; gap: 1rem; align-items: center; justify-content: center;">
        <div class="spinner"></div>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Running 1,000 Monte Carlo tournament simulations...</p>
      </div>
    `;
  }
}

function showErrorState() {
  const dashboard = document.getElementById('world-cup-dashboard');
  const emptyState = document.getElementById('world-cup-empty-state');
  
  if (emptyState) emptyState.style.display = 'none';
  if (dashboard) {
    dashboard.style.display = 'block';
    dashboard.innerHTML = `
      <div class="empty-state-card" style="border-color: rgba(239, 68, 68, 0.3); min-height: 400px;">
        <div class="empty-icon">⚠️</div>
        <p>Error running simulation calculation. Check server connection and try again.</p>
      </div>
    `;
  }
}

function displayWorldCupResults(data) {
  const results = data.results || [];
  
  // Re-inject the dashboard structure
  const dashboard = document.getElementById('world-cup-dashboard');
  if (!dashboard) return;
  
  dashboard.innerHTML = `
    <!-- TOP 3 PODIUM -->
    <h3 class="section-title text-center" style="margin-bottom: 2rem;">🏆 Projected Podium Finishers</h3>
    <div id="podium-container" class="podium-container"></div>
    
    <!-- GRID LAYOUT FOR CHART & TABLE -->
    <div class="simulation-dashboard-grid">
      <!-- Chart Column -->
      <div class="glass-card chart-card">
        <h3 class="card-title">Win Probability Distribution</h3>
        <div class="chart-container-canvas">
          <canvas id="tournament-chart"></canvas>
        </div>
      </div>

      <!-- Standings Column -->
      <div class="glass-card standings-card">
        <h3 class="card-title">Full Tournament Odds</h3>
        <div id="probability-table-container"></div>
      </div>
    </div>

    <!-- OTHER CONTENDERS -->
    <div class="other-contenders-section">
      <h3 class="section-title text-center" style="margin-bottom: 2rem;">Remaining Contenders</h3>
      <div class="world-cup-results" id="team-cards-container"></div>
    </div>
  `;

  // Populate Podium (Top 3)
  displayPodium(results);
  
  // Populate Probability Table (All Teams)
  displayProbabilityTable(results);
  
  // Populate Remaining Contenders (Rank 4 to End)
  displayTeamCards(results);
  
  // Draw Interactive Chart
  if (data.chart_data) {
    displayChart(data.chart_data);
  }
}

function displayPodium(results) {
  const podiumContainer = document.getElementById('podium-container');
  if (!podiumContainer || results.length < 3) return;
  
  const top3 = results.slice(0, 3);
  const podiumItems = [
    { rank: 1, title: 'Champion', icon: '🥇', team: top3[0].team, prob: (top3[0].win_probability * 100).toFixed(1) + '%' },
    { rank: 2, title: 'Runner-up', icon: '🥈', team: top3[1].team, prob: (top3[1].win_probability * 100).toFixed(1) + '%' },
    { rank: 3, title: '3rd Place', icon: '🥉', team: top3[2].team, prob: (top3[2].win_probability * 100).toFixed(1) + '%' },
  ];
  
  podiumContainer.innerHTML = podiumItems.map(item => `
    <div class="podium-column rank-${item.rank}">
      <div class="glass-card podium-card">
        <div class="podium-badge">${item.icon}</div>
        <div class="podium-flag">${app.getCountryFlag(item.team)}</div>
        <div class="podium-name">${item.team}</div>
        <div class="podium-chance">${item.prob}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Win Probability</div>
      </div>
    </div>
  `).join('');
}

function displayProbabilityTable(results) {
  const tableContainer = document.getElementById('probability-table-container');
  if (!tableContainer) return;
  
  let tableHTML = `
    <table class="probability-table">
      <thead>
        <tr>
          <th style="width: 15%;">Rank</th>
          <th style="width: 55%;">Team</th>
          <th style="width: 30%; text-align: right;">Win Odds</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  results.forEach((team, index) => {
    const winChance = (team.win_probability * 100).toFixed(1);
    tableHTML += `
      <tr>
        <td><strong>#${index + 1}</strong></td>
        <td><strong>${app.getCountryFlag(team.team)} ${team.team}</strong></td>
        <td style="color: var(--primary); font-weight: 700; text-align: right;">${winChance}%</td>
      </tr>
    `;
  });
  
  tableHTML += `
      </tbody>
    </table>
  `;
  
  tableContainer.innerHTML = tableHTML;
}

function displayTeamCards(results) {
  const cardsContainer = document.getElementById('team-cards-container');
  if (!cardsContainer) return;
  
  let cardsHTML = '';
  // Show teams from index 3 onwards
  results.slice(3).forEach(team => {
    const winChance = (team.win_probability * 100).toFixed(1);
    cardsHTML += `
      <div class="glass-card team-card">
        <div class="team-flag">${app.getCountryFlag(team.team)}</div>
        <div class="team-name">${team.team}</div>
        <div class="team-chance">${winChance}%</div>
        <div class="team-chance-label">Win Probability</div>
      </div>
    `;
  });
  
  cardsContainer.innerHTML = cardsHTML;
}

function displayChart(chartData) {
  const canvas = document.getElementById('tournament-chart');
  if (!canvas) return;
  
  // Destroy previous chart instance if it exists to clean up references
  if (tournamentChartInstance) {
    tournamentChartInstance.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  const isDarkMode = !document.body.classList.contains('light-mode');
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  
  // Show top 8 teams in the chart for clarity
  const teams = chartData.teams.slice(0, 8);
  const probabilities = chartData.probabilities.slice(0, 8).map(p => +(p * 100).toFixed(1));
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 450, 0);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(1, '#10b981');
  
  tournamentChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: teams,
      datasets: [{
        label: 'Win Probability (%)',
        data: probabilities,
        backgroundColor: gradient,
        borderWidth: 0,
        borderRadius: 5,
        barPercentage: 0.65
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: isDarkMode ? '#0c1017' : '#ffffff',
          titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
          bodyColor: isDarkMode ? '#94a3b8' : '#475569',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return ` Probability: ${context.parsed.x}%`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: gridColor,
            drawBorder: false
          },
          ticks: {
            color: textColor,
            font: {
              family: 'Inter',
              size: 11
            },
            callback: function(value) {
              return value + '%';
            }
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            font: {
              family: 'Outfit',
              size: 12,
              weight: '600'
            }
          }
        }
      }
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWorldCupPredictor);
} else {
  initWorldCupPredictor();
}
