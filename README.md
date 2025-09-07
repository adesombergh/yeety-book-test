# Yeety Book - Restaurant Reservation SaaS

A modern, multi-tenant SaaS platform that enables restaurants to manage online reservations. Each restaurant gets their own public booking page and private dashboard for staff management.

## 🚀 Features

### Customer-Facing Features

- **Public Reservation Forms** - Each restaurant has a unique booking page at `/{restaurantSlug}/reservation`
- **Easy Booking Process** - Select guests, date, time (15-minute intervals), and provide customer details
- **Email Confirmations** - Automatic confirmation emails with reservation details and calendar invites
- **Cancellation System** - Secure token-based cancellation links with email notifications

### Restaurant Management Features

- **Private Dashboard** - Staff authentication via Clerk
- **Reservation Management** - View, manage, and cancel reservations
- **Calendar Integration** - 7-day calendar view with FullCalendar
- **Email Notifications** - Automatic notifications for new reservations and cancellations

### Business Features

- **Multi-Tenant Architecture** - Each restaurant operates independently
- **Subscription Management** - Stripe-based billing system
- **Secure Authentication** - Clerk for staff, token-based for customers
- **Email System** - Resend integration for transactional emails

## 🛠 Tech Stack

### Frontend & Backend

- **Next.js 15** (App Router) - Full-stack React framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **React Hook Form + Zod** - Form handling and validation

### Database & ORM

- **PostgreSQL** - Primary database (via Supabase)
- **Prisma** - Type-safe ORM with migrations
- **Multi-tenant schema** - Restaurants, users, reservations, tokens

### Authentication & Payments

- **Clerk** - Restaurant staff authentication
- **Stripe** - Subscription billing and payments
- **Token-based** - Customer cancellation system

### Email & Notifications

- **Resend** - Transactional email service
- **Calendar Invites** - .ics file generation
- **Email Templates** - HTML email notifications

### Deployment

- **Vercel** - Serverless hosting platform
- **Supabase** - Managed PostgreSQL database

## 📁 Project Structure

```
src/
├── app/
│   ├── [restaurantSlug]/
│   │   └── reservation/          # Public reservation form
│   ├── api/
│   │   ├── reservations/         # Reservation creation API
│   │   └── cancel/[token]/       # Cancellation API
│   ├── cancel/[token]/           # Cancellation page
│   ├── dashboard/                # Restaurant dashboard (TODO)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/ui/                # shadcn/ui components
├── lib/
│   ├── prisma.ts                 # Database client
│   └── utils.ts                  # Utility functions
└── prisma/
    └── schema.prisma             # Database schema
```

## 🗄 Database Schema

### Core Models

- **Restaurant** - Restaurant information, settings, subscription status
- **RestaurantUser** - Links Clerk users to restaurants with roles
- **Reservation** - Customer reservations with all details
- **ReservationToken** - Secure tokens for cancellation/modification

### Key Features

- Multi-tenant architecture with restaurant isolation
- Subscription status tracking for access control
- Secure token system for customer actions
- Comprehensive audit trail

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account (for authentication)
- Stripe account (for payments)
- Resend account (for emails)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yeety-app/yeety-book.git
   cd yeety-book
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` - Clerk auth keys
   - `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe keys
   - `RESEND_API_KEY` - Resend email API key

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Visit the application**
   - Homepage: <http://localhost:3000>
   - Demo reservation: <http://localhost:3000/demo-restaurant/reservation>

## 📋 Current Implementation Status

### ✅ Completed Features

- [x] Project foundation with Next.js, TypeScript, TailwindCSS
- [x] Database schema with Prisma
- [x] Customer reservation system
- [x] Email confirmation system
- [x] Cancellation workflow
- [x] Responsive UI with shadcn/ui
- [x] API endpoints for reservations and cancellations
- [x] Multi-tenant architecture foundation

### 🚧 In Progress / TODO

- [ ] Restaurant dashboard with Clerk authentication
- [ ] Calendar view for staff
- [ ] Stripe billing integration
- [ ] Restaurant onboarding flow
- [ ] Advanced reservation management
- [ ] Analytics and reporting
- [ ] Mobile app (future)

## 🔧 Development

### Key Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open database GUI
npx prisma migrate   # Run database migrations
```

### Environment Setup

The application requires several external services:

- **Database**: PostgreSQL (recommend Supabase for managed hosting)
- **Authentication**: Clerk for restaurant staff
- **Payments**: Stripe for subscription billing
- **Email**: Resend for transactional emails

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Setup

1. Create a PostgreSQL database (Supabase recommended)
2. Run migrations: `npx prisma migrate deploy`
3. Seed initial data if needed

## 📝 API Documentation

### Reservation Creation

```
POST /api/reservations
Content-Type: application/json

{
  "restaurantSlug": "demo-restaurant",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "guests": 4,
  "date": "2025-01-15T00:00:00.000Z",
  "time": "19:30",
  "comments": "Birthday celebration"
}
```

### Reservation Cancellation

```
GET /api/cancel/{token}     # Get reservation details
POST /api/cancel/{token}    # Cancel reservation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Prisma](https://prisma.io/) - Next-generation ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Clerk](https://clerk.com/) - Authentication made simple
- [Stripe](https://stripe.com/) - Payment processing
- [Resend](https://resend.com/) - Email delivery platform

---

Built with ❤️ for restaurants worldwide
