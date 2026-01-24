export type PaymentStatus = "PAID" | "UNPAID";

/**
 * Minimal seat info sent along with student list
 * (comes from SeatAllocation, NOT Student model)
 */
export interface SeatAllocationInfo {
  seatNumber: number;
  shiftCode: string;
}

export interface Student {
  _id: string;
  studentId: string;
  name: string;
  aadhaarMasked: string;
  phone: string;
  monthlyFee: number;
  paymentStatus: PaymentStatus;
  joiningDate: string;
  isActive: boolean;
  createdAt: string;
  seatAllocation?: SeatAllocationInfo;
}
