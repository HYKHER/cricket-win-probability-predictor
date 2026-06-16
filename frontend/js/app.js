// ===========================
// GLOBAL ERROR LOGGING (DEBUG)
// ===========================
window.onerror = function (message, source, lineno, colno, error) {
  const errorMsg = `JavaScript Error: ${message}\nSource: ${source}\nLine: ${lineno}:${colno}`;
  alert(errorMsg);
  return false;
};

window.addEventListener('unhandledrejection', function (event) {
  alert(`Unhandled Promise Rejection:\n${event.reason}`);
});

// ===========================
// CONSTANTS & CONFIG
// ===========================

const API_BASE = 'http://localhost:5000/api';

// ===========================
// DOM ELEMENTS
// ===========================

const darkToggle = document.querySelector('.dark-toggle');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a');

// ===========================
// DARK MODE TOGGLE
// ===========================

function initDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'false';
  
  if (isDarkMode) {
    document.body.classList.add('light-mode');
    updateDarkModeIcon();
  }
}

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isDarkMode = !document.body.classList.contains('light-mode');
  localStorage.setItem('darkMode', isDarkMode);
  updateDarkModeIcon();
});

function updateDarkModeIcon() {
  const isDark = !document.body.classList.contains('light-mode');
  darkToggle.textContent = isDark ? '🌙' : '☀️';
}

// ===========================
// PAGE NAVIGATION
// ===========================

function navigateTo(pageId) {
  // Hide all pages
  pages.forEach(page => page.classList.remove('active'));
  
  // Show selected page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo(0, 0);
  }
  
  // Update active nav link
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${pageId}`) {
      link.classList.add('active');
    }
  });
}

// Navigation click handlers
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = link.getAttribute('href').slice(1);
    navigateTo(pageId);
  });
});

// Hero buttons
document.addEventListener('DOMContentLoaded', () => {
  const predictBtn = document.querySelector('[data-page="match-predictor"]');
  const worldCupBtn = document.querySelector('[data-page="world-cup"]');
  
  if (predictBtn) {
    predictBtn.addEventListener('click', () => navigateTo('match-predictor'));
  }
  
  if (worldCupBtn) {
    worldCupBtn.addEventListener('click', () => navigateTo('world-cup'));
  }
  
  initDarkMode();
  updateDarkModeIcon();
});

// ===========================
// API FUNCTIONS
// ===========================

async function fetchTeams() {
  try {
    const response = await fetch(`${API_BASE}/teams`);
    if (!response.ok) throw new Error('Failed to fetch teams');
    return await response.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
}

async function fetchVenues() {
  try {
    const response = await fetch(`${API_BASE}/venues`);
    if (!response.ok) throw new Error('Failed to fetch venues');
    return await response.json();
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
}

async function predictMatch(team1, team2, venue, tossWinner, tossDecision) {
  try {
    const response = await fetch(`${API_BASE}/predict-match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        team1,
        team2,
        venue,
        toss_winner: tossWinner,
        toss_decision: tossDecision,
      }),
    });
    
    if (!response.ok) throw new Error('Prediction failed');
    return await response.json();
  } catch (error) {
    console.error('Error predicting match:', error);
    return null;
  }
}

async function simulateWorldCup() {
  try {
    const response = await fetch(`${API_BASE}/simulate-world-cup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        simulations: 1000,
      }),
    });
    
    if (!response.ok) throw new Error('Simulation failed');
    return await response.json();
  } catch (error) {
    console.error('Error simulating world cup:', error);
    return null;
  }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function getCountryFlag(teamName) {
  const flags = {
    'India': '🇮🇳',
    'Australia': '🇦🇺',
    'Pakistan': '🇵🇰',
    'New Zealand': '🇳🇿',
    'England': '🇬🇧',
    'South Africa': '🇿🇦',
    'West Indies': '🇦🇬',
    'Afghanistan': '🇦🇫',
    'Ireland': '🇮🇪',
    'Sri Lanka': '🇱🇰',
    'Bangladesh': '🇧🇩',
    'Netherlands': '🇳🇱',
    'Namibia': '🇳🇦',
    'Papua New Guinea': '🇵🇬',
    'Oman': '🇴🇲',
    'UAE': '🇦🇪',
  };
  return flags[teamName] || '🏏';
}

function createProgressBar(label, percentage) {
  return `
    <div class="probability-bar-item">
      <div class="bar-label">
        <span>${label}</span>
        <span>${percentage.toFixed(1)}%</span>
      </div>
      <div class="bar-container">
        <div class="bar-fill" style="--progress-value: ${percentage}%"></div>
      </div>
    </div>
  `;
}

// ===========================
// EXPORT FOR OTHER MODULES
// ===========================

window.app = {
  navigateTo,
  fetchTeams,
  fetchVenues,
  predictMatch,
  simulateWorldCup,
  getCountryFlag,
  createProgressBar,
};
