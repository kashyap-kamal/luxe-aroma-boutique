#!/bin/bash

# Deploy Supabase Edge Function for Contact Handler
# Make sure you have the Supabase CLI installed and are logged in

echo "🚀 Deploying Contact Handler Edge Function..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Please login to Supabase CLI first:"
    echo "supabase login"
    exit 1
fi

# Deploy the function
echo "📦 Deploying contact-handler function..."
supabase functions deploy contact-handler

if [ $? -eq 0 ]; then
    echo "✅ Contact Handler Edge Function deployed successfully!"
    echo ""
    echo "🔗 Function URL: https://your-project-ref.supabase.co/functions/v1/contact-handler"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your contact form to use the Edge Function URL"
    echo "2. Set up environment variables for email service (optional)"
    echo "3. Test the contact form submission"
    echo ""
    echo "🔧 To test locally:"
    echo "supabase functions serve contact-handler"
else
    echo "❌ Failed to deploy Edge Function"
    exit 1
fi
