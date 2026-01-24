import { useEffect, useState } from "react";
import type { Student, PaymentStatus } from "@/types/student";
import { StudentService } from "@/services/student.service";
import StudentsTable from "@/components/tables/StudentsTable";
import { toast } from "sonner";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await StudentService.getAll();
      setStudents(data);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handlePaymentToggle = async (
    id: string,
    status: PaymentStatus
  ) => {
    try {
      await StudentService.updatePayment(id, status);
      toast.success("Payment status updated");
      loadStudents();
    } catch {
      toast.error("Payment update failed");
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Deactivate this student?")) return;

    try {
      await StudentService.deactivate(id);
      toast.success("Student deactivated");
      loadStudents();
    } catch {
      toast.error("Failed to deactivate");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Students</h1>
        <p className="text-muted-foreground">
          Manage active library students
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <StudentsTable
          students={students}
          onTogglePayment={handlePaymentToggle}
          onDeactivate={handleDeactivate}
        />
      )}
    </div>
  );
}
