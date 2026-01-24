import { useEffect, useState } from "react";
import api from "@/services/api";

interface RecentPayment {
  name: string;
  amount: number;
}

interface Props {
  refreshKey: number;
}

export default function RecentPayments({ refreshKey }: Props) {
  const [payments, setPayments] = useState<RecentPayment[]>([]);

  useEffect(() => {
    api.get("/payments/recent").then(res => {
      setPayments(res.data);
    });
  }, [refreshKey]);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Recent Payments</h2>

      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payments yet</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {payments.map((p, index) => (
            <li key={index} className="flex justify-between">
              <span>{p.name} paid</span>
              <span className="font-semibold text-green-600">
                ₹ {p.amount}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
