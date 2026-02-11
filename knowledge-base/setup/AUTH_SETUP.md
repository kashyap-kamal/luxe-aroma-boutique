# Authentication Setup Guide

This guide explains how to set up authentication for the Aromé Luxe boutique using NextAuth.js, Supabase, and Zustand.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Database URL (if using direct database access)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to Settings > Database to get your service role key
4. Enable email authentication in Authentication > Settings

### 3. Database Schema

Run this SQL in your Supabase SQL editor to create the required tables:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🏗️ Architecture

### Components Structure

```
src/
├── components/
│   └── auth/
│       ├── auth-provider.tsx      # Auth context provider
│       ├── signin-form.tsx        # Sign in form component
│       ├── signup-form.tsx        # Sign up form component
│       ├── user-menu.tsx          # User dropdown menu
│       ├── user-profile.tsx       # User profile component
│       └── protected-route.tsx    # Route protection wrapper
├── hooks/
│   └── use-auth.ts               # Custom auth hook
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── supabase.ts               # Supabase client
│   └── supabase-server.ts        # Server-side Supabase client
├── stores/
│   └── auth-store.ts             # Zustand auth store
└── app/
    ├── api/auth/[...nextauth]/   # NextAuth API routes
    └── auth/                     # Auth pages
        ├── signin/
        ├── signup/
        └── error/
```

### Key Features

- **NextAuth.js Integration**: Handles authentication flow and session management
- **Supabase Backend**: Provides user management and database storage
- **Zustand State Management**: Manages authentication state across the app
- **Protected Routes**: Middleware and components for route protection
- **Type Safety**: Full TypeScript support with proper type definitions

## 🔧 Usage

### Sign In/Sign Up

Users can access authentication through:
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- User menu in the navbar (when not authenticated)

### Protected Routes

Use the `ProtectedRoute` component to protect pages:

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

### Using Auth State

Use the `useAuth` hook to access authentication state:

```tsx
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return <div>Welcome, {user?.name}!</div>
}
```

### Middleware Protection

The middleware automatically protects routes defined in `src/middleware.ts`:

```typescript
const protectedRoutes = ['/profile', '/orders', '/settings', '/checkout']
```

## 🛡️ Security Features

- **JWT Tokens**: Secure session management
- **Row Level Security**: Database-level access control
- **CSRF Protection**: Built-in NextAuth protection
- **Secure Headers**: Additional security headers in `.htaccess`
- **Password Validation**: Minimum 6 characters required
- **Email Verification**: Supabase handles email confirmation

## 🚀 Deployment

1. Set up your production environment variables
2. Update `NEXTAUTH_URL` to your production domain
3. Configure your Supabase project for production
4. Deploy your Next.js application

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid credentials" error**: Check your Supabase configuration
2. **Session not persisting**: Verify `NEXTAUTH_SECRET` is set
3. **Database errors**: Ensure RLS policies are correctly configured
4. **Type errors**: Make sure all TypeScript types are properly imported

### Debug Mode

Enable debug mode in development by setting:

```env
NODE_ENV=development
```

This will show detailed authentication logs in the console.

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

