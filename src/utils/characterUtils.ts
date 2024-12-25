import { Character } from '../types/game';
import { MersenneTwister } from './mersenneTwister';
import { getCharacterProgress } from './localStorageManager';

// Stats increase per level
const STATS_INCREASE = {
  strength: 2,    // +2 attack per level
  speed: 1.5,     // +1.5 speed per level
  agility: 1.5    // +1.5 agility per level
};

export function generateCharacterFromNFT(nftId: number, name: string): Character {
  // Obtener el progreso guardado del personaje
  const progress = getCharacterProgress(nftId);
  
  // Crear semilla única basada en el ID del NFT
  const seed = nftId * 1337;
  const rng = new MersenneTwister(seed);
  
  // Generar stats base (nivel 1)
  const baseStats = {
    health: 100,
    strength: 5 + (rng.random() % 46),   // 5-50 Fuerza base
    agility: 5 + (rng.random() % 46),    // 5-50 Agilidad base
    speed: 5 + (rng.random() % 46),      // 5-50 Velocidad base
    energy: progress.energy || 20
  };

  // Aplicar incrementos por nivel
  const currentStats = {
    ...baseStats,
    strength: Math.floor(baseStats.strength + (STATS_INCREASE.strength * (progress.level - 1))),
    speed: Math.floor(baseStats.speed + (STATS_INCREASE.speed * (progress.level - 1))),
    agility: Math.floor(baseStats.agility + (STATS_INCREASE.agility * (progress.level - 1)))
  };

  return {
    id: nftId,
    name,
    level: progress.level,
    experience: progress.experience,
    stats: currentStats,
    imageUrl: `https://raw.githubusercontent.com/itsMarck/SelvaPunks/main/imagenes/${nftId}.png`
  };
}