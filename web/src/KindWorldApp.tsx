import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  role: 'student' | 'ngo' | 'admin'
  hours: number
  email: string
  avatar: string
  joinDate: string
  badges: Badge[]
  completedMissions: number
  organizationsHelped: number
  rating: number
}

interface Badge {
  id: string
  name: string
  icon: string
  earnedDate: string
  company: string
}

interface Mission {
  id: number
  title: string
  description: string
  location: string
  date: string
  hours: number
  participants: string
  maxParticipants: number
  currentParticipants: number
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  organizer: string
  image: string
  joined: boolean
}

export default function KindWorldApp() {
  // Add CSS animations
  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    * { box-sizing: border-box; }
  `
  
  // Inject styles
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = styles
    if (!document.head.querySelector('style[data-kindworld]')) {
      styleSheet.setAttribute('data-kindworld', 'true')
      document.head.appendChild(styleSheet)
    }
  }
  const [currentPage, setCurrentPage] = useState<'landing' | 'signin' | 'dashboard' | 'missions' | 'certificates' | 'profile' | 'leaderboard' | 'analytics'>('landing')
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguage] = useState('en')
  const [selectedRole, setSelectedRole] = useState<'student' | 'ngo' | 'admin'>('student')
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [showMonthDetails, setShowMonthDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [showCreateActivity, setShowCreateActivity] = useState(false)
  const [showCertificateManager, setShowCertificateManager] = useState(false)
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    hours: 0,
    maxParticipants: 0,
    category: 'Community',
    difficulty: 'Easy'
  })
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    description: '',
    requiredHours: 0,
    template: 'standard'
  })
  const [showAdminCertManager, setShowAdminCertManager] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    hours: 0,
    role: 'student' as 'student' | 'ngo' | 'admin'
  })

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    id: { name: 'Indonesian', flag: '🇮🇩' },
    'zh-cn': { name: '简体中文', flag: '🇨🇳' },
    'zh-tw': { name: '繁體中文', flag: '🇹🇼' }
  }

  const translations = {
    en: {
      title: 'KindWorld',
      subtitle: 'Transform Kindness into Impact',
      getStarted: 'Get Started',
      signIn: 'Sign In',
      dashboard: 'Dashboard',
      missions: 'Missions',
      certificates: 'Certificates',
      profile: 'Profile',
      volunteerHours: 'Volunteer Hours',
      thisMonthHours: 'This Month Hours',
      selectRole: 'Choose your role:',
      student: 'Student - I want to volunteer',
      ngo: 'NGO - We create missions',
      admin: 'Admin - I manage the platform'
    },
    id: {
      title: 'KindWorld',
      subtitle: 'Mengubah Kebaikan Menjadi Dampak',
      getStarted: 'Mulai',
      signIn: 'Masuk',
      dashboard: 'Dasbor',
      missions: 'Misi',
      certificates: 'Sertifikat',
      profile: 'Profil',
      volunteerHours: 'Jam Sukarela',
      thisMonthHours: 'Jam Bulan Ini',
      selectRole: 'Pilih peran Anda:',
      student: 'Siswa - Saya ingin menjadi sukarelawan',
      ngo: 'LSM - Kami membuat misi',
      admin: 'Admin - Saya mengelola platform'
    },
    'zh-cn': {
      title: 'KindWorld',
      subtitle: '将善意转化为影响力',
      getStarted: '开始',
      signIn: '登录',
      dashboard: '仪表板',
      missions: '任务',
      certificates: '证书',
      profile: '个人资料',
      volunteerHours: '志愿服务小时',
      thisMonthHours: '本月小时',
      selectRole: '选择您的角色：',
      student: '学生 - 我想做志愿者',
      ngo: '非政府组织 - 我们创建任务',
      admin: '管理员 - 我管理平台'
    },
    'zh-tw': {
      title: 'KindWorld',
      subtitle: '將善意轉化為影響力',
      getStarted: '開始',
      signIn: '登入',
      dashboard: '儀表板',
      missions: '任務',
      certificates: '證書',
      profile: '個人資料',
      volunteerHours: '志願服務小時',
      thisMonthHours: '本月小時',
      selectRole: '選擇您的角色：',
      student: '學生 - 我想做志願者',
      ngo: '非政府組織 - 我們創建任務',
      admin: '管理員 - 我管理平台'
    }
  }

  const t = (key: string) => translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key

  const joinMission = (missionId: number) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, joined: !mission.joined, currentParticipants: mission.joined ? mission.currentParticipants - 1 : mission.currentParticipants + 1 }
        : mission
    ))
    
    const mission = missions.find(m => m.id === missionId)
    if (mission && !mission.joined) {
      setNotifications(prev => [...prev, `Successfully joined "${mission.title}"! 🎉`])
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#28a745'
      case 'Medium': return '#ffc107'
      case 'Hard': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Environment': return '🌱'
      case 'Community': return '🤝'
      case 'Healthcare': return '🏥'
      case 'Education': return '📚'
      case 'Animals': return '🐾'
      default: return '🌟'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notifications])

  const handleSignIn = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      const userData: User = {
        id: `user_${Date.now()}`,
        name: selectedRole === 'student' ? 'Alex Chen' : 
              selectedRole === 'ngo' ? 'Red Cross International' : 'System Administrator',
        role: selectedRole,
        hours: selectedRole === 'student' ? 530 : selectedRole === 'ngo' ? 2100 : 0,
        email: selectedRole === 'student' ? 'alex.chen@gmail.com' : 
               selectedRole === 'ngo' ? 'admin@redcross.org' : 'admin@kindworld.com',
        avatar: selectedRole === 'student' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' :
                selectedRole === 'ngo' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face' :
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        joinDate: '2024-08-15',
        badges: [
          { id: '1', name: 'Community Champion', icon: '🏆', earnedDate: '2024-12-01', company: 'Red Cross' },
          { id: '2', name: 'Environmental Hero', icon: '🌱', earnedDate: '2024-11-15', company: 'Green Earth' },
          { id: '3', name: 'Education Supporter', icon: '📚', earnedDate: '2024-10-20', company: 'UNICEF' }
        ],
        completedMissions: selectedRole === 'student' ? 23 : selectedRole === 'ngo' ? 67 : 0,
        organizationsHelped: selectedRole === 'student' ? 12 : selectedRole === 'ngo' ? 35 : 0,
        rating: selectedRole === 'student' ? 4.9 : selectedRole === 'ngo' ? 4.8 : 5.0
      }
      
      setUser(userData)
      setIsLoading(false)
      setCurrentPage('dashboard')
      setNotifications(['Welcome to KindWorld! 🎉', 'Your profile has been created successfully.'])
    }, 1500)
  }

  // Sample user data for admin dashboard
  const allUsers = [
    {
      id: 'user_001',
      name: 'Alex Chen',
      role: 'student' as const,
      email: 'alex.chen@gmail.com',
      hours: 530,
      joinDate: '2024-08-15',
      status: 'active',
      completedMissions: 23,
      badges: 8
    },
    {
      id: 'user_002', 
      name: 'Sarah Johnson',
      role: 'student' as const,
      email: 'sarah.j@gmail.com',
      hours: 342,
      joinDate: '2024-09-02',
      status: 'active',
      completedMissions: 15,
      badges: 5
    },
    {
      id: 'user_003',
      name: 'Red Cross International',
      role: 'ngo' as const,
      email: 'admin@redcross.org',
      hours: 2100,
      joinDate: '2024-07-10',
      status: 'verified',
      completedMissions: 67,
      badges: 12
    },
    {
      id: 'user_004',
      name: 'Michael Rodriguez',
      role: 'student' as const,
      email: 'mike.r@gmail.com',
      hours: 189,
      joinDate: '2024-10-20',
      status: 'active',
      completedMissions: 8,
      badges: 3
    },
    {
      id: 'user_005',
      name: 'UNICEF Foundation',
      role: 'ngo' as const,
      email: 'contact@unicef.org',
      hours: 1850,
      joinDate: '2024-06-25',
      status: 'verified',
      completedMissions: 45,
      badges: 10
    }
  ]

  const monthlyData = [
    { 
      month: 'Jul 2024', 
      shortMonth: 'Jul',
      hours: 38,
      missions: [
        { name: 'Beach Cleanup', hours: 15, date: '2024-07-05' },
        { name: 'Food Bank Help', hours: 12, date: '2024-07-15' },
        { name: 'Tree Planting', hours: 11, date: '2024-07-28' }
      ],
      totalMissions: 3,
      organizations: ['Ocean Care', 'City Food Bank', 'Green Earth']
    },
    { 
      month: 'Aug 2024', 
      shortMonth: 'Aug',
      hours: 45,
      missions: [
        { name: 'Senior Care Visit', hours: 18, date: '2024-08-03' },
        { name: 'Animal Shelter', hours: 14, date: '2024-08-12' },
        { name: 'Community Garden', hours: 13, date: '2024-08-25' }
      ],
      totalMissions: 3,
      organizations: ['Elder Care', 'Happy Paws', 'Green Community']
    },
    { 
      month: 'Sep 2024', 
      shortMonth: 'Sep',
      hours: 62,
      missions: [
        { name: 'Education Support', hours: 25, date: '2024-09-08' },
        { name: 'Homeless Outreach', hours: 20, date: '2024-09-18' },
        { name: 'Park Restoration', hours: 17, date: '2024-09-29' }
      ],
      totalMissions: 3,
      organizations: ['Learn Together', 'Hope Center', 'City Parks']
    },
    { 
      month: 'Oct 2024', 
      shortMonth: 'Oct',
      hours: 78,
      missions: [
        { name: 'Blood Drive Support', hours: 28, date: '2024-10-05' },
        { name: 'Library Program', hours: 22, date: '2024-10-15' },
        { name: 'Youth Mentoring', hours: 28, date: '2024-10-28' }
      ],
      totalMissions: 3,
      organizations: ['Red Cross', 'Public Library', 'Youth First']
    },
    { 
      month: 'Nov 2024', 
      shortMonth: 'Nov',
      hours: 85,
      missions: [
        { name: 'Thanksgiving Drive', hours: 32, date: '2024-11-10' },
        { name: 'Winter Clothing', hours: 28, date: '2024-11-20' },
        { name: 'Hospital Visit', hours: 25, date: '2024-11-28' }
      ],
      totalMissions: 3,
      organizations: ['Food Network', 'Warm Hearts', 'City Hospital']
    },
    { 
      month: 'Dec 2024', 
      shortMonth: 'Dec',
      hours: 95,
      missions: [
        { name: 'Holiday Toy Drive', hours: 35, date: '2024-12-08' },
        { name: 'Soup Kitchen', hours: 30, date: '2024-12-15' },
        { name: 'New Year Cleanup', hours: 30, date: '2024-12-30' }
      ],
      totalMissions: 3,
      organizations: ['Toys for All', 'Community Kitchen', 'Clean City']
    }
  ]

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: 'Ocean Cleanup Initiative',
      description: 'Join us in protecting marine life by cleaning up plastic waste from Santa Monica Beach. Help preserve our oceans for future generations.',
      location: 'Santa Monica Beach, CA',
      date: '2025-01-15',
      hours: 4,
      participants: '45/60',
      maxParticipants: 60,
      currentParticipants: 45,
      category: 'Environment',
      difficulty: 'Easy',
      organizer: 'Ocean Conservation Alliance',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop',
      joined: false
    },
    {
      id: 2,
      title: 'Community Food Drive',
      description: 'Help distribute nutritious meals to homeless individuals and families in need. Make a direct impact on hunger in our community.',
      location: 'Downtown Community Center',
      date: '2025-01-18',
      hours: 3,
      participants: '28/40',
      maxParticipants: 40,
      currentParticipants: 28,
      category: 'Community',
      difficulty: 'Medium',
      organizer: 'City Food Bank Network',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=250&fit=crop',
      joined: true
    },
    {
      id: 3,
      title: 'Urban Forest Expansion',
      description: 'Plant native trees to improve air quality and create green spaces. Help combat climate change one tree at a time.',
      location: 'Central City Park',
      date: '2025-01-20',
      hours: 5,
      participants: '67/80',
      maxParticipants: 80,
      currentParticipants: 67,
      category: 'Environment',
      difficulty: 'Hard',
      organizer: 'Green Earth Foundation',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=250&fit=crop',
      joined: false
    },
    {
      id: 4,
      title: 'Senior Care Companion Program',
      description: 'Spend quality time with elderly residents, providing companionship and emotional support to brighten their day.',
      location: 'Sunshine Senior Living Center',
      date: '2025-01-22',
      hours: 2,
      participants: '15/25',
      maxParticipants: 25,
      currentParticipants: 15,
      category: 'Healthcare',
      difficulty: 'Easy',
      organizer: 'Elder Care Alliance',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=250&fit=crop',
      joined: false
    },
    {
      id: 5,
      title: 'Youth Education Mentorship',
      description: 'Tutor underprivileged children in mathematics and reading skills. Help shape the next generation through education.',
      location: 'Community Learning Hub',
      date: '2025-01-25',
      hours: 3,
      participants: '32/50',
      maxParticipants: 50,
      currentParticipants: 32,
      category: 'Education',
      difficulty: 'Medium',
      organizer: 'Education First Initiative',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop',
      joined: false
    },
    {
      id: 6,
      title: 'Animal Shelter Support',
      description: 'Care for rescued animals and assist with adoption events. Help give abandoned pets a second chance at happiness.',
      location: 'Happy Paws Animal Sanctuary',
      date: '2025-01-28',
      hours: 4,
      participants: '23/35',
      maxParticipants: 35,
      currentParticipants: 23,
      category: 'Animals',
      difficulty: 'Easy',
      organizer: 'Animal Rescue Society',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop',
      joined: false
    }
  ])

  const certificates = [
    { 
      id: 1,
      name: 'Red Cross Volunteer Excellence Certificate', 
      hours: 100, 
      earned: true, 
      company: 'American Red Cross',
      description: 'Recognizes outstanding dedication to humanitarian service',
      icon: '🏥',
      type: 'certificate',
      earnedDate: '2024-10-25'
    },
    { 
      id: 2,
      name: 'UNICEF Community Impact Award', 
      hours: 150, 
      earned: true, 
      company: 'UNICEF',
      description: 'For exceptional commitment to children\'s welfare programs',
      icon: '🌍',
      type: 'certificate',
      earnedDate: '2024-11-15'
    },
    { 
      id: 3,
      name: 'Habitat for Humanity Builder Badge', 
      hours: 200, 
      earned: true, 
      company: 'Habitat for Humanity',
      description: 'Awarded for significant contributions to housing initiatives',
      icon: '🏠',
      type: 'certificate',
      earnedDate: '2024-11-25'
    },
    { 
      id: 4,
      name: 'Bronze Service Medal', 
      hours: 100, 
      earned: true, 
      company: 'KindWorld Foundation',
      description: 'First milestone in volunteer service excellence',
      icon: '🥉',
      type: 'medal',
      earnedDate: '2024-10-25'
    },
    { 
      id: 5,
      name: 'Silver Service Medal', 
      hours: 250, 
      earned: true, 
      company: 'KindWorld Foundation',
      description: 'Recognizes sustained commitment to community service',
      icon: '🥈',
      type: 'medal',
      earnedDate: '2024-11-30'
    },
    { 
      id: 6,
      name: 'Gold Service Medal', 
      hours: 500, 
      earned: true, 
      company: 'KindWorld Foundation',
      description: 'Highest honor for exceptional volunteer leadership',
      icon: '🥇',
      type: 'medal',
      earnedDate: '2024-12-10'
    },
    { 
      id: 7,
      name: 'Platinum Excellence Award', 
      hours: 1000, 
      earned: false, 
      company: 'KindWorld Foundation',
      description: 'Ultimate recognition for transformational community impact',
      icon: '💎',
      type: 'medal',
      earnedDate: null
    }
  ]

  // Landing Page
  if (currentPage === 'landing') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>

        {/* Header */}
        <nav style={{ 
          padding: '20px 40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>❤️</div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>{t('title')}</h1>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                style={{
                  padding: '10px 16px',
                  border: language === code ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
                  background: language === code ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  if (language !== code) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (language !== code) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          padding: '120px 40px 80px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(48px, 8vw, 72px)', 
            margin: '0 0 24px 0',
            fontWeight: '800',
            lineHeight: '1.1',
            background: 'linear-gradient(45deg, #ffffff, #f0f8ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            {t('title')}
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(20px, 3vw, 28px)', 
            opacity: 0.95,
            fontWeight: '300',
            lineHeight: '1.4',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            {t('subtitle')}
          </p>

          {/* Stats Preview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto 48px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>50K+</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Active Volunteers</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>1M+</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Hours Contributed</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>500+</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Partner Organizations</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('signin')}
            style={{
              padding: '20px 40px',
              fontSize: '20px',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>
              🚀 {t('getStarted')}
            </span>
          </button>
        </div>

        {/* Features Preview */}
        <div style={{
          padding: '80px 40px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '36px', 
              marginBottom: '48px',
              fontWeight: '700'
            }}>
              Why Choose KindWorld?
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px'
            }}>
              {[
                { icon: '📊', title: 'Track Impact', desc: 'Monitor your volunteer hours and see your real-world impact' },
                { icon: '🏆', title: 'Earn Recognition', desc: 'Get certificates and badges from top organizations' },
                { icon: '🌍', title: 'Global Community', desc: 'Connect with volunteers and NGOs worldwide' },
                { icon: '🎯', title: 'Find Missions', desc: 'Discover meaningful volunteer opportunities near you' }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '32px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '24px', marginBottom: '12px', fontWeight: '600' }}>{feature.title}</h3>
                  <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: '1.5' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    )
  }

  // Sign In Page
  if (currentPage === 'signin') {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>{t('signIn')}</h1>
          
          <div style={{ marginBottom: '30px' }}>
            <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>{t('selectRole')}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(['student', 'ngo', 'admin'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  style={{
                    padding: '15px',
                    border: selectedRole === role ? '2px solid #667eea' : '1px solid #ddd',
                    background: selectedRole === role ? '#f0f4ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {t(role)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSignIn}
            style={{
              width: '100%',
              padding: '15px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔗 {t('signIn')} with Google
          </button>

          <button
            onClick={() => setCurrentPage('landing')}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  // Main App (Dashboard, Missions, etc.)
  if (user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {/* Navigation */}
        <nav style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          padding: '20px 30px', 
          borderBottom: '1px solid rgba(0,0,0,0.1)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              K
            </div>
            <h1 style={{ 
              margin: 0, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {t('title')}
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Language Selector */}
            <div style={{ position: 'relative' }}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#333',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e1e5e9'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation Buttons */}
            {['dashboard', 'missions', 'certificates', 'profile'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page as any)}
                style={{
                  padding: '10px 20px',
                  background: currentPage === page 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'transparent',
                  color: currentPage === page ? 'white' : '#667eea',
                  border: currentPage === page ? 'none' : '2px solid #667eea',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize',
                  outline: 'none'
                }}
                onMouseOver={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                {t(page)}
              </button>
            ))}
            
            {/* User Profile & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px', paddingLeft: '20px', borderLeft: '1px solid #e1e5e9' }}>
              <div style={{
                width: '35px',
                height: '35px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{user.name}</span>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>{user.role}</span>
              </div>
              <button
                onClick={() => { setUser(null); setCurrentPage('landing') }}
                style={{ 
                  padding: '8px 16px', 
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '20px', 
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Notification System */}
        {notifications.length > 0 && (
          <div style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '400px'
          }}>
            {notifications.map((notification, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#2d3748',
                  animation: 'slideIn 0.3s ease-out',
                  cursor: 'pointer'
                }}
                onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
              >
                {notification}
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Dashboard */}
          {currentPage === 'dashboard' && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              {user.role === 'admin' ? (
                // Admin Dashboard
                <div>
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#2d3748',
                      marginBottom: '8px'
                    }}>
                      Admin Dashboard 🛠️
                    </h2>
                    <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>
                      Manage users, monitor platform activity, and oversee volunteer programs
                    </p>
                  </div>

                  {/* Admin Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    {[
                      { value: allUsers.length, label: 'Total Users', icon: '👥', color: '#667eea', bg: 'rgba(102, 126, 234, 0.1)' },
                      { value: allUsers.filter(u => u.role === 'student').length, label: 'Students', icon: '🎓', color: '#28a745', bg: 'rgba(40, 167, 69, 0.1)' },
                      { value: allUsers.filter(u => u.role === 'ngo').length, label: 'NGOs', icon: '🏢', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.1)' },
                      { value: allUsers.reduce((sum, u) => sum + u.hours, 0), label: 'Total Hours', icon: '⏰', color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.1)' }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.9)', 
                          backdropFilter: 'blur(10px)',
                          padding: '32px', 
                          borderRadius: '20px', 
                          textAlign: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)'
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <div style={{
                          width: '60px',
                          height: '60px',
                          background: stat.bg,
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px auto',
                          fontSize: '24px'
                        }}>
                          {stat.icon}
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '700', color: stat.color, marginBottom: '8px' }}>
                          {stat.value}
                        </div>
                        <div style={{ color: '#718096', fontSize: '14px', fontWeight: '500' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Admin Quick Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                    {/* Certificate Management */}
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      padding: '32px', 
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🏆 Global Certificate Manager
                      </h3>
                      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '20px' }}>
                        Create and manage platform-wide certificates and awards
                      </p>
                      <button 
                        onClick={() => setShowAdminCertManager(true)}
                        style={{
                        width: '100%',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      >
                        Manage Certificates
                      </button>
                    </div>

                    {/* Platform Analytics */}
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      padding: '32px', 
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📊 Platform Analytics
                      </h3>
                      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '20px' }}>
                        View detailed analytics and generate reports
                      </p>
                      <button style={{
                        width: '100%',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.4)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      >
                        View Analytics
                      </button>
                    </div>
                  </div>

                  {/* User Management Table */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    padding: '40px', 
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ marginBottom: '30px' }}>
                      <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                        👤 User Management
                      </h3>
                      <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
                        View and manage all registered users on the platform
                      </p>
                    </div>

                    {/* Table Header */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', 
                      gap: '16px', 
                      padding: '16px 20px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2d3748'
                    }}>
                      <div>User</div>
                      <div>Role</div>
                      <div>Hours</div>
                      <div>Missions</div>
                      <div>Badges</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>

                    {/* Table Rows */}
                    {allUsers.map((userData, index) => (
                      <div 
                        key={userData.id}
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', 
                          gap: '16px', 
                          padding: '20px',
                          background: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: '12px',
                          marginBottom: '12px',
                          alignItems: 'center',
                          transition: 'all 0.3s ease',
                          border: '1px solid rgba(0, 0, 0, 0.05)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: userData.role === 'student' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                                       userData.role === 'ngo' ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' :
                                       'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {userData.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>
                              {userData.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>
                              {userData.email}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: userData.role === 'student' ? 'rgba(102, 126, 234, 0.1)' :
                                     userData.role === 'ngo' ? 'rgba(40, 167, 69, 0.1)' :
                                     'rgba(231, 76, 60, 0.1)',
                          color: userData.role === 'student' ? '#667eea' :
                                userData.role === 'ngo' ? '#28a745' :
                                '#e74c3c'
                        }}>
                          {userData.role === 'student' ? '🎓 Student' : 
                           userData.role === 'ngo' ? '🏢 NGO' : '👑 Admin'}
                        </div>
                        
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>
                          {userData.hours}h
                        </div>
                        
                        <div style={{ fontSize: '14px', color: '#718096' }}>
                          {userData.completedMissions}
                        </div>
                        
                        <div style={{ fontSize: '14px', color: '#718096' }}>
                          {userData.badges}
                        </div>
                        
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: userData.status === 'active' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                          color: userData.status === 'active' ? '#28a745' : '#ffc107'
                        }}>
                          {userData.status === 'active' ? '✅ Active' : '⚡ Verified'}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => {
                              setEditingUser(userData)
                              setEditUserData({
                                name: userData.name,
                                email: userData.email,
                                hours: userData.hours,
                                role: userData.role
                              })
                              setShowEditUserModal(true)
                            }}
                            style={{
                            padding: '6px 12px',
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}>
                            Edit
                          </button>
                          <button 
                            onClick={() => {
                              setNotifications(prev => [...prev, `🏆 Certificate issued to ${userData.name}!`])
                            }}
                            style={{
                            padding: '6px 12px',
                            background: 'rgba(255, 193, 7, 0.1)',
                            color: '#ffc107',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}>
                            Award
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : user.role === 'ngo' ? (
                // NGO Dashboard
                <div>
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#2d3748',
                      marginBottom: '8px'
                    }}>
                      NGO Dashboard 🏢
                    </h2>
                    <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>
                      Create volunteer activities, manage certificates, and track community impact
                    </p>
                  </div>

                  {/* NGO Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    {[
                      { value: 45, label: 'Active Volunteers', icon: '👥', color: '#667eea', bg: 'rgba(102, 126, 234, 0.1)' },
                      { value: 12, label: 'Published Activities', icon: '📋', color: '#28a745', bg: 'rgba(40, 167, 69, 0.1)' },
                      { value: 156, label: 'Certificates Issued', icon: '🏆', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.1)' },
                      { value: 2850, label: 'Total Impact Hours', icon: '⏰', color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.1)' }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.9)', 
                          backdropFilter: 'blur(10px)',
                          padding: '32px', 
                          borderRadius: '20px', 
                          textAlign: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)'
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <div style={{
                          width: '60px',
                          height: '60px',
                          background: stat.bg,
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px auto',
                          fontSize: '24px'
                        }}>
                          {stat.icon}
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '700', color: stat.color, marginBottom: '8px' }}>
                          {stat.value}
                        </div>
                        <div style={{ color: '#718096', fontSize: '14px', fontWeight: '500' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                    {/* Create Activity */}
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      padding: '32px', 
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ➕ Create New Activity
                      </h3>
                      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '20px' }}>
                        Publish volunteer opportunities for the community
                      </p>
                      <button style={{
                        width: '100%',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.4)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      onClick={() => setShowCreateActivity(true)}
                      >
                        Create Activity
                      </button>
                    </div>

                    {/* Manage Certificates */}
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      padding: '32px', 
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🏆 Manage Certificates
                      </h3>
                      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '20px' }}>
                        Create and publish certificates for volunteers
                      </p>
                      <button style={{
                        width: '100%',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 193, 7, 0.4)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      onClick={() => setShowCertificateManager(true)}
                      >
                        Manage Certificates
                      </button>
                    </div>
                  </div>

                  {/* Published Activities */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    padding: '32px', 
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                        📋 Published Activities
                      </h3>
                      <button style={{
                        padding: '8px 16px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        View All
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                      {[
                        { 
                          title: 'Beach Cleanup Initiative', 
                          participants: 28, 
                          maxParticipants: 40, 
                          date: '2025-01-15',
                          status: 'Active',
                          certificates: 15
                        },
                        { 
                          title: 'Community Food Drive', 
                          participants: 35, 
                          maxParticipants: 50, 
                          date: '2025-01-20',
                          status: 'Active',
                          certificates: 22
                        },
                        { 
                          title: 'Senior Care Program', 
                          participants: 18, 
                          maxParticipants: 25, 
                          date: '2025-01-25',
                          status: 'Planning',
                          certificates: 8
                        }
                      ].map((activity, index) => (
                        <div key={index} style={{
                          padding: '20px',
                          background: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                          gap: '16px',
                          alignItems: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                        >
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                              {activity.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>
                              📅 {activity.date}
                            </div>
                          </div>
                          
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>
                              {activity.participants}/{activity.maxParticipants}
                            </div>
                            <div style={{ fontSize: '11px', color: '#718096' }}>Participants</div>
                          </div>
                          
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffc107' }}>
                              {activity.certificates}
                            </div>
                            <div style={{ fontSize: '11px', color: '#718096' }}>Certificates</div>
                          </div>
                          
                          <div style={{ textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: activity.status === 'Active' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                              color: activity.status === 'Active' ? '#28a745' : '#ffc107'
                            }}>
                              {activity.status}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button style={{
                              padding: '6px 12px',
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}>
                              Edit
                            </button>
                            <button 
                              onClick={() => {
                                setNotifications(prev => [...prev, `🏆 Certificate issued for "${activity.title}" - ${activity.certificates} volunteers will receive certificates!`])
                              }}
                              style={{
                              padding: '6px 12px',
                              background: 'rgba(255, 193, 7, 0.1)',
                              color: '#ffc107',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}>
                              Issue Certificates
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certificate Templates */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    padding: '32px', 
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                        🏆 Certificate Templates
                      </h3>
                      <button style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        + New Template
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      {[
                        { 
                          name: 'Volunteer Excellence Certificate',
                          description: 'For volunteers who complete 50+ hours',
                          downloads: 45,
                          status: 'Active'
                        },
                        { 
                          name: 'Community Impact Award',
                          description: 'For outstanding community service',
                          downloads: 28,
                          status: 'Active'
                        },
                        { 
                          name: 'Environmental Hero Certificate',
                          description: 'For environmental conservation activities',
                          downloads: 33,
                          status: 'Draft'
                        }
                      ].map((template, index) => (
                        <div key={index} style={{
                          padding: '24px',
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '16px',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                              {template.name}
                            </h4>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '10px',
                              fontWeight: '600',
                              background: template.status === 'Active' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                              color: template.status === 'Active' ? '#28a745' : '#ffc107'
                            }}>
                              {template.status}
                            </span>
                          </div>
                          
                          <p style={{ fontSize: '13px', color: '#718096', marginBottom: '16px', lineHeight: '1.4' }}>
                            {template.description}
                          </p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ fontSize: '12px', color: '#718096' }}>
                              📥 {template.downloads} downloads
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}>
                              Edit
                            </button>
                            <button style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: 'rgba(40, 167, 69, 0.1)',
                              color: '#28a745',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}>
                              Publish
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Create Activity Modal */}
                  {showCreateActivity && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                      backdropFilter: 'blur(5px)'
                    }}>
                      <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                            ➕ Create New Volunteer Activity
                          </h3>
                          <button
                            onClick={() => setShowCreateActivity(false)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '24px',
                              cursor: 'pointer',
                              color: '#718096',
                              padding: '5px'
                            }}
                          >
                            ✕
                          </button>
                        </div>

                        <div style={{ display: 'grid', gap: '20px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                              Activity Title *
                            </label>
                            <input
                              type="text"
                              value={newActivity.title}
                              onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                              placeholder="e.g., Beach Cleanup Initiative"
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                              Description *
                            </label>
                            <textarea
                              value={newActivity.description}
                              onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                              placeholder="Describe the volunteer activity and its impact..."
                              rows={4}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                                resize: 'vertical'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Location *
                              </label>
                              <input
                                type="text"
                                value={newActivity.location}
                                onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                                placeholder="e.g., Central Park, NYC"
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Date *
                              </label>
                              <input
                                type="date"
                                value={newActivity.date}
                                onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Duration (hours) *
                              </label>
                              <input
                                type="number"
                                value={newActivity.hours}
                                onChange={(e) => setNewActivity({...newActivity, hours: parseInt(e.target.value) || 0})}
                                min="1"
                                max="12"
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Max Participants *
                              </label>
                              <input
                                type="number"
                                value={newActivity.maxParticipants}
                                onChange={(e) => setNewActivity({...newActivity, maxParticipants: parseInt(e.target.value) || 0})}
                                min="1"
                                max="200"
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Category *
                              </label>
                              <select
                                value={newActivity.category}
                                onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.3s ease',
                                  background: 'white'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              >
                                <option value="Environment">🌱 Environment</option>
                                <option value="Community">🤝 Community</option>
                                <option value="Healthcare">🏥 Healthcare</option>
                                <option value="Education">📚 Education</option>
                                <option value="Animals">🐾 Animals</option>
                              </select>
                            </div>

                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Difficulty *
                              </label>
                              <select
                                value={newActivity.difficulty}
                                onChange={(e) => setNewActivity({...newActivity, difficulty: e.target.value as any})}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.3s ease',
                                  background: 'white'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              >
                                <option value="Easy">🟢 Easy</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="Hard">🔴 Hard</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <button
                              onClick={() => {
                                if (newActivity.title && newActivity.description && newActivity.location && newActivity.date && newActivity.hours > 0 && newActivity.maxParticipants > 0) {
                                  const newMission: Mission = {
                                    id: missions.length + 1,
                                    title: newActivity.title,
                                    description: newActivity.description,
                                    location: newActivity.location,
                                    date: newActivity.date,
                                    hours: newActivity.hours,
                                    participants: `0/${newActivity.maxParticipants}`,
                                    maxParticipants: newActivity.maxParticipants,
                                    currentParticipants: 0,
                                    category: newActivity.category,
                                    difficulty: newActivity.difficulty,
                                    organizer: user?.name || 'NGO',
                                    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop',
                                    joined: false
                                  }
                                  setMissions(prev => [...prev, newMission])
                                  setNotifications(prev => [...prev, `✅ Activity "${newActivity.title}" created successfully!`])
                                  setNewActivity({
                                    title: '',
                                    description: '',
                                    location: '',
                                    date: '',
                                    hours: 0,
                                    maxParticipants: 0,
                                    category: 'Community',
                                    difficulty: 'Easy'
                                  })
                                  setShowCreateActivity(false)
                                } else {
                                  setNotifications(prev => [...prev, '❌ Please fill in all required fields'])
                                }
                              }}
                              style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              🚀 Publish Activity
                            </button>
                            <button
                              onClick={() => setShowCreateActivity(false)}
                              style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: 'rgba(113, 128, 150, 0.1)',
                                color: '#718096',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Certificate Manager Modal */}
                  {showCertificateManager && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                      backdropFilter: 'blur(5px)'
                    }}>
                      <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        width: '90%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                            🏆 Certificate Template Manager
                          </h3>
                          <button
                            onClick={() => setShowCertificateManager(false)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '24px',
                              cursor: 'pointer',
                              color: '#718096',
                              padding: '5px'
                            }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Create New Certificate Section */}
                        <div style={{ 
                          background: 'rgba(102, 126, 234, 0.05)', 
                          padding: '24px', 
                          borderRadius: '16px', 
                          marginBottom: '30px',
                          border: '1px solid rgba(102, 126, 234, 0.1)'
                        }}>
                          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
                            ➕ Create New Certificate Template
                          </h4>
                          
                          <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Certificate Name *
                              </label>
                              <input
                                type="text"
                                value={newCertificate.name}
                                onChange={(e) => setNewCertificate({...newCertificate, name: e.target.value})}
                                placeholder="e.g., Environmental Hero Certificate"
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Description *
                              </label>
                              <textarea
                                value={newCertificate.description}
                                onChange={(e) => setNewCertificate({...newCertificate, description: e.target.value})}
                                placeholder="Describe what this certificate recognizes..."
                                rows={3}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.3s ease',
                                  resize: 'vertical'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                  Required Hours *
                                </label>
                                <input
                                  type="number"
                                  value={newCertificate.requiredHours}
                                  onChange={(e) => setNewCertificate({...newCertificate, requiredHours: parseInt(e.target.value) || 0})}
                                  min="1"
                                  max="1000"
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease'
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                              </div>

                              <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                  Template Style *
                                </label>
                                <select
                                  value={newCertificate.template}
                                  onChange={(e) => setNewCertificate({...newCertificate, template: e.target.value})}
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease',
                                    background: 'white'
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                >
                                  <option value="standard">📜 Standard Certificate</option>
                                  <option value="modern">✨ Modern Design</option>
                                  <option value="elegant">🎨 Elegant Style</option>
                                  <option value="corporate">🏢 Corporate Theme</option>
                                </select>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (newCertificate.name && newCertificate.description && newCertificate.requiredHours > 0) {
                                  setNotifications(prev => [...prev, `✅ Certificate template "${newCertificate.name}" created successfully!`])
                                  setNewCertificate({
                                    name: '',
                                    description: '',
                                    requiredHours: 0,
                                    template: 'standard'
                                  })
                                } else {
                                  setNotifications(prev => [...prev, '❌ Please fill in all required fields'])
                                }
                              }}
                              style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              🎯 Create Template
                            </button>
                          </div>
                        </div>

                        {/* Existing Templates */}
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
                            📋 Existing Certificate Templates
                          </h4>
                          
                          <div style={{ display: 'grid', gap: '16px' }}>
                            {[
                              { 
                                name: 'Volunteer Excellence Certificate',
                                description: 'For volunteers who complete 50+ hours',
                                requiredHours: 50,
                                downloads: 45,
                                status: 'Active',
                                template: 'standard'
                              },
                              { 
                                name: 'Community Impact Award',
                                description: 'For outstanding community service',
                                requiredHours: 100,
                                downloads: 28,
                                status: 'Active',
                                template: 'elegant'
                              },
                              { 
                                name: 'Environmental Hero Certificate',
                                description: 'For environmental conservation activities',
                                requiredHours: 75,
                                downloads: 33,
                                status: 'Draft',
                                template: 'modern'
                              }
                            ].map((template, index) => (
                              <div key={index} style={{
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '12px',
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                gap: '16px',
                                alignItems: 'center'
                              }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                                      {template.name}
                                    </h5>
                                    <span style={{
                                      padding: '4px 8px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      background: template.status === 'Active' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                      color: template.status === 'Active' ? '#28a745' : '#ffc107'
                                    }}>
                                      {template.status}
                                    </span>
                                  </div>
                                  <p style={{ fontSize: '13px', color: '#718096', marginBottom: '8px', lineHeight: '1.4' }}>
                                    {template.description}
                                  </p>
                                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#718096' }}>
                                    <span>⏰ {template.requiredHours} hours required</span>
                                    <span>📥 {template.downloads} downloads</span>
                                    <span>🎨 {template.template} template</span>
                                  </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button style={{
                                    padding: '8px 16px',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}>
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => {
                                      // Simulate certificate download
                                      setNotifications(prev => [...prev, `📥 Certificate template "${template.name}" downloaded successfully!`])
                                    }}
                                    style={{
                                    padding: '8px 16px',
                                    background: 'rgba(40, 167, 69, 0.1)',
                                    color: '#28a745',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}>
                                    Download
                                  </button>
                                  {template.status === 'Draft' && (
                                    <button style={{
                                      padding: '8px 16px',
                                      background: 'rgba(255, 193, 7, 0.1)',
                                      color: '#ffc107',
                                      border: 'none',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}>
                                      Publish
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Certificate Manager Modal */}
                  {showAdminCertManager && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                      backdropFilter: 'blur(5px)'
                    }}>
                      <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                            👑 Admin Certificate Manager
                          </h3>
                          <button
                            onClick={() => setShowAdminCertManager(false)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '24px',
                              cursor: 'pointer',
                              color: '#718096',
                              padding: '5px'
                            }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Platform-wide Certificate Creation */}
                        <div style={{ 
                          background: 'rgba(102, 126, 234, 0.05)', 
                          padding: '24px', 
                          borderRadius: '16px', 
                          marginBottom: '30px',
                          border: '1px solid rgba(102, 126, 234, 0.1)'
                        }}>
                          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
                            🌟 Create Platform Certificate
                          </h4>
                          
                          <div style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                  Certificate Name *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., KindWorld Champion Award"
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none'
                                  }}
                                />
                              </div>

                              <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                  Required Hours *
                                </label>
                                <input
                                  type="number"
                                  placeholder="500"
                                  min="1"
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none'
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                                Certificate Type *
                              </label>
                              <select style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                outline: 'none',
                                background: 'white'
                              }}>
                                <option value="platform">🏆 Platform Award (KindWorld Official)</option>
                                <option value="milestone">🎯 Milestone Certificate</option>
                                <option value="special">⭐ Special Recognition</option>
                                <option value="partnership">🤝 Partnership Certificate</option>
                              </select>
                            </div>

                            <button
                              onClick={() => {
                                setNotifications(prev => [...prev, '✅ Platform certificate created and published successfully!'])
                              }}
                              style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              🚀 Create & Publish Certificate
                            </button>
                          </div>
                        </div>

                        {/* All Platform Certificates */}
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
                            📋 All Platform Certificates
                          </h4>
                          
                          <div style={{ display: 'grid', gap: '16px' }}>
                            {[
                              { 
                                name: 'KindWorld Champion Award',
                                type: 'Platform Award',
                                requiredHours: 1000,
                                issued: 12,
                                status: 'Active',
                                creator: 'KindWorld Admin'
                              },
                              { 
                                name: 'Global Impact Certificate',
                                type: 'Special Recognition',
                                requiredHours: 500,
                                issued: 45,
                                status: 'Active',
                                creator: 'KindWorld Admin'
                              },
                              { 
                                name: 'Red Cross Excellence Award',
                                type: 'Partnership Certificate',
                                requiredHours: 100,
                                issued: 156,
                                status: 'Active',
                                creator: 'Red Cross International'
                              },
                              { 
                                name: 'UNICEF Community Hero',
                                type: 'Partnership Certificate',
                                requiredHours: 150,
                                issued: 89,
                                status: 'Active',
                                creator: 'UNICEF Foundation'
                              }
                            ].map((cert, index) => (
                              <div key={index} style={{
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '12px',
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                gap: '16px',
                                alignItems: 'center'
                              }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                                      {cert.name}
                                    </h5>
                                    <span style={{
                                      padding: '4px 8px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      background: 'rgba(40, 167, 69, 0.1)',
                                      color: '#28a745'
                                    }}>
                                      {cert.status}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                                    <span>🏆 {cert.type}</span>
                                    <span>⏰ {cert.requiredHours} hours</span>
                                    <span>📥 {cert.issued} issued</span>
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#718096' }}>
                                    Created by: {cert.creator}
                                  </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button style={{
                                    padding: '8px 16px',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}>
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setNotifications(prev => [...prev, `📊 Analytics for "${cert.name}" certificate generated!`])
                                    }}
                                    style={{
                                    padding: '8px 16px',
                                    background: 'rgba(40, 167, 69, 0.1)',
                                    color: '#28a745',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}>
                                    Analytics
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setNotifications(prev => [...prev, `⚠️ Certificate "${cert.name}" has been disabled.`])
                                    }}
                                    style={{
                                    padding: '8px 16px',
                                    background: 'rgba(231, 76, 60, 0.1)',
                                    color: '#e74c3c',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}>
                                    Disable
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit User Modal */}
                  {showEditUserModal && editingUser && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                      backdropFilter: 'blur(5px)'
                    }}>
                      <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                            ✏️ Edit User: {editingUser.name}
                          </h3>
                          <button
                            onClick={() => {
                              setShowEditUserModal(false)
                              setEditingUser(null)
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '24px',
                              cursor: 'pointer',
                              color: '#718096',
                              padding: '5px'
                            }}
                          >
                            ✕
                          </button>
                        </div>

                        <div style={{ display: 'grid', gap: '20px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={editUserData.name}
                              onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={editUserData.email}
                              onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                              Volunteer Hours *
                            </label>
                            <input
                              type="number"
                              value={editUserData.hours}
                              onChange={(e) => setEditUserData({...editUserData, hours: parseInt(e.target.value) || 0})}
                              min="0"
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                            />
                            <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                              Current: {editingUser.hours} hours
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                              User Role *
                            </label>
                            <select
                              value={editUserData.role}
                              onChange={(e) => setEditUserData({...editUserData, role: e.target.value as any})}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                outline: 'none',
                                background: 'white'
                              }}
                            >
                              <option value="student">🎓 Student/Volunteer</option>
                              <option value="ngo">🏢 NGO Organization</option>
                              <option value="admin">👑 Platform Admin</option>
                            </select>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <button
                              onClick={() => {
                                // Update user data simulation
                                setNotifications(prev => [...prev, `✅ User "${editUserData.name}" updated successfully! Hours: ${editUserData.hours}`])
                                setShowEditUserModal(false)
                                setEditingUser(null)
                              }}
                              style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              💾 Save Changes
                            </button>
                            <button
                              onClick={() => {
                                setShowEditUserModal(false)
                                setEditingUser(null)
                              }}
                              style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: 'rgba(113, 128, 150, 0.1)',
                                color: '#718096',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Student Dashboard
                <div>
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#2d3748',
                      marginBottom: '8px'
                    }}>
                      Welcome back, {user.name}! 👋
                    </h2>
                    <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>
                      Here's your volunteer impact summary
                    </p>
                  </div>

              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {(() => {
                  // Calculate current month hours (December 2024)
                  const currentMonthData = monthlyData.find(m => m.month === 'Dec 2024')
                  const thisMonthHours = currentMonthData ? currentMonthData.hours : 0
                  
                  return [
                    { value: user.hours, label: 'Total ' + t('volunteerHours'), icon: '⏰', color: '#667eea', bg: 'rgba(102, 126, 234, 0.1)' },
                    { value: thisMonthHours, label: t('thisMonthHours'), icon: '📅', color: '#28a745', bg: 'rgba(40, 167, 69, 0.1)' },
                    { value: 23, label: 'Projects Completed', icon: '🎯', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.1)' },
                    { value: 12, label: 'Organizations Helped', icon: '🏢', color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.1)' },
                    { value: '4.9', label: 'Average Rating', icon: '⭐', color: '#9c27b0', bg: 'rgba(156, 39, 176, 0.1)' }
                  ]
                })().map((stat, index) => (
                  <div 
                    key={index}
                    style={{ 
                      background: stat.label === t('thisMonthHours') 
                        ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)' 
                        : 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      padding: '32px', 
                      borderRadius: '20px', 
                      textAlign: 'center',
                      border: stat.label === t('thisMonthHours') 
                        ? '2px solid rgba(40, 167, 69, 0.3)' 
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: stat.label === t('thisMonthHours') 
                        ? '0 8px 32px rgba(40, 167, 69, 0.2)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)'
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* Special badge for monthly hours */}
                    {stat.label === t('thisMonthHours') && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        NEW
                      </div>
                    )}
                    
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: stat.bg,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px auto',
                      fontSize: '24px'
                    }}>
                      {stat.icon}
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: stat.color, marginBottom: '8px' }}>
                      {stat.value}
                    </div>
                    <div style={{ color: '#718096', fontSize: '14px', fontWeight: '500' }}>
                      {stat.label}
                    </div>
                    
                    {/* Additional info for monthly hours */}
                    {stat.label === t('thisMonthHours') && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#28a745', 
                        marginTop: '8px',
                        fontWeight: '600'
                      }}>
                        📈 December 2024
                      </div>
                    )}
                  </div>
                ))}
              </div>

                  {/* Interactive Chart Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: showMonthDetails ? '2fr 1fr' : '1fr', gap: '24px' }}>
                {/* Line Chart */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  padding: '40px', 
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                      📈 6-Month Volunteer Progress
                    </h3>
                    <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
                      Click on any point to see detailed breakdown for that month
                    </p>
                  </div>
                  
                  {/* SVG Line Chart */}
                  <div style={{ position: 'relative', height: '300px', marginBottom: '20px' }}>
                    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                      {/* Grid Lines */}
                      {[0, 25, 50, 75, 100].map((y) => (
                        <line
                          key={y}
                          x1="50"
                          y1={250 - (y * 2)}
                          x2="90%"
                          y2={250 - (y * 2)}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                      ))}
                      
                      {/* Y-axis labels */}
                      {[0, 25, 50, 75, 100].map((y) => (
                        <text
                          key={y}
                          x="30"
                          y={255 - (y * 2)}
                          fill="#718096"
                          fontSize="12"
                          textAnchor="end"
                        >
                          {y}h
                        </text>
                      ))}
                      
                      {/* Line Path */}
                      <path
                        d={`M 80 ${250 - (monthlyData[0].hours * 2)} ${monthlyData.map((data, index) => 
                          `L ${80 + (index * 120)} ${250 - (data.hours * 2)}`
                        ).join(' ')}`}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      
                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(102, 126, 234, 0.3)" />
                          <stop offset="100%" stopColor="rgba(102, 126, 234, 0.05)" />
                        </linearGradient>
                      </defs>
                      
                      {/* Area under curve */}
                      <path
                        d={`M 80 250 L 80 ${250 - (monthlyData[0].hours * 2)} ${monthlyData.map((data, index) => 
                          `L ${80 + (index * 120)} ${250 - (data.hours * 2)}`
                        ).join(' ')} L ${80 + ((monthlyData.length - 1) * 120)} 250 Z`}
                        fill="url(#areaGradient)"
                      />
                      
                      {/* Data Points */}
                      {monthlyData.map((data, index) => (
                        <g key={index}>
                          <circle
                            cx={80 + (index * 120)}
                            cy={250 - (data.hours * 2)}
                            r={selectedMonth === data.month ? "8" : "6"}
                            fill={selectedMonth === data.month ? "#764ba2" : "#667eea"}
                            stroke="white"
                            strokeWidth="3"
                            style={{ 
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              filter: selectedMonth === data.month ? 'drop-shadow(0 4px 8px rgba(118, 75, 162, 0.4))' : 'none'
                            }}
                            onClick={() => {
                              setSelectedMonth(data.month)
                              setShowMonthDetails(true)
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.setAttribute('r', '8')
                              e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4))'
                            }}
                            onMouseOut={(e) => {
                              if (selectedMonth !== data.month) {
                                e.currentTarget.setAttribute('r', '6')
                                e.currentTarget.style.filter = 'none'
                              }
                            }}
                          />
                          
                          {/* Month Labels */}
                          <text
                            x={80 + (index * 120)}
                            y="280"
                            fill="#718096"
                            fontSize="12"
                            textAnchor="middle"
                            fontWeight="500"
                          >
                            {data.shortMonth}
                          </text>
                          
                          {/* Hours Labels */}
                          <text
                            x={80 + (index * 120)}
                            y={240 - (data.hours * 2)}
                            fill="#2d3748"
                            fontSize="12"
                            textAnchor="middle"
                            fontWeight="600"
                          >
                            {data.hours}h
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                  
                  {/* Chart Legend */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        borderRadius: '50%' 
                      }}></div>
                      <span style={{ fontSize: '14px', color: '#718096' }}>Volunteer Hours</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '3px', 
                        background: '#e2e8f0', 
                        borderRadius: '2px' 
                      }}></div>
                      <span style={{ fontSize: '14px', color: '#718096' }}>Click points for details</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Month Details Panel */}
                {showMonthDetails && selectedMonth && (
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(15px)',
                    padding: '32px', 
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    animation: 'slideIn 0.4s ease-out',
                    position: 'relative'
                  }}>
                    {/* Header with Close Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div>
                        <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', margin: '0 0 4px 0' }}>
                          📅 {selectedMonth} Report
                        </h4>
                        <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
                          Your volunteer activity breakdown
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowMonthDetails(false)
                          setSelectedMonth(null)
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'rgba(113, 128, 150, 0.1)',
                          border: 'none',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#718096',
                          fontSize: '16px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)'
                          e.currentTarget.style.color = '#e74c3c'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(113, 128, 150, 0.1)'
                          e.currentTarget.style.color = '#718096'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    
                    {(() => {
                      const monthData = monthlyData.find(m => m.month === selectedMonth)
                      if (!monthData) return null
                      
                      return (
                        <div>
                          {/* Enhanced Month Summary Cards */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ 
                              padding: '20px', 
                              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', 
                              borderRadius: '16px',
                              border: '1px solid rgba(102, 126, 234, 0.2)'
                            }}>
                              <div style={{ fontSize: '28px', fontWeight: '700', color: '#667eea', marginBottom: '4px' }}>
                                {monthData.hours}
                              </div>
                              <div style={{ fontSize: '13px', color: '#718096', fontWeight: '500' }}>
                                ⏰ Total Hours
                              </div>
                            </div>
                            
                            <div style={{ 
                              padding: '20px', 
                              background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)', 
                              borderRadius: '16px',
                              border: '1px solid rgba(40, 167, 69, 0.2)'
                            }}>
                              <div style={{ fontSize: '28px', fontWeight: '700', color: '#28a745', marginBottom: '4px' }}>
                                {monthData.totalMissions}
                              </div>
                              <div style={{ fontSize: '13px', color: '#718096', fontWeight: '500' }}>
                                🎯 Missions Completed
                              </div>
                            </div>
                          </div>
                          
                          {/* Detailed Mission Timeline */}
                          <div style={{ marginBottom: '24px' }}>
                            <h5 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              📋 Mission Timeline
                            </h5>
                            <div style={{ position: 'relative' }}>
                              {/* Timeline Line */}
                              <div style={{
                                position: 'absolute',
                                left: '20px',
                                top: '0',
                                bottom: '0',
                                width: '2px',
                                background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '1px'
                              }}></div>
                              
                              {monthData.missions.map((mission, index) => (
                                <div key={index} style={{ 
                                  position: 'relative',
                                  paddingLeft: '50px',
                                  paddingBottom: index === monthData.missions.length - 1 ? '0' : '20px'
                                }}>
                                  {/* Timeline Dot */}
                                  <div style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '8px',
                                    width: '16px',
                                    height: '16px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '50%',
                                    border: '3px solid white',
                                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                                  }}></div>
                                  
                                  {/* Mission Card */}
                                  <div style={{ 
                                    padding: '16px 20px', 
                                    background: 'rgba(255, 255, 255, 0.8)', 
                                    borderRadius: '12px', 
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.3s ease'
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
                                  }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#2d3748' }}>
                                        {mission.name}
                                      </div>
                                      <div style={{
                                        padding: '4px 10px',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        color: '#667eea',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                      }}>
                                        {mission.hours}h
                                      </div>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#718096', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <span>📅 {new Date(mission.date).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}</span>
                                      <span>•</span>
                                      <span>⭐ Impact: High</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Organizations & Impact */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            <div>
                              <h5 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🏢 Partner Organizations
                              </h5>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {monthData.organizations.map((org, index) => (
                                  <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    background: 'rgba(40, 167, 69, 0.1)',
                                    color: '#28a745',
                                    borderRadius: '12px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    border: '1px solid rgba(40, 167, 69, 0.2)'
                                  }}>
                                    <span>🤝</span>
                                    <span>{org}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Month Comparison */}
                          <div style={{ 
                            marginTop: '24px', 
                            padding: '16px', 
                            background: 'rgba(102, 126, 234, 0.05)', 
                            borderRadius: '12px',
                            border: '1px solid rgba(102, 126, 234, 0.1)'
                          }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>
                              📊 Month Comparison
                            </div>
                            <div style={{ fontSize: '13px', color: '#718096' }}>
                              {(() => {
                                const currentIndex = monthlyData.findIndex(m => m.month === selectedMonth)
                                const previousMonth = currentIndex > 0 ? monthlyData[currentIndex - 1] : null
                                
                                if (previousMonth) {
                                  const hoursDiff = monthData.hours - previousMonth.hours
                                  const isIncrease = hoursDiff > 0
                                  
                                  return (
                                    <span>
                                      {isIncrease ? '📈' : '📉'} 
                                      {isIncrease ? '+' : ''}{hoursDiff} hours compared to {previousMonth.shortMonth} 
                                      ({isIncrease ? 'Great progress!' : 'Keep it up!'})
                                    </span>
                                  )
                                } else {
                                  return <span>🎯 This was your starting month - great beginning!</span>
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
                </div>
              )}
            </div>
          )}

          {/* Missions */}
          {currentPage === 'missions' && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  🎯 Available Missions
                </h2>
                <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>
                  Join volunteer missions and make a positive impact in your community
                </p>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {missions.map((mission, index) => (
                  <div 
                    key={mission.id} 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      padding: '32px', 
                      borderRadius: '20px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      animation: `slideIn 0.5s ease-in ${index * 0.1}s both`
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: '0 0 12px 0', 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: '#2d3748' 
                      }}>
                        {mission.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
                        <span style={{ color: '#718096', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          📍 {mission.location}
                        </span>
                        <span style={{ color: '#718096', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          📅 {mission.date}
                        </span>
                        <span style={{ color: '#718096', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ⏰ {mission.hours} hours
                        </span>
                      </div>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#667eea'
                      }}>
                        👥 {mission.participants} participants
                      </div>
                    </div>
                    <button 
                      style={{ 
                        padding: '12px 24px', 
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.4)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      Join Mission
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {currentPage === 'certificates' && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  🏆 Certificates & Awards
                </h2>
                <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>
                  Apply for official certificates and medals from partner organizations
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {certificates.map((cert, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      padding: '32px', 
                      borderRadius: '20px', 
                      border: cert.earned ? '2px solid #28a745' : '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: cert.earned 
                        ? '0 8px 32px rgba(40, 167, 69, 0.2)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: `slideIn 0.5s ease-in ${index * 0.1}s both`
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = cert.earned 
                        ? '0 12px 40px rgba(40, 167, 69, 0.3)' 
                        : '0 12px 40px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = cert.earned 
                        ? '0 8px 32px rgba(40, 167, 69, 0.2)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {cert.earned && (
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        Earned ✨
                      </div>
                    )}
                    
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: cert.earned 
                        ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                        : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                      fontSize: '24px'
                    }}>
                      {cert.earned ? '🏆' : '⏳'}
                    </div>

                    <h3 style={{ 
                      margin: '0 0 12px 0', 
                      color: cert.earned ? '#28a745' : '#718096',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}>
                      {cert.name}
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize: '14px', color: '#718096' }}>Required Hours</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>{cert.hours}h</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <span style={{ fontSize: '14px', color: '#718096' }}>Partner</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#667eea' }}>{cert.company}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: '#e2e8f0',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${Math.min((user?.hours || 0) / cert.hours * 100, 100)}%`,
                            height: '100%',
                            background: cert.earned 
                              ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    </div>

                    {cert.earned ? (
                      <button 
                        onClick={() => {
                          // Simulate certificate download
                          setNotifications(prev => [...prev, `📥 Certificate "${cert.name}" downloaded successfully! Check your downloads folder.`])
                          
                          // Create a simple certificate download simulation
                          const certificateContent = `
CERTIFICATE OF VOLUNTEER EXCELLENCE

This is to certify that

${user?.name || 'Volunteer'}

has successfully completed ${cert.hours} hours of volunteer service
and has earned the

${cert.name}

Issued by: ${cert.company}
Date: ${cert.earnedDate}
Certificate ID: CERT-${cert.id}-${Date.now()}

Thank you for your dedication to making the world a better place!
                          `
                          
                          const blob = new Blob([certificateContent], { type: 'text/plain' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `${cert.name.replace(/\s+/g, '_')}_Certificate.txt`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                        }}
                        style={{ 
                          width: '100%',
                          padding: '12px 20px', 
                          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '12px', 
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.4)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        📥 Download Certificate
                      </button>
                    ) : (
                      <div style={{ 
                        textAlign: 'center',
                        padding: '12px',
                        background: 'rgba(113, 128, 150, 0.1)',
                        borderRadius: '12px',
                        color: '#718096',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {cert.hours - (user?.hours || 0)} more hours needed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile */}
          {currentPage === 'profile' && (
            <div>
              <h2>Profile Settings</h2>
              <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '600px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
                  <input type="text" value={user.name} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                  <input type="email" value={user.email} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role:</label>
                  <select value={user.role} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                    <option value="student">Student</option>
                    <option value="company">Company</option>
                    <option value="ngo">NGO</option>
                  </select>
                </div>
                
                <h3>Language Preferences</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      style={{
                        padding: '15px',
                        border: language === code ? '2px solid #667eea' : '1px solid #ddd',
                        background: language === code ? '#f0f4ff' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>

                <button style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}