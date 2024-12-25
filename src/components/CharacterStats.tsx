import React from 'react';
import { Shield, Star, Battery } from 'lucide-react';
import { getCharacterProgress } from '../utils/localStorageManager';
import { calculateLevelProgress } from '../utils/levelSystem';

interface Props {
  characterId: number;
  showDetailed?: boolean;
}

export function CharacterStats({ characterId, showDetailed = false }: Props) {
  const progress = getCharacterProgress(characterId);
  const { nextLevelXp, progress: expProgress } = calculateLevelProgress(progress.experience);

  return (
    <div className="bg-yellow-100/90 rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-yellow-600" />
          <span className="font-bold text-yellow-800">Nivel {progress.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Battery className="w-5 h-5 text-green-600" />
          <span className="font-bold text-green-800">{progress.energy}/20</span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">Experiencia</span>
          </div>
          <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all"
              style={{ width: `${expProgress}%` }}
            />
          </div>
          {showDetailed && (
            <div className="text-xs text-yellow-800 mt-1 text-center">
              {progress.experience} / {nextLevelXp} XP
            </div>
          )}
        </div>
      </div>
    </div>
  );
}