import { Armchair } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  seat: {
    seatNumber: number;
    status: "AVAILABLE" | "PAID" | "UNPAID";
    student?: { name: string };
  };
  onClick: () => void;
}

export default function SeatCard({ seat, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-16 w-full rounded-lg border",
        "flex flex-col items-center justify-center",
        "transition-all hover:scale-[1.04]",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        seat.status === "AVAILABLE" &&
          "bg-green-50 border-green-300 focus:ring-green-400",
        seat.status === "PAID" &&
          "bg-blue-50 border-blue-300 focus:ring-blue-400",
        seat.status === "UNPAID" &&
          "bg-red-50 border-red-300 focus:ring-red-400"
      )}
      title={
        seat.student
          ? `${seat.student.name} (${seat.status})`
          : `Seat ${seat.seatNumber} – Available`
      }
    >
      <Armchair
        className={cn(
          "h-5 w-5",
          seat.status === "AVAILABLE" && "text-green-600",
          seat.status === "PAID" && "text-blue-600",
          seat.status === "UNPAID" && "text-red-600"
        )}
      />

      <span className="text-[11px] font-semibold">
        {seat.seatNumber}
      </span>

      {seat.student && (
        <span className="text-[9px] truncate max-w-[90%]">
          {seat.student.name}
        </span>
      )}
    </button>
  );
}
