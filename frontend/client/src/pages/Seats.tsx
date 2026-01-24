import { useEffect, useState } from "react";
import { SeatService } from "@/services/seat.service";
import type { SeatAllocation } from "@/services/seat.service";
import { Button } from "@/components/ui/button";
import { SHIFTS } from "@/utils/constants";

import AddStudentModal from "@/components/seats/AddStudentModal";
import SeatDetailsModal from "@/components/seats/SeatDetailsModal";
import { Armchair } from "lucide-react";

export default function Seats() {
  const [seats, setSeats] = useState<SeatAllocation[]>([]);

  // Shift system
  const [duration, setDuration] = useState<"4H" | "8H" | "12H">("4H");
  const [activeShift, setActiveShift] = useState<string | null>(null);

  // Filter shifts by duration
  const filteredShifts = SHIFTS.filter((s) =>
    s.code.startsWith(duration)
  );

  const [addSeat, setAddSeat] = useState<{
    seatNumber: number;
    shiftCode: string;
  } | null>(null);

  const [selectedAllocation, setSelectedAllocation] =
    useState<SeatAllocation | null>(null);

  // Load seats by shift
  const loadSeats = async (shiftCode: string) => {
    const data = await SeatService.getByShift(shiftCode);
    setSeats(data);
  };

  useEffect(() => {
    const firstShift = SHIFTS.find((s) =>
      s.code.startsWith(duration)
    );

    if (firstShift) {
      setActiveShift(firstShift.code);
    }
  }, [duration]);


  useEffect(() => {
    if (!activeShift) return;
    loadSeats(activeShift);
  }, [activeShift]);

  // Map allocations by seat number
  const seatMap = new Map<number, SeatAllocation>();
  seats.forEach((s) => seatMap.set(s.seatNumber, s));

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold">Seats & Shifts</h1>

      {/* DURATION SELECTOR */}
      <div className="flex gap-2">
        {(["4H", "8H", "12H"] as const).map((d) => (
          <Button
            key={d}
            variant={duration === d ? "default" : "outline"}
            onClick={() => setDuration(d)}
          >
            {d.replace("H", " Hours")}
          </Button>
        ))}
      </div>

      {/* SHIFT SELECTOR */}
      <div className="flex flex-wrap gap-2">
        {filteredShifts.map((shift) => (
          <Button
            key={shift.code}
            variant={activeShift === shift.code ? "default" : "outline"}
            onClick={() => setActiveShift(shift.code)}
          >
            {shift.label}
          </Button>
        ))}
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-green-400" />
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-blue-400" />
          Paid
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-red-400" />
          Unpaid
        </span>
      </div>

      {/* SEAT GRID */}
      {activeShift && (
        <div
          className="
      grid gap-3
      grid-cols-4
      sm:grid-cols-6
      md:grid-cols-8
      lg:grid-cols-10
      xl:grid-cols-12
    "
        >
          {Array.from({ length: 114 }).map((_, i) => {
            const seatNumber = i + 1;
            const allocation = seatMap.get(seatNumber);

            const statusClass = !allocation
              ? "bg-green-50 border-green-400 text-green-700 hover:bg-green-100"
              : allocation.student.paymentStatus === "PAID"
                ? "bg-blue-50 border-blue-400 text-blue-700 hover:bg-blue-100"
                : "bg-red-50 border-red-400 text-red-700 hover:bg-red-100";

            const iconClass = !allocation
              ? "text-green-600"
              : allocation.student.paymentStatus === "PAID"
                ? "text-blue-600"
                : "text-red-600";


            return (
              <button
                key={seatNumber}
                title={
                  allocation
                    ? `${allocation.student.name} (${allocation.student.paymentStatus})`
                    : `Seat ${seatNumber} - Available`
                }
                onClick={() =>
                  allocation
                    ? setSelectedAllocation(allocation)
                    : setAddSeat({ seatNumber, shiftCode: activeShift })
                }
                className={`
            h-20 w-24
            rounded-xl border
            flex flex-col items-center justify-center
            transition-all duration-200
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${statusClass}
          `

                }

              >
                <Armchair className={`h-6 w-6 mb-0.5 ${iconClass}`} />
                <span className="text-xs font-semibold">
                  {seatNumber}
                </span>

                {allocation && (
                  <span className="mt-0.5 text-[10px] truncate max-w-[90%]">
                    {allocation.student.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}


      {/* ADD STUDENT MODAL */}
      {addSeat && (
        <AddStudentModal
          open
          seatNumber={addSeat.seatNumber}
          shiftCode={addSeat.shiftCode}
          onClose={() => setAddSeat(null)}
          onSuccess={() => {
            setAddSeat(null);
            if (activeShift) loadSeats(activeShift);
          }}
        />
      )}

      {/* SEAT DETAILS MODAL */}
      <SeatDetailsModal
        open={!!selectedAllocation}
        allocation={selectedAllocation}
        onClose={() => setSelectedAllocation(null)}
      />
    </div>
  );
}
