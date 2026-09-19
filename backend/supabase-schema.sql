-- =========================================================
-- MOTOMART SUPABASE DATABASE SCHEMA
-- Run this script in the Supabase SQL Editor
-- =========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    brand TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    part_type TEXT DEFAULT '',
    vehicle_type TEXT DEFAULT 'Motorcycle',
    oem_part_number TEXT DEFAULT '',
    fitment_models TEXT[] DEFAULT '{}',
    price NUMERIC NOT NULL,
    mrp NUMERIC NOT NULL,
    rating NUMERIC DEFAULT 4.5,
    reviews INTEGER DEFAULT 0,
    badge TEXT DEFAULT '',
    prime BOOLEAN DEFAULT true,
    image TEXT NOT NULL,
    fit TEXT NOT NULL,
    about TEXT[] DEFAULT '{}',
    specs JSONB DEFAULT '{}',
    official_source_url TEXT DEFAULT '',
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    copy TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GARAGE MODELS TABLE (Vehicle compatibility)
CREATE TABLE IF NOT EXISTS garage_models (
    id SERIAL PRIMARY KEY,
    vehicle_type TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    delivery_pincode TEXT,
    customer_phone TEXT,
    customer_name TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TRADE-IN ESTIMATES TABLE
CREATE TABLE IF NOT EXISTS trade_ins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_type TEXT NOT NULL,
    condition TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CHATBOT FAQS TABLE
CREATE TABLE IF NOT EXISTS chatbot_qa (
    id SERIAL PRIMARY KEY,
    keywords TEXT[] NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE garage_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_qa ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog data
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Garage Models" ON garage_models FOR SELECT USING (true);
CREATE POLICY "Public Read Chatbot QA" ON chatbot_qa FOR SELECT USING (true);

-- Allow public insert access for checkout orders and trade-in submissions
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Own Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Trade Ins" ON trade_ins FOR INSERT WITH CHECK (true);

-- Indexes for lightning fast searches and queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_garage_brand ON garage_models(brand);
