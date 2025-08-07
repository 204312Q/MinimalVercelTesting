# Stripe Webhook Setup Guide

This guide explains how to set up the Stripe webhook to handle successful payments and store order data in your database.

## Overview

When a customer completes payment via Stripe checkout, the webhook will:

1. **Receive payment confirmation** from Stripe
2. **Extract order details** from the Stripe session metadata
3. **Save order to database** (you need to implement this)
4. **Send confirmation email** to customer (optional)
5. **Notify admin** of new order (optional)
6. **Update inventory** if needed (optional)

## Setup Steps

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required variables:**
- `NEXT_STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook endpoint secret (get this in step 3)

### 2. Set up Stripe Webhook Endpoint

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your endpoint URL:
   - **Development:** `http://localhost:3000/api/webhook/stripe`
   - **Production:** `https://yourdomain.com/api/webhook/stripe`
4. Select events to listen for:
   - `checkout.session.completed` ✅ (Required)
   - `payment_intent.succeeded` ✅ (Optional)
5. Click "Add endpoint"
6. Copy the **Webhook signing secret** and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

### 3. Test the Webhook

#### Development Testing
For local development, use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
# Download from: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook/stripe

# This will show you the webhook signing secret - add it to .env.local
```

#### Test Payment Flow
1. Start your development server: `npm run dev`
2. Go through the order process
3. Complete a test payment with Stripe test card: `4242 4242 4242 4242`
4. Check your console logs to see the webhook processing

### 4. Implement Database Integration

The webhook is currently set up with mock functions. You need to implement actual database operations in `src/utils/database.js`.

#### Option A: Prisma + PostgreSQL
```bash
npm install prisma @prisma/client
npx prisma init
```

Create your schema in `prisma/schema.prisma`:
```prisma
model Order {
  id                String   @id @default(cuid())
  orderId           String   @unique
  stripeSessionId   String   @unique
  customerName      String
  customerEmail     String
  customerPhone     String?
  deliveryAddress   Json
  deliveryDate      DateTime
  startWith         String?
  specialRequests   String?
  selectedBundles   Json?
  appliedPromo      Json?
  totalAmount       Float
  currency          String
  paymentStatus     String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

#### Option B: MongoDB + Mongoose
```bash
npm install mongoose
```

#### Option C: Supabase
```bash
npm install @supabase/supabase-js
```

#### Option D: Firebase Firestore
```bash
npm install firebase-admin
```

### 5. Set up Email Notifications (Optional)

Choose one email service:

#### Option A: Nodemailer (SMTP)
```bash
npm install nodemailer
```

#### Option B: SendGrid
```bash
npm install @sendgrid/mail
```

#### Option C: Resend
```bash
npm install resend
```

### 6. Deploy and Configure Production Webhook

1. Deploy your application to Vercel/Netlify/etc.
2. Update the Stripe webhook endpoint URL to your production domain
3. Add production environment variables
4. Test with a real payment

## Webhook Endpoint Details

**Endpoint:** `/api/webhook/stripe`
**Method:** `POST`
**Events handled:**
- `checkout.session.completed` - When payment is successful
- `payment_intent.succeeded` - When payment intent succeeds

**Response:** `200 OK` with `{ received: true }`

## Order Data Structure

The webhook extracts this data from Stripe session metadata:

```javascript
{
  stripeSessionId: "cs_test_...",
  stripePaymentStatus: "paid",
  orderId: "order_1234567890",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+1234567890",
  deliveryAddress: {
    address: "123 Main St",
    floor: "2",
    unit: "A",
    postalCode: "12345"
  },
  deliveryDate: "2025-08-14",
  startWith: "lunch",
  specialRequests: "No spicy food",
  selectedBundles: [],
  appliedPromo: {
    code: "EB5OFF",
    discountAmount: 88.75,
    description: "5% off Early Bird"
  },
  totalAmount: 1686.25,
  currency: "sgd",
  paymentStatus: "completed",
  createdAt: "2025-08-07T08:56:23.000Z",
  updatedAt: "2025-08-07T08:56:23.000Z"
}
```

## Security Notes

- ✅ Webhook signature verification is implemented
- ✅ Environment variables are used for secrets
- ✅ Error handling prevents webhook failures
- ⚠️ Implement rate limiting in production
- ⚠️ Add logging/monitoring for webhook events
- ⚠️ Implement retry logic for failed database operations

## Troubleshooting

### Common Issues

1. **Webhook signature verification failed**
   - Check `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure you're using the webhook secret, not API key

2. **Webhook not receiving events**
   - Check endpoint URL is correct
   - Verify events are selected in Stripe dashboard
   - Check firewall/network settings

3. **Database errors**
   - Check database connection
   - Verify schema matches order data structure
   - Check environment variables

### Useful Commands

```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhook/stripe

# View Stripe events
stripe events list

# Resend specific event
stripe events resend evt_1234567890
```

## Next Steps

After setting up the webhook:

1. ✅ Implement database operations
2. ✅ Set up email notifications
3. ✅ Add admin notifications
4. ✅ Implement inventory management
5. ✅ Set up monitoring/logging
6. ✅ Test thoroughly before going live
