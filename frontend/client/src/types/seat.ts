import type { Student } from "./student";

export type SeatStatus = "AVAILABLE" | "PAID" | "UNPAID";

export interface Seat {
  seatNumber: number;
  status: SeatStatus;
  student?: Student;
}
