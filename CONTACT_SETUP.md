# Contact Form Setup with Supabase

This guide explains how to set up the contact form functionality with Supabase database integration.

## 🚀 Quick Setup

### 1. Create the Database Table

Run the SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-contact-table.sql
-- This will create the contact_messages table with proper indexes and security policies
```

### 2. Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test the Contact Form

1. Navigate to `/contact` on your website
2. Fill out the contact form
3. Submit the form
4. Check your Supabase dashboard to see the message in the `contact_messages` table

## 📋 Features Implemented

### ✅ Contact Form Features
- **Form Validation**: Client-side validation for required fields and email format
- **Loading States**: Visual feedback during form submission
- **Success/Error Messages**: Clear feedback to users
- **Toast Notifications**: Non-intrusive success/error notifications
- **Form Reset**: Automatic form clearing after successful submission

### ✅ Database Features
- **Secure Storage**: Messages stored in Supabase with proper security policies
- **Status Tracking**: Messages can be marked as new, read, replied, or closed
- **Timestamps**: Automatic creation and update timestamps
- **Indexes**: Optimized database performance with proper indexes

### ✅ Admin Features (Optional)
- **Message Management**: View all contact messages
- **Status Updates**: Change message status (new → read → replied → closed)
- **Responsive Design**: Works on all device sizes

## 🛠️ Technical Implementation

### Contact Service (`src/lib/contact-service.ts`)
- `submitContactMessage()`: Handles form submission with validation
- `getContactMessages()`: Retrieves all messages (admin use)
- `updateMessageStatus()`: Updates message status (admin use)

### Contact Form (`src/app/contact/page.tsx`)
- Real-time form validation
- Loading states and error handling
- Success/error message display
- Toast notifications

### Database Schema
```sql
contact_messages:
- id (UUID, Primary Key)
- name (VARCHAR, Required)
- email (VARCHAR, Required)
- subject (VARCHAR, Required)
- message (TEXT, Required)
- status (ENUM: new, read, replied, closed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔒 Security Features

### Row Level Security (RLS)
- **Public Insert**: Anyone can submit contact messages
- **Authenticated Read/Update**: Only authenticated users can view/update messages
- **Proper Permissions**: Granular access control

### Data Validation
- **Client-side**: Immediate feedback for user experience
- **Server-side**: Supabase enforces data integrity
- **Email Validation**: Proper email format checking

## 📊 Admin Dashboard Usage

To use the admin contact messages component:

1. Create an admin page (e.g., `/admin/contact-messages`)
2. Import and use the `ContactMessages` component
3. Ensure the user is authenticated (use `ProtectedRoute`)

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

## 🎨 Customization

### Styling
- Uses your existing design system (luxe-blue, luxe-cream colors)
- Responsive design with Tailwind CSS
- Consistent with your brand aesthetic

### Form Fields
- Easy to add/remove form fields
- Update the `ContactMessage` interface in `contact-service.ts`
- Modify the form in `contact/page.tsx`

### Email Notifications (Future Enhancement)
You can add email notifications by:
1. Setting up Supabase Edge Functions
2. Using a service like Resend or SendGrid
3. Triggering emails on new message insertion

## 🐛 Troubleshooting

### Common Issues

1. **"new row violates row-level security policy" (Error 42501)**
   - **Solution**: Run the fixed SQL script `supabase-contact-table-fixed.sql`
   - **Cause**: RLS policy is too restrictive for anonymous users
   - **Fix**: Update the INSERT policy to allow anonymous users

2. **"Failed to submit message"**
   - Check Supabase credentials in `.env.local`
   - Verify the `contact_messages` table exists
   - Check RLS policies are correctly set

3. **Form not submitting**
   - Check browser console for errors
   - Verify all required fields are filled
   - Check network connectivity

4. **Messages not appearing in admin**
   - Ensure user is authenticated
   - Check RLS policies allow authenticated users to read
   - Verify the admin component is properly imported

### Debug Steps
1. Check Supabase dashboard for table creation
2. Verify environment variables
3. Test with browser developer tools
4. Check Supabase logs for any errors

## 📈 Future Enhancements

- **Email Notifications**: Auto-send emails to admin on new messages
- **Message Categories**: Filter messages by subject/category
- **Search Functionality**: Search through messages
- **Export Feature**: Export messages to CSV/PDF
- **Auto-reply**: Send automatic confirmation emails to users
- **Message Threading**: Group related messages together

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check browser console for error messages
4. Verify all setup steps were completed correctly
