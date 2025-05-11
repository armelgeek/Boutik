import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useCancelOrder() {
    const [isCancelling, setIsCancelling] = useState(false);
    const router = useRouter();

    const cancelOrder = async ({
        orderId,
        reason,
    }: {
        orderId: string | number;
        reason: string;
    }) => {
        setIsCancelling(true);

        try {
            const response = await fetch(`/api/v1/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to cancel order');
            }

            toast.success('Order cancelled successfully');
            router.refresh();
            return true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || 'Failed to cancel order');
            return false;
        } finally {
            setIsCancelling(false);
        }
    };

    return {
        cancelOrder,
        isCancelling,
    };
}