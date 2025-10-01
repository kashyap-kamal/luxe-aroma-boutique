# Supabase Edge Function Setup Guide

This guide explains how to set up and deploy the Supabase Edge Function for handling contact form submissions.

## 🚀 Quick Setup

### 1. Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- Supabase project created
- Logged into Supabase CLI (`supabase login`)

### 2. Deploy the Edge Function

```bash
# Make the deployment script executable
chmod +x deploy-edge-function.sh

# Deploy the function
./deploy-edge-function.sh
```

Or manually:

```bash
# Deploy the contact-handler function
supabase functions deploy contact-handler
```

### 3. Update Your Contact Form

Update your contact form to use the Edge Function:

```typescript
// In your contact form component
import { ContactEdgeService } from '@/lib/contact-edge-service'

// Replace ContactService with ContactEdgeService
const result = await ContactEdgeService.submitContactMessage(formData)
```

## 📋 Edge Function Features

### ✅ What the Edge Function Provides
- **Server-side validation**: Additional security layer
- **CORS handling**: Proper cross-origin requests
- **Email notifications**: Server-side email sending
- **Error handling**: Comprehensive error responses
- **Type safety**: Proper TypeScript interfaces
- **Authentication**: Admin access control

### 🔧 Function Endpoints

#### POST `/functions/v1/contact-handler`
- **Purpose**: Submit new contact messages
- **Authentication**: Not required (public endpoint)
- **Body**: `{ name, email, subject, message }`
- **Response**: `{ success, message, data: { id } }`

#### GET `/functions/v1/contact-handler`
- **Purpose**: Retrieve contact messages (admin)
- **Authentication**: Required (Bearer token)
- **Query Params**: `limit`, `offset`, `status`
- **Response**: `{ success, message, data: [] }`

## 🛠️ Technical Implementation

### Edge Function Structure
```
supabase/functions/contact-handler/
├── index.ts          # Main function code
└── deno.json         # Deno configuration
```

### Key Features
- **TypeScript Support**: Full type safety
- **CORS Headers**: Proper cross-origin handling
- **Error Handling**: Comprehensive error responses
- **Email Integration**: Ready for email services
- **Database Integration**: Direct Supabase client usage

## 🔒 Security Features

### Row Level Security (RLS)
- **Anonymous Insert**: Public can submit contact messages
- **Authenticated Read**: Only authenticated users can view messages
- **Proper Policies**: Granular access control

### Validation
- **Server-side**: Additional validation layer
- **Email Format**: Proper email validation
- **Field Length**: Prevents database overflow
- **Required Fields**: Ensures data completeness

## 📧 Email Notifications

### Current Implementation
The Edge Function includes placeholder email functionality:

```typescript
// Email notifications are logged to console
// Ready for integration with email services
```

### Production Email Setup
To enable actual email sending:

1. **Choose Email Service**: Resend, SendGrid, or similar
2. **Update Edge Function**: Modify the `sendEmailNotifications` function
3. **Add Environment Variables**: Set API keys in Supabase
4. **Test Email Delivery**: Verify both admin and customer emails

### Example with Resend
```typescript
// Uncomment and configure in the Edge Function
const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

await resend.emails.send({
  from: 'Aromé Luxe <noreply@aromeluxe.in>',
  to: ['admin@aromeluxe.in'],
  subject: `New Contact Message: ${contactData.subject}`,
  html: `...`
})
```

## 🎨 Frontend Integration

### Using the Edge Function Service
```typescript
import { ContactEdgeService } from '@/lib/contact-edge-service'

// Submit contact message
const result = await ContactEdgeService.submitContactMessage({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'General Inquiry',
  message: 'Hello, I have a question...'
})

// Get contact messages (admin)
const messages = await ContactEdgeService.getContactMessages(10, 0, 'new')
```

### Error Handling
```typescript
if (result.success) {
  toast.success(result.message)
  // Reset form
} else {
  toast.error(result.message)
  console.error('Error:', result.error)
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Function not found" (404)**
   - **Solution**: Ensure function is deployed correctly
   - **Check**: `supabase functions list`
   - **Fix**: Redeploy the function

2. **"CORS error"**
   - **Solution**: Edge Function includes CORS headers
   - **Check**: Verify function URL is correct
   - **Fix**: Check browser network tab for actual error

3. **"Authentication required" (401)**
   - **Solution**: Add authentication header for admin endpoints
   - **Check**: Verify user is logged in
   - **Fix**: Include Bearer token in request headers

4. **"Database error" (500)**
   - **Solution**: Check RLS policies and database connection
   - **Check**: Verify contact_messages table exists
   - **Fix**: Run the SQL schema script

### Debug Steps
1. Check Supabase dashboard for function deployment
2. Verify environment variables are set
3. Test function locally: `supabase functions serve contact-handler`
4. Check function logs in Supabase dashboard
5. Test with browser developer tools

## 📈 Performance & Scaling

### Edge Function Benefits
- **Global Distribution**: Functions run close to users
- **Auto-scaling**: Handles traffic spikes automatically
- **Low Latency**: Fast response times
- **Cost Effective**: Pay only for usage

### Optimization Tips
- **Connection Pooling**: Reuse Supabase client
- **Caching**: Cache frequently accessed data
- **Rate Limiting**: Implement rate limiting for public endpoints
- **Monitoring**: Use Supabase analytics

## 🔄 Migration from Client-Side

### Option 1: Keep Both (Recommended)
- Use Edge Function for production
- Keep client-side service as fallback
- Gradually migrate all traffic

### Option 2: Full Migration
- Update all contact forms to use Edge Function
- Remove client-side service
- Test thoroughly before deployment

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Supabase Edge Functions documentation
3. Check function logs in Supabase dashboard
4. Test function locally for debugging
5. Verify all setup steps were completed correctly

## 🚀 Deployment Checklist

- [ ] Supabase CLI installed and logged in
- [ ] Edge Function deployed successfully
- [ ] Database schema applied (contact_messages table)
- [ ] RLS policies configured correctly
- [ ] Environment variables set
- [ ] Contact form updated to use Edge Function
- [ ] Email service configured (optional)
- [ ] Function tested locally and in production
- [ ] Error handling implemented
- [ ] Monitoring set up
