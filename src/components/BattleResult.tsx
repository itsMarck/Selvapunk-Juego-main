import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, XCircle, Star, Coins } from 'lucide-react';

interface Props {
  victory: boolean;
  experienceGained: number;
  spkGained: number;
  onClose: () => void;
}

export function BattleResult({ victory, experienceGained, spkGained, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-6"
        >
          {victory ? (
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            </motion.div>
          )}
          <h2 className="text-3xl font-bold mb-2 text-white">
            {victory ? '¡Victoria!' : 'Derrota'}
          </h2>
          <p className="text-gray-300">
            {victory 
              ? '¡Has ganado la batalla!' 
              : 'Has perdido esta vez, ¡pero puedes intentarlo de nuevo!'}
          </p>
        </motion.div>

        <div className="space-y-4 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-900/50 p-4 rounded-lg border border-blue-700"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-400" />
              <div className="font-medium text-blue-300">Experiencia Ganada</div>
            </div>
            <div className="text-3xl font-bold text-blue-200">+{experienceGained} XP</div>
          </motion.div>

          {victory && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-yellow-900/50 p-4 rounded-lg border border-yellow-700"
            >
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <div className="font-medium text-yellow-300">SPK Ganados</div>
              </div>
              <div className="text-3xl font-bold text-yellow-200">+{spkGained} SPK</div>
            </motion.div>
          )}
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition transform hover:-translate-y-1 active:translate-y-0"
        >
          Continuar
        </motion.button>
      </motion.div>
    </motion.div>
  );
}