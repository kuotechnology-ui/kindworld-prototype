import { useState } from 'react'
import { useAppSelector } from '../hooks/redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Clock, Award, TrendingUp, MapPin, DollarSign, Plus, CheckCircle, AlertCircle } from 'lucide-react'

import VerificationStatusDashboard from '../components/VerificationStatusDashboard'
import { useVerificationStatus } from '../components/VerificationGuard'

export default function NGODashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { needsVerification } = useVerificationStatus()
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'verification' | 'status'>('overview')

  // Mock data for NGO dashboard
  const volunteerStats = {
    totalVolunteers: 1247,
    activeThisMonth: 892,
    totalHours: 15420,
    projectsCompleted: 67,
    averageRating: 4.8
  }

  const monthlyData = [
    { month: 'Aug', volunteers: 650, hours: 8200 },
    { month: 'Sep', volunteers: 720, hours: 9100 },
    { month: 'Oct', volunteers: 850, hours: 11500 },
    { month: 'Nov', volunteers: 920, hours: 13200 },
    { month: 'Dec', volunteers: 1247, hours: 15420 }
  ]

  const projectCategories = [
    { name: 'Education', value: 35, color: '#4A90E2' },
    { name: 'Healthcare', value: 25, color: '#50C878' },
    { name: 'Environment', value: 20, color: '#FFB347' },
    { name: 'Community', value: 15, color: '#FF6B6B' },
    { name: 'Emergency', value: 5, color: '#9B59B6' }
  ]

  const recentProjects = [
    {
      id: 1,
      title: 'Community Garden Initiative',
      volunteers: 45,
      hours: 320,
      status: 'Active',
      location: 'Jakarta'
    },
    {
      id: 2,
      title: 'Digital Literacy Program',
      volunteers: 28,
      hours: 180,
      status: 'Completed',
      location: 'Bandung'
    },
    {
      id: 3,
      title: 'Clean Water Project',
      volunteers: 67,
      hours: 450,
      status: 'Active',
      location: 'Surabaya'
    }
  ]

  const topVolunteers = [
    { name: 'Sarah Martinez', hours: 156, projects: 8, rating: 4.9 },
    { name: 'James Chen', hours: 142, projects: 7, rating: 4.8 },
    { name: 'Emma Patel', hours: 138, projects: 6, rating: 4.9 },
    { name: 'Alex Chen', hours: 125, projects: 5, rating: 4.7 },
    { name: 'Maria Johnson', hours: 118, projects: 6, rating: 4.8 }
  ]

  const pendingVerifications = [
    { id: 1, volunteer: 'Sarah Martinez', event: 'Community Garden Initiative', hours: 8, date: '2024-12-09', status: 'pending' },
    { id: 2, volunteer: 'James Chen', event: 'Digital Literacy Program', hours: 6, date: '2024-12-08', status: 'pending' },
    { id: 3, volunteer: 'Emma Patel', event: 'Clean Water Project', hours: 10, date: '2024-12-07', status: 'pending' },
    { id: 4, volunteer: 'Alex Chen', event: 'Food Distribution Drive', hours: 4, date: '2024-12-06', status: 'pending' }
  ]

  const upcomingEvents = [
    { id: 1, title: 'Beach Cleanup Drive', date: '2024-12-15', volunteers: 25, maxVolunteers: 50, location: 'Santa Monica Beach' },
    { id: 2, title: 'Food Bank Sorting', date: '2024-12-18', volunteers: 12, maxVolunteers: 30, location: 'Downtown Food Bank' },
    { id: 3, title: 'Tree Planting Event', date: '2024-12-22', volunteers: 8, maxVolunteers: 40, location: 'Central Park' }
  ]

  const handleVerifyHours = (verificationId: number, approved: boolean) => {
    // In real app, this would update the database
    console.log(`Verification ${verificationId} ${approved ? 'approved' : 'rejected'}`)
    // This would trigger an update to the volunteer's hours
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {needsVerification && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">Limited Access Mode</h3>
              <p className="mt-1 text-sm text-blue-700">
                You're currently viewing limited dashboard features. Complete your NGO verification to unlock full functionality including event management, volunteer verification, and detailed analytics.
              </p>
              <div className="mt-3">
                <button
                  onClick={() => setActiveTab('status')}
                  className="text-sm font-medium text-blue-800 hover:text-blue-900 underline"
                >
                  Complete Verification →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">{volunteerStats.totalVolunteers.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Total Volunteers</div>
          <div className="text-green-500 text-xs mt-1">+{volunteerStats.activeThisMonth} active</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">{volunteerStats.totalHours.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Total Hours</div>
          <div className="text-green-500 text-xs mt-1">+2,220 this month</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">{volunteerStats.projectsCompleted}</div>
          <div className="text-gray-600 text-sm">Projects Completed</div>
          <div className="text-green-500 text-xs mt-1">+8 this month</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-1">{volunteerStats.averageRating}</div>
          <div className="text-gray-600 text-sm">Avg Rating</div>
          <div className="text-green-500 text-xs mt-1">+0.2 this month</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">$45.2K</div>
          <div className="text-gray-600 text-sm">Impact Value</div>
          <div className="text-green-500 text-xs mt-1">+$8.5K this month</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volunteer Growth Chart */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Volunteer Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volunteers" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Categories */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Project Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectCategories}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {projectCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Projects & Top Volunteers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Recent Projects</h3>
            <button className="text-accent hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="border-l-4 border-accent pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{project.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {project.volunteers} volunteers
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {project.hours} hours
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {project.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Volunteers */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Top Volunteers</h3>
            <button className="text-accent hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {topVolunteers.map((volunteer, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-semibold">
                    {volunteer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{volunteer.name}</div>
                    <div className="text-sm text-gray-600">
                      {volunteer.hours} hours • {volunteer.projects} projects
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{volunteer.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderEvents = () => {
    if (needsVerification) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Required</h3>
          <p className="text-gray-600 mb-6">
            Event management is only available to verified NGOs. Please complete your verification to access this feature.
          </p>
          <button
            onClick={() => setActiveTab('status')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Check Verification Status
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Event Management</h3>
          <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark flex items-center gap-2">
            <Plus size={16} />
            Create New Event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-lg">{event.title}</h4>
                <span className="text-sm text-gray-500">{event.date}</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={16} />
                  <span>{event.volunteers}/{event.maxVolunteers} volunteers</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{ width: `${(event.volunteers / event.maxVolunteers) * 100}%` }}
                />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Edit Event
                </button>
                <button className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderVerification = () => {
    if (needsVerification) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Required</h3>
          <p className="text-gray-600 mb-6">
            Volunteer hour verification is only available to verified NGOs. Please complete your verification to access this feature.
          </p>
          <button
            onClick={() => setActiveTab('status')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Check Verification Status
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Volunteer Hour Verification</h3>
          <div className="text-sm text-gray-600">
            {pendingVerifications.length} pending verifications
          </div>
        </div>

        <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Volunteer</th>
                <th className="text-left py-3 px-4 font-semibold">Event</th>
                <th className="text-left py-3 px-4 font-semibold">Hours</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingVerifications.map((verification) => (
                <tr key={verification.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{verification.volunteer}</td>
                  <td className="py-3 px-4">{verification.event}</td>
                  <td className="py-3 px-4 font-semibold">{verification.hours}h</td>
                  <td className="py-3 px-4 text-gray-600">{verification.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleVerifyHours(verification.id, true)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center gap-1"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleVerifyHours(verification.id, false)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center gap-1"
                      >
                        <AlertCircle size={14} />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-6 bg-blue-50">
        <h4 className="font-semibold text-blue-900 mb-2">How Verification Works</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Volunteers submit their participation in events</li>
          <li>• NGOs verify attendance and hours worked</li>
          <li>• Approved hours are automatically added to volunteer profiles</li>
          <li>• Volunteers earn badges and certificates based on verified hours</li>
        </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NGO Dashboard</h1>
        <p className="text-gray-600">Manage volunteers, create events, and verify participation</p>
      </div>

      {/* Verification Status Banner */}
      {user?.verificationStatus !== 'approved' && (
        <div className="mb-8">
          {user?.verificationStatus === 'pending' ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">Verification Pending</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Your NGO verification is being reviewed. Some features may be limited until verification is complete.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setActiveTab('status')}
                    className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                  >
                    View Status
                  </button>
                </div>
              </div>
            </div>
          ) : user?.verificationStatus === 'rejected' ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">Verification Rejected</h3>
                  <p className="mt-1 text-sm text-red-700">
                    Your NGO verification was not approved. Please review the feedback and submit a new request.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setActiveTab('status')}
                    className="text-sm font-medium text-red-800 hover:text-red-900 underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-blue-800">Verification Required</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    To access all NGO features, please submit a verification request.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => window.location.href = '/verification-request'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Start Verification
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', requiresVerification: false },
              { key: 'events', label: 'Events', requiresVerification: true },
              { key: 'verification', label: 'Verification', requiresVerification: true },
              { key: 'status', label: 'Verification Status', requiresVerification: false }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                disabled={tab.requiresVerification && needsVerification}
                className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
                  activeTab === tab.key
                    ? 'border-accent text-accent'
                    : tab.requiresVerification && needsVerification
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.requiresVerification && needsVerification && (
                  <svg className="w-3 h-3 text-yellow-500 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'events' && renderEvents()}
      {activeTab === 'verification' && renderVerification()}
      {activeTab === 'status' && <VerificationStatusDashboard />}
    </div>
  )
}

