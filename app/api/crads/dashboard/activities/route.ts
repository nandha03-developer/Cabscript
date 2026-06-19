import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-session';
import { prisma } from '@/lib/prisma';
import { getSecurityHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Fetch recent activities (last 10)
    const activities = await prisma.activity_logs.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    // Format activities for display
    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      action: activity.action,
      entity: activity.entityType,
      entityId: activity.entityId,
      description: activity.description,
      admin: activity.adminName,
      timestamp: activity.createdAt,
    }));

    return NextResponse.json(
      { activities: formattedActivities },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Activities fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
