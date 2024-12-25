import { Character } from './characterGenerator';

interface CombatResult {
  winner: Character;
  loser: Character;
  log: string[];
}

export function simulateCombat(attacker: Character, defender: Character): CombatResult {
  const log: string[] = [];
  const attackerStats = { ...attacker.stats };
  const defenderStats = { ...defender.stats };

  while (attackerStats.health > 0 && defenderStats.health > 0) {
    // Attacker's turn
    const attackDamage = calculateDamage(attackerStats.strength, defenderStats.defense);
    defenderStats.health -= attackDamage;
    log.push(`${attacker.name} deals ${attackDamage} damage to ${defender.name}`);

    if (defenderStats.health <= 0) break;

    // Defender's turn
    const defenseDamage = calculateDamage(defenderStats.strength, attackerStats.defense);
    attackerStats.health -= defenseDamage;
    log.push(`${defender.name} deals ${defenseDamage} damage to ${attacker.name}`);
  }

  const winner = attackerStats.health > 0 ? attacker : defender;
  const loser = attackerStats.health > 0 ? defender : attacker;

  return { winner, loser, log };
}

function calculateDamage(strength: number, defense: number): number {
  const baseDamage = strength * 2;
  const reduction = defense / 2;
  return Math.max(1, Math.floor(baseDamage - reduction));
}