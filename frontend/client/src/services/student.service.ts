import api from "./api";
import type { Student, PaymentStatus } from "@/types/student";

export const StudentService = {
  async getAll(): Promise<Student[]> {
    const res = await api.get("/students");
    return res.data;
  },

  async addStudent(data: {
    name: string;
    phone: string;
    aadhaarNumber: string;
    joiningDate: string;
    shiftCode: string;
  }) {
    const res = await api.post("/students", data);
    return res.data.student;
  },

  async updatePayment(studentId: string, status: PaymentStatus) {
    const res = await api.patch(
      `/students/${studentId}/payment`,
      { paymentStatus: status }
    );
    return res.data;
  },

  async deactivate(studentId: string) {
    const res = await api.patch(
      `/students/${studentId}/deactivate`
    );
    return res.data;
  }
};
