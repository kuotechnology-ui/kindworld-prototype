import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../hooks/redux'

interface VerificationGuardProps {
  children: ReactNode
  requireVerification?: boolean
  fallbackPath?: string
  showMessage?: boolean
}

export default function VerificationGuard({ 
  children, 
  requireVerification = true, 
  fallbackPath = '/verification-request',
  showMessage = true 
}: VerificationGuardProps) {
  const { user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  // Allow access if user is not NGO
  if (!user || user.role !== 'ngo') {
    return <>{children}</>
  }

  // Allow access if verification is not required
  if (!requireVerification) {
    return <>{children}</>
  }

  // Allow access if NGO is verified
  if (user.verificationStatus === 'approved') {
    return <>{children}</>
  }

  // Block access for unverified NGOs
  if (showMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Verification Required
            </h3>
            
            <p className="text-gray-600 mb-6">
              {user.verificationStatus === 'pending' 
                ? 'Your NGO verification is currently being reviewed. This feature will be available once your verification is approved.'
                : user.verificationStatus === 'rejected'
                ? 'Your NGO verification was not approved. Please submit a new verification request to access this feature.'
                : 'To access this feature, you need to verify your NGO account first.'
              }
            </p>

            <div className="space-y-3">
              {user.verificationStatus === 'pending' ? (
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Return to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => window.location.href = fallbackPath}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {user.verificationStatus === 'rejected' ? 'Submit New Request' : 'Start Verification'}
                </button>
              )}
              
              <button
                onClick={() => window.history.back()}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect without message
  return <Navigate to={fallbackPath} state={{ from: location }} replace />
}

// Hook for checking verification status in components
export function useVerificationStatus() {
  const { user } = useAppSelector((state) => state.auth)
  
  const isNGO = user?.role === 'ngo'
  const isVerified = user?.verificationStatus === 'approved'
  const isPending = user?.verificationStatus === 'pending'
  const isRejected = user?.verificationStatus === 'rejected'
  const needsVerification = isNGO && !isVerified

  return {
    isNGO,
    isVerified,
    isPending,
    isRejected,
    needsVerification,
    canAccessNGOFeatures: !isNGO || isVerified
  }
}