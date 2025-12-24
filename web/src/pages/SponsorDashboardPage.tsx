import { useAppSelector } from '../hooks/redux'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { DollarSign, Users, Award, TrendingUp, Eye, Heart, Target, BarChart3 } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

export default function SponsorDashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { t } = useTranslation()

  // Mock data for Sponsor dashboard
  const sponsorshipStats = {
    totalInvestment: 125000,
    volunteersReached: 3420,
    projectsSponsored: 28,
    impactScore: 94.5,
    brandExposure: 1250000
  }

  const investmentData = [
    { month: 'Aug', investment: 15000, impact: 850 },
    { month: 'Sep', investment: 18000, impact: 920 },
    { month: 'Oct', investment: 22000, impact: 1100 },
    { month: 'Nov', investment: 28000, impact: 1350 },
    { month: 'Dec', investment: 32000, impact: 1580 }
  ]

  const impactMetrics = [
    { category: 'Education', volunteers: 890, hours: 4200, investment: 35000 },
    { category: 'Healthcare', volunteers: 650, hours: 3100, investment: 28000 },
    { category: 'Environment', volunteers: 720, hours: 3800, investment: 32000 },
    { category: 'Community', volunteers: 580, hours: 2900, investment: 22000 },
    { category: 'Emergency', volunteers: 320, hours: 1800, investment: 18000 }
  ]

  const sponsoredProjects = [
    {
      id: 1,
      title: 'Tech Education for Underserved Communities',
      ngo: 'Digital Futures Foundation',
      investment: 25000,
      volunteers: 156,
      hours: 890,
      impact: 'High',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Clean Energy Initiative',
      ngo: 'Green Earth Alliance',
      investment: 18000,
      volunteers: 89,
      hours: 520,
      impact: 'Medium',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Youth Mentorship Program',
      ngo: 'Future Leaders Network',
      investment: 15000,
      volunteers: 67,
      hours: 380,
      impact: 'High',
      status: 'Active'
    }
  ]

  const brandMetrics = [
    { metric: 'Brand Mentions', value: '12.5K', change: '+18%' },
    { metric: 'Social Reach', value: '1.2M', change: '+25%' },
    { metric: 'Positive Sentiment', value: '94%', change: '+5%' },
    { metric: 'Media Coverage', value: '45', change: '+12%' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sponsor Dashboard</h1>
        <p className="text-gray-600">Track your social impact investment and brand engagement</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">${sponsorshipStats.totalInvestment.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Total Investment</div>
          <div className="text-green-500 text-xs mt-1">+$32K this month</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">{sponsorshipStats.volunteersReached.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Volunteers Reached</div>
          <div className="text-green-500 text-xs mt-1">+420 this month</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">{sponsorshipStats.projectsSponsored}</div>
          <div className="text-gray-600 text-sm">Projects Sponsored</div>
          <div className="text-green-500 text-xs mt-1">+5 this month</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-1">{sponsorshipStats.impactScore}</div>
          <div className="text-gray-600 text-sm">Impact Score</div>
          <div className="text-green-500 text-xs mt-1">+2.5 this month</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Eye className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">{(sponsorshipStats.brandExposure / 1000000).toFixed(1)}M</div>
          <div className="text-gray-600 text-sm">Brand Exposure</div>
          <div className="text-green-500 text-xs mt-1">+250K this month</div>
        </div>
      </div>

      {/* Investment & Impact Chart */}
      <div className="card p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Investment vs Impact Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={investmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="investment"
              stackId="1"
              stroke="#4A90E2"
              fill="#4A90E2"
              fillOpacity={0.6}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="impact"
              stackId="2"
              stroke="#50C878"
              fill="#50C878"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Impact by Category & Brand Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Impact by Category */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Impact by Category</h3>
          <div className="space-y-4">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="border-l-4 border-accent pl-4 py-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{metric.category}</h4>
                  <span className="text-green-600 font-bold">${metric.investment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{metric.volunteers} volunteers</span>
                  <span>{metric.hours} hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${(metric.volunteers / 1000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Metrics */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Brand Impact Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {brandMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-accent mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600 mb-1">{metric.metric}</div>
                <div className="text-xs text-green-500 font-semibold">{metric.change}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-semibold">CSR Impact Score</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">94.5/100</div>
            <div className="text-sm text-gray-600">Excellent social responsibility rating</div>
          </div>
        </div>
      </div>

      {/* Sponsored Projects */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Sponsored Projects</h3>
          <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors">
            Sponsor New Project
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Project</th>
                <th className="text-left py-3 px-4">NGO Partner</th>
                <th className="text-left py-3 px-4">Investment</th>
                <th className="text-left py-3 px-4">Volunteers</th>
                <th className="text-left py-3 px-4">Hours</th>
                <th className="text-left py-3 px-4">Impact</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {sponsoredProjects.map((project) => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold">{project.title}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{project.ngo}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    ${project.investment.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{project.volunteers}</td>
                  <td className="py-3 px-4">{project.hours}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.impact === 'High' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.impact}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'Active' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}