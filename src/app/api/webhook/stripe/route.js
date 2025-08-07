import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { 
  saveOrderToDatabase, 
  sendOrderConfirmationEmail, 
  notifyAdminOfNewOrder, 
  updateInventory 
} from "src/utils/database";

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
    console.log('Processing completed checkout session:', session.id);
    
    // Extract order details from metadata
    const orderData = {
      stripeSessionId: session.id,
      stripePaymentStatus: session.payment_status,
      orderId: session.metadata.orderId,
      customerName: session.metadata.customerName,
      customerEmail: session.metadata.customerEmail || session.customer_email,
      customerPhone: session.metadata.customerPhone,
      deliveryAddress: JSON.parse(session.metadata.deliveryAddress || '{}'),
      deliveryDate: session.metadata.deliveryDate,
      startWith: session.metadata.startWith,
      specialRequests: session.metadata.specialRequests,
      selectedBundles: JSON.parse(session.metadata.selectedBundles || '[]'),
      appliedPromo: session.metadata.appliedPromo ? JSON.parse(session.metadata.appliedPromo) : null,
      totalAmount: session.amount_total / 100, // Convert from cents
      currency: session.currency,
      paymentStatus: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Extracted order data:', orderData);

    // Save to database
    try {
      const savedOrder = await saveOrderToDatabase(orderData);
      console.log('Order saved to database:', savedOrder.id);

      // Send confirmation email to customer
      await sendOrderConfirmationEmail(orderData);
      console.log('Confirmation email sent to:', orderData.customerEmail);

      // Notify admin of new order
      await notifyAdminOfNewOrder(orderData);
      console.log('Admin notified of new order');

      // Update inventory if needed
      await updateInventory(orderData);
      console.log('Inventory updated');

    } catch (dbError) {
      console.error('Database operations failed:', dbError);
      // Don't throw here - we still want to acknowledge the webhook
      // but you might want to implement retry logic or alert admins
    }

  } catch (error) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    console.log('Payment succeeded:', paymentIntent.id);
    // Additional payment processing if needed
  } catch (error) {
    console.error('Error processing payment intent:', error);
    throw error;
  }
}
