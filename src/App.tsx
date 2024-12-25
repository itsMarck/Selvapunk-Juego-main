import React, { useState, useEffect } from 'react';
import { Character } from './types/game';
import { NFTCharacterSelection } from './components/NFTCharacterSelection';
import { ArenaSelection } from './components/ArenaSelection';
import { BattleScene } from './components/BattleScene';
import { useGameState } from './hooks/useGameState';
import { useWallet } from './hooks/useWallet';
import { getSPKBalance, updateSPKBalance } from './utils/spkManager';

function App() {
  const { account: walletAddress, provider } = useWallet();
  const [character, setCharacter] = useState<Character | null>(null);
  const [opponent, setOpponent] = useState<Character | null>(null);
  const [spkBalance, setSpkBalance] = useState(0);

  useEffect(() => {
    if (walletAddress) {
      const balance = getSPKBalance(walletAddress);
      setSpkBalance(balance);
      // Initialize with some SPK if new user
      if (balance === 0) {
        updateSPKBalance(walletAddress, 1000); // Start with 1000 SPK
        setSpkBalance(1000);
      }
    }
  }, [walletAddress]);

  const handleBattleComplete = (won: boolean, experienceGained: number) => {
    if (won && walletAddress) {
      const spkGained = 5;
      updateSPKBalance(walletAddress, spkGained);
      setSpkBalance(getSPKBalance(walletAddress));
    }
    setOpponent(null);
  };

  return (
    <div className="relative">
      {!character && (
        <NFTCharacterSelection 
          onCharacterSelected={setCharacter}
          walletAddress={walletAddress || ''}
          spkBalance={spkBalance}
        />
      )}
      
      {character && !opponent && (
        <ArenaSelection
          character={character}
          onOpponentSelected={setOpponent}
          onBack={() => setCharacter(null)}
          walletAddress={walletAddress || ''}
        />
      )}
      
      {character && opponent && (
        <BattleScene
          character={character}
          opponent={opponent}
          onBattleComplete={handleBattleComplete}
          onBack={() => setOpponent(null)}
          walletAddress={walletAddress || ''}
          spkBalance={spkBalance}
        />
      )}
    </div>
  );
}

export default App;