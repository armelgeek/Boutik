import { auth } from '@/auth';
import { updateOrderStatus } from '@/features/orders/domain/use-cases/update-order.use-case';
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

        const { status } = await request.json();

         await updateOrderStatus(id, status);

        return NextResponse.json({
            success: true
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Order cancellation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to cancel order' },
            { status: 500 }
        );
    }
}
