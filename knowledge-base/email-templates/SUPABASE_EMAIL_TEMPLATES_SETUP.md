# Supabase Email Templates Setup Guide

This guide will help you set up branded Aromé Luxe email templates in your Supabase project.

## 📧 Available Email Templates

We've created 5 branded email templates for Aromé Luxe:

1. **Confirm Signup** - Welcome email for new user registrations
2. **Reset Password** - Password recovery email
3. **Magic Link** - Passwordless login email
4. **Invite User** - User invitation email
5. **Change Email** - Email address change confirmation

## 🎨 Branding Details

All templates include:
- **Brand Colors**: Luxe Blue (#623cea), Luxe Violet (#4a2bb8), Luxe Gold (#f8ca2e)
- **Fonts**: Playfair Display (headings), Montserrat (body)
- **Logo**: Aromé Luxe branding
- **Domain**: aromeluxe.in
- **Consistent Design**: Professional, luxury aesthetic

## 🚀 Setup Instructions

### Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc
2. Log in to your Supabase account
3. Navigate to: **Authentication** → **Email Templates**

### Step 2: Configure Each Template

For each template below, follow these steps:

1. Click on the template name (e.g., "Confirm signup")
2. Copy the HTML content from the corresponding file
3. Paste it into the Supabase template editor
4. Update the subject line (see below)
5. Click **Save**

### Step 3: Template Subjects

Set these subject lines for each template:

#### Confirm Signup
```
Subject: Welcome to Aromé Luxe - Confirm Your Email
```

#### Reset Password
```
Subject: Reset Your Password - Aromé Luxe
```

#### Magic Link
```
Subject: Your Magic Link - Aromé Luxe
```

#### Invite User
```
Subject: You've Been Invited to Aromé Luxe
```

#### Change Email
```
Subject: Confirm Email Change - Aromé Luxe
```

## 📁 Template Files Location

All templates are located in:
```
supabase/email-templates/
├── confirm-signup.html
├── reset-password.html
├── magic-link.html
├── invite-user.html
└── change-email.html
```

## 🔧 Template Variables

Supabase provides these variables you can use in templates:

- `{{ .ConfirmationURL }}` - The confirmation/reset link
- `{{ .Token }}` - 6-digit OTP code (alternative to link)
- `{{ .TokenHash }}` - Hashed token for custom links
- `{{ .SiteURL }}` - Your site URL (aromeluxe.in)
- `{{ .Email }}` - User's email address
- `{{ .NewEmail }}` - New email (only in change-email template)
- `{{ .RedirectTo }}` - Redirect URL after confirmation
- `{{ .Data }}` - User metadata

All templates are already configured with these variables where appropriate.

## ✅ Verification Checklist

After setting up all templates:

- [ ] Confirm Signup template configured
- [ ] Reset Password template configured
- [ ] Magic Link template configured
- [ ] Invite User template configured
- [ ] Change Email template configured
- [ ] All subject lines updated
- [ ] Test email sent for each template
- [ ] Templates display correctly in email clients

## 🧪 Testing

### Test Each Template

1. **Confirm Signup**
   - Go to: `https://aromeluxe.in/auth/signup`
   - Create a test account
   - Check email for confirmation link

2. **Reset Password**
   - Go to: `https://aromeluxe.in/auth/forgot-password`
   - Enter your email
   - Check email for reset link

3. **Magic Link**
   - Use magic link authentication flow
   - Check email for magic link

4. **Invite User**
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Invite User"
   - Enter email and send invitation

5. **Change Email**
   - Log in to your account
   - Request email change
   - Check new email for confirmation

### Email Client Testing

Test emails in:
- ✅ Gmail (web & mobile)
- ✅ Outlook (web & desktop)
- ✅ Apple Mail
- ✅ Mobile email clients

## 🎨 Customization

### Update Colors

To change brand colors, search and replace in all template files:

```html
<!-- Current Luxe Blue -->
#623cea

<!-- Current Luxe Violet -->
#4a2bb8

<!-- Current Luxe Gold -->
#f8ca2e
```

### Update Logo

If you want to add a logo image:

1. Upload logo to: `/public/assets/arome-luxe-logo.png`
2. Add this code after the header section:

```html
<tr>
  <td align="center" style="padding: 20px 30px;">
    <img src="{{ .SiteURL }}/assets/arome-luxe-logo.png" alt="Aromé Luxe" style="max-width: 200px; height: auto;">
  </td>
</tr>
```

### Update Footer

To modify footer content, edit the footer section in each template:

```html
<!-- Footer section -->
<tr>
  <td style="padding: 30px; ...">
    <!-- Your custom footer content -->
  </td>
</tr>
```

## 📱 Mobile Responsiveness

All templates are mobile-responsive and tested for:
- ✅ iPhone (iOS Mail)
- ✅ Android (Gmail app)
- ✅ Tablet devices
- ✅ Desktop email clients

## 🔒 Security Best Practices

1. ✅ All links use `{{ .ConfirmationURL }}` (secure Supabase URLs)
2. ✅ Security warnings included where appropriate
3. ✅ Expiration times mentioned in emails
4. ✅ Clear instructions for users who didn't request actions

## 🚨 Troubleshooting

### Templates Not Displaying Correctly

**Issue**: Email looks broken in some clients
- **Solution**: Check HTML structure, ensure all tags are closed
- **Solution**: Test in multiple email clients

### Links Not Working

**Issue**: Confirmation links don't work
- **Solution**: Ensure `{{ .ConfirmationURL }}` is used correctly
- **Solution**: Check Supabase redirect URL settings

### Images Not Loading

**Issue**: Logo or images don't appear
- **Solution**: Use absolute URLs (with `{{ .SiteURL }}`)
- **Solution**: Host images on your domain or CDN

### Styling Issues

**Issue**: Colors or fonts look wrong
- **Solution**: Use inline styles (already done)
- **Solution**: Test in email client preview

## 📊 Monitoring

### Check Email Logs

1. **Supabase Dashboard**
   - Go to: **Logs** → Filter by "auth"
   - View email sending attempts

2. **Email Delivery**
   - Check spam folders
   - Monitor bounce rates
   - Track open rates (if using email service)

## 🎯 Quick Reference

### Supabase Project
- **Project URL**: https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc
- **Email Templates**: Authentication → Email Templates
- **SMTP Settings**: Authentication → Settings → SMTP Settings

### Brand Colors
- **Primary**: #623cea (Luxe Blue)
- **Secondary**: #4a2bb8 (Luxe Violet)
- **Accent**: #f8ca2e (Luxe Gold)
- **Background**: #faf8f3 (Cream)

### Domain
- **Website**: https://aromeluxe.in
- **Support Email**: support@aromeluxe.in

---

**Once configured, all authentication emails will be beautifully branded with Aromé Luxe styling!** 📧✨

