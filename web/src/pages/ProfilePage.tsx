import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { setLanguage } from '../store/slices/languageSlice'
import { useTranslation } from '../hooks/useTranslation'

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const { currentLanguage } = useAppSelector((state) => state.language)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    organizationName: user?.organizationName || ''
  })

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'zh-cn', name: 'Chinese Simplified', flag: '🇨🇳' },
    { code: 'zh-tw', name: 'Chinese Traditional', flag: '🇹🇼' }
  ]

  const handleLanguageChange = (languageCode: string) => {
    dispatch(setLanguage(languageCode))
  }

  const handleSave = () => {
    // In a real app, this would update the user profile
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-semibold mb-1">{user?.displayName}</h2>
            <p className="text-gray-600 mb-2">{user?.email}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent/10 text-accent">
              {user?.role === 'user' && '🎓 Student'}
              {user?.role === 'company' && '🏢 Company'}
              {user?.role === 'ngo' && '🌍 NGO'}
            </div>
            
            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-accent">{user?.totalVolunteerHours || 0}</div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{user?.badges?.length || 0}</div>
                  <div className="text-sm text-gray-600">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-accent border border-accent rounded-lg hover:bg-accent hover:text-white transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                ) : (
                  <p className="text-gray-900">{user?.displayName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                ) : (
                  <p className="text-gray-900">{user?.email}</p>
                )}
              </div>

              {user?.role !== 'user' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.organizationName || 'Not specified'}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">{user?.bio || 'No bio provided'}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-6">Notifications</h3>
            <div className="space-y-4">
              <Link
                to="/notification-settings"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bell className="text-gray-600" size={20} />
                  <div>
                    <div className="font-medium">Notification Preferences</div>
                    <div className="text-sm text-gray-600">
                      Manage how you receive notifications
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Link>
            </div>
          </div>

          {/* Language Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-6">Language Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`p-4 border-2 rounded-lg text-left transition-all flex items-center gap-3 ${
                    currentLanguage === language.code
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.name}</div>
                    {currentLanguage === language.code && (
                      <div className="text-sm text-accent">Currently selected</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Account Security */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-6">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-green-800">Account Verified</div>
                    <div className="text-sm text-green-600">Your account is secure and verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card p-6 border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-6">Danger Zone</h3>
            <div className="space-y-4">
              <button className="w-full p-3 border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                Export My Data
              </button>
              <button className="w-full p-3 border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}