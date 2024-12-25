import React from 'react';
import { motion } from 'framer-motion';
import { X, Swords } from 'lucide-react';
import { WEAPONS } from '../utils/weaponSystem';
import { getInventory, equipWeapon } from '../utils/weaponSystem';

interface Props {
  characterId: number;
  onClose: () => void;
  onWeaponEquipped: () => void;
}

export function Inventory({ characterId, onClose, onWeaponEquipped }: Props) {
  const inventory = getInventory(characterId);

  const handleEquipWeapon = (weaponId: number) => {
    if (equipWeapon(characterId, weaponId)) {
      onWeaponEquipped();
    }
  };

  const ownedWeapons = WEAPONS.filter(weapon => 
    inventory.ownedWeapons.includes(weapon.id)
  );

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
            Inventario
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-800/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {ownedWeapons.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tienes ningún arma en tu inventario
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedWeapons.map((weapon) => {
              const isEquipped = inventory.equippedWeapon === weapon.id;

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
                    </div>
                    
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-bold ${
                        isEquipped
                          ? 'bg-green-500/20 text-green-300 cursor-default'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                      onClick={() => !isEquipped && handleEquipWeapon(weapon.id)}
                    >
                      {isEquipped ? 'Equipada' : 'Equipar'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}