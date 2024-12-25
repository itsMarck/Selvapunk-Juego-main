import { MersenneTwister } from './mersenneTwister';

// Genera stats basados en el nombre del NFT usando un algoritmo determinista
export function generateBaseStats(nftId: number, name: string): {
  strength: number;
  agility: number;
  speed: number;
  energy: number;
} {
  // Crear hash único del nombre
  const nameHash = name.split('').reduce((acc, char, index) => {
    return acc + (char.charCodeAt(0) * (index + 1));
  }, nftId * 1337); // Multiplicador único

  const rng = new MersenneTwister(nameHash);
  
  return {
    strength: 1 + (rng.random() % 100),  // 1-100 Fuerza
    agility: 1 + (rng.random() % 100),   // 1-100 Agilidad
    speed: 1 + (rng.random() % 100),     // 1-100 Velocidad
    energy: 100                          // Energía inicial
  };
}