import React from 'react';
import { motion } from 'framer-motion';
import { Battery } from 'lucide-react';

interface Props {
  energy: number;
}

export function EnergyWarning({ energy }: Props) {
  if (energy > 5) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className={`
        px-6 py-3 rounded-lg shadow-lg flex items-center gap-3
        ${energy === 0 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}
      `}>
        <Battery className="w-5 h-5" />
        <div>
          {energy === 0 ? (
            <p className="font-bold">¡Sin energía!</p>
          ) : (
            <>
              <p className="font-bold">¡Energía Baja!</p>
              <p className="text-sm">Te quedan {energy} puntos de energía</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}