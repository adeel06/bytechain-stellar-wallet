
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const data = [
  { time: "00:00", price: 48000 },
  { time: "04:00", price: 47300 },
  { time: "08:00", price: 47900 },
  { time: "12:00", price: 48600 },
  { time: "16:00", price: 48200 },
  { time: "20:00", price: 49100 },
  { time: "24:00", price: 49800 },
];

type TimeframeType = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

interface PriceChartProps {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: number;
}

export function PriceChart({
  symbol,
  currentPrice,
  priceChange,
  priceChangePercentage,
}: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeType>("1D");
  const timeframes: TimeframeType[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];
  const isPositive = priceChange >= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{symbol} Price</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold">${currentPrice.toLocaleString()}</div>
            <div
              className={cn(
                "flex items-center text-sm",
                isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              <span>
                {isPositive ? "+" : ""}
                {priceChange.toFixed(2)} ({isPositive ? "+" : ""}
                {priceChangePercentage.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
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
                  formatter={(value: number) => [`$${value}`, "Price"]}
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
