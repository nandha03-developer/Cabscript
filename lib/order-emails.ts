/**
 * Order Email Integration
 * Send automated emails when orders are created or updated
 */

import { sendEmail } from "./email-service";
import { orderConfirmationEmail, licenseKeyEmail, invoiceEmail } from "./email-templates";

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(orderData: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  plan: string;
  amount: number;
  currency: string;
}): Promise<boolean> {
  try {
    const emailContent = orderConfirmationEmail({
      customerName: orderData.customerName,
      orderNumber: orderData.orderNumber,
      plan: orderData.plan,
      amount: orderData.amount,
      currency: orderData.currency,
    });

    return await sendEmail({
      to: orderData.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  } catch (error) {
    console.error("Send order confirmation error:", error);
    return false;
  }
}

/**
 * Send license key delivery email
 */
export async function sendLicenseKeyEmail(orderData: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  plan: string;
  licenseKey: string;
  downloadUrl: string;
  expiryDate?: Date;
}): Promise<boolean> {
  try {
    const emailContent = licenseKeyEmail({
      customerName: orderData.customerName,
      orderNumber: orderData.orderNumber,
      plan: orderData.plan,
      licenseKey: orderData.licenseKey,
      downloadUrl: orderData.downloadUrl,
      expiryDate: orderData.expiryDate,
    });

    return await sendEmail({
      to: orderData.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  } catch (error) {
    console.error("Send license key error:", error);
    return false;
  }
}

/**
 * Send invoice email
 */
export async function sendInvoiceEmail(invoiceData: {
  customerEmail: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: Date;
  invoiceUrl: string;
}): Promise<boolean> {
  try {
    const emailContent = invoiceEmail({
      customerName: invoiceData.customerName,
      invoiceNumber: invoiceData.invoiceNumber,
      amount: invoiceData.amount,
      currency: invoiceData.currency,
      dueDate: invoiceData.dueDate,
      invoiceUrl: invoiceData.invoiceUrl,
    });

    return await sendEmail({
      to: invoiceData.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  } catch (error) {
    console.error("Send invoice error:", error);
    return false;
  }
}
