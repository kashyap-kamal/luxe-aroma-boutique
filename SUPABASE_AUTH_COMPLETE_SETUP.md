# 🔐 Complete Supabase Authentication Setup Guide

This guide will help you complete the Supabase authentication integration for your Aromé Luxe boutique.

## ✅ What's Already Done

Your authentication system is already well-structured with:
- ✅ Sign-in and sign-up forms
- ✅ Auth provider with session management
- ✅ User menu with profile dropdown
- ✅ Zustand store for state management
- ✅ Protected route components
- ✅ TypeScript types and interfaces

## 🚀 Steps to Complete the Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name: `luxe-aroma-boutique`
   - Database password: (choose a strong password and save it)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret)

### Step 3: Create `.env.local` File

Create a file named `.env.local` in your project root:

```bash
# In your project root (luxe-aroma-boutique/)
touch .env.local
```

Add this content (replace with your actual values):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-this-below

# Your existing variables (keep these)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-existing-razorpay-key
RAZORPAY_KEY_SECRET=your-existing-razorpay-secret
DELHIVERY_API_KEY=your-existing-delhivery-key
```

### Step 4: Generate NextAuth Secret

Run this command in your terminal to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

### Step 5: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `supabase-auth-schema.sql` (in your project root)
4. Paste it into the SQL editor
5. Click **Run** to execute the SQL
6. You should see: ✅ Success messages

This creates:
- `profiles` table for user data
- Row Level Security (RLS) policies
- Automatic trigger to create profiles on signup
- All necessary indexes and permissions

### Step 6: Configure Email Authentication

1. In Supabase, go to **Authentication** → **Providers**
2. Ensure **Email** provider is **enabled** (it's usually enabled by default)
3. Optional: Configure email templates:
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation email design

### Step 7: Configure Email Settings (Important!)

For development:
1. Go to **Authentication** → **Settings**
2. Find **SMTP Settings** section
3. For testing, you can use Supabase's built-in email service
4. **Enable email confirmations** (or disable for testing)

**For production**, configure your own SMTP:
- Use SendGrid, AWS SES, or another email service
- Add your SMTP credentials in Supabase settings

### Step 8: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 9: Test Authentication

1. **Sign Up Test**:
   - Go to `http://localhost:3000/auth/signup`
   - Fill in the form with a test email
   - Click "Create Account"
   - Check your email for confirmation link (if enabled)
   - Verify you see success message

2. **Sign In Test**:
   - Go to `http://localhost:3000/auth/signin`
   - Enter your test credentials
   - Click "Sign In"
   - Verify you're redirected to homepage
   - Check that user menu appears in navbar

3. **Sign Out Test**:
   - Click on your avatar in navbar
   - Click "Sign out"
   - Verify you're signed out

### Step 10: Verify Database

1. In Supabase, go to **Table Editor**
2. Click on **profiles** table
3. You should see your user profile created automatically
4. Verify the data matches what you entered

## 🔍 Troubleshooting

### Issue: "Invalid credentials" error

**Solution**: 
- Double-check your `.env.local` values
- Ensure no extra spaces or line breaks
- Restart dev server after changing `.env.local`

### Issue: Email not received

**Solution**:
- Check spam folder
- For testing, disable email confirmation:
  - Supabase → Authentication → Settings
  - Uncheck "Enable email confirmations"
- Check Supabase logs: Authentication → Logs

### Issue: Profile not created automatically

**Solution**:
- Verify the trigger was created: Run this in SQL Editor:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- Re-run the `supabase-auth-schema.sql` script

### Issue: "User already registered" error

**Solution**:
- The email is already in use
- Use a different email or delete the user:
  - Supabase → Authentication → Users
  - Find and delete the test user

### Issue: Session not persisting

**Solution**:
- Clear browser cookies and localStorage
- Verify `NEXTAUTH_SECRET` is set
- Check browser console for errors

## 🧪 Testing Checklist

- [ ] Supabase project created
- [ ] `.env.local` file created with all credentials
- [ ] Database schema executed successfully
- [ ] Email provider configured
- [ ] Dev server restarted
- [ ] Sign up works and creates user
- [ ] Sign in works and shows user menu
- [ ] User profile displays correctly
- [ ] Sign out works properly
- [ ] Profile appears in Supabase database

## 📊 Verify Your Setup

Run these SQL queries in Supabase SQL Editor to verify:

```sql
-- Check if profiles table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- View all users (after creating test accounts)
SELECT id, email, created_at FROM auth.users;

-- View all profiles
SELECT * FROM profiles;
```

## 🎉 Success!

Once all tests pass, your authentication is fully integrated! Users can now:
- ✅ Create accounts
- ✅ Sign in/out
- ✅ View their profile
- ✅ Access protected routes
- ✅ Have their sessions persist

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - it's already in `.gitignore`
2. **Use strong passwords** for database and admin accounts
3. **Enable email confirmation** in production
4. **Keep service role key secret** - never expose to client
5. **Review RLS policies** regularly for security
6. **Enable 2FA** on your Supabase account

## 📚 Next Steps

1. Add password reset functionality
2. Implement social login (Google, Facebook)
3. Add user profile editing
4. Create admin dashboard
5. Set up production environment variables

## 🆘 Need Help?

- Supabase Docs: https://supabase.com/docs/guides/auth
- Next.js Auth Docs: https://nextjs.org/docs/authentication
- Project Issues: Check your terminal and browser console for errors

---

**Your authentication system is production-ready! 🚀**

