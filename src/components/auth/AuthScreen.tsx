
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint, Lock } from "lucide-react";
import { BiometricPrompt } from "./BiometricPrompt";
import { useNavigate } from "react-router-dom";
import { CreateWalletFlow } from "@/components/wallet/CreateWalletFlow";
import { walletExists } from "@/lib/wallet";

export function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showBiometric, setShowBiometric] = useState(false);
  const [showWalletFlow, setShowWalletFlow] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, we'll check if wallet exists
    if (!walletExists()) {
      setShowWalletFlow(true);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBiometricAuth = () => {
    setShowBiometric(true);
    // In a real app, this would trigger actual biometric auth
    setTimeout(() => {
      if (!walletExists()) {
        setShowWalletFlow(true);
      } else {
        navigate("/dashboard");
      }
    }, 1500);
  };

  const handleWalletCreated = (address: string) => {
    console.log("Wallet created with address:", address);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-bytechain-navy/5">
      <div className="container flex flex-col items-center justify-center flex-1 px-5 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-bytechain-navy dark:text-white">
              ByteChain
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Sign in to access your wallet
            </p>
          </div>

          <div className="glass-light dark:glass-dark rounded-xl p-6 mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="text-bytechain-blue"
                >
                  Forgot password?
                </Button>
              </div>
              <Button className="w-full cta-gradient" type="submit">
                <Lock className="mr-2 h-4 w-4" />
                Sign In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-background text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBiometricAuth}
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Biometric Authentication
              </Button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="text-bytechain-blue p-0">
                Create one
              </Button>
            </p>
          </div>
        </div>
      </div>

      {showBiometric && <BiometricPrompt />}
      <CreateWalletFlow 
        isOpen={showWalletFlow} 
        onComplete={handleWalletCreated}
        onClose={() => setShowWalletFlow(false)}
      />
    </div>
  );
}
