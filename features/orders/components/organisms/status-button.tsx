import { JSX, useState } from 'react';

import { CheckCircle, Loader2, Package, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { formatDate } from '../../../../shared/lib/utils/index';
import { useUpdateStatusOrder } from '../../hooks/use-update-status-order';

export type OrderStatus = 'processing' | 'shipped' | 'delivered';

type StatusButtonProps = {
    currentStatus: OrderStatus;
    orderId: string;
    updatedAt: string;
};
const STATUS_LABELS: Record<OrderStatus, string> = {
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
};
const STATUS_ICONS: Record<OrderStatus, JSX.Element> = {
    processing: <Package className="text-yellow-500" />,
    shipped: <Truck className="text-blue-500" />,
    delivered: <CheckCircle className="text-green-600" />,
};

export const StatusButton = ({ currentStatus, orderId, updatedAt }: StatusButtonProps) => {
    const { isUpdating, updateStatusOrder } = useUpdateStatusOrder();
    const [status, setStatus] = useState<OrderStatus>(currentStatus);

    const nextStatus =
        status === 'processing' ? 'shipped' : status === 'shipped' ? 'delivered' : null;

    const handleStatusChange = async () => {
        if (!nextStatus) return;
        setStatus(nextStatus);
        await updateStatusOrder({ orderId, status: nextStatus });
    };

    return nextStatus ? (
        <div className="flex items-center gap-3 transition-all duration-300">
            <div className="flex items-center gap-2">
                {STATUS_ICONS[status]}
                <span className="font-medium text-muted-foreground text-sm transition-colors duration-300">
                    {STATUS_LABELS[status]}
                </span>
            </div>
            <span className="text-gray-400">→</span>
            <Button
                variant="outline"
                onClick={handleStatusChange}
                disabled={isUpdating}
                className="transition-all duration-300"
            >
                {isUpdating && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                Next: {STATUS_LABELS[nextStatus]}
            </Button>
        </div>
    ) : (
        <p className="flex items-center gap-2 text-green-700">
            {STATUS_ICONS[status]}
            {STATUS_LABELS[status]} on {formatDate(new Date(updatedAt))}
        </p>
    );
};
