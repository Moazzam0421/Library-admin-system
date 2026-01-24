import { Button } from "@/components/ui/button";

interface Props {
    name: string;
    seat?: number;
    shift?: string;
    amount: number;
    onCollect: () => void;
}

export default function PaymentCard({
    name,
    seat,
    shift,
    amount,
    onCollect,
}: Props) {
    return (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{name}</h3>
                <span className="text-lg font-bold">₹ {amount}</span>
            </div>

            <div className="text-sm text-muted-foreground mt-1">
                {seat ? `Seat ${seat}` : "Seat —"} • {shift ?? "—"}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                    UNPAID
                </span>

                <Button size="sm" onClick={onCollect}>
                    Collect Payment
                </Button>
            </div>
        </div>
    );
}
