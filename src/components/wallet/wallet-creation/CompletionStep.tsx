
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface CompletionStepProps {
  walletAddress: string;
  onComplete: () => void;
}

export function CompletionStep({ walletAddress, onComplete }: CompletionStepProps) {
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
