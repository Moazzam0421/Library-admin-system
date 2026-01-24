import { AlertTriangle } from "lucide-react";

interface Props {
  allocations: any[];
}

export default function AttentionPanel({ allocations }: Props) {
  const unpaid = allocations?.filter(
    (a) => a.student?.paymentStatus === "UNPAID"
  );

  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold text-gray-800">
          Attention Required
        </h3>
      </div>

      {unpaid?.length ? (
        <ul className="space-y-3">
          {unpaid.slice(0, 5).map((a, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-gray-700">
                  Seat {a.seatNumber} —{" "}
                  <span className="font-medium">
                    {a.student.name}
                  </span>
                </span>
              </div>

              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                UNPAID
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">
          No unpaid students 🎉
        </p>
      )}
    </div>
  );
}
