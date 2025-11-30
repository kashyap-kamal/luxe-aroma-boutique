# Hostinger SMTP Setup for Supabase Emails

This guide will help you configure Hostinger SMTP settings in Supabase to send authentication emails (signup confirmations, password resets, etc.) through your Hostinger email account.

## 🔐 Prerequisites

1. **Hostinger Account** with email hosting
2. **Email Account** created in Hostinger (e.g., `noreply@yourdomain.com`)
3. **Supabase Project** access

## 📋 Hostinger SMTP Settings

### Standard SMTP Configuration for aromeluxe.in

```
SMTP Host: smtp.hostinger.com
SMTP Port: 465 (SSL) or 587 (TLS)
SMTP Username: noreply@aromeluxe.in
SMTP Password: [your-email-password]
Encryption: SSL/TLS
Sender Email: noreply@aromeluxe.in
Sender Name: Aromé Luxe
```

### ✅ DNS Status (Already Configured!)

Your domain `aromeluxe.in` already has:
- ✅ **SPF Record**: `v=spf1 include:_spf.mail.hostinger.com ~all`
- ✅ **DKIM Records**: Configured (hostingermail-a, hostingermail-b, hostingermail-c)
- ✅ **DMARC Record**: `v=DMARC1; p=none`

No DNS changes needed! 🎉

### Alternative Ports (if needed)

- **Port 465**: SSL/TLS encryption
- **Port 587**: STARTTLS encryption
- **Port 25**: Unencrypted (not recommended)

## 🚀 Step-by-Step Setup

### Step 1: Create Email Account in Hostinger

1. **Log in to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com/
   - Log in with your Hostinger account

2. **Navigate to Email Accounts**
   - Click on **Email** in the left sidebar
   - Click **Email Accounts**

3. **Create Email Account**
   - Click **Create Email Account** button
   - **Email**: `noreply@aromeluxe.in`
   - **Password**: Create a strong password (save this!)
   - **Mailbox Quota**: 2 GB (default is fine)
   - Click **Create**

4. **Save Credentials**
   - Email: `noreply@aromeluxe.in`
   - Password: [the password you just created]
   - You'll need these for Supabase SMTP configuration

### Step 2: Configure SMTP in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings**
   - Go to **Authentication** → **Settings**
   - Scroll down to **SMTP Settings**

3. **Enable Custom SMTP**
   - Toggle **Enable Custom SMTP** to ON

4. **Enter SMTP Configuration**
   ```
   SMTP Host: smtp.hostinger.com
   SMTP Port: 465
   SMTP Username: noreply@aromeluxe.in
   SMTP Password: [the password you created in Step 1]
   Sender Email: noreply@aromeluxe.in
   Sender Name: Aromé Luxe
   ```
   
   **Important**: 
   - Use port **465** with **SSL/TLS** encryption
   - If port 465 doesn't work, try port **587** with **STARTTLS**
   - Make sure to use the full email address as the username

5. **Test SMTP Connection**
   - Click **Send Test Email**
   - Check your email inbox for the test message
   - If successful, you're all set!

### Step 3: Configure Email Templates (Optional)

1. **Go to Email Templates**
   - In Supabase Dashboard → **Authentication** → **Email Templates**

2. **Customize Templates**
   - **Confirm signup**: Welcome email with confirmation link
   - **Magic Link**: Login link email
   - **Change Email Address**: Email change confirmation
   - **Reset Password**: Password reset link email

3. **Add Branding**
   - Add your logo
   - Customize colors
   - Add your brand name: "Aromé Luxe"

## 🔧 Advanced Configuration

### Using Port 587 (TLS)

If port 465 doesn't work, try port 587:

```
SMTP Host: smtp.hostinger.com
SMTP Port: 587
Encryption: STARTTLS
SMTP Username: noreply@yourdomain.com
SMTP Password: [your-email-password]
```

### SPF Record (Recommended)

Add SPF record to your domain DNS to improve email deliverability:

```
Type: TXT
Name: @
Value: v=spf1 include:hostinger.com ~all
```

### DKIM Record (Recommended)

Hostinger provides DKIM keys in your email settings. Add them to your DNS:

1. Go to Hostinger → Email → Email Accounts
2. Click on your email account
3. Find DKIM settings
4. Copy the DKIM record
5. Add it to your domain DNS

## 🧪 Testing

### Test Email Sending

1. **Test from Supabase Dashboard**
   - Go to Authentication → Settings → SMTP Settings
   - Click "Send Test Email"
   - Check your inbox

2. **Test Signup Flow**
   - Go to `/auth/signup`
   - Create a test account
   - Check email for confirmation link

3. **Test Password Reset**
   - Go to `/auth/forgot-password`
   - Enter email
   - Check email for reset link

## 🚨 Troubleshooting

### Common Issues

**1. "SMTP Connection Failed"**
- ✅ Check SMTP host: `smtp.hostinger.com`
- ✅ Verify port: 465 or 587
- ✅ Check username/password are correct
- ✅ Ensure email account is active in Hostinger

**2. "Authentication Failed"**
- ✅ Verify email and password are correct
- ✅ Check if email account is activated
- ✅ Try using full email as username: `noreply@yourdomain.com`

**3. "Emails Not Received"**
- ✅ Check spam/junk folder
- ✅ Verify sender email is correct
- ✅ Check SPF/DKIM records are set up
- ✅ Wait a few minutes (can take up to 5 minutes)

**4. "Port 465 Not Working"**
- ✅ Try port 587 with STARTTLS
- ✅ Check firewall settings
- ✅ Verify SSL/TLS is enabled

### Verify SMTP Settings

You can test SMTP connection using a simple script:

```bash
# Test SMTP connection (requires telnet or openssl)
openssl s_client -connect smtp.hostinger.com:465
```

## 📧 Email Account Recommendations

### Best Practices

1. **Use Dedicated Email Account**
   - Create: `noreply@yourdomain.com` or `support@yourdomain.com`
   - Don't use your personal email
   - Use a strong password

2. **Email Limits**
   - Hostinger typically allows 500 emails/day on shared hosting
   - For higher limits, consider upgrading plan
   - Monitor email usage in Hostinger dashboard

3. **Email Warm-up**
   - Start with low volume
   - Gradually increase email sending
   - This improves deliverability

## 🔒 Security Best Practices

1. **Strong Password**: Use a strong, unique password for SMTP
2. **SPF/DKIM**: Set up SPF and DKIM records
3. **Monitor**: Check email logs regularly
4. **Rate Limiting**: Supabase has built-in rate limiting
5. **Two-Factor**: Enable 2FA on your Hostinger account

## 📊 Monitoring

### Check Email Logs

1. **Hostinger Email Logs**
   - Go to Hostinger → Email → Email Logs
   - View sent/received emails

2. **Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Filter by "auth" to see email sending logs

## ✅ Verification Checklist

- [ ] Email account created in Hostinger
- [ ] SMTP settings configured in Supabase
- [ ] Test email sent successfully
- [ ] SPF record added to DNS (optional but recommended)
- [ ] DKIM record added to DNS (optional but recommended)
- [ ] Email templates customized
- [ ] Test signup email received
- [ ] Test password reset email received

## 🎯 Quick Reference for aromeluxe.in

```
SMTP Host: smtp.hostinger.com
SMTP Port: 465 (SSL) or 587 (TLS)
SMTP Username: noreply@aromeluxe.in
SMTP Password: [your-email-password]
Sender Email: noreply@aromeluxe.in
Sender Name: Aromé Luxe
```

### Supabase Project Details
- **Project URL**: https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc
- **Project Reference**: bzqwezglotpkzxghjxvc

## 📚 Additional Resources

- [Hostinger Email Setup Guide](https://www.hostinger.com/tutorials/how-to-set-up-email)
- [Supabase SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
- [Email Deliverability Best Practices](https://supabase.com/docs/guides/auth/auth-smtp#email-deliverability)

---

**Once configured, all Supabase authentication emails will be sent through your Hostinger SMTP server!** 📧



