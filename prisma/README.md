# CabScript Database Schema

Complete database schema for the CabScript.com admin panel and business operations.

## 📋 Database Models

### Core Business Models

1. **Customer** - Customer information and tracking
2. **Order** - Purchase orders and transactions
3. **Invoice** - Invoice generation and payment tracking
4. **DemoRequest** - Demo request submissions from website

### Support & Communication

5. **SupportTicket** - Customer support ticket system
6. **TicketMessage** - Messages within support tickets
7. **Contact** - General contact form submissions
8. **Newsletter** - Newsletter subscriber management

### Scheduling & Reminders

9. **Appointment** - Demo and consultation appointments
10. **Reminder** - Automated reminder system

### Admin & Security

11. **AdminUser** - Admin panel user accounts
12. **ActivityLog** - Audit trail for admin actions
13. **ErrorLog** - System error tracking

### Marketing

14. **EmailSchedule** - Automated email campaigns

### Monitoring

15. **WebVitalsMetric** - Performance monitoring

## 🚀 Setup Instructions

### 1. Configure Database

Create a `.env` file with your PostgreSQL connection:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 2. Push Schema to Database

```bash
npm run db:push
```

This will create all tables in your PostgreSQL database.

### 3. Seed Initial Data

```bash
npm run db:seed
```

This creates:
- Super Admin account
- Support team account
- Sales team account
- Sample customers
- Sample orders and invoices
- Sample demo requests
- Sample support ticket
- Sample appointment

### 4. Open Prisma Studio (Optional)

View and edit your database in the browser:

```bash
npm run db:studio
```

## 🔐 Default Admin Credentials

**Super Admin:**
- Email: `admin@cabscript.com`
- Password: `admin123`
- Role: SUPER_ADMIN (Full Access)

**Support Team:**
- Email: `support@cabscript.com`
- Password: `support123`
- Role: SUPPORT

**Sales Team:**
- Email: `sales@cabscript.com`
- Password: `sales123`
- Role: SALES

⚠️ **IMPORTANT:** Change these passwords immediately in production!

## 📊 Database Relationships

### Customer Relations
```
Customer (1) → (Many) Orders
Customer (1) → (Many) SupportTickets
Customer (1) → (Many) Contacts
Customer (1) → (Many) EmailSchedules
```

### Order Relations
```
Order (1) → (1) Invoice
Order (Many) → (1) Customer
```

### Support Ticket Relations
```
SupportTicket (1) → (Many) TicketMessages
SupportTicket (Many) → (1) Customer [Optional]
SupportTicket (Many) → (1) AdminUser [Assigned To]
```

### Appointment Relations
```
Appointment (Many) → (1) DemoRequest [Optional]
Appointment (1) → (Many) Reminders
```

### Activity Log Relations
```
ActivityLog (Many) → (1) AdminUser
```

## 🔄 Database Migration Workflow

### During Development

1. Make changes to `schema.prisma`
2. Run `npm run db:push` to sync with database
3. Run `npx prisma generate` to update Prisma Client

### For Production

1. Create migration: `npx prisma migrate dev --name description`
2. Apply migration: `npx prisma migrate deploy`

## 📝 Key Enums

### Order Status
- PENDING - Order created, awaiting payment
- PROCESSING - Payment received, processing order
- COMPLETED - Order fulfilled, license delivered
- FAILED - Payment failed
- REFUNDED - Order refunded
- CANCELLED - Order cancelled

### Invoice Status
- DRAFT - Not yet sent
- PENDING - Awaiting payment
- SENT - Sent to customer
- PAID - Payment received
- OVERDUE - Past due date
- CANCELLED - Cancelled
- REFUNDED - Refunded

### Support Ticket Status
- OPEN - New ticket
- IN_PROGRESS - Being worked on
- WAITING_CUSTOMER - Waiting for customer response
- WAITING_INTERNAL - Waiting for internal action
- RESOLVED - Issue resolved
- CLOSED - Ticket closed

### Appointment Status
- SCHEDULED - Appointment scheduled
- CONFIRMED - Customer confirmed
- IN_PROGRESS - Currently happening
- COMPLETED - Successfully completed
- CANCELLED - Cancelled by either party
- NO_SHOW - Customer didn't show up
- RESCHEDULED - Moved to different time

### Admin Roles
- SUPER_ADMIN - Full system access
- ADMIN - Most features access
- SUPPORT - Customer support access
- SALES - Sales-related access
- VIEWER - Read-only access

## 🔍 Useful Prisma Commands

```bash
# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Generate Prisma Client
npx prisma generate

# Open database browser
npx prisma studio

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset

# View migrations status
npx prisma migrate status
```

## 🛡️ Security Notes

1. **Password Hashing**: All admin passwords are hashed using bcryptjs
2. **Indexes**: Key fields are indexed for performance
3. **Cascading Deletes**: Properly configured to maintain referential integrity
4. **Audit Trail**: ActivityLog tracks all admin actions
5. **Soft Deletes**: Consider implementing for important records

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
- [Database Security Guide](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html)
