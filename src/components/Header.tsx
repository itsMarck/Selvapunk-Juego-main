import React from 'react';
import { Coins } from 'lucide-react';

interface Props {
  walletAddress: string;
  spkBalance: number;
}

export function Header({ walletAddress, spkBalance }: Props) {
  const shortenedAddress = walletAddress && walletAddress.length >= 10
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : 'No Wallet Connected';

  return (
    <div className="bg-blue-100 p-4 flex justify-between items-center">
      <div className="font-mono">{shortenedAddress}</div>
      <div className="flex items-center gap-2 bg-blue-200 px-4 py-2 rounded-full">
        <Coins className="w-5 h-5 text-blue-600" />
        <span className="font-bold text-blue-800">{spkBalance} SPK</span>
      </div>
    </div>
  );
}