
import { useState, useEffect } from "react";
import { generateWallet } from "@/lib/wallet";

interface VerificationWord {
  index: number;
  word: string;
}

export function useWalletCreation(isOpen: boolean, step: string) {
  const [wallet, setWallet] = useState<{ mnemonic: string; address: string; privateKey: string } | null>(null);
  const [verificationWords, setVerificationWords] = useState<VerificationWord[]>([]);
  const [passwordError, setPasswordError] = useState('');
  const [verificationError, setVerificationError] = useState('');
  
  // Generate wallet on component mount
  useEffect(() => {
    if (isOpen && step === 'generate') {
      const newWallet = generateWallet();
      setWallet(newWallet);
      console.log("Wallet generated");
    }
  }, [isOpen, step]);

  // Select random words for verification when reaching the backup step
  useEffect(() => {
    if (wallet && step === 'backup') {
      // Select 3 random unique indices from the 12 word mnemonic
      const mnemonicWords = wallet.mnemonic.split(' ');
      const indices = getRandomUniqueIndices(mnemonicWords.length, 3);
      
      // Create verification words array with index and actual word
      const wordsToVerify = indices.map(index => ({
        index,
        word: mnemonicWords[index]
      }));
      
      setVerificationWords(wordsToVerify);
    }
  }, [wallet, step]);

  return {
    wallet,
    setWallet,
    verificationWords,
    setVerificationWords,
    passwordError,
    setPasswordError,
    verificationError,
    setVerificationError,
  };
}

// Helper function to get random unique indices
function getRandomUniqueIndices(max: number, count: number): number[] {
  const indices: number[] = [];
  while (indices.length < count) {
    const randomIndex = Math.floor(Math.random() * max);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  return indices.sort((a, b) => a - b); // Sort numerically
}
