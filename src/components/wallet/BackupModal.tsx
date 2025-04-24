
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { restoreFromMnemonic } from "@/lib/wallet";
import { encryptWallet, saveWallet } from "@/lib/storage";

interface BackupModalProps {
  currentAddress: string;
  mnemonic: string | null;
  onRestore: (address: string) => void;
}

export function BackupModal({ currentAddress, mnemonic, onRestore }: BackupModalProps) {
  const [step, setStep] = useState<'password' | 'phrase' | 'restore'>('password');
  const [password, setPassword] = useState('');
  const [showPhrase, setShowPhrase] = useState(false);
  const [restorePhrase, setRestorePhrase] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, verify password here
    setShowPhrase(true);
    setStep('phrase');
  };

  const handleCopy = async () => {
    if (!mnemonic) return;
    await navigator.clipboard.writeText(mnemonic);
    toast({
      title: "Copied to clipboard",
      description: "Your recovery phrase has been copied to your clipboard."
    });
  };

  const handleDownload = () => {
    if (!mnemonic) return;
    const blob = new Blob([mnemonic], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-phrase.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded recovery phrase",
      description: "Store this file in a secure location."
    });
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const wallet = restoreFromMnemonic(restorePhrase);
      const encrypted = await encryptWallet(wallet.privateKey, restorePassword);
      await saveWallet(encrypted);
      onRestore(wallet.address);
      toast({
        title: "Wallet Restored",
        description: "Your wallet has been successfully restored."
      });
      setStep('password');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Restoration Failed",
        description: "Invalid recovery phrase or password."
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Backup Wallet</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {step === 'restore' ? 'Restore Wallet' : 'Backup Wallet'}
          </SheetTitle>
        </SheetHeader>

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="password">Enter Password to Continue</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between space-x-2">
              <Button type="button" variant="outline" onClick={() => setStep('restore')}>
                Restore Instead
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        )}

        {step === 'phrase' && showPhrase && mnemonic && (
          <div className="space-y-4 pt-4">
            <Alert variant="default" className="border-yellow-500">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription>
                Never share your recovery phrase. Anyone with these words can access your wallet.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Recovery Phrase</Label>
              <div className="p-4 bg-muted rounded-md break-all font-mono text-sm">
                {mnemonic}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCopy} className="flex-1">
                <Copy className="mr-2" />
                Copy
              </Button>
              <Button onClick={handleDownload} className="flex-1">
                <Download className="mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}

        {step === 'restore' && (
          <form onSubmit={handleRestore} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="restorePhrase">Recovery Phrase</Label>
              <Input
                id="restorePhrase"
                value={restorePhrase}
                onChange={(e) => setRestorePhrase(e.target.value)}
                required
                placeholder="Enter your 12-word recovery phrase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restorePassword">New Password</Label>
              <Input
                id="restorePassword"
                type="password"
                value={restorePassword}
                onChange={(e) => setRestorePassword(e.target.value)}
                required
                placeholder="Enter a new password"
              />
            </div>
            <div className="flex justify-between space-x-2">
              <Button type="button" variant="outline" onClick={() => setStep('password')}>
                Back to Backup
              </Button>
              <Button type="submit">Restore Wallet</Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
