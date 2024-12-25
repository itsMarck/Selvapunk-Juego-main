import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface Props {
  show: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpNotification({ show, level, onClose }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-200" />
            <div>
              <p className="font-bold">¡Nivel Alcanzado!</p>
              <p className="text-sm text-yellow-100">Has alcanzado el nivel {level}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}