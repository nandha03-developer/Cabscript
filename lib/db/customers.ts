/**
 * Customer Management Functions
 * 
 * Database operations for customer creation and management
 */

import { prisma } from '@/lib/prisma';

interface CreateCustomerData {
  email: string;
  name: string;
  phone?: string;
  company?: string;
  country?: string;
}

/**
 * Create or get existing customer
 */
export async function createOrGetCustomer(data: CreateCustomerData) {
  try {
    // Check if customer already exists
    const existingCustomer = await prisma.customers.findUnique({
      where: { email: data.email },
    });
    
    if (existingCustomer) {
      // Update customer info if needed
      const updatedCustomer = await prisma.customers.update({
        where: { email: data.email },
        data: {
          name: data.name,
          phone: data.phone || existingCustomer.phone,
          company: data.company || existingCustomer.company,
          country: data.country || existingCustomer.country,
        },
      });
      
      return { success: true, customer: updatedCustomer, isNew: false };
    }
    
    // Create new customer
    const customer = await prisma.customers.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        company: data.company,
        country: data.country,
      },
    });
    
    return { success: true, customer, isNew: true };
  } catch (error) {
    console.error('Error creating/getting customer:', error);
    return { success: false, error: 'Failed to create customer' };
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(customerId: string) {
  try {
    const customer = await prisma.customers.findUnique({
      where: { id: parseInt(customerId, 10) },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
        },
        contacts: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
    
    if (!customer) {
      return { success: false, error: 'Customer not found' };
    }
    
    return { success: true, customer };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return { success: false, error: 'Failed to fetch customer' };
  }
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  try {
    const customer = await prisma.customers.findUnique({
      where: { email },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!customer) {
      return { success: false, error: 'Customer not found' };
    }
    
    return { success: true, customer };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return { success: false, error: 'Failed to fetch customer' };
  }
}

/**
 * Get all customers (for admin dashboard)
 */
export async function getAllCustomers(page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [customers, total] = await Promise.all([
      prisma.customers.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            select: {
              id: true,
              orderNumber: true,
              amount: true,
              status: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.customers.count(),
    ]);
    
    return {
      success: true,
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { success: false, error: 'Failed to fetch customers' };
  }
}

/**
 * Search customers
 */
export async function searchCustomers(query: string) {
  try {
    const customers = await prisma.customers.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { company: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            amount: true,
            status: true,
          },
        },
      },
    });
    
    return { success: true, customers };
  } catch (error) {
    console.error('Error searching customers:', error);
    return { success: false, error: 'Failed to search customers' };
  }
}

/**
 * Get customer statistics
 */
export async function getCustomerStats() {
  try {
    const [totalCustomers, customersWithOrders, newThisMonth] = await Promise.all([
      prisma.customers.count(),
      prisma.customers.count({
        where: {
          orders: {
            some: {},
          },
        },
      }),
      prisma.customers.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);
    
    return {
      success: true,
      stats: {
        totalCustomers,
        customersWithOrders,
        newThisMonth,
        conversionRate: totalCustomers > 0 ? (customersWithOrders / totalCustomers) * 100 : 0,
      },
    };
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}
