import { useState, useEffect } from 'react'
import { useAppSelector } from '../hooks/redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Users, Building, Award, Settings, Shield, Activity, TrendingUp, AlertTriangle, Search, Filter, Eye, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { NGOVerificationService } from '../services/ngoVerificationService'
import { VerificationRequest, AdminVerificationFilters, AdminVerificationStats, VerificationStatus } from '../types/verification'
import VerificationRequestReview from '../components/VerificationRequestReview'

export default function AdminDashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'ngos' | 'system'>('overview')
  
  // Verification management state
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [verificationStats, setVerificationStats] = useState<AdminVerificationStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null)
  const [filters, setFilters] = useState<AdminVerificationFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all')
  const [isProcessing, setIsProcessing] = useState(false)

  // Load verification data
  useEffect(() => {
    if (activeTab === 'ngos') {
      loadVerificationData()
    }
  }, [activeTab, filters])

  const loadVerificationData = async () => {
    setLoading(true)
    try {
      const [requestsResponse, stats] = await Promise.all([
        NGOVerificationService.getPendingRequests(filters),
        NGOVerificationService.getVerificationStats()
      ])

      if (requestsResponse.success && requestsResponse.data) {
        setVerificationRequests(requestsResponse.data)
      }
      setVerificationStats(stats)
    } catch (error) {
      console.error('Error loading verification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveRequest = async (requestId: string, adminNotes?: string) => {
    if (!user?.id) return
    
    setIsProcessing(true)
    try {
      const response = await NGOVerificationService.approveVerification(requestId, user.id, adminNotes)
      if (response.success) {
        await loadVerificationData()
        setSelectedRequest(null)
      } else {
        alert(response.error || 'Failed to approve request')
      }
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Failed to approve request')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectRequest = async (requestId: string, reason: string, adminNotes?: string) => {
    if (!user?.id) return
    
    setIsProcessing(true)
    try {
      const response = await NGOVerificationService.rejectVerification(requestId, user.id, reason, adminNotes)
      if (response.success) {
        await loadVerificationData()
        setSelectedRequest(null)
      } else {
        alert(response.error || 'Failed to reject request')
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    } finally {
      setIsProcessing(false)
    }
  }

  const applyFilters = () => {
    const newFilters: AdminVerificationFilters = {}
    
    if (searchTerm) {
      newFilters.searchTerm = searchTerm
    }
    
    if (statusFilter !== 'all') {
      newFilters.status = statusFilter as VerificationStatus
    }
    
    setFilters(newFilters)
  }

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: VerificationStatus) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  // Mock admin data
  const systemStats = {
    totalUsers: 12450,
    totalNGOs: 340,
    totalHours: 156780,
    totalEvents: 2340,
    activeUsers: 8920,
    pendingVerifications: 45
  }

  const userGrowthData = [
    { month: 'Aug', users: 8500, ngos: 280 },
    { month: 'Sep', users: 9200, ngos: 295 },
    { month: 'Oct', users: 10100, ngos: 315 },
    { month: 'Nov', users: 11300, ngos: 330 },
    { month: 'Dec', users: 12450, ngos: 340 }
  ]

  const recentUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', role: 'user', hours: 45, status: 'active' },
    { id: 2, name: 'Green Earth NGO', email: 'contact@greenearth.org', role: 'ngo', hours: 0, status: 'pending' },
    { id: 3, name: 'Mike Chen', email: 'mike@email.com', role: 'user', hours: 23, status: 'active' },
    { id: 4, name: 'Hope Foundation', email: 'admin@hope.org', role: 'ngo', hours: 0, status: 'active' },
    { id: 5, name: 'Lisa Wang', email: 'lisa@email.com', role: 'user', hours: 67, status: 'active' }
  ]

  const systemAlerts = [
    { id: 1, type: 'warning', message: '45 volunteer hours pending verification', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'New NGO registration: Community Care Center', time: '4 hours ago' },
    { id: 3, type: 'success', message: 'System backup completed successfully', time: '6 hours ago' },
    { id: 4, type: 'warning', message: 'High server load detected', time: '8 hours ago' }
  ]

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-500 text-sm font-medium">+12%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{systemStats.totalUsers.toLocaleString()}</div>
          <div className="text-gray-600">Total Users</div>
          <div className="text-sm text-gray-500 mt-1">{systemStats.activeUsers.toLocaleString()} active</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-500 text-sm font-medium">+8%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{systemStats.totalNGOs}</div>
          <div className="text-gray-600">Registered NGOs</div>
          <div className="text-sm text-gray-500 mt-1">15 pending approval</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-500 text-sm font-medium">+25%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{systemStats.totalHours.toLocaleString()}</div>
          <div className="text-gray-600">Total Volunteer Hours</div>
          <div className="text-sm text-gray-500 mt-1">{systemStats.pendingVerifications} pending verification</div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Platform Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#4A90E2" strokeWidth={3} />
            <Line type="monotone" dataKey="ngos" stroke="#9B59B6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* System Alerts */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">System Alerts</h3>
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                alert.type === 'warning' ? 'bg-yellow-500' :
                alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <div className="text-gray-900">{alert.message}</div>
                <div className="text-sm text-gray-500">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">User Management</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Export Users
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Add User
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Hours</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'ngo' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">{user.hours}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management controls</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: Activity },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'ngos', label: 'NGOs', icon: Building },
              { key: 'system', label: 'System', icon: Settings }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'ngos' && (
        <div className="space-y-6">
          {/* Verification Stats */}
          {verificationStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{verificationStats.totalPending}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{verificationStats.totalApproved}</div>
                    <div className="text-sm text-gray-600">Approved</div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{verificationStats.totalRejected}</div>
                    <div className="text-sm text-gray-600">Rejected</div>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{verificationStats.averageProcessingTime}</div>
                    <div className="text-sm text-gray-600">Avg Days</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as VerificationStatus | 'all')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Apply Filters
                </button>
              </div>
              <button
                onClick={loadVerificationData}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Verification Requests Table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Verification Requests</h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading verification requests...</p>
              </div>
            ) : verificationRequests.length === 0 ? (
              <div className="p-8 text-center">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No verification requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 font-semibold">Organization</th>
                      <th className="text-left py-3 px-6 font-semibold">Type</th>
                      <th className="text-left py-3 px-6 font-semibold">Contact</th>
                      <th className="text-left py-3 px-6 font-semibold">Submitted</th>
                      <th className="text-left py-3 px-6 font-semibold">Status</th>
                      <th className="text-left py-3 px-6 font-semibold">Documents</th>
                      <th className="text-left py-3 px-6 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verificationRequests.map((request) => (
                      <tr key={request.id} className="border-t hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900">{request.organizationName}</div>
                            {request.website && (
                              <div className="text-sm text-blue-600">
                                <a href={request.website} target="_blank" rel="noopener noreferrer">
                                  {request.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {request.organizationType}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div>{request.contactEmail}</div>
                            {request.contactPhone && (
                              <div className="text-gray-500">{request.contactPhone}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {request.submittedAt.toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <span className={getStatusBadge(request.status)}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            {request.documents.length} files
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          >
                            <Eye className="w-4 h-4" />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'system' && (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
          <p className="text-gray-600">System configuration and maintenance tools coming soon.</p>
        </div>
      )}

      {/* Verification Request Review Modal */}
      {selectedRequest && (
        <VerificationRequestReview
          request={selectedRequest}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          onClose={() => setSelectedRequest(null)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  )
}