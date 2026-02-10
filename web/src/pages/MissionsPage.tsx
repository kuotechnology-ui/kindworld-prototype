import { useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'

export default function MissionsPage() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')

  const regions = [
    { code: 'all', name: t('missions.allRegions') || 'All Regions' },
    { code: 'SEA', name: 'Southeast Asia' },
    { code: 'EA', name: 'East Asia' },
    { code: 'EU', name: 'Europe' },
    { code: 'NA', name: 'North America' },
    { code: 'OC', name: 'Oceania' }
  ]

  const missions = [
    {
      id: 1,
      title: 'Beach Cleanup Drive',
      description: 'Join us in cleaning up the local beach and protecting marine life.',
      category: 'environment',
      location: 'Santa Monica Beach',
      date: '2025-01-15',
      duration: '4 hours',
      participants: 45,
      maxParticipants: 60,
      points: 200,
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=200&fit=crop',
      organizer: 'Ocean Conservation NGO',
      difficulty: 'Easy',
      region: 'NA'
    },
    {
      id: 2,
      title: 'Food Distribution for Homeless',
      description: 'Help distribute meals to homeless individuals in downtown area.',
      category: 'community',
      location: 'Downtown Community Center',
      date: '2025-01-18',
      duration: '3 hours',
      participants: 28,
      maxParticipants: 40,
      points: 150,
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=200&fit=crop',
      organizer: 'City Food Bank',
      difficulty: 'Medium',
      region: 'SEA'
    },
    {
      id: 3,
      title: 'Tree Planting Initiative',
      description: 'Plant native trees in the city park to improve air quality.',
      category: 'environment',
      location: 'Central City Park',
      date: '2025-01-20',
      duration: '5 hours',
      participants: 67,
      maxParticipants: 80,
      points: 250,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop',
      organizer: 'Green Earth Foundation',
      difficulty: 'Hard',
      region: 'EU'
    },
    {
      id: 4,
      title: 'Senior Care Visit',
      description: 'Spend time with elderly residents at local nursing homes.',
      category: 'healthcare',
      location: 'Sunshine Senior Center',
      date: '2025-01-22',
      duration: '2 hours',
      participants: 15,
      maxParticipants: 25,
      points: 100,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=200&fit=crop',
      organizer: 'Elder Care Alliance',
      difficulty: 'Easy',
      region: 'EA'
    },
    {
      id: 5,
      title: 'Education Support Program',
      description: 'Tutor underprivileged children in math and reading skills.',
      category: 'education',
      location: 'Community Learning Center',
      date: '2025-01-25',
      duration: '3 hours',
      participants: 32,
      maxParticipants: 50,
      points: 180,
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=200&fit=crop',
      organizer: 'Education First NGO',
      difficulty: 'Medium',
      region: 'SEA'
    },
    {
      id: 6,
      title: 'Animal Shelter Support',
      description: 'Help care for rescued animals and assist with adoption events.',
      category: 'animals',
      location: 'Happy Paws Animal Shelter',
      date: '2025-01-28',
      duration: '4 hours',
      participants: 23,
      maxParticipants: 35,
      points: 200,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop',
      organizer: 'Animal Rescue Society',
      difficulty: 'Easy',
      region: 'OC'
    }
  ]

  const categories = [
    { id: 'all', name: t('missions.all'), icon: '🌟' },
    { id: 'environment', name: t('missions.environment'), icon: '🌱' },
    { id: 'community', name: t('missions.community'), icon: '🤝' },
    { id: 'healthcare', name: t('missions.healthcare'), icon: '🏥' },
    { id: 'education', name: t('missions.education'), icon: '📚' },
    { id: 'animals', name: t('missions.animals'), icon: '🐾' }
  ]

  const filteredMissions = missions.filter(mission => {
    const categoryMatch = selectedCategory === 'all' || mission.category === selectedCategory
    const regionMatch = selectedRegion === 'all' || mission.region === selectedRegion
    return categoryMatch && regionMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('missions.title')}</h1>
        <p className="text-gray-600">
          {t('missions.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                selectedCategory === category.id
                  ? 'bg-accent text-white'
                  : 'bg-white border-2 border-gray-200 hover:border-accent'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">🌍 {t('missions.region') || 'Region'}:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg bg-white focus:border-accent outline-none transition-colors"
          >
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => (
          <div key={mission.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
            {/* Mission Image */}
            <div className="relative">
              <img 
                src={mission.image} 
                alt={mission.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
                  {mission.difficulty}
                </span>
              </div>
            </div>

            {/* Mission Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{mission.title}</h3>
                <div className="flex items-center gap-1 text-accent font-bold">
                  <span>⭐</span>
                  <span>{mission.points}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {mission.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📍</span>
                  <span>{mission.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📅</span>
                  <span>{new Date(mission.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>⏰</span>
                  <span>{mission.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>🏢</span>
                  <span>{mission.organizer}</span>
                </div>
              </div>

              {/* Participants Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Participants</span>
                  <span>{mission.participants}/{mission.maxParticipants}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all"
                    style={{ width: `${(mission.participants / mission.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full py-2 px-4 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors font-medium">
                Join Mission
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMissions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No missions found</h3>
          <p className="text-gray-600">Try selecting a different category or check back later for new missions.</p>
        </div>
      )}
    </div>
  )
}