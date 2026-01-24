import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StudentService } from "@/services/student.service";
import { SeatService } from "@/services/seat.service";
import { useToast } from "@/hooks/use-toast";


interface Props {
  open: boolean;
  seatNumber: number;
  shiftCode: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddStudentModal({
  open,
  seatNumber,
  shiftCode,
  onClose,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [loading, setLoading] = useState(false);


  const submit = async () => {
    if (loading) return;

    if (!name || !phone || !aadhaar || !joiningDate) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill all required fields.",
      });
      return;
    }

    if (phone.length !== 10) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Phone number must be exactly 10 digits.",
      });
      return;
    }

    if (aadhaar.length !== 12) {
      toast({
        variant: "destructive",
        title: "Invalid Aadhaar number",
        description: "Aadhaar number must be exactly 12 digits.",
      });
      return;
    }

    try {
      setLoading(true);

      const student = await StudentService.addStudent({
        name,
        phone,
        aadhaarNumber: aadhaar,
        joiningDate,
        shiftCode
      });

      await SeatService.assign({
        studentId: student._id,
        seatNumber,
        shiftCode,
      });

      toast({
        title: "Student added successfully",
        description: `${name} assigned to Seat ${seatNumber}`,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to add student",
        description:
          err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };


  const feeByShift = shiftCode.startsWith("4H")
    ? 300
    : shiftCode.startsWith("8H")
      ? 500
      : shiftCode.startsWith("12H")
        ? 700
        : 0;



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="add-student-desc">
        <DialogHeader>
          <DialogTitle>Add Student – Seat {seatNumber}</DialogTitle>
          <DialogDescription>
            Enter student details to assign this seat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Phone Number" value={phone} maxLength={10} inputMode="numeric" pattern="[0-9]*" onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setPhone(v); }} />
          <Input
            placeholder="Aadhaar Number"
            value={aadhaar}
            maxLength={12}
            inputMode="numeric"
            onChange={(e) =>
              setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))
            }
          />
          <Input value={feeByShift} disabled className="bg-gray-100 cursor-not-allowed" />
          <Input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button disabled={loading} onClick={submit}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Adding...
                </span>
              ) : (
                "Add Student"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
