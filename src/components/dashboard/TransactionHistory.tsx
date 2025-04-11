
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "in" | "out";
  amount: number;
  currency: string;
  date: string;
  description: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between px-6"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    tx.type === "in"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                  )}
                >
                  {tx.type === "in" ? (
                    <ArrowDown className="h-5 w-5" />
                  ) : (
                    <ArrowUp className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{tx.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {tx.date}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  "font-medium",
                  tx.type === "in" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {tx.type === "in" ? "+" : "-"} {tx.amount} {tx.currency}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
