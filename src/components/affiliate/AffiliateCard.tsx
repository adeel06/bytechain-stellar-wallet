
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Share2 } from "lucide-react";

export function AffiliateCard() {
  // This would be a real referral code in production
  const referralCode = "BYTECHAIN10";
  const referralLink = `https://bytechain.io/ref/${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    // TODO: Add toast notification
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    // TODO: Add toast notification
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join ByteChain",
          text: "Join ByteChain with my referral code and get exclusive benefits!",
          url: referralLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Affiliate Program</CardTitle>
        <CardDescription>
          Earn 10% commission on trading fees from users you refer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Your Referral Code</div>
          <div className="flex">
            <Input
              value={referralCode}
              readOnly
              className="rounded-r-none font-mono"
            />
            <Button
              variant="outline"
              className="rounded-l-none"
              onClick={handleCopyCode}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Your Referral Link</div>
          <div className="flex">
            <Input
              value={referralLink}
              readOnly
              className="rounded-r-none text-xs"
            />
            <Button
              variant="outline"
              className="rounded-l-none"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-cta p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold">$0.00</div>
              <div className="text-sm opacity-90">Total Earnings</div>
            </div>
            <div>
              <div className="text-xl font-bold">0</div>
              <div className="text-sm opacity-90">Referrals</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Your Referral Link
        </Button>
      </CardFooter>
    </Card>
  );
}
