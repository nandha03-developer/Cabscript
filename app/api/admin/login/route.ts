import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/admin-auth';
import { createSession } from '@/lib/admin-session';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Authenticate admin
    const admin = await authenticateAdmin(email, password);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session using the proper session system
    await createSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: true, // Admin is active if they passed authentication
    });

    // Return success (cookie is set by createSession)
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
