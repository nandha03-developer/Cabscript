import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-middleware';
import { getAllContacts, getContactStats } from '@/lib/db/contacts';

export async function GET(request: NextRequest) {
  // Check authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const contacts = await getAllContacts(limit, offset);
    const stats = await getContactStats();

    return NextResponse.json({
      contacts,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.success && stats.stats ? stats.stats.totalContacts : 0,
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
