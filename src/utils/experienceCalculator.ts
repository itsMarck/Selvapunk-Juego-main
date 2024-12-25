import { Character } from '../types/game';

export function calculateBattleExperience(
  playerLevel: number,
  opponentLevel: number,
  victory: boolean
): number {
  const baseXP = 50;
  const levelDiff = opponentLevel - playerLevel;
  const multiplier = Math.max(0.5, 1 + (levelDiff * 0.2));
  
  return victory 
    ? Math.floor(baseXP * multiplier)
    : Math.floor((baseXP * multiplier) * 0.25); // 25% XP for defeat
}