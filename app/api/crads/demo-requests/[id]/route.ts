import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-session';
import { prisma } from '@/lib/prisma';
import { getSecurityHeaders } from '@/lib/security';
import { logAdminActivity } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid demo request ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { status, assignedTo, internalNotes } = body;

    // Get current demo request for logging
    const currentRequest = await prisma.demo_requests.findUnique({
      where: { id },
    });

    if (!currentRequest) {
      return NextResponse.json(
        { error: 'Demo request not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Update demo request
    const updateData: any = {};

    if (status) {
      updateData.status = status;
      
      // Update timestamps based on status
      if (status === 'SCHEDULED' && !currentRequest.scheduledAt) {
        updateData.scheduledAt = new Date();
      }
      if (status === 'COMPLETED' && !currentRequest.completedAt) {
        updateData.completedAt = new Date();
      }
    }

    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
    }

    if (internalNotes !== undefined) {
      updateData.internalNotes = internalNotes;
    }

    const updatedRequest = await prisma.demo_requests.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    await logAdminActivity(
      session.id,
      'UPDATED',
      'demo_request',
      id.toString(),
      `Updated demo request status to ${status || 'unchanged'}`,
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json(
      { demoRequest: updatedRequest },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Demo request update error:', error);
    return NextResponse.json(
      { error: 'Failed to update demo request' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid demo request ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get demo request for logging
    const demoRequest = await prisma.demo_requests.findUnique({
      where: { id },
    });

    if (!demoRequest) {
      return NextResponse.json(
        { error: 'Demo request not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Delete demo request
    await prisma.demo_requests.delete({
      where: { id },
    });

    // Log activity
    await logAdminActivity(
      session.id,
      'DELETED',
      'demo_request',
      id.toString(),
      `Deleted demo request from ${demoRequest.email}`,
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json(
      { success: true },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Demo request delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete demo request' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
