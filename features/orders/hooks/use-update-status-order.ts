import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useUpdateStatusOrder() {
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const updateStatusOrder = async ({
        orderId,
        status,
    }: {
        orderId: string | number;
        status: string;
    }) => {
        setIsUpdating(true);

        try {
            const response = await fetch(`/api/v1/orders/${orderId}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to cancel order');
            }

            toast.success('Order update successfully');
            router.refresh();
            return true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || 'Failed to cancel order');
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        updateStatusOrder,
        isUpdating,
    };
}