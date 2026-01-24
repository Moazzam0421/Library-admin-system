import api from "./api";
import axios from "axios";

export interface SeatAllocation {
  _id: string;
  seatNumber: number;
  shiftCode: string;

  student: {
    _id: string;
    studentId: string;
    name: string;
    phone: string;
    aadhaarNumber: string;
    monthlyFee: number;
    paymentStatus: "PAID" | "UNPAID";
    joiningDate: string;
    isActive: boolean;
  };
}

export interface SimpleStudent {
  _id: string;
  name: string;
}

export const SeatService = {
  async getByShift(shiftCode: string): Promise<SeatAllocation[]> {
  try {
    const res = await api.get("/seats", { params: { shiftCode } });
    return res.data;
  } catch (err: any) {
    console.error(err?.response?.data?.message);
    return [];
  }
},

  async getUnassignedStudents(): Promise<SimpleStudent[]> {
    const res = await api.get("/seats/unassigned");
    return res.data;
  },

  async assign(data: {
    seatNumber: number;
    shiftCode: string;
    studentId: string;
  }) {
    const res = await api.post("/seats/assign", data);
    return res.data;
  },
};

const axios_api = axios.create({
  baseURL: "http://localhost:5000",
});

export const vacateSeat = (allocationId: string) => {
  return axios_api.delete(`/api/seats/vacate/${allocationId}`);
};

