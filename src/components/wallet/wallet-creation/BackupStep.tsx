
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackupStepProps {
  mnemonic: string;
  onBackupConfirm: () => void;
}

export function BackupStep({ mnemonic, onBackupConfirm }: BackupStepProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Your recovery phrase has been copied to your clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>Save Your Recovery Phrase</DialogTitle>
        <DialogDescription>
          Write down these 12 words in order and keep them safe
        </DialogDescription>
      </DialogHeader>
      
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
            {mnemonic.split(' ').map((word, i) => (
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
            <Button onClick={onBackupConfirm}>
              I Have Saved My Recovery Phrase
            </Button>
          </DialogFooter>
        </div>
      </div>
    </>
  );
}
