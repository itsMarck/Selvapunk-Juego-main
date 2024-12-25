import React from 'react';
import { Shield, Swords, Zap, Wind, Battery, Star } from 'lucide-react';
import { Character } from '../types/game';
import { getCharacterProgress } from '../utils/localStorageManager';
import { calculateLevelProgress } from '../utils/levelSystem';
import { getEnergyStatus } from '../utils/energySystem';

interface Props {
  character: Character;
  onClick?: () => void;
  selected?: boolean;
}

export function CharacterCard({ character, onClick, selected }: Props) {
  const progress = getCharacterProgress(character.id);
  const { nextLevelXp, progress: expProgress } = calculateLevelProgress(progress.experience);
  const energyStatus = getEnergyStatus(progress.energy);
  const canBattle = progress.energy > 0;

  return (
    <div 
      className={`bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-lg p-6 shadow-lg transition-all ${
        selected ? 'ring-2 ring-purple-500 shadow-purple-200' : ''
      } ${onClick && canBattle ? 'cursor-pointer hover:shadow-xl transform hover:-translate-y-1' : 
          onClick && !canBattle ? 'cursor-not-allowed opacity-75' : ''}`}
      onClick={canBattle ? onClick : undefined}
    >
      <div className="relative">
        <img 
          src={character.imageUrl} 
          alt={character.name}
          className="w-full aspect-square object-contain rounded-lg mb-4 shadow-md"
        />
        <div className="absolute top-2 right-2 bg-purple-500/90 text-white px-3 py-1 rounded-full font-bold shadow-md">
          Nivel {progress.level}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-3 text-white">{character.name}</h3>

      {/* Experience Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-200">Experiencia</span>
        </div>
        <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${expProgress}%` }}
          />
        </div>
        <div className="text-sm text-purple-200 mt-1 text-center">
          {progress.experience} / {nextLevelXp} XP
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <StatBar
          icon={<Swords className="w-5 h-5 text-red-400" />}
          value={character.stats.strength}
          maxValue={100}
          color="red"
          label="Fuerza"
        />

        <StatBar
          icon={<Zap className="w-5 h-5 text-yellow-400" />}
          value={character.stats.agility}
          maxValue={100}
          color="yellow"
          label="Agilidad"
        />

        <StatBar
          icon={<Wind className="w-5 h-5 text-blue-400" />}
          value={character.stats.speed}
          maxValue={100}
          color="blue"
          label="Velocidad"
        />

        <StatBar
          icon={<Battery className={`w-5 h-5 ${energyStatus.color}`} />}
          value={progress.energy}
          maxValue={20}
          color={energyStatus.status === 'empty' ? 'red' : 'green'}
          label={`Energía (${progress.energy}/20)`}
        />
      </div>

      {progress.energy === 0 && (
        <div className="mt-4 bg-red-900/50 text-red-200 px-4 py-2 rounded-lg text-sm text-center backdrop-blur-sm">
          ¡Sin energía para batallar! Vuelve mañana.
        </div>
      )}
    </div>
  );
}

interface StatBarProps {
  icon: React.ReactNode;
  value: number;
  maxValue: number;
  color: 'red' | 'yellow' | 'blue' | 'green';
  label: string;
}

function StatBar({ icon, value, maxValue, color, label }: StatBarProps) {
  const percentage = (value / maxValue) * 100;
  const colors = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500'
  };
  const bgColors = {
    red: 'bg-red-900/30',
    yellow: 'bg-yellow-900/30',
    blue: 'bg-blue-900/30',
    green: 'bg-green-900/30'
  };

  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex-1">
        <div className={`h-2 ${bgColors[color]} rounded-full`}>
          <div 
            className={`h-full ${colors[color]} rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-bold text-white min-w-[2.5rem] text-right">{value}</span>
    </div>
  );
}