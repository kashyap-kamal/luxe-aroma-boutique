# 🎯 Authentication Quick Reference Card

**Keep this handy while setting up!**

---

## 🚀 Setup Commands

```bash
# 1. Generate secret
node generate-auth-secret.js

# 2. Restart server
npm run dev

# 3. Test signup
# Visit: http://localhost:3000/auth/signup

# 4. Test signin
# Visit: http://localhost:3000/auth/signin
```

---

## 📝 .env.local Template

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 🔑 Where to Find Credentials

**Supabase Dashboard → Settings → API:**
- Project URL = `NEXT_PUBLIC_SUPABASE_URL`
- Anon key = `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service role key = `SUPABASE_SERVICE_ROLE_KEY`

**Generate Yourself:**
- `NEXTAUTH_SECRET` = Run `node generate-auth-secret.js`

---

## 📊 Setup Order

1. ✅ Create Supabase project
2. ✅ Get credentials (Settings → API)
3. ✅ Create `.env.local` file
4. ✅ Run `generate-auth-secret.js`
5. ✅ Run `supabase-auth-schema.sql` in Supabase
6. ✅ Restart dev server
7. ✅ Test `/auth/signup`
8. ✅ Test `/auth/signin`

---

## 🧪 Test URLs

- Sign Up: `http://localhost:3000/auth/signup`
- Sign In: `http://localhost:3000/auth/signin`
- Profile: `http://localhost:3000/profile`

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Invalid credentials | Check `.env.local`, restart server |
| No email | Disable confirmations in Supabase |
| Profile missing | Re-run SQL schema |
| No changes | Restart server |

---

## 📁 Key Files

**Setup:**
- `supabase-auth-schema.sql` ← Run in Supabase
- `generate-auth-secret.js` ← Generate secret
- `.env.local` ← Your credentials

**Documentation:**
- `QUICK_START_AUTH.md` ← Start here (5 min)
- `AUTH_SETUP_CHECKLIST.md` ← Track progress
- `AUTHENTICATION_COMPLETED.md` ← Full summary

---

## 💻 Code Examples

### Check if user is logged in:
```tsx
import { useIsAuthenticated } from '@/stores/auth-store'

const isAuth = useIsAuthenticated()
```

### Get current user:
```tsx
import { useUser } from '@/stores/auth-store'

const user = useUser()
console.log(user?.email)
```

### Protect a route:
```tsx
import { ProtectedRoute } from '@/components/auth/protected-route'

<ProtectedRoute>
  <YourContent />
</ProtectedRoute>
```

---

## ✅ Success Indicators

- ✅ No errors in terminal
- ✅ Can sign up successfully
- ✅ Toast notifications appear
- ✅ User avatar in navbar after login
- ✅ Profile in Supabase → Table Editor → profiles

---

## 🆘 Help

**Terminal Errors?** → Check `.env.local`  
**Browser Errors?** → Check console (F12)  
**Email Issues?** → Check Supabase logs  
**Still Stuck?** → See `SUPABASE_AUTH_COMPLETE_SETUP.md`

---

**Print or bookmark this page! 📌**

