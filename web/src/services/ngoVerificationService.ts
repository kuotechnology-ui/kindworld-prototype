import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from '../config/firebase'
import {
  VerificationRequest,
  VerificationDocument,
  VerificationAuditLog,
  VerificationNotification,
  VerificationFormData,
  DocumentUploadData,
  VerificationRequestResponse,
  VerificationListResponse,
  VerificationActionResponse,
  DocumentUploadResponse,
  AdminVerificationFilters,
  AdminVerificationStats,
  AuditAction
} from '../types/verification'
import { NotificationService } from './notificationService'

export class NGOVerificationService {
  // Collection references
  private static readonly VERIFICATION_REQUESTS = 'verification_requests'
  private static readonly VERIFICATION_DOCUMENTS = 'verification_documents'
  private static readonly AUDIT_LOGS = 'verification_audit_logs'
  private static readonly NOTIFICATIONS = 'verification_notifications'
  private static readonly USERS = 'users'

  /**
   * Submit a new verification request for an NGO
   */
  static async submitVerificationRequest(
    ngoId: string,
    formData: VerificationFormData,
    documents: VerificationDocument[]
  ): Promise<VerificationRequestResponse> {
    try {
      // Create verification request document
      const verificationRequest: Omit<VerificationRequest, 'id'> = {
        ngoId,
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        address: formData.address,
        missionStatement: formData.missionStatement,
        documents,
        status: 'pending',
        submittedAt: new Date(),
      }

      // Add to Firestore
      const docRef = await addDoc(
        collection(db, this.VERIFICATION_REQUESTS),
        {
          ...verificationRequest,
          submittedAt: serverTimestamp()
        }
      )

      // Update user's verification status
      await updateDoc(doc(db, this.USERS, ngoId), {
        verificationStatus: 'pending',
        verificationRequestId: docRef.id,
        updatedAt: serverTimestamp()
      })

      // Create audit log
      await this.createAuditLog(docRef.id, 'submitted', ngoId, {
        organizationName: formData.organizationName,
        documentsCount: documents.length
      })

      // Send notification to NGO confirming submission
      await NotificationService.sendNotification(
        ngoId,
        'verification_pending',
        'Verification Request Submitted',
        `Your verification request for ${formData.organizationName} has been submitted and is under review.`,
        {
          organizationName: formData.organizationName,
          statusUrl: `${window.location.origin}/verification-status`,
          dashboardUrl: `${window.location.origin}/ngo-dashboard`
        },
        docRef.id
      )

      // Create notification for admins
      await NotificationService.notifyAdmins(
        'verification_pending',
        'New NGO Verification Request',
        `${formData.organizationName} has submitted a verification request for review.`,
        {
          organizationName: formData.organizationName,
          adminUrl: `${window.location.origin}/admin/verification/${docRef.id}`
        },
        docRef.id
      )

      const createdRequest: VerificationRequest = {
        id: docRef.id,
        ...verificationRequest
      }

      return {
        success: true,
        data: createdRequest,
        message: 'Verification request submitted successfully'
      }
    } catch (error) {
      console.error('Error submitting verification request:', error)
      return {
        success: false,
        error: 'Failed to submit verification request'
      }
    }
  }

  /**
   * Get verification status for an NGO
   */
  static async getVerificationStatus(ngoId: string): Promise<VerificationRequestResponse> {
    try {
      const q = query(
        collection(db, this.VERIFICATION_REQUESTS),
        where('ngoId', '==', ngoId),
        orderBy('submittedAt', 'desc'),
        limit(1)
      )

      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return {
          success: true,
          data: undefined,
          message: 'No verification request found'
        }
      }

      const doc = querySnapshot.docs[0]
      const data = doc.data()
      
      const verificationRequest: VerificationRequest = {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || new Date(),
        reviewedAt: data.reviewedAt?.toDate()
      } as VerificationRequest

      return {
        success: true,
        data: verificationRequest
      }
    } catch (error) {
      console.error('Error getting verification status:', error)
      return {
        success: false,
        error: 'Failed to get verification status'
      }
    }
  }

  /**
   * Upload a verification document
   */
  static async uploadDocument(
    ngoId: string,
    uploadData: DocumentUploadData
  ): Promise<DocumentUploadResponse> {
    try {
      // Generate unique filename
      const timestamp = Date.now()
      const filename = `verification/${ngoId}/${timestamp}_${uploadData.file.name}`
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filename)
      const snapshot = await uploadBytes(storageRef, uploadData.file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Create document record
      const document: Omit<VerificationDocument, 'id'> = {
        type: uploadData.type,
        fileName: uploadData.file.name,
        fileUrl: downloadURL,
        fileSize: uploadData.file.size,
        mimeType: uploadData.file.type,
        uploadedAt: new Date(),
        description: uploadData.description
      }

      // Add to Firestore
      const docRef = await addDoc(
        collection(db, this.VERIFICATION_DOCUMENTS),
        {
          ...document,
          ngoId,
          uploadedAt: serverTimestamp()
        }
      )

      const createdDocument: VerificationDocument = {
        id: docRef.id,
        ...document
      }

      return {
        success: true,
        document: createdDocument
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      return {
        success: false,
        error: 'Failed to upload document'
      }
    }
  }

  /**
   * Delete a verification document
   */
  static async deleteDocument(documentId: string, ngoId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get document data first
      const docRef = doc(db, this.VERIFICATION_DOCUMENTS, documentId)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Document not found' }
      }

      const docData = docSnap.data()
      
      // Verify ownership
      if (docData.ngoId !== ngoId) {
        return { success: false, error: 'Unauthorized' }
      }

      // Delete from Storage
      const storageRef = ref(storage, docData.fileUrl)
      await deleteObject(storageRef)

      // Delete from Firestore
      await updateDoc(docRef, { deleted: true })

      return { success: true }
    } catch (error) {
      console.error('Error deleting document:', error)
      return { success: false, error: 'Failed to delete document' }
    }
  }

  /**
   * Get all pending verification requests (Admin only)
   */
  static async getPendingRequests(filters?: AdminVerificationFilters): Promise<VerificationListResponse> {
    try {
      let q = query(
        collection(db, this.VERIFICATION_REQUESTS),
        orderBy('submittedAt', 'desc')
      )

      // Apply filters
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status))
      }
      if (filters?.organizationType) {
        q = query(q, where('organizationType', '==', filters.organizationType))
      }

      const querySnapshot = await getDocs(q)
      const requests: VerificationRequest[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        requests.push({
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date(),
          reviewedAt: data.reviewedAt?.toDate()
        } as VerificationRequest)
      })

      // Apply client-side filters
      let filteredRequests = requests
      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        filteredRequests = requests.filter(req => 
          req.organizationName.toLowerCase().includes(searchTerm) ||
          req.contactEmail.toLowerCase().includes(searchTerm)
        )
      }

      if (filters?.dateFrom || filters?.dateTo) {
        filteredRequests = filteredRequests.filter(req => {
          const submittedDate = req.submittedAt
          if (filters.dateFrom && submittedDate < filters.dateFrom) return false
          if (filters.dateTo && submittedDate > filters.dateTo) return false
          return true
        })
      }

      return {
        success: true,
        data: filteredRequests,
        total: filteredRequests.length
      }
    } catch (error) {
      console.error('Error getting pending requests:', error)
      return {
        success: false,
        error: 'Failed to get pending requests'
      }
    }
  }

  /**
   * Approve a verification request (Admin only)
   */
  static async approveVerification(
    requestId: string,
    adminId: string,
    adminNotes?: string
  ): Promise<VerificationActionResponse> {
    try {
      // Validate inputs
      if (!requestId || !adminId) {
        return {
          success: false,
          message: 'Invalid request ID or admin ID',
          error: 'Invalid request ID or admin ID'
        }
      }

      const requestRef = doc(db, this.VERIFICATION_REQUESTS, requestId)
      const requestSnap = await getDoc(requestRef)
      
      if (!requestSnap.exists()) {
        return {
          success: false,
          message: 'Verification request not found',
          error: 'Verification request not found'
        }
      }

      const requestData = requestSnap.data() as VerificationRequest
      
      // Check if request is already processed
      if (requestData.status !== 'pending') {
        return {
          success: false,
          message: `Request has already been ${requestData.status}`,
          error: `Request has already been ${requestData.status}`
        }
      }

      // Verify NGO user exists
      const userRef = doc(db, this.USERS, requestData.ngoId)
      const userSnap = await getDoc(userRef)
      
      if (!userSnap.exists()) {
        return {
          success: false,
          message: 'NGO user not found',
          error: 'NGO user not found'
        }
      }

      // Update verification request
      await updateDoc(requestRef, {
        status: 'approved',
        reviewedBy: adminId,
        reviewedAt: serverTimestamp(),
        adminNotes: adminNotes || ''
      })

      // Update user status
      await updateDoc(userRef, {
        verificationStatus: 'approved',
        updatedAt: serverTimestamp()
      })

      // Create audit log
      await this.createAuditLog(requestId, 'approved', adminId, {
        adminNotes,
        organizationName: requestData.organizationName,
        previousStatus: 'pending',
        newStatus: 'approved'
      })

      // Send notification to NGO
      await NotificationService.sendNotification(
        requestData.ngoId,
        'verification_approved',
        'Verification Approved - Welcome to KindWorld!',
        `Congratulations! Your organization ${requestData.organizationName} has been verified and you now have full access to the platform.`,
        {
          organizationName: requestData.organizationName,
          dashboardUrl: `${window.location.origin}/ngo-dashboard`,
          verificationUrl: `${window.location.origin}/verification-status`
        },
        requestId
      )

      return {
        success: true,
        message: 'Verification request approved successfully'
      }
    } catch (error) {
      console.error('Error approving verification:', error)
      
      // Create audit log for failed approval
      try {
        await this.createAuditLog(requestId, 'approved', adminId, {
          error: error instanceof Error ? error.message : 'Unknown error',
          failed: true
        })
      } catch (auditError) {
        console.error('Error creating audit log for failed approval:', auditError)
      }

      return {
        success: false,
        message: 'Failed to approve verification request',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Reject a verification request (Admin only)
   */
  static async rejectVerification(
    requestId: string,
    adminId: string,
    rejectionReason: string,
    adminNotes?: string
  ): Promise<VerificationActionResponse> {
    try {
      // Validate inputs
      if (!requestId || !adminId || !rejectionReason?.trim()) {
        return {
          success: false,
          message: 'Invalid request ID, admin ID, or rejection reason',
          error: 'Invalid request ID, admin ID, or rejection reason'
        }
      }

      const requestRef = doc(db, this.VERIFICATION_REQUESTS, requestId)
      const requestSnap = await getDoc(requestRef)
      
      if (!requestSnap.exists()) {
        return {
          success: false,
          message: 'Verification request not found',
          error: 'Verification request not found'
        }
      }

      const requestData = requestSnap.data() as VerificationRequest

      // Check if request is already processed
      if (requestData.status !== 'pending') {
        return {
          success: false,
          message: `Request has already been ${requestData.status}`,
          error: `Request has already been ${requestData.status}`
        }
      }

      // Verify NGO user exists
      const userRef = doc(db, this.USERS, requestData.ngoId)
      const userSnap = await getDoc(userRef)
      
      if (!userSnap.exists()) {
        return {
          success: false,
          message: 'NGO user not found',
          error: 'NGO user not found'
        }
      }

      // Update verification request
      await updateDoc(requestRef, {
        status: 'rejected',
        reviewedBy: adminId,
        reviewedAt: serverTimestamp(),
        rejectionReason: rejectionReason.trim(),
        adminNotes: adminNotes?.trim() || ''
      })

      // Update user status
      await updateDoc(userRef, {
        verificationStatus: 'rejected',
        updatedAt: serverTimestamp()
      })

      // Create audit log
      await this.createAuditLog(requestId, 'rejected', adminId, {
        rejectionReason: rejectionReason.trim(),
        adminNotes: adminNotes?.trim(),
        organizationName: requestData.organizationName,
        previousStatus: 'pending',
        newStatus: 'rejected'
      })

      // Send notification to NGO
      await NotificationService.sendNotification(
        requestData.ngoId,
        'verification_rejected',
        'Verification Request Update Required',
        `Your verification request for ${requestData.organizationName} requires additional information before approval.`,
        {
          organizationName: requestData.organizationName,
          rejectionReason: rejectionReason.trim(),
          verificationUrl: `${window.location.origin}/verification-request`,
          statusUrl: `${window.location.origin}/verification-status`
        },
        requestId
      )

      return {
        success: true,
        message: 'Verification request rejected successfully'
      }
    } catch (error) {
      console.error('Error rejecting verification:', error)
      
      // Create audit log for failed rejection
      try {
        await this.createAuditLog(requestId, 'rejected', adminId, {
          rejectionReason,
          adminNotes,
          error: error instanceof Error ? error.message : 'Unknown error',
          failed: true
        })
      } catch (auditError) {
        console.error('Error creating audit log for failed rejection:', auditError)
      }

      return {
        success: false,
        message: 'Failed to reject verification request',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get verification statistics for admin dashboard
   */
  static async getVerificationStats(): Promise<AdminVerificationStats> {
    try {
      const [pendingQuery, approvedQuery, rejectedQuery, auditQuery] = await Promise.all([
        getDocs(query(collection(db, this.VERIFICATION_REQUESTS), where('status', '==', 'pending'))),
        getDocs(query(collection(db, this.VERIFICATION_REQUESTS), where('status', '==', 'approved'))),
        getDocs(query(collection(db, this.VERIFICATION_REQUESTS), where('status', '==', 'rejected'))),
        getDocs(query(
          collection(db, this.AUDIT_LOGS),
          orderBy('performedAt', 'desc'),
          limit(10)
        ))
      ])

      // Calculate average processing time
      const processedRequests = [...approvedQuery.docs, ...rejectedQuery.docs]
      let totalProcessingTime = 0
      let processedCount = 0

      processedRequests.forEach(doc => {
        const data = doc.data()
        if (data.submittedAt && data.reviewedAt) {
          const submitted = data.submittedAt.toDate()
          const reviewed = data.reviewedAt.toDate()
          totalProcessingTime += reviewed.getTime() - submitted.getTime()
          processedCount++
        }
      })

      const averageProcessingTime = processedCount > 0 
        ? Math.round(totalProcessingTime / processedCount / (1000 * 60 * 60 * 24)) // Convert to days
        : 0

      // Get recent activity
      const recentActivity: VerificationAuditLog[] = auditQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        performedAt: doc.data().performedAt?.toDate() || new Date()
      })) as VerificationAuditLog[]

      return {
        totalPending: pendingQuery.size,
        totalApproved: approvedQuery.size,
        totalRejected: rejectedQuery.size,
        averageProcessingTime,
        recentActivity
      }
    } catch (error) {
      console.error('Error getting verification stats:', error)
      return {
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        averageProcessingTime: 0,
        recentActivity: []
      }
    }
  }

  /**
   * Create an audit log entry
   */
  private static async createAuditLog(
    requestId: string,
    action: AuditAction,
    performedBy: string,
    details: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const auditLog: Omit<VerificationAuditLog, 'id'> = {
        requestId,
        action,
        performedBy,
        performedAt: new Date(),
        details,
        ipAddress,
        userAgent
      }

      await addDoc(collection(db, this.AUDIT_LOGS), {
        ...auditLog,
        performedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error creating audit log:', error)
    }
  }



  /**
   * Request additional documents from NGO (Admin only)
   */
  static async requestAdditionalDocuments(
    requestId: string,
    adminId: string,
    requiredDocuments: string[],
    adminNotes?: string
  ): Promise<VerificationActionResponse> {
    try {
      const requestRef = doc(db, this.VERIFICATION_REQUESTS, requestId)
      const requestSnap = await getDoc(requestRef)
      
      if (!requestSnap.exists()) {
        return {
          success: false,
          message: 'Verification request not found',
          error: 'Verification request not found'
        }
      }

      const requestData = requestSnap.data() as VerificationRequest

      // Create audit log
      await this.createAuditLog(requestId, 'documents_updated', adminId, {
        requiredDocuments,
        adminNotes,
        organizationName: requestData.organizationName
      })

      // Send notification to NGO
      await NotificationService.sendNotification(
        requestData.ngoId,
        'verification_documents_required',
        'Additional Documents Required',
        `Additional documents are required to complete your verification for ${requestData.organizationName}.`,
        {
          organizationName: requestData.organizationName,
          requiredDocuments: requiredDocuments.join(', '),
          uploadUrl: `${window.location.origin}/verification-request`,
          statusUrl: `${window.location.origin}/verification-status`
        },
        requestId
      )

      return {
        success: true,
        message: 'Document request sent successfully'
      }
    } catch (error) {
      console.error('Error requesting additional documents:', error)
      return {
        success: false,
        message: 'Failed to request additional documents',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(userId: string): Promise<VerificationNotification[]> {
    try {
      const q = query(
        collection(db, this.NOTIFICATIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      )

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
   * Mark notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
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
}