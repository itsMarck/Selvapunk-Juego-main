import React, { useState } from 'react';
import { generateCharacter } from '../utils/characterGenerator';

interface Props {
  onCharacterCreated: (character: any) => void;
}

export function CharacterCreation({ onCharacterCreated }: Props) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname) {
      const character = generateCharacter(nickname);
      onCharacterCreated(character);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7e5c2] flex items-center justify-center">
      <div className="w-[400px] h-[500px] bg-[url('/background.png')] bg-contain bg-no-repeat p-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-brown-800">CHOOSE A NAME</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#8b7355] p-4 rounded-lg">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 bg-[#d4c4a8] border-2 border-[#594a36] rounded text-center text-xl"
              maxLength={20}
            />
          </div>

          <div className="h-[250px] relative">
            {/* Character preview would go here */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <button
                type="submit"
                className="px-8 py-2 bg-[#8b7355] text-white rounded-lg hover:bg-[#594a36] transition"
              >
                VALIDATE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}