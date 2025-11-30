# SMTP Setup Complete Guide for Aromé Luxe

This guide provides step-by-step instructions to complete SMTP setup for Supabase authentication emails using Hostinger.

## ✅ Pre-Check: DNS Configuration

Your domain `aromeluxe.in` is already configured:
- ✅ SPF Record: `v=spf1 include:_spf.mail.hostinger.com ~all`
- ✅ DKIM Records: Configured (3 CNAME records)
- ✅ DMARC Record: `v=DMARC1; p=none`

**No DNS changes needed!** 🎉

## 🚀 Step-by-Step Setup

### Step 1: Create Email Account in Hostinger (5 minutes)

1. **Access Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com/
   - Log in with your Hostinger credentials

2. **Create Email Account**
   - Navigate to: **Email** → **Email Accounts**
   - Click **Create Email Account**
   - Fill in:
     - **Email**: `noreply@aromeluxe.in`
     - **Password**: Create a strong password (use a password manager)
     - **Mailbox Quota**: 2 GB (default)
   - Click **Create**

3. **Save Credentials**
   - Email: `noreply@aromeluxe.in`
   - Password: [save this securely]

### Step 2: Configure SMTP in Supabase (5 minutes)

1. **Access Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc
   - Log in to your Supabase account

2. **Navigate to SMTP Settings**
   - Click **Authentication** in the left sidebar
   - Click **Settings** tab
   - Scroll down to **SMTP Settings** section

3. **Enable Custom SMTP**
   - Toggle **Enable Custom SMTP** to **ON**

4. **Enter SMTP Configuration**
   ```
   SMTP Host: smtp.hostinger.com
   SMTP Port: 465
   SMTP Username: noreply@aromeluxe.in
   SMTP Password: [password from Step 1]
   Sender Email: noreply@aromeluxe.in
   Sender Name: Aromé Luxe
   ```

5. **Test SMTP Connection**
   - Click **Send Test Email** button
   - Enter your email address (e.g., your personal email)
   - Click **Send**
   - Check your inbox (and spam folder) for the test email
   - If received successfully, you're done! ✅

### Step 3: Customize Email Templates (Optional - 10 minutes)

1. **Navigate to Email Templates**
   - In Supabase Dashboard → **Authentication** → **Email Templates**

2. **Customize Templates**
   - **Confirm signup**: Welcome email with confirmation link
   - **Magic Link**: Login link email
   - **Change Email Address**: Email change confirmation
   - **Reset Password**: Password reset link email

3. **Add Branding**
   - Add your logo URL
   - Customize colors to match your brand
   - Update brand name: "Aromé Luxe"
   - Add your website URL: `https://aromeluxe.in`

## 🧪 Testing

### Test 1: SMTP Connection Test
- ✅ Done in Step 2 above (Send Test Email)

### Test 2: Signup Email
1. Go to: `https://aromeluxe.in/auth/signup`
2. Create a test account with your email
3. Check your inbox for confirmation email
4. Click the confirmation link

### Test 3: Password Reset Email
1. Go to: `https://aromeluxe.in/auth/forgot-password`
2. Enter your email address
3. Check your inbox for password reset email
4. Click the reset link

## 🚨 Troubleshooting

### Issue: "SMTP Connection Failed"

**Solutions:**
1. ✅ Verify SMTP host: `smtp.hostinger.com`
2. ✅ Check port: Try 465 first, then 587 if needed
3. ✅ Verify username: Must be full email `noreply@aromeluxe.in`
4. ✅ Check password: Copy-paste to avoid typos
5. ✅ Ensure email account is active in Hostinger

### Issue: "Authentication Failed"

**Solutions:**
1. ✅ Verify email and password are correct
2. ✅ Check if email account is activated in Hostinger
3. ✅ Try using full email as username: `noreply@aromeluxe.in`
4. ✅ Wait 5 minutes after creating email account (propagation time)

### Issue: "Port 465 Not Working"

**Solutions:**
1. ✅ Try port **587** with **STARTTLS** encryption
2. ✅ Update Supabase SMTP settings:
   - Port: `587`
   - Encryption: `STARTTLS`

### Issue: "Emails Not Received"

**Solutions:**
1. ✅ Check spam/junk folder
2. ✅ Verify sender email is `noreply@aromeluxe.in`
3. ✅ Wait 5-10 minutes (email delivery can be delayed)
4. ✅ Check Supabase logs: Dashboard → Logs → Filter by "auth"
5. ✅ Check Hostinger email logs: hPanel → Email → Email Logs

## 📊 Monitoring

### Check Email Logs

**Supabase Logs:**
1. Go to: Supabase Dashboard → **Logs**
2. Filter by: `auth` or `email`
3. Look for: Email sending attempts and errors

**Hostinger Email Logs:**
1. Go to: hPanel → **Email** → **Email Logs**
2. View: Sent/received emails
3. Check: Delivery status

## ✅ Verification Checklist

- [ ] Email account `noreply@aromeluxe.in` created in Hostinger
- [ ] SMTP settings configured in Supabase
- [ ] Test email sent successfully from Supabase
- [ ] Test email received in inbox
- [ ] Signup confirmation email works
- [ ] Password reset email works
- [ ] Email templates customized (optional)
- [ ] Branding added to templates (optional)

## 🎯 Quick Reference

```
Domain: aromeluxe.in
Email: noreply@aromeluxe.in
SMTP Host: smtp.hostinger.com
SMTP Port: 465 (SSL) or 587 (TLS)
Sender Name: Aromé Luxe
Supabase Project: bzqwezglotpkzxghjxvc
```

## 📧 Email Limits

- **Hostinger Shared Hosting**: ~500 emails/day
- **Supabase**: No hard limit, but rate-limited
- **Best Practice**: Monitor usage in Hostinger dashboard

## 🔒 Security Notes

1. ✅ Use a strong, unique password for the email account
2. ✅ Don't share SMTP credentials publicly
3. ✅ Monitor email logs regularly
4. ✅ Enable 2FA on Hostinger account
5. ✅ DNS records (SPF/DKIM/DMARC) are already configured

---

**Once configured, all Supabase authentication emails will be sent through your Hostinger SMTP server!** 📧

**Need Help?**
- Hostinger Support: https://www.hostinger.com/contact
- Supabase Docs: https://supabase.com/docs/guides/auth/auth-smtp
- Project Docs: See `HOSTINGER_SMTP_SETUP.md` for detailed information

