import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/crads/newsletter/[id]
 * Update newsletter subscription
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const resolvedParams = await params;
    const idParam = resolvedParams.id;
    
    // Handle both string CUID and integer ID formats for migration compatibility
    let id: number;
    if (isNaN(parseInt(idParam))) {
      // If it's a string CUID, return error
      return NextResponse.json(
        { error: 'Invalid subscription ID format. Please refresh the page and try again.' },
        { status: 400, headers: getSecurityHeaders() }
      );
    } else {
      id = parseInt(idParam);
    }
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid subscription ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { status, name, interests } = body;

    // Update subscription
    const subscription = await prisma.newsletter_subscribers.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(name !== undefined && { name }),
        ...(interests && { interests }),
        ...(status === 'UNSUBSCRIBED' && { unsubscribedAt: new Date() }),
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
    }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Newsletter Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * DELETE /api/crads/newsletter/[id]
 * Delete newsletter subscription
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const resolvedParams = await params;
    const idParam = resolvedParams.id;
    
    // Handle both string CUID and integer ID formats for migration compatibility
    let id: number;
    if (isNaN(parseInt(idParam))) {
      // If it's a string CUID, return error
      return NextResponse.json(
        { error: 'Invalid subscription ID format. Please refresh the page and try again.' },
        { status: 400, headers: getSecurityHeaders() }
      );
    } else {
      id = parseInt(idParam);
    }
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid subscription ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Delete subscription
    await prisma.newsletter_subscribers.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully',
    }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Newsletter Delete Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}