/**
 * Safe Email Module
 * This module wraps SendGrid with runtime checks to prevent build-time errors
 */

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

// This will only load the actual email module at runtime
export async function sendEmail(options: EmailOptions) {
  if (process.env.NODE_ENV === 'production' || process.env.SENDGRID_API_KEY) {
    try {
      const emailModule = await import('./email');
      return await emailModule.sendEmail(options);
    } catch (error) {
      console.error('Email module load error:', error);
      return { success: false, error: 'Email service unavailable' };
    }
  }
  
  // Mock mode for development/build
  console.log('Mock email send:', options);
  return { success: true, messageId: 'mock-' + Date.now() };
}

export async function sendWelcomeEmail(to: string, name: string) {
  if (process.env.NODE_ENV === 'production' || process.env.SENDGRID_API_KEY) {
    try {
      const emailModule = await import('./email');
      return await emailModule.sendWelcomeEmail(to, name);
    } catch (error) {
      console.error('Email module load error:', error);
      return { success: false, error: 'Email service unavailable' };
    }
  }
  
  console.log('Mock welcome email:', { to, name });
  return { success: true };
}

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
  if (process.env.NODE_ENV === 'production' || process.env.SENDGRID_API_KEY) {
    try {
      const emailModule = await import('./email');
      return await emailModule.sendOrderConfirmationEmail(to, orderDetails);
    } catch (error) {
      console.error('Email module load error:', error);
      return { success: false, error: 'Email service unavailable' };
    }
  }
  
  console.log('Mock order confirmation:', { to, orderDetails });
  return { success: true };
}

export async function sendContactNotificationEmail(contactData: any) {
  if (process.env.NODE_ENV === 'production' || process.env.SENDGRID_API_KEY) {
    try {
      const emailModule = await import('./email');
      return await emailModule.sendContactNotificationEmail(contactData);
    } catch (error) {
      console.error('Email module load error:', error);
      return { success: false, error: 'Email service unavailable' };
    }
  }
  
  console.log('Mock contact notification:', contactData);
  return { success: true };
}

export async function sendNewsletterConfirmationEmail(to: string, name?: string) {
  if (process.env.NODE_ENV === 'production' || process.env.SENDGRID_API_KEY) {
    try {
      const emailModule = await import('./email');
      return await emailModule.sendNewsletterConfirmationEmail(to, name);
    } catch (error) {
      console.error('Email module load error:', error);
      return { success: false, error: 'Email service unavailable' };
    }
  }
  
  console.log('Mock newsletter confirmation:', { to, name });
  return { success: true };
}

export async function addToMarketingList(email: string, firstName?: string, lastName?: string) {
  if (process.env.NODE_ENV === 'production' || process.env.SENDGRID_API_KEY) {
    try {
      const emailModule = await import('./email');
      return await emailModule.addToMarketingList(email, firstName, lastName);
    } catch (error) {
      console.error('Email module load error:', error);
      return { success: false, error: 'Email service unavailable' };
    }
  }
  
  console.log('Mock marketing list add:', { email, firstName, lastName });
  return { success: true };
}
