import { Character } from '../types/game';

interface CharacterProgress {
  experience: number;
  level: number;
  energy: number;
  lastEnergyRefill: number;
}

const STORAGE_KEY = 'selvapunks_progress';

// Obtener el progreso de todos los personajes
export function getAllCharactersProgress(): Record<number, CharacterProgress> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

// Obtener el progreso de un personaje específico
export function getCharacterProgress(characterId: number): CharacterProgress {
  const allProgress = getAllCharactersProgress();
  return allProgress[characterId] || {
    experience: 0,
    level: 1,
    energy: 20,
    lastEnergyRefill: Date.now()
  };
}

// Guardar el progreso de un personaje
export function saveCharacterProgress(
  characterId: number,
  progress: CharacterProgress
): void {
  const allProgress = getAllCharactersProgress();
  allProgress[characterId] = progress;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}

// Actualizar la experiencia de un personaje
export function updateCharacterExperience(
  characterId: number,
  experienceGained: number
): CharacterProgress {
  const progress = getCharacterProgress(characterId);
  progress.experience += experienceGained;
  
  // Calcular nuevo nivel basado en la experiencia
  const newLevel = calculateLevel(progress.experience);
  progress.level = newLevel;
  
  saveCharacterProgress(characterId, progress);
  return progress;
}

// Actualizar la energía de un personaje
export function updateCharacterEnergy(
  characterId: number,
  energyChange: number
): CharacterProgress {
  const progress = getCharacterProgress(characterId);
  progress.energy = Math.max(0, Math.min(20, progress.energy + energyChange));
  progress.lastEnergyRefill = Date.now();
  
  saveCharacterProgress(characterId, progress);
  return progress;
}

// Calcular nivel basado en experiencia
function calculateLevel(experience: number): number {
  const levelThresholds = [
    0,      // Nivel 1
    100,    // Nivel 2
    250,    // Nivel 3
    500,    // Nivel 4
    1000,   // Nivel 5
    2000,   // Nivel 6
    4000,   // Nivel 7
    8000,   // Nivel 8
    16000,  // Nivel 9
    32000   // Nivel 10
  ];

  let level = 1;
  for (let i = 0; i < levelThresholds.length; i++) {
    if (experience >= levelThresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}