import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API endpoint to receive and store Web Vitals metrics
 * POST /api/analytics/web-vitals
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      id,
      name,
      value,
      rating,
      delta,
      navigationType,
      url,
      userAgent,
      connection,
      timestamp,
    } = data;

    // Validate required fields
    if (!name || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store in database
    await prisma.web_vitals_metrics.create({
      data: {
        id: crypto.randomUUID(),
        metricId: id,
        name,
        value,
        rating,
        delta: delta || 0,
        navigationType: navigationType || 'navigate',
        url: url || '/',
        userAgent: userAgent || 'unknown',
        connectionType: connection || 'unknown',
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error storing web vitals:', error);
    
    // Don't fail the request - just log
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get Web Vitals statistics
 * GET /api/analytics/web-vitals?days=7
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const url = searchParams.get('url');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build query
    const where: any = {
      timestamp: {
        gte: startDate,
      },
    };

    if (url) {
      where.url = url;
    }

    // Get metrics
    const metrics = await prisma.web_vitals_metrics.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });

    // Calculate statistics
    const stats = calculateStats(metrics);

    return NextResponse.json({
      success: true,
      period: {
        days,
        startDate,
        endDate: new Date(),
      },
      totalMetrics: metrics.length,
      stats,
      recentMetrics: metrics.slice(0, 50), // Last 50 metrics
    });
  } catch (error) {
    console.error('Error fetching web vitals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate statistics for metrics
 */
function calculateStats(metrics: any[]) {
  const metricTypes = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'];
  const stats: any = {};

  for (const type of metricTypes) {
    const typeMetrics = metrics.filter(m => m.name === type);
    
    if (typeMetrics.length === 0) {
      stats[type] = null;
      continue;
    }

    const values = typeMetrics.map(m => m.value);
    const ratings = typeMetrics.map(m => m.rating);

    stats[type] = {
      count: typeMetrics.length,
      avg: average(values),
      median: median(values),
      p75: percentile(values, 75),
      p90: percentile(values, 90),
      p95: percentile(values, 95),
      min: Math.min(...values),
      max: Math.max(...values),
      good: ratings.filter(r => r === 'good').length,
      needsImprovement: ratings.filter(r => r === 'needs-improvement').length,
      poor: ratings.filter(r => r === 'poor').length,
    };
  }

  return stats;
}

function average(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}
