import { ContactMessage, ContactMessageRow } from './contact-service'

// Edge Function service for contact form submissions
export class ContactEdgeService {
  private static getEdgeFunctionUrl(): string {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
    }
    
    // Extract project reference from Supabase URL
    const projectRef = supabaseUrl.split('//')[1].split('.')[0]
    return `https://${projectRef}.supabase.co/functions/v1/contact-handler`
  }

  /**
   * Submit a contact message via Edge Function
   * @param message - The contact message data
   * @returns Promise with success status and message
   */
  static async submitContactMessage(message: ContactMessage): Promise<{
    success: boolean
    message: string
    data?: { id: string }
    error?: string
  }> {
    try {
      const edgeFunctionUrl = this.getEdgeFunctionUrl()
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to submit your message',
          error: result.error || 'NETWORK_ERROR'
        }
      }

      return {
        success: true,
        message: result.message || 'Thank you for your message!',
        data: result.data
      }
    } catch (error) {
      console.error('Error submitting contact message via Edge Function:', error)
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        error: 'UNEXPECTED_ERROR'
      }
    }
  }

  /**
   * Get contact messages via Edge Function (admin use)
   * @param limit - Maximum number of messages to fetch
   * @param offset - Number of messages to skip
   * @param status - Filter by status
   * @returns Promise with contact messages array
   */
  static async getContactMessages(
    limit: number = 50,
    offset: number = 0,
    status?: 'new' | 'read' | 'replied' | 'closed'
  ): Promise<{
    success: boolean
    message: string
    data?: ContactMessageRow[]
    error?: string
  }> {
    try {
      const edgeFunctionUrl = this.getEdgeFunctionUrl()
      
      // Build query parameters
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      })
      
      if (status) {
        params.append('status', status)
      }

      const response = await fetch(`${edgeFunctionUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
          // 'Authorization': `Bearer ${token}`
        },
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to fetch contact messages',
          error: result.error || 'NETWORK_ERROR'
        }
      }

      return {
        success: true,
        message: result.message || 'Contact messages fetched successfully',
        data: result.data || []
      }
    } catch (error) {
      console.error('Error fetching contact messages via Edge Function:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while fetching messages.',
        error: 'UNEXPECTED_ERROR'
      }
    }
  }
}
