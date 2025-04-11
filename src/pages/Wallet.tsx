
import { AppLayout } from "@/components/layout/AppLayout";
import { WalletCard } from "@/components/wallet/WalletCard";
import { TransactionItem } from "@/components/wallet/TransactionItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const wallets = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    balance: 0.54321,
    address: "bc1q9zpgru0xnsm93eq96hzh2pjk7fqz4lfa6vg89r",
    usdValue: 26215.25,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    balance: 4.2,
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    usdValue: 11701.70,
  },
  {
    name: "ByteChain",
    symbol: "BYTE",
    balance: 1250,
    address: "BYTE1Q9ZPGRU0XNSM93EQ96HZH2PJK7FQZ4LFA6VG89R",
    usdValue: 15662.50,
  },
];

const transactions = [
  {
    id: "1",
    type: "received" as const,
    amount: 0.15,
    symbol: "BTC",
    address: "bc1q9zpgru0xnsm93eq96hzh2pjk7fqz4lfa6vg89r",
    date: "Today, 14:32",
    status: "completed" as const,
  },
  {
    id: "2",
    type: "sent" as const,
    amount: 50,
    symbol: "BYTE",
    address: "BYTE1Q9ZPGRU0XNSM93EQ96HZH2PJK7FQZ4LFA6VG89R",
    date: "Yesterday, 09:15",
    status: "completed" as const,
  },
  {
    id: "3",
    type: "received" as const,
    amount: 1.2,
    symbol: "ETH",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    date: "Apr 10, 18:22",
    status: "completed" as const,
  },
  {
    id: "4",
    type: "sent" as const,
    amount: 0.05,
    symbol: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    date: "Apr 9, 11:05",
    status: "pending" as const,
  },
];

export default function Wallet() {
  return (
    <AppLayout>
      <div className="container py-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Wallet</h1>
        
        <div className="space-y-6">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.symbol}
              name={wallet.name}
              symbol={wallet.symbol}
              balance={wallet.balance}
              address={wallet.address}
              usdValue={wallet.usdValue}
            />
          ))}
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 bg-card rounded-lg p-4">
            <div className="space-y-0 divide-y">
              {transactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  type={tx.type}
                  amount={tx.amount}
                  symbol={tx.symbol}
                  address={tx.address}
                  date={tx.date}
                  status={tx.status}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="sent" className="mt-4 bg-card rounded-lg p-4">
            <div className="space-y-0 divide-y">
              {transactions
                .filter((tx) => tx.type === "sent")
                .map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    type={tx.type}
                    amount={tx.amount}
                    symbol={tx.symbol}
                    address={tx.address}
                    date={tx.date}
                    status={tx.status}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="received" className="mt-4 bg-card rounded-lg p-4">
            <div className="space-y-0 divide-y">
              {transactions
                .filter((tx) => tx.type === "received")
                .map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    type={tx.type}
                    amount={tx.amount}
                    symbol={tx.symbol}
                    address={tx.address}
                    date={tx.date}
                    status={tx.status}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
