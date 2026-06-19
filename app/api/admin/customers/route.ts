import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-middleware';
import { getCustomerStats, getAllCustomers } from '@/lib/db/customers';

export async function GET(request: NextRequest) {
  // Check authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const customers = await getAllCustomers(limit, offset);
    const stats = await getCustomerStats();

    return NextResponse.json({
      customers,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.success && stats.stats ? stats.stats.totalCustomers : 0,
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
