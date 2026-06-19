import { NextRequest, NextResponse } from 'next/server';
import { processScheduledEmails } from '@/lib/drip-campaigns';

/**
 * GET /api/cron/process-emails
 * Process scheduled drip campaign emails
 * 
 * This endpoint should be called by a cron job every 15 minutes
 * Example cron services: Vercel Cron, GitHub Actions, external cron-job.org
 * 
 * Security: Verify cron secret to prevent unauthorized access
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Process scheduled emails
    const result = await processScheduledEmails();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      processed: result.processed,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
