import type { Student, PaymentStatus } from "@/types/student";
import { Button } from "@/components/ui/button";

interface Props {
  students: Student[];
  onTogglePayment: (id: string, status: PaymentStatus) => void;
  onDeactivate: (id: string) => void;
}

export default function StudentsTable({
  students,
  onTogglePayment,
  onDeactivate,
}: Props) {
  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-100">
              <tr>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 py-3 text-left text-sm font-medium text-slate-600">Aadhaar</th>
                <th className="p-3 text-center font-semibold">Seat</th>
                <th className="p-3 text-center font-semibold">Shift</th>
                <th className="p-3 text-center font-semibold">Fee</th>
                <th className="p-3 text-center font-semibold">Payment</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr
                  key={s._id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-3 font-medium">{s.name}</td>

                  <td className="px-4 py-3 text-sm font-mono text-slate-700">
                    {s.aadhaarMasked ?? "_"}
                  </td>

                  <td className="p-3 text-center">
                    {s.seatAllocation?.seatNumber ?? "—"}
                  </td>

                  <td className="p-3 text-center">
                    {s.seatAllocation?.shiftCode ?? "—"}
                  </td>

                  <td className="p-3 text-center">₹ {s.monthlyFee}</td>

                  <td className="p-3 text-center">
                    <Button
                      size="sm"
                      variant={
                        s.paymentStatus === "PAID" ? "default" : "outline"
                      }
                      className="min-w-[90px]"
                      onClick={() =>
                        onTogglePayment(
                          s._id,
                          s.paymentStatus === "PAID" ? "UNPAID" : "PAID"
                        )
                      }
                    >
                      {s.paymentStatus}
                    </Button>
                  </td>

                  <td className="p-3 text-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeactivate(s._id)}
                    >
                      Deactivate
                    </Button>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE + TABLET CARDS */}
      <div className="lg:hidden space-y-4 max-w-3xl mx-auto">
        {students.map((s) => (
          <div
            key={s._id}
            className="
        rounded-xl border bg-white
        p-4 shadow-sm
        transition hover:shadow-md
      "
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-slate-900">
                  {s.name}
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Aadhaar:{" "}
                  <span className="font-mono tracking-wide">
                    {s.aadhaarMasked ?? "—"}
                  </span>
                </p>
              </div>

              <span className="
          text-xs font-medium
          rounded-full px-2 py-0.5
          bg-slate-100 text-slate-700
        ">
                Seat {s.seatAllocation?.seatNumber ?? "—"}
              </span>
            </div>

            {/* DETAILS */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
              <div>
                <span className="block text-xs text-slate-500">Shift</span>
                <span className="font-medium">
                  {s.seatAllocation?.shiftCode ?? "—"}
                </span>
              </div>

              <div>
                <span className="block text-xs text-slate-500">Monthly Fee</span>
                <span className="font-medium">₹ {s.monthlyFee}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-3">
              <Button
                size="sm"
                variant={s.paymentStatus === "PAID" ? "default" : "outline"}
                className="flex-1"
                onClick={() =>
                  onTogglePayment(
                    s._id,
                    s.paymentStatus === "PAID" ? "UNPAID" : "PAID"
                  )
                }
              >
                {s.paymentStatus}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => onDeactivate(s._id)}
              >
                Deactivate
              </Button>
            </div>
          </div>
        ))}

        {students.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            No students found
          </div>
        )}
      </div>

    </>
  );
}
