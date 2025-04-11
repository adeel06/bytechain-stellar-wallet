
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Copy, QrCode } from "lucide-react";

interface WalletCardProps {
  name: string;
  balance: number;
  symbol: string;
  address: string;
  usdValue: number;
}

export function WalletCard({
  name,
  balance,
  symbol,
  address,
  usdValue,
}: WalletCardProps) {
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    // TODO: Add toast notification
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {name}
            <Badge variant="outline" className="font-normal">
              {symbol}
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold">
              {balance} {symbol}
            </div>
            <div className="text-sm text-muted-foreground">
              ≈ ${usdValue.toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
            <div className="text-sm truncate max-w-[70%]" title={address}>
              {shortenAddress(address)}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy address</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <QrCode className="h-4 w-4" />
                <span className="sr-only">Show QR code</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button className="flex-1 bg-bytechain-blue hover:bg-bytechain-blue/90">
              <ArrowDown className="mr-2 h-4 w-4" />
              Receive
            </Button>
            <Button className="flex-1 cta-gradient hover:opacity-90">
              <ArrowUp className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
