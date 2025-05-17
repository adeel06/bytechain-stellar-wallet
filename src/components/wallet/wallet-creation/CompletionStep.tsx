
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CompletionStepProps {
  walletAddress: string;
  onComplete: () => void;
}

export function CompletionStep({ walletAddress, onComplete }: CompletionStepProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Your wallet address has been copied to your clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Wallet Created Successfully!</DialogTitle>
        <DialogDescription>You can now use your wallet securely</DialogDescription>
      </DialogHeader>
      
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
          <p className="font-mono text-sm break-all">{walletAddress}</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied" : "Copy Address"}
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={onComplete}>
            Get Started
          </Button>
        </DialogFooter>
      </div>
    </>
  );
}
