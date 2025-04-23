
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTokenBalances, TokenBalance } from "@/lib/tokens";
import { getTokenPrices } from "@/lib/prices";
import { Coins } from "lucide-react";

export function WalletBalances({ address }: { address: string }) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [prices, setPrices] = useState<{[key: string]: {usd: number}}>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tokenBalances, tokenPrices] = await Promise.all([
          getTokenBalances(address, "base"),
          getTokenPrices(["tether", "usd-coin"])
        ]);
        
        setBalances(tokenBalances);
        setPrices(tokenPrices);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [address]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Token Balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading balances...</div>
          ) : (
            balances.map((token) => {
              const price = prices[token.symbol.toLowerCase()]?.usd || 1; // Stablecoins default to 1
              const usdValue = Number(token.balance) * price;
              
              return (
                <div key={token.symbol} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {Number(token.balance).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
