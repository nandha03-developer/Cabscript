import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/admin-session';

const prisma = new PrismaClient();

/**
 * GET /api/crads/appointments/[id] - Get a single appointment
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const appointmentId = parseInt(id);

    // Get appointment
    const appointment = await prisma.demo_requests.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Add computed fields
    const appointmentWithMeta = {
      ...appointment,
      appointmentNumber: `APT-${appointment.id.toString().padStart(6, '0')}`,
      customerName: appointment.name,
      customerEmail: appointment.email,
      date: appointment.scheduledAt?.toISOString().split('T')[0] || (appointment.preferredDate ? new Date(appointment.preferredDate).toISOString().split('T')[0] : null),
      time: appointment.preferredTime,
      preferredDate: appointment.preferredDate?.toISOString().split('T')[0] || null,
    };

    return NextResponse.json(appointmentWithMeta);
  } catch (error: any) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/crads/appointments/[id] - Update an appointment
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const appointmentId = parseInt(id);
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      jobTitle,
      title,
      type,
      interestedIn,
      preferredDate,
      preferredTime,
      scheduledAt,
      status,
      assignedTo,
      notes,
    } = body;

    // Build update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (interestedIn !== undefined) updateData.interestedIn = interestedIn;
    if (preferredDate !== undefined) updateData.preferredDate = new Date(preferredDate);
    if (preferredTime !== undefined) updateData.preferredTime = preferredTime;
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (status !== undefined) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (notes !== undefined) updateData.notes = notes;

    // Update appointment
    const appointment = await prisma.demo_requests.update({
      where: { id: appointmentId },
      data: updateData,
    });

    // Add computed fields
    const appointmentWithMeta = {
      ...appointment,
      appointmentNumber: `APT-${appointment.id.toString().padStart(6, '0')}`,
      customerName: appointment.name,
      customerEmail: appointment.email,
      date: appointment.scheduledAt?.toISOString().split('T')[0] || (appointment.preferredDate ? new Date(appointment.preferredDate).toISOString().split('T')[0] : null),
      time: appointment.preferredTime,
      preferredDate: appointment.preferredDate?.toISOString().split('T')[0] || null,
    };

    return NextResponse.json(appointmentWithMeta);
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crads/appointments/[id] - Delete an appointment
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const appointmentId = parseInt(id);

    // Delete appointment
    await prisma.demo_requests.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment', details: error.message },
      { status: 500 }
    );
  }
}
