# Static Export Contact System Setup

This guide explains how to set up the contact system for static export deployment (like Hostinger).

## 🚀 Quick Setup

### 1. Database Setup

Run the SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-contact-schema.sql
-- This creates the contact_messages table with proper RLS policies
```

### 2. Environment Variables

Ensure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test the Contact Form

1. Navigate to `/contact` on your website
2. Fill out the contact form
3. Submit the form
4. Check your Supabase dashboard to see the message in the `contact_messages` table

## 📋 Static Export Limitations

### What Works with Static Export
- ✅ Contact form submission (client-side to Supabase)
- ✅ Real-time validation
- ✅ Toast notifications
- ✅ Form reset after submission
- ✅ Error handling
- ✅ Email notifications (client-side triggered)

### What Doesn't Work with Static Export
- ❌ Server-side API routes (`/api/contact`)
- ❌ Server-side validation
- ❌ Server-side authentication checks
- ❌ Admin dashboard (requires server-side auth)

## 🛠️ Technical Implementation

### Contact Form Flow
1. **Client-side validation** → Immediate feedback
2. **Direct Supabase call** → Store message in database
3. **Email notifications** → Triggered client-side
4. **Success/Error handling** → User feedback

### Security Considerations
- **RLS Policies**: Supabase Row Level Security handles access control
- **Client-side validation**: Prevents invalid submissions
- **Rate limiting**: Consider implementing client-side rate limiting
- **Email verification**: Consider adding email verification step

## 📧 Email Notifications

### Current Setup
The email service is designed to work client-side:

```typescript
// Email notifications are triggered after successful form submission
// They run in the background and don't block the user experience
```

### Production Email Setup
For production, you'll need to:

1. **Choose Email Service**: Resend, SendGrid, or similar
2. **Update Email Service**: Modify the email service implementation
3. **Add Environment Variables**: API keys and configuration
4. **Test Email Delivery**: Verify both admin and customer emails

## 🔒 Security Features

### Row Level Security (RLS)
- **Public Insert**: Anyone can submit contact messages
- **Authenticated Read/Update**: Only authenticated users can manage messages
- **Proper Permissions**: Granular access control

### Data Validation
- **Client-side**: Immediate feedback for user experience
- **Server-side**: Supabase enforces data integrity
- **Email Validation**: Proper email format checking
- **Length Limits**: Prevents database overflow

## 🎨 Customization

### Form Fields
- Easy to add/remove form fields
- Update the `ContactMessage` interface
- Modify validation rules
- Update database schema if needed

### Styling
- Uses your existing design system
- Responsive design with Tailwind CSS
- Consistent with your brand aesthetic

## 🐛 Troubleshooting

### Common Issues

1. **"new row violates row-level security policy" (Error 42501)**
   - **Solution**: Run the SQL schema script
   - **Cause**: RLS policy is too restrictive
   - **Fix**: Ensure INSERT policy allows anonymous users

2. **"Failed to submit message"**
   - Check Supabase credentials in `.env.local`
   - Verify the `contact_messages` table exists
   - Check RLS policies are correctly set
   - Verify Supabase connection

3. **Form not submitting**
   - Check browser console for errors
   - Verify all required fields are filled
   - Check network connectivity
   - Verify Supabase configuration

4. **Email notifications not working**
   - Check email service configuration
   - Verify environment variables
   - Check console logs for email errors
   - Test email service independently

### Debug Steps
1. Check Supabase dashboard for table creation
2. Verify environment variables
3. Test with browser developer tools
4. Check Supabase logs for any errors
5. Test Supabase connection directly

## 📈 Future Enhancements

### For Static Export
- **Email Integration**: Full email service integration
- **Rate Limiting**: Client-side rate limiting
- **Form Analytics**: Track form submissions
- **A/B Testing**: Test different form layouts

### If Moving to Server-Side
- **Admin Dashboard**: Full admin interface
- **Server-side Validation**: Additional security layer
- **Authentication**: User management system
- **API Routes**: Server-side processing

## 🔄 Migration Options

### Option 1: Keep Static Export
- Use current client-side implementation
- Add email service integration
- Implement client-side admin features

### Option 2: Move to Server-Side
- Remove `output: "export"` from next.config.ts
- Enable API routes
- Implement full admin dashboard
- Add server-side authentication

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check browser console for error messages
4. Verify all setup steps were completed correctly
5. Test Supabase connection independently

## 🚀 Deployment

### Hostinger Deployment
1. Build the static site: `npm run build`
2. Upload the `out` folder to Hostinger
3. Configure environment variables on Hostinger
4. Test the contact form on live site

### Environment Variables on Hostinger
Make sure to set these in your Hostinger control panel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
