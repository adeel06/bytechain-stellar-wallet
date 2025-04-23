import { AppLayout } from "@/components/layout/AppLayout";
import { PortfolioCard } from "@/components/dashboard/PortfolioCard";
import { MarketCard } from "@/components/dashboard/MarketCard";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { WalletBalances } from "@/components/wallet/WalletBalances";

// Mock data
const marketData = [
  { name: "Bitcoin", symbol: "BTC", price: 48235.65, change24h: 2.34 },
  { name: "Ethereum", symbol: "ETH", price: 2786.12, change24h: -0.78 },
  { name: "ByteChain", symbol: "BYTE", price: 12.53, change24h: 15.67 },
  { name: "Solana", symbol: "SOL", price: 123.45, change24h: 4.22 },
];

const transactions = [
  {
    id: "1",
    type: "in" as const,
    amount: 0.25,
    currency: "BTC",
    date: "Today, 14:32",
    description: "Received Bitcoin",
  },
  {
    id: "2",
    type: "out" as const,
    amount: 120,
    currency: "BYTE",
    date: "Yesterday, 09:15",
    description: "Sent ByteChain",
  },
  {
    id: "3",
    type: "in" as const,
    amount: 1.5,
    currency: "ETH",
    date: "Apr 10, 18:22",
    description: "Received Ethereum",
  },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="container py-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <PortfolioCard 
          balance={57432.91} 
          change={1243.55} 
          changePercentage={2.21} 
        />
        
        <WalletBalances address="0x742d35Cc6634C0532925a3b844Bc454e4438f44e" />
        
        <MarketCard coins={marketData} />
        
        <TransactionHistory transactions={transactions} />
      </div>
    </AppLayout>
  );
}
