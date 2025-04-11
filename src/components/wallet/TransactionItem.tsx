
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionItemProps {
  type: "received" | "sent";
  amount: number;
  symbol: string;
  address: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export function TransactionItem({
  type,
  amount,
  symbol,
  address,
  date,
  status,
}: TransactionItemProps) {
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            type === "received"
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
          )}
        >
          {type === "received" ? (
            <ArrowDown className="h-5 w-5" />
          ) : (
            <ArrowUp className="h-5 w-5" />
          )}
        </div>
        <div>
          <div className="font-medium">
            {type === "received" ? "Received" : "Sent"} {symbol}
          </div>
          <div className="text-xs text-muted-foreground">
            {shortenAddress(address)}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div
          className={cn(
            "font-medium",
            type === "received" ? "text-green-600" : "text-red-600"
          )}
        >
          {type === "received" ? "+" : "-"} {amount} {symbol}
        </div>
        <div className="flex items-center justify-end gap-1 text-xs">
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              status === "completed"
                ? "bg-green-500"
                : status === "pending"
                ? "bg-amber-500"
                : "bg-red-500"
            )}
          />
          <span className="text-muted-foreground">
            {status.charAt(0).toUpperCase() + status.slice(1)} • {date}
          </span>
        </div>
      </div>
    </div>
  );
}
