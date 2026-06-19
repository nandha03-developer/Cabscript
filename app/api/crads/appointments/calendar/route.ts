import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/admin-session';

const prisma = new PrismaClient();

/**
 * GET /api/crads/appointments/calendar - Get appointments for calendar view
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start'); // Start date (ISO string)
    const end = searchParams.get('end'); // End date (ISO string)
    const viewMonth = searchParams.get('view-month'); // Format: YYYY-MM

    // Build where clause for date range
    const where: any = {};

    if (start && end) {
      where.OR = [
        {
          scheduledAt: {
            gte: new Date(start),
            lte: new Date(end),
          },
        },
        {
          preferredDate: {
            gte: new Date(start),
            lte: new Date(end),
          },
        },
      ];
    } else if (viewMonth) {
      // Parse YYYY-MM format
      const [year, month] = viewMonth.split('-').map(Number);
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);

      where.OR = [
        {
          scheduledAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        {
          preferredDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      ];
    }

    // Get appointments
    const appointments = await prisma.demo_requests.findMany({
      where,
      orderBy: [
        { scheduledAt: 'asc' },
        { preferredDate: 'asc' },
      ],
    });

    // Format for calendar
    const calendarEvents = appointments.map((appt: any) => {
      const eventDate = appt.scheduledAt || appt.preferredDate;
      const eventTitle = appt.title || `${appt.name} - ${appt.company || 'No Company'}`;
      
      return {
        id: appt.id,
        title: eventTitle,
        start: eventDate?.toISOString() || null,
        end: eventDate?.toISOString() || null,
        allDay: !appt.scheduledAt, // All day if only preferredDate exists
        backgroundColor: getStatusColor(appt.status),
        borderColor: getStatusColor(appt.status),
        extendedProps: {
          appointmentNumber: `APT-${appt.id.toString().padStart(6, '0')}`,
          customerName: appt.name,
          customerEmail: appt.email,
          phone: appt.phone,
          company: appt.company,
          status: appt.status,
          time: appt.preferredTime,
          notes: appt.notes,
          title: appt.title,
          type: appt.type,
        },
      };
    });

    return NextResponse.json(calendarEvents);
  } catch (error: any) {
    console.error('Error fetching calendar appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar data', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to get status color
function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    PENDING: '#FFA500',    // Orange
    SCHEDULED: '#4CAF50',  // Green
    COMPLETED: '#2196F3',  // Blue
    CANCELLED: '#F44336',  // Red
    NO_SHOW: '#9E9E9E',    // Gray
  };
  return colors[status] || '#757575';
}
