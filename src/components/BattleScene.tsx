import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Character } from '../types/game';
import { calculateBattleDamage, determineFirstAttacker, canBattle } from '../utils/battleSystem';
import { calculateBattleExperience } from '../utils/experienceCalculator';
import { BattleResult } from './BattleResult';
import { Header } from './Header';
import { BackButton } from './BackButton';
import { Shield, Swords } from 'lucide-react';
import { updateCharacterExperience, updateCharacterEnergy } from '../utils/localStorageManager';
import { refreshEnergyIfNewDay } from '../utils/energySystem';
import { getEquippedWeapon } from '../utils/weaponSystem';

interface BattleSceneProps {
  character: Character;
  opponent: Character;
  onBattleComplete: (won: boolean, experienceGained: number) => void;
  onBack: () => void;
  walletAddress: string;
  spkBalance: number;
}

export function BattleScene({
  character,
  opponent,
  onBattleComplete,
  onBack,
  walletAddress,
  spkBalance
}: BattleSceneProps) {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'opponent'>(
    determineFirstAttacker(character, opponent)
  );
  const [isAttacking, setIsAttacking] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState<{
    victory: boolean;
    experienceGained: number;
  } | null>(null);

  // Obtener el arma equipada al inicio de la batalla
  const equippedWeapon = getEquippedWeapon(character.id);

  useEffect(() => {
    refreshEnergyIfNewDay(character.id);
    if (!canBattle(character)) {
      onBack();
      return;
    }
    if (currentTurn === 'opponent') {
      handleOpponentAttack();
    }

    // Mostrar mensaje inicial si hay un arma equipada
    if (equippedWeapon) {
      setBattleLog(prev => [
        `${character.name} tiene equipada ${equippedWeapon.name} (+${equippedWeapon.damage} daño)`,
        ...prev
      ]);
    }
  }, []);

  const handleAttack = async () => {
    if (currentTurn !== 'player' || isAttacking || showResult) return;

    setIsAttacking(true);
    const result = calculateBattleDamage(character, opponent);
    
    if (result.wasEvaded) {
      setBattleLog(prev => [...prev, `¡${opponent.name} ha evadido el ataque!`]);
    } else {
      const newHealth = Math.max(0, opponentHealth - result.damage);
      setOpponentHealth(newHealth);
      const message = result.isCritical 
        ? `¡CRÍTICO! ${character.name} hace ${result.damage} puntos de daño!`
        : `${character.name} hace ${result.damage} puntos de daño`;
      setBattleLog(prev => [...prev, message]);
      
      if (newHealth <= 0) {
        const experienceGained = calculateBattleExperience(character.level, opponent.level, true);
        updateCharacterExperience(character.id, experienceGained);
        updateCharacterEnergy(character.id, -1);
        
        setBattleResult({
          victory: true,
          experienceGained
        });
        setShowResult(true);
        setIsAttacking(false);
        return;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAttacking(false);
    setCurrentTurn('opponent');
    handleOpponentAttack();
  };

  const handleOpponentAttack = async () => {
    if (showResult) return;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = calculateBattleDamage(opponent, character);
    
    if (result.wasEvaded) {
      setBattleLog(prev => [...prev, `¡${character.name} ha evadido el ataque!`]);
    } else {
      const newHealth = Math.max(0, playerHealth - result.damage);
      setPlayerHealth(newHealth);
      const message = result.isCritical 
        ? `¡CRÍTICO! ${opponent.name} hace ${result.damage} puntos de daño!`
        : `${opponent.name} hace ${result.damage} puntos de daño`;
      setBattleLog(prev => [...prev, message]);
      
      if (newHealth <= 0) {
        const experienceGained = calculateBattleExperience(character.level, opponent.level, false);
        updateCharacterExperience(character.id, experienceGained);
        updateCharacterEnergy(character.id, -1);
        
        setBattleResult({
          victory: false,
          experienceGained
        });
        setShowResult(true);
        return;
      }
    }
    
    setCurrentTurn('player');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black relative">
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10">
        <Header 
          walletAddress={walletAddress}
          spkBalance={spkBalance}
        />
        <BackButton onClick={onBack} />

        <div className="container mx-auto px-4 py-8">
          {/* Barras de Vida */}
          <div className="flex justify-between mb-8">
            <div className="w-64 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-white">{character.name}</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400">Nivel {character.level}</span>
                </div>
              </div>
              <div className="h-4 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${playerHealth}%` }}
                />
              </div>
              {equippedWeapon && (
                <div className="mt-2 text-sm text-yellow-400">
                  {equippedWeapon.name} (+{equippedWeapon.damage} daño)
                </div>
              )}
            </div>
            
            <div className="w-64 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-white">{opponent.name}</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Nivel {opponent.level}</span>
                </div>
              </div>
              <div className="h-4 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${opponentHealth}%` }}
                />
              </div>
            </div>
          </div>

          {/* Área de Batalla */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              animate={{
                x: isAttacking && currentTurn === 'player' ? 100 : 0,
                scale: isAttacking && currentTurn === 'player' ? 1.2 : 1
              }}
              transition={{ duration: 0.3 }}
              className="relative w-48 h-48"
            >
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
              {currentTurn === 'player' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-400 px-3 py-1 rounded-full text-sm font-bold"
                >
                  ¡Tu turno!
                </motion.div>
              )}
            </motion.div>

            <div className="flex items-center">
              <Swords className="w-12 h-12 text-yellow-500" />
            </div>

            <motion.div
              animate={{
                x: isAttacking && currentTurn === 'opponent' ? -100 : 0,
                scale: isAttacking && currentTurn === 'opponent' ? 1.2 : 1
              }}
              transition={{ duration: 0.3 }}
              className="relative w-48 h-48"
            >
              <img 
                src={opponent.imageUrl} 
                alt={opponent.name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
              {currentTurn === 'opponent' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-400 px-3 py-1 rounded-full text-sm font-bold"
                >
                  ¡Turno enemigo!
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Log de Batalla */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 mb-4 h-32 overflow-y-auto">
            {battleLog.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-1 text-white"
              >
                {log}
              </motion.div>
            ))}
          </div>

          {/* Controles */}
          <div className="text-center">
            <button
              onClick={handleAttack}
              disabled={currentTurn !== 'player' || isAttacking || showResult}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold disabled:opacity-50 hover:from-red-600 hover:to-red-700 transition shadow-lg disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
            >
              ¡ATACAR!
            </button>
          </div>
        </div>

        {/* Resultado de la Batalla */}
        {showResult && battleResult && (
          <BattleResult
            victory={battleResult.victory}
            experienceGained={battleResult.experienceGained}
            spkGained={battleResult.victory ? 5 : 0}
            onClose={() => onBattleComplete(battleResult.victory, battleResult.experienceGained)}
          />
        )}
      </div>
    </div>
  );
}