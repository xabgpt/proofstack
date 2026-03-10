-- ProofStack Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text not null,
  username text unique,
  bio text default '',
  title text default '',
  created_at timestamptz default now()
);

-- Projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  client_name text not null,
  client_email text not null,
  date_completed date not null,
  verified boolean default false,
  verified_at timestamptz,
  verification_token uuid default uuid_generate_v4() unique,
  token_expires_at timestamptz default (now() + interval '7 days'),
  created_at timestamptz default now()
);

-- Profiles table
create table public.profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade unique not null,
  is_public boolean default true,
  view_count integer default 0
);

-- Waitlist table
create table public.waitlist (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamptz default now()
);

-- Indexes
create index idx_projects_user_id on public.projects(user_id);
create index idx_projects_verification_token on public.projects(verification_token);
create index idx_users_username on public.users(username);

-- Row Level Security
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.profiles enable row level security;
alter table public.waitlist enable row level security;

-- Users policies
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Public can view users by username"
  on public.users for select
  using (username is not null);

-- Projects policies
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

create policy "Public can view verified projects"
  on public.projects for select
  using (verified = true);

-- Profiles policies
create policy "Users can view their own profile settings"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile settings"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Public can view public profiles"
  on public.profiles for select
  using (is_public = true);

-- Waitlist policies
create policy "Anyone can insert to waitlist"
  on public.waitlist for insert
  with check (true);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    lower(replace(coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), ' ', ''))
  );

  insert into public.profiles (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to verify a project (called from API)
create or replace function public.verify_project(token uuid)
returns boolean as $$
declare
  project_record record;
begin
  select * into project_record
  from public.projects
  where verification_token = token
    and token_expires_at > now()
    and verified = false;

  if not found then
    return false;
  end if;

  update public.projects
  set verified = true, verified_at = now()
  where verification_token = token;

  return true;
end;
$$ language plpgsql security definer;

-- Function to increment profile view count
create or replace function public.increment_view_count(uid uuid)
returns void as $$
begin
  update public.profiles
  set view_count = view_count + 1
  where user_id = uid;
end;
$$ language plpgsql security definer;
