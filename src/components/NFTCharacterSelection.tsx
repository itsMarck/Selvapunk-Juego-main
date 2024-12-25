import React, { useState } from 'react';
import { Character } from '../types/game';
import { CharacterCard } from './CharacterCard';
import { Wallet, ShoppingBag } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useSelvaPunks } from '../hooks/useSelvaPunks';
import { generateCharacterFromNFT } from '../utils/characterUtils';
import { WeaponShop } from './WeaponShop';

interface Props {
  onCharacterSelected: (character: Character) => void;
  walletAddress: string;
  spkBalance: number;
}

export function NFTCharacterSelection({ onCharacterSelected, walletAddress, spkBalance }: Props) {
  const { account, provider } = useWallet();
  const { ownedNFTs, loading } = useSelvaPunks(provider, account);
  const [showShop, setShowShop] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSelectNFT = (nftId: number) => {
    const character = generateCharacterFromNFT(nftId, `SelvaPunk #${nftId}`);
    setSelectedCharacter(character);
    onCharacterSelected(character);
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center p-4">
        <div className="bg-black/50 backdrop-blur-sm p-8 rounded-xl text-center max-w-md w-full border border-purple-500/20">
          <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-white">Conecta tu Billetera</h2>
          <p className="text-purple-200 mb-6">Conecta tu billetera MetaMask para acceder a tus SelvaPunks NFTs</p>
          <button 
            onClick={() => window.ethereum?.request({ method: 'eth_requestAccounts' })}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition transform hover:-translate-y-1"
          >
            Conectar MetaMask
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-4">Cargando NFTs...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Selecciona tu Guerrero</h2>
          {selectedCharacter && (
            <button
              onClick={() => setShowShop(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            >
              <ShoppingBag className="w-5 h-5" />
              Tienda de Armas
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedNFTs.map((nft) => (
            <CharacterCard
              key={nft.id}
              character={generateCharacterFromNFT(nft.id, `SelvaPunk #${nft.id}`)}
              onClick={() => handleSelectNFT(nft.id)}
            />
          ))}
        </div>
      </div>

      {showShop && selectedCharacter && (
        <WeaponShop
          characterId={selectedCharacter.id}
          spkBalance={spkBalance}
          onWeaponPurchased={() => setShowShop(false)}
          onClose={() => setShowShop(false)}
        />
      )}
    </div>
  );
}