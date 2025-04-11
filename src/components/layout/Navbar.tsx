
import { useTheme } from "@/context/ThemeContext";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Make sure the component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/271c7d6d-4e0d-40e7-8bbd-eafd1ed3286f.png" 
              alt="ByteChain Logo" 
              className="h-8 w-8 dark:drop-shadow-[0_0_8px_rgba(0,170,255,0.5)]" 
            />
            <span className="font-bold text-xl text-bytechain-navy dark:text-white">
              ByteChain
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-bytechain-blue text-white">BC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
