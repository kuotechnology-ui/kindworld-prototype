import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '../hooks/redux'
import { setUser } from '../store/slices/authSlice'
import { GoogleAuthService } from '../services/googleAuthService'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state') // This contains the selected role
        const error = searchParams.get('error')

        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter')
        }

        setStatus('processing')

        // Handle the OAuth callback
        const googleUser = await GoogleAuthService.handleOAuthCallback(code, state)

        // Create user object from Google data
        const userData = {
          id: googleUser.id,
          email: googleUser.email,
          displayName: googleUser.name,
          photoURL: googleUser.picture,
          compassionPoints: state === 'user' ? 26500 : 0,
          totalVolunteerHours: state === 'user' ? 530 : 0,
          badges: [],
          followers: [],
          following: [],
          role: state as 'user' | 'ngo' | 'admin',
          verified: googleUser.verified_email,
          googleId: googleUser.id,
          organizationName: state === 'ngo' ? googleUser.name : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Save user to Redux store
        dispatch(setUser(userData))
        setStatus('success')

        // Redirect to dashboard after successful authentication
        setTimeout(() => {
          navigate('/')
        }, 2000)

      } catch (error) {
        console.error('OAuth callback error:', error)
        setError(error instanceof Error ? error.message : 'Authentication failed')
        setStatus('error')
        
        // Redirect back to sign-in page after error
        setTimeout(() => {
          navigate('/signin')
        }, 3000)
      }
    }

    handleOAuthCallback()
  }, [searchParams, navigate, dispatch])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Completing Sign In</h2>
              <p className="text-gray-600 mb-4">
                Processing your Google authentication...
              </p>
              <div className="space-y-2 text-sm text-left bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Verifying Google account</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Creating your profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Setting up dashboard</span>
                </div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-green-800 mb-2">Welcome to KindWorld!</h2>
              <p className="text-gray-600 mb-4">
                Your account has been successfully created and verified.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to your dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-red-800 mb-2">Authentication Failed</h2>
              <p className="text-gray-600 mb-4">
                {error || 'There was an error signing you in with Google.'}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting back to sign in...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}