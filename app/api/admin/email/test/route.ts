/**
 * Email Testing API
 * Send test emails to verify email service configuration
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";
import { sendEmail } from "@/lib/email-service";
import {
  orderConfirmationEmail,
  licenseKeyEmail,
  appointmentReminderEmail,
  passwordResetEmail,
  supportTicketEmail,
  invoiceEmail,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  const headers = getSecurityHeaders();

  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    const body = await request.json();
    const { templateType, recipientEmail } = body;

    if (!templateType || !recipientEmail) {
      return NextResponse.json(
        { error: "Template type and recipient email are required" },
        { status: 400, headers }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400, headers });
    }

    let emailContent: { subject: string; html: string };

    // Generate test email based on template type
    switch (templateType) {
      case "order-confirmation":
        emailContent = orderConfirmationEmail({
          customerName: "John Doe",
          orderNumber: "ORD-TEST-001",
          plan: "Professional Plan",
          amount: 4999,
          currency: "USD",
        });
        break;

      case "license-key":
        emailContent = licenseKeyEmail({
          customerName: "John Doe",
          orderNumber: "ORD-TEST-001",
          plan: "Professional Plan",
          licenseKey: "XXXX-XXXX-XXXX-XXXX-TEST",
          downloadUrl: "https://cabscript.com/download/test",
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        });
        break;

      case "appointment-reminder":
        emailContent = appointmentReminderEmail({
          customerName: "John Doe",
          appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          appointmentType: "Demo Session",
          location: "Online Meeting",
          notes: "Please have your requirements ready for discussion",
        });
        break;

      case "password-reset":
        emailContent = passwordResetEmail({
          name: "John Doe",
          resetToken: "test-reset-token-123456",
          expiresIn: "1 hour",
        });
        break;

      case "support-ticket":
        emailContent = supportTicketEmail({
          customerName: "John Doe",
          ticketId: "TKT-TEST-001",
          subject: "Installation Help Needed",
          priority: "MEDIUM",
          message: "I need help setting up the database for CabScript.",
        });
        break;

      case "invoice":
        emailContent = invoiceEmail({
          customerName: "John Doe",
          invoiceNumber: "INV-TEST-001",
          amount: 4999,
          currency: "USD",
          dueDate: new Date(),
          invoiceUrl: "https://cabscript.com/invoices/test",
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid template type" }, { status: 400, headers });
    }

    // Send the test email
    const sent = await sendEmail({
      to: recipientEmail,
      subject: `[TEST] ${emailContent.subject}`,
      html: emailContent.html,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send email. Check server logs." },
        { status: 500, headers }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Test email sent to ${recipientEmail}`,
        templateType,
      },
      { headers }
    );
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500, headers }
    );
  }
}

/**
 * GET - Get available email templates
 */
export async function GET(request: NextRequest) {
  const headers = getSecurityHeaders();

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    const templates = [
      {
        id: "order-confirmation",
        name: "Order Confirmation",
        description: "Sent when a customer places an order",
      },
      {
        id: "license-key",
        name: "License Key Delivery",
        description: "Sent with license key and download links",
      },
      {
        id: "appointment-reminder",
        name: "Appointment Reminder",
        description: "Sent to remind customers about appointments",
      },
      {
        id: "password-reset",
        name: "Password Reset",
        description: "Sent when admin requests password reset",
      },
      {
        id: "support-ticket",
        name: "Support Ticket",
        description: "Sent when a support ticket is created",
      },
      {
        id: "invoice",
        name: "Invoice",
        description: "Sent with invoice details and PDF",
      },
    ];

    return NextResponse.json({ templates }, { headers });
  } catch (error) {
    console.error("Get templates error:", error);
    return NextResponse.json({ error: "Failed to get templates" }, { status: 500, headers });
  }
}
