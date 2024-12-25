import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Coins, AlertCircle, X } from 'lucide-react';
import { WEAPONS } from '../utils/weaponSystem';
import { getInventory, buyWeapon, equipWeapon } from '../utils/weaponSystem';
import { updateSPKBalance } from '../utils/spkManager';

interface Props {
  characterId: number;
  spkBalance: number;
  onWeaponPurchased: () => void;
  onClose: () => void;
  walletAddress: string;
}

export function WeaponShop({ characterId, spkBalance, onWeaponPurchased, onClose, walletAddress }: Props) {
  const [selectedWeapon, setSelectedWeapon] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const inventory = getInventory(characterId);

  const handlePurchase = (weaponId: number) => {
    setSelectedWeapon(weaponId);
    setShowConfirmation(true);
  };

  const confirmPurchase = () => {
    if (selectedWeapon === null) return;
    
    const weapon = WEAPONS.find(w => w.id === selectedWeapon);
    if (!weapon) return;

    if (buyWeapon(characterId, selectedWeapon, spkBalance)) {
      updateSPKBalance(walletAddress, -weapon.price);
      equipWeapon(characterId, selectedWeapon);
      onWeaponPurchased();
      setShowConfirmation(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-purple-900 to-black p-6 rounded-lg max-w-4xl w-full mx-4 shadow-2xl border border-purple-500/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-purple-400" />
            Tienda de Armas
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-800/50 px-4 py-2 rounded-full">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-yellow-100">{spkBalance} SPK</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-800/50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WEAPONS.map((weapon) => {
            const isOwned = inventory.ownedWeapons.includes(weapon.id);
            const isEquipped = inventory.equippedWeapon === weapon.id;
            const canAfford = spkBalance >= weapon.price;

            return (
              <motion.div
                key={weapon.id}
                whileHover={{ scale: 1.02 }}
                className="bg-purple-800/20 rounded-lg p-4 border border-purple-500/20"
              >
                <img
                  src={weapon.imageUrl}
                  alt={weapon.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-bold text-white mb-2">{weapon.name}</h3>
                <p className="text-purple-200 text-sm mb-4">{weapon.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 font-bold">+{weapon.damage} Daño</span>
                    <span className="text-yellow-400 font-bold">{weapon.price} SPK</span>
                  </div>
                  
                  {isOwned ? (
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-bold ${
                        isEquipped
                          ? 'bg-green-500/20 text-green-300 cursor-default'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                      onClick={() => !isEquipped && equipWeapon(characterId, weapon.id)}
                    >
                      {isEquipped ? 'Equipada' : 'Equipar'}
                    </button>
                  ) : (
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-bold ${
                        canAfford
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      }`}
                      onClick={() => canAfford && handlePurchase(weapon.id)}
                      disabled={!canAfford}
                    >
                      {canAfford ? 'Comprar' : 'SPK Insuficiente'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {showConfirmation && selectedWeapon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-purple-900 p-6 rounded-lg max-w-md w-full mx-4"
              >
                <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white text-center mb-4">
                  Confirmar Compra
                </h3>
                <p className="text-gray-300 text-center mb-6">
                  ¿Estás seguro de que quieres comprar esta arma?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmPurchase}
                    className="flex-1 py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Confirmar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}