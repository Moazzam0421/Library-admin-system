import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SeatAllocation } from "@/services/seat.service";
import { vacateSeat } from "@/services/seat.service";
import { format } from "date-fns";

interface Props {
  open: boolean;
  allocation: SeatAllocation | null;
  onClose: () => void;
}

const maskAadhaar = (aadhaar?: string) => {
  if (!aadhaar || aadhaar.length !== 12) return "—";
  return `XXXX-${aadhaar.slice(-8)}`;
};


// helper: safe date formatter
const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "—" : format(date, "dd MMM yyyy");
};

export default function SeatDetailsModal({
  open,
  allocation,
  onClose,
}: Props) {
  if (!allocation) return null;

  const { student, seatNumber, shiftCode } = allocation;

  // NEW: vacate seat handler (SAFE, ADDITIVE)
  const handleVacate = async () => {
    const ok = confirm("Are you sure you want to vacate this seat?");
    if (!ok) return;

    try {
      await vacateSeat(allocation._id);
      onClose();
      window.location.reload(); // safe & simple refresh
    } catch (error) {
      alert("Failed to vacate seat. Please try again.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>
            Complete information of the student assigned to this seat.
          </DialogDescription>
        </DialogHeader>

        {/* EXISTING CONTENT — UNCHANGED */}
        <div className="space-y-2 text-sm">
          <div>
            <b>Name:</b> {student?.name || "—"}
          </div>

          <div>
            <b>Phone:</b> {student?.phone || "—"}
          </div>

          <div>
            <b>Aadhaar:</b>{" "}
            <span className="font-mono">
              {maskAadhaar(student?.aadhaarNumber || "—")}
            </span>
          </div>

          <div>
            <b>Student ID:</b> {student?.studentId || "—"}
          </div>

          <hr />

          <div>
            <b>Seat Number:</b> {seatNumber}
          </div>

          <div>
            <b>Shift Code:</b> {shiftCode}
          </div>

          <hr />

          <div>
            <b>Monthly Fee:</b> ₹{student?.monthlyFee ?? "—"}
          </div>

          <div>
            <b>Payment Status:</b>{" "}
            <span
              className={
                student?.paymentStatus === "PAID"
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {student?.paymentStatus || "—"}
            </span>
          </div>

          <div>
            <b>Joining Date:</b> {formatDate(student?.joiningDate)}
          </div>

          <div>
            <b>Status:</b>{" "}
            {student?.isActive ? "Active" : "Inactive"}
          </div>
        </div>

        {/* NEW FEATURE — NO CONFLICT */}
        <div className="pt-4 border-t">
          <Button variant="destructive" onClick={handleVacate}>
            Vacate Seat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
