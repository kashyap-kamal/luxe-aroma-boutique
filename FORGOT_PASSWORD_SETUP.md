# Forgot Password - Complete Setup

## Overview
Complete password reset flow has been implemented with:
- ✅ Forgot Password Page - Request password reset
- ✅ Reset Password Page - Set new password
- ✅ Email Integration - Sends reset links via Supabase
- ✅ Token Validation - Secure reset process
- ✅ Error Handling - User-friendly messages
- ✅ Success States - Clear feedback

## Features Implemented

### 1. Forgot Password Request
**Page:** `/auth/forgot-password`

**Features:**
- Email input form with validation
- Sends password reset email via Supabase
- Success confirmation screen
- Error handling for invalid emails
- Link back to sign-in page

**How it works:**
1. User clicks "Forgot password?" on sign-in page
2. Enters their email address
3. System sends reset email with secure token
4. Shows success message
5. User receives email with reset link

### 2. Reset Password
**Page:** `/auth/reset-password`

**Features:**
- Token validation on page load
- New password form with confirmation
- Password strength validation (min 6 characters)
- Password match validation
- Success state with auto-redirect
- Invalid token handling

**How it works:**
1. User clicks reset link from email
2. System validates the reset token
3. User enters new password twice
4. Password is updated in Supabase
5. Redirects to sign-in page
6. User can sign in with new password

### 3. Sign-In Page Integration
**Updated:** `src/components/auth/signin-form.tsx`

**Added:**
- "Forgot password?" link next to password field
- Styled as a subtle link button
- Redirects to forgot password page

## File Structure

```
src/
├── app/
│   └── auth/
│       ├── forgot-password/
│       │   └── page.tsx              # Forgot password page
│       └── reset-password/
│           └── page.tsx              # Reset password page
└── components/
    └── auth/
        ├── forgot-password-form.tsx  # Request reset form
        ├── reset-password-form.tsx   # Reset password form
        └── signin-form.tsx           # Updated with forgot link
```

## User Flow

### Forgot Password Flow
```
1. Sign In Page
   └─> Click "Forgot password?"
       └─> Forgot Password Page
           └─> Enter email
               └─> Receive email with reset link
                   └─> Click link in email
                       └─> Reset Password Page
                           └─> Enter new password
                               └─> Success!
                                   └─> Sign In Page
```

## Email Configuration

### Supabase Email Settings

The password reset uses Supabase's built-in email service:

1. **Email Template** (in Supabase Dashboard):
   - Go to: **Authentication** → **Email Templates**
   - Edit: **Reset Password** template
   - Customize the email design and content

2. **Reset Link Configuration**:
   - Redirect URL: `{SITE_URL}/auth/reset-password`
   - Token automatically included in URL
   - Expires in 1 hour by default

3. **SMTP Settings** (Production):
   - Go to: **Authentication** → **Settings** → **SMTP Settings**
   - Configure custom email provider (SendGrid, AWS SES, etc.)
   - Update sender email and credentials

### Default Email Template
The default Supabase template includes:
- Reset link button
- Expiration time (1 hour)
- Security message
- Support contact info

## Security Features

1. **Token Expiration**
   - Reset links expire after 1 hour
   - Invalid/expired tokens show error message
   - User must request new link

2. **Password Validation**
   - Minimum 6 characters required
   - Password confirmation match required
   - Shows clear error messages

3. **Session Management**
   - Validates token on page load
   - Secure password update via Supabase Auth
   - Auto sign-out before reset

4. **Error Handling**
   - User-friendly error messages
   - Network error handling
   - Invalid email detection

## UI/UX Features

1. **Loading States**
   - Shows spinner during requests
   - Disables forms during processing
   - Clear loading feedback

2. **Success States**
   - Check email confirmation screen
   - Password reset success screen
   - Auto-redirect after success

3. **Error States**
   - Invalid token screen
   - Expired link handling
   - Form validation errors

4. **Navigation**
   - "Back to Sign In" links
   - "Didn't receive email?" option
   - Clear user guidance

## Testing Instructions

### Test Forgot Password Flow

1. **Request Password Reset**:
   ```
   1. Go to http://localhost:3000/auth/signin
   2. Click "Forgot password?" link
   3. Enter a registered email address
   4. Click "Send Reset Link"
   5. Verify success message appears
   ```

2. **Check Email**:
   ```
   1. Open your email inbox
   2. Find "Reset your password" email from Supabase
   3. Click the reset link
   4. Verify you're taken to reset password page
   ```

3. **Reset Password**:
   ```
   1. Enter new password (min 6 characters)
   2. Confirm new password
   3. Click "Reset Password"
   4. Verify success message appears
   5. Verify auto-redirect to sign-in page
   ```

4. **Sign In with New Password**:
   ```
   1. Enter your email
   2. Enter your NEW password
   3. Click "Sign In"
   4. Verify successful sign-in
   ```

### Test Error Cases

1. **Invalid Email**:
   - Enter unregistered email → Shows error message

2. **Password Mismatch**:
   - Enter different passwords → Shows validation error

3. **Weak Password**:
   - Enter < 6 characters → Shows strength error

4. **Expired Token**:
   - Use old reset link → Shows invalid token page

5. **No Token**:
   - Visit `/auth/reset-password` directly → Shows error

## Environment Variables

Already configured in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

No additional variables needed for forgot password!

## Customization

### Change Email Template

1. Go to Supabase Dashboard
2. **Authentication** → **Email Templates**
3. Select **Reset Password**
4. Edit HTML template:
   ```html
   <h2>Reset your password</h2>
   <p>Follow this link to reset your password:</p>
   <a href="{{ .ConfirmationURL }}">Reset Password</a>
   <p>This link expires in {{ .ExpirationTime }}</p>
   ```

### Change Token Expiration

1. Go to Supabase Dashboard
2. **Authentication** → **Settings**
3. Find **Password Recovery**
4. Set expiration time (default: 3600 seconds = 1 hour)

### Customize Redirect URL

In the code (`forgot-password-form.tsx`):
```typescript
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password`,
})
```

## Common Issues & Solutions

### Issue 1: Email not received
**Solutions:**
- Check spam/junk folder
- Verify email is registered
- Check Supabase email quota (free tier limit)
- Configure custom SMTP for production

### Issue 2: Reset link doesn't work
**Solutions:**
- Ensure link hasn't expired (1 hour limit)
- Check redirect URL is correct
- Clear browser cache and try again
- Request new reset link

### Issue 3: "Invalid token" error
**Solutions:**
- Link has expired - request new one
- Token already used - request new one
- Clear cookies and try again

### Issue 4: Password not updating
**Solutions:**
- Check password meets requirements (6+ chars)
- Verify passwords match
- Check browser console for errors
- Try different browser

## Production Checklist

Before going live:

- [ ] Configure custom SMTP in Supabase
- [ ] Customize email templates with branding
- [ ] Test with real email addresses
- [ ] Set appropriate token expiration time
- [ ] Add rate limiting for reset requests
- [ ] Monitor email delivery rates
- [ ] Set up email logging/tracking

## API Reference

### Supabase Methods Used

1. **Reset Password Request**:
   ```typescript
   supabase.auth.resetPasswordForEmail(email, {
     redirectTo: string
   })
   ```

2. **Update Password**:
   ```typescript
   supabase.auth.updateUser({
     password: string
   })
   ```

3. **Get Session** (for token validation):
   ```typescript
   supabase.auth.getSession()
   ```

## Success Indicators

✅ **Working Correctly When:**
- "Forgot password?" link appears on sign-in page
- Clicking it navigates to forgot password page
- Entering email sends reset email
- Email arrives within 1 minute
- Reset link opens reset password page
- New password can be set successfully
- Can sign in with new password

🎉 **Forgot Password System is Complete!**

