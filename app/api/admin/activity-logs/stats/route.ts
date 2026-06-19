import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/activity-logs/stats
 * Get activity logs statistics
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
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      total,
      today,
      thisWeek,
      thisMonth,
      adminActions,
      systemEvents,
    ] = await Promise.all([
      prisma.activity_logs.count(),
      prisma.activity_logs.count({
        where: { createdAt: { gte: startOfToday } }
      }),
      prisma.activity_logs.count({
        where: { createdAt: { gte: startOfWeek } }
      }),
      prisma.activity_logs.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      prisma.activity_logs.count({
        where: { 
          action: { 
            in: ['CREATE', 'UPDATE', 'DELETE'] 
          }
        }
      }),
      prisma.activity_logs.count({
        where: { 
          action: { 
            in: ['LOGIN', 'LOGOUT', 'VIEW', 'EXPORT'] 
          }
        }
      }),
    ]);

    return NextResponse.json({
      total,
      today,
      thisWeek,
      thisMonth,
      adminActions,
      systemEvents,
    }, {
      headers: getSecurityHeaders(),
    });

  } catch (error) {
    console.error('Failed to fetch activity logs stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}