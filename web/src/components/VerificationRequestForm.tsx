import { useState } from 'react'
import { VerificationFormData, VerificationDocument } from '../types/verification'

interface VerificationRequestFormProps {
  initialData?: Partial<VerificationFormData>
  onSubmit: (formData: VerificationFormData, documents: VerificationDocument[]) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  submitButtonText?: string
}

export default function VerificationRequestForm({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Submit Verification Request'
}: VerificationRequestFormProps) {
  const [formData, setFormData] = useState<VerificationFormData>({
    organizationName: initialData.organizationName || '',
    organizationType: initialData.organizationType || '',
    contactEmail: initialData.contactEmail || '',
    contactPhone: initialData.contactPhone || '',
    website: initialData.website || '',
    address: {
      street: initialData.address?.street || '',
      city: initialData.address?.city || '',
      state: initialData.address?.state || '',
      zipCode: initialData.address?.zipCode || '',
      country: initialData.address?.country || 'United States'
    },
    missionStatement: initialData.missionStatement || ''
  })
  
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [uploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileUpload = async (file: File, type: 'registration' | 'tax_exempt' | 'mission_statement' | 'other', description?: string) => {
    // For demo purposes, create a mock document
    const mockDocument: VerificationDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file), // Create a temporary URL for demo
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
      description: description || `Uploaded: ${file.name}`
    }

    setDocuments(prev => [...prev, mockDocument])
  }

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required'
    }
    
    if (!formData.organizationType) {
      newErrors.organizationType = 'Organization type is required'
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }
    
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required'
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required'
    }
    
    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'State is required'
    }
    
    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'ZIP code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.address.zipCode)) {
      newErrors['address.zipCode'] = 'Please enter a valid ZIP code'
    }
    
    if (!formData.missionStatement.trim()) {
      newErrors.missionStatement = 'Mission statement is required'
    } else if (formData.missionStatement.trim().length < 50) {
      newErrors.missionStatement = 'Mission statement must be at least 50 characters'
    }
    
    if (documents.length === 0) {
      newErrors.documents = 'At least one verification document is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(formData, documents)
    } catch (error) {
      setErrors({ submit: 'Failed to submit verification request' })
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Organization Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Organization Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.organizationName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your organization name"
            />
            {errors.organizationName && (
              <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Type *
            </label>
            <select
              value={formData.organizationType}
              onChange={(e) => handleInputChange('organizationType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.organizationType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select organization type</option>
              <option value="501c3">501(c)(3) Non-Profit</option>
              <option value="charity">Registered Charity</option>
              <option value="foundation">Foundation</option>
              <option value="community">Community Organization</option>
              <option value="religious">Religious Organization</option>
              <option value="educational">Educational Institution</option>
              <option value="other">Other</option>
            </select>
            {errors.organizationType && (
              <p className="text-red-500 text-sm mt-1">{errors.organizationType}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email *
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.contactEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="contact@organization.org"
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.organization.org"
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={formData.address.street}
            onChange={(e) => handleInputChange('address.street', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors['address.street'] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
          />
          {errors['address.street'] && (
            <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors['address.city'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="City"
            />
            {errors['address.city'] && (
              <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => handleInputChange('address.state', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors['address.state'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="State"
            />
            {errors['address.state'] && (
              <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              value={formData.address.zipCode}
              onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors['address.zipCode'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="12345"
            />
            {errors['address.zipCode'] && (
              <p className="text-red-500 text-sm mt-1">{errors['address.zipCode']}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            value={formData.address.country}
            onChange={(e) => handleInputChange('address.country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Mission Statement</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Mission Statement *
          </label>
          <textarea
            value={formData.missionStatement}
            onChange={(e) => handleInputChange('missionStatement', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.missionStatement ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your organization's mission and goals... (minimum 50 characters)"
          />
          <div className="flex justify-between items-center mt-1">
            {errors.missionStatement && (
              <p className="text-red-500 text-sm">{errors.missionStatement}</p>
            )}
            <p className="text-gray-500 text-sm ml-auto">
              {formData.missionStatement.length}/50 characters minimum
            </p>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Verification Documents</h2>
        <p className="text-gray-600">
          Please upload the required documents to verify your organization's legitimacy. 
          Accepted formats: PDF, JPG, PNG (max 10MB per file)
        </p>
        
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload verification documents
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  Click to browse or drag and drop files here
                </span>
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  files.forEach(file => {
                    if (file.size > 10 * 1024 * 1024) { // 10MB limit
                      setErrors(prev => ({ ...prev, documents: `File ${file.name} is too large. Maximum size is 10MB.` }))
                      return
                    }
                    handleFileUpload(file, 'other', `Uploaded: ${file.name}`)
                  })
                  // Clear the input so the same file can be uploaded again if needed
                  e.target.value = ''
                }}
                disabled={uploading}
              />
            </div>
          </div>
        </div>

        {/* Document Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: 'registration', label: 'Registration Certificate', icon: '📋' },
            { type: 'tax_exempt', label: 'Tax Exemption Letter', icon: '📄' },
            { type: 'mission_statement', label: 'Official Mission Statement', icon: '📝' },
            { type: 'other', label: 'Other Documents', icon: '📁' }
          ].map(({ type, label, icon }) => (
            <div key={type} className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <h3 className="font-medium text-gray-900 mb-2">{label}</h3>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      if (file.size > 10 * 1024 * 1024) {
                        setErrors(prev => ({ ...prev, documents: `File ${file.name} is too large. Maximum size is 10MB.` }))
                        return
                      }
                      handleFileUpload(file, type as any, label)
                    }
                    e.target.value = ''
                  }}
                />
                <span className="text-sm text-blue-600 hover:text-blue-800">
                  Upload {label}
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Uploaded Documents ({documents.length})</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {doc.mimeType.includes('pdf') ? (
                        <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="capitalize">{doc.type.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.fileSize)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="flex-shrink-0 text-red-600 hover:text-red-800 p-1"
                    title="Remove document"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.documents && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errors.documents}</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isSubmitting && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{isSubmitting ? 'Submitting...' : submitButtonText}</span>
        </button>
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm text-center">{errors.submit}</p>
        </div>
      )}
    </form>
  )
}