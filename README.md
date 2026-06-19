# CabScript.com - Professional Taxi Booking Software

> **Production-ready e-commerce platform for selling taxi/ride-hailing scripts worldwide.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Test Coverage](https://img.shields.io/badge/Coverage-70%25-green.svg)](TESTING_GUIDE.md)

---

## 🚀 About

CabScript.com is a complete, secure, and high-performance e-commerce platform for selling taxi booking software (Uber Clone). Built with **Next.js 15**, **TypeScript**, and **modern web technologies**, this platform handles real payment transactions and customer data with enterprise-grade security.

### Key Features

- 💳 **Dual Payment Gateways**: Stripe and Razorpay integration
- 🔒 **Enterprise Security**: Rate limiting, CSRF protection, input sanitization
- 📊 **Advanced Analytics**: Google Analytics GA4, conversion tracking, Web Vitals
- 📧 **Email Automation**: SendGrid integration with drip campaigns
- 🎯 **Conversion Optimization**: Exit-intent popups, countdown timers, A/B testing
- 📱 **Progressive Web App**: Offline support, app-like experience
- 🛡️ **Error Monitoring**: Sentry integration for real-time error tracking
- 💬 **Live Chat**: Tawk.to integration for customer support
- 🔍 **SEO Optimized**: Structured data, Open Graph, XML sitemap
- 🧪 **Comprehensive Testing**: 70%+ code coverage with Jest & Playwright
- 📈 **Performance Monitoring**: Lighthouse CI, Core Web Vitals tracking
- 🎨 **Admin Dashboard**: Complete order and customer management

---


## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Security](#-security)

---

## 🛠 Tech Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **TypeScript 5.7** - Type-safe JavaScript
- **React 19** - UI library
- **Tailwind CSS 3** - Utility-first CSS

### Database & ORM
- **PostgreSQL** - Relational database
- **Prisma** - Modern ORM

### Payment Processing
- **Stripe** - Primary payment gateway (cards, wallets)
- **Razorpay** - Alternative payment gateway (India)

### Email & Communication
- **SendGrid** - Transactional emails & marketing automation
- **Tawk.to** - Live chat support

### Analytics & Monitoring
- **Google Analytics GA4** - User analytics
- **Sentry** - Error tracking & performance monitoring
- **Lighthouse CI** - Performance monitoring

### Testing
- **Jest** - Unit & integration testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing across browsers

### DevOps
- **Vercel** - Deployment platform (recommended)
- **GitHub Actions** - CI/CD pipeline

---

## 📁 Project Structure

```
cabscript.com/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Marketing pages (homepage, pricing)
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── checkout/             # Checkout & payments
│   │   ├── contact/              # Contact form
│   │   ├── newsletter/           # Newsletter subscription
│   │   ├── webhooks/             # Payment webhooks
│   │   └── cron/                 # Scheduled jobs
│   ├── blog/                     # Dynamic blog (MDX)
│   ├── dashboard/                # Customer dashboard
│   └── legal/                    # Legal pages (privacy, terms)
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── forms/                    # Form components
│   └── sections/                 # Page sections
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Database client
│   ├── stripe.ts                 # Stripe client
│   ├── email.ts                  # Email service
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma             # Prisma schema
│   └── migrations/               # Database migrations
├── __tests__/                    # Unit & component tests
│   ├── components/               # Component tests
│   └── api/                      # API integration tests
├── e2e/                          # End-to-end tests (Playwright)
├── public/                       # Static assets
├── .github/                      # GitHub Actions workflows
│   └── workflows/
│       └── test.yml              # CI/CD pipeline
├── docs/                         # Documentation
│   ├── PRE_LAUNCH_CHECKLIST.md   # Pre-launch verification
│   ├── DEPLOYMENT_GUIDE.md       # Deployment instructions
│   ├── SECURITY_AUDIT.md         # Security audit checklist
│   └── TESTING_GUIDE.md          # Testing documentation
├── jest.config.ts                # Jest configuration
├── playwright.config.ts          # Playwright configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 14.x or higher
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/cabscript.com.git
cd cabscript.com
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local
```

4. **Set up database**

```bash
# Create PostgreSQL database
createdb cabscript_dev

# Run migrations
npx prisma migrate dev

# (Optional) Seed sample data
npx prisma db seed
```

5. **Start development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🔐 Environment Variables

**Required variables** (see `.env.example` for complete list):

```bash
# Application
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cabscript_dev

# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG.your_key_here
SENDGRID_FROM_EMAIL=noreply@cabscript.com

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

**Generate secrets:**

```bash
# For NEXTAUTH_SECRET, CRON_SECRET, etc.
openssl rand -base64 32
```

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build            # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript compiler

# Testing
npm run test            # Run unit tests (watch mode)
npm run test:ci         # Run tests with coverage (CI mode)
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI
npm run test:coverage   # Generate coverage report

# Performance
npm run perf            # Run Lighthouse audit
npm run perf:ci         # Run Lighthouse in CI mode

# Database
npx prisma studio       # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Create and apply migration
npx prisma generate     # Generate Prisma Client
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** strict mode for type safety

Format code before committing:

```bash
npm run lint -- --fix
```

---

## 🧪 Testing

### Test Coverage

Current test coverage: **70%+** across all metrics

- **Unit Tests**: 14 test cases (CountdownTimer component)
- **Component Tests**: 10 test cases (ExitIntentPopup)
- **API Tests**: 8 test cases (Contact form)
- **E2E Tests**: 34 test cases (Homepage, Pricing, Contact)

### Running Tests

```bash
# Unit & Component Tests
npm run test              # Watch mode
npm run test:ci           # CI mode with coverage
npm run test:coverage     # View coverage report

# E2E Tests
npm run test:e2e          # All browsers
npm run test:e2e:ui       # Interactive mode
npm run test:e2e:headed   # Visible browser
npm run test:e2e:chromium # Chromium only
```

### Test Structure

```
__tests__/
├── components/
│   ├── CountdownTimer.test.tsx     # Timer component tests
│   └── ExitIntentPopup.test.tsx    # Popup component tests
├── api/
│   └── contact.test.ts              # Contact API tests
e2e/
├── homepage.spec.ts                 # Homepage E2E tests
├── pricing.spec.ts                  # Pricing page E2E tests
└── contact-form.spec.ts             # Contact form E2E tests
```

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for complete testing documentation.

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Deploy**

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

3. **Configure environment variables** in Vercel Dashboard

4. **Set up webhooks** for Stripe and Razorpay

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Alternative Hosting

- **Railway**: Supports PostgreSQL + Next.js
- **Render**: Free tier available
- **AWS/GCP/Azure**: For enterprise deployments

---

## 📚 Documentation

Comprehensive documentation available:

- **[PRE_LAUNCH_CHECKLIST.md](PRE_LAUNCH_CHECKLIST.md)** - 81-item production checklist
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[SECURITY_AUDIT.md](SECURITY_AUDIT.md)** - 88-item security audit
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing best practices
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - Development guidelines

---

## 🔒 Security

### Security Features

- ✅ **Input Validation**: All user inputs validated server-side
- ✅ **XSS Prevention**: Content Security Policy (CSP) headers
- ✅ **SQL Injection Prevention**: Prisma ORM with parameterized queries
- ✅ **CSRF Protection**: CSRF tokens on state-changing operations
- ✅ **Rate Limiting**: API routes protected from abuse
- ✅ **HTTPS Only**: Strict-Transport-Security (HSTS) headers
- ✅ **Payment Security**: PCI-DSS compliant (Stripe/Razorpay)
- ✅ **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- ✅ **Dependency Scanning**: Automated npm audit and Snyk scans

### Security Audit

Run comprehensive security audit:

```bash
# Dependency vulnerabilities
npm audit --production

# Snyk scan (if configured)
snyk test

# Security headers check
curl -I https://cabscript.com | grep -i "security\|x-frame\|x-content"
```

See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) for complete security checklist.

### Reporting Security Issues

Email security concerns to: **security@cabscript.com**

---

## 🎯 Performance

### Metrics

- **Performance Score**: 90+
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Accessibility**: 100
- **SEO**: 100

### Performance Monitoring

```bash
# Run Lighthouse audit
npm run perf

# Run Lighthouse in CI
npm run perf:ci

# Monitor Web Vitals
# Check: /api/web-vitals endpoint
```

---

## 📄 License

**Proprietary** - All rights reserved.

This is commercial software for selling taxi booking scripts. Unauthorized copying, modification, or distribution is prohibited.

---

## 🤝 Support

- **Email**: support@cabscript.com
- **Live Chat**: Available on website (Tawk.to)
- **Documentation**: See `/docs` folder

---

## 🏆 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Stripe](https://stripe.com/) - Payment processing
- [SendGrid](https://sendgrid.com/) - Email delivery
- [Sentry](https://sentry.io/) - Error tracking
- [Vercel](https://vercel.com/) - Hosting platform

---

**© 2024 CabScript.com - Professional Taxi Booking Software**
