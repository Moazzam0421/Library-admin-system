import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import api from "@/services/api";

interface Props {
    open: boolean;
    onClose: () => void;
    student: {
        _id: string;
        name: string;
        monthlyFee: number;
        seatAllocation?: {
            seatNumber: number;
            shiftCode: string;
        };
    };
    onSuccess: () => void;
}

const UPI_ID = import.meta.env.VITE_UPI_ID;
const UPI_NAME = import.meta.env.VITE_UPI_NAME;

export default function CollectPaymentModal({
    open,
    onClose,
    student,
    onSuccess,
}: Props) {
    const amount = student.monthlyFee;

    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
        UPI_NAME
    )}&am=${amount}&cu=INR&tn=Seat ${student.seatAllocation?.seatNumber} - ${student.name
        }`;

    const confirmPayment = async () => {
        await api.post("/payments/collect", {
            studentId: student._id,
            amount: student.monthlyFee,
            method: "UPI",
        });

        onSuccess();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Collect Payment</DialogTitle>
                        <DialogDescription>
                            Scan the QR code to receive payment from the student.
                            Confirm only after payment is received in your UPI app.
                        </DialogDescription>
                    </DialogHeader>

                <div className="space-y-4 text-sm">
                    <div><b>Student:</b> {student.name}</div>
                    <div>
                        <b>Seat:</b> {student.seatAllocation?.seatNumber} •{" "}
                        {student.seatAllocation?.shiftCode}
                    </div>

                    <div className="text-lg font-semibold">Amount: ₹{amount}</div>

                    <div className="flex justify-center py-4">
                        <QRCodeCanvas value={upiUrl} size={180} />
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        Ask student to scan and complete payment
                    </p>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={confirmPayment}>
                            Confirm Payment
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
