/**
 * Order Management Functions
 * 
 * Database operations for order creation, retrieval, and management
 */

import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { sendWelcomeEmail, sendOrderConfirmationEmail } from '@/lib/email-safe';

interface CreateOrderData {
  customerId: number;
  plan: string;
  amount: number;
  currency?: string;
  paymentMethod: string;
  billingName: string;
  billingEmail: string;
  billingPhone?: string;
  billingAddress?: string;
  billingCity?: string;
  billingCountry?: string;
  billingZip?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Generate unique order number
 * Format: CS-2024-00001
 */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.orders.count({
    where: {
      orderNumber: {
        startsWith: `CS-${year}-`,
      },
    },
  });
  
  const orderNum = String(count + 1).padStart(5, '0');
  return `CS-${year}-${orderNum}`;
}

/**
 * Generate license key
 * Format: CS-XXXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  const segments = 4;
  const segmentLength = 4;
  const parts: string[] = [];
  
  for (let i = 0; i < segments; i++) {
    parts.push(nanoid(segmentLength).toUpperCase());
  }
  
  return `CS-${parts.join('-')}`;
}

/**
 * Create a new order
 */
export async function createOrder(data: CreateOrderData) {
  try {
    const orderNumber = await generateOrderNumber();
    
    const order = await prisma.orders.create({
      data: {
        orderNumber,
        customerId: data.customerId,
        plan: data.plan,
        amount: data.amount,
        currency: data.currency || 'USD',
        status: 'PENDING',
        paymentMethod: data.paymentMethod,
        billingName: data.billingName,
        billingEmail: data.billingEmail,
        billingPhone: data.billingPhone,
        billingAddress: data.billingAddress,
        billingCity: data.billingCity,
        billingCountry: data.billingCountry,
        billingZip: data.billingZip,
        metadata: data.metadata as any,
      },
      include: {
        customers: true,
      },
    });
    
    return { success: true, order };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

/**
 * Update order status and payment details
 */
export async function updateOrderPayment(
  orderId: number,
  paymentId: string,
  paymentStatus: string,
  status: string = 'PROCESSING'
) {
  try {
    const order = await prisma.orders.update({
      where: { id: orderId },
      data: {
        paymentId,
        paymentStatus,
        status: status as any,
        paidAt: status === 'PROCESSING' ? new Date() : undefined,
      },
      include: {
        customers: true,
      },
    });
    
    // Send order confirmation email when payment is successful
    if (status === 'PROCESSING' && order.customers) {
      await sendOrderConfirmationEmail(order.billingEmail, {
        orderId: order.orderNumber,
        customerName: order.customers.name || order.billingName,
        plan: order.plan,
        amount: `${order.currency} ${order.amount.toFixed(2)}`,
        orderDate: order.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }).catch(err => console.error('Failed to send order confirmation email:', err));
      
      // Send welcome email for new customers
      if (order.customers.createdAt.getTime() === order.createdAt.getTime()) {
        await sendWelcomeEmail(
          order.billingEmail,
          order.customers.name || order.billingName
        ).catch(err => console.error('Failed to send welcome email:', err));
      }
    }
    
    return { success: true, order };
  } catch (error) {
    console.error('Error updating order payment:', error);
    return { success: false, error: 'Failed to update order' };
  }
}

/**
 * Complete order and generate license
 */
export async function completeOrder(orderId: number, downloadUrl?: string) {
  try {
    const licenseKey = generateLicenseKey();
    const licenseExpiry = new Date();
    licenseExpiry.setFullYear(licenseExpiry.getFullYear() + 1); // 1 year validity
    
    const order = await prisma.orders.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        licenseKey,
        licenseExpiry,
        downloadUrl: downloadUrl || `https://downloads.cabscript.com/${licenseKey}`,
        deliveredAt: new Date(),
      },
      include: {
        customers: true,
      },
    });
    
    // Update customer's last order date
    await prisma.customers.update({
      where: { id: order.customerId },
      data: {
        lastOrderAt: new Date(),
      },
    });
    
    return { success: true, order };
  } catch (error) {
    console.error('Error completing order:', error);
    return { success: false, error: 'Failed to complete order' };
  }
}

/**
 * Mark order as failed
 */
export async function failOrder(orderId: number, notes?: string) {
  try {
    const order = await prisma.orders.update({
      where: { id: orderId },
      data: {
        status: 'FAILED',
        notes,
      },
    });
    
    return { success: true, order };
  } catch (error) {
    console.error('Error failing order:', error);
    return { success: false, error: 'Failed to update order' };
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: number) {
  try {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        customers: true,
      },
    });
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    
    return { success: true, order };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
  try {
    const order = await prisma.orders.findUnique({
      where: { orderNumber },
      include: {
        customers: true,
      },
    });
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    
    return { success: true, order };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

/**
 * Get order by payment ID
 */
export async function getOrderByPaymentId(paymentId: string) {
  try {
    const order = await prisma.orders.findUnique({
      where: { paymentId },
      include: {
        customers: true,
      },
    });
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    
    return { success: true, order };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

/**
 * Get all orders for a customer
 */
export async function getCustomerOrders(customerId: number) {
  try {
    const orders = await prisma.orders.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
    
    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

/**
 * Get recent orders (for admin dashboard)
 */
export async function getRecentOrders(limit: number = 10, offset: number = 0) {
  try {
    const orders = await prisma.orders.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        customers: true,
      },
    });
    
    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

/**
 * Get order statistics
 */
export async function getOrderStats() {
  try {
    const [totalOrders, completedOrders, pendingOrders, totalRevenue] = await Promise.all([
      prisma.orders.count(),
      prisma.orders.count({ where: { status: 'COMPLETED' } }),
      prisma.orders.count({ where: { status: 'PENDING' } }),
      prisma.orders.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);
    
    return {
      success: true,
      stats: {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue: totalRevenue._sum.amount || 0,
        conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      },
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}
