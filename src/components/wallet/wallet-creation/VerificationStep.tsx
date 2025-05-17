
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface VerificationWord {
  index: number;
  word: string;
}

interface VerificationStepProps {
  verificationWords: VerificationWord[];
  verificationError: string;
  onVerification: (userInputWords: string[]) => void;
}

export function VerificationStep({ 
  verificationWords, 
  verificationError,
  onVerification 
}: VerificationStepProps) {
  const [userInputWords, setUserInputWords] = useState<string[]>(['', '', '']);
  
  const handleInputChange = (idx: number, value: string) => {
    const newInputs = [...userInputWords];
    newInputs[idx] = value;
    setUserInputWords(newInputs);
  };
  
  const handleVerify = () => {
    onVerification(userInputWords);
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>Verify Recovery Phrase</DialogTitle>
        <DialogDescription>
          Enter the requested words from your recovery phrase
        </DialogDescription>
      </DialogHeader>
      
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
                onChange={(e) => handleInputChange(idx, e.target.value)}
                placeholder={`Enter word #${item.index + 1}`}
              />
            </div>
          ))}
          
          {verificationError && (
            <p className="text-sm text-red-500">{verificationError}</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleVerify}>
            Verify
          </Button>
        </DialogFooter>
      </div>
    </>
  );
}
