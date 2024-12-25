import React, { useState, useEffect } from 'react';
import { Character } from '../types/game';
import { CharacterCard } from './CharacterCard';
import { BackButton } from './BackButton';
import { ShoppingBag, Briefcase, Coins } from 'lucide-react';
import { WeaponShop } from './WeaponShop';
import { Inventory } from './Inventory';
import { generateScaledOpponent } from '../utils/opponentScaling';
import { generateCharacterFromNFT } from '../utils/characterUtils';
import { getSPKBalance } from '../utils/spkManager';

interface Props {
  character: Character;
  onOpponentSelected: (opponent: Character) => void;
  onBack: () => void;
  walletAddress: string;
}

export function ArenaSelection({ 
  character, 
  onOpponentSelected, 
  onBack,
  walletAddress
}: Props) {
  const [opponents, setOpponents] = useState<Character[]>([]);
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [spkBalance, setSpkBalance] = useState(0);

  useEffect(() => {
    if (walletAddress) {
      setSpkBalance(getSPKBalance(walletAddress));
    }
  }, [walletAddress]);

  useEffect(() => {
    const generateOpponents = () => {
      const usedIds = new Set<number>();
      const newOpponents: Character[] = [];

      while (newOpponents.length < 6) {
        const randomId = Math.floor(Math.random() * 50);
        if (!usedIds.has(randomId) && randomId !== character.id) {
          usedIds.add(randomId);
          const baseOpponent = generateCharacterFromNFT(randomId, `SelvaPunk #${randomId}`);
          const scaledOpponent = generateScaledOpponent(character.level, baseOpponent);
          newOpponents.push(scaledOpponent);
        }
      }
      return newOpponents;
    };

    setOpponents(generateOpponents());
  }, [character.id, character.level]);

  const handleWeaponPurchased = () => {
    setShowShop(false);
    setSpkBalance(getSPKBalance(walletAddress));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black relative">
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back Button and Wallet Address */}
            <div className="flex items-center gap-4">
              <div className="w-10">
                <BackButton onClick={onBack} />
              </div>
              <span className="font-mono text-purple-200 bg-purple-900/50 px-3 py-1 rounded-lg text-sm border border-purple-500/20">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>

            {/* Right side - Actions and Balance */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowInventory(true)}
                className="flex items-center gap-2 bg-purple-900/50 hover:bg-purple-800 text-purple-200 px-4 py-2 rounded-lg transition border border-purple-500/20"
              >
                <Briefcase className="w-5 h-5" />
                <span className="hidden sm:inline">Inventario</span>
              </button>
              
              <button
                onClick={() => setShowShop(true)}
                className="flex items-center gap-2 bg-purple-900/50 hover:bg-purple-800 text-purple-200 px-4 py-2 rounded-lg transition border border-purple-500/20"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline">Tienda</span>
              </button>

              <div className="flex items-center gap-2 bg-purple-900/50 px-4 py-2 rounded-lg border border-purple-500/20">
                <Coins className="w-5 h-5 text-purple-300" />
                <span className="font-bold text-purple-200">{spkBalance} SPK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">Arena de Batalla</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personaje del Jugador */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Tu Personaje</h3>
            <div className="max-w-md mx-auto">
              <CharacterCard character={character} />
            </div>
          </div>

          {/* Oponentes */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Elige tu Oponente</h3>
            <div className="grid grid-cols-2 gap-4">
              {opponents.map((opponent) => (
                <CharacterCard
                  key={`opponent-${opponent.id}`}
                  character={opponent}
                  onClick={() => onOpponentSelected(opponent)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showShop && (
        <WeaponShop
          characterId={character.id}
          spkBalance={spkBalance}
          onWeaponPurchased={handleWeaponPurchased}
          onClose={() => setShowShop(false)}
          walletAddress={walletAddress}
        />
      )}

      {showInventory && (
        <Inventory
          characterId={character.id}
          onClose={() => setShowInventory(false)}
          onWeaponEquipped={() => setShowInventory(false)}
        />
      )}
    </div>
  );
}