import { useState, useEffect } from 'react'
import { Bell, Mail, Settings, Save, Check } from 'lucide-react'
import { useAppSelector } from '../hooks/redux'
import { NotificationService, NotificationPreferences as NotificationPrefsType } from '../services/notificationService'

interface NotificationPreferencesProps {
  className?: string
}

export default function NotificationPreferences({ className = '' }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPrefsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!user?.id) return

    const loadPreferences = async () => {
      setLoading(true)
      const prefs = await NotificationService.getUserPreferences(user.id)
      setPreferences(prefs)
      setLoading(false)
    }

    loadPreferences()
  }, [user?.id])

  const handlePreferenceChange = (key: keyof Omit<NotificationPrefsType, 'userId' | 'updatedAt'>, value: boolean) => {
    if (!preferences) return

    setPreferences({
      ...preferences,
      [key]: value
    })
  }

  const handleSave = async () => {
    if (!user?.id || !preferences || saving) return

    setSaving(true)
    setSaved(false)

    const success = await NotificationService.updateUserPreferences(user.id, {
      emailNotifications: preferences.emailNotifications,
      inAppNotifications: preferences.inAppNotifications,
      verificationUpdates: preferences.verificationUpdates,
      systemAnnouncements: preferences.systemAnnouncements
    })

    setSaving(false)
    
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 w-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <p className="text-gray-500">Failed to load notification preferences</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Settings className="text-gray-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Mail className="text-gray-500 mt-1" size={18} />
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">
                Receive important updates via email
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* In-App Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Bell className="text-gray-500 mt-1" size={18} />
            <div>
              <h4 className="font-medium text-gray-900">In-App Notifications</h4>
              <p className="text-sm text-gray-600">
                Show notifications in the application
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.inAppNotifications}
              onChange={(e) => handlePreferenceChange('inAppNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Verification Updates */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Check className="text-gray-500 mt-1" size={18} />
            <div>
              <h4 className="font-medium text-gray-900">Verification Updates</h4>
              <p className="text-sm text-gray-600">
                Get notified about verification status changes
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.verificationUpdates}
              onChange={(e) => handlePreferenceChange('verificationUpdates', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* System Announcements */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Bell className="text-gray-500 mt-1" size={18} />
            <div>
              <h4 className="font-medium text-gray-900">System Announcements</h4>
              <p className="text-sm text-gray-600">
                Receive updates about new features and maintenance
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.systemAnnouncements}
              onChange={(e) => handlePreferenceChange('systemAnnouncements', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            saved
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
          }`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : saved ? (
            <>
              <Check size={16} />
              Saved!
            </>
          ) : (
            <>
              <Save size={16} />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  )
}