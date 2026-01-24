import { useEffect, useState } from "react";
import api from "@/services/api";
import PaymentCard from "./PaymentCard";
import CollectPaymentModal from "./CollectPaymentModal";
import type { Student } from "@/types/student";

interface Props {
  onPaymentSuccess: () => void;
}

export default function PendingPayments({ onPaymentSuccess }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);

  const fetchPending = async () => {
    const res = await api.get("/payments/pending");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {students.map(student => (
          <PaymentCard
            key={student._id}
            name={student.name}
            seat={student.seatAllocation?.seatNumber}
            shift={student.seatAllocation?.shiftCode}
            amount={student.monthlyFee}
            onCollect={() => {
              setSelectedStudent(student);
              setOpen(true);
            }}
          />
        ))}
      </div>

      {selectedStudent && (
        <CollectPaymentModal
          open={open}
          onClose={() => setOpen(false)}
          student={selectedStudent}
          onSuccess={() => {
            fetchPending();       // update list
            onPaymentSuccess();   // update summary + recent
          }}
        />
      )}
    </>
  );
}
