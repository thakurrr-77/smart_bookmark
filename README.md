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

## Engineering Decisions & Technical Challenges

Building a real-time, secure bookmark manager involves more than just connecting a database. Here are the specific engineering hurdles I encountered and how I solved them:

### 1. The Challenge of "Quiet" Real-time Updates
**Problem**: Supabase Realtime is powerful, but by default, it broadcasts *every* database change to *all* connected clients. This is a massive security risk (users seeing other users' bookmarks) and a performance bottleneck (processing unnecessary websocket events).
**Solution**: 
- **Database Layer**: Implemented strict **Row Level Security (RLS)** policies in Postgres. This ensures that even if a client *tries* to read data they shouldn't, the database rejects it.
- **Application Layer**: I didn't just subscribe to the entire public schema. Instead, I implemented **Client-Side Filtering** in the subscription model:
  ```typescript
  .channel('realtime-bookmarks')
  .on(
      'postgres_changes',
      {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`, // CRITICAL: Only listen for OUR data
      },
      (payload) => { ... }
  )
  ```
  This ensures the client only processes events relevant to the logged-in user, significantly reducing client-side load.

### 2. Authentication State in a Server-Side World
**Problem**: Next.js App Router uses Server Components by default, which can't access browser cookies directly in the same way client components do. This breaks the traditional "check local storage for token" authentication flow.
**Solution**: 
- I utilized the `@supabase/ssr` package to create two distinct clients: a `createBrowserClient` for interactive components and a `createServerClient` for server-side data fetching.
- **Middleware Strategy**: I implemented a custom middleware that runs on *every* request. It explicitly refreshes the Auth Session before rendering any Server Component. This ensures that when `page.tsx` loads, the user session is already validated and fresh, preventing the dreaded "flash of unauthenticated content."

### 3. Vercel Deployment & Environment Variable nuances
**Problem**: During the initial deployment, the build failed with "invalid char" errors, and later the app redirected to `localhost` even in production.
**Solution**:
- **Strict Env Var Formatting**: I learned that Vercel is extremely strict about Environment Variable naming conventions (e.g., no spaces, no quotes in the key name field).
- **OAuth Redirect Whitelisting**: The Google Login flow creates a sophisticated security loop. It requires the *exact* callback URL (`https://.../auth/callback`) to be whitelisted in both the Google Cloud Console AND the Supabase Dashboard. I updated the Supabase "Site URL" and attached purely relative paths in my code (`${location.origin}`) to make the app environment-agnostic (working on both localhost and Vercel without code changes).

### 4. High-Contrast Accessibility vs. Modern UI 
**Problem**: I initially built a "Glassmorphism" UI which looked trendy but failed basic accessibility testing; the text contrast was too low on mobile screens in direct sunlight.
**Solution**: 
- **Design System Overhaul**: I pivoted to a "Midnight Minimalist" theme. Instead of relying on transparency (which is unpredictable), I used a **solid opaque card architecture** (`bg-[#1a1f2e]`) on a deep slate background. 
- **Tailwind v4 Variables**: I utilized the new CSS-variable-based theming in Tailwind v4 to define semantic colors (`--color-slate-950`), ensuring that text (`text-white`) always maintains a WCAG-compliant contrast ratio against its background, regardless of the device brightness.
