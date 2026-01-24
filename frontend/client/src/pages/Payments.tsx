import { useState } from "react";
import PaymentSummary from "@/components/payments/PaymentSummary";
import PendingPayments from "@/components/payments/PendingPayments";
import RecentPayments from "@/components/payments/RecentPayments";

export default function Payments() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPayments = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Collect and track student payments
        </p>
      </header>

      <PaymentSummary refreshKey={refreshKey} />
      <PendingPayments onPaymentSuccess={refreshPayments} />
      <RecentPayments refreshKey={refreshKey} />
    </div>
  );
}
