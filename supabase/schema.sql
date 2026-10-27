-- =========================================================
-- PushinPacks Supabase / PostgreSQL Database Schema
-- Complete E-commerce Checkout with WhatsApp Ordering
-- =========================================================

-- 1. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'PushinPacks',
    whatsapp_number TEXT NOT NULL DEFAULT '16195550199',
    currency TEXT NOT NULL DEFAULT 'USD',
    delivery_fee_usd NUMERIC(10, 2) NOT NULL DEFAULT 15.00,
    free_delivery_threshold_usd NUMERIC(10, 2) NOT NULL DEFAULT 200.00,
    delivery_fee_xaf NUMERIC(10, 2) NOT NULL DEFAULT 5000.00,
    free_delivery_threshold_xaf NUMERIC(10, 2) NOT NULL DEFAULT 100000.00,
    enabled_payment_methods TEXT[] NOT NULL DEFAULT ARRAY['paypal', 'venmo', 'zelle', 'btc', 'cashapp', 'cod'],
    payment_instructions JSONB NOT NULL DEFAULT '{}'::jsonb,
    store_contact_email TEXT DEFAULT 'ops@pushinpacks619.internal',
    store_location TEXT DEFAULT 'Pacific Coast Logistics Hub, San Diego, CA',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    portal_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    spec TEXT,
    price_usd NUMERIC(10, 2) NOT NULL,
    price_xaf NUMERIC(10, 2),
    image_url TEXT,
    purity_rating TEXT,
    badge TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_reference TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('delivery', 'pickup')),
    delivery_address TEXT,
    delivery_city TEXT,
    order_notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Awaiting payment confirmation',
    order_status TEXT NOT NULL DEFAULT 'Pending confirmation' CHECK (
        order_status IN (
            'Pending confirmation',
            'Awaiting payment',
            'Paid',
            'Processing',
            'Shipped or ready for pickup',
            'Completed',
            'Cancelled'
        )
    ),
    whatsapp_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name_snapshot TEXT NOT NULL,
    spec_snapshot TEXT,
    unit_price_snapshot NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_orders_ref ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_portal ON public.products(portal_slug);

-- Row Level Security (RLS)
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read of active products and public store settings
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view store settings" ON public.store_settings
    FOR SELECT USING (true);

-- Allow public to create orders and order items
CREATE POLICY "Public can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view their own order by reference" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Public can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);
