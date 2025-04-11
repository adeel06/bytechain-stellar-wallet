
import { AppLayout } from "@/components/layout/AppLayout";
import { AffiliateCard } from "@/components/affiliate/AffiliateCard";

export default function Affiliate() {
  return (
    <AppLayout>
      <div className="container py-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Affiliate Program</h1>
        <p className="text-muted-foreground">
          Invite friends to ByteChain and earn 10% commission on their trading fees.
        </p>
        
        <AffiliateCard />
        
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="font-medium mb-2">How it works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Share your referral code or link with friends</li>
            <li>They sign up using your referral code</li>
            <li>You earn 10% of their trading fees for life</li>
            <li>Withdraw your earnings anytime</li>
          </ol>
        </div>
      </div>
    </AppLayout>
  );
}
