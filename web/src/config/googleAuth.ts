// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  // Replace with your actual Google OAuth Client ID
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
  
  // OAuth scopes - what information we want to access
  scopes: [
    'openid',
    'email',
    'profile'
  ],
  
  // Redirect URI after successful authentication
  redirectUri: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000/auth/callback'
}

// Google OAuth URLs
export const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
export const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

// Generate Google OAuth URL
export const generateGoogleAuthUrl = (role: string) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: 'code',
    scope: GOOGLE_CONFIG.scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: role // Pass the selected role as state parameter
  })
  
  return `${GOOGLE_OAUTH_URL}?${params.toString()}`
}

// Mock Google user data for demo (replace with real API calls)
export const mockGoogleUserData = {
  user: {
    id: 'google_user_123456789',
    email: 'student@gmail.com',
    name: 'Alex Chen',
    picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    verified_email: true
  },
  company: {
    id: 'google_company_444555666',
    email: 'hr@microsoft.com',
    name: 'Microsoft Corporation',
    picture: 'https://lh3.googleusercontent.com/a/microsoft-logo=s96-c',
    verified_email: true
  },
  ngo: {
    id: 'google_ngo_987654321',
    email: 'admin@redcross.org',
    name: 'Red Cross International',
    picture: 'https://lh3.googleusercontent.com/a/redcross-logo=s96-c',
    verified_email: true
  }
}