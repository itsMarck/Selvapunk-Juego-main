import { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { calculateLevelProgress } from '../utils/levelSystem';

const INITIAL_STATE: GameState = {
  spkBalance: 0,
  experience: 0,
  level: 1,
  walletAddress: '',
  energy: 20,
  lastEnergyRefill: Date.now()
};

export function useGameState(walletAddress: string) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(`gameState_${walletAddress}`);
    return saved ? JSON.parse(saved) : { ...INITIAL_STATE, walletAddress };
  });
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    localStorage.setItem(`gameState_${walletAddress}`, JSON.stringify(gameState));
  }, [gameState, walletAddress]);

  const addSPK = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      spkBalance: prev.spkBalance + amount
    }));
  };

  const addExperience = (amount: number) => {
    setGameState(prev => {
      const newExp = prev.experience + amount;
      const { currentLevel } = calculateLevelProgress(newExp);
      
      const updatedState = {
        ...prev,
        experience: newExp,
        level: currentLevel
      };

      if (currentLevel > prev.level) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      
      return updatedState;
    });
  };

  const useEnergy = () => {
    setGameState(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 1),
      lastEnergyRefill: Date.now()
    }));
  };

  return { 
    gameState, 
    addSPK, 
    addExperience, 
    useEnergy,
    showLevelUp,
    dismissLevelUp: () => setShowLevelUp(false)
  };
}