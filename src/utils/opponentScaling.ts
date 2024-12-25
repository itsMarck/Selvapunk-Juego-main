import { Character } from '../types/game';

const OPPONENT_SCALING = {
  strength: 2,    // +2 por nivel del jugador
  speed: 1.5,     // +1.5 por nivel del jugador
  agility: 1.5    // +1.5 por nivel del jugador
};

export function generateScaledOpponent(playerLevel: number, baseOpponent: Character): Character {
  // El oponente tendrá el mismo nivel que el jugador
  const opponentLevel = playerLevel;

  // Escalar stats según el nivel
  const scaledStats = {
    ...baseOpponent.stats,
    strength: Math.floor(baseOpponent.stats.strength + (OPPONENT_SCALING.strength * (opponentLevel - 1))),
    speed: Math.floor(baseOpponent.stats.speed + (OPPONENT_SCALING.speed * (opponentLevel - 1))),
    agility: Math.floor(baseOpponent.stats.agility + (OPPONENT_SCALING.agility * (opponentLevel - 1)))
  };

  return {
    ...baseOpponent,
    level: opponentLevel,
    stats: scaledStats
  };
}