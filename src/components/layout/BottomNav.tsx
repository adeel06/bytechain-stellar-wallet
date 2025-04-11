
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BarChart3, Home, Plus, Settings, Wallet } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Wallet",
      href: "/wallet",
      icon: Wallet,
    },
    {
      label: "Trade",
      href: "/trade",
      icon: BarChart3,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col h-full rounded-none px-3 text-muted-foreground",
              pathname === item.href && "text-bytechain-blue"
            )}
            onClick={() => navigate(item.href)}
          >
            <item.icon
              className={cn(
                "h-5 w-5",
                pathname === item.href && "text-bytechain-blue"
              )}
            />
            <span className="text-xs mt-1">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
