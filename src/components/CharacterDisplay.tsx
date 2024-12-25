import React from 'react';
import { Character } from '../utils/characterGenerator';
import { Shield, Swords, Zap } from 'lucide-react';

interface Props {
  character: Character;
  onBattle: () => void;
}

export function CharacterDisplay({ character, onBattle }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{character.name}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Level {character.level}</span>
          <div className="h-2 w-20 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(character.xp / 100) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-gray-600">Health</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${(character.stats.health / 100) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Swords className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Strength</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${(character.stats.strength / 10) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">Agility</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-yellow-500 rounded-full"
              style={{ width: `${(character.stats.agility / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {character.weapons.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Weapons</h3>
            <div className="flex flex-wrap gap-2">
              {character.weapons.map((weapon, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-sm"
                >
                  {weapon}
                </span>
              ))}
            </div>
          </div>
        )}

        {character.abilities.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {character.abilities.map((ability, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                >
                  {ability}
                </span>
              ))}
            </div>
          </div>
        )}

        {character.pet && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pet</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
              {character.pet}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onBattle}
        className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
      >
        Battle!
      </button>
    </div>
  );
}