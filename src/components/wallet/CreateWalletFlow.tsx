
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { generateWallet, saveWallet, encryptWallet } from "@/lib/wallet";
import { PasswordStep } from "./wallet-creation/PasswordStep";
import { BackupStep } from "./wallet-creation/BackupStep";
import { VerificationStep } from "./wallet-creation/VerificationStep";
import { CompletionStep } from "./wallet-creation/CompletionStep";
import { useWalletCreation } from "@/hooks/useWalletCreation";

export interface CreateWalletFlowProps {
  isOpen: boolean;
  onComplete: (address: string) => void;
  onClose: () => void;
}

export function CreateWalletFlow({ isOpen, onComplete, onClose }: CreateWalletFlowProps) {
  const [step, setStep] = useState<'generate' | 'backup' | 'verify' | 'complete'>('generate');
  const { 
    wallet,
    setWallet,
    verificationWords,
    setVerificationWords,
    passwordError,
    setPasswordError,
    verificationError,
    setVerificationError,
  } = useWalletCreation(isOpen, step);
  const { toast } = useToast();

  const handlePasswordSubmit = async (password: string, confirmPassword: string) => {
    if (!wallet) return;
    
    // Validate password
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    setPasswordError("");
    setStep('backup');
  };

  const handleBackupConfirm = () => {
    setStep('verify');
  };

  const handleVerification = (userInputWords: string[]) => {
    if (!wallet) return;
    
    const mnemonicWords = wallet.mnemonic.split(' ');
    
    // Check if all inputted words match the expected words
    const allCorrect = verificationWords.every((item, idx) => 
      userInputWords[idx].toLowerCase().trim() === item.word.toLowerCase());
    
    if (allCorrect) {
      // Save wallet securely
      saveWalletData(userInputWords[0]); // Using first verification word as dummy password
      setStep('complete');
    } else {
      setVerificationError("Some words don't match. Please check your recovery phrase and try again.");
    }
  };

  const saveWalletData = async (password: string) => {
    if (!wallet) return;
    
    try {
      const encrypted = await encryptWallet(wallet.privateKey, password);
      await saveWallet(encrypted);
      toast({
        title: "Wallet Created",
        description: "Your wallet has been securely created and encrypted."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Creating Wallet",
        description: "There was a problem creating your wallet."
      });
    }
  };

  const handleComplete = () => {
    if (wallet) {
      onComplete(wallet.address);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-lg">
        {step === 'generate' && (
          <PasswordStep 
            onSubmit={handlePasswordSubmit}
            passwordError={passwordError}
          />
        )}

        {step === 'backup' && wallet && (
          <BackupStep
            mnemonic={wallet.mnemonic}
            onBackupConfirm={handleBackupConfirm}
          />
        )}

        {step === 'verify' && verificationWords.length > 0 && (
          <VerificationStep
            verificationWords={verificationWords}
            verificationError={verificationError}
            onVerification={handleVerification}
          />
        )}

        {step === 'complete' && wallet && (
          <CompletionStep 
            walletAddress={wallet.address}
            onComplete={handleComplete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
