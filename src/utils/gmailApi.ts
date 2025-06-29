/**
 * @fileoverview Gmail API utilities for Email Radar
 * @description Handles Gmail API interactions for fetching, updating, and sending emails
 */

import { google } from 'googleapis'

/**
 * @description Gmail message interface
 */
export interface GmailMessage {
  id: string
  threadId: string
  subject?: string
  body: string
  isDraft: boolean
  snippet: string
  labelIds: string[]
}

/**
 * @description Gmail API client configuration
 */
const gmail = google.gmail('v1')

/**
 * @description Create OAuth2 client with user tokens
 * @param {string} accessToken - User's Gmail access token
 * @param {string} refreshToken - User's Gmail refresh token
 * @returns {google.auth.OAuth2} Configured OAuth2 client
 */
function createOAuth2Client(accessToken: string, refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  return oauth2Client
}

/**
 * @description Fetch user's Gmail messages
 * @param {string} accessToken - User's Gmail access token
 * @param {string} refreshToken - User's Gmail refresh token
 * @param {number} maxResults - Maximum number of messages to return
 * @param {string} query - Gmail search query (e.g., 'in:drafts')
 * @returns {Promise<GmailMessage[]>} Array of Gmail messages
 */
export async function fetchGmailMessages(
  accessToken: string,
  refreshToken: string,
  maxResults: number = 20,
  query: string = 'in:drafts OR in:sent'
): Promise<GmailMessage[]> {
  try {
    const auth = createOAuth2Client(accessToken, refreshToken)
    
    // List messages
    const response = await gmail.users.messages.list({
      auth,
      userId: 'me',
      maxResults,
      q: query,
    })

    const messages = response.data.messages || []
    
    // Fetch full message data for each message
    const fullMessages = await Promise.all(
      messages.map(async (message) => {
        const fullMessage = await gmail.users.messages.get({
          auth,
          userId: 'me',
          id: message.id!,
          format: 'full',
        })

        const payload = fullMessage.data.payload
        const headers = payload?.headers || []
        
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject'
        const body = extractMessageBody(payload)
        const isDraft = fullMessage.data.labelIds?.includes('DRAFT') || false

        return {
          id: fullMessage.data.id!,
          threadId: fullMessage.data.threadId!,
          subject,
          body,
          isDraft,
          snippet: fullMessage.data.snippet || '',
          labelIds: fullMessage.data.labelIds || [],
        }
      })
    )

    return fullMessages
  } catch (error) {
    console.error('Error fetching Gmail messages:', error)
    throw new Error('Failed to fetch Gmail messages')
  }
}

/**
 * @description Extract message body from Gmail payload
 * @param {any} payload - Gmail message payload
 * @returns {string} Extracted message body
 */
function extractMessageBody(payload: any): string {
  let body = ''

  if (payload.body?.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8')
  } else if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8')
        break
      } else if (part.mimeType === 'text/html' && part.body?.data) {
        const htmlBody = Buffer.from(part.body.data, 'base64').toString('utf-8')
        // Basic HTML to text conversion (you might want to use a proper library)
        body = htmlBody.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      }
    }
  }

  return body
}

/**
 * @description Update a Gmail draft
 * @param {string} accessToken - User's Gmail access token
 * @param {string} refreshToken - User's Gmail refresh token
 * @param {string} messageId - Gmail message ID
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {Promise<void>}
 */
export async function updateGmailDraft(
  accessToken: string,
  refreshToken: string,
  messageId: string,
  subject: string,
  body: string
): Promise<void> {
  try {
    const auth = createOAuth2Client(accessToken, refreshToken)

    // Create email content
    const email = [
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ].join('\n')

    const encodedEmail = Buffer.from(email).toString('base64url')

    await gmail.users.drafts.update({
      auth,
      userId: 'me',
      id: messageId,
      requestBody: {
        message: {
          raw: encodedEmail,
        },
      },
    })
  } catch (error) {
    console.error('Error updating Gmail draft:', error)
    throw new Error('Failed to update Gmail draft')
  }
}

/**
 * @description Send a Gmail message
 * @param {string} accessToken - User's Gmail access token
 * @param {string} refreshToken - User's Gmail refresh token
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {Promise<void>}
 */
export async function sendGmailMessage(
  accessToken: string,
  refreshToken: string,
  to: string,
  subject: string,
  body: string
): Promise<void> {
  try {
    const auth = createOAuth2Client(accessToken, refreshToken)

    // Create email content
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ].join('\n')

    const encodedEmail = Buffer.from(email).toString('base64url')

    await gmail.users.messages.send({
      auth,
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    })
  } catch (error) {
    console.error('Error sending Gmail message:', error)
    throw new Error('Failed to send Gmail message')
  }
}

/**
 * @description Create a new Gmail draft
 * @param {string} accessToken - User's Gmail access token
 * @param {string} refreshToken - User's Gmail refresh token
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {Promise<string>} Created draft ID
 */
export async function createGmailDraft(
  accessToken: string,
  refreshToken: string,
  to: string,
  subject: string,
  body: string
): Promise<string> {
  try {
    const auth = createOAuth2Client(accessToken, refreshToken)

    // Create email content
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ].join('\n')

    const encodedEmail = Buffer.from(email).toString('base64url')

    const response = await gmail.users.drafts.create({
      auth,
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedEmail,
        },
      },
    })

    return response.data.id!
  } catch (error) {
    console.error('Error creating Gmail draft:', error)
    throw new Error('Failed to create Gmail draft')
  }
} 