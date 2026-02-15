
# Smart Bookmark App

## Overview
A simple, fast, and secure bookmark manager built with Next.js and Supabase. Features real-time updates and Google OAuth authentication.

## Features
- **Google Login**: Secure authentication via Supabase Auth.
- **Real-time Updates**: Bookmarks sync instantly across tabs and devices.
- **Private**: Row Level Security (RLS) ensures data privacy.
- **Responsive Design**: Mobile-friendly, dark-themed UI.

## Tech Stack
- Next.js (App Router)
- Supabase (Auth, Postgres, Realtime)
- Tailwind CSS
- TypeScript

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd abstrabit_assignment
   npm install
   ```

2. **Supabase Setup**
   - Create a new project on [Supabase](https://supabase.com).
   - Go to **Authentication > Providers** and enable **Google**.
   - Go to **SQL Editor** and run the contents of `schema.sql` to create the table and policies.

3. **Environment Variables**
   - Copy `.env.local.example` to `.env.local`.
   - Fill in your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Deployment
This app is ready for Vercel.
1. Push to GitHub.
2. Import project in Vercel.
3. Add the Environment Variables in Vercel Project Settings.
4. Deploy.

## Challenges & Solutions

### 1. Real-time updates with Privacy
**Problem**: Supabase Realtime broadcasts all changes by default, which could leak data if strict filters aren't applied, potentially bypassing RLS on the client stream if not careful.
**Solution**: I implemented Row Level Security (RLS) on the database to prevent unauthorized access. On the client side, I explicitly filtered the subscription channel with `user_id=eq.${userId}` to ensure users only receive events relevant to them.

### 2. Next.js App Router & Supabase Auth
**Problem**: Managing sessions between Server Components, Client Components, and Middleware in the App Router can be tricky due to cookie handling.
**Solution**: Used `@supabase/ssr` with specific client utilities (`createBrowserClient`, `createServerClient`). Implemented a middleware to refresh sessions on every request, ensuring the auth token stays valid.

### 3. Optimistic UI vs Realtime
**Problem**: Should we show the new bookmark immediately or wait for the server?
**Solution**: Leveraged the Realtime subscription to update the UI. This confirms that the data was not only sent but also successfully propagated, satisfying the "real-time" requirement explicitly.
