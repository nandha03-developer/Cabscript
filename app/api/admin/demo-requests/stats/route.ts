import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/demo-requests/stats
 * Get demo requests statistics
 */
export async function GET() {
  try {
    // TODO: Add admin authentication check here
    // const session = await getAdminSession();
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401, headers: getSecurityHeaders() }
    //   );
    // }

    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      total,
      pending,
      scheduled,
      completed,
      thisWeek,
      thisMonth,
    ] = await Promise.all([
      prisma.demo_requests.count(),
      prisma.demo_requests.count({ where: { status: 'PENDING' } }),
      prisma.demo_requests.count({ where: { status: 'SCHEDULED' } }),
      prisma.demo_requests.count({ where: { status: 'COMPLETED' } }),
      prisma.demo_requests.count({
        where: { createdAt: { gte: startOfWeek } }
      }),
      prisma.demo_requests.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
    ]);

    return NextResponse.json({
      total,
      pending,
      scheduled,
      completed,
      thisWeek,
      thisMonth,
    }, {
      headers: getSecurityHeaders(),
    });

  } catch (error) {
    console.error('Failed to fetch demo requests stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}