import { Character } from '../types/game';

export function calculateDamage(attacker: Character, defender: Character): {
  damage: number;
  wasEvaded: boolean;
} {
  // Probabilidad de evasión basada en la agilidad (max 25%)
  const evadeChance = defender.stats.agility / 200;
  if (Math.random() < evadeChance) {
    return { damage: 0, wasEvaded: true };
  }
  
  // Daño base determinado por la fuerza
  const baseDamage = attacker.stats.strength * 2;
  
  // Reducción por agilidad del defensor
  const reduction = defender.stats.agility * 0.5;
  const finalDamage = Math.max(1, Math.floor(baseDamage - reduction));
  
  return { damage: finalDamage, wasEvaded: false };
}

export function determineFirstAttacker(player: Character, opponent: Character): 'player' | 'opponent' {
  // La velocidad determina quién ataca primero
  const playerInitiative = player.stats.speed + (Math.random() * 5);
  const opponentInitiative = opponent.stats.speed + (Math.random() * 5);
  
  return playerInitiative >= opponentInitiative ? 'player' : 'opponent';
}