import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useCancelOrder } from '@/features/orders/hooks/use-cancel-order';
import { AlertTriangle } from 'lucide-react';

interface CancelOrderDialogProps {
    orderId: string | number;
    onCancelled?: () => void;
}

export function CancelOrderDialog({ orderId, onCancelled }: CancelOrderDialogProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const { cancelOrder, isCancelling } = useCancelOrder();

    const handleCancel = async () => {
        const success = await cancelOrder({
            orderId,
            reason: reason.trim() || 'Customer requested cancellation',
        });

        if (success) {
            setOpen(false);
            if (onCancelled) onCancelled();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700">
                    Cancel Order
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        Cancel Order
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-gray-500 text-sm">
                        Please provide a reason for cancellation:
                    </p>
                    <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Optional: Tell us why you're cancelling..."
                        className="h-24"
                    />

                    <div className="bg-yellow-50 p-3 rounded-md">
                        <p className="text-yellow-800 text-sm">
                            If payment was processed, a refund will be issued to your original payment method.
                            This may take 5-10 business days to appear on your statement.
                        </p>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        disabled={isCancelling}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={isCancelling}
                    >
                        {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}