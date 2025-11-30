# Email Troubleshooting Guide - Aromé Luxe

This guide helps you diagnose and fix email delivery issues with Supabase authentication emails.

## 🔍 Quick Diagnosis Steps

### Step 1: Check Supabase SMTP Configuration

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc/auth/settings
   - Navigate to: **Authentication** → **Settings** → Scroll to **SMTP Settings**

2. **Verify SMTP is Enabled**
   - ✅ "Enable Custom SMTP" should be **ON**
   - ✅ SMTP Host: `smtp.hostinger.com`
   - ✅ SMTP Port: `465` (or `587`)
   - ✅ SMTP Username: `noreply@aromeluxe.in`
   - ✅ SMTP Password: [your email password]
   - ✅ Sender Email: `noreply@aromeluxe.in`
   - ✅ Sender Name: `Aromé Luxe`

3. **Test SMTP Connection**
   - Click **"Send Test Email"** button
   - Enter your email address
   - Click **"Send"**
   - Check your inbox (and spam folder)

### Step 2: Verify Hostinger Email Account

1. **Go to Hostinger hPanel**
   - URL: https://hpanel.hostinger.com/
   - Navigate to: **Email** → **Email Accounts**

2. **Check Email Account**
   - ✅ `noreply@aromeluxe.in` should exist
   - ✅ Account should be **Active**
   - ✅ Password should match Supabase SMTP password

3. **If Email Account Doesn't Exist**
   - Click **"Create Email Account"**
   - Email: `noreply@aromeluxe.in`
   - Password: Create a strong password (save it!)
   - Click **"Create"**
   - Update Supabase SMTP settings with new password

### Step 3: Check Email Logs

#### Supabase Logs
1. Go to: https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc/logs
2. Filter by: **auth** or **email**
3. Look for: Email sending attempts, errors, or failures

#### Hostinger Email Logs
1. Go to: https://hpanel.hostinger.com/ → **Email** → **Email Logs**
2. Check: Sent emails, delivery status, bounces

### Step 4: Verify DNS Records

Use Hostinger MCP to check DNS:

```bash
# Check DNS records
mcp_hostinger-mcp_DNS_getDNSRecordsV1("aromeluxe.in")
```

**Required DNS Records:**
- ✅ **SPF**: `v=spf1 include:_spf.mail.hostinger.com ~all`
- ✅ **DKIM**: 3 CNAME records (hostingermail-a, hostingermail-b, hostingermail-c)
- ✅ **DMARC**: `v=DMARC1; p=none`
- ✅ **MX**: mx1.hostinger.com, mx2.hostinger.com

## 🚨 Common Issues & Solutions

### Issue 1: "SMTP Connection Failed"

**Symptoms:**
- Error when testing SMTP in Supabase
- Emails not sending

**Solutions:**
1. ✅ Verify SMTP host: `smtp.hostinger.com` (not `smtp.hostinger.in`)
2. ✅ Try port **587** if port **465** doesn't work
3. ✅ Check username: Must be full email `noreply@aromeluxe.in`
4. ✅ Verify password: Copy-paste to avoid typos
5. ✅ Ensure email account is active in Hostinger
6. ✅ Wait 5-10 minutes after creating email account (propagation)

### Issue 2: "Authentication Failed"

**Symptoms:**
- SMTP test fails with authentication error
- Wrong username/password error

**Solutions:**
1. ✅ Verify email and password in Hostinger hPanel
2. ✅ Check if email account is activated
3. ✅ Try resetting email account password in Hostinger
4. ✅ Update Supabase SMTP settings with new password
5. ✅ Use full email address as username: `noreply@aromeluxe.in`

### Issue 3: Emails Not Received

**Symptoms:**
- SMTP test succeeds but emails not received
- Signup confirmation emails not arriving

**Solutions:**
1. ✅ Check spam/junk folder (most common issue)
2. ✅ Verify sender email: `noreply@aromeluxe.in`
3. ✅ Check SPF/DKIM records are configured
4. ✅ Wait 5-10 minutes (email delivery can be delayed)
5. ✅ Check Supabase logs for email sending errors
6. ✅ Check Hostinger email logs for delivery status
7. ✅ Try sending to different email address (Gmail, Outlook, etc.)

### Issue 4: Emails Going to Spam

**Symptoms:**
- Emails received but in spam folder
- Low sender reputation

**Solutions:**
1. ✅ Verify SPF record is configured correctly
2. ✅ Check DKIM records are present (3 CNAME records)
3. ✅ Verify DMARC record
4. ✅ Wait 24-48 hours for DNS propagation
5. ✅ Mark emails as "Not Spam" to improve reputation
6. ✅ Use consistent sender name: "Aromé Luxe"

### Issue 5: Port 465 Not Working

**Symptoms:**
- Connection timeout on port 465
- SSL/TLS errors

**Solutions:**
1. ✅ Try port **587** with **STARTTLS** encryption
2. ✅ Update Supabase SMTP settings:
   - Port: `587`
   - Encryption: `STARTTLS`
3. ✅ Check firewall settings
4. ✅ Verify SSL/TLS is enabled

## 🔧 Step-by-Step SMTP Setup Verification

### Complete Setup Checklist

- [ ] Email account `noreply@aromeluxe.in` created in Hostinger
- [ ] Email account is active and password is known
- [ ] Supabase SMTP enabled (toggle ON)
- [ ] SMTP Host: `smtp.hostinger.com`
- [ ] SMTP Port: `465` or `587`
- [ ] SMTP Username: `noreply@aromeluxe.in`
- [ ] SMTP Password: [matches Hostinger password]
- [ ] Sender Email: `noreply@aromeluxe.in`
- [ ] Sender Name: `Aromé Luxe`
- [ ] Test email sent successfully
- [ ] Test email received in inbox
- [ ] SPF record configured
- [ ] DKIM records configured
- [ ] DMARC record configured

## 📊 Using MCP Tools for Troubleshooting

### Check DNS Records
```bash
# Get all DNS records for domain
mcp_hostinger-mcp_DNS_getDNSRecordsV1("aromeluxe.in")

# Look for:
# - SPF record (TXT type, name: @)
# - DKIM records (CNAME type, names: hostingermail-*)
# - DMARC record (TXT type, name: _dmarc)
# - MX records (MX type)
```

### Check Domain Status
```bash
# Get domain details
mcp_hostinger-mcp_domains_getDomainDetailsV1("aromeluxe.in")

# Verify domain is active
```

### Check Supabase Logs
```bash
# Get auth logs
mcp_supabase_get_logs(service: "auth")

# Look for email sending errors
# Check for "user_confirmation_requested" events
```

## 🧪 Testing Email Flow

### Test 1: SMTP Connection Test
1. Go to Supabase Dashboard → Authentication → Settings → SMTP Settings
2. Click "Send Test Email"
3. Enter your email address
4. Click "Send"
5. **Expected**: Test email received within 1-2 minutes

### Test 2: Signup Confirmation Email
1. Go to: `https://aromeluxe.in/auth/signup`
2. Create a test account with your email
3. **Expected**: Confirmation email received within 2-5 minutes

### Test 3: Password Reset Email
1. Go to: `https://aromeluxe.in/auth/forgot-password`
2. Enter your email address
3. Click "Send Reset Link"
4. **Expected**: Password reset email received within 2-5 minutes

## 📧 Email Account Setup (If Not Done)

### Create Email Account in Hostinger

1. **Access hPanel**
   - Go to: https://hpanel.hostinger.com/
   - Log in with your Hostinger credentials

2. **Navigate to Email Accounts**
   - Click **Email** in left sidebar
   - Click **Email Accounts**

3. **Create Account**
   - Click **"Create Email Account"**
   - **Email**: `noreply@aromeluxe.in`
   - **Password**: Create strong password (save it!)
   - **Mailbox Quota**: 2 GB (default)
   - Click **"Create"**

4. **Save Credentials**
   - Email: `noreply@aromeluxe.in`
   - Password: [save securely]

5. **Configure in Supabase**
   - Go to Supabase Dashboard → Authentication → Settings → SMTP Settings
   - Enable Custom SMTP
   - Enter credentials from step 4
   - Test connection

## 🔍 Debugging Commands

### Check Current SMTP Status
```bash
# This requires Supabase Dashboard access
# Go to: https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc/auth/settings
# Scroll to SMTP Settings section
```

### Check Email Logs
```bash
# Supabase logs
mcp_supabase_get_logs(service: "auth")

# Look for email-related events
# Filter for: "user_confirmation_requested", "password_reset_requested"
```

### Verify DNS Configuration
```bash
# Get DNS records
mcp_hostinger-mcp_DNS_getDNSRecordsV1("aromeluxe.in")

# Check for:
# - SPF record (should include hostinger.com)
# - DKIM records (3 CNAME records)
# - DMARC record
# - MX records
```

## ✅ Quick Fix Checklist

If emails aren't working, check these in order:

1. ✅ **SMTP Enabled?** - Supabase Dashboard → Auth Settings → SMTP toggle ON
2. ✅ **Email Account Exists?** - Hostinger hPanel → Email Accounts
3. ✅ **Password Correct?** - Verify password matches in both places
4. ✅ **Port Correct?** - Try 465, then 587 if needed
5. ✅ **Test Email Works?** - Send test email from Supabase Dashboard
6. ✅ **Check Spam Folder** - Emails might be filtered
7. ✅ **DNS Records OK?** - Verify SPF/DKIM via MCP
8. ✅ **Wait Time** - Allow 5-10 minutes for delivery

## 📞 Support Resources

- **Supabase Support**: https://supabase.com/support
- **Hostinger Support**: https://www.hostinger.com/contact
- **Supabase SMTP Docs**: https://supabase.com/docs/guides/auth/auth-smtp
- **Hostinger Email Guide**: https://www.hostinger.com/tutorials/how-to-set-up-email

---

**Most Common Issue**: Emails are in spam folder! Always check spam/junk folder first. 📧

