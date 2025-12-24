import { useState } from 'react'
import { useAppSelector } from '../hooks/redux'
import { Award, Medal, Star, Trophy, Clock, Users, Target, CheckCircle } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

interface Badge {
  id: string
  name: string
  description: string
  icon: any
  hoursRequired: number
  company?: string
  type: 'certificate' | 'medal' | 'milestone'
  earned: boolean
  earnedDate?: string
  color: string
}

export default function BadgesPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'certificates' | 'medals' | 'milestones'>('all')
  
  const currentHours = user?.totalVolunteerHours || 530

  const badges: Badge[] = [
    // Milestones
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first 10 volunteer hours',
      icon: Target,
      hoursRequired: 10,
      type: 'milestone',
      earned: currentHours >= 10,
      earnedDate: currentHours >= 10 ? '2024-08-15' : undefined,
      color: 'bg-green-500'
    },
    {
      id: 'dedicated-helper',
      name: 'Dedicated Helper',
      description: 'Reach 50 volunteer hours',
      icon: Clock,
      hoursRequired: 50,
      type: 'milestone',
      earned: currentHours >= 50,
      earnedDate: currentHours >= 50 ? '2024-09-20' : undefined,
      color: 'bg-blue-500'
    },
    {
      id: 'community-champion',
      name: 'Community Champion',
      description: 'Complete 100 volunteer hours',
      icon: Users,
      hoursRequired: 100,
      type: 'milestone',
      earned: currentHours >= 100,
      earnedDate: currentHours >= 100 ? '2024-10-25' : undefined,
      color: 'bg-purple-500'
    },
    {
      id: 'volunteer-hero',
      name: 'Volunteer Hero',
      description: 'Achieve 250 volunteer hours',
      icon: Star,
      hoursRequired: 250,
      type: 'milestone',
      earned: currentHours >= 250,
      earnedDate: currentHours >= 250 ? '2024-11-30' : undefined,
      color: 'bg-yellow-500'
    },
    {
      id: 'impact-maker',
      name: 'Impact Maker',
      description: 'Complete 500+ volunteer hours',
      icon: Trophy,
      hoursRequired: 500,
      type: 'milestone',
      earned: currentHours >= 500,
      earnedDate: currentHours >= 500 ? '2024-12-10' : undefined,
      color: 'bg-red-500'
    },

    // Certificates
    {
      id: 'red-cross-cert',
      name: 'Red Cross Volunteer Certificate',
      description: 'Official recognition from Red Cross for 100+ hours',
      icon: Award,
      hoursRequired: 100,
      company: 'Red Cross',
      type: 'certificate',
      earned: currentHours >= 100,
      earnedDate: currentHours >= 100 ? '2024-10-25' : undefined,
      color: 'bg-red-600'
    },
    {
      id: 'unicef-cert',
      name: 'UNICEF Community Service Certificate',
      description: 'UNICEF certificate for dedicated community service (150+ hours)',
      icon: Award,
      hoursRequired: 150,
      company: 'UNICEF',
      type: 'certificate',
      earned: currentHours >= 150,
      earnedDate: currentHours >= 150 ? '2024-11-15' : undefined,
      color: 'bg-blue-600'
    },
    {
      id: 'habitat-cert',
      name: 'Habitat for Humanity Certificate',
      description: 'Recognition for housing assistance volunteer work (200+ hours)',
      icon: Award,
      hoursRequired: 200,
      company: 'Habitat for Humanity',
      type: 'certificate',
      earned: currentHours >= 200,
      earnedDate: currentHours >= 200 ? '2024-11-25' : undefined,
      color: 'bg-green-600'
    },
    {
      id: 'salvation-army-cert',
      name: 'Salvation Army Excellence Award',
      description: 'Excellence in community service certificate (300+ hours)',
      icon: Award,
      hoursRequired: 300,
      company: 'Salvation Army',
      type: 'certificate',
      earned: currentHours >= 300,
      earnedDate: currentHours >= 300 ? '2024-12-05' : undefined,
      color: 'bg-indigo-600'
    },

    // Medals
    {
      id: 'bronze-medal',
      name: 'Bronze Service Medal',
      description: 'Bronze medal for 100 hours of volunteer service',
      icon: Medal,
      hoursRequired: 100,
      type: 'medal',
      earned: currentHours >= 100,
      earnedDate: currentHours >= 100 ? '2024-10-25' : undefined,
      color: 'bg-amber-600'
    },
    {
      id: 'silver-medal',
      name: 'Silver Service Medal',
      description: 'Silver medal for 250 hours of volunteer service',
      icon: Medal,
      hoursRequired: 250,
      type: 'medal',
      earned: currentHours >= 250,
      earnedDate: currentHours >= 250 ? '2024-11-30' : undefined,
      color: 'bg-gray-400'
    },
    {
      id: 'gold-medal',
      name: 'Gold Service Medal',
      description: 'Gold medal for 500 hours of volunteer service',
      icon: Medal,
      hoursRequired: 500,
      type: 'medal',
      earned: currentHours >= 500,
      earnedDate: currentHours >= 500 ? '2024-12-10' : undefined,
      color: 'bg-yellow-400'
    },
    {
      id: 'platinum-medal',
      name: 'Platinum Excellence Medal',
      description: 'Platinum medal for 1000+ hours of exceptional service',
      icon: Medal,
      hoursRequired: 1000,
      type: 'medal',
      earned: currentHours >= 1000,
      color: 'bg-slate-300'
    }
  ]

  const filteredBadges = badges.filter(badge => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'certificates') return badge.type === 'certificate'
    if (selectedCategory === 'medals') return badge.type === 'medal'
    if (selectedCategory === 'milestones') return badge.type === 'milestone'
    return true
  })

  const earnedBadges = badges.filter(badge => badge.earned)
  const nextBadge = badges.find(badge => !badge.earned)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('badges.title')}</h1>
        <p className="text-gray-600">
          {t('badges.description')}
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-accent mb-2">{earnedBadges.length}</div>
          <div className="text-gray-600">{t('badges.earned')}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-accent mb-2">{currentHours}</div>
          <div className="text-gray-600">{t('badges.totalHours')}</div>
        </div>
        <div className="card p-6 text-center">
          {nextBadge ? (
            <>
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {nextBadge.hoursRequired - currentHours}
              </div>
              <div className="text-gray-600">{t('badges.nextBadge')}</div>
              <div className="text-sm text-gray-500 mt-1">{nextBadge.name}</div>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-green-500 mb-2">🎉</div>
              <div className="text-gray-600">{t('badges.allEarned')}</div>
            </>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {[
          { key: 'all', label: t('badges.all') },
          { key: 'milestones', label: t('badges.milestones') },
          { key: 'certificates', label: t('badges.certificates') },
          { key: 'medals', label: t('badges.medals') }
        ].map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key as any)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category.key
                ? 'bg-black text-white'
                : 'bg-white border-2 border-gray-200 hover:border-accent'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => {
          const IconComponent = badge.icon
          const progress = Math.min((currentHours / badge.hoursRequired) * 100, 100)
          
          return (
            <div
              key={badge.id}
              className={`card p-6 transition-all hover:shadow-lg ${
                badge.earned ? 'ring-2 ring-green-200' : 'opacity-75'
              }`}
            >
              {/* Badge Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                {badge.earned && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>

              {/* Badge Info */}
              <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{badge.description}</p>
              
              {badge.company && (
                <div className="text-xs text-accent font-medium mb-3">
                  Partner: {badge.company}
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{currentHours} / {badge.hoursRequired} hours</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      badge.earned ? 'bg-green-500' : 'bg-accent'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              {badge.earned ? (
                <div className="space-y-2">
                  <div className="text-sm text-green-600 font-medium">
                    ✓ {t('badges.earnedOn')} {badge.earnedDate}
                  </div>
                  {badge.type === 'certificate' && (
                    <button className="w-full bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors">
                      {t('badges.applyCertificate')}
                    </button>
                  )}
                  {badge.type === 'medal' && (
                    <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
                      {t('badges.claimMedal')}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  {badge.hoursRequired - currentHours} {t('badges.moreHours')}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}