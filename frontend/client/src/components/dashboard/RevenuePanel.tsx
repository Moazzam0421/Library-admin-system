import { IndianRupee } from "lucide-react";

interface Props {
  paid: number;
  pending: number;
}

export default function RevenuePanel({ paid, pending }: Props) {
  const total = paid + pending;

  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <IndianRupee className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold text-gray-800">
          Revenue Overview
        </h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Paid</span>
          <span className="font-medium text-green-600">
            ₹ {paid}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Pending</span>
          <span className="font-medium text-red-600">
            ₹ {pending}
          </span>
        </div>

        <div className="pt-2 border-t flex justify-between">
          <span className="font-semibold text-gray-800">
            Total
          </span>
          <span className="font-semibold text-gray-900">
            ₹ {total}
          </span>
        </div>
      </div>
    </div>
  );
}
