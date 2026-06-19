import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-middleware';
import { getRecentOrders, getOrderStats } from '@/lib/db/orders';

export async function GET(request: NextRequest) {
  // Check authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const orders = await getRecentOrders(limit, offset);
    const stats = await getOrderStats();

    return NextResponse.json({
      orders,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.success && stats.stats ? stats.stats.totalOrders : 0,
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
