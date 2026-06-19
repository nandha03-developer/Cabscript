import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/admin-session';

const prisma = new PrismaClient();

/**
 * GET /api/crads/appointments - Get all appointments (demo requests)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get appointments with pagination
    const [appointments, total] = await Promise.all([
      prisma.demo_requests.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          scheduledAt: 'desc',
        },
      }),
      prisma.demo_requests.count({ where }),
    ]);

    // Add computed fields
    const appointmentsWithMeta = appointments.map((appt) => ({
      ...appt,
      appointmentNumber: `APT-${appt.id.toString().padStart(6, '0')}`,
      customerName: appt.name,
      customerEmail: appt.email,
      date: appt.scheduledAt?.toISOString().split('T')[0] || (appt.preferredDate ? new Date(appt.preferredDate).toISOString().split('T')[0] : null),
      time: appt.preferredTime,
      preferredDate: appt.preferredDate?.toISOString().split('T')[0] || null,
    }));

    return NextResponse.json({
      appointments: appointmentsWithMeta,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crads/appointments - Create a new appointment
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      customerName,
      email,
      customerEmail,
      phone,
      customerPhone,
      company,
      jobTitle,
      interestedIn,
      appointmentType,
      preferredDate,
      preferredTime,
      scheduledAt,
      status,
      assignedTo,
      notes,
      description,
      title,
      type,
      location,
      meetingLink,
      timezone,
      duration,
    } = body;

    // Support both naming conventions
    const finalName = name || customerName;
    const finalEmail = email || customerEmail;
    const finalPhone = phone || customerPhone;
    const finalType = type || appointmentType;

    // If scheduledAt is provided, extract date and time
    let finalPreferredDate: Date | null = null;
    let finalPreferredTime: string | null = null;
    let finalScheduledAt: Date | null = null;

    if (scheduledAt) {
      const schedDate = new Date(scheduledAt);
      finalPreferredDate = schedDate;
      finalPreferredTime = schedDate.toTimeString().slice(0, 5);
      finalScheduledAt = schedDate;
    } else if (preferredDate) {
      finalPreferredDate = new Date(preferredDate);
      finalPreferredTime = preferredTime || null;
    }

    // Validate required fields
    if (!finalName || !finalEmail) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate status enum
    const validStatuses = ['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    const finalStatus = status && validStatuses.includes(status.toUpperCase()) 
      ? status.toUpperCase() 
      : 'PENDING';

    // Prepare data object
    const createData: any = {
      name: String(finalName),
      email: String(finalEmail),
      interestedIn: String(appointmentType || interestedIn || 'professional'),
      status: finalStatus as any,
    };

    // Add optional fields only if they have values
    if (finalPhone) createData.phone = String(finalPhone);
    if (company) createData.company = String(company);
    if (jobTitle) createData.jobTitle = String(jobTitle);
    if (title) createData.title = String(title);
    if (finalType) createData.type = String(finalType);
    if (finalPreferredDate) createData.preferredDate = finalPreferredDate;
    if (finalPreferredTime) createData.preferredTime = String(finalPreferredTime);
    if (finalScheduledAt) createData.scheduledAt = finalScheduledAt;
    if (assignedTo) createData.assignedTo = String(assignedTo);
    if (notes || description) createData.notes = String(notes || description);


    // Create appointment
    const appointment = await prisma.demo_requests.create({
      data: createData,
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

    return NextResponse.json(appointmentWithMeta, { status: 201 });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment', details: error.message },
      { status: 500 }
    );
  }
}
