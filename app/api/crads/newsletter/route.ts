import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crads/newsletter
 * List all newsletter subscriptions with filtering, search, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Get total count for pagination
    const total = await prisma.newsletter_subscribers.count({ where });

    // Get newsletter subscriptions
    const subscriptions = await prisma.newsletter_subscribers.findMany({
      where,
      orderBy: { subscribedAt: 'desc' },
      skip,
      take: limit,
    });

    // Get statistics
    const stats = await prisma.newsletter_subscribers.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const statsMap = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    const totalSubscriptions = await prisma.newsletter_subscribers.count();
    const activeSubscriptions = statsMap.ACTIVE || 0;
    const unsubscribed = statsMap.UNSUBSCRIBED || 0;
    const bounced = statsMap.BOUNCED || 0;

    return NextResponse.json({
      success: true,
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        unsubscribed,
        bounced,
      },
    }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter subscriptions' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * POST /api/crads/newsletter
 * Create new newsletter subscription
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { email, name, source, interests } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check if email already exists
    const existing = await prisma.newsletter_subscribers.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409, headers: getSecurityHeaders() }
      );
    }

    // Create new subscription
    const subscription = await prisma.newsletter_subscribers.create({
      data: {
        email,
        name,
        source: source || 'admin',
        interests: interests || [],
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
    }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Newsletter Create Error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}