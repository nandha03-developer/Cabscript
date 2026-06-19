import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";

/**
 * GET /api/admin/reports/export
 * Export report data in various formats
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const range = searchParams.get("range") || "30d";
    const type = searchParams.get("type") || "overview"; // overview, revenue, customers, orders, support

    // In production, fetch actual data and generate files
    // For now, return mock data structure

    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: range,
      reportType: type,
      data: {
        summary: {
          totalRevenue: 847650,
          totalOrders: 741,
          activeCustomers: 1198,
          avgOrderValue: 1144,
        },
        // Additional data based on type
      },
    };

    if (format === "json") {
      return NextResponse.json(reportData);
    }

    if (format === "csv") {
      // Generate CSV
      const csv = generateCSV(reportData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="report-${type}-${range}.csv"`,
        },
      });
    }

    if (format === "pdf") {
      // In production, use a library like puppeteer or jsPDF
      return NextResponse.json(
        { message: "PDF export will be implemented with a PDF generation library" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

function generateCSV(data: any): string {
  // Simple CSV generation
  let csv = "Metric,Value\n";
  csv += `Total Revenue,$${data.data.summary.totalRevenue}\n`;
  csv += `Total Orders,${data.data.summary.totalOrders}\n`;
  csv += `Active Customers,${data.data.summary.activeCustomers}\n`;
  csv += `Average Order Value,$${data.data.summary.avgOrderValue}\n`;
  csv += `\nGenerated At,${data.generatedAt}\n`;
  csv += `Date Range,${data.dateRange}\n`;
  return csv;
}
