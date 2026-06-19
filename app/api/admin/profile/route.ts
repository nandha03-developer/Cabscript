import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-middleware';
import { getAdminById } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Check authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Get admin from session
    const adminSession = request.cookies.get('admin_session')?.value;
    if (!adminSession) {
      return NextResponse.json({ error: 'No session' }, { status: 401 });
    }

    const { adminId } = JSON.parse(adminSession);
    const admin = await getAdminById(adminId);

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Get admin profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
