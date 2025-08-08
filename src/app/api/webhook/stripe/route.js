import { NextResponse } from "next/server";
import { headers } from "next/headers";

const stripe = require('stripe')(process.env.NEXT_STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const sig = headersList.get('stripe-signature');

    let event;

    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    console.log(`Received webhook event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    console.log('🎉 PAYMENT SUCCESSFUL! Processing checkout session:', session.id);
    
    // Extract ALL order data from metadata
    const orderData = {
      // Stripe Information
      stripeSessionId: session.id,
      stripePaymentStatus: session.payment_status,
      totalAmountPaid: session.amount_total / 100, // Convert from cents
      currency: session.currency,
      
      // Order Information
      orderId: session.metadata.orderId,
      paymentStatus: 'completed',
      
      // Customer Information
      customerName: session.metadata.customerName,
      customerEmail: session.metadata.customerEmail || session.customer_email,
      customerPhone: session.metadata.customerPhone,
      
      // Delivery Information
      deliveryAddress: JSON.parse(session.metadata.deliveryAddress || '{}'),
      deliveryDate: session.metadata.deliveryDate,
      startWith: session.metadata.startWith,
      specialRequests: session.metadata.specialRequests,
      
      // Product Information
      products: JSON.parse(session.metadata.products || '[]'),
      addOns: JSON.parse(session.metadata.addOns || '[]'),
      selectedBundles: JSON.parse(session.metadata.selectedBundles || '[]'),
      
      // Pricing Information
      pricingData: JSON.parse(session.metadata.pricingData || '{}'),
      appliedPromo: session.metadata.appliedPromo ? JSON.parse(session.metadata.appliedPromo) : null,
      
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('📦 COMPLETE ORDER DATA:');
    console.log('=====================================');
    console.log(JSON.stringify(orderData, null, 2));
    console.log('=====================================');
    
    console.log('✅ Order data captured successfully!');
    console.log('🎯 Backend developer: Use this data to save to your database/system');

  } catch (error) {
    console.error('❌ Error processing checkout session:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    console.log('💰 Payment succeeded:', paymentIntent.id);
    // Backend developer can add additional payment processing here if needed
  } catch (error) {
    console.error('❌ Error processing payment intent:', error);
    throw error;
  }
}
