/**
 * Email Service Configuration
 * Supports multiple providers: Resend, SendGrid, or console logging for development
 */

// Email provider configuration
export const EMAIL_CONFIG = {
  provider: (process.env.EMAIL_PROVIDER || "console") as "resend" | "sendgrid" | "console",
  from: {
    email: process.env.EMAIL_FROM || "noreply@cabscript.com",
    name: process.env.EMAIL_FROM_NAME || "CabScript",
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || "",
  },
};

// Email templates base URLs
export const EMAIL_URLS = {
  website: process.env.NEXT_PUBLIC_SITE_URL || "https://cabscript.com",
  adminPanel: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/crads`
    : "https://cabscript.com/crads",
  downloadPortal: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/download`
    : "https://cabscript.com/download",
};

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const provider = EMAIL_CONFIG.provider;

    if (provider === "console") {
      // Development mode - log to console
      // console.log("📧 Email (Console Mode):");
      // console.log("From:", EMAIL_CONFIG.from.email);
      // console.log("To:", options.to);
      // console.log("Subject:", options.subject);
      // console.log("HTML:", options.html.substring(0, 200) + "...");
      return true;
    }

    if (provider === "resend") {
      return await sendEmailViaResend(options);
    }

    if (provider === "sendgrid") {
      return await sendEmailViaSendGrid(options);
    }

    throw new Error(`Unknown email provider: ${provider}`);
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

/**
 * Send email via Resend
 */
async function sendEmailViaResend(options: EmailOptions): Promise<boolean> {
  try {
    // Dynamic import - resend package is optional
    const resendModule = await import("resend").catch(() => null);
    
    if (!resendModule) {
      console.warn("⚠️ Resend package not installed. Install with: npm install resend");
      return false;
    }
    
    // @ts-ignore - Dynamic import of optional dependency
    const Resend = resendModule.default || resendModule.Resend;
    const resend = new Resend(EMAIL_CONFIG.resend.apiKey);

    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.from.name} <${EMAIL_CONFIG.from.email}>`,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
    });

    console.log("✅ Email sent via Resend:", result);
    return true;
  } catch (error) {
    console.error("Resend error:", error);
    return false;
  }
}

/**
 * Send email via SendGrid
 */
async function sendEmailViaSendGrid(options: EmailOptions): Promise<boolean> {
  try {
    // Dynamic import - @sendgrid/mail package is optional
    const sgMailModule = await import("@sendgrid/mail").catch(() => null);
    
    if (!sgMailModule) {
      console.warn("⚠️ SendGrid package not installed. Install with: npm install @sendgrid/mail");
      return false;
    }
    
    // @ts-ignore - Dynamic import of optional dependency
    const sgMail = sgMailModule.default;
    sgMail.setApiKey(EMAIL_CONFIG.sendgrid.apiKey);

    await sgMail.send({
      from: {
        email: EMAIL_CONFIG.from.email,
        name: EMAIL_CONFIG.from.name,
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
    });

    console.log("✅ Email sent via SendGrid");
    return true;
  } catch (error) {
    console.error("SendGrid error:", error);
    return false;
  }
}

/**
 * Batch send emails (for newsletters, bulk notifications)
 */
export async function sendBulkEmails(
  emails: Array<{ to: string; subject: string; html: string; text?: string }>
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const success = await sendEmail(email);
    if (success) {
      sent++;
    } else {
      failed++;
    }
    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { sent, failed };
}

/**
 * Send demo request notification to admin
 */
export async function sendDemoRequestEmail(demoData: {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  preferredDate: Date;
  preferredTime: string;
  createdAt: Date;
}): Promise<boolean> {
  const subject = `New Demo Request from ${demoData.name}`;
  
  const html = `
    <h2>New Demo Request</h2>
    <p>A new demo request has been submitted on CabScript.com:</p>
    
    <h3>Customer Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${demoData.name}</li>
      <li><strong>Email:</strong> ${demoData.email}</li>
      <li><strong>Phone:</strong> ${demoData.phone || 'Not provided'}</li>
      <li><strong>Company:</strong> ${demoData.company || 'Not provided'}</li>
    </ul>
    
    <h3>Preferred Demo Schedule:</h3>
    <ul>
      <li><strong>Date:</strong> ${demoData.preferredDate.toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${demoData.preferredTime}</li>
    </ul>
    
    <h3>Request Details:</h3>
    <ul>
      <li><strong>Request ID:</strong> #${demoData.id}</li>
      <li><strong>Submitted:</strong> ${demoData.createdAt.toLocaleString()}</li>
    </ul>
    
    <p><a href="${EMAIL_URLS.adminPanel}/demo-requests" style="background: #FFD300; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Manage Demo Request</a></p>
  `;

  const text = `
    New Demo Request from ${demoData.name}
    
    Customer Details:
    - Name: ${demoData.name}
    - Email: ${demoData.email}
    - Phone: ${demoData.phone || 'Not provided'}
    - Company: ${demoData.company || 'Not provided'}
    
    Preferred Demo Schedule:
    - Date: ${demoData.preferredDate.toLocaleDateString()}
    - Time: ${demoData.preferredTime}
    
    Request ID: #${demoData.id}
    Submitted: ${demoData.createdAt.toLocaleString()}
    
    Manage at: ${EMAIL_URLS.adminPanel}/demo-requests
  `;

  return await sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@cabscript.com',
    subject,
    html,
    text,
  });
}

/**
 * Send demo confirmation email to customer
 */
export async function sendDemoConfirmationEmail(customerEmail: string, customerName: string): Promise<boolean> {
  const subject = 'Demo Request Received - CabScript.com';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Thank you for your demo request!</h2>
      
      <p>Dear ${customerName},</p>
      
      <p>We have received your demo request for our taxi booking script. Our team will review your request and contact you within 24 hours to schedule your personalized demo session.</p>
      
      <h3 style="color: #333;">What's Next?</h3>
      <ul>
        <li>Our sales team will contact you to confirm your preferred demo time</li>
        <li>We'll prepare a customized demo based on your requirements</li>
        <li>You'll see how our taxi script can help grow your business</li>
      </ul>
      
      <h3 style="color: #333;">Questions?</h3>
      <p>If you have any immediate questions, feel free to reach out to us:</p>
      <ul>
        <li>Email: <a href="mailto:sales@cabscript.com">sales@cabscript.com</a></li>
        <li>WhatsApp: <a href="https://wa.me/1234567890">+1 (234) 567-890</a></li>
      </ul>
      
      <p style="margin-top: 30px;">
        <a href="${EMAIL_URLS.website}" style="background: #FFD300; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Our Website</a>
      </p>
      
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Best regards,<br>
        The CabScript Team
      </p>
    </div>
  `;

  const text = `
    Thank you for your demo request!
    
    Dear ${customerName},
    
    We have received your demo request for our taxi booking script. Our team will review your request and contact you within 24 hours to schedule your personalized demo session.
    
    What's Next?
    - Our sales team will contact you to confirm your preferred demo time
    - We'll prepare a customized demo based on your requirements
    - You'll see how our taxi script can help grow your business
    
    Questions?
    If you have any immediate questions, feel free to reach out to us:
    - Email: sales@cabscript.com
    - WhatsApp: +1 (234) 567-890
    
    Visit our website: ${EMAIL_URLS.website}
    
    Best regards,
    The CabScript Team
  `;

  return await sendEmail({
    to: customerEmail,
    subject,
    html,
    text,
  });
}
