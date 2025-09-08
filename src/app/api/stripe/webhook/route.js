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

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      console.log('Webhook processed successfully');

      const templateData = {
        date: '27/08/2025',
        confirmationNo: 'CPC-13699',
        payment_plan: 'partial',
        delivery: {
          name: 'Jen Chang',
          contact: '+6591779126',
          email: 'ellisemarimon@chilliapi.com.sg',
          address: '322B Anchorvale Drive #11-130<br/>Singapore 542322<br/>Singapore'
        },
        items: [
          {
            quantity: 1,
            name: 'Trial Meal - Dinner',
            dateSelected: '02-09-2025',
            gst: '$3.14 GST',
            price: '38.00'
          }
        ],
        startType: 'Confirmed Start Date',
        startWith: 'Lunch',
        subtotal: '38.00',
        discount: '5.00',
        tax: '3.14',
        total: '38.00',
        amountPaid: '20.00',
        outstanding: '18.00',
      };

      // Use string template functions (no JSX/renderToString needed)
      const html = templateData.payment_plan === 'partial'
        ? partialPaymentTemplate(templateData)
        : fullPaymentConfirmationTemplate(templateData);

      await fetch('https://minimal-vercel-testing.vercel.app/api/email' || 'https://localhost:3032/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: templateData.delivery.email,
          subject: 'Order Confirmation',
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