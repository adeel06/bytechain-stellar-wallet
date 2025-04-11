
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Coin {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

interface MarketCardProps {
  coins: Coin[];
}

export function MarketCard({ coins }: MarketCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Market</CardTitle>
          <Badge variant="outline" className="font-normal">
            24h
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4">
          {coins.map((coin) => (
            <div
              key={coin.symbol}
              className="flex items-center justify-between px-6"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {coin.symbol.slice(0, 1)}
                </div>
                <div>
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {coin.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  ${coin.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-end">
                  {coin.change24h > 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  <span
                    className={cn(
                      "text-xs",
                      coin.change24h > 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {coin.change24h > 0 ? "+" : ""}
                    {coin.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
