import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export function BackButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
  );
}