import React from 'react';
import { Coins } from 'lucide-react';

interface Props {
  balance: number;
}

export function SPKDisplay({ balance }: Props) {
  return (
    <div className="fixed top-4 right-4 bg-yellow-100 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
      <Coins className="w-5 h-5 text-yellow-600" />
      <span className="font-bold text-yellow-800">{balance} SPK</span>
    </div>
  );
}