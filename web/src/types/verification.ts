// NGO Verification System Types

// Verification status enum
export type VerificationStatus = 'pending' | 'approved' | 'rejected'

// Document types for verification
export type DocumentType = 'registration' | 'tax_exempt' | 'mission_statement' | 'other'

// Verification audit action types
export type AuditAction = 'submitted' | 'approved' | 'rejected' | 'documents_updated' | 'resubmitted'

// Notification types for verification system
export type NotificationType = 'verification_approved' | 'verification_rejected' | 'verification_pending' | 'verification_documents_required'

// Verification document interface
export interface VerificationDocument {
  id: string
  type: DocumentType
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: Date
  description?: string
}

// Main verification request interface
export interface VerificationRequest {
  id: string
  ngoId: string
  organizationName: string
  organizationType: string
  contactEmail: string
  contactPhone?: string
  website?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  missionStatement: string
  documents: VerificationDocument[]
  status: VerificationStatus
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  rejectionReason?: string
  adminNotes?: string
}

// Verification audit log interface
export interface VerificationAuditLog {
  id: string
  requestId: string
  action: AuditAction
  performedBy: string
  performedAt: Date
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  previousStatus?: VerificationStatus
  newStatus?: VerificationStatus
}

// Notification interface for verification system
export interface VerificationNotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
  verificationRequestId?: string
  metadata?: Record<string, any>
}

// API response types for verification endpoints
export interface VerificationRequestResponse {
  success: boolean
  data?: VerificationRequest
  error?: string
  message?: string
}

export interface VerificationListResponse {
  success: boolean
  data?: VerificationRequest[]
  error?: string
  total?: number
  page?: number
  limit?: number
}

export interface VerificationActionResponse {
  success: boolean
  message?: string
  error?: string
  updatedRequest?: VerificationRequest
}

export interface DocumentUploadResponse {
  success: boolean
  document?: VerificationDocument
  error?: string
  uploadUrl?: string
}

// Form data interfaces for verification submission
export interface VerificationFormData {
  organizationName: string
  organizationType: string
  contactEmail: string
  contactPhone?: string
  website?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  missionStatement: string
}

export interface DocumentUploadData {
  file: File
  type: DocumentType
  description?: string
}

// Admin verification management interfaces
export interface AdminVerificationFilters {
  status?: VerificationStatus
  dateFrom?: Date
  dateTo?: Date
  organizationType?: string
  searchTerm?: string
}

export interface AdminVerificationStats {
  totalPending: number
  totalApproved: number
  totalRejected: number
  averageProcessingTime: number
  recentActivity: VerificationAuditLog[]
}

// Extended User interface for verification status
export interface UserWithVerification {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: 'user' | 'company' | 'ngo' | 'admin'
  organizationName?: string
  verificationStatus?: VerificationStatus
  verificationRequestId?: string
  createdAt: string
  updatedAt: string
}