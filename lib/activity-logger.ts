import { prisma } from '@/lib/prisma';

/**
 * Utility function to create activity logs
 * This should be called whenever admin actions occur
 */
export async function createActivityLog({
  adminUserId,
  adminName,
  adminEmail,
  action,
  entityType,
  entityId,
  description,
  ipAddress,
  userAgent,
}: {
  adminUserId: string;
  adminName: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await prisma.activity_logs.create({
      data: {
        id: crypto.randomUUID(),
        adminUserId,
        adminName,
        adminEmail,
        action,
        entityType,
        entityId,
        description,
        ipAddress,
        userAgent,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
}

/**
 * Function to seed sample activity logs for testing
 * Run this once to populate with test data
 */
export async function seedActivityLogs() {
  const sampleLogs = [
    {
      id: crypto.randomUUID(),
      adminUserId: 'admin-1',
      adminName: 'John Doe',
      adminEmail: 'admin@cabscript.com',
      action: 'LOGIN',
      entityType: 'USER',
      entityId: 'admin-1',
      description: 'Admin logged into the system',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      adminUserId: 'admin-1',
      adminName: 'John Doe',
      adminEmail: 'admin@cabscript.com',
      action: 'VIEW',
      entityType: 'ORDER',
      entityId: 'order-123',
      description: 'Viewed order details #123',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
    {
      id: crypto.randomUUID(),
      adminUserId: 'admin-1',
      adminName: 'John Doe',
      adminEmail: 'admin@cabscript.com',
      action: 'UPDATE',
      entityType: 'DEMO_REQUEST',
      entityId: 'demo-456',
      description: 'Updated demo request status to SCHEDULED',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: crypto.randomUUID(),
      adminUserId: 'admin-1',
      adminName: 'John Doe',
      adminEmail: 'admin@cabscript.com',
      action: 'CREATE',
      entityType: 'CUSTOMER',
      entityId: 'customer-789',
      description: 'Created new customer record',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    },
    {
      id: crypto.randomUUID(),
      adminUserId: 'admin-1',
      adminName: 'John Doe',
      adminEmail: 'admin@cabscript.com',
      action: 'EXPORT',
      entityType: 'NEWSLETTER',
      entityId: 'export-001',
      description: 'Exported newsletter subscribers list',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
  ];

  try {
    for (const log of sampleLogs) {
      await prisma.activity_logs.upsert({
        where: { id: log.id },
        update: {},
        create: log,
      });
    }
    console.log('✅ Sample activity logs created successfully');
  } catch (error) {
    console.error('❌ Failed to seed activity logs:', error);
  }
}

// Uncomment the line below and run this file to seed sample data
// seedActivityLogs();