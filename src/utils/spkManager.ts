import { GameState } from '../types/game';

const SPK_BALANCES_KEY = 'spk_balances';

interface SPKBalance {
  address: string;
  balance: number;
}

export function getSPKBalance(address: string): number {
  try {
    const stored = localStorage.getItem(SPK_BALANCES_KEY);
    const balances: SPKBalance[] = stored ? JSON.parse(stored) : [];
    const userBalance = balances.find(b => b.address.toLowerCase() === address.toLowerCase());
    return userBalance?.balance || 0;
  } catch (error) {
    console.error('Error getting SPK balance:', error);
    return 0;
  }
}

export function updateSPKBalance(address: string, amount: number): boolean {
  try {
    const stored = localStorage.getItem(SPK_BALANCES_KEY);
    const balances: SPKBalance[] = stored ? JSON.parse(stored) : [];
    const userIndex = balances.findIndex(b => b.address.toLowerCase() === address.toLowerCase());

    if (userIndex >= 0) {
      balances[userIndex].balance = Math.max(0, balances[userIndex].balance + amount);
    } else {
      balances.push({ address, balance: Math.max(0, amount) });
    }

    localStorage.setItem(SPK_BALANCES_KEY, JSON.stringify(balances));
    return true;
  } catch (error) {
    console.error('Error updating SPK balance:', error);
    return false;
  }
}