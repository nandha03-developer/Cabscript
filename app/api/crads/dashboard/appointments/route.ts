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

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Fetch upcoming demo requests (next 7 days)
    const appointments = await prisma.demo_requests.findMany({
      where: {
        scheduledAt: {
          gte: now,
          lte: nextWeek,
        },
        status: { in: ['SCHEDULED'] },
      },
      take: 5,
      orderBy: { scheduledAt: 'asc' },
    });

    // Format demo requests for display
    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      title: `Demo: ${appointment.interestedIn}`,
      appointmentType: 'Demo Request',
      scheduledAt: appointment.scheduledAt,
      duration: 60, // Default 60 minutes
      status: appointment.status,
      customerName: appointment.name,
      customerEmail: appointment.email,
      customerPhone: appointment.phone,
      meetingLink: null,
      hasDemoRequest: true,
    }));

    return NextResponse.json(
      { appointments: formattedAppointments },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Appointments fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
