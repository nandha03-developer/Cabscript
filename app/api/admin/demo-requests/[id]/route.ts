import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/demo-requests/[id]
 * Update demo request status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add admin authentication check here
    // const session = await getAdminSession();
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401, headers: getSecurityHeaders() }
    //   );
    // }

    const { id: idString } = await params;
    const id = parseInt(idString);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid demo request ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const { status, notes } = await request.json();

    // Validate status
    const validStatuses = ['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Update the demo request
    const updatedRequest = await prisma.demo_requests.update({
      where: { id },
      data: {
        status,
        ...(notes && { notes }),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
        ...(status === 'SCHEDULED' && { scheduledAt: new Date() }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    }, {
      headers: getSecurityHeaders(),
    });

  } catch (error) {
    console.error('Failed to update demo request:', error);
    return NextResponse.json(
      { error: 'Failed to update demo request' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * DELETE /api/admin/demo-requests/[id]
 * Delete demo request (soft delete - mark as cancelled)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add admin authentication check here
    // const session = await getAdminSession();
    // if (!session || !session.isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401, headers: getSecurityHeaders() }
    //   );
    // }

    const { id: idString } = await params;
    const id = parseInt(idString);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid demo request ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Soft delete by setting status to CANCELLED
    await prisma.demo_requests.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Demo request cancelled successfully',
    }, {
      headers: getSecurityHeaders(),
    });

  } catch (error) {
    console.error('Failed to delete demo request:', error);
    return NextResponse.json(
      { error: 'Failed to delete demo request' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}