import { NextResponse } from "next/server";
const stripe = require('stripe')(process.env.NEXT_STRIPE_SECRET_KEY);

export const POST = async (request) => {
  try {
    // 1. Parse body - now includes full order details
    const { products, orderDetails } = await request.json();

    // 2. Calculate discount amount
    const discountAmount = orderDetails?.pricing?.totalDiscount || 
                          orderDetails?.pricing?.promoDiscount || 
                          (orderDetails?.pricing?.appliedPromo?.discountAmount) || 0;
    
    let stripeProducts = [];
    
    if (discountAmount > 0) {
      // Apply discount proportionally to each product using price_data
      const originalTotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const discountRatio = discountAmount / originalTotal;
      
      for (const product of products) {
        const productDiscount = product.price * discountRatio;
        const discountedPrice = Math.max(0, product.price - productDiscount);
               
        stripeProducts.push({
          price_data: {
            currency: 'sgd',
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(discountedPrice * 100), // Convert to cents
          },
          quantity: product.quantity,
        });
      }
      
      // Add a line item showing the discount applied
      if (orderDetails?.pricing?.appliedPromo) {
        const promoCode = orderDetails.pricing.appliedPromo.promoCode?.code || 
                         orderDetails.pricing.appliedPromo.code || 
                         'DISCOUNT';
        
        stripeProducts.push({
          price_data: {
            currency: 'sgd',
            product_data: {
              name: `${orderDetails.pricing.appliedPromo.description || 'Discount Applied'} (${promoCode})`,
              description: `Saved $${discountAmount.toFixed(2)}`,
            },
            unit_amount: 0, // $0 line item just to show the discount info
          },
          quantity: 1,
        });
      }
    } else {
      // No discount, use price_data for consistency
      for (const product of products) {
        stripeProducts.push({
          price_data: {
            currency: 'sgd',
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: product.quantity,
        });
      }
    }

    // 3. Create checkout session with order metadata
    const origin = request.headers.get('origin') || 
                   request.headers.get('host') && `https://${request.headers.get('host')}` ||
                   'http://localhost:3000'; // fallback for development
    
    const session = await stripe.checkout.sessions.create({
      line_items: stripeProducts,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      // Store ALL order details in Stripe metadata (simple solution)
      metadata: {
        orderId: `order_${Date.now()}`, // Generate temporary order ID
        customerName: orderDetails?.deliveryInfo?.fullName || '',
        customerEmail: orderDetails?.deliveryInfo?.email || '',
        customerPhone: orderDetails?.deliveryInfo?.phone || '',
        deliveryAddress: JSON.stringify({
          address: orderDetails?.deliveryInfo?.address || '',
          floor: orderDetails?.deliveryInfo?.floor || '',
          unit: orderDetails?.deliveryInfo?.unit || '',
          postalCode: orderDetails?.deliveryInfo?.postalCode || '',
        }),
        deliveryDate: orderDetails?.selectedDate || '',
        startWith: orderDetails?.startWith || '',
        specialRequests: orderDetails?.specialRequests || '',
        selectedBundles: JSON.stringify(orderDetails?.selectedBundles || []),
        appliedPromo: orderDetails?.pricing?.appliedPromo ? JSON.stringify(orderDetails.pricing.appliedPromo) : '',
        // Add products and add-ons to metadata
        products: JSON.stringify(products || []),
        addOns: JSON.stringify(orderDetails?.addOns || []),
        pricingData: JSON.stringify(orderDetails?.pricing || {}),
      },
      // Store customer details for automatic form filling
      customer_email: orderDetails?.deliveryInfo?.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error in /api/checkout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};