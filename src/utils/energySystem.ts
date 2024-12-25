import { Character } from '../types/game';

const ENERGY_CONFIG = {
  MAX_ENERGY: 20,
  RECOVERY_RATE: 1, // Energy points per hour
  STORAGE_KEY: 'energy_system'
};

interface EnergyData {
  energy: number;
  lastRefill: number;
  lastReset: number;
}

export function refreshEnergyIfNewDay(characterId: number): void {
  try {
    const now = new Date();
    const data = getEnergyData(characterId);
    const lastReset = new Date(data.lastReset);

    // Check if it's a new day (past midnight)
    if (isNewDay(lastReset, now)) {
      data.energy = ENERGY_CONFIG.MAX_ENERGY;
      data.lastReset = now.getTime();
      data.lastRefill = now.getTime();
      saveEnergyData(characterId, data);
      
      // Trigger notification
      notifyEnergyRestored();
    }
  } catch (error) {
    console.error('Error refreshing energy:', error);
  }
}

export function getEnergyStatus(energy: number): {
  status: 'high' | 'medium' | 'low' | 'empty';
  color: string;
  nextRecovery?: Date;
} {
  if (energy === 0) return { status: 'empty', color: 'text-red-500' };
  if (energy <= 5) return { status: 'low', color: 'text-orange-500' };
  if (energy <= 10) return { status: 'medium', color: 'text-yellow-500' };
  return { status: 'high', color: 'text-green-500' };
}

export function consumeEnergy(characterId: number, amount: number = 1): boolean {
  try {
    const data = getEnergyData(characterId);
    
    // Check if enough energy is available
    if (data.energy < amount) return false;
    
    data.energy = Math.max(0, data.energy - amount);
    saveEnergyData(characterId, data);
    return true;
  } catch (error) {
    console.error('Error consuming energy:', error);
    return false;
  }
}

export function calculateRecoveryTime(characterId: number): Date | null {
  try {
    const data = getEnergyData(characterId);
    if (data.energy >= ENERGY_CONFIG.MAX_ENERGY) return null;

    const now = new Date();
    const lastRefill = new Date(data.lastRefill);
    const hoursNeeded = Math.ceil((ENERGY_CONFIG.MAX_ENERGY - data.energy) / ENERGY_CONFIG.RECOVERY_RATE);
    
    return new Date(lastRefill.getTime() + (hoursNeeded * 60 * 60 * 1000));
  } catch (error) {
    console.error('Error calculating recovery time:', error);
    return null;
  }
}

function getEnergyData(characterId: number): EnergyData {
  const stored = localStorage.getItem(`${ENERGY_CONFIG.STORAGE_KEY}_${characterId}`);
  return stored ? JSON.parse(stored) : {
    energy: ENERGY_CONFIG.MAX_ENERGY,
    lastRefill: Date.now(),
    lastReset: Date.now()
  };
}

function saveEnergyData(characterId: number, data: EnergyData): void {
  localStorage.setItem(`${ENERGY_CONFIG.STORAGE_KEY}_${characterId}`, JSON.stringify(data));
}

function isNewDay(lastReset: Date, now: Date): boolean {
  return lastReset.getDate() !== now.getDate() ||
         lastReset.getMonth() !== now.getMonth() ||
         lastReset.getFullYear() !== now.getFullYear();
}

function notifyEnergyRestored(): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('¡Energía Restaurada!', {
      body: 'Tu energía ha sido restaurada a 20 puntos.',
      icon: '/vite.svg'
    });
  }
}