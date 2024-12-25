const BASE_XP_PER_LEVEL = 100;
const XP_MULTIPLIER = 1.5;

export function calculateNextLevelXp(level: number): number {
  return Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
}

export function calculateBattleExperience(
  playerLevel: number,
  opponentLevel: number,
  victory: boolean
): number {
  const baseXP = 50;
  const levelDiff = opponentLevel - playerLevel;
  const multiplier = Math.max(0.5, 1 + (levelDiff * 0.1));
  
  return victory 
    ? Math.floor(baseXP * multiplier)
    : Math.floor((baseXP * multiplier) * 0.25); // 25% XP por derrota
}