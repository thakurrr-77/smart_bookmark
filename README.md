# Smart Bookmark App

## Overview
A simple, fast, and secure bookmark manager built with **Next.js 16 (Turbopack)** and **Supabase**. It is designed with a **High-Contrast "Midnight Minimalist" UI** for maximum readability and a premium developer experience.

## Key Features
- **Authentication**: Secure Google OAuth login via Supabase Auth.
- **Real-time Sync**: Bookmarks update instantly across all open tabs and devices using Supabase Realtime subscriptions.
- **Privacy First**: Strict **Row Level Security (RLS)** policies ensure users can only access their own data.
- **Modern UI**: 
    - **Midnight Minimalist Theme**: Deep slate background with high-contrast white text for readability.
    - **Solid Cards**: Distinct, opaque card design for clear separation of content.
    - **Responsive**: Fully optimized for mobile and desktop.
- **Performance**: Powered by Next.js 16 App Router and Turbopack for instant page loads.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Postgres Database, Auth, Realtime)
- **Icons**: Lucide React

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
This app is optimized for Vercel.
1. Push to GitHub.
2. Import project in Vercel.
3. Add the Environment Variables in Vercel Project Settings.
4. Deploy.

## Engineering Decisions & Challenges

### 1. High-Contrast "Midnight" Theme
**Challenge**: Finding the balance between a modern dark aesthetic and readability. Glassmorphism looked good but caused contrast issues.
**Solution**: Switched to a **solid card architecture** (`card-base`) on a deep slate background. Used explicitly defined high-contrast text colors (`text-white`) instead of lower opacity greys to prioritize accessibility.

### 2. Real-time Subscription Efficiency
**Challenge**: Ensuring real-time updates don't listen to *all* database changes, which is inefficient and insecure.
**Solution**: Implemented filtered subscriptions: `.filter('user_id=eq.${userId}')`. This ensures the client only listens for changes relevant to the logged-in user, significantly reducing websocket traffic.

### 3. Tailwind CSS v4 Configuration
**Challenge**: Updating to the new CSS-first configuration of Tailwind v4.
**Solution**: Migrated from `tailwind.config.js` to a pure CSS configuration using `@import "tailwindcss";` and native CSS variables for theming (`--color-slate-950`, etc.). This removed the need for complex JS config files.
