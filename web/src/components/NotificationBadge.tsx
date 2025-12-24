import { Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAppSelector } from '../hooks/redux'
import { NotificationService } from '../services/notificationService'

interface NotificationBadgeProps {
  onClick: () => void
  className?: string
}

export default function NotificationBadge({ onClick, className = '' }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!user?.id) return

    // Get initial unread count
    const fetchUnreadCount = async () => {
      const count = await NotificationService.getUnreadCount(user.id)
      setUnreadCount(count)
    }

    fetchUnreadCount()

    // Subscribe to real-time updates
    const unsubscribe = NotificationService.subscribeToNotifications(
      user.id,
      (notifications) => {
        const unreadCount = notifications.filter(n => !n.read).length
        setUnreadCount(unreadCount)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [user?.id])

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell size={20} className="text-gray-600" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}