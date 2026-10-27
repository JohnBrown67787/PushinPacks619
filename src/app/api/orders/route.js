import { NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const status = searchParams.get('status') || null;
    
    const orders = getAllOrders({ limit, status });
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod, notes, currency } = body;

    // Validate request structure
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer details are required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Your cart is empty. Please add products to checkout.' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Please select a payment method' },
        { status: 400 }
      );
    }

    // Call server database order creation logic (handles validation, server-side price calculation, and WhatsApp URL generation)
    const result = await createOrder({
      customer,
      items,
      paymentMethod,
      notes,
      currency
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully and saved to database',
      order: result.order,
      whatsAppUrl: result.whatsAppUrl
    }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while processing order' },
      { status: 500 }
    );
  }
}
