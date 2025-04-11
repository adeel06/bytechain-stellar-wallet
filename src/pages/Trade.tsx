
import { AppLayout } from "@/components/layout/AppLayout";
import { PriceChart } from "@/components/trade/PriceChart";
import { TradingInterface } from "@/components/trade/TradingInterface";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoPrice } from "@/services/cryptoService";
import { useState } from "react";

export default function Trade() {
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  
  // Fetch crypto price
  const { data: cryptoData, isLoading } = useQuery({
    queryKey: ['cryptoPrice', selectedCoin],
    queryFn: () => fetchCryptoPrice(selectedCoin),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
  
  return (
    <AppLayout>
      <div className="container py-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Trade</h1>
        
        <PriceChart 
          symbol={`${selectedCoin}/USD`}
          currentPrice={cryptoData?.price}
          priceChange={cryptoData?.price ? (cryptoData.price * cryptoData.change24h / 100) : undefined}
          priceChangePercentage={cryptoData?.change24h}
        />
        
        <TradingInterface onCoinChange={setSelectedCoin} />
      </div>
    </AppLayout>
  );
}
