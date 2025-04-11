
import { Fingerprint } from "lucide-react";

export function BiometricPrompt() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="animate-fade-in bg-card p-6 rounded-lg shadow-lg text-center max-w-xs w-full">
        <div className="mb-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Fingerprint className="h-10 w-10 animate-pulse-soft" />
          </div>
        </div>
        <h3 className="text-xl font-medium mb-2">Biometric Authentication</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Verify your identity to continue
        </p>
      </div>
    </div>
  );
}
