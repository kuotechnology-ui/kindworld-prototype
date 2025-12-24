import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { 
  VerificationNotification, 
  NotificationType
} from '../types/verification'

// Email template types
export interface EmailTemplate {
  subject: string
  htmlBody: string
  textBody: string
}

export interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  inAppNotifications: boolean
  verificationUpdates: boolean
  systemAnnouncements: boolean
  updatedAt: Date
}

export interface NotificationQueue {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  emailTemplate?: EmailTemplate
  retryCount: number
  maxRetries: number
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  scheduledAt: Date
  sentAt?: Date
  failureReason?: string
  metadata?: Record<string, any>
}

export class NotificationService {
  private static readonly NOTIFICATIONS = 'verification_notifications'
  private static readonly NOTIFICATION_QUEUE = 'notification_queue'
  private static readonly NOTIFICATION_PREFERENCES = 'notification_preferences'
  private static readonly USERS = 'users'

  // Email templates for different notification types
  private static readonly EMAIL_TEMPLATES: Record<NotificationType, EmailTemplate> = {
    verification_approved: {
      subject: 'NGO Verification Approved - Welcome to KindWorld!',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">Congratulations! Your NGO has been verified</h2>
          <p>Dear {{organizationName}} team,</p>
          <p>We're excited to inform you that your NGO verification request has been <strong>approved</strong>!</p>
          <p>You now have full access to all KindWorld features, including:</p>
          <ul>
            <li>Creating and managing volunteer opportunities</li>
            <li>Accessing NGO dashboard and analytics</li>
            <li>Managing volunteer applications</li>
            <li>Connecting with volunteers in your community</li>
          </ul>
          <div style="margin: 30px 0; text-align: center;">
            <a href="{{dashboardUrl}}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          <p>Thank you for joining our mission to make the world a kinder place!</p>
          <p>Best regards,<br>The KindWorld Team</p>
        </div>
      `,
      textBody: `
Congratulations! Your NGO has been verified

Dear {{organizationName}} team,

We're excited to inform you that your NGO verification request has been approved!

You now have full access to all KindWorld features, including:
- Creating and managing volunteer opportunities
- Accessing NGO dashboard and analytics
- Managing volunteer applications
- Connecting with volunteers in your community

Visit your dashboard: {{dashboardUrl}}

Thank you for joining our mission to make the world a kinder place!

Best regards,
The KindWorld Team
      `
    },
    verification_rejected: {
      subject: 'NGO Verification Update - Additional Information Required',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EF4444;">Verification Update Required</h2>
          <p>Dear {{organizationName}} team,</p>
          <p>Thank you for your interest in joining KindWorld as a verified NGO.</p>
          <p>After reviewing your verification request, we need additional information before we can approve your account:</p>
          <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px; margin: 20px 0;">
            <p><strong>Reason:</strong> {{rejectionReason}}</p>
          </div>
          <p>Please review the requirements and submit a new verification request with the necessary documentation.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="{{verificationUrl}}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Submit New Request
            </a>
          </div>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The KindWorld Team</p>
        </div>
      `,
      textBody: `
Verification Update Required

Dear {{organizationName}} team,

Thank you for your interest in joining KindWorld as a verified NGO.

After reviewing your verification request, we need additional information before we can approve your account:

Reason: {{rejectionReason}}

Please review the requirements and submit a new verification request with the necessary documentation.

Submit a new request: {{verificationUrl}}

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The KindWorld Team
      `
    },
    verification_pending: {
      subject: 'NGO Verification Request Received',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Verification Request Received</h2>
          <p>Dear {{organizationName}} team,</p>
          <p>We have successfully received your NGO verification request!</p>
          <p><strong>What happens next:</strong></p>
          <ol>
            <li>Our team will review your submitted documents</li>
            <li>We may contact you if additional information is needed</li>
            <li>You'll receive an email notification once the review is complete</li>
          </ol>
          <p><strong>Review Timeline:</strong> Most verification requests are processed within 3-5 business days.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="{{statusUrl}}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Check Status
            </a>
          </div>
          <p>Thank you for your patience!</p>
          <p>Best regards,<br>The KindWorld Team</p>
        </div>
      `,
      textBody: `
Verification Request Received

Dear {{organizationName}} team,

We have successfully received your NGO verification request!

What happens next:
1. Our team will review your submitted documents
2. We may contact you if additional information is needed
3. You'll receive an email notification once the review is complete

Review Timeline: Most verification requests are processed within 3-5 business days.

Check your status: {{statusUrl}}

Thank you for your patience!

Best regards,
The KindWorld Team
      `
    },
    verification_documents_required: {
      subject: 'Additional Documents Required for NGO Verification',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F59E0B;">Additional Documents Required</h2>
          <p>Dear {{organizationName}} team,</p>
          <p>We're currently reviewing your NGO verification request and need additional documentation to complete the process.</p>
          <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px; margin: 20px 0;">
            <p><strong>Required Documents:</strong></p>
            <p>{{requiredDocuments}}</p>
          </div>
          <p>Please upload the requested documents to continue with your verification.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="{{uploadUrl}}" style="background-color: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Upload Documents
            </a>
          </div>
          <p>If you have any questions about the required documents, please contact our support team.</p>
          <p>Best regards,<br>The KindWorld Team</p>
        </div>
      `,
      textBody: `
Additional Documents Required

Dear {{organizationName}} team,

We're currently reviewing your NGO verification request and need additional documentation to complete the process.

Required Documents:
{{requiredDocuments}}

Please upload the requested documents to continue with your verification.

Upload documents: {{uploadUrl}}

If you have any questions about the required documents, please contact our support team.

Best regards,
The KindWorld Team
      `
    }
  }

  /**
   * Create an in-app notification
   */
  static async createInAppNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    verificationRequestId?: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; notificationId?: string; error?: string }> {
    try {
      const notification: Omit<VerificationNotification, 'id'> = {
        userId,
        type,
        title,
        message,
        read: false,
        createdAt: new Date(),
        verificationRequestId,
        metadata
      }

      const docRef = await addDoc(collection(db, this.NOTIFICATIONS), {
        ...notification,
        createdAt: serverTimestamp()
      })

      return {
        success: true,
        notificationId: docRef.id
      }
    } catch (error) {
      console.error('Error creating in-app notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create notification'
      }
    }
  }

  /**
   * Queue an email notification for delivery
   */
  static async queueEmailNotification(
    userId: string,
    type: NotificationType,
    templateData: Record<string, string>,
    verificationRequestId?: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; queueId?: string; error?: string }> {
    try {
      const template = this.EMAIL_TEMPLATES[type]
      if (!template) {
        return {
          success: false,
          error: `No email template found for notification type: ${type}`
        }
      }

      // Process template with data
      const processedTemplate = this.processEmailTemplate(template, templateData)

      const queueItem: Omit<NotificationQueue, 'id'> = {
        userId,
        type,
        title: processedTemplate.subject,
        message: processedTemplate.textBody,
        emailTemplate: processedTemplate,
        retryCount: 0,
        maxRetries: 3,
        status: 'pending',
        scheduledAt: new Date(),
        metadata: {
          ...metadata,
          verificationRequestId,
          templateData
        }
      }

      const docRef = await addDoc(collection(db, this.NOTIFICATION_QUEUE), {
        ...queueItem,
        scheduledAt: serverTimestamp()
      })

      return {
        success: true,
        queueId: docRef.id
      }
    } catch (error) {
      console.error('Error queuing email notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to queue email notification'
      }
    }
  }

  /**
   * Send both in-app and email notifications
   */
  static async sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    templateData?: Record<string, string>,
    verificationRequestId?: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; inAppId?: string; queueId?: string; error?: string }> {
    try {
      // Check user preferences
      const preferences = await this.getUserPreferences(userId)
      
      const results: {
        inAppId?: string
        queueId?: string
        errors: string[]
      } = { errors: [] }

      // Send in-app notification if enabled
      if (preferences.inAppNotifications) {
        const inAppResult = await this.createInAppNotification(
          userId,
          type,
          title,
          message,
          verificationRequestId,
          metadata
        )
        
        if (inAppResult.success) {
          results.inAppId = inAppResult.notificationId
        } else {
          results.errors.push(`In-app notification failed: ${inAppResult.error}`)
        }
      }

      // Send email notification if enabled and template data provided
      if (preferences.emailNotifications && templateData) {
        const emailResult = await this.queueEmailNotification(
          userId,
          type,
          templateData,
          verificationRequestId,
          metadata
        )
        
        if (emailResult.success) {
          results.queueId = emailResult.queueId
        } else {
          results.errors.push(`Email notification failed: ${emailResult.error}`)
        }
      }

      return {
        success: results.errors.length === 0 || results.inAppId !== undefined || results.queueId !== undefined,
        inAppId: results.inAppId,
        queueId: results.queueId,
        error: results.errors.length > 0 ? results.errors.join('; ') : undefined
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send notification'
      }
    }
  }

  /**
   * Get user notifications with pagination
   */
  static async getUserNotifications(
    userId: string,
    limitCount: number = 20,
    unreadOnly: boolean = false
  ): Promise<VerificationNotification[]> {
    try {
      let q = query(
        collection(db, this.NOTIFICATIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      if (unreadOnly) {
        q = query(
          collection(db, this.NOTIFICATIONS),
          where('userId', '==', userId),
          where('read', '==', false),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        )
      }

      const querySnapshot = await getDocs(q)
      const notifications: VerificationNotification[] = []

      querySnapshot.forEach(doc => {
        const data = doc.data()
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as VerificationNotification)
      })

      return notifications
    } catch (error) {
      console.error('Error getting user notifications:', error)
      return []
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.NOTIFICATIONS),
        where('userId', '==', userId),
        where('read', '==', false)
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.size
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, this.NOTIFICATIONS, notificationId), {
        read: true
      })
      return true
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.NOTIFICATIONS),
        where('userId', '==', userId),
        where('read', '==', false)
      )

      const querySnapshot = await getDocs(q)
      const updatePromises = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      )

      await Promise.all(updatePromises)
      return true
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return false
    }
  }

  /**
   * Subscribe to real-time notifications for a user
   */
  static subscribeToNotifications(
    userId: string,
    callback: (notifications: VerificationNotification[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, this.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    return onSnapshot(q, (querySnapshot) => {
      const notifications: VerificationNotification[] = []
      
      querySnapshot.forEach(doc => {
        const data = doc.data()
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as VerificationNotification)
      })

      callback(notifications)
    }, (error) => {
      console.error('Error in notification subscription:', error)
      callback([])
    })
  }

  /**
   * Get user notification preferences
   */
  static async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const q = query(
        collection(db, this.NOTIFICATION_PREFERENCES),
        where('userId', '==', userId),
        limit(1)
      )

      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        return {
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as NotificationPreferences
      }

      // Return default preferences if none exist
      return {
        userId,
        emailNotifications: true,
        inAppNotifications: true,
        verificationUpdates: true,
        systemAnnouncements: true,
        updatedAt: new Date()
      }
    } catch (error) {
      console.error('Error getting user preferences:', error)
      // Return default preferences on error
      return {
        userId,
        emailNotifications: true,
        inAppNotifications: true,
        verificationUpdates: true,
        systemAnnouncements: true,
        updatedAt: new Date()
      }
    }
  }

  /**
   * Update user notification preferences
   */
  static async updateUserPreferences(
    userId: string,
    preferences: Partial<Omit<NotificationPreferences, 'userId' | 'updatedAt'>>
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.NOTIFICATION_PREFERENCES),
        where('userId', '==', userId),
        limit(1)
      )

      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        // Update existing preferences
        const docRef = querySnapshot.docs[0].ref
        await updateDoc(docRef, {
          ...preferences,
          updatedAt: serverTimestamp()
        })
      } else {
        // Create new preferences
        await addDoc(collection(db, this.NOTIFICATION_PREFERENCES), {
          userId,
          emailNotifications: true,
          inAppNotifications: true,
          verificationUpdates: true,
          systemAnnouncements: true,
          ...preferences,
          updatedAt: serverTimestamp()
        })
      }

      return true
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return false
    }
  }

  /**
   * Process email template with data
   */
  private static processEmailTemplate(
    template: EmailTemplate,
    data: Record<string, string>
  ): EmailTemplate {
    const processText = (text: string): string => {
      let processed = text
      Object.entries(data).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`
        processed = processed.replace(new RegExp(placeholder, 'g'), value)
      })
      return processed
    }

    return {
      subject: processText(template.subject),
      htmlBody: processText(template.htmlBody),
      textBody: processText(template.textBody)
    }
  }

  /**
   * Process notification queue (for background processing)
   */
  static async processNotificationQueue(): Promise<void> {
    try {
      const q = query(
        collection(db, this.NOTIFICATION_QUEUE),
        where('status', '==', 'pending'),
        orderBy('scheduledAt', 'asc'),
        limit(10)
      )

      const querySnapshot = await getDocs(q)
      
      const processPromises = querySnapshot.docs.map(async (doc) => {
        const queueItem = { id: doc.id, ...doc.data() } as NotificationQueue
        
        try {
          // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
          // For now, we'll just mark as sent
          await updateDoc(doc.ref, {
            status: 'sent',
            sentAt: serverTimestamp()
          })
          
          console.log(`Processed notification queue item: ${queueItem.id}`)
        } catch (error) {
          console.error(`Failed to process queue item ${queueItem.id}:`, error)
          
          const newRetryCount = queueItem.retryCount + 1
          
          if (newRetryCount >= queueItem.maxRetries) {
            // Mark as failed if max retries reached
            await updateDoc(doc.ref, {
              status: 'failed',
              retryCount: newRetryCount,
              failureReason: error instanceof Error ? error.message : 'Unknown error'
            })
          } else {
            // Increment retry count and reschedule
            await updateDoc(doc.ref, {
              retryCount: newRetryCount,
              scheduledAt: serverTimestamp() // Reschedule for immediate retry
            })
          }
        }
      })

      await Promise.all(processPromises)
    } catch (error) {
      console.error('Error processing notification queue:', error)
    }
  }

  /**
   * Send notification to all admin users
   */
  static async notifyAdmins(
    type: NotificationType,
    title: string,
    message: string,
    templateData?: Record<string, string>,
    verificationRequestId?: string
  ): Promise<{ success: boolean; notifiedCount: number; error?: string }> {
    try {
      // Get all admin users
      const adminQuery = query(
        collection(db, this.USERS),
        where('role', '==', 'admin')
      )
      
      const adminSnapshot = await getDocs(adminQuery)
      
      if (adminSnapshot.empty) {
        return {
          success: false,
          notifiedCount: 0,
          error: 'No admin users found'
        }
      }

      // Send notification to each admin
      const notificationPromises = adminSnapshot.docs.map(adminDoc => 
        this.sendNotification(
          adminDoc.id,
          type,
          title,
          message,
          templateData,
          verificationRequestId
        )
      )

      const results = await Promise.all(notificationPromises)
      const successCount = results.filter(result => result.success).length

      return {
        success: successCount > 0,
        notifiedCount: successCount,
        error: successCount === 0 ? 'Failed to notify any admin users' : undefined
      }
    } catch (error) {
      console.error('Error notifying admins:', error)
      return {
        success: false,
        notifiedCount: 0,
        error: error instanceof Error ? error.message : 'Failed to notify admins'
      }
    }
  }
}