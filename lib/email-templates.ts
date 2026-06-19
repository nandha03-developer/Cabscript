/**
 * Email Templates
 * Professional, responsive HTML email templates for all email types
 */

import { EMAIL_URLS } from "./email-service";

const baseStyles = `
  body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .header { background-color: #1a1a1a; padding: 30px; text-align: center; }
  .logo { font-size: 32px; font-weight: bold; color: #FFD300; }
  .content { padding: 40px 30px; }
  .button { display: inline-block; padding: 14px 32px; background-color: #FFD300; color: #1a1a1a; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
  .footer { background-color: #f9f9f9; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  .divider { border-top: 1px solid #e0e0e0; margin: 30px 0; }
  h1 { color: #1a1a1a; font-size: 28px; margin: 0 0 20px; }
  h2 { color: #333; font-size: 22px; margin: 30px 0 15px; }
  p { color: #555; line-height: 1.6; margin: 15px 0; }
  .info-box { background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 20px 0; }
  .highlight { background-color: #FFF9E6; padding: 20px; border-left: 4px solid #FFD300; margin: 20px 0; }
`;

/**
 * Order Confirmation Email
 */
export function orderConfirmationEmail(data: {
  customerName: string;
  orderNumber: string;
  plan: string;
  amount: number;
  currency: string;
}): { subject: string; html: string } {
  return {
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CabScript</div>
      <p style="color: #FFD300; margin: 10px 0 0;">Taxi Booking Software</p>
    </div>
    
    <div class="content">
      <h1>🎉 Thank You for Your Order!</h1>
      
      <p>Hi ${data.customerName},</p>
      
      <p>We're excited to confirm that we've received your order. Your payment has been processed successfully, and we're preparing your CabScript package for delivery.</p>
      
      <div class="info-box">
        <h2 style="margin-top: 0;">Order Details</h2>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Package:</strong> ${data.plan}</p>
        <p><strong>Amount Paid:</strong> ${data.currency} ${data.amount.toFixed(2)}</p>
        <p><strong>Status:</strong> <span style="color: #10b981;">Processing</span></p>
      </div>
      
      <div class="highlight">
        <p style="margin: 0;"><strong>📦 What's Next?</strong></p>
        <p style="margin: 10px 0 0;">Your license key and download links will be sent to you within 24 hours. You'll receive a separate email with all the installation instructions and documentation.</p>
      </div>
      
      <a href="${EMAIL_URLS.adminPanel}/orders/${data.orderNumber}" class="button">View Order Status</a>
      
      <div class="divider"></div>
      
      <h2>Need Help?</h2>
      <p>If you have any questions or need assistance, our support team is here to help:</p>
      <ul>
        <li>Email: support@cabscript.com</li>
        <li>Live Chat: Available on our website</li>
        <li>Response Time: Within 24 hours</li>
      </ul>
    </div>
    
    <div class="footer">
      <p><strong>CabScript</strong> - Professional Taxi Booking Software</p>
      <p>© ${new Date().getFullYear()} CabScript. All rights reserved.</p>
      <p style="margin-top: 15px;">
        <a href="${EMAIL_URLS.website}" style="color: #666; margin: 0 10px;">Website</a> |
        <a href="${EMAIL_URLS.website}/support" style="color: #666; margin: 0 10px;">Support</a> |
        <a href="${EMAIL_URLS.website}/docs" style="color: #666; margin: 0 10px;">Documentation</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

/**
 * License Key Delivery Email
 */
export function licenseKeyEmail(data: {
  customerName: string;
  orderNumber: string;
  plan: string;
  licenseKey: string;
  downloadUrl: string;
  expiryDate?: Date;
}): { subject: string; html: string } {
  const expiryText = data.expiryDate
    ? `Valid until ${data.expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
    : "Lifetime License";

  return {
    subject: `Your CabScript License Key - ${data.orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CabScript</div>
      <p style="color: #FFD300; margin: 10px 0 0;">Your License is Ready!</p>
    </div>
    
    <div class="content">
      <h1>🔑 Your License Key is Here!</h1>
      
      <p>Hi ${data.customerName},</p>
      
      <p>Great news! Your CabScript ${data.plan} package is ready for download. Below you'll find your license key and download link.</p>
      
      <div class="highlight">
        <h2 style="margin-top: 0;">License Information</h2>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Package:</strong> ${data.plan}</p>
        <p style="font-size: 18px; background: #fff; padding: 15px; border-radius: 4px; margin: 15px 0; word-break: break-all;">
          <strong>License Key:</strong><br>
          <code style="color: #0066cc;">${data.licenseKey}</code>
        </p>
        <p><strong>Validity:</strong> ${expiryText}</p>
      </div>
      
      <a href="${data.downloadUrl}" class="button">Download CabScript</a>
      
      <div class="divider"></div>
      
      <h2>📋 Installation Steps</h2>
      <ol>
        <li>Download the package using the button above</li>
        <li>Extract the files to your server</li>
        <li>Follow the installation guide in the documentation</li>
        <li>Enter your license key when prompted</li>
        <li>Configure your settings and start using CabScript!</li>
      </ol>
      
      <div class="info-box">
        <p><strong>📚 Important Resources:</strong></p>
        <ul style="margin: 10px 0;">
          <li><a href="${EMAIL_URLS.website}/docs/installation">Installation Guide</a></li>
          <li><a href="${EMAIL_URLS.website}/docs/configuration">Configuration Manual</a></li>
          <li><a href="${EMAIL_URLS.website}/docs/api">API Documentation</a></li>
          <li><a href="${EMAIL_URLS.website}/support">Support Portal</a></li>
        </ul>
      </div>
      
      <div class="divider"></div>
      
      <h2>Need Assistance?</h2>
      <p>Our technical support team is ready to help you get started:</p>
      <ul>
        <li><strong>Email:</strong> support@cabscript.com</li>
        <li><strong>Live Chat:</strong> Available 24/7 on our website</li>
        <li><strong>Installation Support:</strong> Free for the first 30 days</li>
      </ul>
    </div>
    
    <div class="footer">
      <p><strong>CabScript</strong> - Professional Taxi Booking Software</p>
      <p>© ${new Date().getFullYear()} CabScript. All rights reserved.</p>
      <p style="font-size: 12px; color: #999; margin-top: 15px;">
        Please keep your license key secure and do not share it with others.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

/**
 * Appointment Reminder Email
 */
export function appointmentReminderEmail(data: {
  customerName: string;
  appointmentDate: Date;
  appointmentType: string;
  location?: string;
  notes?: string;
}): { subject: string; html: string } {
  const formattedDate = data.appointmentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = data.appointmentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    subject: `Reminder: Your Appointment on ${formattedDate}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CabScript</div>
      <p style="color: #FFD300; margin: 10px 0 0;">Appointment Reminder</p>
    </div>
    
    <div class="content">
      <h1>📅 Appointment Reminder</h1>
      
      <p>Hi ${data.customerName},</p>
      
      <p>This is a friendly reminder about your upcoming appointment with CabScript.</p>
      
      <div class="highlight">
        <h2 style="margin-top: 0;">Appointment Details</h2>
        <p><strong>Type:</strong> ${data.appointmentType}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
        ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ""}
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
      </div>
      
      <a href="${EMAIL_URLS.website}/contact" class="button">Contact Us</a>
      
      <p>If you need to reschedule or have any questions, please contact us as soon as possible.</p>
    </div>
    
    <div class="footer">
      <p><strong>CabScript</strong> - Professional Taxi Booking Software</p>
      <p>© ${new Date().getFullYear()} CabScript. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

/**
 * Password Reset Email
 */
export function passwordResetEmail(data: {
  name: string;
  resetToken: string;
  expiresIn: string;
}): { subject: string; html: string } {
  const resetUrl = `${EMAIL_URLS.adminPanel}/reset-password?token=${data.resetToken}`;

  return {
    subject: "Password Reset Request - CabScript Admin",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CabScript</div>
      <p style="color: #FFD300; margin: 10px 0 0;">Admin Panel</p>
    </div>
    
    <div class="content">
      <h1>🔐 Password Reset Request</h1>
      
      <p>Hi ${data.name},</p>
      
      <p>We received a request to reset your CabScript admin panel password. Click the button below to create a new password:</p>
      
      <a href="${resetUrl}" class="button">Reset Password</a>
      
      <div class="info-box">
        <p style="margin: 0;"><strong>⏰ Important:</strong></p>
        <p style="margin: 10px 0 0;">This link will expire in ${data.expiresIn}. If you didn't request this password reset, please ignore this email.</p>
      </div>
      
      <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="font-size: 12px; word-break: break-all; color: #0066cc;">${resetUrl}</p>
      
      <div class="divider"></div>
      
      <h2>Security Tip</h2>
      <p>For your security, we recommend:</p>
      <ul>
        <li>Using a strong, unique password</li>
        <li>Enabling two-factor authentication</li>
        <li>Never sharing your admin credentials</li>
      </ul>
    </div>
    
    <div class="footer">
      <p><strong>CabScript</strong> - Professional Taxi Booking Software</p>
      <p>© ${new Date().getFullYear()} CabScript. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

/**
 * Support Ticket Notification Email
 */
export function supportTicketEmail(data: {
  customerName: string;
  ticketId: string;
  subject: string;
  priority: string;
  message: string;
}): { subject: string; html: string } {
  const priorityColors: Record<string, string> = {
    LOW: "#10b981",
    MEDIUM: "#f59e0b",
    HIGH: "#f97316",
    CRITICAL: "#ef4444",
  };

  const priorityColor = priorityColors[data.priority] || "#6b7280";

  return {
    subject: `Support Ticket Created - ${data.ticketId}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CabScript</div>
      <p style="color: #FFD300; margin: 10px 0 0;">Support Team</p>
    </div>
    
    <div class="content">
      <h1>🎫 Support Ticket Created</h1>
      
      <p>Hi ${data.customerName},</p>
      
      <p>We've received your support request and our team is reviewing it. Here are the details:</p>
      
      <div class="info-box">
        <p><strong>Ticket ID:</strong> ${data.ticketId}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Priority:</strong> <span style="color: ${priorityColor}; font-weight: bold;">${data.priority}</span></p>
        <p><strong>Status:</strong> <span style="color: #0066cc;">Open</span></p>
      </div>
      
      <div class="highlight">
        <p style="margin: 0;"><strong>Your Message:</strong></p>
        <p style="margin: 10px 0 0;">${data.message}</p>
      </div>
      
      <a href="${EMAIL_URLS.adminPanel}/support/${data.ticketId}" class="button">View Ticket</a>
      
      <div class="divider"></div>
      
      <h2>What Happens Next?</h2>
      <ul>
        <li>Our support team will review your ticket</li>
        <li>You'll receive updates via email</li>
        <li>Expected response time: Within 24 hours</li>
        <li>You can reply to this email to add more information</li>
      </ul>
    </div>
    
    <div class="footer">
      <p><strong>CabScript Support</strong></p>
      <p>Email: support@cabscript.com | Live Chat: cabscript.com</p>
      <p>© ${new Date().getFullYear()} CabScript. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

/**
 * Invoice Email
 */
export function invoiceEmail(data: {
  customerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: Date;
  invoiceUrl: string;
}): { subject: string; html: string } {
  const formattedDueDate = data.dueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    subject: `Invoice ${data.invoiceNumber} from CabScript`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CabScript</div>
      <p style="color: #FFD300; margin: 10px 0 0;">Invoice</p>
    </div>
    
    <div class="content">
      <h1>📄 Invoice ${data.invoiceNumber}</h1>
      
      <p>Hi ${data.customerName},</p>
      
      <p>Thank you for your business! Please find your invoice details below.</p>
      
      <div class="info-box">
        <h2 style="margin-top: 0;">Invoice Details</h2>
        <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
        <p><strong>Amount:</strong> ${data.currency} ${data.amount.toFixed(2)}</p>
        <p><strong>Due Date:</strong> ${formattedDueDate}</p>
        <p><strong>Status:</strong> <span style="color: #10b981;">Paid</span></p>
      </div>
      
      <a href="${data.invoiceUrl}" class="button">Download Invoice (PDF)</a>
      
      <p>This invoice has been marked as paid. Thank you for your payment!</p>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666;">
        If you have any questions about this invoice, please contact our billing department at billing@cabscript.com
      </p>
    </div>
    
    <div class="footer">
      <p><strong>CabScript</strong> - Professional Taxi Booking Software</p>
      <p>© ${new Date().getFullYear()} CabScript. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}
