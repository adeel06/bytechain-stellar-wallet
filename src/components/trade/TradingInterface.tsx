
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function TradingInterface() {
  const [tradeType, setTradeType] = useState("buy");
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("BTC");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" onValueChange={setTradeType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coin">Coin</Label>
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger id="coin">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="BYTE">ByteChain (BYTE)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">USD</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Summary</Label>
              <div className="rounded-md bg-muted p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span>$48,235.00</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span>{amount ? parseFloat(amount).toFixed(2) : "0.00"} USD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">You will receive</span>
                  <span>
                    {amount ? (parseFloat(amount) / 48235).toFixed(8) : "0.00000000"} BTC
                  </span>
                </div>
              </div>
            </div>

            <Button className="w-full cta-gradient">Buy {selectedCoin}</Button>
          </TabsContent>
          
          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-coin">Coin</Label>
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger id="sell-coin">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="BYTE">ByteChain (BYTE)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell-amount">Amount</Label>
              <div className="relative">
                <Input
                  id="sell-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">{selectedCoin}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Summary</Label>
              <div className="rounded-md bg-muted p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span>$48,235.00</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span>{amount ? parseFloat(amount).toFixed(8) : "0.00000000"} {selectedCoin}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">You will receive</span>
                  <span>
                    {amount ? (parseFloat(amount) * 48235).toFixed(2) : "0.00"} USD
                  </span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-bytechain-blue hover:bg-bytechain-blue/90">Sell {selectedCoin}</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
