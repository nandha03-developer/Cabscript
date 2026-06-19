/**
 * Contact Management Functions
 * 
 * Database operations for contact inquiries and support tickets
 */

import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

// Ensure prisma client is available
if (!prisma) {
  throw new Error('Prisma client is not initialized');
}

interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  type?: string;
  priority?: string;
  customerId?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create a new contact inquiry
 */
export async function createContact(data: CreateContactData) {
  try {
    // Verify prisma is available
    if (!prisma || !prisma.contacts) {
      throw new Error('Prisma client or contacts model is not available');
    }
    
    // Ensure database connection
    await prisma.$connect();
    
    console.log('📝 Creating contact:', { name: data.name, email: data.email });
    
    // Parse customerId if provided
    let customerId: number | undefined;
    if (data.customerId) {
      const parsed = parseInt(data.customerId, 10);
      if (!isNaN(parsed)) {
        customerId = parsed;
      }
    }

    // Map string types to enum values
    const mapType = (type?: string) => {
      const typeMap: Record<string, string> = {
        'general': 'GENERAL',
        'sales': 'SALES',
        'support': 'SUPPORT',
        'technical': 'TECHNICAL',
        'billing': 'BILLING',
        'demo_request': 'DEMO_REQUEST',
      };
      return typeMap[type?.toLowerCase() || ''] || 'GENERAL';
    };

    const mapPriority = (priority?: string) => {
      const priorityMap: Record<string, string> = {
        'low': 'LOW',
        'medium': 'MEDIUM',
        'high': 'HIGH',
        'urgent': 'URGENT',
      };
      return priorityMap[priority?.toLowerCase() || ''] || 'MEDIUM';
    };

    // Prepare data for insertion
    const contactData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      subject: data.subject,
      message: data.message,
      type: mapType(data.type) as any,
      priority: mapPriority(data.priority) as any,
      status: "NEW" as any,
      customerId,
      source: data.source || 'website',
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    };

    console.log('💾 Inserting into database...');
    const contact = await prisma.contacts.create({
      data: contactData,
    });
    
    console.log('✅ Contact created successfully. ID:', contact.id);
    return { success: true, contact };
    
  } catch (error) {
    console.error('❌ Error creating contact:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create contact',
      details: error instanceof Error ? error.stack : undefined,
    };
  }
}

/**
 * Get contact by ID
 */
export async function getContactById(contactId: number) {
  try {
    const contact = await prisma.contacts.findUnique({
      where: { id: contactId },
      include: {
        customers: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
          },
        },
      },
    });
    
    if (!contact) {
      return { success: false, error: 'Contact not found' };
    }
    
    return { success: true, contact };
  } catch (error) {
    console.error('Error fetching contact:', error);
    return { success: false, error: 'Failed to fetch contact' };
  }
}

/**
 * Get all contacts (for admin dashboard)
 */
export async function getAllContacts(
  page: number = 1,
  limit: number = 20,
  status?: string
) {
  try {
    const skip = (page - 1) * limit;
    
    const where = status ? { status: status as any } : {};
    
    const [contacts, total] = await Promise.all([
      prisma.contacts.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          customers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.contacts.count({ where }),
    ]);
    
    return {
      success: true,
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return { success: false, error: 'Failed to fetch contacts' };
  }
}

/**
 * Update contact status
 */
export async function updateContactStatus(
  contactId: number,
  status: string,
  assignedTo?: string,
  adminNotes?: string
) {
  try {
    const contact = await prisma.contacts.update({
      where: { id: contactId },
      data: {
        status: status as any,
        assignedTo,
        adminNotes,
        resolvedAt: status === "RESOLVED" ? new Date() : undefined,
      },
    });
    
    return { success: true, contact };
  } catch (error) {
    console.error('Error updating contact status:', error);
    return { success: false, error: 'Failed to update contact' };
  }
}

/**
 * Update contact priority
 */
export async function updateContactPriority(
  contactId: number,
  priority: string
) {
  try {
    const contact = await prisma.contacts.update({
      where: { id: contactId },
      data: { priority: priority as any },
    });
    
    return { success: true, contact };
  } catch (error) {
    console.error('Error updating contact priority:', error);
    return { success: false, error: 'Failed to update contact' };
  }
}

/**
 * Add admin notes to contact
 */
export async function addContactNotes(contactId: number, notes: string) {
  try {
    const contact = await prisma.contacts.update({
      where: { id: contactId },
      data: { adminNotes: notes },
    });
    
    return { success: true, contact };
  } catch (error) {
    console.error('Error adding contact notes:', error);
    return { success: false, error: 'Failed to add notes' };
  }
}

/**
 * Get contact statistics
 */
export async function getContactStats() {
  try {
    const [totalContacts, newContacts, inProgress, resolved, urgent] = await Promise.all([
      prisma.contacts.count(),
      prisma.contacts.count({ where: { status: "NEW" } }),
      prisma.contacts.count({ where: { status: "IN_PROGRESS" } }),
      prisma.contacts.count({ where: { status: "RESOLVED" } }),
      prisma.contacts.count({ where: { priority: "URGENT" } }),
    ]);
    
    return {
      success: true,
      stats: {
        totalContacts,
        newContacts,
        inProgress,
        resolved,
        urgent,
        resolutionRate: totalContacts > 0 ? (resolved / totalContacts) * 100 : 0,
      },
    };
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

/**
 * Search contacts
 */
export async function searchContacts(query: string) {
  try {
    const contacts = await prisma.contacts.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { company: { contains: query, mode: 'insensitive' } },
          { subject: { contains: query, mode: 'insensitive' } },
          { message: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    
    return { success: true, contacts };
  } catch (error) {
    console.error('Error searching contacts:', error);
    return { success: false, error: 'Failed to search contacts' };
  }
}
