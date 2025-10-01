// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2'

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data?: { id: string };
  error?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
  'Connection': 'keep-alive'
}

console.info('Contact handler server started');

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { method } = req

    switch (method) {
      case 'POST':
        return await handleContactSubmission(req, supabaseClient)
      case 'GET':
        return await handleGetMessages(req, supabaseClient)
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { 
            status: 405, 
            headers: corsHeaders 
          }
        )
    }
  } catch (error) {
    console.error('Error in contact handler:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    )
  }
})

async function handleContactSubmission(req: Request, supabaseClient: any): Promise<Response> {
  try {
    const { name, email, subject, message }: ContactPayload = await req.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      const response: ContactResponse = {
        success: false,
        message: 'All fields are required',
        error: 'MISSING_FIELDS'
      }
      return new Response(
        JSON.stringify(response),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const response: ContactResponse = {
        success: false,
        message: 'Please enter a valid email address',
        error: 'INVALID_EMAIL'
      }
      return new Response(
        JSON.stringify(response),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      )
    }

    // Insert contact message
    const { data, error } = await supabaseClient
      .from('contact_messages')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'new'
      })
      .select('id')
      .single()

    if (error) {
      console.error('Database error:', error)
      const response: ContactResponse = {
        success: false,
        message: 'Failed to submit your message. Please try again.',
        error: error.code || 'DATABASE_ERROR'
      }
      return new Response(
        JSON.stringify(response),
        { 
          status: 500, 
          headers: corsHeaders 
        }
      )
    }

    // Send email notifications (optional)
    await sendEmailNotifications({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      id: data.id
    })

    const response: ContactResponse = {
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      data: { id: data.id }
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 201, 
        headers: corsHeaders 
      }
    )
  } catch (error) {
    console.error('Error handling contact submission:', error)
    const response: ContactResponse = {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      error: 'UNEXPECTED_ERROR'
    }
    return new Response(
      JSON.stringify(response),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    )
  }
}

async function handleGetMessages(req: Request, supabaseClient: any): Promise<Response> {
  try {
    // Check for authentication token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      const response: ContactResponse = {
        success: false,
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      }
      return new Response(
        JSON.stringify(response),
        { 
          status: 401, 
          headers: corsHeaders 
        }
      )
    }

    // Get query parameters
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const status = url.searchParams.get('status')

    // Build query
    let query = supabaseClient
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      const response: ContactResponse = {
        success: false,
        message: 'Failed to fetch contact messages',
        error: error.code || 'DATABASE_ERROR'
      }
      return new Response(
        JSON.stringify(response),
        { 
          status: 500, 
          headers: corsHeaders 
        }
      )
    }

    const response: ContactResponse = {
      success: true,
      message: 'Contact messages fetched successfully',
      data: data || []
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: corsHeaders 
      }
    )
  } catch (error) {
    console.error('Error fetching messages:', error)
    const response: ContactResponse = {
      success: false,
      message: 'An unexpected error occurred while fetching messages.',
      error: 'UNEXPECTED_ERROR'
    }
    return new Response(
      JSON.stringify(response),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    )
  }
}

async function sendEmailNotifications(contactData: any) {
  try {
    // This is a placeholder for email sending
    // In production, you would integrate with an email service like Resend, SendGrid, etc.
    
    console.log('📧 Email notification would be sent:', {
      to: 'admin@aromeluxe.in',
      subject: `New Contact Message: ${contactData.subject}`,
      body: `
New Contact Message Received

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}
Message ID: ${contactData.id}

Message:
${contactData.message}

---
Received: ${new Date().toISOString()}
      `.trim()
    })

    // Example with Resend (uncomment and configure if using Resend)
    /*
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    
    await resend.emails.send({
      from: 'Aromé Luxe <noreply@aromeluxe.in>',
      to: ['admin@aromeluxe.in'],
      subject: `New Contact Message: ${contactData.subject}`,
      html: `
        <h2>New Contact Message Received</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Message ID: ${contactData.id}</small></p>
        <p><small>Received: ${new Date().toISOString()}</small></p>
      `
    })
    */

    return { success: true }
  } catch (error) {
    console.error('Error sending email notification:', error)
    // Don't fail the main operation if email fails
    return { success: false, error: error.message }
  }
}
