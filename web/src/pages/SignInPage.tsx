import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/redux'
import { setUser } from '../store/slices/authSlice'
import { useTranslation } from '../hooks/useTranslation'

export default function SignInPage() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'company' | 'ngo'>('user')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [authSuccess, setAuthSuccess] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleGoogleSignIn = () => {
    setIsSigningIn(true)
    
    // Simple direct authentication without complex verification
    const userData = {
      id: `user_${Date.now()}`,
      email: selectedRole === 'user' ? 'student@gmail.com' : 
             selectedRole === 'company' ? 'hr@company.com' : 'admin@ngo.org',
      displayName: selectedRole === 'user' ? 'Alex Chen' : 
                   selectedRole === 'company' ? 'Microsoft Corp' : 'Red Cross NGO',
      photoURL: 'https://via.placeholder.com/100',
      compassionPoints: selectedRole === 'user' ? 26500 : 0,
      totalVolunteerHours: selectedRole === 'user' ? 530 : 0,
      badges: [],
      followers: [],
      following: [],
      role: selectedRole,
      verified: selectedRole !== 'ngo', // NGOs start unverified
      verificationStatus: selectedRole === 'ngo' ? 'pending' as const : undefined, // NGOs start with pending verification
      googleId: `google_${Date.now()}`,
      organizationName: selectedRole !== 'user' ? (selectedRole === 'company' ? 'Microsoft Corp' : 'Red Cross NGO') : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Set user immediately
    dispatch(setUser(userData))
    
    // Quick success feedback
    setAuthSuccess(true)
    setIsSigningIn(false)
    
    // Navigate based on role and verification status
    setTimeout(() => {
      if (selectedRole === 'ngo') {
        // Redirect NGOs to verification request process
        navigate('/verification-request')
      } else {
        navigate('/')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">KindWorld</h1>
          <p className="text-gray-600">Transform Kindness into Impact</p>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-semibold mb-2">Sign in to KindWorld</h2>
          <p className="text-gray-600 mb-6">Choose your account type and sign in with Gmail</p>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose your account type:</label>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setSelectedRole('user')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === 'user'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">🎓 Sign-in by Student</div>
                <div className="text-sm text-gray-600">I'm a student who wants to volunteer and track my hours</div>
              </button>
              
              <button
                onClick={() => setSelectedRole('company')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === 'company'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">🏢 Sign-in by Company</div>
                <div className="text-sm text-gray-600">I represent a company that supports volunteer programs</div>
              </button>
              
              <button
                onClick={() => setSelectedRole('ngo')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === 'ngo'
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">🌍 Sign-in by NGO</div>
                <div className="text-sm text-gray-600">I'm an NGO that creates missions and verifies volunteer work</div>
              </button>
            </div>
          </div>

          {/* Google Sign In */}
          <button 
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className={`w-full py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-3 font-medium ${
              isSigningIn 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            {isSigningIn ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in to KindWorld with Gmail
              </>
            )}
          </button>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>✨ Demo Mode:</strong> Click the button above to sign in as a{' '}
              {selectedRole === 'user' ? 'student' : selectedRole === 'company' ? 'company' : 'NGO'}.
            </div>
          </div>

          {/* Success Message */}
          {authSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 text-green-600">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-green-800">Authentication Successful! 🎉</div>
                  <div className="text-green-700 text-sm">
                    Redirecting to your {selectedRole === 'user' ? 'student' : selectedRole} dashboard...
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-accent hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>


    </div>
  )
}
