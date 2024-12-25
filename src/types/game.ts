export interface GameState {
  spkBalance: number;
  experience: number;
  level: number;
  walletAddress: string;
  energy: number;
  lastEnergyRefill: number;
  equippedWeapon?: number; // ID del arma equipada
}

export interface Character {
  id: number;
  name: string;
  level: number;
  experience: number;
  stats: {
    health: number;
    strength: number;
    agility: number;
    speed: number;
    energy: number;
  };
  imageUrl: string;
}

export interface Weapon {
  id: number;
  name: string;
  damage: number;
  price: number;
  description: string;
  imageUrl: string;
}

export interface BattleState {
  playerHealth: number;
  opponentHealth: number;
  currentTurn: 'player' | 'opponent';
  log: string[];
  isFinished: boolean;
  energyCost: number;
}