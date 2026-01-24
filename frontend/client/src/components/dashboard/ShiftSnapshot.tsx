import { Clock } from "lucide-react";

interface Props {
  allocations: any[];
}

export default function ShiftSnapshot({ allocations }: Props) {
  const counts = {
    "4 Hours": allocations?.filter(a => a.shiftCode?.startsWith("4H")).length || 0,
    "8 Hours": allocations?.filter(a => a.shiftCode?.startsWith("8H")).length || 0,
    "12 Hours": allocations?.filter(a => a.shiftCode?.startsWith("12H")).length || 0,
  };

  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-gray-500" />
        <h3 className="font-semibold text-gray-800">
          Shift Usage
        </h3>
      </div>

      <ul className="space-y-3 text-sm">
        {Object.entries(counts).map(([label, value]) => (
          <li key={label} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              <span className="text-gray-700">{label}</span>
            </div>

            <span className="font-medium text-gray-900">
              {value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
