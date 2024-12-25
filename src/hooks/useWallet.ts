import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await web3Provider.send('eth_requestAccounts', []);
          setAccount(accounts[0]);
          setProvider(web3Provider);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      }
    };

    connectWallet();
  }, []);

  return { account, provider };
}