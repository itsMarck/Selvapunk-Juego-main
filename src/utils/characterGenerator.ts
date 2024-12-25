export interface Character {
  name: string;
  level: number;
  stats: {
    health: number;
    strength: number;
    agility: number;
    speed: number;
  };
  pet?: string;
}

export function generateCharacter(nickname: string): Character {
  // Use nickname as seed for deterministic generation
  const seed = nickname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate stats between 1-30
  const getRandomStat = () => 1 + Math.floor((seed * Math.random()) % 30);

  return {
    name: nickname,
    level: 1,
    stats: {
      health: 65, // Starting health is always 65
      strength: getRandomStat(),
      agility: getRandomStat(),
      speed: getRandomStat()
    }
  };
}