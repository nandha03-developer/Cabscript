import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-middleware';

// PUT /api/admin/newsletter/[id] - Update newsletter subscription
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const authError = await requireAdmin(request);
    if (authError) {
      return authError;
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid subscription ID' },
        { status: 400 }
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
      data: subscription,
    });
  } catch (error) {
    console.error('Newsletter Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/newsletter/[id] - Delete newsletter subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const authError = await requireAdmin(request);
    if (authError) {
      return authError;
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid subscription ID' },
        { status: 400 }
      );
    }

    // Delete subscription
    await prisma.newsletter_subscribers.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error) {
    console.error('Newsletter Delete Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}