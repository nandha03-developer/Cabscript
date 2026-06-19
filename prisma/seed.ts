/**
 * Prisma Database Seed Script
 * Creates initial admin user and sample data for development
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  // Create Super Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  
  const superAdmin = await prisma.admin_users.upsert({
    where: { email: 'admin@cabscript.com' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: 'admin@cabscript.com',
      passwordHash: adminPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });


  // Create Support User
  const supportPassword = await bcrypt.hash('support123', 10);
  
  const supportUser = await prisma.admin_users.upsert({
    where: { email: 'support@cabscript.com' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: 'support@cabscript.com',
      passwordHash: supportPassword,
      name: 'Support Team',
      role: 'SUPPORT',
      isActive: true,
    },
  });

  console.log('✅ Created Support User:', supportUser.email);

  // Create Sales User
  const salesPassword = await bcrypt.hash('sales123', 10);
  
  const salesUser = await prisma.admin_users.upsert({
    where: { email: 'sales@cabscript.com' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: 'sales@cabscript.com',
      passwordHash: salesPassword,
      name: 'Sales Team',
      role: 'SALES',
      isActive: true,
    },
  });

  console.log('✅ Created Sales User:', salesUser.email);

  // Create sample customers
  const customer1 = await prisma.customers.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      company: 'Taxi Startup Inc',
      country: 'United States',
    },
  });

  const customer2 = await prisma.customers.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      phone: '+9876543210',
      company: 'Ride Share Solutions',
      country: 'United Kingdom',
    },
  });

  console.log('✅ Created sample customers');

  // Create sample demo requests
  await prisma.demo_requests.createMany({
    data: [
      {
        name: 'Alice Johnson',
        email: 'alice@startup.com',
        phone: '+1122334455',
        company: 'Urban Rides',
        interestedIn: 'startup',
        preferredDate: new Date('2025-11-15').toISOString(),
        preferredTime: '10:00-11:00',
        status: 'PENDING',
      },
      {
        name: 'Bob Wilson',
        email: 'bob@taxicompany.com',
        phone: '+5544332211',
        company: 'City Cab Services',
        interestedIn: 'professional',
        preferredDate: new Date('2025-11-16').toISOString(),
        preferredTime: '14:00-15:00',
        status: 'PENDING',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created sample demo requests');

  // Create sample orders
  const order1 = await prisma.orders.create({
    data: {
      orderNumber: 'CS-2025-00001',
      customerId: customer1.id,
      plan: 'professional',
      amount: 4999,
      currency: 'USD',
      status: 'COMPLETED',
      paymentMethod: 'stripe',
      paymentId: 'pi_test_1234567890',
      paymentStatus: 'succeeded',
      billingName: customer1.name,
      billingEmail: customer1.email,
      billingPhone: customer1.phone,
      billingCountry: customer1.country,
      licenseKey: 'CS-PRO-XXXX-YYYY-ZZZZ-AAAA',
      paidAt: new Date(),
      deliveredAt: new Date(),
    },
  });

  const order2 = await prisma.orders.create({
    data: {
      orderNumber: 'CS-2025-00002',
      customerId: customer2.id,
      plan: 'startup',
      amount: 2999,
      currency: 'USD',
      status: 'PENDING',
      paymentMethod: 'razorpay',
      billingName: customer2.name,
      billingEmail: customer2.email,
      billingPhone: customer2.phone,
      billingCountry: customer2.country,
    },
  });

  const order3 = await prisma.orders.create({
    data: {
      orderNumber: 'CS-2025-00003',
      customerId: customer1.id,
      plan: 'enterprise',
      amount: 9999,
      currency: 'USD',
      status: 'PROCESSING',
      paymentMethod: 'stripe',
      paymentId: 'pi_test_0987654321',
      paymentStatus: 'processing',
      billingName: customer1.name,
      billingEmail: customer1.email,
      billingPhone: customer1.phone,
      billingCountry: customer1.country,
      paidAt: new Date(),
    },
  });

  console.log('✅ Created 3 sample orders');

  // Create sample contact (using Contact instead of SupportTicket)
  await prisma.contacts.create({
    data: {
      customerId: customer1.id,
      name: customer1.name,
      email: customer1.email,
      subject: 'Installation Support Required',
      message: 'I need help installing CabScript on my server. Getting database connection errors.',
      type: 'TECHNICAL',
      priority: 'HIGH',
      status: 'NEW',
      source: 'email',
    },
  });

  console.log('✅ Created sample contact');

  // Create sample demo appointment (using DemoRequest)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const demoAppointment = await prisma.demo_requests.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@startup.com',
      phone: '+1122334455',
      company: 'Urban Rides Inc',
      jobTitle: 'CEO',
      interestedIn: 'professional',
      preferredDate: tomorrow.toISOString(),
      preferredTime: '10:00 AM',
      scheduledAt: tomorrow,
      status: 'SCHEDULED',
      assignedTo: salesUser.id,
      notes: 'Scheduled demo for CabScript Professional package',
    },
  });

  console.log('✅ Created sample appointment');

  // Create activity log
  await prisma.activity_logs.create({
    data: {
      id: crypto.randomUUID(),
      adminUserId: superAdmin.id,
      adminName: superAdmin.name,
      adminEmail: superAdmin.email,
      action: 'created',
      entityType: 'order',
      entityId: order1.id.toString(),
      description: `Created order ${order1.orderNumber} for ${customer1.name}`,
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Created activity log entry');

  console.log('\n🎉 Database seeding completed successfully!\n');
  console.log('📧 Admin Login Credentials:');
  console.log('   Email: admin@cabscript.com');
  console.log('   Password: Admin@123\n');
  console.log('📧 Support Login Credentials:');
  console.log('   Email: support@cabscript.com');
  console.log('   Password: support123\n');
  console.log('📧 Sales Login Credentials:');
  console.log('   Email: sales@cabscript.com');
  console.log('   Password: sales123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
