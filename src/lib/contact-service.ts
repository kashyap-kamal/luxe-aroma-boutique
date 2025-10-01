import { supabase } from './supabase'
import { Database } from './supabase'
import { EmailService } from './email-service'

// Contact message interface for form submission
export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

// Contact message interface for database operations
export type ContactMessageRow = Database['public']['Tables']['contact_messages']['Row']

// Contact message insert interface
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert']

// Contact message update interface
export type ContactMessageUpdate = Database['public']['Tables']['contact_messages']['Update']

// Response interface for service methods
export interface ServiceResponse<T = ContactMessageRow> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Contact service for handling contact form submissions
export class ContactService {
  /**
   * Submit a contact message to Supabase
   * @param message - The contact message data
   * @returns Promise with success status and message
   */
  static async submitContactMessage(message: ContactMessage): Promise<ServiceResponse<{ id: string }>> {
    try {
      // Validate required fields
      const validationError = this.validateContactMessage(message)
      if (validationError) {
        return {
          success: false,
          message: validationError,
          error: 'VALIDATION_ERROR'
        }
      }

      // Prepare data for insertion
      const insertData: ContactMessageInsert = {
        name: message.name.trim(),
        email: message.email.trim().toLowerCase(),
        subject: message.subject.trim(),
        message: message.message.trim(),
        status: 'new'
      }

      // Insert the contact message into Supabase
      const { data, error } = await supabase
        .from('contact_messages')
        .insert(insertData)
        .select('id')
        .single()

      if (error) {
        console.error('Error submitting contact message:', error)
        
        // Handle specific Supabase errors
        const errorResponse = this.handleSupabaseError(error)
        return {
          success: false,
          message: errorResponse.message,
          error: errorResponse.code
        }
      }

      // Send email notifications (non-blocking)
      this.sendEmailNotifications(message, data.id).catch(error => {
        console.error('Error sending email notifications:', error)
        // Don't fail the main operation if email fails
      })

      return {
        success: true,
        message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
        data: { id: data.id }
      }
    } catch (error) {
      console.error('Unexpected error submitting contact message:', error)
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        error: 'UNEXPECTED_ERROR'
      }
    }
  }

  /**
   * Validate contact message data
   * @param message - The contact message to validate
   * @returns Error message if validation fails, null if valid
   */
  private static validateContactMessage(message: ContactMessage): string | null {
    // Check required fields
    if (!message.name?.trim()) {
      return 'Name is required'
    }
    if (!message.email?.trim()) {
      return 'Email is required'
    }
    if (!message.subject?.trim()) {
      return 'Subject is required'
    }
    if (!message.message?.trim()) {
      return 'Message is required'
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(message.email.trim())) {
      return 'Please enter a valid email address'
    }

    // Validate field lengths
    if (message.name.trim().length > 255) {
      return 'Name must be less than 255 characters'
    }
    if (message.email.trim().length > 255) {
      return 'Email must be less than 255 characters'
    }
    if (message.subject.trim().length > 500) {
      return 'Subject must be less than 500 characters'
    }
    if (message.message.trim().length > 5000) {
      return 'Message must be less than 5000 characters'
    }

    return null
  }

  /**
   * Handle Supabase-specific errors
   * @param error - The Supabase error
   * @returns Formatted error response
   */
  private static handleSupabaseError(error: { code: string; message: string }): { message: string; code: string } {
    switch (error.code) {
      case '42501':
        return {
          message: 'Contact form is temporarily unavailable. Please email us directly at contact@aromeluxe.in',
          code: 'RLS_POLICY_ERROR'
        }
      case '23505':
        return {
          message: 'A message with this email already exists. Please wait before submitting another message.',
          code: 'DUPLICATE_ENTRY'
        }
      case '23502':
        return {
          message: 'Required fields are missing. Please check your input.',
          code: 'NOT_NULL_VIOLATION'
        }
      case '23503':
        return {
          message: 'Invalid data provided. Please check your input.',
          code: 'FOREIGN_KEY_VIOLATION'
        }
      case 'PGRST116':
        return {
          message: 'The requested resource was not found.',
          code: 'NOT_FOUND'
        }
      default:
        return {
          message: 'Failed to submit your message. Please try again or email us directly at contact@aromeluxe.in',
          code: 'UNKNOWN_ERROR'
        }
    }
  }

  /**
   * Get all contact messages (for admin use)
   * @param limit - Maximum number of messages to fetch (default: 50)
   * @param offset - Number of messages to skip (default: 0)
   * @param status - Filter by status (optional)
   * @returns Promise with contact messages array
   */
  static async getContactMessages(
    limit: number = 50,
    offset: number = 0,
    status?: 'new' | 'read' | 'replied' | 'closed'
  ): Promise<ServiceResponse<ContactMessageRow[]>> {
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      // Apply status filter if provided
      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching contact messages:', error)
        return {
          success: false,
          message: 'Failed to fetch contact messages',
          error: error.code || 'FETCH_ERROR'
        }
      }

      return {
        success: true,
        message: 'Contact messages fetched successfully',
        data: data || []
      }
    } catch (error) {
      console.error('Unexpected error fetching contact messages:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while fetching messages',
        error: 'UNEXPECTED_ERROR'
      }
    }
  }

  /**
   * Get a single contact message by ID (for admin use)
   * @param id - The message ID
   * @returns Promise with contact message
   */
  static async getContactMessageById(id: string): Promise<ServiceResponse<ContactMessageRow>> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching contact message:', error)
        return {
          success: false,
          message: 'Failed to fetch contact message',
          error: error.code || 'FETCH_ERROR'
        }
      }

      return {
        success: true,
        message: 'Contact message fetched successfully',
        data: data
      }
    } catch (error) {
      console.error('Unexpected error fetching contact message:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while fetching the message',
        error: 'UNEXPECTED_ERROR'
      }
    }
  }

  /**
   * Update contact message status (for admin use)
   * @param id - Message ID
   * @param status - New status
   * @returns Promise with success status
   */
  static async updateMessageStatus(
    id: string, 
    status: 'new' | 'read' | 'replied' | 'closed'
  ): Promise<ServiceResponse<ContactMessageRow>> {
    try {
      // Validate status
      if (!['new', 'read', 'replied', 'closed'].includes(status)) {
        return {
          success: false,
          message: 'Invalid status provided',
          error: 'INVALID_STATUS'
        }
      }

      // Validate ID
      if (!id || typeof id !== 'string') {
        return {
          success: false,
          message: 'Invalid message ID provided',
          error: 'INVALID_ID'
        }
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating message status:', error)
        const errorResponse = this.handleSupabaseError(error)
        return {
          success: false,
          message: errorResponse.message,
          error: errorResponse.code
        }
      }

      return {
        success: true,
        message: 'Message status updated successfully',
        data: data
      }
    } catch (error) {
      console.error('Unexpected error updating message status:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while updating the message',
        error: 'UNEXPECTED_ERROR'
      }
    }
  }

  /**
   * Delete a contact message (for admin use)
   * @param id - Message ID
   * @returns Promise with success status
   */
  static async deleteContactMessage(id: string): Promise<ServiceResponse> {
    try {
      // Validate ID
      if (!id || typeof id !== 'string') {
        return {
          success: false,
          message: 'Invalid message ID provided',
          error: 'INVALID_ID'
        }
      }

      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting contact message:', error)
        const errorResponse = this.handleSupabaseError(error)
        return {
          success: false,
          message: errorResponse.message,
          error: errorResponse.code
        }
      }

      return {
        success: true,
        message: 'Contact message deleted successfully'
      }
    } catch (error) {
      console.error('Unexpected error deleting contact message:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while deleting the message',
        error: 'UNEXPECTED_ERROR'
      }
    }
  }

  /**
   * Get contact message statistics (for admin dashboard)
   * @returns Promise with statistics
   */
  static async getContactMessageStats(): Promise<ServiceResponse<{
    total: number
    new: number
    read: number
    replied: number
    closed: number
  }>> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('status')

      if (error) {
        console.error('Error fetching contact message stats:', error)
        return {
          success: false,
          message: 'Failed to fetch contact message statistics',
          error: error.code || 'FETCH_ERROR'
        }
      }

      const stats = {
        total: data.length,
        new: data.filter(msg => msg.status === 'new').length,
        read: data.filter(msg => msg.status === 'read').length,
        replied: data.filter(msg => msg.status === 'replied').length,
        closed: data.filter(msg => msg.status === 'closed').length
      }

      return {
        success: true,
        message: 'Contact message statistics fetched successfully',
        data: stats
      }
    } catch (error) {
      console.error('Unexpected error fetching contact message stats:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while fetching statistics',
        error: 'UNEXPECTED_ERROR'
      }
    }
  }

  /**
   * Send email notifications for new contact message
   * @param message - The contact message
   * @param messageId - The message ID
   * @returns Promise with success status
   */
  private static async sendEmailNotifications(
    message: ContactMessage, 
    messageId: string
  ): Promise<void> {
    try {
      // Send notification to admin
      await EmailService.sendContactNotification({
        ...message,
        id: messageId
      })

      // Send confirmation to customer
      await EmailService.sendCustomerConfirmation(message)
    } catch (error) {
      console.error('Error in email notifications:', error)
      // Don't throw - email failures shouldn't break the main flow
    }
  }
}
