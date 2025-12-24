import { useState, useEffect } from 'react'
import { Bell, Check, CheckCircle, AlertCircle, Clock, Filter, Search } from 'lucide-react'
import { useAppSelector } from '../hooks/redux'
import { NotificationService } from '../services/notificationService'
import { VerificationNotification, NotificationType } from '../types/verification'
import { format, isToday, isYesterday, startOfWeek, startOfMonth } from 'date-fns'

interface NotificationHistoryProps {
  className?: string
}

type FilterType = 'all' | 'unread' | 'verification_approved' | 'verification_rejected' | 'verification_pending' | 'verification_documents_required'
type TimeFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month'

export default function NotificationHistory({ className = '' }: NotificationHistoryProps) {
  const [notifications, setNotifications] = useState<VerificationNotification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<VerificationNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!user?.id) return

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
  }, [user?.id])

  // Apply filters whenever notifications, filter, timeFilter, or searchTerm changes
  useEffect(() => {
    let filtered = [...notifications]

    // Apply type filter
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read)
    } else if (filter !== 'all') {
      filtered = filtered.filter(n => n.type === filter)
    }

    // Apply time filter
    const now = new Date()
    switch (timeFilter) {
      case 'today':
        filtered = filtered.filter(n => isToday(n.createdAt))
        break
      case 'yesterday':
        filtered = filtered.filter(n => isYesterday(n.createdAt))
        break
      case 'week':
        filtered = filtered.filter(n => n.createdAt >= startOfWeek(now))
        break
      case 'month':
        filtered = filtered.filter(n => n.createdAt >= startOfMonth(now))
        break
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(search) ||
        n.message.toLowerCase().includes(search)
      )
    }

    setFilteredNotifications(filtered)
  }, [notifications, filter, timeFilter, searchTerm])

  const handleMarkAsRead = async (notificationId: string) => {
    await NotificationService.markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return
    await NotificationService.markAllAsRead(user.id)
  }

  const getNotificationIcon = (type: NotificationType) => {
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
        return <Bell className="text-gray-500" size={20} />
    }
  }

  const getNotificationTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'verification_approved':
        return 'Approved'
      case 'verification_rejected':
        return 'Rejected'
      case 'verification_pending':
        return 'Pending'
      case 'verification_documents_required':
        return 'Documents Required'
      default:
        return 'Notification'
    }
  }

  const formatNotificationDate = (date: Date) => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a')
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="text-gray-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Notification History</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="unread">Unread Only</option>
              <option value="verification_approved">Approved</option>
              <option value="verification_rejected">Rejected</option>
              <option value="verification_pending">Pending</option>
              <option value="verification_documents_required">Documents Required</option>
            </select>
          </div>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' || timeFilter !== 'all' 
                ? 'No notifications match your filters' 
                : 'No notifications yet'
              }
            </p>
            {!searchTerm && filter === 'all' && timeFilter === 'all' && (
              <p className="text-sm text-gray-400 mt-1">
                You'll see updates about your verification status here
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.type === 'verification_approved' ? 'bg-green-100 text-green-700' :
                            notification.type === 'verification_rejected' ? 'bg-red-100 text-red-700' :
                            notification.type === 'verification_pending' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {getNotificationTypeLabel(notification.type)}
                          </span>
                        </div>
                        
                        <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-400 mt-2">
                          {formatNotificationDate(notification.createdAt)}
                        </p>
                      </div>
                      
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                          title="Mark as read"
                        >
                          <Check size={14} className="text-gray-500" />
                        </button>
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
      {filteredNotifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </p>
        </div>
      )}
    </div>
  )
}