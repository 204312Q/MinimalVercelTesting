import Stripe from 'stripe';
import { NextResponse } from "next/server";
import { headers } from 'next/headers';
import { fullPaymentConfirmationTemplate, partialPaymentTemplate } from '../../../../components/email-templates/email-confirmation.js';

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

export async function POST(request) {
  console.log('Stripe webhook POST received');
  try {
    const body = await request.text();
    const headerlist = headers();
    const signature = headerlist.get('stripe-signature');

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    }

    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded' || event.type === 'payment_intent.succeeded') {
      const session = event.data.object;
      console.log('Webhook processed successfully');

      // Simulated order object matching your payload structure
      const mockOrder = {
        id: 'CPC-13699',
        createdAt: '2025-08-27T10:30:00Z',
        inputType: 'CONFIRMED',
        serviceDate: '02-09-2025',
        portion: 'TRIAL',
        session: 'DINNER',
        status: 'UNFULFILLED',
        paymentPlan: 'PARTIAL',
        lineItems: [
          {
            id: 'li-1',
            kind: 'PACKAGES',
            option: {
              label: 'Dinner',
              value: 'Dinner'
            },
            quantity: 1,
            productId: 'trial-meal',
            productName: 'Trial Meal',
            lineTotal: 38.00,
            unitPrice: 38.00
          }
        ],
        requests: [
          {
            id: 'req-1',
            code: 'No Chicken',
            label: 'Chicken',
            value: 'No Chicken',
            specialRequestId: 'sp-3'
          }
        ],
        note: 'Please deliver before 6pm',
        payments: [
          {
            id: 'pay-1',
            kind: 'CHARGE',
            purpose: 'DEPOSIT',
            method: 'STRIPE',
            status: 'PAID',
            amount: 20.00,
            createdAt: '2025-08-27T10:30:00Z',
            paidAt: '2025-08-27T10:32:00Z',
            stripe: {
              paymentIntentId: 'pi_test123',
              checkoutSessionId: 'cs_test123'
            }
          }
        ],
        pricing: {
          currency: 'SGD',
          subtotal: 43.00,
          paid: 20.00,
          total: 38.00,
          remaining: 18.00,
          discounts: [
            {
              code: 'TRIAL5',
              type: 'percentage',
              value: 5,
              amount: 5.00
            }
          ]
        },
        promotions: [
          {
            code: 'TRIAL5',
            type: 'percentage',
            value: 5,
            amount: 5.00
          }
        ],
        delivery: {
          fullName: 'Jen Chang',
          phone: '+6591779126',
          email: 'ellisemarimon@chilliapi.com.sg',
          floor: '11',
          unit: '130',
          addressLine: '322B Anchorvale Drive',
          postalCode: '542322'
        },
        customer: {
          id: 'cust-1',
          name: 'Jen Chang',
          email: 'ellisemarimon@chilliapi.com.sg',
          phone: '+6591779126'
        }
      };

      // Use the updated template functions with proper order object
      const html = mockOrder.paymentPlan === 'PARTIAL'
        ? partialPaymentTemplate(mockOrder)
        : fullPaymentConfirmationTemplate(mockOrder);

      await fetch('https://minimal-vercel-testing.vercel.app/api/email' || 'https://localhost:3032/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: mockOrder.delivery.email,
          subject: `Order Confirmation - ${mockOrder.id}`,
          html,
        }),
      });
    }
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}