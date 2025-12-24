import { useState, useEffect, useRef } from 'react'
import { X, Check, CheckCheck, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAppSelector } from '../hooks/redux'
import { NotificationService } from '../services/notificationService'
import { VerificationNotification } from '../types/verification'
import { formatDistanceToNow } from 'date-fns'

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export default function NotificationDropdown({ isOpen, onClose, className = '' }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<VerificationNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAllRead, setMarkingAllRead] = useState(false)
  const { user } = useAppSelector((state) => state.auth)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user?.id || !isOpen) return

    setLoading(true)
    
    // Subscribe to real-time notifications
    const unsubscribe = NotificationService.subscribeToNotifications(
      user.id,
      (updatedNotifications) => {
        setNotifications(updatedNotifications)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [user?.id, isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleMarkAsRead = async (notificationId: string) => {
    await NotificationService.markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.id || markingAllRead) return
    
    setMarkingAllRead(true)
    await NotificationService.markAllAsRead(user.id)
    setMarkingAllRead(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'verification_approved':
        return <CheckCircle className="text-green-500" size={20} />
      case 'verification_rejected':
        return <AlertCircle className="text-red-500" size={20} />
      case 'verification_pending':
        return <Clock className="text-blue-500" size={20} />
      case 'verification_documents_required':
        return <AlertCircle className="text-orange-500" size={20} />
      default:
        return <AlertCircle className="text-gray-500" size={20} />
    }
  }

  const getNotificationBgColor = (type: string, read: boolean) => {
    if (read) return 'bg-gray-50'
    
    switch (type) {
      case 'verification_approved':
        return 'bg-green-50 border-l-4 border-green-500'
      case 'verification_rejected':
        return 'bg-red-50 border-l-4 border-red-500'
      case 'verification_pending':
        return 'bg-blue-50 border-l-4 border-blue-500'
      case 'verification_documents_required':
        return 'bg-orange-50 border-l-4 border-orange-500'
      default:
        return 'bg-gray-50'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg w-96 max-h-96 overflow-hidden z-50 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAllRead}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck size={16} />
              {markingAllRead ? 'Marking...' : 'Mark all read'}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded"
            aria-label="Close notifications"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              You'll see updates about your verification status here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${getNotificationBgColor(notification.type, notification.read)}`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(notification.id)
                          }}
                          className="ml-2 p-1 hover:bg-gray-200 rounded"
                          title="Mark as read"
                        >
                          <Check size={14} className="text-gray-500" />
                        </button>
                      )}
                    </div>
                    
                    <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </span>
                      
                      {notification.read && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Check size={12} />
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              // Navigate to full notifications page if you have one
              onClose()
            }}
            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  )
}