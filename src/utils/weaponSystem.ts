import { Weapon } from '../types/game';

export const WEAPONS: Weapon[] = [
  {
    id: 1,
    name: "Espada Básica",
    damage: 5,
    price: 100,
    description: "Una espada simple pero efectiva",
    imageUrl: "https://images.unsplash.com/photo-1589987607627-616cac5c2c5a?w=300"
  },
  {
    id: 2,
    name: "Hacha de Guerra",
    damage: 8,
    price: 200,
    description: "Un hacha poderosa que causa gran daño",
    imageUrl: "https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=300"
  },
  {
    id: 3,
    name: "Espada Legendaria",
    damage: 15,
    price: 500,
    description: "Una espada ancestral con poder místico",
    imageUrl: "https://images.unsplash.com/photo-1589987607627-616cac5c2c5a?w=300"
  }
];

const STORAGE_KEY = 'selvapunks_weapons';

interface WeaponInventory {
  ownedWeapons: number[]; // IDs de armas poseídas
  equippedWeapon?: number; // ID del arma equipada
}

export function getInventory(characterId: number): WeaponInventory {
  const stored = localStorage.getItem(`${STORAGE_KEY}_${characterId}`);
  return stored ? JSON.parse(stored) : { ownedWeapons: [] };
}

export function saveInventory(characterId: number, inventory: WeaponInventory): void {
  localStorage.setItem(`${STORAGE_KEY}_${characterId}`, JSON.stringify(inventory));
}

export function buyWeapon(characterId: number, weaponId: number, currentBalance: number): boolean {
  const weapon = WEAPONS.find(w => w.id === weaponId);
  if (!weapon || weapon.price > currentBalance) return false;

  const inventory = getInventory(characterId);
  if (inventory.ownedWeapons.includes(weaponId)) return false;

  inventory.ownedWeapons.push(weaponId);
  saveInventory(characterId, inventory);
  return true;
}

export function equipWeapon(characterId: number, weaponId: number): boolean {
  const inventory = getInventory(characterId);
  if (!inventory.ownedWeapons.includes(weaponId)) return false;

  inventory.equippedWeapon = weaponId;
  saveInventory(characterId, inventory);
  return true;
}

export function getEquippedWeapon(characterId: number): Weapon | null {
  const inventory = getInventory(characterId);
  if (!inventory.equippedWeapon) return null;

  return WEAPONS.find(w => w.id === inventory.equippedWeapon) || null;
}