import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/demo-requests
 * Fetch demo requests with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check here
    // const session = await getAdminSession();
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401, headers: getSecurityHeaders() }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

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
      ];
    }

    // Get total count for pagination
    const total = await prisma.demo_requests.count({ where });

    // Get demo requests
    const requests = await prisma.demo_requests.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      requests,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    }, {
      headers: getSecurityHeaders(),
    });

  } catch (error) {
    console.error('Failed to fetch demo requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo requests' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}