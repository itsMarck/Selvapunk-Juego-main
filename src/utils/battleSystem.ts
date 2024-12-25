import { Character } from '../types/game';
import { getEquippedWeapon } from './weaponSystem';

export function calculateBattleDamage(attacker: Character, defender: Character): {
  damage: number;
  wasEvaded: boolean;
  isCritical: boolean;
} {
  // Probabilidad de evasión (max 30%)
  const evasionChance = defender.stats.agility / 150;
  if (Math.random() < evasionChance) {
    return { damage: 0, wasEvaded: true, isCritical: false };
  }

  // Obtener arma equipada y su daño adicional
  const equippedWeapon = getEquippedWeapon(attacker.id);
  const weaponDamage = equippedWeapon?.damage || 0;
  
  // Daño base basado en la fuerza + daño del arma
  let damage = (attacker.stats.strength * 1.5) + weaponDamage;
  
  // Probabilidad de crítico basada en velocidad (max 25%)
  const criticalChance = attacker.stats.speed / 200;
  const isCritical = Math.random() < criticalChance;
  
  if (isCritical) {
    damage *= 1.8; // 80% más de daño en críticos
  }

  // Reducción de daño por agilidad
  const reduction = defender.stats.agility * 0.4;
  const finalDamage = Math.max(1, Math.floor(damage - reduction));

  return {
    damage: finalDamage,
    wasEvaded: false,
    isCritical
  };
}

export function determineFirstAttacker(player: Character, opponent: Character): 'player' | 'opponent' {
  // Asegurar que la velocidad sea el factor determinante
  const playerSpeed = player.stats.speed;
  const opponentSpeed = opponent.stats.speed;
  
  if (playerSpeed > opponentSpeed) return 'player';
  if (opponentSpeed > playerSpeed) return 'opponent';
  
  // Si las velocidades son iguales, añadir un pequeño factor aleatorio
  return Math.random() < 0.5 ? 'player' : 'opponent';
}

export function canBattle(character: Character): boolean {
  return character.stats.energy > 0;
}