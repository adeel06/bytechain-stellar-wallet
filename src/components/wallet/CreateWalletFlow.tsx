
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateWallet, encryptWallet, saveWallet } from "@/lib/wallet";

interface CreateWalletFlowProps {
  isOpen: boolean;
  onComplete: (address: string) => void;
  onClose: () => void;
}

export function CreateWalletFlow({ isOpen, onComplete, onClose }: CreateWalletFlowProps) {
  const [step, setStep] = useState<'generate' | 'backup' | 'verify' | 'complete'>('generate');
  const [wallet, setWallet] = useState<{ mnemonic: string; address: string; privateKey: string } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationWords, setVerificationWords] = useState<{index: number; word: string}[]>([]);
  const [userInputWords, setUserInputWords] = useState<string[]>(['', '', '']);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
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

  const getRandomUniqueIndices = (max: number, count: number): number[] => {
    const indices: number[] = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices.sort((a, b) => a - b); // Sort numerically
  };

  const handleCopy = async () => {
    if (!wallet) return;
    await navigator.clipboard.writeText(wallet.mnemonic);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Your recovery phrase has been copied to your clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasswordSubmit = async () => {
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

  const handleVerification = () => {
    if (!wallet) return;
    
    const mnemonicWords = wallet.mnemonic.split(' ');
    
    // Check if all inputted words match the expected words
    const allCorrect = verificationWords.every((item, idx) => 
      userInputWords[idx].toLowerCase().trim() === item.word.toLowerCase());
    
    if (allCorrect) {
      // Save wallet securely
      saveWalletData();
      setStep('complete');
    } else {
      setVerificationError("Some words don't match. Please check your recovery phrase and try again.");
    }
  };

  const saveWalletData = async () => {
    if (!wallet || !password) return;
    
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
        <DialogHeader>
          <DialogTitle>
            {step === 'generate' && 'Create Your Wallet'}
            {step === 'backup' && 'Save Your Recovery Phrase'}
            {step === 'verify' && 'Verify Recovery Phrase'}
            {step === 'complete' && 'Wallet Created Successfully!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'generate' && 'Set a password to encrypt your wallet'}
            {step === 'backup' && 'Write down these 12 words in order and keep them safe'}
            {step === 'verify' && 'Enter the requested words from your recovery phrase'}
            {step === 'complete' && 'You can now use your wallet securely'}
          </DialogDescription>
        </DialogHeader>

        {step === 'generate' && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a secure password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handlePasswordSubmit}>Continue</Button>
            </DialogFooter>
          </div>
        )}

        {step === 'backup' && wallet && (
          <div className="space-y-4 pt-4">
            <Alert variant="default" className="border-yellow-500">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription>
                This is your recovery phrase. Save it in a secure place. If you lose this, 
                we cannot help you recover your wallet. Do NOT share this with anyone.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-md">
              <div className="grid grid-cols-3 gap-2">
                {wallet.mnemonic.split(' ').map((word, i) => (
                  <div key={i} className="flex items-center border rounded px-2 py-1">
                    <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                    <span className="font-mono">{word}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCopy} className="flex-1">
                {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="pt-4">
              <DialogFooter>
                <Button onClick={handleBackupConfirm}>
                  I Have Saved My Recovery Phrase
                </Button>
              </DialogFooter>
            </div>
          </div>
        )}

        {step === 'verify' && verificationWords.length > 0 && (
          <div className="space-y-4 pt-4">
            <Alert variant="default" className="border-blue-500">
              <AlertDescription>
                Please enter the following words from your recovery phrase to confirm you've saved it.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {verificationWords.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <Label htmlFor={`word-${idx}`}>
                    Word #{item.index + 1}
                  </Label>
                  <Input
                    id={`word-${idx}`}
                    value={userInputWords[idx]}
                    onChange={(e) => {
                      const newInputs = [...userInputWords];
                      newInputs[idx] = e.target.value;
                      setUserInputWords(newInputs);
                      setVerificationError('');
                    }}
                    placeholder={`Enter word #${item.index + 1}`}
                  />
                </div>
              ))}
              
              {verificationError && (
                <p className="text-sm text-red-500">{verificationError}</p>
              )}
            </div>

            <DialogFooter>
              <Button onClick={handleVerification}>
                Verify
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-4 pt-4 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 text-green-600 p-3">
                <Check className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-medium">Wallet Created Successfully!</h3>
            <p className="text-muted-foreground">
              You're now ready to use your wallet securely.
            </p>
            <div className="border rounded-md p-3">
              <p className="font-mono text-sm break-all">{wallet?.address}</p>
            </div>
            <DialogFooter>
              <Button onClick={handleComplete}>
                Get Started
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
