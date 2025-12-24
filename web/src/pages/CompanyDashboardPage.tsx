import { useAppSelector } from '../hooks/redux'
import { useTranslation } from '../hooks/useTranslation'

export default function CompanyDashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { t } = useTranslation()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Company Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.displayName || user?.organizationName}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sponsored Programs</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Volunteers Supported</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
              <p className="text-2xl font-bold text-gray-900">856</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Impact Hours</p>
              <p className="text-2xl font-bold text-gray-900">15,420</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volunteer Programs */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Active Volunteer Programs</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Environmental Cleanup Initiative</h3>
                <p className="text-sm text-gray-600">245 volunteers • 1,200 hours</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Education Support Program</h3>
                <p className="text-sm text-gray-600">180 volunteers • 890 hours</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Community Health Drive</h3>
                <p className="text-sm text-gray-600">156 volunteers • 720 hours</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Planning</span>
            </div>
          </div>
          
          <button className="w-full mt-4 py-2 px-4 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors">
            Create New Program
          </button>
        </div>

        {/* Certificate Requests */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Certificate Requests</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
                  alt="Volunteer" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">Sarah Johnson</h3>
                  <p className="text-sm text-gray-600">120 hours • Environmental Program</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                  Approve
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">
                  Review
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
                  alt="Volunteer" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">Michael Chen</h3>
                  <p className="text-sm text-gray-600">85 hours • Education Program</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                  Approve
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">
                  Review
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" 
                  alt="Volunteer" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">Emma Wilson</h3>
                  <p className="text-sm text-gray-600">200 hours • Health Drive</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                  Approve
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">
                  Review
                </button>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-4 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            View All Requests
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm">Certificate approved for <strong>Sarah Johnson</strong></p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">+</span>
              </div>
              <div className="flex-1">
                <p className="text-sm">New volunteer joined <strong>Environmental Cleanup</strong></p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">🏆</span>
              </div>
              <div className="flex-1">
                <p className="text-sm">Medal request submitted by <strong>Michael Chen</strong></p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}