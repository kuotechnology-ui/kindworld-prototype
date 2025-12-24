import { useState } from 'react'
import { 
  XCircle, 
  CheckCircle, 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Building
} from 'lucide-react'
import { VerificationRequest, VerificationStatus } from '../types/verification'
import ConfirmationDialog from './ConfirmationDialog'

interface VerificationRequestReviewProps {
  request: VerificationRequest
  onApprove: (requestId: string, adminNotes?: string) => void
  onReject: (requestId: string, reason: string, adminNotes?: string) => void
  onClose: () => void
  isProcessing?: boolean
}

export default function VerificationRequestReview({
  request,
  onApprove,
  onReject,
  onClose,
  isProcessing = false
}: VerificationRequestReviewProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showApproveForm, setShowApproveForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  const [showApproveConfirm, setShowApproveConfirm] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'reject', data?: any } | null>(null)

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: VerificationStatus) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const handleApprove = () => {
    setPendingAction({ type: 'approve', data: { adminNotes: adminNotes || undefined } })
    setShowApproveConfirm(true)
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    
    setPendingAction({ 
      type: 'reject', 
      data: { 
        reason: rejectionReason, 
        adminNotes: adminNotes || undefined 
      } 
    })
    setShowRejectConfirm(true)
  }

  const confirmApprove = () => {
    if (pendingAction?.type === 'approve') {
      onApprove(request.id, pendingAction.data?.adminNotes)
      resetForms()
    }
  }

  const confirmReject = () => {
    if (pendingAction?.type === 'reject') {
      onReject(request.id, pendingAction.data.reason, pendingAction.data.adminNotes)
      resetForms()
    }
  }

  const resetForms = () => {
    setShowApproveForm(false)
    setShowRejectForm(false)
    setShowApproveConfirm(false)
    setShowRejectConfirm(false)
    setPendingAction(null)
    setRejectionReason('')
    setAdminNotes('')
  }

  const downloadDocument = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Failed to download document')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{request.organizationName}</h2>
              <div className={getStatusBadge(request.status)}>
                {getStatusIcon(request.status)}
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Organization Details */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Organization Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <div className="text-gray-900 font-medium">{request.organizationName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {request.organizationType}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                    <div className="text-gray-900">{request.submittedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Contact Email
                    </label>
                    <a href={`mailto:${request.contactEmail}`} className="text-blue-600 hover:underline">
                      {request.contactEmail}
                    </a>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Contact Phone
                    </label>
                    <div className="text-gray-900">
                      {request.contactPhone ? (
                        <a href={`tel:${request.contactPhone}`} className="text-blue-600 hover:underline">
                          {request.contactPhone}
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">Not provided</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      Website
                    </label>
                    <div className="text-gray-900">
                      {request.website ? (
                        <a 
                          href={request.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          {request.website}
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Address
                    </label>
                    <div className="text-gray-900 text-sm leading-relaxed">
                      {request.address.street}<br />
                      {request.address.city}, {request.address.state} {request.address.zipCode}<br />
                      {request.address.country}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Mission Statement */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mission Statement</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{request.missionStatement}</p>
              </div>
            </section>

            {/* Documents */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Verification Documents ({request.documents.length})
              </h3>
              {request.documents.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No documents uploaded</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {request.documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 truncate max-w-[200px]" title={doc.fileName}>
                              {doc.fileName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDocumentType(doc.type)} • {formatFileSize(doc.fileSize)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {doc.description && (
                        <div className="mb-3">
                          <div className="text-sm text-gray-700">{doc.description}</div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                          className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => downloadDocument(doc.fileUrl, doc.fileName)}
                          className="flex items-center gap-1 px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Review History */}
            {(request.reviewedAt || request.rejectionReason || request.adminNotes) && (
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Review History
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {request.reviewedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reviewed At</label>
                      <div className="text-gray-900">
                        {request.reviewedAt.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                  {request.reviewedBy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reviewed By</label>
                      <div className="text-gray-900">{request.reviewedBy}</div>
                    </div>
                  )}
                  {request.rejectionReason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                      <div className="text-red-800 bg-red-50 p-3 rounded border border-red-200">
                        {request.rejectionReason}
                      </div>
                    </div>
                  )}
                  {request.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                      <div className="text-gray-900 bg-white p-3 rounded border">
                        {request.adminNotes}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {request.status === 'pending' && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            {!showRejectForm && !showApproveForm ? (
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Request
                </button>
                <button
                  onClick={() => setShowApproveForm(true)}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Request
                </button>
              </div>
            ) : null}

            {/* Reject Form */}
            {showRejectForm && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-red-800">Reject Verification Request</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select a reason...</option>
                    <option value="Incomplete documentation">Incomplete documentation</option>
                    <option value="Invalid or expired documents">Invalid or expired documents</option>
                    <option value="Organization not eligible">Organization not eligible</option>
                    <option value="Suspicious or fraudulent information">Suspicious or fraudulent information</option>
                    <option value="Unable to verify organization legitimacy">Unable to verify organization legitimacy</option>
                    <option value="Other">Other (specify in notes)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Additional notes for the rejection..."
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowRejectForm(false)
                      setRejectionReason('')
                      setAdminNotes('')
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim() || isProcessing}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                  </button>
                </div>
              </div>
            )}

            {/* Approve Form */}
            {showApproveForm && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-green-800">Approve Verification Request</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Additional notes for the approval..."
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowApproveForm(false)
                      setAdminNotes('')
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Approval'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showApproveConfirm}
        title="Approve Verification Request"
        message={`Are you sure you want to approve the verification request for ${request.organizationName}? This will grant them full access to the platform.`}
        type="success"
        confirmText="Approve"
        onConfirm={confirmApprove}
        onCancel={() => setShowApproveConfirm(false)}
        isProcessing={isProcessing}
      />

      <ConfirmationDialog
        isOpen={showRejectConfirm}
        title="Reject Verification Request"
        message={`Are you sure you want to reject the verification request for ${request.organizationName}? They will be notified of the rejection and reason.`}
        type="danger"
        confirmText="Reject"
        onConfirm={confirmReject}
        onCancel={() => setShowRejectConfirm(false)}
        isProcessing={isProcessing}
      />
    </div>
  )
}