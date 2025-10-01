# ✅ Authentication Setup Checklist

Use this checklist to track your setup progress.

## 📋 Setup Checklist

### 1. Supabase Project Setup
- [ ] Created Supabase account at [supabase.com](https://supabase.com)
- [ ] Created new project for Luxe Aroma Boutique
- [ ] Saved database password securely
- [ ] Project is fully initialized (shows green checkmark)

### 2. Get Credentials
- [ ] Copied Project URL from Settings → API
- [ ] Copied Anon/Public Key from Settings → API
- [ ] Copied Service Role Key from Settings → API
- [ ] Generated NEXTAUTH_SECRET using `node generate-auth-secret.js`

### 3. Environment Configuration
- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Added `NEXTAUTH_SECRET`
- [ ] Added `NEXTAUTH_URL=http://localhost:3000`
- [ ] Verified no extra spaces or line breaks

### 4. Database Schema Setup
- [ ] Opened Supabase SQL Editor
- [ ] Opened `supabase-auth-schema.sql` file
- [ ] Copied entire SQL content
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run" button
- [ ] Verified "Success ✅" messages appeared
- [ ] Checked Tables → profiles table exists
- [ ] Verified RLS is enabled on profiles table

### 5. Email Configuration
- [ ] Went to Authentication → Settings
- [ ] Verified Email provider is enabled
- [ ] Configured email confirmations (or disabled for testing)
- [ ] Tested email delivery (optional)

### 6. Development Server
- [ ] Stopped current dev server (Ctrl+C)
- [ ] Restarted server with `npm run dev`
- [ ] No errors in terminal
- [ ] Application loads successfully

### 7. Test Sign Up Flow
- [ ] Visited `http://localhost:3000/auth/signup`
- [ ] Filled in test details:
  - Full Name: Test User
  - Email: test@example.com
  - Password: (at least 6 characters)
- [ ] Clicked "Create Account"
- [ ] Saw success message with checkmark
- [ ] Received confirmation email (if enabled)
- [ ] Saw toast notification

### 8. Verify Database
- [ ] Went to Supabase → Table Editor → profiles
- [ ] Found new profile entry
- [ ] Verified user data is correct
- [ ] Went to Authentication → Users
- [ ] Found new user in auth.users table

### 9. Test Sign In Flow
- [ ] Visited `http://localhost:3000/auth/signin`
- [ ] Entered test credentials
- [ ] Clicked "Sign In"
- [ ] Saw "Welcome back!" toast
- [ ] Redirected to homepage
- [ ] User avatar appeared in navbar
- [ ] Clicked avatar → saw user menu with email

### 10. Test User Menu
- [ ] Clicked on user avatar in navbar
- [ ] Verified dropdown menu appeared
- [ ] Saw correct name and email
- [ ] Saw "Profile", "Orders", "Settings" menu items
- [ ] Clicked "Profile" → navigated correctly

### 11. Test Sign Out Flow
- [ ] Clicked on user avatar
- [ ] Clicked "Sign out"
- [ ] Saw sign out confirmation (toast)
- [ ] Redirected to homepage
- [ ] Avatar replaced with "Sign In" button
- [ ] Cannot access `/profile` when logged out

### 12. Test Error Handling
- [ ] Tried signing in with wrong password
- [ ] Saw clear error message
- [ ] Tried signing up with existing email
- [ ] Saw "already registered" message
- [ ] Tried weak password (< 6 chars)
- [ ] Saw password requirements message

### 13. Production Readiness (Optional for now)
- [ ] Configured custom SMTP for production emails
- [ ] Customized email templates in Supabase
- [ ] Set up password reset flow
- [ ] Tested on mobile devices
- [ ] Configured production environment variables
- [ ] Enabled email confirmation for production

---

## 🎉 Completion Status

**Total Items:** 13 sections, ~60 items
**Completed:** _____ / 60

Once all items are checked, your authentication is **fully functional**! ✅

---

## 📊 Quick Verification Commands

Run these in Supabase SQL Editor to verify setup:

```sql
-- Check profiles table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Count users
SELECT COUNT(*) as total_users FROM auth.users;

-- Count profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- View your test profile
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;
```

---

## 🆘 If Something Doesn't Work

1. **Check `.env.local` file** - Most common issue
2. **Restart dev server** - Required after env changes
3. **Clear browser cache** - Sometimes helps
4. **Check console errors** - Browser and terminal
5. **Verify SQL ran successfully** - Re-run if needed
6. **Check Supabase logs** - Authentication → Logs

---

## 📚 Documentation References

- **Quick Start:** `QUICK_START_AUTH.md` (5-minute guide)
- **Full Guide:** `SUPABASE_AUTH_COMPLETE_SETUP.md` (detailed)
- **Architecture:** `AUTH_SETUP.md` (technical details)

---

**Last Updated:** October 2025
**Version:** 1.0

