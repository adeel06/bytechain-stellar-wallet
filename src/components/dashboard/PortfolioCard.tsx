
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioCardProps {
  balance: number;
  currency?: string;
  change: number;
  changePercentage: number;
}

export function PortfolioCard({
  balance,
  currency = "USD",
  change,
  changePercentage,
}: PortfolioCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-cta p-6 text-white">
        <div className="text-sm font-medium">Total Balance</div>
        <div className="flex items-baseline space-x-2">
          <CardTitle className="text-3xl font-bold">{`${currency} ${balance.toLocaleString()}`}</CardTitle>
          <div className="text-sm opacity-80">≈ 0.845 BTC</div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">24h Change</div>
          <div className="flex items-center">
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1 text-red-500" />
            )}
            <span
              className={cn(
                "font-medium",
                isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {isPositive ? "+" : ""}
              {`${currency} ${Math.abs(change).toLocaleString()} (${
                isPositive ? "+" : "-"
              }${Math.abs(changePercentage).toFixed(2)}%)`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
