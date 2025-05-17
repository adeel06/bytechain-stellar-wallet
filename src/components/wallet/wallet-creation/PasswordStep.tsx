
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface PasswordStepProps {
  onSubmit: (password: string, confirmPassword: string) => void;
  passwordError: string;
}

export function PasswordStep({ onSubmit, passwordError }: PasswordStepProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = () => {
    onSubmit(password, confirmPassword);
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Your Wallet</DialogTitle>
        <DialogDescription>Set a password to encrypt your wallet</DialogDescription>
      </DialogHeader>
      
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
          <Button onClick={handleSubmit}>Continue</Button>
        </DialogFooter>
      </div>
    </>
  );
}
