// DO NOT import SendGrid at module level - causes build errors
// Import only when actually needed

let sgMail: any = null;
let sgClient: any = null;
let isInitialized = false;

async function initializeSendGrid() {
  if (!isInitialized) {
    try {
      // Only initialize in server runtime, not during build
      if (typeof window !== 'undefined') return;
      
      const apiKey = process.env.SENDGRID_API_KEY;
      if (!apiKey || apiKey.includes('mock')) {
        console.log('SendGrid: Mock mode (no real API key)');
        isInitialized = true;
        return;
      }

      // Dynamic import to avoid build-time loading
      const [sgMailModule, sgClientModule] = await Promise.all([
        import('@sendgrid/mail'),
        import('@sendgrid/client'),
      ]);
      
      sgMail = sgMailModule.default;
      sgClient = sgClientModule.default;
      
      sgMail.setApiKey(apiKey);
      sgClient.setApiKey(apiKey);
      isInitialized = true;
      console.log('SendGrid initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SendGrid:', error);
      isInitialized = true; // Mark as initialized to prevent retry loops
    }
  }
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  from?: string;
  replyTo?: string;
}

/**
 * Send a single email using SendGrid
 */
export async function sendEmail(options: EmailOptions) {
  try {
    // Initialize SendGrid on first use
    await initializeSendGrid();
    
    if (!sgMail) {
      console.error('SendGrid not initialized');
      return { success: false, error: 'Email service not available' };
    }
    
    const msg: any = {
      to: options.to,
      from: options.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@cabscript.com',
      replyTo: options.replyTo || process.env.SENDGRID_REPLY_TO_EMAIL || 'support@cabscript.com',
      subject: options.subject,
    };

    // Add content based on what's provided
    if (options.templateId) {
      msg.templateId = options.templateId;
      msg.dynamicTemplateData = options.dynamicTemplateData || {};
    } else {
      if (options.text) msg.text = options.text;
      if (options.html) msg.html = options.html;
    }

    const response = await sgMail.send(msg);
    console.log('Email sent successfully:', response[0].statusCode);
    return { success: true, messageId: response[0].headers['x-message-id'] };
  } catch (error: any) {
    console.error('SendGrid error:', error.response?.body || error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to new customer
 */
export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to CabScript</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center;">
                  <div style="background-color: #FFD300; width: 60px; height: 60px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                    <span style="font-size: 32px; font-weight: bold; color: #1a1a1a;">CS</span>
                  </div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to CabScript!</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px;">
                    Hi <strong>${name}</strong>,
                  </p>
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px;">
                    Thank you for choosing CabScript! We're thrilled to have you on board. 🎉
                  </p>
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px;">
                    CabScript is your complete solution for launching a professional taxi booking business. With our ready-to-deploy software, you'll be up and running in no time.
                  </p>
                  
                  <!-- Quick Start Guide -->
                  <div style="background-color: #f8f8f8; border-left: 4px solid #FFD300; padding: 20px; margin: 30px 0;">
                    <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 15px;">🚀 Quick Start Guide</h2>
                    <ol style="color: #555555; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                      <li>Check your email for order confirmation and download links</li>
                      <li>Review the documentation and setup guide</li>
                      <li>Configure your admin dashboard</li>
                      <li>Customize branding and settings</li>
                      <li>Launch your taxi booking service!</li>
                    </ol>
                  </div>
                  
                  <!-- What's Included -->
                  <h2 style="color: #1a1a1a; font-size: 18px; margin: 30px 0 15px;">📦 What's Included</h2>
                  <ul style="color: #555555; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Admin Dashboard</strong> - Complete business management</li>
                    <li><strong>Driver App</strong> - iOS & Android ready</li>
                    <li><strong>Customer App</strong> - Seamless booking experience</li>
                    <li><strong>Source Code</strong> - Full ownership and customization</li>
                    <li><strong>Documentation</strong> - Step-by-step guides</li>
                    <li><strong>Free Updates</strong> - First 6 months included</li>
                  </ul>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="https://cabscript.com/admin/login" style="display: inline-block; background-color: #FFD300; color: #1a1a1a; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Access Your Dashboard →
                    </a>
                  </div>
                  
                  <!-- Support Info -->
                  <div style="background-color: #fff9e6; border-radius: 6px; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 10px;">💬 Need Help?</h3>
                    <p style="color: #555555; font-size: 14px; line-height: 1.6; margin: 0;">
                      Our support team is here to help! Reach out anytime:
                    </p>
                    <p style="color: #555555; font-size: 14px; margin: 10px 0 0;">
                      📧 <a href="mailto:support@cabscript.com" style="color: #FFD300; text-decoration: none;">support@cabscript.com</a><br>
                      💬 Live Chat on our website<br>
                      📱 WhatsApp Support available
                    </p>
                  </div>
                  
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 30px 0 0;">
                    We're excited to see your business grow with CabScript!
                  </p>
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 10px 0 0;">
                    Best regards,<br>
                    <strong>The CabScript Team</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #888888; font-size: 12px; margin: 0 0 10px;">
                    © 2025 CabScript. All rights reserved.
                  </p>
                  <p style="color: #888888; font-size: 12px; margin: 0;">
                    <a href="https://cabscript.com/privacy" style="color: #888888; text-decoration: none;">Privacy Policy</a> | 
                    <a href="https://cabscript.com/terms" style="color: #888888; text-decoration: none;">Terms of Service</a> | 
                    <a href="https://cabscript.com" style="color: #888888; text-decoration: none;">Visit Website</a>
                  </p>
                  <p style="color: #888888; font-size: 11px; margin: 15px 0 0;">
                    This email was sent to ${to}. If you didn't sign up for CabScript, please ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: '🎉 Welcome to CabScript - Your Journey Starts Here!',
    html,
  });
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  to: string,
  orderDetails: {
    orderId: string;
    customerName: string;
    plan: string;
    amount: string;
    orderDate: string;
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center;">
                  <div style="background-color: #FFD300; width: 60px; height: 60px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                    <span style="font-size: 32px; font-weight: bold; color: #1a1a1a;">CS</span>
                  </div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Order Confirmed! ✓</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 20px;">
                    Hi <strong>${orderDetails.customerName}</strong>,
                  </p>
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 0 0 30px;">
                    Thank you for your purchase! Your order has been confirmed and is being processed.
                  </p>
                  
                  <!-- Order Details Box -->
                  <div style="background-color: #f8f8f8; border-radius: 8px; padding: 25px; margin: 30px 0;">
                    <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px; padding-bottom: 15px; border-bottom: 2px solid #FFD300;">
                      📋 Order Details
                    </h2>
                    <table width="100%" cellpadding="8" cellspacing="0" border="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Order ID:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">#${orderDetails.orderId}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Plan:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${orderDetails.plan}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Amount Paid:</td>
                        <td style="color: #10b981; font-size: 18px; font-weight: bold; text-align: right; padding: 8px 0;">${orderDetails.amount}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Order Date:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${orderDetails.orderDate}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- What's Next -->
                  <div style="background-color: #fff9e6; border-left: 4px solid #FFD300; padding: 20px; margin: 30px 0;">
                    <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 15px;">🚀 What's Next?</h2>
                    <ol style="color: #555555; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                      <li>You'll receive download links within 24 hours</li>
                      <li>Our team will set up your admin credentials</li>
                      <li>You'll get access to complete documentation</li>
                      <li>Free onboarding session with our team</li>
                      <li>Launch your business in 7 days!</li>
                    </ol>
                  </div>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="https://cabscript.com/admin/login" style="display: inline-block; background-color: #FFD300; color: #1a1a1a; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-right: 10px;">
                      Access Dashboard →
                    </a>
                    <a href="https://cabscript.com/docs" style="display: inline-block; background-color: #f8f8f8; color: #1a1a1a; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; border: 2px solid #e0e0e0;">
                      View Documentation
                    </a>
                  </div>
                  
                  <!-- Support -->
                  <div style="background-color: #f0f9ff; border-radius: 6px; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 10px;">💬 Need Help?</h3>
                    <p style="color: #555555; font-size: 14px; line-height: 1.6; margin: 0;">
                      Our dedicated support team is ready to assist you 24/7:
                    </p>
                    <p style="color: #555555; font-size: 14px; margin: 10px 0 0;">
                      📧 <a href="mailto:support@cabscript.com" style="color: #3b82f6; text-decoration: none;">support@cabscript.com</a><br>
                      💬 Live Chat: <a href="https://cabscript.com" style="color: #3b82f6; text-decoration: none;">cabscript.com</a><br>
                      📱 WhatsApp: Available on website
                    </p>
                  </div>
                  
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 30px 0 0;">
                    Thank you for trusting CabScript with your business!
                  </p>
                  <p style="font-size: 16px; color: #333333; line-height: 1.6; margin: 10px 0 0;">
                    Best regards,<br>
                    <strong>The CabScript Team</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #888888; font-size: 12px; margin: 0 0 10px;">
                    © 2025 CabScript. All rights reserved.
                  </p>
                  <p style="color: #888888; font-size: 12px; margin: 0;">
                    <a href="https://cabscript.com/privacy" style="color: #888888; text-decoration: none;">Privacy Policy</a> | 
                    <a href="https://cabscript.com/terms" style="color: #888888; text-decoration: none;">Terms of Service</a> | 
                    <a href="https://cabscript.com/refund" style="color: #888888; text-decoration: none;">Refund Policy</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Order Confirmed - #${orderDetails.orderId} | CabScript`,
    html,
  });
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotificationEmail(contactData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #1a1a1a; margin: 0 0 20px;">📧 New Contact Form Submission</h2>
        
        <table width="100%" cellpadding="8" cellspacing="0" border="0" style="background-color: #f8f8f8; border-radius: 6px;">
          <tr>
            <td style="color: #666666; font-weight: bold; padding: 12px;">Name:</td>
            <td style="color: #1a1a1a; padding: 12px;">${contactData.name}</td>
          </tr>
          <tr>
            <td style="color: #666666; font-weight: bold; padding: 12px;">Email:</td>
            <td style="color: #1a1a1a; padding: 12px;"><a href="mailto:${contactData.email}" style="color: #3b82f6; text-decoration: none;">${contactData.email}</a></td>
          </tr>
          ${contactData.phone ? `
          <tr>
            <td style="color: #666666; font-weight: bold; padding: 12px;">Phone:</td>
            <td style="color: #1a1a1a; padding: 12px;">${contactData.phone}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="color: #666666; font-weight: bold; padding: 12px;">Submitted:</td>
            <td style="color: #1a1a1a; padding: 12px;">${contactData.submittedAt}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 20px; background-color: #fff9e6; border-left: 4px solid #FFD300; border-radius: 4px;">
          <h3 style="color: #1a1a1a; margin: 0 0 10px; font-size: 16px;">Message:</h3>
          <p style="color: #333333; line-height: 1.6; margin: 0;">${contactData.message}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${contactData.email}?subject=Re: Your CabScript Inquiry" style="display: inline-block; background-color: #FFD300; color: #1a1a1a; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
            Reply to Customer
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@cabscript.com',
    subject: `🔔 New Contact: ${contactData.name} - ${contactData.email}`,
    html,
    replyTo: contactData.email,
  });
}

/**
 * Send newsletter subscription confirmation
 */
export async function sendNewsletterConfirmationEmail(to: string, name?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Newsletter Subscription Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #FFD300; margin: 0; font-size: 28px;">🎉 You're Subscribed!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    ${name ? `Hi ${name},` : 'Hello!'}
                  </p>
                  <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    Thank you for subscribing to the CabScript newsletter! 🚀
                  </p>
                  <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                    You'll now receive:
                  </p>
                  <ul style="color: #555555; font-size: 14px; line-height: 1.8;">
                    <li>Latest product updates and features</li>
                    <li>Industry insights and best practices</li>
                    <li>Exclusive offers and discounts</li>
                    <li>Tips to grow your taxi business</li>
                  </ul>
                  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin: 30px 0;">
                    <p style="color: #555555; font-size: 14px; margin: 0;">
                      💡 <strong>Pro Tip:</strong> Add <a href="mailto:newsletter@cabscript.com" style="color: #3b82f6;">newsletter@cabscript.com</a> to your contacts to ensure you never miss an update!
                    </p>
                  </div>
                  <p style="font-size: 14px; color: #888888; line-height: 1.6; margin-top: 30px;">
                    You can unsubscribe at any time by clicking the unsubscribe link in our emails.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #888888; font-size: 12px; margin: 0;">
                    © 2025 CabScript. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: '✓ Newsletter Subscription Confirmed - CabScript',
    html,
  });
}

/**
 * Add contact to SendGrid marketing list
 */
export async function addToMarketingList(email: string, firstName?: string, lastName?: string) {
  try {
    // Initialize SendGrid on first use
    await initializeSendGrid();
    
    if (!sgClient) {
      console.error('SendGrid client not initialized');
      return { success: false, error: 'Email service not available' };
    }
    
    const listId = process.env.SENDGRID_MARKETING_LIST_ID;
    if (!listId) {
      console.warn('SENDGRID_MARKETING_LIST_ID not configured');
      return { success: false, error: 'Marketing list not configured' };
    }

    const data = {
      list_ids: [listId],
      contacts: [
        {
          email,
          first_name: firstName || '',
          last_name: lastName || '',
        },
      ],
    };

    const request = {
      method: 'PUT' as const,
      url: '/v3/marketing/contacts',
      body: data,
    };

    const [response] = await sgClient.request(request);
    console.log('Contact added to marketing list:', response.statusCode);
    return { success: true };
  } catch (error: any) {
    console.error('SendGrid marketing list error:', error.response?.body || error.message);
    return { success: false, error: error.message };
  }
}
