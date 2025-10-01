# 🚀 Quick Start: Supabase Authentication

**5-Minute Setup Guide** - Get your authentication running quickly!

## ⚡ Quick Setup (5 Steps)

### Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Save your project details

### Step 2: Get Credentials (1 min)

In Supabase Dashboard → Settings → API, copy:
- Project URL
- Anon key
- Service role key

### Step 3: Create `.env.local` (1 min)

Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Generate this with: node generate-auth-secret.js
NEXTAUTH_SECRET=your-generated-secret-here

NEXTAUTH_URL=http://localhost:3000
```

Generate your NEXTAUTH_SECRET:
```bash
node generate-auth-secret.js
```

### Step 4: Setup Database (1 min)

1. In Supabase → SQL Editor
2. Copy content from `supabase-auth-schema.sql`
3. Paste and click **Run**
4. Wait for "Success ✅"

### Step 5: Restart & Test (30 sec)

```bash
# Restart your dev server
npm run dev
```

Go to: `http://localhost:3000/auth/signup`

---

## 🧪 Test Your Setup

### Test Sign Up:
1. Visit: `http://localhost:3000/auth/signup`
2. Fill in the form
3. Click "Create Account"
4. ✅ See success message

### Test Sign In:
1. Visit: `http://localhost:3000/auth/signin`
2. Enter your credentials
3. ✅ See your avatar in navbar

### Test Sign Out:
1. Click your avatar
2. Click "Sign out"
3. ✅ Back to guest state

---

## ✅ What's Now Working

- ✅ **Sign Up** with email confirmation
- ✅ **Sign In** with password
- ✅ **Sign Out** functionality
- ✅ **User Menu** in navbar with avatar
- ✅ **Profile Data** stored in database
- ✅ **Session Management** with auto-refresh
- ✅ **Toast Notifications** for all actions
- ✅ **Error Handling** with friendly messages
- ✅ **Protected Routes** ready to use
- ✅ **Row Level Security** enabled

---

## 🔍 Quick Troubleshooting

### ❌ "Invalid credentials"
**Fix:** Check `.env.local` values, restart server

### ❌ "Email not received"
**Fix:** Disable email confirmation in Supabase:
- Authentication → Settings
- Uncheck "Enable email confirmations"

### ❌ Profile not created
**Fix:** Re-run `supabase-auth-schema.sql`

### ❌ Changes not applying
**Fix:** Restart dev server: `npm run dev`

---

## 📁 Files Created/Modified

### New Files:
- ✅ `supabase-auth-schema.sql` - Database setup
- ✅ `SUPABASE_AUTH_COMPLETE_SETUP.md` - Full guide
- ✅ `QUICK_START_AUTH.md` - This file
- ✅ `generate-auth-secret.js` - Secret generator
- ✅ `src/app/auth/callback/route.ts` - Email confirmation handler

### Enhanced Files:
- ✅ `src/components/auth/signin-form.tsx` - Better error handling + toasts
- ✅ `src/components/auth/signup-form.tsx` - Better UX + validation

### Already Existing (No changes needed):
- ✅ `src/components/auth/auth-provider.tsx` - Session management
- ✅ `src/components/auth/user-menu.tsx` - User dropdown
- ✅ `src/stores/auth-store.ts` - State management
- ✅ `src/lib/supabase.ts` - Supabase client

---

## 🎯 Next Steps

1. **Test all functionality** (sign up, sign in, sign out)
2. **Verify database** in Supabase → Table Editor → profiles
3. **Configure email templates** (optional)
4. **Add protected routes** using `<ProtectedRoute>`
5. **Customize user profile page** at `/profile`

---

## 📚 Full Documentation

For detailed information, see:
- `SUPABASE_AUTH_COMPLETE_SETUP.md` - Comprehensive setup guide
- `AUTH_SETUP.md` - Architecture and features

---

## 🆘 Need Help?

1. Check browser console for errors
2. Check terminal for server errors
3. Verify all `.env.local` values
4. Restart development server
5. Check Supabase logs: Authentication → Logs

---

**🎉 Your authentication is ready! Start building your app!**

Quick links:
- Sign Up: `http://localhost:3000/auth/signup`
- Sign In: `http://localhost:3000/auth/signin`
- Profile: `http://localhost:3000/profile`

