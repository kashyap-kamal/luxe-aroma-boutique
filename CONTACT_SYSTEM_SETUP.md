# Contact System Setup Guide

This guide explains how to set up the enhanced contact system with proper Supabase integration, server-side validation, and admin management.

## 🚀 Quick Setup

### 1. Database Setup

Run the SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-contact-schema.sql
-- This creates the contact_messages table with proper RLS policies
```

**Key Features:**
- ✅ Row Level Security (RLS) enabled
- ✅ Proper indexes for performance
- ✅ Automatic timestamp updates
- ✅ Status tracking (new, read, replied, closed)
- ✅ Secure policies for public insert and admin management

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

## 📋 System Architecture

### Frontend Components
- **Contact Form** (`/contact`): Public-facing contact form with real-time validation
- **Admin Dashboard** (`/admin/contact-messages`): Admin interface for managing messages

### Backend Services
- **Contact Service** (`src/lib/contact-service.ts`): Core business logic for contact operations
- **Email Service** (`src/lib/email-service.ts`): Email notification system
- **API Routes** (`src/app/api/contact/route.ts`): Server-side validation and processing

### Database Schema
```sql
contact_messages:
- id (UUID, Primary Key)
- name (VARCHAR(255), Required)
- email (VARCHAR(255), Required)
- subject (VARCHAR(500), Required)
- message (TEXT, Required)
- status (ENUM: new, read, replied, closed)
- created_at (TIMESTAMP WITH TIME ZONE)
- updated_at (TIMESTAMP WITH TIME ZONE)
```

## 🔒 Security Features

### Row Level Security (RLS)
- **Public Insert**: Anyone can submit contact messages
- **Authenticated Read/Update/Delete**: Only authenticated users can manage messages
- **Granular Permissions**: Proper access control for different operations

### Data Validation
- **Client-side**: Immediate feedback for user experience
- **Server-side**: Supabase enforces data integrity
- **API Route**: Additional server-side validation
- **Email Validation**: Proper email format checking
- **Length Limits**: Prevents database overflow

## 🛠️ Technical Implementation

### Contact Service Methods
- `submitContactMessage()`: Handles form submission with validation
- `getContactMessages()`: Retrieves messages with pagination and filtering
- `getContactMessageById()`: Fetches single message details
- `updateMessageStatus()`: Updates message status
- `deleteContactMessage()`: Removes messages
- `getContactMessageStats()`: Provides dashboard statistics

### API Endpoints
- `POST /api/contact`: Submit new contact message
- `GET /api/contact`: Retrieve messages (admin only)

### Error Handling
- Comprehensive error codes and messages
- Graceful fallbacks for email failures
- User-friendly error messages
- Detailed logging for debugging

## 📊 Admin Dashboard Usage

### Setting Up Admin Access
1. Create an admin page (e.g., `/admin/contact-messages`)
2. Import and use the `ContactMessages` component
3. Ensure the user is authenticated

```tsx
import { ContactMessages } from "@/components/admin/contact-messages";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminContactPage() {
  return (
    <ProtectedRoute>
      <ContactMessages />
    </ProtectedRoute>
  );
}
```

### Admin Features
- **Message Statistics**: Total, new, read, replied, closed counts
- **Status Management**: Update message status with dropdown
- **Message Viewing**: Full message details in modal
- **Filtering**: Filter by status
- **Pagination**: Handle large numbers of messages
- **Message Deletion**: Remove unwanted messages

## 📧 Email Notifications

### Current Implementation
- **Placeholder Service**: Logs email content to console
- **Non-blocking**: Email failures don't break form submission
- **Dual Notifications**: Admin notification + customer confirmation

### Production Setup
To enable actual email sending:

1. **Choose Email Service**: Resend, SendGrid, or Nodemailer
2. **Update Email Service**: Modify `src/lib/email-service.ts`
3. **Add Environment Variables**: API keys and configuration
4. **Test Email Delivery**: Verify both admin and customer emails

### Example with Resend
```typescript
// Uncomment and configure the Resend implementation in email-service.ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
```

## 🎨 Customization

### Styling
- Uses your existing design system (luxe-blue, luxe-cream colors)
- Responsive design with Tailwind CSS
- Consistent with your brand aesthetic
- Modern UI components from shadcn/ui

### Form Fields
- Easy to add/remove form fields
- Update the `ContactMessage` interface
- Modify validation rules
- Update database schema if needed

### Email Templates
- Customize email content in `EmailService`
- Add your branding and styling
- Modify notification triggers

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
   - Verify API route is accessible

3. **Form not submitting**
   - Check browser console for errors
   - Verify all required fields are filled
   - Check network connectivity
   - Verify API route is working

4. **Messages not appearing in admin**
   - Ensure user is authenticated
   - Check RLS policies allow authenticated users to read
   - Verify the admin component is properly imported
   - Check Supabase auth configuration

5. **Email notifications not working**
   - Check email service configuration
   - Verify environment variables
   - Check console logs for email errors
   - Test email service independently

### Debug Steps
1. Check Supabase dashboard for table creation
2. Verify environment variables
3. Test with browser developer tools
4. Check Supabase logs for any errors
5. Test API routes directly
6. Verify authentication flow

## 📈 Future Enhancements

### Planned Features
- **Email Integration**: Full email service integration
- **Message Categories**: Filter messages by subject/category
- **Search Functionality**: Search through messages
- **Export Feature**: Export messages to CSV/PDF
- **Auto-reply**: Send automatic confirmation emails
- **Message Threading**: Group related messages together
- **File Attachments**: Allow file uploads in contact form
- **Response Tracking**: Track admin responses to messages

### Performance Optimizations
- **Caching**: Implement Redis caching for frequently accessed data
- **Pagination**: Optimize large dataset handling
- **Real-time Updates**: WebSocket integration for live updates
- **Background Processing**: Queue email sending for better performance

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check browser console for error messages
4. Verify all setup steps were completed correctly
5. Test each component independently

## 🔄 Migration from Old System

If you're upgrading from the previous contact system:

1. **Backup Data**: Export existing contact messages
2. **Run New Schema**: Execute the new SQL schema
3. **Update Imports**: Fix any import references
4. **Test Functionality**: Verify all features work
5. **Update Admin**: Deploy new admin interface

The new system is backward compatible and will work alongside existing data.
