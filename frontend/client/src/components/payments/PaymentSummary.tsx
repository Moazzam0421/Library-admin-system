import { useEffect, useState } from "react";
import api from "@/services/api";

export default function PaymentSummary({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState({
    pendingAmount: 0,
    paidThisMonth: 0,
    unpaidStudents: 0,
    lastPayment: null as string | null,
  });

  useEffect(() => {
    api.get("/payments/summary").then(res => {
      setData(res.data);
    });
  }, [refreshKey]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card title="Pending Amount" value={`₹ ${data.pendingAmount}`} accent="text-red-600" />
      <Card title="Paid This Month" value={`₹ ${data.paidThisMonth}`} accent="text-green-600" />
      <Card title="Unpaid Students" value={`${data.unpaidStudents}`} />
      <Card
        title="Last Payment"
        value={data.lastPayment ? new Date(data.lastPayment).toLocaleDateString() : "—"}
      />
    </div>
  );
}

function Card({ title, value, accent }: any) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`mt-2 text-xl font-bold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
