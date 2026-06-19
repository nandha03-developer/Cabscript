import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crads/reports/export
 * Export reports as CSV or PDF
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'csv';

    // Default to current month if no dates provided
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    // Get orders data for export
    const orders = await prisma.orders.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        customers: {
          select: {
            name: true,
            email: true,
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'Order Number',
        'Customer Name',
        'Customer Email',
        'Company',
        'Plan',
        'Amount',
        'Currency',
        'Status',
        'Payment Method',
        'License Key',
        'Created At',
        'Paid At',
        'Delivered At',
      ];

      const rows = orders.map(order => [
        order.orderNumber,
        order.customers?.name || 'N/A',
        order.customers?.email || 'N/A',
        order.customers?.company || 'N/A',
        order.plan,
        order.amount,
        order.currency,
        order.status,
        order.paymentMethod,
        order.licenseKey || 'N/A',
        order.createdAt.toISOString(),
        order.paidAt ? order.paidAt.toISOString() : 'N/A',
        order.deliveredAt ? order.deliveredAt.toISOString() : 'N/A',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          ...getSecurityHeaders(),
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="orders-report-${start.toISOString().split('T')[0]}-to-${end.toISOString().split('T')[0]}.csv"`,
        },
      });
    } else if (format === 'pdf') {
      // For now, return a simple text-based report
      // In a real application, you'd use a PDF library like puppeteer or jsPDF
      const reportText = `
CABSCRIPT ORDERS REPORT
Generated: ${new Date().toISOString()}
Period: ${start.toDateString()} to ${end.toDateString()}

SUMMARY:
- Total Orders: ${orders.length}
- Completed Orders: ${orders.filter(o => o.status === 'COMPLETED').length}
- Pending Orders: ${orders.filter(o => o.status === 'PENDING').length}
- Total Revenue: $${orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.amount, 0).toFixed(2)}

ORDERS:
${orders.map(order => `
- ${order.orderNumber}: ${order.customers?.name || 'Unknown'} - ${order.plan} - $${order.amount} - ${order.status}
`).join('')}
`;

      return new NextResponse(reportText, {
        headers: {
          ...getSecurityHeaders(),
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="orders-report-${start.toISOString().split('T')[0]}-to-${end.toISOString().split('T')[0]}.pdf"`,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid format' },
      { status: 400, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error exporting reports:', error);
    return NextResponse.json(
      { error: 'Failed to export reports' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}