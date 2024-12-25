import { Character } from '../types/game';

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 500 },
  { level: 5, xp: 1000 },
  { level: 6, xp: 2000 },
  { level: 7, xp: 4000 },
  { level: 8, xp: 8000 },
  { level: 9, xp: 16000 },
  { level: 10, xp: 32000 },
];

// Stats increase per level with proper typing
interface StatsIncrease {
  strength: number;
  speed: number;
  agility: number;
}

const STATS_INCREASE_PER_LEVEL: StatsIncrease = {
  strength: 2,    // +2 attack per level
  speed: 1.5,     // +1.5 speed per level
  agility: 1.5    // +1.5 agility per level
};

// Stats history tracking
interface StatsHistory {
  timestamp: number;
  level: number;
  stats: Character['stats'];
}

const STATS_HISTORY_KEY = 'stats_history';

export function calculateLevelProgress(experience: number) {
  let currentLevel = 1;
  let nextLevelXp = 100;

  for (let i = 0; i < LEVEL_THRESHOLDS.length - 1; i++) {
    if (experience >= LEVEL_THRESHOLDS[i].xp && experience < LEVEL_THRESHOLDS[i + 1].xp) {
      currentLevel = LEVEL_THRESHOLDS[i].level;
      nextLevelXp = LEVEL_THRESHOLDS[i + 1].xp;
      break;
    }
  }

  const currentLevelXp = LEVEL_THRESHOLDS[currentLevel - 1].xp;
  const progress = ((experience - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return {
    currentLevel,
    nextLevelXp,
    progress: Math.min(100, Math.max(0, progress)),
    totalXpForCurrentLevel: currentLevelXp
  };
}

export function calculateStatsForLevel(baseStats: Character['stats'], level: number) {
  try {
    const newStats = {
      ...baseStats,
      strength: Math.floor(baseStats.strength + (STATS_INCREASE_PER_LEVEL.strength * (level - 1))),
      speed: Math.floor(baseStats.speed + (STATS_INCREASE_PER_LEVEL.speed * (level - 1))),
      agility: Math.floor(baseStats.agility + (STATS_INCREASE_PER_LEVEL.agility * (level - 1)))
    };

    // Validate stats are within acceptable ranges
    if (Object.values(newStats).some(stat => stat < 0 || stat > 999)) {
      throw new Error('Stats calculation resulted in invalid values');
    }

    // Record stats history
    recordStatsHistory(level, newStats);

    return newStats;
  } catch (error) {
    console.error('Error calculating stats:', error);
    return baseStats; // Return original stats if calculation fails
  }
}

function recordStatsHistory(level: number, stats: Character['stats']) {
  try {
    const history = getStatsHistory();
    history.push({
      timestamp: Date.now(),
      level,
      stats
    });
    
    // Keep only last 10 entries to prevent excessive storage
    while (history.length > 10) {
      history.shift();
    }
    
    localStorage.setItem(STATS_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error recording stats history:', error);
  }
}

export function getStatsHistory(): StatsHistory[] {
  try {
    const history = localStorage.getItem(STATS_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading stats history:', error);
    return [];
  }
}