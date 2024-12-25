import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SELVAPUNKS_ABI } from '../contracts/selvaPunksABI';
import { SELVAPUNKS_ADDRESS } from '../utils/web3Config';

export interface NFTMetadata {
  id: number;
  imageUrl: string;
}

export function useSelvaPunks(provider: ethers.providers.Web3Provider | null, account: string | null) {
  const [ownedNFTs, setOwnedNFTs] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!provider || !account) return;

      try {
        const contract = new ethers.Contract(
          SELVAPUNKS_ADDRESS,
          SELVAPUNKS_ABI,
          provider
        );

        const balance = await contract.balanceOf(account);
        const nfts: NFTMetadata[] = [];

        for (let i = 0; i < balance.toNumber(); i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(account, i);
          nfts.push({
            id: tokenId.toNumber(),
            imageUrl: `https://raw.githubusercontent.com/itsMarck/SelvaPunks/main/imagenes/${tokenId}.png`
          });
        }

        setOwnedNFTs(nfts);
      } catch (error) {
        console.error('Failed to fetch NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [provider, account]);

  return { ownedNFTs, loading };
}