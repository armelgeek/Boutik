import { auth } from '@/auth';
import { cancelOrder } from '@/features/orders/domain/use-cases/cancel-order.use-case';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = (await params).id;
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { reason } = await request.json();

        if (!reason || typeof reason !== 'string') {
            return NextResponse.json(
                { error: 'Cancellation reason is required' },
                { status: 400 }
            );
        }

        const updatedOrder = await cancelOrder({
            orderId: id,
            userId: session.user.id,
            reason,
        });

        return NextResponse.json(updatedOrder);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Order cancellation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to cancel order' },
            { status: 500 }
        );
    }
}
