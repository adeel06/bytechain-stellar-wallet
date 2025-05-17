
import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, QrCode, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Generate a secret key - in a real app, this would come from your backend
const generateSecretKey = () => {
  // Generate a 16-character random string using A-Z and 2-7 (base32 encoding)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  const randomValues = new Uint8Array(16);
  crypto.getRandomValues(randomValues);
  randomValues.forEach(val => {
    result += chars[val % chars.length];
  });
  return result;
};

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  username: string;
  method: 'app' | 'sms';
  phoneNumber?: string;
}

export function TwoFactorSetup({ 
  isOpen, 
  onClose, 
  onComplete, 
  username, 
  method,
  phoneNumber 
}: TwoFactorSetupProps) {
  const [step, setStep] = useState<'qrcode' | 'verify' | 'phone'>('qrcode');
  const [secretKey, setSecretKey] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [phone, setPhone] = useState(phoneNumber || '');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Generate a new secret key when the dialog opens
      setSecretKey(generateSecretKey());
      setStep(method === 'app' ? 'qrcode' : 'phone');
      setVerificationCode('');
    }
  }, [isOpen, method]);

  const appName = "ByteChain";
  // Use a different, more reliable QR code service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(username)}?secret=${secretKey}&issuer=${encodeURIComponent(appName)}`;

  const handleCopySecretKey = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopied(true);
      toast({
        title: "Secret key copied",
        description: "The secret key has been copied to your clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the secret key manually.",
        variant: "destructive"
      });
    }
  };

  const handleSendSMS = () => {
    // In a real app, this would send an SMS code via your backend
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      setStep('verify');
      toast({
        title: "SMS Code Sent",
        description: `Verification code has been sent to ${phone}`
      });
    }, 1500);
  };

  const handleVerifyCode = () => {
    setIsVerifying(true);
    
    // Mock verification - in a real app, this would verify against the secret key
    // using a TOTP algorithm, typically on the server side
    setTimeout(() => {
      // For demo purposes, we'll accept any 6-digit code
      const isValid = /^\d{6}$/.test(verificationCode);
      
      if (isValid) {
        toast({
          title: "2FA Enabled",
          description: "Two-factor authentication has been successfully set up."
        });
        onComplete();
      } else {
        toast({
          title: "Verification Failed",
          description: "The verification code is invalid. Please try again.",
          variant: "destructive"
        });
      }
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            {step === 'qrcode' 
              ? "Scan the QR code with your authenticator app or enter the secret key manually."
              : step === 'phone'
              ? "Enter your phone number to receive verification codes via SMS."
              : "Enter the 6-digit verification code from your authenticator app or SMS."}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'qrcode' ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="border rounded-md p-4 bg-white">
              <img 
                src={qrCodeUrl} 
                alt="QR Code for 2FA setup" 
                width={200} 
                height={200} 
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.onerror = null;
                  toast({
                    title: "QR Code Error",
                    description: "Failed to load QR code. Please use the secret key instead.",
                    variant: "destructive"
                  });
                }}
              />
            </div>
            
            <div className="w-full space-y-2">
              <Label htmlFor="secret-key">Secret Key</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="secret-key" 
                  value={secretKey} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={handleCopySecretKey}
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 w-full text-center">
              <h3 className="font-semibold">How to set up:</h3>
              <ol className="text-sm text-left space-y-2 text-muted-foreground">
                <li>1. Open your authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>2. Add a new account by scanning the QR code or entering the secret key</li>
                <li>3. Click "Continue" when your app shows a 6-digit code</li>
              </ol>
            </div>
            
            <Button onClick={() => setStep('verify')} className="w-full">
              Continue
            </Button>
          </div>
        ) : step === 'phone' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="+1 (555) 555-5555"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Enter your phone number to receive verification codes via SMS
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="sm:w-auto w-full"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendSMS} 
                disabled={!phone || isVerifying}
                className="sm:w-auto w-full"
              >
                {isVerifying ? "Sending..." : "Send Code"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input 
                id="verification-code"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center font-mono text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground text-center">
                Enter the 6-digit code from your {method === 'app' ? 'authenticator app' : 'SMS message'}
              </p>
            </div>
            
            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button 
                variant="outline" 
                onClick={() => setStep(method === 'app' ? 'qrcode' : 'phone')}
                className="sm:w-auto w-full"
              >
                Back
              </Button>
              <Button 
                onClick={handleVerifyCode} 
                disabled={verificationCode.length !== 6 || isVerifying}
                className="sm:w-auto w-full"
              >
                {isVerifying ? "Verifying..." : "Verify & Enable 2FA"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
