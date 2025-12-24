import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/redux'
import { NGOVerificationService } from '../services/ngoVerificationService'
import { VerificationFormData, VerificationDocument } from '../types/verification'
import VerificationRequestForm from '../components/VerificationRequestForm'

export default function VerificationRequestPage() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  // Redirect if not NGO or already verified
  useEffect(() => {
    if (!user || user.role !== 'ngo') {
      navigate('/')
      return
    }
    
    if (user.verificationStatus === 'approved') {
      navigate('/')
      return
    }
  }, [user, navigate])

  const handleSubmit = async (formData: VerificationFormData, documents: VerificationDocument[]) => {
    if (!user) return

    setSubmitting(true)
    try {
      const result = await NGOVerificationService.submitVerificationRequest(
        user.id,
        formData,
        documents
      )
      
      if (result.success) {
        // Show success message and redirect
        alert('Verification request submitted successfully! You will be notified once it is reviewed.')
        navigate('/')
      } else {
        throw new Error(result.error || 'Failed to submit verification request')
      }
    } catch (error) {
      throw error // Let the form component handle the error
    } finally {
      setSubmitting(false)
    }
  }

  if (!user || user.role !== 'ngo') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Verification Request</h1>
            <p className="text-gray-600">
              Please provide the required information and documents to verify your organization. 
              This process helps us ensure the authenticity of NGOs on our platform.
            </p>
          </div>

          <VerificationRequestForm
            initialData={{
              organizationName: user?.organizationName || '',
              contactEmail: user?.email || ''
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            isSubmitting={submitting}
          />
        </div>
      </div>
    </div>
  )
}