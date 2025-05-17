
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TwoFactorSetup } from "./TwoFactorSetup";
import { QrCode, Smartphone, MessageSquare } from "lucide-react";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function TwoFactorModal({ isOpen, onClose, onComplete }: TwoFactorModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'app' | 'sms' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  
  // Mock username - in a real app, this would come from your authentication system
  const username = "user@example.com";
  
  return (
    <>
      {selectedMethod ? (
        <TwoFactorSetup 
          isOpen={isOpen}
          onClose={() => {
            setSelectedMethod(null);
            onClose();
          }}
          onComplete={onComplete}
          username={username}
          method={selectedMethod}
          phoneNumber={phoneNumber}
        />
      ) : (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose 2FA Method</DialogTitle>
              <DialogDescription>
                Select your preferred two-factor authentication method
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <Button
                variant="outline"
                className="flex justify-between items-center p-6 h-auto"
                onClick={() => setSelectedMethod('app')}
              >
                <div className="flex items-center">
                  <QrCode className="h-8 w-8 mr-4 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">Authenticator App</div>
                    <div className="text-sm text-muted-foreground">
                      Google Authenticator, Authy, or similar apps
                    </div>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="flex justify-between items-center p-6 h-auto"
                onClick={() => setSelectedMethod('sms')}
              >
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 mr-4 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">SMS Verification</div>
                    <div className="text-sm text-muted-foreground">
                      Receive codes via text message
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
