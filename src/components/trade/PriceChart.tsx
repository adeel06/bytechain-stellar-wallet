
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { fetchCryptoPrice, CryptoPrice } from "@/services/cryptoService";
import { useQuery } from "@tanstack/react-query";

// Mock price history data - in a real app, this would come from an API
const generateMockHistoryData = (basePrice: number, timeframe: string) => {
  let points = 7;
  let fluctuation = 0.02;
  let timeFormat = "MMM DD";
  
  switch(timeframe) {
    case "1D":
      points = 24;
      fluctuation = 0.005;
      timeFormat = "HH:mm";
      break;
    case "1W":
      points = 7;
      fluctuation = 0.02;
      break;
    case "1M":
      points = 30;
      fluctuation = 0.05;
      break;
    case "3M":
      points = 90;
      fluctuation = 0.08;
      break;
    case "1Y":
      points = 12;
      fluctuation = 0.15;
      break;
    case "ALL":
      points = 24;
      fluctuation = 0.5;
      break;
  }
  
  const data = [];
  let price = basePrice;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() * 2 - 1) * fluctuation * price;
    price += change;
    data.push({ time: `Point ${i+1}`, price: Math.max(price, price * 0.1) });
  }
  
  return data;
};

type TimeframeType = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

interface PriceChartProps {
  symbol: string;
  currentPrice?: number;
  priceChange?: number;
  priceChangePercentage?: number;
}

export function PriceChart({
  symbol,
  currentPrice,
  priceChange,
  priceChangePercentage,
}: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeType>("1D");
  const timeframes: TimeframeType[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];
  
  // Fetch crypto price using React Query
  const { data: cryptoData, isLoading } = useQuery({
    queryKey: ['cryptoPrice', symbol],
    queryFn: () => fetchCryptoPrice(symbol.split('/')[0]),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
  
  // Use provided values or data from API
  const price = currentPrice || cryptoData?.price || 0;
  const change = priceChange || (cryptoData?.change24h ? (cryptoData.price * cryptoData.change24h / 100) : 0);
  const changePercentage = priceChangePercentage || cryptoData?.change24h || 0;
  const isPositive = change >= 0;
  
  // Generate chart data based on current price and selected timeframe
  const [chartData, setChartData] = useState(generateMockHistoryData(price, timeframe));
  
  // Update chart data when price or timeframe changes
  useEffect(() => {
    setChartData(generateMockHistoryData(price, timeframe));
  }, [price, timeframe]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {isLoading ? 'Loading...' : `${symbol} Price`}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold">
              ${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div
              className={cn(
                "flex items-center text-sm",
                isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              <span>
                {isPositive ? "+" : ""}
                {change.toFixed(2)} ({isPositive ? "+" : ""}
                {changePercentage.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A59A1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1A59A1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12 }} 
                />
                <YAxis 
                  domain={["dataMin - 500", "dataMax + 500"]} 
                  hide 
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                  labelFormatter={(label) => `Time: ${label}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "0.5rem",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#1A59A1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className="h-8"
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
