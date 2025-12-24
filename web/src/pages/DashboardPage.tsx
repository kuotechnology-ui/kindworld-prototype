import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { setSelectedMonth } from '../store/slices/dashboardSlice'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Clock, Award, Users, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { pointsHistory, leaderboard, selectedMonth } = useAppSelector((state) => state.dashboard)
  const { t } = useTranslation()

  const months = ['Dec 2025', 'Nov 2025', 'Oct 2025', 'Sept 2025', 'Aug 2025']

  // Month-specific data
  const monthlyData = {
    'Dec 2025': {
      hours: 530,
      projects: 23,
      organizations: 12,
      rating: 4.9,
      growth: 20,
      hoursChange: '+45',
      projectsChange: '+3',
      orgsChange: '+2',
      ratingChange: '+0.2'
    },
    'Nov 2025': {
      hours: 485,
      projects: 20,
      organizations: 10,
      rating: 4.7,
      growth: 15,
      hoursChange: '+38',
      projectsChange: '+2',
      orgsChange: '+1',
      ratingChange: '+0.1'
    },
    'Oct 2025': {
      hours: 447,
      projects: 18,
      organizations: 9,
      rating: 4.6,
      growth: 12,
      hoursChange: '+32',
      projectsChange: '+2',
      orgsChange: '+1',
      ratingChange: '+0.1'
    },
    'Sept 2025': {
      hours: 415,
      projects: 16,
      organizations: 8,
      rating: 4.5,
      growth: 18,
      hoursChange: '+42',
      projectsChange: '+3',
      orgsChange: '+2',
      ratingChange: '+0.2'
    },
    'Aug 2025': {
      hours: 373,
      projects: 13,
      organizations: 6,
      rating: 4.3,
      growth: 22,
      hoursChange: '+35',
      projectsChange: '+2',
      orgsChange: '+1',
      ratingChange: '+0.3'
    }
  }

  const currentData = monthlyData[selectedMonth as keyof typeof monthlyData]
  
  // Statistics data based on selected month
  const stats = [
    {
      icon: Clock,
      value: currentData.hours,
      label: t('stats.totalHours'),
      change: `${currentData.hoursChange} this month`,
      positive: true
    },
    {
      icon: Award,
      value: currentData.projects,
      label: t('stats.projects'),
      change: `${currentData.projectsChange} this month`,
      positive: true
    },
    {
      icon: Users,
      value: currentData.organizations,
      label: t('stats.organizations'),
      change: `${currentData.orgsChange} this month`,
      positive: true
    },
    {
      icon: Star,
      value: currentData.rating,
      label: t('stats.rating'),
      change: `${currentData.ratingChange} this month`,
      positive: true
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Month Selector */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => dispatch(setSelectedMonth(month))}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedMonth === month
                ? 'bg-black text-white'
                : 'bg-white border-2 border-gray-200 hover:border-accent'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Main Hours Card */}
      <div className="card p-8 mb-8">
        <div className="text-6xl font-bold mb-2">{currentData.hours.toLocaleString()}</div>
        <div className="text-xl text-gray-600 mb-4">{t('dashboard.volunteerHours')}</div>
        <div className="flex items-center gap-2 text-success font-semibold mb-4">
          <TrendingUp size={20} />
          <span>+{currentData.growth}% {t('dashboard.growth')}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Data for {selectedMonth}
        </div>
        <Link to="/badges" className="text-accent font-semibold text-lg hover:underline">
          {t('dashboard.viewBadges')} →
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold text-accent mb-2">{stat.value}</div>
              <div className="text-gray-600 mb-2">{stat.label}</div>
              <div className={`text-sm font-semibold ${stat.positive ? 'text-success' : 'text-red-500'}`}>
                {stat.change}
              </div>
            </div>
          )
        })}
      </div>

      {/* Hours Chart */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">{t('dashboard.hoursStatement')}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={pointsHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).getDate().toString()}
              stroke="#757575"
            />
            <YAxis stroke="#757575" />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Hours']}
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#4A90E2"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="card p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{t('dashboard.leaderboard')}</h2>
          <Link to="/leaderboard" className="text-accent font-semibold hover:underline">
            {t('dashboard.viewAll')}
          </Link>
        </div>
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((entry) => (
            <div
              key={entry.userId}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className={`text-xl font-bold min-w-[40px] ${
                  entry.rank <= 3 ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                {entry.rank}
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-semibold">
                {entry.displayName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold">
                  {entry.displayName}
                  {entry.userId === user?.id && ` (${t('dashboard.you')})`}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.floor(entry.compassionPoints / 50).toLocaleString()} {t('dashboard.hours')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
