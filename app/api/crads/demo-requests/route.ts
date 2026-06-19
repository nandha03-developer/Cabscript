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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch demo requests with pagination
    const [demoRequests, total] = await Promise.all([
      prisma.demo_requests.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.demo_requests.count({ where }),
    ]);

    return NextResponse.json(
      {
        demoRequests,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Demo requests fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo requests' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
