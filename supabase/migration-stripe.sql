-- ProofStack Stripe Migration
-- Run this in your Supabase SQL Editor AFTER the initial schema.sql

-- Add subscription columns to users table
alter table public.users
  add column if not exists subscription_status text default 'free' check (subscription_status in ('free', 'pro')),
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text unique;

-- Create index for Stripe customer lookups
create index if not exists idx_users_stripe_customer_id on public.users(stripe_customer_id);
