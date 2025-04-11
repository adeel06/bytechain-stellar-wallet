
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import { BellRing, ChevronRight, Fingerprint, Lock, Moon, Sun, User } from "lucide-react";

export function SettingsScreen() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <Button variant="ghost" className="w-full justify-start h-auto py-4 px-6">
              <User className="mr-3 h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Profile Information</span>
                <span className="text-xs text-muted-foreground">
                  Update your personal details
                </span>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </Button>

            <Button variant="ghost" className="w-full justify-start h-auto py-4 px-6">
              <Lock className="mr-3 h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Security</span>
                <span className="text-xs text-muted-foreground">
                  Manage passwords and 2FA
                </span>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </Button>

            <Button variant="ghost" className="w-full justify-start h-auto py-4 px-6">
              <Fingerprint className="mr-3 h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Biometric Access</span>
                <span className="text-xs text-muted-foreground">
                  Manage fingerprint and Face ID
                </span>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
          <CardDescription>Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-muted rounded-md">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </div>
              <div>
                <Label htmlFor="theme-toggle">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Turn on dark mode to reduce eye strain
                </p>
              </div>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-muted rounded-md">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor="notifications-toggle">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about important updates
                </p>
              </div>
            </div>
            <Switch id="notifications-toggle" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <Button variant="ghost" className="w-full justify-start h-auto py-4 px-6">
              <div className="flex flex-col items-start">
                <span>Terms of Service</span>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </Button>

            <Button variant="ghost" className="w-full justify-start h-auto py-4 px-6">
              <div className="flex flex-col items-start">
                <span>Privacy Policy</span>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </Button>

            <div className="py-4 px-6">
              <span className="text-sm text-muted-foreground">Version 1.0.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
