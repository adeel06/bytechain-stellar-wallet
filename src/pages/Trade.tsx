
import { AppLayout } from "@/components/layout/AppLayout";
import { PriceChart } from "@/components/trade/PriceChart";
import { TradingInterface } from "@/components/trade/TradingInterface";

export default function Trade() {
  return (
    <AppLayout>
      <div className="container py-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Trade</h1>
        
        <PriceChart 
          symbol="BTC/USD"
          currentPrice={48235.65}
          priceChange={1243.55}
          priceChangePercentage={2.65}
        />
        
        <TradingInterface />
      </div>
    </AppLayout>
  );
}
