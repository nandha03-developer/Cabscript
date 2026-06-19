/**
 * Email Integration Examples
 * Ready-to-use code snippets for integrating emails into your application
 */

// ============================================================================
// EXAMPLE 1: Send Order Confirmation Email (After Order Creation)
// ============================================================================

/*
// In your order creation API route: /app/api/admin/orders/route.ts

import { sendOrderConfirmationEmail } from "@/lib/order-emails";

export async function POST(request: NextRequest) {
  try {
    // Create order in database
    const order = await prisma.orders.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        orderNumber: orderNumber,
        // ... other order fields
      }
    });

    // Send confirmation email asynchronously (don't block response)
    sendOrderConfirmationEmail({
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      plan: order.plan,
      amount: order.amount,
      currency: order.currency,
    }).catch(err => {
      console.error("Failed to send order confirmation:", err);
      // Don't fail the order if email fails
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    // Handle error
  }
}
*/

// ============================================================================
// EXAMPLE 2: Send License Key Email (After Key Generation)
// ============================================================================

/*
// In your license generation logic

import { sendLicenseKeyEmail } from "@/lib/order-emails";

async function generateAndSendLicense(orderId: string) {
  // Generate license key
  const licenseKey = await generateLicenseKey();
  
  // Save to database
  const license = await prisma.licenseKey.create({
    data: {
      orderId,
      key: licenseKey,
      // ... other fields
    },
    include: {
      order: true,
    }
  });

  // Generate download URL (token-based or direct)
  const downloadUrl = `https://cabscript.com/download/${license.downloadToken}`;

  // Send license key email
  await sendLicenseKeyEmail({
    customerEmail: license.order.customerEmail,
    customerName: license.order.customerName,
    orderNumber: license.order.orderNumber,
    plan: license.order.plan,
    licenseKey: license.key,
    downloadUrl: downloadUrl,
    expiryDate: license.expiresAt, // Optional
  });

  return license;
}
*/

// ============================================================================
// EXAMPLE 3: Send Invoice Email (After Invoice Generation)
// ============================================================================

/*
// After generating invoice PDF

import { sendInvoiceEmail } from "@/lib/order-emails";

async function generateAndSendInvoice(orderId: string) {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: { customers: true }
  });

  // Generate invoice PDF (using your PDF library)
  const invoicePdf = await generateInvoicePDF(order);
  
  // Save PDF and get URL
  const invoiceUrl = await uploadInvoicePDF(invoicePdf, order.invoiceNumber);

  // Create invoice record
  const invoice = await prisma.invoice.create({
    data: {
      orderId: order.id,
      invoiceNumber: order.invoiceNumber,
      amount: order.amount,
      currency: order.currency,
      pdfUrl: invoiceUrl,
      dueDate: new Date(),
      status: "PAID",
    }
  });

  // Send invoice email
  await sendInvoiceEmail({
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    invoiceNumber: invoice.invoiceNumber,
    amount: invoice.amount,
    currency: invoice.currency,
    dueDate: invoice.dueDate,
    invoiceUrl: invoiceUrl,
  });

  return invoice;
}
*/

// ============================================================================
// EXAMPLE 4: Send Password Reset Email
// ============================================================================

/*
// In your password reset request handler

import { sendEmail } from "@/lib/email-service";
import { passwordResetEmail } from "@/lib/email-templates";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  // Find admin user
  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  if (!admin) {
    // Don't reveal if email exists
    return NextResponse.json({ success: true });
  }

  // Generate reset token
  const resetToken = nanoid(32);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Save reset token
  await prisma.passwordReset.create({
    data: {
      adminId: admin.id,
      token: resetToken,
      expiresAt,
    }
  });

  // Send password reset email
  const emailContent = passwordResetEmail({
    name: admin.name,
    resetToken: resetToken,
    expiresIn: "1 hour",
  });

  await sendEmail({
    to: admin.email,
    subject: emailContent.subject,
    html: emailContent.html,
  });

  return NextResponse.json({ success: true });
}
*/

// ============================================================================
// EXAMPLE 5: Send Support Ticket Email
// ============================================================================

/*
// When creating a contact/support request (example - commented out)

import { sendEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Create contact (using Contact model instead of SupportTicket)
  const contact = await prisma.contacts.create({
    data: {
      customerId: body.customerId,
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      priority: body.priority,
      type: 'SUPPORT',
      status: "NEW",
    },
  });

  // Send confirmation email to customer (example)
  // const emailContent = supportEmail({
  //   customerName: contact.name,
  //   contactId: contact.id,
  //   subject: contact.subject,
  //   priority: contact.priority,
    message: ticket.message,
  });

  await sendEmail({
    to: ticket.customer.email,
    subject: emailContent.subject,
    html: emailContent.html,
  });

  return NextResponse.json({ success: true, ticket });
}
*/

// ============================================================================
// EXAMPLE 6: Send Appointment Reminder (Scheduled Task)
// ============================================================================

/*
// In a cron job or scheduled task (runs daily)

// import { sendEmail } from "@/lib/email-service";
// import { appointmentReminderEmail } from "@/lib/email-templates";

// NOTE: This is an example function - adapt to use DemoRequest model
async function sendAppointmentReminders() {
  console.log('Example function - adapt to your schema');
  // Commented out to prevent build errors
  // Adapt this to use prisma.demoRequest instead of prisma.appointment
}

// Set up cron job (using node-cron or similar)
// cron.schedule('0 9 * * *', sendAppointmentReminders); // Run daily at 9 AM
*/

// ============================================================================
// EXAMPLE 7: Send Bulk/Newsletter Emails
// ============================================================================

/*
// For sending newsletters or announcements to all customers

import { sendBulkEmails } from "@/lib/email-service";

async function sendNewsletter(subject: string, htmlContent: string) {
  // Get all active customers
  const customers = await prisma.customers.findMany({
    where: {
      emailNotifications: true, // Only send to those who opted in
    },
    select: {
      email: true,
      name: true,
    }
  });

  // Prepare emails
  const emails = customers.map(customer => ({
    to: customer.email,
    subject: subject,
    html: htmlContent.replace("{{name}}", customer.name), // Personalization
  }));

  // Send in batches (with built-in rate limiting)
  const result = await sendBulkEmails(emails);

  console.log(`Newsletter sent: ${result.sent} succeeded, ${result.failed} failed`);
  
  return result;
}
*/

// ============================================================================
// EXAMPLE 8: Custom Email with Template
// ============================================================================

/*
// Send a custom email using base template styling

import { sendEmail } from "@/lib/email-service";

async function sendCustomEmail(to: string, data: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #1a1a1a; padding: 30px; text-align: center; }
        .logo { color: #FFD300; font-size: 32px; font-weight: bold; }
        .content { padding: 40px 30px; }
        .button { 
          display: inline-block; 
          padding: 14px 32px; 
          background: #FFD300; 
          color: #1a1a1a; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CabScript</div>
        </div>
        <div class="content">
          <h1>Your Custom Message</h1>
          <p>Hello ${data.name},</p>
          <p>${data.message}</p>
          <a href="${data.link}" class="button">Take Action</a>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to,
    subject: data.subject,
    html,
  });
}
*/

// ============================================================================
// EXAMPLE 9: Error Handling Best Practices
// ============================================================================

/*
// Proper error handling for email sending

async function sendEmailWithRetry(emailFunction: () => Promise<boolean>, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const success = await emailFunction();
      
      if (success) {
        console.log(`Email sent successfully on attempt ${attempt}`);
        return true;
      }
      
      console.warn(`Email send attempt ${attempt} failed, retrying...`);
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    } catch (error) {
      console.error(`Email send error on attempt ${attempt}:`, error);
      
      if (attempt === maxRetries) {
        // Log to error tracking service (Sentry, etc.)
        console.error("All email retry attempts failed");
        return false;
      }
    }
  }
  
  return false;
}

// Usage
await sendEmailWithRetry(() => sendOrderConfirmationEmail({...}));
*/

// ============================================================================
// EXAMPLE 10: Email Logging for Tracking
// ============================================================================

/*
// Track all sent emails in database

import { sendEmail } from "@/lib/email-service";

async function sendAndLogEmail(emailData: {
  to: string;
  subject: string;
  html: string;
  type: string;
  relatedId?: string;
}) {
  // Send email
  const success = await sendEmail({
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
  });

  // Log to database
  await prisma.emailLog.create({
    data: {
      recipient: emailData.to,
      subject: emailData.subject,
      type: emailData.type,
      relatedId: emailData.relatedId,
      status: success ? "SENT" : "FAILED",
      sentAt: new Date(),
    }
  });

  return success;
}

// Usage
await sendAndLogEmail({
  to: "customer@example.com",
  subject: "Order Confirmation",
  html: emailContent.html,
  type: "ORDER_CONFIRMATION",
  relatedId: order.id,
});
*/

export {};
