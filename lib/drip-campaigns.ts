/**
 * Email Drip Campaign System
 * 
 * Automated email sequences for customer onboarding and engagement
 */

import { sendEmail } from './email-safe';
import { prisma } from './prisma';

export interface DripCampaign {
  id: string;
  name: string;
  description: string;
  emails: DripEmail[];
}

export interface DripEmail {
  id: string;
  subject: string;
  delayDays: number;
  html: string;
  status: 'active' | 'draft';
}

/**
 * Post-Purchase Onboarding Campaign
 * 5-email sequence over 14 days
 */
export const ONBOARDING_CAMPAIGN: DripCampaign = {
  id: 'onboarding',
  name: 'Post-Purchase Onboarding',
  description: 'Welcome new customers and guide them through setup',
  emails: [
    {
      id: 'day-1-welcome',
      subject: '🎉 Welcome to CabScript - Let\'s Get Started!',
      delayDays: 1,
      status: 'active',
      html: `
        <p>Hi {{name}},</p>
        <p>Welcome to the CabScript family! We're excited to help you launch your taxi booking business.</p>
        <h3>Quick Start Checklist:</h3>
        <ul>
          <li>✅ Download your software package</li>
          <li>📚 Review the documentation</li>
          <li>⚙️ Set up your admin dashboard</li>
          <li>🎨 Customize your branding</li>
        </ul>
        <p><a href="https://cabscript.com/docs/quick-start">View Quick Start Guide →</a></p>
      `,
    },
    {
      id: 'day-3-setup',
      subject: '🚀 Day 3: Setting Up Your Dashboard',
      delayDays: 3,
      status: 'active',
      html: `
        <p>Hi {{name}},</p>
        <p>Ready to configure your admin dashboard? Here's what you need to do:</p>
        <h3>Configuration Steps:</h3>
        <ol>
          <li>Add your business logo and colors</li>
          <li>Set up pricing and zones</li>
          <li>Configure payment gateways</li>
          <li>Add your first driver</li>
        </ol>
        <p><a href="https://cabscript.com/docs/dashboard-setup">Dashboard Setup Guide →</a></p>
        <p>Need help? Reply to this email or use our live chat!</p>
      `,
    },
    {
      id: 'day-5-drivers',
      subject: '👨‍💼 Day 5: Onboarding Your First Drivers',
      delayDays: 5,
      status: 'active',
      html: `
        <p>Hi {{name}},</p>
        <p>Time to bring drivers onto your platform! Here's how to get started:</p>
        <h3>Driver Onboarding:</h3>
        <ul>
          <li>📱 Share the driver app download link</li>
          <li>📋 Set up driver verification process</li>
          <li>💳 Configure driver payout settings</li>
          <li>📊 Train drivers on using the app</li>
        </ul>
        <p><a href="https://cabscript.com/docs/driver-onboarding">Driver Onboarding Guide →</a></p>
      `,
    },
    {
      id: 'day-7-marketing',
      subject: '📣 Day 7: Marketing Your Service',
      delayDays: 7,
      status: 'active',
      html: `
        <p>Hi {{name}},</p>
        <p>Your platform is almost ready! Now let's get customers:</p>
        <h3>Marketing Strategies:</h3>
        <ul>
          <li>🎁 Launch with promotional offers</li>
          <li>📱 Share on social media</li>
          <li>🤝 Partner with local businesses</li>
          <li>⭐ Encourage customer reviews</li>
        </ul>
        <p><a href="https://cabscript.com/docs/marketing-guide">Marketing Guide →</a></p>
        <p><strong>Special Bonus:</strong> Get our free marketing templates package!</p>
      `,
    },
    {
      id: 'day-14-success',
      subject: '🎊 Day 14: You\'re Ready to Launch!',
      delayDays: 14,
      status: 'active',
      html: `
        <p>Hi {{name}},</p>
        <p>Congratulations! You've completed the setup process. 🎉</p>
        <h3>Pre-Launch Checklist:</h3>
        <ul>
          <li>✓ Platform configured and tested</li>
          <li>✓ Drivers onboarded and trained</li>
          <li>✓ Marketing materials ready</li>
          <li>✓ Customer support set up</li>
        </ul>
        <p><strong>Time to go live!</strong></p>
        <p><a href="https://cabscript.com/docs/launch-checklist">Final Launch Checklist →</a></p>
        <p>We're here to support you every step of the way. Here's to your success! 🚀</p>
      `,
    },
  ],
};

/**
 * Engagement Campaign for Inactive Customers
 */
export const ENGAGEMENT_CAMPAIGN: DripCampaign = {
  id: 'engagement',
  name: 'Customer Re-engagement',
  description: 'Re-engage customers who haven\'t used the platform recently',
  emails: [
    {
      id: 'day-30-check-in',
      subject: '👋 We Miss You! How\'s Your Business Going?',
      delayDays: 30,
      status: 'active',
      html: `
        <p>Hi {{name}},</p>
        <p>We noticed you haven't logged in recently. Is everything okay?</p>
        <h3>Need Help With:</h3>
        <ul>
          <li>🔧 Technical issues?</li>
          <li>📚 Feature questions?</li>
          <li>📈 Growing your business?</li>
        </ul>
        <p>Book a free 30-minute consultation with our team:</p>
        <p><a href="https://cabscript.com/book-consultation">Schedule Now →</a></p>
      `,
    },
    {
      id: 'day-45-features',
      subject: '✨ You Might Have Missed These Features!',
      delayDays: 45,
      status: 'active',
      html: `
        <p>Hi {{name}},</p>
        <p>Did you know CabScript has these powerful features?</p>
        <h3>Feature Highlights:</h3>
        <ul>
          <li>📊 Advanced Analytics Dashboard</li>
          <li>💰 Dynamic Pricing Engine</li>
          <li>📱 Customer Loyalty Program</li>
          <li>🗺️ Heat Map Analysis</li>
        </ul>
        <p><a href="https://cabscript.com/features">Explore All Features →</a></p>
      `,
    },
    {
      id: 'day-60-success',
      subject: '🚀 Success Stories: How Others Are Thriving',
      delayDays: 60,
      status: 'active',
      html: `
        <p>Hi {{name}},</p>
        <p>Check out how other CabScript customers are succeeding:</p>
        <h3>Case Study: City Cabs</h3>
        <p>"We grew from 10 to 50 drivers in 3 months using CabScript!" - John D.</p>
        <p><a href="https://cabscript.com/case-studies">Read More Success Stories →</a></p>
        <p>Want similar results? Let's talk strategy!</p>
      `,
    },
  ],
};

/**
 * Schedule drip email for a customer
 */
export async function scheduleDripEmail(
  customerId: number,
  campaignId: string,
  emailId: string,
  sendAt: Date
) {
  try {
    await prisma.email_schedules.create({
      data: {
        id: crypto.randomUUID(),
        customerId,
        campaignId,
        emailId,
        sendAt,
        status: 'PENDING',
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error scheduling drip email:', error);
    return { success: false, error: 'Failed to schedule email' };
  }
}

/**
 * Enroll customer in drip campaign
 */
export async function enrollInCampaign(
  customerId: number,
  customerEmail: string,
  customerName: string,
  campaign: DripCampaign
) {
  try {
    const now = new Date();
    
    for (const email of campaign.emails) {
      if (email.status !== 'active') continue;
      
      const sendAt = new Date(now);
      sendAt.setDate(sendAt.getDate() + email.delayDays);
      
      await scheduleDripEmail(
        customerId,
        campaign.id,
        email.id,
        sendAt
      );
    }
    
    console.log(`Enrolled customer ${customerId} in campaign ${campaign.id}`);
    return { success: true };
  } catch (error) {
    console.error('Error enrolling in campaign:', error);
    return { success: false, error: 'Failed to enroll in campaign' };
  }
}

/**
 * Process scheduled emails (run this as a cron job)
 */
export async function processScheduledEmails() {
  try {
    const now = new Date();
    
    // Get pending emails that are due
    const dueEmails = await prisma.email_schedules.findMany({
      where: {
        status: 'PENDING',
        sendAt: {
          lte: now,
        },
      },
      include: {
        customers: true,
      },
      take: 50, // Process in batches
    });
    
    console.log(`Processing ${dueEmails.length} scheduled emails`);
    
    for (const scheduled of dueEmails) {
      try {
        // Find the campaign and email template
        const campaigns = [ONBOARDING_CAMPAIGN, ENGAGEMENT_CAMPAIGN];
        const campaign = campaigns.find(c => c.id === scheduled.campaignId);
        const emailTemplate = campaign?.emails.find(e => e.id === scheduled.emailId);
        
        if (!emailTemplate || !campaign) {
          console.error(`Template not found: ${scheduled.campaignId}/${scheduled.emailId}`);
          await prisma.email_schedules.update({
            where: { id: scheduled.id },
            data: { 
              status: 'FAILED',
              sentAt: now,
              error: 'Template not found',
            },
          });
          continue;
        }
        
        // Replace template variables
        const html = emailTemplate.html
          .replace(/\{\{name\}\}/g, scheduled.customers.name || 'there')
          .replace(/\{\{email\}\}/g, scheduled.customers.email);
        
        // Send email
        const result = await sendEmail({
          to: scheduled.customers.email,
          subject: emailTemplate.subject,
          html,
        });
        
        // Update schedule status
        if (result.success) {
          await prisma.email_schedules.update({
            where: { id: scheduled.id },
            data: { 
              status: 'SENT',
              sentAt: now,
            },
          });
        } else {
          await prisma.email_schedules.update({
            where: { id: scheduled.id },
            data: { 
              status: 'FAILED',
              sentAt: now,
              error: result.error,
            },
          });
        }
        
      } catch (error: any) {
        console.error(`Error sending scheduled email ${scheduled.id}:`, error);
        await prisma.email_schedules.update({
          where: { id: scheduled.id },
          data: { 
            status: 'FAILED',
            sentAt: now,
            error: error.message,
          },
        });
      }
    }
    
    return { success: true, processed: dueEmails.length };
  } catch (error) {
    console.error('Error processing scheduled emails:', error);
    return { success: false, error: 'Failed to process emails' };
  }
}

/**
 * Cancel customer's drip campaign
 */
export async function unenrollFromCampaign(customerId: number, campaignId: string) {
  try {
    await prisma.email_schedules.updateMany({
      where: {
        customerId,
        campaignId,
        status: 'PENDING',
      },
      data: {
        status: 'CANCELLED',
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error unenrolling from campaign:', error);
    return { success: false, error: 'Failed to unenroll' };
  }
}
