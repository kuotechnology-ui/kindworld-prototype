import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from './hooks/redux'
import { setLanguage as setReduxLanguage } from './store/slices/languageSlice'

interface User {
  id: string
  name: string
  role: 'student' | 'ngo' | 'admin'
  hours: number
  email: string
  avatar: string
  joinDate: string
  badges: Badge[]
  userBadges?: Badge[]
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
  organizerId?: string  // ID of the NGO user who created the mission
  image: string
  joined: boolean
  region?: string
  country?: string
}

export default function KindWorldApp() {
  // Add CSS animations and global styles
  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
      50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.5); }
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    ::selection {
      background: rgba(99, 102, 241, 0.2);
      color: #312e81;
    }
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
    }
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
  const [currentPage, setCurrentPage] = useState<'landing' | 'learnmore' | 'signin' | 'dashboard' | 'missions' | 'badges' | 'certificates' | 'profile' | 'friends' | 'badgeManagement'>('landing')
  const [badgeManagementUser, setBadgeManagementUser] = useState<any>(null)
  const [user, setUser] = useState<User | null>(null)

  // Use Redux for language management
  const dispatch = useAppDispatch()
  const { currentLanguage: language } = useAppSelector((state) => state.language)
  const setLanguage = (lang: string) => dispatch(setReduxLanguage(lang))
  const [userRegion, setUserRegion] = useState<string>('')
  const [userCountry, setUserCountry] = useState<string>('')
  const [showRegionSetup, setShowRegionSetup] = useState(false)
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=90&auto=format&fit=crop',
      title: 'Empower Communities',
      subtitle: 'Transform lives through compassionate action',
    },
    {
      url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=90&auto=format&fit=crop',
      title: 'Make a Difference',
      subtitle: 'Every hour of kindness creates lasting impact',
    },
    {
      url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=90&auto=format&fit=crop',
      title: 'Join the Movement',
      subtitle: 'Be part of a global network of changemakers',
    }
  ]

  useEffect(() => {
    if (currentPage === 'landing') {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [currentPage])

  // Load saved region and country from localStorage on mount
  useEffect(() => {
    const savedRegion = localStorage.getItem('kindworld_user_region')
    const savedCountry = localStorage.getItem('kindworld_user_country')
    if (savedRegion) {
      setUserRegion(savedRegion)
      setRegionFilter(savedRegion) // Also set the filter to the saved region
    }
    if (savedCountry) {
      setUserCountry(savedCountry)
    }
  }, [])

  const [selectedRole, setSelectedRole] = useState<'student' | 'ngo' | 'admin'>('student')
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [showMonthDetails, setShowMonthDetails] = useState(false)
  const [chartTimePeriod, setChartTimePeriod] = useState<'6months' | 'year' | 'allTime'>('6months')
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin')
  const [signInForm, setSignInForm] = useState({ email: '', password: '' })
  const [signInError, setSignInError] = useState('')
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    residency: '',
    country: ''
  })
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
    difficulty: 'Easy',
    region: 'SEA',
    country: ''
  })
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    description: '',
    requiredHours: 0,
    template: 'standard'
  })
  const [uploadedCertificates, setUploadedCertificates] = useState([
    {
      id: 1,
      name: 'Volunteer Excellence Certificate',
      fileName: 'volunteer_excellence.pdf',
      fileType: 'application/pdf',
      fileSize: '245 KB',
      previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
      requiredHours: 50,
      uploadedAt: '2025-12-15',
      issuedCount: 45,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Community Impact Award',
      fileName: 'community_impact.pdf',
      fileType: 'application/pdf',
      fileSize: '312 KB',
      previewUrl: 'https://images.unsplash.com/photo-1579389083395-4507e98b5e67?w=400&h=300&fit=crop',
      requiredHours: 100,
      uploadedAt: '2025-11-20',
      issuedCount: 28,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Environmental Hero Certificate',
      fileName: 'environmental_hero.png',
      fileType: 'image/png',
      fileSize: '1.2 MB',
      previewUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
      requiredHours: 75,
      uploadedAt: '2025-12-01',
      issuedCount: 33,
      status: 'Draft'
    }
  ])
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingMission, setEditingMission] = useState<any>(null)
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    hours: 0,
    role: 'student' as 'student' | 'ngo' | 'admin'
  })
  const [showJoinMissionModal, setShowJoinMissionModal] = useState(false)
  const [joiningMission, setJoiningMission] = useState<any>(null)
  const [missionRegistration, setMissionRegistration] = useState({
    fullName: '',
    phoneNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    medicalConditions: '',
    dietaryRestrictions: '',
    tshirtSize: 'M',
    transportation: 'own',
    specialSkills: '',
    agreeTerms: false
  })
  // Pending verifications - starts empty, gets populated when volunteers complete missions
  const [pendingVerifications, setPendingVerifications] = useState<Array<{
    id: number
    volunteerName: string
    missionTitle: string
    hoursSubmitted: number
    submittedDate: string
    status: string
    organizerId?: string  // Track which NGO this verification belongs to
  }>>([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  })
  const [showUserDetailModal, setShowUserDetailModal] = useState(false)
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null)
  // Generate default registrations for demo purposes
  const generateDefaultRegistrations = () => {
    const sampleVolunteers = [
      { id: 101, name: 'Sarah Johnson', email: 'sarah.j@email.com' },
      { id: 102, name: 'Michael Chen', email: 'mchen@email.com' },
      { id: 103, name: 'Emily Rodriguez', email: 'emily.r@email.com' },
      { id: 104, name: 'David Kim', email: 'dkim@email.com' },
      { id: 105, name: 'Jessica Lee', email: 'jlee@email.com' },
      { id: 106, name: 'Ryan Smith', email: 'rsmith@email.com' },
      { id: 107, name: 'Amanda Wong', email: 'awong@email.com' },
      { id: 108, name: 'Christopher Davis', email: 'cdavis@email.com' },
      { id: 109, name: 'Sophia Martinez', email: 'smartinez@email.com' },
      { id: 110, name: 'Daniel Brown', email: 'dbrown@email.com' },
      { id: 111, name: 'Olivia Wilson', email: 'owilson@email.com' },
      { id: 112, name: 'James Taylor', email: 'jtaylor@email.com' },
      { id: 113, name: 'Emma Anderson', email: 'eanderson@email.com' },
      { id: 114, name: 'William Thomas', email: 'wthomas@email.com' },
      { id: 115, name: 'Ava Jackson', email: 'ajackson@email.com' },
      { id: 116, name: 'Alexander White', email: 'awhite@email.com' },
      { id: 117, name: 'Isabella Harris', email: 'iharris@email.com' },
      { id: 118, name: 'Benjamin Clark', email: 'bclark@email.com' },
      { id: 119, name: 'Mia Lewis', email: 'mlewis@email.com' },
      { id: 120, name: 'Ethan Robinson', email: 'erobinson@email.com' }
    ]

    const registrations: {missionId: number, volunteer: any, registrationData: any}[] = []

    // Mission 1: 45 participants
    for (let i = 0; i < 20 && i < sampleVolunteers.length; i++) {
      registrations.push({
        missionId: 1,
        volunteer: sampleVolunteers[i],
        registrationData: { phoneNumber: `+1-555-${String(1000 + i).padStart(4, '0')}`, emergencyContact: 'Emergency Contact', emergencyPhone: '+1-555-9999' }
      })
    }

    // Mission 2: 28 participants
    for (let i = 0; i < 15 && i < sampleVolunteers.length; i++) {
      registrations.push({
        missionId: 2,
        volunteer: sampleVolunteers[i],
        registrationData: { phoneNumber: `+1-555-${String(2000 + i).padStart(4, '0')}`, emergencyContact: 'Emergency Contact', emergencyPhone: '+1-555-9999' }
      })
    }

    // Mission 3: 67 participants
    for (let i = 0; i < 20 && i < sampleVolunteers.length; i++) {
      registrations.push({
        missionId: 3,
        volunteer: sampleVolunteers[i],
        registrationData: { phoneNumber: `+1-555-${String(3000 + i).padStart(4, '0')}`, emergencyContact: 'Emergency Contact', emergencyPhone: '+1-555-9999' }
      })
    }

    // Mission 4: 15 participants
    for (let i = 0; i < 10 && i < sampleVolunteers.length; i++) {
      registrations.push({
        missionId: 4,
        volunteer: sampleVolunteers[i],
        registrationData: { phoneNumber: `+1-555-${String(4000 + i).padStart(4, '0')}`, emergencyContact: 'Emergency Contact', emergencyPhone: '+1-555-9999' }
      })
    }

    // Mission 5: 32 participants
    for (let i = 0; i < 18 && i < sampleVolunteers.length; i++) {
      registrations.push({
        missionId: 5,
        volunteer: sampleVolunteers[i],
        registrationData: { phoneNumber: `+1-555-${String(5000 + i).padStart(4, '0')}`, emergencyContact: 'Emergency Contact', emergencyPhone: '+1-555-9999' }
      })
    }

    // Mission 6: 23 participants
    for (let i = 0; i < 15 && i < sampleVolunteers.length; i++) {
      registrations.push({
        missionId: 6,
        volunteer: sampleVolunteers[i],
        registrationData: { phoneNumber: `+1-555-${String(6000 + i).padStart(4, '0')}`, emergencyContact: 'Emergency Contact', emergencyPhone: '+1-555-9999' }
      })
    }

    return registrations
  }

  // Mission registrations - starts empty, gets populated when volunteers join missions
  const [missionRegistrations, setMissionRegistrations] = useState<{missionId: number, volunteer: any, registrationData: any}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindworld_registrations')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          return []
        }
      }
    }
    return []
  })
  const [showParticipantList, setShowParticipantList] = useState(false)
  const [selectedMissionParticipants, setSelectedMissionParticipants] = useState<any>(null)
  const [showMissionDetail, setShowMissionDetail] = useState(false)
  const [selectedMissionDetail, setSelectedMissionDetail] = useState<Mission | null>(null)
  const [availableBadges] = useState([
    { id: 1, name: 'Rising Star', icon: '🌟', description: 'First 10 hours of volunteering' },
    { id: 2, name: 'Community Hero', icon: '💪', description: 'Completed 25+ missions' },
    { id: 3, name: 'Eco Warrior', icon: '🌱', description: 'Environmental missions champion' },
    { id: 4, name: 'Helping Hand', icon: '🤝', description: 'Helped 10+ organizations' },
    { id: 5, name: 'Super Volunteer', icon: '⭐', description: '100+ volunteer hours' }
  ])
  const [friendSearchQuery, setFriendSearchQuery] = useState('')
  const [friends, setFriends] = useState<{id: number, name: string, email: string, hours: number, avatar?: string, status: 'pending' | 'accepted'}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindworld_friends')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          return []
        }
      }
    }
    return []
  })
  const [friendRequests, setFriendRequests] = useState<{id: number, name: string, email: string, hours: number}[]>([
    { id: 101, name: 'Emma Wilson', email: 'emma.w@email.com', hours: 85 },
    { id: 102, name: 'James Lee', email: 'james.lee@email.com', hours: 120 }
  ])

  // All supported languages with complete translations
  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    id: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
    'zh-cn': { name: '简体中文', flag: '🇨🇳' },
    'zh-tw': { name: '繁體中文', flag: '🇹🇼' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' },
    pt: { name: 'Português', flag: '🇧🇷' },
    ja: { name: '日本語', flag: '🇯🇵' },
    ko: { name: '한국어', flag: '🇰🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    th: { name: 'ไทย', flag: '🇹🇭' },
    vi: { name: 'Tiếng Việt', flag: '🇻🇳' }
  }

  // Regions for volunteer assignment
  const regions = [
    { code: 'SEA', name: 'Southeast Asia', countries: ['Indonesia', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Philippines', 'Myanmar', 'Cambodia', 'Laos', 'Brunei'] },
    { code: 'EA', name: 'East Asia', countries: ['China', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong', 'Macau', 'Mongolia'] },
    { code: 'SAS', name: 'South Asia', countries: ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives'] },
    { code: 'EU', name: 'Europe', countries: ['United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Portugal', 'Poland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Greece', 'Czech Republic', 'Hungary', 'Romania'] },
    { code: 'NA', name: 'North America', countries: ['United States', 'Canada', 'Mexico'] },
    { code: 'SAM', name: 'South America', countries: ['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay'] },
    { code: 'ME', name: 'Middle East', countries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Israel', 'Jordan', 'Lebanon', 'Turkey'] },
    { code: 'AF', name: 'Africa', countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Ghana', 'Tanzania', 'Ethiopia', 'Uganda', 'Rwanda'] },
    { code: 'OC', name: 'Oceania', countries: ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea'] }
  ]

  const localTranslations: Record<string, Record<string, string>> = {
    en: {
      title: 'KindWorld',
      subtitle: 'Transform Kindness into Impact',
      getStarted: 'Get Started',
      signIn: 'Sign In',
      startVolunteering: 'Start Volunteering',
      learnMore: 'Learn More',
      dashboard: 'Dashboard',
      missions: 'Missions',
      certificates: 'Certificates',
      badges: 'Badges',
      friends: 'Friends',
      profile: 'Profile',
      volunteerHours: 'Volunteer Hours',
      thisMonthHours: 'This Month',
      selectRole: 'Choose your role:',
      student: 'Student - I want to volunteer',
      ngo: 'NGO - We create missions',
      admin: 'Admin - I manage the platform',
      welcomeBack: 'Welcome back',
      impactSummary: "Here's your volunteer impact summary",
      projectsCompleted: 'Projects Completed',
      organizationsHelped: 'Organizations Helped',
      averageRating: 'Average Rating',
      monthlyProgress: '6-Month Volunteer Progress',
      yearlyProgress: 'Yearly Volunteer Progress',
      allTimeProgress: 'All-Time Volunteer Progress',
      clickForDetails: 'Click on any point to see detailed breakdown',
      clickPointsForDetails: 'Click points for details',
      sixMonths: '6 Months',
      oneYear: '1 Year',
      allTime: 'All Time',
      logout: 'Logout',
      // Hero slides
      volunteerPlatform: 'VOLUNTEER PLATFORM',
      heroTitle1: 'Empower Communities',
      heroSubtitle1: 'Transform lives through compassionate action',
      heroTitle2: 'Make a Difference',
      heroSubtitle2: 'Every hour of kindness creates lasting impact',
      heroTitle3: 'Join the Movement',
      heroSubtitle3: 'Be part of a global network of changemakers',
      // Auth
      welcomeBackTitle: 'Welcome Back',
      createAccount: 'Create Account',
      signInToContinue: 'Sign in to continue your journey',
      joinKindWorld: 'Join KindWorld and make a difference',
      emailOrUsername: 'Email or Username',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      pleaseFillAllFields: 'Please enter your email and password',
      invalidCredentials: 'Invalid email or password',
      rememberMe: 'Remember me',
      noAccount: "Don't have an account?",
      registerNow: 'Register now',
      firstName: 'First Name',
      lastName: 'Last Name',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number',
      country: 'Country',
      cityResidency: 'City / Residency',
      confirmPassword: 'Confirm Password',
      minCharacters: 'Min. 8 characters',
      agreeTerms: 'I agree to the',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      orSignInWith: 'or sign in with',
      orRegisterWith: 'or register with',
      alreadyHaveAccount: 'Already have an account?',
      selectCountry: 'Select country',
      creatingAccount: 'Creating Account...',
      roleVolunteer: 'Volunteer',
      roleNGO: 'NGO',
      roleAdmin: 'Admin',
      // NGO Admin translations
      ngoWelcome: 'NGO Dashboard',
      manageMissions: 'Manage Missions',
      createMission: 'Create New Mission',
      pendingVerifications: 'Pending Hour Verifications',
      verifyHours: 'Verify Hours',
      approveHours: 'Approve',
      rejectHours: 'Reject',
      hoursToVerify: 'hours to verify',
      volunteerName: 'Volunteer Name',
      missionName: 'Mission Name',
      hoursSubmitted: 'Hours Submitted',
      submittedDate: 'Submitted Date',
      uploadCertificate: 'Upload Certificate',
      certificateName: 'Certificate Name',
      uploadFile: 'Upload File',
      dragDropFile: 'Drag and drop or click to upload',
      supportedFormats: 'Supported formats: PDF, PNG, JPG',
      publishCertificate: 'Publish Certificate',
      saveDraft: 'Save as Draft',
      // Profile translations
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      volunteerStats: 'Volunteer Statistics',
      totalVolunteerHours: 'Total Volunteer Hours',
      // Analytics translations
      viewAnalytics: 'View Analytics',
      totalMissions: 'Total Missions',
      activeVolunteers: 'Active Volunteers',
      hoursCompleted: 'Hours Completed',
      // Admin translations
      platformManagement: 'Platform Management',
      allMissions: 'All Missions',
      allUsers: 'All Users',
      removeMission: 'Remove Mission',
      manageBadges: 'Manage Badges',
      addBadge: 'Add Badge',
      removeBadge: 'Remove Badge',
      userDetails: 'User Details',
      editUser: 'Edit User',
      // Hours detail translations
      hoursBreakdown: 'Hours Breakdown',
      environmentHours: 'Environment',
      communityHours: 'Community',
      healthcareHours: 'Healthcare',
      educationHours: 'Education',
      // Learn More page translations
      discoverImpact: 'Discover Our Global Impact',
      discoverImpactSubtitle: 'Join a worldwide community of changemakers who are transforming lives, one volunteer hour at a time.',
      ourGlobalImpact: 'Our Global Impact',
      realNumbers: 'Real numbers from real volunteers making real change',
      activeInWorld: 'Active in Every Corner of the World',
      communitySpans: 'Our volunteer community spans across continents',
      volunteerHoursLogged: 'Volunteer Hours Logged',
      treesPlanted: 'Trees Planted',
      mealsServed: 'Meals Served',
      countriesReached: 'Countries Reached',
      partnerNGOs: 'Partner NGOs',
      backToHome: 'Back to Home',
      joinNow: 'Join Now',
      volunteers: 'Volunteers',
      countries: 'Countries',
      // Learn More page additional translations
      voicesFromCommunity: 'Voices from Our Community',
      realStoriesVolunteers: 'Real stories from volunteers around the world',
      hours: 'Hours',
      missionsLabel: 'Missions',
      trustedByOrganizations: 'Trusted by Leading Organizations',
      ngosUseKindWorld: 'NGOs worldwide use KindWorld to amplify their impact',
      volunteersLabel: 'Volunteers',
      missionsPosted: 'Missions Posted',
      alignedWithSDG: 'Aligned with UN Sustainable Development Goals',
      sdgDescription: 'Our missions contribute to global development goals, creating measurable impact on humanity\'s biggest challenges',
      readyToMakeMark: 'Ready to Make Your Mark?',
      joinThousands: 'Join thousands of volunteers and organizations creating positive change. Your journey to making a difference starts with a single step.',
      startVolunteeringBtn: 'Start Volunteering',
      registerYourNGO: 'Register Your NGO',
      trustedBy: 'Trusted by',
      partneredWith: 'Partnered with',
      activeIn: 'Active in',
      volunteersIn: 'volunteers in',
      hoursLoggedDesc: 'Hours dedicated to making communities better',
      treesPlantedDesc: 'Contributing to a greener planet',
      mealsServedDesc: 'Fighting hunger one meal at a time',
      countriesDesc: 'A truly global movement of kindness',
      activeVolunteersDesc: 'Growing community of changemakers',
      partnerNGOsDesc: 'Organizations creating impact',
      // Missions page translations
      availableMissionsTitle: 'Available Missions',
      availableMissionsSubtitle: 'Join volunteer missions and make a positive impact in your community',
      hoursLabel: 'hours',
      participantsLabel: 'participants',
      joinMission: 'Join Mission',
      leaveMission: 'Leave Mission',
      joinMissionTitle: 'Join Mission',
      viewDetails: 'View Details',
      manageMission: 'Manage',
      // NGO Missions page
      ngoMissionsTitle: 'Your Published Missions',
      ngoMissionsSubtitle: 'Manage your volunteer activities and track participation',
      // Admin Missions page
      adminMissionsTitle: 'All Platform Missions',
      adminMissionsSubtitle: 'Monitor and manage all volunteer activities on the platform',
      registrationForm: 'Registration Form',
      fullName: 'Full Name',
      emergencyContact: 'Emergency Contact',
      emergencyPhone: 'Emergency Phone',
      allergies: 'Allergies (if any)',
      medicalConditions: 'Medical Conditions',
      dietaryRestrictions: 'Dietary Restrictions',
      tshirtSize: 'T-Shirt Size',
      transportation: 'Transportation',
      ownTransport: 'Own Transport',
      needRide: 'Need Ride',
      publicTransport: 'Public Transport',
      specialSkills: 'Special Skills',
      agreeToTerms: 'I agree to the terms and conditions',
      cancel: 'Cancel',
      confirmRegistration: 'Confirm Registration',
      // Landing page translations
      activeVolunteersLabel: 'Active Volunteers',
      partnerNGOsLabel: 'Partner NGOs',
      hoursLoggedLabel: 'Hours Logged',
      citiesWorldwide: 'Cities Worldwide',
      howItWorks: 'HOW IT WORKS',
      journeyToImpact: 'Your Journey to Impact',
      journeySubtitle: 'A seamless platform designed to amplify your contribution to the community',
      discoverMissions: 'Discover Missions',
      discoverMissionsDesc: 'Find meaningful volunteer opportunities that match your passion',
      trackProgress: 'Track Progress',
      trackProgressDesc: 'Monitor your volunteer hours and see your impact grow',
      earnRecognition: 'Earn Recognition',
      earnRecognitionDesc: 'Get badges and certificates for your contributions',
      buildNetwork: 'Build Network',
      buildNetworkDesc: 'Connect with like-minded volunteers and organizations',
      testimonialsLabel: 'TESTIMONIALS',
      successStoriesTitle: 'Stories of Impact',
      successStoriesSubtitle: 'Real stories from volunteers and NGOs making a difference around the world',
      scrollLabel: 'SCROLL',
      hoursStats: 'Hours',
      missionsStats: 'Missions',
      volunteersStats: 'Volunteers',
      projectsStats: 'Projects',
      globalImpactTitle: 'Our Global Impact',
      globalImpactSubtitle: 'Together, we\'re creating meaningful change across the globe',
      activeCommunitiesTitle: 'Active Communities Worldwide',
      northAmerica: 'North America',
      europe: 'Europe',
      asiaPacific: 'Asia Pacific',
      latinAmerica: 'Latin America',
      africaMiddleEast: 'Africa & Middle East',
      africa: 'Africa',
      middleEast: 'Middle East',
      sdgTitle: 'Contributing to UN Sustainable Development Goals',
      sdgSubtitle: 'Our missions align with global efforts to create a better world',
      noPoverty: 'No Poverty',
      zeroHunger: 'Zero Hunger',
      goodHealth: 'Good Health',
      qualityEducation: 'Quality Education',
      reducedInequalities: 'Reduced Inequalities',
      sustainableCities: 'Sustainable Cities',
      climateAction: 'Climate Action',
      partnerships: 'Partnerships',
      readyToImpact: 'Ready to Make an Impact?',
      readyToImpactSubtitle: 'Join over 150,000 volunteers and 500+ organizations creating positive change in communities worldwide. Your journey starts today.',
      startVolunteeringToday: 'Start Volunteering Today',
      registerNGO: 'Register Your NGO',
      freeToJoin: 'Free to join',
      noCommitments: 'No commitments',
      startImpactImmediately: 'Start making impact immediately',
      footerTagline: 'Empowering volunteers worldwide',
      footerCopyright: 'KindWorld. All rights reserved.',
      // NGO Dashboard specific translations
      ngoDashboardTitle: 'NGO Dashboard',
      ngoDashboardSubtitle: 'Create volunteer activities, manage certificates, and track community impact',
      ngoActiveVolunteers: 'Active Volunteers',
      ngoPublishedActivities: 'Published Activities',
      ngoCertificatesIssued: 'Certificates Issued',
      ngoTotalImpactHours: 'Total Impact Hours',
      createNewActivity: 'Create New Activity',
      publishVolunteerOpportunities: 'Publish volunteer opportunities for the community',
      createActivity: 'Create Activity',
      manageCertificatesTitle: 'Manage Certificates',
      createPublishCertificates: 'Create and publish certificates for volunteers',
      allHoursVerified: 'All volunteer hours have been verified!',
      pendingStatus: 'Pending',
      viewAll: 'View All',
      noActivitiesYet: 'No activities published yet. Create your first activity!',
      participantsLabel2: 'Participants',
      durationLabel: 'Duration',
      upcomingStatus: 'Upcoming',
      completedStatus: 'Completed',
      editLabel: 'Edit',
      issueCertificates: 'Issue Certificates',
      yourCertificates: 'Your Certificates',
      uploadCertificateBtn: 'Upload Certificate',
      noCertificatesYet: 'No certificates uploaded yet',
      uploadFirstCertificate: 'Upload Your First Certificate',
      issuedLabel: 'issued',
      publishLabel: 'Publish',
      previewLabel: 'Preview',
      createNewVolunteerActivity: 'Create New Volunteer Activity',
      activityTitle: 'Activity Title',
      activityTitlePlaceholder: 'e.g., Beach Cleanup Initiative',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Describe the volunteer activity and its impact...',
      locationLabel: 'Location',
      locationPlaceholder: 'e.g., Central Park, NYC',
      dateLabel: 'Date',
      durationHours: 'Duration (hours)',
      maxParticipantsLabel: 'Max Participants',
      categoryLabel: 'Category',
      difficultyLabel: 'Difficulty',
      categoryEnvironment: 'Environment',
      categoryCommunity: 'Community',
      categoryHealthcare: 'Healthcare',
      categoryEducation: 'Education',
      categoryAnimals: 'Animals',
      difficultyEasy: 'Easy',
      difficultyMedium: 'Medium',
      difficultyHard: 'Hard',
      publishActivity: 'Publish Activity',
      organizationLabel: 'Organization',
      studentLabel: 'Student',
      ngosLabel: 'NGOs',
      // Participant list modal
      participantListTitle: 'Participant List',
      registeredParticipants: 'Registered Participants',
      noParticipantsYet: 'No participants registered yet.',
      closeLabel: 'Close',
      contactLabel: 'Contact',
      emergencyLabel: 'Emergency',
      // Admin Dashboard specific translations
      adminDashboardTitle: 'Admin Dashboard',
      adminDashboardSubtitle: 'Manage users, monitor platform activity, and oversee volunteer programs',
      totalUsersLabel: 'Total Users',
      volunteersLabel2: 'Volunteers',
      totalMissionsLabel: 'Total Missions',
      viewManageMissions: 'View and manage all volunteer missions posted on the platform',
      missionsCount: 'missions',
      volunteersCount: 'volunteers',
      addRemoveBadges: 'Add or remove badges for volunteers as recognition',
      badgesAvailable: 'badges available',
      openBadgeManager: 'Open Badge Manager',
      // NGO Management translations
      ngoApplications: 'NGO Applications',
      ngoApplicationsDesc: 'Review and approve NGO registration requests',
      pendingApplications: 'pending applications',
      approveNGO: 'Approve',
      rejectNGO: 'Reject',
      ngoListTitle: 'Registered NGOs',
      ngoListDesc: 'View all approved NGOs on the platform',
      registeredNGOs: 'registered NGOs',
      ngoName: 'Organization Name',
      ngoEmail: 'Email',
      ngoDescription: 'Description',
      ngoWebsite: 'Website',
      appliedOn: 'Applied on',
      approvedOn: 'Approved on',
      noApplications: 'No pending applications',
      adminLabel: 'Admin',
      activeStatus: 'Active',
      deleteLabel: 'Delete',
      manageLabel: 'Manage',
      confirmDelete: 'Are you sure you want to delete this mission?',
      backLabel: 'Back',
      detailsLabel: 'Details',
      totalHoursLabel: 'Total Hours',
      missionsCompletedLabel: 'Missions',
      badgesLabel: 'Badges',
      orgsHelpedLabel: 'Orgs Helped',
      roleLabel: 'Role',
      statusLabel: 'Status',
      joinDateLabel: 'Join Date',
      ratingLabel: 'Rating',
      reportLabel: 'Report',
      volunteerActivityBreakdown: 'Your volunteer activity breakdown',
      missionsCompleted: 'Missions Completed',
      missionTimeline: 'Mission Timeline',
      myBadges: 'My Badges',
      volunteerRole: 'Volunteer',
      uploadCertDescription: 'Upload your designed certificate for volunteers to receive after completing missions',
      certificateNameOptional: 'Certificate Name (Optional)',
      // Badge management translations
      badgeManagementCenter: 'Badge Management Center',
      badgeManagementDesc: 'Unlock and manage achievement badges for volunteers',
      selectUser: 'Select User',
      selectUserDesc: 'Select a User',
      selectUserDescLong: 'Choose a volunteer from the list on the left to manage their badges',
      allBadgesTitle: 'All Badges',
      clickToUnlockRemove: 'Click to unlock or remove',
      clickToRemove: 'Click to Remove',
      clickToUnlock: 'Click to Unlock',
      hoursUnit: 'hours',
      // Edit user modal
      editUserTitle: 'Edit User',
      fullNameLabel: 'Full Name',
      emailLabel: 'Email Address',
      volunteerHoursLabel: 'Volunteer Hours',
      userRoleLabel: 'User Role',
      studentVolunteerRole: 'Student/Volunteer',
      platformAdmin: 'Platform Admin',
      saveLabel: 'Save',
      cancelLabel: 'Cancel',
      userUpdatedSuccess: 'User updated successfully',
      profileUpdatedSuccess: 'Profile updated successfully!',
      // Profile page translations
      verifiedLabel: 'Verified',
      cancelEditLabel: 'Cancel Edit',
      totalHoursProfile: 'Total Hours',
      activitiesCompleted: 'Activities Completed',
      badgesEarned: 'Badges Earned',
      organizationsHelpedProfile: 'Organizations Helped',
      cityPlaceholder: 'New York, USA',
      backToDashboard: 'Back to Dashboard',
      // Badges page translations
      badgesDescription: 'Your achievements and recognition',
      earnedLabel: 'Earned',
      totalAvailable: 'Total Available',
      earnedBadgesTitle: 'Earned Badges',
      earnedOn: 'Earned ',
      noBadgesYet: "You haven't earned any badges yet",
      noBadgesDesc: 'Complete missions and accumulate volunteer hours to unlock badges!',
      allAvailableBadges: 'All Available Badges',
      lockedLabel: 'Locked',
      // User detail modal
      earnedBadgesLabel: 'Earned Badges',
      manageBadgesBtn: 'Manage Badges',
      // Friends page translations
      connectWithVolunteers: 'Connect with other volunteers',
      addFriend: 'Add Friend',
      searchFriendPlaceholder: 'Search by name or email...',
      sendRequest: 'Send Request',
      friendRequests: 'Friend Requests',
      accept: 'Accept',
      decline: 'Decline',
      myFriends: 'My Friends',
      noFriendsYet: 'No friends yet',
      startConnecting: 'Start connecting with other volunteers!',
      pendingLabel: 'Pending',
      removeFriend: 'Remove',
      pendingRequests: 'Pending Requests',
      requestSent: 'Request sent',
      cancelRequest: 'Cancel',
      // Admin user management table
      userManagementTitle: 'User Management',
      userManagementDesc: 'View and manage all registered users on the platform',
      tableHeaderUser: 'User',
      tableHeaderRole: 'Role',
      tableHeaderHours: 'Hours',
      tableHeaderMissions: 'Missions',
      tableHeaderBadges: 'Badges',
      tableHeaderStatus: 'Status',
      tableHeaderActions: 'Actions',
      roleStudentLabel: 'Student',
      roleNGOLabel: 'NGO',
      roleAdminLabel: 'Admin',
      statusActive: 'Active',
      statusVerified: 'Verified',
      // Create/Edit activity modal
      publishActivityBtn: 'Publish Activity',
      editMissionTitle: 'Edit Mission',
      titleLabelForm: 'Title',
      hoursLabelForm: 'Hours',
      maxParticipantsForm: 'Max Participants',
      categoryFormLabel: 'Category',
      difficultyFormLabel: 'Difficulty',
      saveChangesBtn: 'Save Changes',
      certificateManagerTitle: 'Certificate Manager',
      certificatesTitle: 'Certificates & Awards',
      certificatesSubtitle: 'Apply for official certificates and medals from partner organizations',
      // Profile page translations
      personalInformation: 'Personal Information',
      languageSettings: 'Language',
      volunteerInterests: 'Volunteer Interests',
      interestEnvironment: 'Environment',
      interestEducation: 'Education',
      interestHealthcare: 'Healthcare',
      interestCommunity: 'Community',
      interestAnimals: 'Animals',
      interestElderlyCare: 'Elderly Care',
      interestYouthPrograms: 'Youth Programs',
      interestFoodSecurity: 'Food Security',
      requiredHoursLabel: 'Required Hours',
      yourProgressLabel: 'Your Progress',
      signInFooterTagline: 'Empowering communities through compassionate action',
      signInFooterCopyright: '© 2026 KindWorld. All rights reserved.',
      noCertificatesUploadedYet: 'No certificates uploaded yet. Upload your first certificate above!',
      noCertificatesAvailableYet: 'No certificates available yet. Check back later!',
      transportOwn: 'Own transportation',
      transportCarpool: 'Need carpool',
      transportPublic: 'Public transit',
      selectRegion: 'Select Region',
      selectLanguage: 'Select Language',
      nearbyMissions: 'My Location',
      findMissions: 'Find Missions',
      allRegions: 'All Regions',
      allCountries: 'All Countries',
      regionSetup: 'Set Up Your Profile',
      regionSetupDesc: 'Help us find volunteer opportunities near you',
      yourRegion: 'Your Region',
      yourCountry: 'Your Country',
      preferredLanguage: 'Preferred Language',
      continueSetup: 'Continue',
      skipForNow: 'Skip for now'
    },
    id: {
      title: 'KindWorld',
      subtitle: 'Wujudkan Kebaikan Menjadi Dampak Nyata',
      getStarted: 'Mulai Sekarang',
      signIn: 'Masuk',
      startVolunteering: 'Mulai Menjadi Relawan',
      learnMore: 'Pelajari Selengkapnya',
      dashboard: 'Beranda',
      missions: 'Kegiatan',
      certificates: 'Sertifikat',
      badges: 'Lencana',
      friends: 'Teman',
      profile: 'Profil',
      volunteerHours: 'Jam Relawan',
      thisMonthHours: 'Bulan Ini',
      selectRole: 'Pilih peran Anda:',
      student: 'Relawan - Saya ingin menjadi sukarelawan',
      ngo: 'Organisasi - Kami menyelenggarakan kegiatan',
      admin: 'Admin - Saya mengelola platform',
      welcomeBack: 'Selamat datang kembali',
      impactSummary: 'Berikut ringkasan kontribusi relawan Anda',
      projectsCompleted: 'Kegiatan Selesai',
      organizationsHelped: 'Organisasi Terbantu',
      averageRating: 'Penilaian Rata-rata',
      monthlyProgress: 'Perkembangan 6 Bulan Terakhir',
      yearlyProgress: 'Perkembangan Tahunan',
      allTimeProgress: 'Perkembangan Keseluruhan',
      clickForDetails: 'Klik titik mana saja untuk melihat rincian',
      clickPointsForDetails: 'Klik untuk rincian',
      sixMonths: '6 Bulan',
      oneYear: '1 Tahun',
      allTime: 'Semua',
      logout: 'Keluar',
      // Hero slides
      volunteerPlatform: 'PLATFORM RELAWAN',
      heroTitle1: 'Berdayakan Komunitas',
      heroSubtitle1: 'Ubah kehidupan melalui aksi kebaikan',
      heroTitle2: 'Ciptakan Perubahan',
      heroSubtitle2: 'Setiap jam kebaikan menciptakan dampak yang bermakna',
      heroTitle3: 'Bergabung dengan Gerakan',
      heroSubtitle3: 'Jadilah bagian dari jaringan global para pembuat perubahan',
      // Auth
      welcomeBackTitle: 'Selamat Datang Kembali',
      createAccount: 'Buat Akun',
      signInToContinue: 'Masuk untuk melanjutkan perjalanan Anda',
      joinKindWorld: 'Bergabung dengan KindWorld dan wujudkan perubahan',
      emailOrUsername: 'Email atau Nama Pengguna',
      password: 'Kata Sandi',
      forgotPassword: 'Lupa Kata Sandi?',
      pleaseFillAllFields: 'Silakan masukkan email dan kata sandi Anda',
      invalidCredentials: 'Email atau kata sandi salah',
      rememberMe: 'Ingat saya',
      noAccount: 'Belum punya akun?',
      registerNow: 'Daftar sekarang',
      firstName: 'Nama Depan',
      lastName: 'Nama Belakang',
      emailAddress: 'Alamat Email',
      phoneNumber: 'Nomor Telepon',
      country: 'Negara',
      cityResidency: 'Kota Tempat Tinggal',
      confirmPassword: 'Konfirmasi Kata Sandi',
      minCharacters: 'Minimal 8 karakter',
      agreeTerms: 'Saya menyetujui',
      termsOfService: 'Syarat dan Ketentuan',
      and: 'dan',
      privacyPolicy: 'Kebijakan Privasi',
      orSignInWith: 'atau masuk dengan',
      orRegisterWith: 'atau daftar dengan',
      alreadyHaveAccount: 'Sudah punya akun?',
      selectCountry: 'Pilih negara',
      creatingAccount: 'Membuat Akun...',
      roleVolunteer: 'Relawan',
      roleNGO: 'Organisasi',
      roleAdmin: 'Admin',
      // NGO Admin translations
      ngoWelcome: 'Dasbor Organisasi',
      manageMissions: 'Kelola Kegiatan',
      createMission: 'Buat Kegiatan Baru',
      pendingVerifications: 'Verifikasi Jam Tertunda',
      verifyHours: 'Verifikasi Jam',
      approveHours: 'Setujui',
      rejectHours: 'Tolak',
      hoursToVerify: 'jam perlu diverifikasi',
      volunteerName: 'Nama Relawan',
      missionName: 'Nama Kegiatan',
      hoursSubmitted: 'Jam Diajukan',
      submittedDate: 'Tanggal Pengajuan',
      uploadCertificate: 'Unggah Sertifikat',
      certificateName: 'Nama Sertifikat',
      uploadFile: 'Unggah Berkas',
      dragDropFile: 'Seret dan lepas atau klik untuk mengunggah',
      supportedFormats: 'Format yang didukung: PDF, PNG, JPG',
      publishCertificate: 'Terbitkan Sertifikat',
      saveDraft: 'Simpan sebagai Draf',
      // Profile translations
      editProfile: 'Edit Profil',
      saveChanges: 'Simpan Perubahan',
      personalInfo: 'Informasi Pribadi',
      contactInfo: 'Informasi Kontak',
      volunteerStats: 'Statistik Relawan',
      totalVolunteerHours: 'Total Jam Relawan',
      // Analytics translations
      viewAnalytics: 'Lihat Analitik',
      totalMissions: 'Total Kegiatan',
      activeVolunteers: 'Relawan Aktif',
      hoursCompleted: 'Jam Tercatat',
      // Admin translations
      platformManagement: 'Manajemen Platform',
      allMissions: 'Semua Kegiatan',
      allUsers: 'Semua Pengguna',
      removeMission: 'Hapus Kegiatan',
      manageBadges: 'Kelola Lencana',
      addBadge: 'Tambah Lencana',
      removeBadge: 'Hapus Lencana',
      userDetails: 'Detail Pengguna',
      editUser: 'Edit Pengguna',
      // Hours detail translations
      hoursBreakdown: 'Rincian Jam',
      environmentHours: 'Lingkungan',
      communityHours: 'Komunitas',
      healthcareHours: 'Kesehatan',
      educationHours: 'Pendidikan',
      // Learn More page translations
      discoverImpact: 'Temukan Dampak Global Kami',
      discoverImpactSubtitle: 'Bergabunglah dengan komunitas pembuat perubahan yang mengubah kehidupan.',
      ourGlobalImpact: 'Dampak Global Kami',
      realNumbers: 'Data nyata dari relawan nyata yang menciptakan perubahan nyata',
      activeInWorld: 'Aktif di Setiap Sudut Dunia',
      communitySpans: 'Komunitas relawan kami tersebar di seluruh benua',
      volunteerHoursLogged: 'Jam Relawan Tercatat',
      treesPlanted: 'Pohon Ditanam',
      mealsServed: 'Makanan Disajikan',
      countriesReached: 'Negara Terjangkau',
      partnerNGOs: 'Organisasi Mitra',
      backToHome: 'Kembali ke Beranda',
      joinNow: 'Gabung Sekarang',
      volunteers: 'Relawan',
      countries: 'Negara',
      // Learn More page additional translations
      voicesFromCommunity: 'Suara dari Komunitas Kami',
      realStoriesVolunteers: 'Kisah nyata dari relawan di seluruh dunia',
      hours: 'Jam',
      missionsLabel: 'Kegiatan',
      trustedByOrganizations: 'Dipercaya oleh Organisasi Terkemuka',
      ngosUseKindWorld: 'Berbagai organisasi di seluruh dunia menggunakan KindWorld untuk memperkuat dampak mereka',
      volunteersLabel: 'Relawan',
      missionsPosted: 'Kegiatan Dipublikasikan',
      alignedWithSDG: 'Selaras dengan Tujuan Pembangunan Berkelanjutan PBB',
      sdgDescription: 'Kegiatan kami berkontribusi pada tujuan pembangunan global, menciptakan dampak terukur pada tantangan terbesar umat manusia',
      readyToMakeMark: 'Siap Membuat Jejak Anda?',
      joinThousands: 'Bergabunglah dengan ribuan relawan dan organisasi yang menciptakan perubahan positif. Perjalanan Anda untuk membuat perbedaan dimulai dengan satu langkah.',
      startVolunteeringBtn: 'Mulai Menjadi Relawan',
      registerYourNGO: 'Daftarkan Organisasi Anda',
      trustedBy: 'Dipercaya oleh',
      partneredWith: 'Bermitra dengan',
      activeIn: 'Aktif di',
      volunteersIn: 'relawan di',
      hoursLoggedDesc: 'Jam yang didedikasikan untuk membangun komunitas',
      treesPlantedDesc: 'Berkontribusi untuk planet yang lebih hijau',
      mealsServedDesc: 'Melawan kelaparan satu porsi dalam satu waktu',
      countriesDesc: 'Gerakan kebaikan yang benar-benar mendunia',
      activeVolunteersDesc: 'Komunitas pembuat perubahan yang terus berkembang',
      partnerNGOsDesc: 'Organisasi yang menciptakan dampak nyata',
      // Missions page translations
      availableMissionsTitle: 'Kegiatan Tersedia',
      availableMissionsSubtitle: 'Bergabunglah dengan kegiatan relawan dan ciptakan dampak positif di komunitas Anda',
      hoursLabel: 'jam',
      participantsLabel: 'peserta',
      joinMission: 'Ikuti Kegiatan',
      leaveMission: 'Keluar dari Kegiatan',
      joinMissionTitle: 'Ikuti Kegiatan',
      viewDetails: 'Lihat Detail',
      manageMission: 'Kelola',
      ngoMissionsTitle: 'Kegiatan Anda',
      ngoMissionsSubtitle: 'Kelola kegiatan sukarela dan pantau partisipasi',
      adminMissionsTitle: 'Semua Kegiatan Platform',
      adminMissionsSubtitle: 'Pantau dan kelola semua kegiatan sukarela di platform',
      registrationForm: 'Formulir Pendaftaran',
      fullName: 'Nama Lengkap',
      emergencyContact: 'Kontak Darurat',
      emergencyPhone: 'Telepon Darurat',
      allergies: 'Alergi (jika ada)',
      medicalConditions: 'Kondisi Medis',
      dietaryRestrictions: 'Pantangan Makanan',
      tshirtSize: 'Ukuran Kaos',
      transportation: 'Transportasi',
      ownTransport: 'Kendaraan Sendiri',
      needRide: 'Butuh Tumpangan',
      publicTransport: 'Transportasi Umum',
      specialSkills: 'Keahlian Khusus',
      agreeToTerms: 'Saya menyetujui syarat dan ketentuan',
      cancel: 'Batal',
      confirmRegistration: 'Konfirmasi Pendaftaran',
      // Landing page translations
      activeVolunteersLabel: 'Relawan Aktif',
      partnerNGOsLabel: 'Organisasi Mitra',
      hoursLoggedLabel: 'Jam Tercatat',
      citiesWorldwide: 'Kota di Seluruh Dunia',
      howItWorks: 'CARA KERJA',
      journeyToImpact: 'Perjalanan Menuju Dampak',
      journeySubtitle: 'Platform yang dirancang untuk memperkuat kontribusi Anda kepada komunitas',
      discoverMissions: 'Temukan Kegiatan',
      discoverMissionsDesc: 'Temukan peluang relawan bermakna yang sesuai dengan minat Anda',
      trackProgress: 'Lacak Kemajuan',
      trackProgressDesc: 'Pantau jam relawan Anda dan lihat dampak Anda berkembang',
      earnRecognition: 'Dapatkan Pengakuan',
      earnRecognitionDesc: 'Dapatkan lencana dan sertifikat atas kontribusi Anda',
      buildNetwork: 'Bangun Jaringan',
      buildNetworkDesc: 'Terhubung dengan relawan dan organisasi yang memiliki visi sama',
      testimonialsLabel: 'TESTIMONI',
      successStoriesTitle: 'Kisah Sukses',
      successStoriesSubtitle: 'Kisah nyata dari relawan dan organisasi yang membuat perbedaan di seluruh dunia',
      scrollLabel: 'GULIR',
      hoursStats: 'Jam',
      missionsStats: 'Kegiatan',
      volunteersStats: 'Relawan',
      projectsStats: 'Proyek',
      globalImpactTitle: 'Dampak Global Kami',
      globalImpactSubtitle: 'Bersama, kita menciptakan perubahan bermakna di seluruh dunia',
      activeCommunitiesTitle: 'Komunitas Aktif di Seluruh Dunia',
      northAmerica: 'Amerika Utara',
      europe: 'Eropa',
      asiaPacific: 'Asia Pasifik',
      latinAmerica: 'Amerika Latin',
      africaMiddleEast: 'Afrika & Timur Tengah',
      africa: 'Afrika',
      middleEast: 'Timur Tengah',
      sdgTitle: 'Berkontribusi pada Tujuan Pembangunan Berkelanjutan PBB',
      sdgSubtitle: 'Kegiatan kami selaras dengan upaya global untuk menciptakan dunia yang lebih baik',
      noPoverty: 'Tanpa Kemiskinan',
      zeroHunger: 'Tanpa Kelaparan',
      goodHealth: 'Kesehatan yang Baik',
      qualityEducation: 'Pendidikan Berkualitas',
      reducedInequalities: 'Mengurangi Ketimpangan',
      sustainableCities: 'Kota Berkelanjutan',
      climateAction: 'Aksi Iklim',
      partnerships: 'Kemitraan',
      readyToImpact: 'Siap Membuat Dampak?',
      readyToImpactSubtitle: 'Bergabunglah dengan 150.000+ relawan dan 500+ organisasi yang menciptakan perubahan positif di seluruh dunia. Perjalanan Anda dimulai hari ini.',
      startVolunteeringToday: 'Mulai Menjadi Relawan Hari Ini',
      registerNGO: 'Daftarkan Organisasi Anda',
      freeToJoin: 'Gratis untuk bergabung',
      noCommitments: 'Tanpa komitmen',
      startImpactImmediately: 'Mulai membuat dampak segera',
      footerTagline: 'Memberdayakan relawan di seluruh dunia',
      footerCopyright: 'KindWorld. Hak cipta dilindungi.',
      // NGO Dashboard specific translations
      ngoDashboardTitle: 'Dasbor Organisasi',
      ngoDashboardSubtitle: 'Buat kegiatan relawan, kelola sertifikat, dan lacak dampak terhadap komunitas',
      ngoActiveVolunteers: 'Relawan Aktif',
      ngoPublishedActivities: 'Kegiatan Dipublikasikan',
      ngoCertificatesIssued: 'Sertifikat Diterbitkan',
      ngoTotalImpactHours: 'Total Jam Kontribusi',
      createNewActivity: 'Buat Kegiatan Baru',
      publishVolunteerOpportunities: 'Publikasikan peluang relawan untuk komunitas',
      createActivity: 'Buat Kegiatan',
      manageCertificatesTitle: 'Kelola Sertifikat',
      createPublishCertificates: 'Buat dan publikasikan sertifikat untuk relawan',
      allHoursVerified: 'Semua jam relawan telah diverifikasi!',
      pendingStatus: 'Tertunda',
      viewAll: 'Lihat Semua',
      noActivitiesYet: 'Belum ada kegiatan yang dipublikasikan. Buat kegiatan pertama Anda!',
      participantsLabel2: 'Peserta',
      durationLabel: 'Durasi',
      upcomingStatus: 'Akan Datang',
      completedStatus: 'Selesai',
      editLabel: 'Edit',
      issueCertificates: 'Terbitkan Sertifikat',
      yourCertificates: 'Sertifikat Anda',
      uploadCertificateBtn: 'Unggah Sertifikat',
      noCertificatesYet: 'Belum ada sertifikat yang diunggah',
      uploadFirstCertificate: 'Unggah Sertifikat Pertama Anda',
      issuedLabel: 'diterbitkan',
      publishLabel: 'Publikasi',
      previewLabel: 'Pratinjau',
      createNewVolunteerActivity: 'Buat Kegiatan Relawan Baru',
      activityTitle: 'Judul Kegiatan',
      activityTitlePlaceholder: 'contoh: Aksi Bersih Pantai',
      descriptionLabel: 'Deskripsi',
      descriptionPlaceholder: 'Jelaskan kegiatan relawan dan dampaknya...',
      locationLabel: 'Lokasi',
      locationPlaceholder: 'contoh: Taman Kota, Jakarta',
      dateLabel: 'Tanggal',
      durationHours: 'Durasi (jam)',
      maxParticipantsLabel: 'Peserta Maksimal',
      categoryLabel: 'Kategori',
      difficultyLabel: 'Tingkat Kesulitan',
      categoryEnvironment: 'Lingkungan',
      categoryCommunity: 'Komunitas',
      categoryHealthcare: 'Kesehatan',
      categoryEducation: 'Pendidikan',
      categoryAnimals: 'Satwa',
      difficultyEasy: 'Mudah',
      difficultyMedium: 'Sedang',
      difficultyHard: 'Sulit',
      publishActivity: 'Publikasikan Kegiatan',
      organizationLabel: 'Organisasi',
      studentLabel: 'Relawan',
      ngosLabel: 'Organisasi',
      // Participant list modal
      participantListTitle: 'Daftar Peserta',
      registeredParticipants: 'Peserta Terdaftar',
      noParticipantsYet: 'Belum ada peserta yang mendaftar.',
      closeLabel: 'Tutup',
      contactLabel: 'Kontak',
      emergencyLabel: 'Darurat',
      // Admin Dashboard specific translations
      adminDashboardTitle: 'Dasbor Admin',
      adminDashboardSubtitle: 'Kelola pengguna, pantau aktivitas platform, dan awasi program relawan',
      totalUsersLabel: 'Total Pengguna',
      volunteersLabel2: 'Relawan',
      totalMissionsLabel: 'Total Kegiatan',
      viewManageMissions: 'Lihat dan kelola semua kegiatan relawan di platform',
      missionsCount: 'kegiatan',
      volunteersCount: 'relawan',
      addRemoveBadges: 'Tambah atau hapus lencana untuk relawan',
      badgesAvailable: 'lencana tersedia',
      openBadgeManager: 'Buka Pengelola Lencana',
      // NGO Management translations
      ngoApplications: 'Pengajuan Organisasi',
      ngoApplicationsDesc: 'Tinjau dan setujui permintaan pendaftaran organisasi',
      pendingApplications: 'pengajuan tertunda',
      approveNGO: 'Setujui',
      rejectNGO: 'Tolak',
      ngoListTitle: 'Organisasi Terdaftar',
      ngoListDesc: 'Lihat semua organisasi yang disetujui di platform',
      registeredNGOs: 'organisasi terdaftar',
      ngoName: 'Nama Organisasi',
      ngoEmail: 'Email',
      ngoDescription: 'Deskripsi',
      ngoWebsite: 'Situs Web',
      appliedOn: 'Diajukan pada',
      approvedOn: 'Disetujui pada',
      noApplications: 'Tidak ada pengajuan tertunda',
      adminLabel: 'Admin',
      activeStatus: 'Aktif',
      deleteLabel: 'Hapus',
      manageLabel: 'Kelola',
      confirmDelete: 'Apakah Anda yakin ingin menghapus kegiatan ini?',
      backLabel: 'Kembali',
      detailsLabel: 'Detail',
      totalHoursLabel: 'Total Jam',
      missionsCompletedLabel: 'Kegiatan',
      badgesLabel: 'Lencana',
      orgsHelpedLabel: 'Organisasi',
      roleLabel: 'Peran',
      statusLabel: 'Status',
      joinDateLabel: 'Tanggal Bergabung',
      ratingLabel: 'Penilaian',
      reportLabel: 'Laporan',
      volunteerActivityBreakdown: 'Rincian aktivitas relawan Anda',
      missionsCompleted: 'Kegiatan Selesai',
      missionTimeline: 'Linimasa Kegiatan',
      myBadges: 'Lencana Saya',
      volunteerRole: 'Relawan',
      uploadCertDescription: 'Unggah sertifikat yang sudah Anda desain untuk diberikan kepada relawan setelah menyelesaikan kegiatan',
      certificateNameOptional: 'Nama Sertifikat (Opsional)',
      // Badge management translations
      badgeManagementCenter: 'Pusat Pengelolaan Lencana',
      badgeManagementDesc: 'Buka dan kelola lencana pencapaian untuk relawan',
      selectUser: 'Pilih Pengguna',
      selectUserDesc: 'Pilih Pengguna',
      selectUserDescLong: 'Pilih relawan dari daftar di sebelah kiri untuk mengelola lencana mereka',
      allBadgesTitle: 'Semua Lencana',
      clickToUnlockRemove: 'Klik untuk membuka atau menghapus',
      clickToRemove: 'Klik untuk Menghapus',
      clickToUnlock: 'Klik untuk Membuka',
      hoursUnit: 'jam',
      // Edit user modal
      editUserTitle: 'Edit Pengguna',
      fullNameLabel: 'Nama Lengkap',
      emailLabel: 'Email',
      volunteerHoursLabel: 'Jam Relawan',
      userRoleLabel: 'Peran',
      studentVolunteerRole: 'Relawan',
      platformAdmin: 'Admin',
      saveLabel: 'Simpan',
      cancelLabel: 'Batal',
      userUpdatedSuccess: 'Pengguna berhasil diperbarui',
      profileUpdatedSuccess: 'Profil berhasil diperbarui!',
      // Profile page translations
      verifiedLabel: 'Terverifikasi',
      cancelEditLabel: 'Batalkan',
      totalHoursProfile: 'Total Jam',
      activitiesCompleted: 'Kegiatan Selesai',
      badgesEarned: 'Lencana',
      organizationsHelpedProfile: 'Organisasi Terbantu',
      cityPlaceholder: 'Jakarta, Indonesia',
      backToDashboard: 'Kembali ke Dasbor',
      // Badges page translations
      badgesDescription: 'Pencapaian dan pengakuan Anda',
      earnedLabel: 'Diperoleh',
      totalAvailable: 'Total Tersedia',
      earnedBadgesTitle: 'Lencana yang Diperoleh',
      earnedOn: 'Diperoleh pada ',
      noBadgesYet: 'Anda belum memiliki lencana',
      noBadgesDesc: 'Selesaikan kegiatan dan kumpulkan jam relawan untuk membuka lencana!',
      allAvailableBadges: 'Semua Lencana Tersedia',
      lockedLabel: 'Terkunci',
      // User detail modal
      earnedBadgesLabel: 'Lencana',
      manageBadgesBtn: 'Kelola Lencana',
      // Friends page translations
      connectWithVolunteers: 'Terhubung dengan relawan lain',
      addFriend: 'Tambah Teman',
      searchFriendPlaceholder: 'Cari berdasarkan nama atau email...',
      sendRequest: 'Kirim Permintaan',
      friendRequests: 'Permintaan Pertemanan',
      accept: 'Terima',
      decline: 'Tolak',
      myFriends: 'Teman Saya',
      noFriendsYet: 'Belum ada teman',
      startConnecting: 'Mulai terhubung dengan relawan lain!',
      pendingLabel: 'Tertunda',
      removeFriend: 'Hapus',
      pendingRequests: 'Permintaan Tertunda',
      requestSent: 'Permintaan terkirim',
      cancelRequest: 'Batalkan',
      // Admin user management table
      userManagementTitle: 'Manajemen Pengguna',
      userManagementDesc: 'Lihat dan kelola semua pengguna terdaftar di platform',
      tableHeaderUser: 'Pengguna',
      tableHeaderRole: 'Peran',
      tableHeaderHours: 'Jam',
      tableHeaderMissions: 'Kegiatan',
      tableHeaderBadges: 'Lencana',
      tableHeaderStatus: 'Status',
      tableHeaderActions: 'Tindakan',
      roleStudentLabel: 'Relawan',
      roleNGOLabel: 'Organisasi',
      roleAdminLabel: 'Administrator',
      statusActive: 'Aktif',
      statusVerified: 'Terverifikasi',
      // Create/Edit activity modal
      publishActivityBtn: 'Terbitkan Kegiatan',
      editMissionTitle: 'Edit Kegiatan',
      titleLabelForm: 'Judul',
      hoursLabelForm: 'Jam',
      maxParticipantsForm: 'Peserta Maksimal',
      categoryFormLabel: 'Kategori',
      difficultyFormLabel: 'Tingkat Kesulitan',
      saveChangesBtn: 'Simpan Perubahan',
      certificateManagerTitle: 'Pengelola Sertifikat',
      certificatesTitle: 'Sertifikat & Penghargaan',
      certificatesSubtitle: 'Ajukan sertifikat resmi dan medali dari organisasi mitra',
      // Profile page translations
      personalInformation: 'Informasi Pribadi',
      languageSettings: 'Bahasa',
      volunteerInterests: 'Minat Kerelawanan',
      interestEnvironment: 'Lingkungan',
      interestEducation: 'Pendidikan',
      interestHealthcare: 'Kesehatan',
      interestCommunity: 'Komunitas',
      interestAnimals: 'Satwa',
      interestElderlyCare: 'Perawatan Lansia',
      interestYouthPrograms: 'Program Kepemudaan',
      interestFoodSecurity: 'Ketahanan Pangan',
      requiredHoursLabel: 'Jam yang Diperlukan',
      yourProgressLabel: 'Kemajuan Anda',
      signInFooterTagline: 'Memberdayakan komunitas melalui aksi kebaikan',
      signInFooterCopyright: '© 2026 KindWorld. Hak cipta dilindungi.',
      noCertificatesUploadedYet: 'Belum ada sertifikat yang diunggah. Unggah sertifikat pertama Anda di atas!',
      noCertificatesAvailableYet: 'Belum ada sertifikat tersedia. Silakan periksa kembali nanti!',
      transportOwn: 'Kendaraan sendiri',
      transportCarpool: 'Butuh tumpangan',
      transportPublic: 'Transportasi umum',
      selectRegion: 'Pilih Wilayah',
      selectLanguage: 'Pilih Bahasa',
      nearbyMissions: 'Lokasi Saya',
      findMissions: 'Cari Kegiatan',
      allRegions: 'Semua Wilayah',
      allCountries: 'Semua Negara',
      regionSetup: 'Lengkapi Profil Anda',
      regionSetupDesc: 'Bantu kami menemukan peluang relawan di sekitar Anda',
      yourRegion: 'Wilayah Anda',
      yourCountry: 'Negara Anda',
      preferredLanguage: 'Bahasa Pilihan',
      continueSetup: 'Lanjutkan',
      skipForNow: 'Lewati untuk saat ini'
    },
    'zh-cn': {
      title: 'KindWorld',
      subtitle: '将善意转化为影响力',
      getStarted: '开始',
      signIn: '登录',
      startVolunteering: '开始志愿服务',
      learnMore: '了解更多',
      dashboard: '仪表板',
      missions: '任务',
      certificates: '证书',
      badges: '徽章',
      friends: '好友',
      profile: '个人资料',
      volunteerHours: '志愿服务小时',
      thisMonthHours: '本月',
      selectRole: '选择您的角色：',
      student: '学生 - 我想做志愿者',
      ngo: '非政府组织 - 我们创建任务',
      admin: '管理员 - 我管理平台',
      welcomeBack: '欢迎回来',
      impactSummary: '这是您的志愿服务影响摘要',
      projectsCompleted: '完成项目',
      organizationsHelped: '帮助组织',
      averageRating: '平均评分',
      monthlyProgress: '6个月志愿服务进度',
      yearlyProgress: '年度志愿服务进度',
      allTimeProgress: '全部志愿服务进度',
      clickForDetails: '点击任意点查看详细分类',
      clickPointsForDetails: '点击查看详情',
      sixMonths: '6个月',
      oneYear: '1年',
      allTime: '全部',
      logout: '登出',
      // Hero slides
      volunteerPlatform: '志愿者平台',
      heroTitle1: '赋能社区',
      heroSubtitle1: '通过善行改变生活',
      heroTitle2: '创造改变',
      heroSubtitle2: '每一小时的善举都能产生持久影响',
      heroTitle3: '加入运动',
      heroSubtitle3: '成为全球变革者网络的一员',
      // Auth
      welcomeBackTitle: '欢迎回来',
      createAccount: '创建账户',
      signInToContinue: '登录以继续您的旅程',
      joinKindWorld: '加入KindWorld，创造改变',
      emailOrUsername: '邮箱或用户名',
      password: '密码',
      forgotPassword: '忘记密码？',
      pleaseFillAllFields: '请输入您的邮箱和密码',
      invalidCredentials: '邮箱或密码错误',
      rememberMe: '记住我',
      noAccount: '还没有账户？',
      registerNow: '立即注册',
      firstName: '名',
      lastName: '姓',
      emailAddress: '邮箱地址',
      phoneNumber: '电话号码',
      country: '国家',
      cityResidency: '城市/居住地',
      confirmPassword: '确认密码',
      minCharacters: '至少8个字符',
      agreeTerms: '我同意',
      termsOfService: '服务条款',
      and: '和',
      privacyPolicy: '隐私政策',
      orSignInWith: '或使用以下方式登录',
      orRegisterWith: '或使用以下方式注册',
      alreadyHaveAccount: '已有账户？',
      selectCountry: '选择国家',
      creatingAccount: '创建账户中...',
      roleVolunteer: '志愿者',
      roleNGO: '组织',
      roleAdmin: '管理员',
      // NGO Admin translations
      ngoWelcome: '组织仪表板',
      manageMissions: '管理任务',
      createMission: '创建新任务',
      pendingVerifications: '待验证小时',
      verifyHours: '验证小时',
      approveHours: '批准',
      rejectHours: '拒绝',
      hoursToVerify: '小时待验证',
      volunteerName: '志愿者姓名',
      missionName: '任务名称',
      hoursSubmitted: '提交小时',
      submittedDate: '提交日期',
      uploadCertificate: '上传证书',
      certificateName: '证书名称',
      uploadFile: '上传文件',
      dragDropFile: '拖放或点击上传',
      supportedFormats: '支持格式：PDF、PNG、JPG',
      publishCertificate: '发布证书',
      saveDraft: '保存为草稿',
      // Profile translations
      editProfile: '编辑资料',
      saveChanges: '保存更改',
      personalInfo: '个人信息',
      contactInfo: '联系信息',
      volunteerStats: '志愿服务统计',
      totalVolunteerHours: '总志愿服务小时',
      // Analytics translations
      viewAnalytics: '查看分析',
      totalMissions: '总任务数',
      activeVolunteers: '活跃志愿者',
      hoursCompleted: '完成小时',
      // Admin translations
      platformManagement: '平台管理',
      allMissions: '所有任务',
      allUsers: '所有用户',
      removeMission: '删除任务',
      manageBadges: '管理徽章',
      addBadge: '添加徽章',
      removeBadge: '删除徽章',
      userDetails: '用户详情',
      editUser: '编辑用户',
      // Hours detail translations
      hoursBreakdown: '小时明细',
      environmentHours: '环境',
      communityHours: '社区',
      healthcareHours: '医疗',
      educationHours: '教育',
      // Learn More page translations
      discoverImpact: '发现我们的全球影响力',
      discoverImpactSubtitle: '加入全球变革者社区，一小时一小时地改变生活。',
      ourGlobalImpact: '我们的全球影响力',
      realNumbers: '真实志愿者创造的真实数据',
      activeInWorld: '活跃在世界每个角落',
      communitySpans: '我们的志愿者社区遍布各大洲',
      volunteerHoursLogged: '志愿服务小时',
      treesPlanted: '种植树木',
      mealsServed: '提供餐食',
      countriesReached: '覆盖国家',
      partnerNGOs: '合作NGO',
      backToHome: '返回首页',
      joinNow: '立即加入',
      volunteers: '志愿者',
      countries: '国家',
      // Learn More page additional translations
      voicesFromCommunity: '来自社区的声音',
      realStoriesVolunteers: '来自世界各地志愿者的真实故事',
      hours: '小时',
      missionsLabel: '任务',
      trustedByOrganizations: '受领先组织信赖',
      ngosUseKindWorld: '全球NGO使用KindWorld扩大其影响力',
      volunteersLabel: '志愿者',
      missionsPosted: '发布任务',
      alignedWithSDG: '与联合国可持续发展目标一致',
      sdgDescription: '我们的任务为全球发展目标做出贡献，对人类最大的挑战产生可衡量的影响',
      readyToMakeMark: '准备好留下你的印记了吗？',
      joinThousands: '加入数千名志愿者和组织，共同创造积极变化。您创造改变的旅程从一步开始。',
      startVolunteeringBtn: '开始志愿服务',
      registerYourNGO: '注册您的NGO',
      trustedBy: '受信赖于',
      partneredWith: '合作伙伴',
      activeIn: '活跃于',
      volunteersIn: '志愿者在',
      hoursLoggedDesc: '致力于改善社区的时间',
      treesPlantedDesc: '为更绿色的地球做贡献',
      mealsServedDesc: '一顿饭一顿饭地对抗饥饿',
      countriesDesc: '真正的全球善意运动',
      activeVolunteersDesc: '不断壮大的变革者社区',
      partnerNGOsDesc: '创造影响力的组织',
      // Missions page translations
      availableMissionsTitle: '可用任务',
      availableMissionsSubtitle: '加入志愿任务，为您的社区创造积极影响',
      hoursLabel: '小时',
      participantsLabel: '参与者',
      joinMission: '加入任务',
      leaveMission: '退出任务',
      joinMissionTitle: '加入任务',
      viewDetails: '查看详情',
      manageMission: '管理',
      ngoMissionsTitle: '您发布的任务',
      ngoMissionsSubtitle: '管理志愿活动并跟踪参与情况',
      adminMissionsTitle: '所有平台任务',
      adminMissionsSubtitle: '监控和管理平台上的所有志愿活动',
      registrationForm: '报名表',
      fullName: '全名',
      emergencyContact: '紧急联系人',
      emergencyPhone: '紧急电话',
      allergies: '过敏（如有）',
      medicalConditions: '健康状况',
      dietaryRestrictions: '饮食限制',
      tshirtSize: 'T恤尺码',
      transportation: '交通方式',
      ownTransport: '自备交通',
      needRide: '需要搭车',
      publicTransport: '公共交通',
      specialSkills: '特殊技能',
      agreeToTerms: '我同意条款和条件',
      cancel: '取消',
      confirmRegistration: '确认报名',
      // Landing page translations
      activeVolunteersLabel: '活跃志愿者',
      partnerNGOsLabel: '合作NGO',
      hoursLoggedLabel: '已记录小时',
      citiesWorldwide: '全球城市',
      howItWorks: '工作方式',
      journeyToImpact: '您的影响力之旅',
      journeySubtitle: '一个旨在放大您对社区贡献的无缝平台',
      discoverMissions: '发现任务',
      discoverMissionsDesc: '找到与您的热情相匹配的有意义的志愿机会',
      trackProgress: '追踪进度',
      trackProgressDesc: '监控您的志愿服务时间，见证您的影响力增长',
      earnRecognition: '获得认可',
      earnRecognitionDesc: '为您的贡献获得徽章和证书',
      buildNetwork: '建立网络',
      buildNetworkDesc: '与志同道合的志愿者和组织建立联系',
      testimonialsLabel: '用户反馈',
      successStoriesTitle: '成功故事',
      successStoriesSubtitle: '来自世界各地志愿者和非政府组织的真实故事',
      scrollLabel: '滚动',
      hoursStats: '小时',
      missionsStats: '任务',
      volunteersStats: '志愿者',
      projectsStats: '项目',
      globalImpactTitle: '我们的全球影响',
      globalImpactSubtitle: '我们携手在全球创造有意义的改变',
      activeCommunitiesTitle: '全球活跃社区',
      northAmerica: '北美',
      europe: '欧洲',
      asiaPacific: '亚太地区',
      latinAmerica: '拉丁美洲',
      africaMiddleEast: '非洲与中东',
      africa: '非洲',
      middleEast: '中东',
      sdgTitle: '为联合国可持续发展目标做出贡献',
      sdgSubtitle: '我们的任务与全球努力创造更美好世界的目标一致',
      noPoverty: '消除贫困',
      zeroHunger: '消除饥饿',
      goodHealth: '良好健康',
      qualityEducation: '优质教育',
      reducedInequalities: '减少不平等',
      sustainableCities: '可持续城市',
      climateAction: '气候行动',
      partnerships: '合作伙伴',
      readyToImpact: '准备好创造影响了吗？',
      readyToImpactSubtitle: '加入超过15万名志愿者和500多个组织，在全球社区创造积极变化。您的旅程从今天开始。',
      startVolunteeringToday: '今天开始志愿服务',
      registerNGO: '注册您的非政府组织',
      freeToJoin: '免费加入',
      noCommitments: '无需承诺',
      startImpactImmediately: '立即开始创造影响',
      footerTagline: '赋能全球志愿者',
      footerCopyright: 'KindWorld. 保留所有权利。',
      // NGO Dashboard specific translations
      ngoDashboardTitle: '组织仪表板',
      ngoDashboardSubtitle: '创建志愿活动、管理证书并追踪社区影响',
      ngoActiveVolunteers: '活跃志愿者',
      ngoPublishedActivities: '已发布活动',
      ngoCertificatesIssued: '已颁发证书',
      ngoTotalImpactHours: '总影响小时',
      createNewActivity: '创建新活动',
      publishVolunteerOpportunities: '为社区发布志愿机会',
      createActivity: '创建活动',
      manageCertificatesTitle: '管理证书',
      createPublishCertificates: '为志愿者创建和发布证书',
      allHoursVerified: '所有志愿服务小时已验证！',
      pendingStatus: '待处理',
      viewAll: '查看全部',
      noActivitiesYet: '尚未发布任何活动。创建您的第一个活动！',
      participantsLabel2: '参与者',
      durationLabel: '时长',
      upcomingStatus: '即将到来',
      completedStatus: '已完成',
      editLabel: '编辑',
      issueCertificates: '颁发证书',
      yourCertificates: '您的证书',
      uploadCertificateBtn: '上传证书',
      noCertificatesYet: '尚未上传证书',
      uploadFirstCertificate: '上传您的第一个证书',
      issuedLabel: '已颁发',
      publishLabel: '发布',
      previewLabel: '预览',
      createNewVolunteerActivity: '创建新志愿活动',
      activityTitle: '活动标题',
      activityTitlePlaceholder: '例如：海滩清洁行动',
      descriptionLabel: '描述',
      descriptionPlaceholder: '描述志愿活动及其影响...',
      locationLabel: '地点',
      locationPlaceholder: '例如：中央公园，纽约',
      dateLabel: '日期',
      durationHours: '时长（小时）',
      maxParticipantsLabel: '最大参与人数',
      categoryLabel: '类别',
      difficultyLabel: '难度',
      categoryEnvironment: '环境',
      categoryCommunity: '社区',
      categoryHealthcare: '医疗',
      categoryEducation: '教育',
      categoryAnimals: '动物',
      difficultyEasy: '简单',
      difficultyMedium: '中等',
      difficultyHard: '困难',
      publishActivity: '发布活动',
      organizationLabel: '组织',
      studentLabel: '学生',
      ngosLabel: '组织',
      // Participant list modal
      participantListTitle: '参与者列表',
      registeredParticipants: '已注册参与者',
      noParticipantsYet: '尚无参与者注册。',
      closeLabel: '关闭',
      contactLabel: '联系方式',
      emergencyLabel: '紧急联系人',
      // Admin Dashboard specific translations
      adminDashboardTitle: '管理员仪表板',
      adminDashboardSubtitle: '管理用户、监控平台活动并监督志愿者项目',
      totalUsersLabel: '总用户',
      volunteersLabel2: '志愿者',
      totalMissionsLabel: '总任务',
      viewManageMissions: '查看和管理平台上所有的志愿服务任务',
      missionsCount: '个任务',
      volunteersCount: '位志愿者',
      addRemoveBadges: '为志愿者添加或移除徽章奖励',
      badgesAvailable: '种可用徽章',
      openBadgeManager: '打开徽章管理',
      ngoApplications: '组织申请',
      ngoApplicationsDesc: '审核并批准组织注册请求',
      pendingApplications: '待处理申请',
      approveNGO: '批准',
      rejectNGO: '拒绝',
      ngoListTitle: '已注册组织',
      ngoListDesc: '查看平台上所有已批准的组织',
      registeredNGOs: '已注册组织',
      ngoName: '组织名称',
      ngoEmail: '电子邮件',
      ngoDescription: '描述',
      ngoWebsite: '网站',
      appliedOn: '申请日期',
      approvedOn: '批准日期',
      noApplications: '没有待处理的申请',
      adminLabel: '管理员',
      activeStatus: '活跃',
      deleteLabel: '删除',
      manageLabel: '管理',
      confirmDelete: '您确定要删除此任务吗？',
      backLabel: '返回',
      detailsLabel: '详情',
      totalHoursLabel: '总小时',
      missionsCompletedLabel: '完成任务',
      badgesLabel: '徽章',
      orgsHelpedLabel: '帮助组织',
      roleLabel: '角色',
      statusLabel: '状态',
      joinDateLabel: '加入日期',
      ratingLabel: '平均评分',
      reportLabel: '报告',
      volunteerActivityBreakdown: '您的志愿活动明细',
      missionsCompleted: '完成任务',
      missionTimeline: '任务时间轴',
      myBadges: '我的徽章',
      volunteerRole: '志愿者',
      uploadCertDescription: '上传您设计好的证书，志愿者完成任务后可以获得',
      certificateNameOptional: '证书名称（选填）',
      // Badge management translations
      badgeManagementCenter: '徽章管理中心',
      badgeManagementDesc: '为志愿者解锁和管理成就徽章',
      selectUser: '选择用户',
      selectUserDesc: '选择一位用户',
      selectUserDescLong: '从左侧列表中选择一位志愿者来管理他们的徽章',
      allBadgesTitle: '所有徽章',
      clickToUnlockRemove: '点击解锁或移除',
      clickToRemove: '点击移除',
      clickToUnlock: '点击解锁',
      hoursUnit: '小时',
      // Edit user modal
      editUserTitle: '编辑用户',
      fullNameLabel: '姓名',
      emailLabel: '电子邮件',
      volunteerHoursLabel: '志愿服务时数',
      userRoleLabel: '用户角色',
      studentVolunteerRole: '志愿者',
      platformAdmin: '管理员',
      saveLabel: '保存',
      cancelLabel: '取消',
      userUpdatedSuccess: '用户更新成功',
      profileUpdatedSuccess: '个人资料已更新！',
      // Profile page translations
      verifiedLabel: '已验证',
      cancelEditLabel: '取消编辑',
      totalHoursProfile: '总小时',
      activitiesCompleted: '完成活动',
      badgesEarned: '获得徽章',
      organizationsHelpedProfile: '帮助组织',
      cityPlaceholder: '北京市',
      backToDashboard: '返回仪表板',
      // Badges page translations
      badgesDescription: '您的成就和认可',
      earnedLabel: '已获得',
      totalAvailable: '可用总数',
      earnedBadgesTitle: '已获得的徽章',
      earnedOn: '获得于 ',
      noBadgesYet: '您还没有获得任何徽章',
      noBadgesDesc: '完成任务并积累志愿服务时数来解锁徽章！',
      allAvailableBadges: '所有可用徽章',
      lockedLabel: '尚未解锁',
      // User detail modal
      earnedBadgesLabel: '获得的徽章',
      manageBadgesBtn: '管理徽章',
      // Friends page translations
      connectWithVolunteers: '与其他志愿者联系',
      addFriend: '添加好友',
      searchFriendPlaceholder: '按姓名或邮箱搜索...',
      sendRequest: '发送请求',
      friendRequests: '好友请求',
      accept: '接受',
      decline: '拒绝',
      myFriends: '我的好友',
      noFriendsYet: '还没有好友',
      startConnecting: '开始与其他志愿者联系！',
      pendingLabel: '等待中',
      removeFriend: '删除',
      pendingRequests: '待处理请求',
      requestSent: '请求已发送',
      cancelRequest: '取消',
      // Admin user management table
      userManagementTitle: '用户管理',
      userManagementDesc: '查看和管理平台上所有注册用户',
      tableHeaderUser: '用户',
      tableHeaderRole: '角色',
      tableHeaderHours: '小时',
      tableHeaderMissions: '任务',
      tableHeaderBadges: '徽章',
      tableHeaderStatus: '状态',
      tableHeaderActions: '操作',
      roleStudentLabel: '学生',
      roleNGOLabel: '组织',
      roleAdminLabel: '管理员',
      statusActive: '活跃',
      statusVerified: '已验证',
      // Create/Edit activity modal
      publishActivityBtn: '发布活动',
      editMissionTitle: '编辑任务',
      titleLabelForm: '标题',
      hoursLabelForm: '小时',
      maxParticipantsForm: '最大参与人数',
      categoryFormLabel: '类别',
      difficultyFormLabel: '难度',
      saveChangesBtn: '保存更改',
      certificateManagerTitle: '证书管理',
      certificatesTitle: '证书与奖项',
      certificatesSubtitle: '向合作组织申请官方证书和奖章',
      // Profile page translations
      personalInformation: '个人信息',
      languageSettings: '语言',
      volunteerInterests: '志愿服务兴趣',
      interestEnvironment: '环境',
      interestEducation: '教育',
      interestHealthcare: '医疗',
      interestCommunity: '社区',
      interestAnimals: '动物',
      interestElderlyCare: '老年护理',
      interestYouthPrograms: '青年项目',
      interestFoodSecurity: '食品安全',
      requiredHoursLabel: '所需时数',
      yourProgressLabel: '您的进度',
      signInFooterTagline: '通过善行赋能社区',
      signInFooterCopyright: '© 2026 KindWorld. 版权所有。',
      noCertificatesUploadedYet: '尚未上传证书。请在上方上传您的第一个证书！',
      noCertificatesAvailableYet: '暂无证书。请稍后再来查看！',
      transportOwn: '自备交通',
      transportCarpool: '需要拼车',
      transportPublic: '公共交通',
      selectRegion: '选择地区',
      selectLanguage: '选择语言',
      nearbyMissions: '我的位置',
      findMissions: '查找任务',
      allRegions: '所有地区',
      allCountries: '所有国家',
      regionSetup: '设置您的个人资料',
      regionSetupDesc: '帮助我们找到您附近的志愿服务机会',
      yourRegion: '您的地区',
      yourCountry: '您的国家',
      preferredLanguage: '首选语言',
      continueSetup: '继续',
      skipForNow: '暂时跳过'
    },
    'zh-tw': {
      title: 'KindWorld',
      subtitle: '將善意轉化為影響力',
      getStarted: '開始',
      signIn: '登入',
      startVolunteering: '開始志願服務',
      learnMore: '了解更多',
      dashboard: '儀表板',
      missions: '任務',
      certificates: '證書',
      badges: '徽章',
      friends: '好友',
      profile: '個人資料',
      volunteerHours: '志願服務小時',
      thisMonthHours: '本月',
      selectRole: '選擇您的角色：',
      student: '學生 - 我想做志願者',
      ngo: '非政府組織 - 我們創建任務',
      admin: '管理員 - 我管理平台',
      welcomeBack: '歡迎回來',
      impactSummary: '這是您的志願服務影響摘要',
      projectsCompleted: '完成項目',
      organizationsHelped: '幫助組織',
      averageRating: '平均評分',
      monthlyProgress: '6個月志願服務進度',
      yearlyProgress: '年度志願服務進度',
      allTimeProgress: '全部志願服務進度',
      clickForDetails: '點擊任意點查看詳細分類',
      clickPointsForDetails: '點擊查看詳情',
      sixMonths: '6個月',
      oneYear: '1年',
      allTime: '全部',
      logout: '登出',
      // Hero slides
      volunteerPlatform: '志願者平台',
      heroTitle1: '賦能社區',
      heroSubtitle1: '通過善行改變生活',
      heroTitle2: '創造改變',
      heroSubtitle2: '每一小時的善舉都能產生持久影響',
      heroTitle3: '加入運動',
      heroSubtitle3: '成為全球變革者網絡的一員',
      // Auth
      welcomeBackTitle: '歡迎回來',
      createAccount: '創建帳戶',
      signInToContinue: '登入以繼續您的旅程',
      joinKindWorld: '加入KindWorld，創造改變',
      emailOrUsername: '郵箱或用戶名',
      password: '密碼',
      forgotPassword: '忘記密碼？',
      pleaseFillAllFields: '請輸入您的電子郵件和密碼',
      invalidCredentials: '電子郵件或密碼錯誤',
      rememberMe: '記住我',
      noAccount: '還沒有帳戶？',
      registerNow: '立即註冊',
      firstName: '名',
      lastName: '姓',
      emailAddress: '郵箱地址',
      phoneNumber: '電話號碼',
      country: '國家',
      cityResidency: '城市/居住地',
      confirmPassword: '確認密碼',
      minCharacters: '至少8個字符',
      agreeTerms: '我同意',
      termsOfService: '服務條款',
      and: '和',
      privacyPolicy: '隱私政策',
      orSignInWith: '或使用以下方式登入',
      orRegisterWith: '或使用以下方式註冊',
      alreadyHaveAccount: '已有帳戶？',
      selectCountry: '選擇國家',
      creatingAccount: '創建帳戶中...',
      roleVolunteer: '志願者',
      roleNGO: '組織',
      roleAdmin: '管理員',
      // NGO Admin translations
      ngoWelcome: '組織儀表板',
      manageMissions: '管理任務',
      createMission: '創建新任務',
      pendingVerifications: '待驗證小時',
      verifyHours: '驗證小時',
      approveHours: '批准',
      rejectHours: '拒絕',
      hoursToVerify: '小時待驗證',
      volunteerName: '志願者姓名',
      missionName: '任務名稱',
      hoursSubmitted: '提交小時',
      submittedDate: '提交日期',
      uploadCertificate: '上傳證書',
      certificateName: '證書名稱',
      uploadFile: '上傳文件',
      dragDropFile: '拖放或點擊上傳',
      supportedFormats: '支援格式：PDF、PNG、JPG',
      publishCertificate: '發布證書',
      saveDraft: '儲存為草稿',
      // Profile translations
      editProfile: '編輯資料',
      saveChanges: '儲存更改',
      personalInfo: '個人資訊',
      contactInfo: '聯絡資訊',
      volunteerStats: '志願服務統計',
      totalVolunteerHours: '總志願服務小時',
      // Analytics translations
      viewAnalytics: '查看分析',
      totalMissions: '總任務數',
      activeVolunteers: '活躍志願者',
      hoursCompleted: '完成小時',
      // Admin translations
      platformManagement: '平台管理',
      allMissions: '所有任務',
      allUsers: '所有用戶',
      removeMission: '刪除任務',
      manageBadges: '管理徽章',
      addBadge: '添加徽章',
      removeBadge: '刪除徽章',
      userDetails: '用戶詳情',
      editUser: '編輯用戶',
      // Hours detail translations
      hoursBreakdown: '小時明細',
      environmentHours: '環境',
      communityHours: '社區',
      healthcareHours: '醫療',
      educationHours: '教育',
      // Learn More page translations
      discoverImpact: '發現我們的全球影響力',
      discoverImpactSubtitle: '加入全球變革者社區，一小時一小時地改變生活。',
      ourGlobalImpact: '我們的全球影響力',
      realNumbers: '真實志願者創造的真實數據',
      activeInWorld: '活躍在世界每個角落',
      communitySpans: '我們的志願者社區遍布各大洲',
      volunteerHoursLogged: '志願服務小時',
      treesPlanted: '種植樹木',
      mealsServed: '提供餐食',
      countriesReached: '覆蓋國家',
      partnerNGOs: '合作NGO',
      backToHome: '返回首頁',
      joinNow: '立即加入',
      volunteers: '志願者',
      countries: '國家',
      // Learn More page additional translations
      voicesFromCommunity: '來自社區的聲音',
      realStoriesVolunteers: '來自世界各地志願者的真實故事',
      hours: '小時',
      missionsLabel: '任務',
      trustedByOrganizations: '受領先組織信賴',
      ngosUseKindWorld: '全球NGO使用KindWorld擴大其影響力',
      volunteersLabel: '志願者',
      missionsPosted: '發布任務',
      alignedWithSDG: '與聯合國可持續發展目標一致',
      sdgDescription: '我們的任務為全球發展目標做出貢獻，對人類最大的挑戰產生可衡量的影響',
      readyToMakeMark: '準備好留下你的印記了嗎？',
      joinThousands: '加入數千名志願者和組織，共同創造積極變化。您創造改變的旅程從一步開始。',
      startVolunteeringBtn: '開始志願服務',
      registerYourNGO: '註冊您的NGO',
      trustedBy: '受信賴於',
      partneredWith: '合作夥伴',
      activeIn: '活躍於',
      volunteersIn: '志願者在',
      hoursLoggedDesc: '致力於改善社區的時間',
      treesPlantedDesc: '為更綠色的地球做貢獻',
      mealsServedDesc: '一頓飯一頓飯地對抗飢餓',
      countriesDesc: '真正的全球善意運動',
      activeVolunteersDesc: '不斷壯大的變革者社區',
      partnerNGOsDesc: '創造影響力的組織',
      // Missions page translations
      availableMissionsTitle: '可用任務',
      availableMissionsSubtitle: '加入志願任務，為您的社區創造積極影響',
      hoursLabel: '小時',
      participantsLabel: '參與者',
      joinMission: '加入任務',
      leaveMission: '退出任務',
      joinMissionTitle: '加入任務',
      viewDetails: '查看詳情',
      manageMission: '管理',
      ngoMissionsTitle: '您發布的任務',
      ngoMissionsSubtitle: '管理志願活動並追蹤參與情況',
      adminMissionsTitle: '所有平台任務',
      adminMissionsSubtitle: '監控和管理平台上的所有志願活動',
      registrationForm: '報名表',
      fullName: '全名',
      emergencyContact: '緊急聯絡人',
      emergencyPhone: '緊急電話',
      allergies: '過敏（如有）',
      medicalConditions: '健康狀況',
      dietaryRestrictions: '飲食限制',
      tshirtSize: 'T恤尺碼',
      transportation: '交通方式',
      ownTransport: '自備交通',
      needRide: '需要搭車',
      publicTransport: '公共交通',
      specialSkills: '特殊技能',
      agreeToTerms: '我同意條款和條件',
      cancel: '取消',
      confirmRegistration: '確認報名',
      // Landing page translations
      activeVolunteersLabel: '活躍志願者',
      partnerNGOsLabel: '合作NGO',
      hoursLoggedLabel: '已記錄小時',
      citiesWorldwide: '全球城市',
      howItWorks: '工作方式',
      journeyToImpact: '您的影響力之旅',
      journeySubtitle: '一個旨在放大您對社區貢獻的無縫平台',
      discoverMissions: '發現任務',
      discoverMissionsDesc: '找到與您的熱情相匹配的有意義的志願機會',
      trackProgress: '追蹤進度',
      trackProgressDesc: '監控您的志願服務時間，見證您的影響力增長',
      earnRecognition: '獲得認可',
      earnRecognitionDesc: '為您的貢獻獲得徽章和證書',
      buildNetwork: '建立網絡',
      buildNetworkDesc: '與志同道合的志願者和組織建立聯繫',
      testimonialsLabel: '用戶反饋',
      successStoriesTitle: '成功故事',
      successStoriesSubtitle: '來自世界各地志願者和非政府組織的真實故事',
      scrollLabel: '滾動',
      hoursStats: '小時',
      missionsStats: '任務',
      volunteersStats: '志願者',
      projectsStats: '項目',
      globalImpactTitle: '我們的全球影響',
      globalImpactSubtitle: '我們攜手在全球創造有意義的改變',
      activeCommunitiesTitle: '全球活躍社區',
      northAmerica: '北美',
      europe: '歐洲',
      asiaPacific: '亞太地區',
      latinAmerica: '拉丁美洲',
      africaMiddleEast: '非洲與中東',
      africa: '非洲',
      middleEast: '中東',
      sdgTitle: '為聯合國可持續發展目標做出貢獻',
      sdgSubtitle: '我們的任務與全球努力創造更美好世界的目標一致',
      noPoverty: '消除貧困',
      zeroHunger: '消除飢餓',
      goodHealth: '良好健康',
      qualityEducation: '優質教育',
      reducedInequalities: '減少不平等',
      sustainableCities: '可持續城市',
      climateAction: '氣候行動',
      partnerships: '合作夥伴',
      readyToImpact: '準備好創造影響了嗎？',
      readyToImpactSubtitle: '加入超過15萬名志願者和500多個組織，在全球社區創造積極變化。您的旅程從今天開始。',
      startVolunteeringToday: '今天開始志願服務',
      registerNGO: '註冊您的非政府組織',
      freeToJoin: '免費加入',
      noCommitments: '無需承諾',
      startImpactImmediately: '立即開始創造影響',
      footerTagline: '賦能全球志願者',
      footerCopyright: 'KindWorld. 保留所有權利。',
      // NGO Dashboard specific translations
      ngoDashboardTitle: '組織儀表板',
      ngoDashboardSubtitle: '創建志願活動、管理證書並追蹤社區影響',
      ngoActiveVolunteers: '活躍志願者',
      ngoPublishedActivities: '已發布活動',
      ngoCertificatesIssued: '已頒發證書',
      ngoTotalImpactHours: '總影響小時',
      createNewActivity: '創建新活動',
      publishVolunteerOpportunities: '為社區發布志願機會',
      createActivity: '創建活動',
      manageCertificatesTitle: '管理證書',
      createPublishCertificates: '為志願者創建和發布證書',
      allHoursVerified: '所有志願服務小時已驗證！',
      pendingStatus: '待處理',
      viewAll: '查看全部',
      noActivitiesYet: '尚未發布任何活動。創建您的第一個活動！',
      participantsLabel2: '參與者',
      durationLabel: '時長',
      upcomingStatus: '即將到來',
      completedStatus: '已完成',
      editLabel: '編輯',
      issueCertificates: '頒發證書',
      yourCertificates: '您的證書',
      uploadCertificateBtn: '上傳證書',
      noCertificatesYet: '尚未上傳證書',
      uploadFirstCertificate: '上傳您的第一個證書',
      issuedLabel: '已頒發',
      publishLabel: '發布',
      previewLabel: '預覽',
      createNewVolunteerActivity: '創建新志願活動',
      activityTitle: '活動標題',
      activityTitlePlaceholder: '例如：海灘清潔行動',
      descriptionLabel: '描述',
      descriptionPlaceholder: '描述志願活動及其影響...',
      locationLabel: '地點',
      locationPlaceholder: '例如：中央公園，紐約',
      dateLabel: '日期',
      durationHours: '時長（小時）',
      maxParticipantsLabel: '最大參與人數',
      categoryLabel: '類別',
      difficultyLabel: '難度',
      categoryEnvironment: '環境',
      categoryCommunity: '社區',
      categoryHealthcare: '醫療',
      categoryEducation: '教育',
      categoryAnimals: '動物',
      difficultyEasy: '簡單',
      difficultyMedium: '中等',
      difficultyHard: '困難',
      publishActivity: '發布活動',
      organizationLabel: '組織',
      studentLabel: '學生',
      ngosLabel: '組織',
      // Participant list modal
      participantListTitle: '參與者列表',
      registeredParticipants: '已註冊參與者',
      noParticipantsYet: '尚無參與者註冊。',
      closeLabel: '關閉',
      contactLabel: '聯絡方式',
      emergencyLabel: '緊急聯絡人',
      // Admin Dashboard specific translations
      adminDashboardTitle: '管理員儀表板',
      adminDashboardSubtitle: '管理用戶、監控平台活動並監督志願者項目',
      totalUsersLabel: '總用戶',
      volunteersLabel2: '志願者',
      totalMissionsLabel: '總任務',
      viewManageMissions: '查看和管理平台上所有的志願服務任務',
      missionsCount: '個任務',
      volunteersCount: '位志願者',
      addRemoveBadges: '為志願者添加或移除徽章獎勵',
      badgesAvailable: '種可用徽章',
      openBadgeManager: '打開徽章管理',
      ngoApplications: '組織申請',
      ngoApplicationsDesc: '審核並批准組織註冊請求',
      pendingApplications: '待處理申請',
      approveNGO: '批准',
      rejectNGO: '拒絕',
      ngoListTitle: '已註冊組織',
      ngoListDesc: '查看平台上所有已批准的組織',
      registeredNGOs: '已註冊組織',
      ngoName: '組織名稱',
      ngoEmail: '電子郵件',
      ngoDescription: '描述',
      ngoWebsite: '網站',
      appliedOn: '申請日期',
      approvedOn: '批准日期',
      noApplications: '沒有待處理的申請',
      adminLabel: '管理員',
      activeStatus: '活躍',
      deleteLabel: '刪除',
      manageLabel: '管理',
      confirmDelete: '您確定要刪除此任務嗎？',
      backLabel: '返回',
      detailsLabel: '詳情',
      totalHoursLabel: '總小時',
      missionsCompletedLabel: '完成任務',
      badgesLabel: '徽章',
      orgsHelpedLabel: '幫助組織',
      roleLabel: '角色',
      statusLabel: '狀態',
      joinDateLabel: '加入日期',
      ratingLabel: '平均評分',
      reportLabel: '報告',
      volunteerActivityBreakdown: '您的志願活動明細',
      missionsCompleted: '完成任務',
      missionTimeline: '任務時間軸',
      myBadges: '我的徽章',
      volunteerRole: '志願者',
      uploadCertDescription: '上傳您設計好的證書，志願者完成任務後可以獲得',
      certificateNameOptional: '證書名稱（選填）',
      // Badge management translations
      badgeManagementCenter: '徽章管理中心',
      badgeManagementDesc: '為志願者解鎖和管理成就徽章',
      selectUser: '選擇用戶',
      selectUserDesc: '選擇一位用戶',
      selectUserDescLong: '從左側列表中選擇一位志願者來管理他們的徽章',
      allBadgesTitle: '所有徽章',
      clickToUnlockRemove: '點擊解鎖或移除',
      clickToRemove: '點擊移除',
      clickToUnlock: '點擊解鎖',
      hoursUnit: '小時',
      // Edit user modal
      editUserTitle: '編輯用戶',
      fullNameLabel: '全名',
      emailLabel: '電子郵件',
      volunteerHoursLabel: '志願服務時數',
      userRoleLabel: '用戶角色',
      studentVolunteerRole: '志願者',
      platformAdmin: '管理員',
      saveLabel: '保存',
      cancelLabel: '取消',
      userUpdatedSuccess: '用戶更新成功',
      profileUpdatedSuccess: '個人資料已更新！',
      // Profile page translations
      verifiedLabel: '已驗證',
      cancelEditLabel: '取消編輯',
      totalHoursProfile: '總小時',
      activitiesCompleted: '完成活動',
      badgesEarned: '獲得徽章',
      organizationsHelpedProfile: '幫助組織',
      cityPlaceholder: '台北市',
      backToDashboard: '返回儀表板',
      // Badges page translations
      badgesDescription: '您的成就和認可',
      earnedLabel: '已獲得',
      totalAvailable: '可用總數',
      earnedBadgesTitle: '已獲得的徽章',
      earnedOn: '獲得於 ',
      noBadgesYet: '您還沒有獲得任何徽章',
      noBadgesDesc: '完成任務並積累志願服務時數來解鎖徽章！',
      allAvailableBadges: '所有可用徽章',
      lockedLabel: '尚未解鎖',
      // User detail modal
      earnedBadgesLabel: '獲得的徽章',
      manageBadgesBtn: '管理徽章',
      // Friends page translations
      connectWithVolunteers: '與其他志願者聯繫',
      addFriend: '添加好友',
      searchFriendPlaceholder: '按姓名或郵箱搜索...',
      sendRequest: '發送請求',
      friendRequests: '好友請求',
      accept: '接受',
      decline: '拒絕',
      myFriends: '我的好友',
      noFriendsYet: '還沒有好友',
      startConnecting: '開始與其他志願者聯繫！',
      pendingLabel: '等待中',
      removeFriend: '刪除',
      pendingRequests: '待處理請求',
      requestSent: '請求已發送',
      cancelRequest: '取消',
      // Admin user management table
      userManagementTitle: '用戶管理',
      userManagementDesc: '查看和管理平台上所有註冊用戶',
      tableHeaderUser: '用戶',
      tableHeaderRole: '角色',
      tableHeaderHours: '小時',
      tableHeaderMissions: '任務',
      tableHeaderBadges: '徽章',
      tableHeaderStatus: '狀態',
      tableHeaderActions: '操作',
      roleStudentLabel: '學生',
      roleNGOLabel: '組織',
      roleAdminLabel: '管理員',
      statusActive: '活躍',
      statusVerified: '已驗證',
      // Create/Edit activity modal
      publishActivityBtn: '發布活動',
      editMissionTitle: '編輯任務',
      titleLabelForm: '標題',
      hoursLabelForm: '小時',
      maxParticipantsForm: '最大參與人數',
      categoryFormLabel: '類別',
      difficultyFormLabel: '難度',
      saveChangesBtn: '儲存更改',
      certificateManagerTitle: '證書管理',
      certificatesTitle: '證書與獎項',
      certificatesSubtitle: '向合作組織申請官方證書和獎章',
      // Profile page translations
      personalInformation: '個人資訊',
      languageSettings: '語言',
      volunteerInterests: '志願服務興趣',
      interestEnvironment: '環境',
      interestEducation: '教育',
      interestHealthcare: '醫療',
      interestCommunity: '社區',
      interestAnimals: '動物',
      interestElderlyCare: '長者護理',
      interestYouthPrograms: '青年項目',
      interestFoodSecurity: '食品安全',
      requiredHoursLabel: '所需時數',
      yourProgressLabel: '您的進度',
      signInFooterTagline: '透過善行賦能社區',
      signInFooterCopyright: '© 2026 KindWorld. 版權所有。',
      noCertificatesUploadedYet: '尚未上傳證書。請在上方上傳您的第一個證書！',
      noCertificatesAvailableYet: '暫無證書。請稍後再來查看！',
      transportOwn: '自備交通',
      transportCarpool: '需要共乘',
      transportPublic: '公共交通',
      selectRegion: '選擇地區',
      selectLanguage: '選擇語言',
      nearbyMissions: '我的位置',
      findMissions: '查找任務',
      allRegions: '所有地區',
      allCountries: '所有國家',
      regionSetup: '設置您的個人資料',
      regionSetupDesc: '幫助我們找到您附近的志願服務機會',
      yourRegion: '您的地區',
      yourCountry: '您的國家',
      preferredLanguage: '首選語言',
      continueSetup: '繼續',
      skipForNow: '暫時跳過'
    },
    es: {
      title: 'KindWorld',
      subtitle: 'Transforma la Bondad en Impacto',
      getStarted: 'Comenzar',
      signIn: 'Iniciar Sesión',
      startVolunteering: 'Comenzar a Voluntariar',
      learnMore: 'Saber Más',
      dashboard: 'Panel',
      missions: 'Misiones',
      certificates: 'Certificados',
      badges: 'Insignias',
      friends: 'Amigos',
      profile: 'Perfil',
      volunteerHours: 'Horas de Voluntariado',
      thisMonthHours: 'Este Mes',
      selectRole: 'Elige tu rol:',
      student: 'Estudiante - Quiero ser voluntario',
      ngo: 'ONG - Creamos misiones',
      admin: 'Admin - Gestiono la plataforma',
      welcomeBack: 'Bienvenido de nuevo',
      impactSummary: 'Aquí está tu resumen de impacto voluntario',
      projectsCompleted: 'Proyectos Completados',
      organizationsHelped: 'Organizaciones Ayudadas',
      averageRating: 'Calificación Promedio',
      monthlyProgress: 'Progreso de 6 Meses',
      yearlyProgress: 'Progreso Anual',
      allTimeProgress: 'Progreso Total',
      clickForDetails: 'Haz clic en cualquier punto para ver detalles',
      clickPointsForDetails: 'Clic para detalles',
      sixMonths: '6 Meses',
      oneYear: '1 Año',
      allTime: 'Todo',
      logout: 'Cerrar Sesión',
      volunteerPlatform: 'PLATAFORMA DE VOLUNTARIADO',
      heroTitle1: 'Empodera Comunidades',
      heroSubtitle1: 'Transforma vidas a través de la acción compasiva',
      heroTitle2: 'Marca la Diferencia',
      heroSubtitle2: 'Cada hora de bondad crea un impacto duradero',
      heroTitle3: 'Únete al Movimiento',
      heroSubtitle3: 'Sé parte de una red global de agentes de cambio',
      welcomeBackTitle: 'Bienvenido de Nuevo',
      createAccount: 'Crear Cuenta',
      signInToContinue: 'Inicia sesión para continuar tu viaje',
      joinKindWorld: 'Únete a KindWorld y marca la diferencia',
      emailOrUsername: 'Email o Nombre de Usuario',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu Contraseña?',
      pleaseFillAllFields: 'Por favor ingresa tu correo y contraseña',
      invalidCredentials: 'Correo o contraseña inválidos',
      rememberMe: 'Recuérdame',
      noAccount: '¿No tienes cuenta?',
      registerNow: 'Regístrate ahora',
      firstName: 'Nombre',
      lastName: 'Apellido',
      emailAddress: 'Correo Electrónico',
      phoneNumber: 'Número de Teléfono',
      country: 'País',
      cityResidency: 'Ciudad / Residencia',
      confirmPassword: 'Confirmar Contraseña',
      minCharacters: 'Mín. 8 caracteres',
      agreeTerms: 'Acepto los',
      termsOfService: 'Términos de Servicio',
      and: 'y',
      privacyPolicy: 'Política de Privacidad',
      orSignInWith: 'o inicia sesión con',
      orRegisterWith: 'o regístrate con',
      alreadyHaveAccount: '¿Ya tienes cuenta?',
      selectCountry: 'Seleccionar país',
      creatingAccount: 'Creando Cuenta...',
      roleVolunteer: 'Voluntario',
      roleNGO: 'ONG',
      roleAdmin: 'Admin',
      ngoWelcome: 'Panel de ONG',
      manageMissions: 'Gestionar Misiones',
      createMission: 'Crear Nueva Misión',
      pendingVerifications: 'Verificaciones Pendientes',
      verifyHours: 'Verificar Horas',
      approveHours: 'Aprobar',
      rejectHours: 'Rechazar',
      hoursToVerify: 'horas por verificar',
      volunteerName: 'Nombre del Voluntario',
      missionName: 'Nombre de la Misión',
      hoursSubmitted: 'Horas Enviadas',
      submittedDate: 'Fecha de Envío',
      uploadCertificate: 'Subir Certificado',
      certificateName: 'Nombre del Certificado',
      uploadFile: 'Subir Archivo',
      dragDropFile: 'Arrastra o haz clic para subir',
      supportedFormats: 'Formatos: PDF, PNG, JPG',
      publishCertificate: 'Publicar Certificado',
      saveDraft: 'Guardar Borrador',
      editProfile: 'Editar Perfil',
      saveChanges: 'Guardar Cambios',
      personalInfo: 'Información Personal',
      contactInfo: 'Información de Contacto',
      volunteerStats: 'Estadísticas',
      totalVolunteerHours: 'Total Horas',
      viewAnalytics: 'Ver Analíticas',
      totalMissions: 'Total Misiones',
      activeVolunteers: 'Voluntarios Activos',
      hoursCompleted: 'Horas Completadas',
      platformManagement: 'Gestión de Plataforma',
      allMissions: 'Todas las Misiones',
      allUsers: 'Todos los Usuarios',
      removeMission: 'Eliminar Misión',
      manageBadges: 'Gestionar Insignias',
      addBadge: 'Añadir Insignia',
      removeBadge: 'Quitar Insignia',
      userDetails: 'Detalles del Usuario',
      editUser: 'Editar Usuario',
      hoursBreakdown: 'Desglose de Horas',
      environmentHours: 'Medio Ambiente',
      communityHours: 'Comunidad',
      healthcareHours: 'Salud',
      educationHours: 'Educación',
      discoverImpact: 'Descubre Nuestro Impacto',
      discoverImpactSubtitle: 'Únete a una comunidad mundial transformando vidas.',
      ourGlobalImpact: 'Nuestro Impacto Global',
      realNumbers: 'Números reales de voluntarios reales',
      activeInWorld: 'Activo en Todo el Mundo',
      communitySpans: 'Nuestra comunidad abarca continentes',
      volunteerHoursLogged: 'Horas Registradas',
      treesPlanted: 'Árboles Plantados',
      mealsServed: 'Comidas Servidas',
      countriesReached: 'Países Alcanzados',
      partnerNGOs: 'ONGs Asociadas',
      backToHome: 'Volver al Inicio',
      joinNow: 'Únete Ahora',
      volunteers: 'Voluntarios',
      countries: 'Países',
      voicesFromCommunity: 'Voces de la Comunidad',
      realStoriesVolunteers: 'Historias reales de voluntarios',
      hours: 'Horas',
      missionsLabel: 'Misiones',
      trustedByOrganizations: 'Confiado por Organizaciones',
      ngosUseKindWorld: 'ONGs usan KindWorld para amplificar su impacto',
      volunteersLabel: 'Voluntarios',
      missionsPosted: 'Misiones Publicadas',
      alignedWithSDG: 'Alineado con ODS de la ONU',
      sdgDescription: 'Nuestras misiones contribuyen a objetivos de desarrollo global',
      readyToMakeMark: '¿Listo para Dejar tu Huella?',
      joinThousands: 'Únete a miles creando cambio positivo.',
      startVolunteeringBtn: 'Comenzar',
      registerYourNGO: 'Registra tu ONG',
      trustedBy: 'Confiado por',
      partneredWith: 'Asociado con',
      activeIn: 'Activo en',
      volunteersIn: 'voluntarios en',
      hoursLoggedDesc: 'Horas mejorando comunidades',
      treesPlantedDesc: 'Contribuyendo al planeta',
      mealsServedDesc: 'Luchando contra el hambre',
      countriesDesc: 'Movimiento global de bondad',
      activeVolunteersDesc: 'Comunidad de agentes de cambio',
      partnerNGOsDesc: 'Organizaciones creando impacto',
      availableMissionsTitle: 'Misiones Disponibles',
      availableMissionsSubtitle: 'Únete y haz un impacto positivo',
      hoursLabel: 'horas',
      participantsLabel: 'participantes',
      joinMission: 'Unirse',
      leaveMission: 'Abandonar',
      joinMissionTitle: 'Unirse a Misión',
      viewDetails: 'Ver Detalles',
      manageMission: 'Gestionar',
      ngoMissionsTitle: 'Tus Misiones Publicadas',
      ngoMissionsSubtitle: 'Gestiona tus actividades y rastrea la participación',
      adminMissionsTitle: 'Todas las Misiones',
      adminMissionsSubtitle: 'Monitorea y gestiona todas las actividades de la plataforma',
      registrationForm: 'Formulario de Registro',
      fullName: 'Nombre Completo',
      emergencyContact: 'Contacto de Emergencia',
      emergencyPhone: 'Teléfono de Emergencia',
      allergies: 'Alergias',
      medicalConditions: 'Condiciones Médicas',
      dietaryRestrictions: 'Restricciones Dietéticas',
      tshirtSize: 'Talla de Camiseta',
      transportation: 'Transporte',
      ownTransport: 'Propio',
      needRide: 'Necesito',
      publicTransport: 'Público',
      specialSkills: 'Habilidades',
      agreeToTerms: 'Acepto los términos',
      cancel: 'Cancelar',
      confirmRegistration: 'Confirmar',
      activeVolunteersLabel: 'Voluntarios Activos',
      partnerNGOsLabel: 'ONGs Asociadas',
      hoursLoggedLabel: 'Horas Registradas',
      citiesWorldwide: 'Ciudades',
      howItWorks: 'CÓMO FUNCIONA',
      journeyToImpact: 'Tu Viaje al Impacto',
      journeySubtitle: 'Plataforma para amplificar tu contribución',
      discoverMissions: 'Descubre Misiones',
      discoverMissionsDesc: 'Encuentra oportunidades de voluntariado',
      trackProgress: 'Sigue tu Progreso',
      trackProgressDesc: 'Monitorea tus horas e impacto',
      earnRecognition: 'Gana Reconocimiento',
      earnRecognitionDesc: 'Obtén insignias y certificados',
      buildNetwork: 'Construye tu Red',
      buildNetworkDesc: 'Conecta con voluntarios y organizaciones',
      testimonialsLabel: 'TESTIMONIOS',
      successStoriesTitle: 'Historias de Impacto',
      successStoriesSubtitle: 'Historias reales de voluntarios y ONGs',
      scrollLabel: 'DESPLAZAR',
      hoursStats: 'Horas',
      missionsStats: 'Misiones',
      volunteersStats: 'Voluntarios',
      projectsStats: 'Proyectos',
      globalImpactTitle: 'Impacto Global',
      globalImpactSubtitle: 'Creando cambio significativo',
      activeCommunitiesTitle: 'Comunidades Activas',
      northAmerica: 'América del Norte',
      europe: 'Europa',
      asiaPacific: 'Asia Pacífico',
      latinAmerica: 'América Latina',
      africaMiddleEast: 'África y Medio Oriente',
      africa: 'África',
      middleEast: 'Medio Oriente',
      sdgTitle: 'Contribuyendo a los ODS',
      sdgSubtitle: 'Misiones alineadas con esfuerzos globales',
      noPoverty: 'Fin de la Pobreza',
      zeroHunger: 'Hambre Cero',
      goodHealth: 'Buena Salud',
      qualityEducation: 'Educación de Calidad',
      reducedInequalities: 'Reducción de Desigualdades',
      sustainableCities: 'Ciudades Sostenibles',
      climateAction: 'Acción Climática',
      partnerships: 'Alianzas',
      readyToImpact: '¿Listo para el Impacto?',
      readyToImpactSubtitle: 'Únete a 150,000+ voluntarios y 500+ organizaciones.',
      startVolunteeringToday: 'Comienza Hoy',
      registerNGO: 'Registra tu ONG',
      freeToJoin: 'Gratis',
      noCommitments: 'Sin compromisos',
      startImpactImmediately: 'Impacto inmediato',
      footerTagline: 'Empoderando voluntarios',
      footerCopyright: 'KindWorld. Todos los derechos reservados.',
      ngoDashboardTitle: 'Panel de ONG',
      ngoDashboardSubtitle: 'Crea actividades y gestiona certificados',
      ngoActiveVolunteers: 'Voluntarios Activos',
      ngoPublishedActivities: 'Actividades Publicadas',
      ngoCertificatesIssued: 'Certificados Emitidos',
      ngoTotalImpactHours: 'Horas de Impacto',
      createNewActivity: 'Crear Actividad',
      publishVolunteerOpportunities: 'Publica oportunidades de voluntariado',
      createActivity: 'Crear Actividad',
      manageCertificatesTitle: 'Gestionar Certificados',
      createPublishCertificates: 'Crea y publica certificados',
      allHoursVerified: '¡Todas las horas verificadas!',
      pendingStatus: 'Pendiente',
      viewAll: 'Ver Todo',
      noActivitiesYet: 'No hay actividades aún.',
      participantsLabel2: 'Participantes',
      durationLabel: 'Duración',
      upcomingStatus: 'Próximo',
      completedStatus: 'Completado',
      editLabel: 'Editar',
      issueCertificates: 'Emitir Certificados',
      yourCertificates: 'Tus Certificados',
      uploadCertificateBtn: 'Subir Certificado',
      noCertificatesYet: 'No hay certificados',
      uploadFirstCertificate: 'Sube Tu Primer Certificado',
      issuedLabel: 'emitidos',
      publishLabel: 'Publicar',
      previewLabel: 'Vista Previa',
      createNewVolunteerActivity: 'Crear Nueva Actividad',
      activityTitle: 'Título',
      activityTitlePlaceholder: 'ej., Limpieza de Playa',
      descriptionLabel: 'Descripción',
      descriptionPlaceholder: 'Describe la actividad...',
      locationLabel: 'Ubicación',
      locationPlaceholder: 'ej., Parque Central',
      dateLabel: 'Fecha',
      durationHours: 'Duración (horas)',
      maxParticipantsLabel: 'Máx Participantes',
      categoryLabel: 'Categoría',
      difficultyLabel: 'Dificultad',
      categoryEnvironment: 'Medio Ambiente',
      categoryCommunity: 'Comunidad',
      categoryHealthcare: 'Salud',
      categoryEducation: 'Educación',
      categoryAnimals: 'Animales',
      difficultyEasy: 'Fácil',
      difficultyMedium: 'Medio',
      difficultyHard: 'Difícil',
      publishActivity: 'Publicar',
      organizationLabel: 'Organización',
      studentLabel: 'Estudiante',
      ngosLabel: 'ONGs',
      participantListTitle: 'Lista de Participantes',
      registeredParticipants: 'Participantes Registrados',
      noParticipantsYet: 'No hay participantes.',
      closeLabel: 'Cerrar',
      contactLabel: 'Contacto',
      emergencyLabel: 'Emergencia',
      adminDashboardTitle: 'Panel de Admin',
      adminDashboardSubtitle: 'Gestiona usuarios y programas',
      totalUsersLabel: 'Total Usuarios',
      volunteersLabel2: 'Voluntarios',
      totalMissionsLabel: 'Total Misiones',
      viewManageMissions: 'Gestiona misiones de voluntariado',
      missionsCount: 'misiones',
      volunteersCount: 'voluntarios',
      addRemoveBadges: 'Gestiona insignias para voluntarios',
      badgesAvailable: 'insignias disponibles',
      openBadgeManager: 'Abrir Gestor de Insignias',
      ngoApplications: 'Solicitudes de ONG',
      ngoApplicationsDesc: 'Revisa solicitudes de registro',
      pendingApplications: 'solicitudes pendientes',
      approveNGO: 'Aprobar',
      rejectNGO: 'Rechazar',
      ngoListTitle: 'ONGs Registradas',
      ngoListDesc: 'Ver ONGs aprobadas',
      registeredNGOs: 'ONGs registradas',
      ngoName: 'Nombre',
      ngoEmail: 'Email',
      ngoDescription: 'Descripción',
      ngoWebsite: 'Sitio Web',
      appliedOn: 'Solicitado el',
      approvedOn: 'Aprobado el',
      noApplications: 'No hay solicitudes',
      adminLabel: 'Admin',
      activeStatus: 'Activo',
      deleteLabel: 'Eliminar',
      manageLabel: 'Gestionar',
      confirmDelete: '¿Eliminar esta misión?',
      backLabel: 'Volver',
      detailsLabel: 'Detalles',
      totalHoursLabel: 'Total Horas',
      missionsCompletedLabel: 'Misiones',
      badgesLabel: 'Insignias',
      orgsHelpedLabel: 'Orgs Ayudadas',
      roleLabel: 'Rol',
      statusLabel: 'Estado',
      joinDateLabel: 'Fecha Registro',
      ratingLabel: 'Calificación',
      reportLabel: 'Reporte',
      volunteerActivityBreakdown: 'Desglose de actividad',
      missionsCompleted: 'Misiones Completadas',
      missionTimeline: 'Línea de Tiempo',
      myBadges: 'Mis Insignias',
      volunteerRole: 'Voluntario',
      uploadCertDescription: 'Sube certificados para voluntarios',
      certificateNameOptional: 'Nombre (Opcional)',
      badgeManagementCenter: 'Centro de Insignias',
      badgeManagementDesc: 'Gestiona insignias de logros',
      selectUser: 'Seleccionar Usuario',
      selectUserDesc: 'Selecciona un Usuario',
      selectUserDescLong: 'Elige un voluntario para gestionar sus insignias',
      allBadgesTitle: 'Todas las Insignias',
      clickToUnlockRemove: 'Clic para desbloquear/quitar',
      clickToRemove: 'Clic para Quitar',
      clickToUnlock: 'Clic para Desbloquear',
      hoursUnit: 'horas',
      editUserTitle: 'Editar Usuario',
      fullNameLabel: 'Nombre Completo',
      emailLabel: 'Email',
      volunteerHoursLabel: 'Horas de Voluntariado',
      userRoleLabel: 'Rol',
      studentVolunteerRole: 'Estudiante/Voluntario',
      platformAdmin: 'Admin',
      saveLabel: 'Guardar',
      cancelLabel: 'Cancelar',
      userUpdatedSuccess: 'Usuario actualizado',
      profileUpdatedSuccess: '¡Perfil actualizado!',
      verifiedLabel: 'Verificado',
      cancelEditLabel: 'Cancelar',
      totalHoursProfile: 'Total Horas',
      activitiesCompleted: 'Actividades',
      badgesEarned: 'Insignias',
      organizationsHelpedProfile: 'Orgs Ayudadas',
      cityPlaceholder: 'Ciudad, País',
      backToDashboard: 'Volver al Panel',
      badgesDescription: 'Tus logros y reconocimientos',
      earnedLabel: 'Ganadas',
      totalAvailable: 'Total Disponible',
      earnedBadgesTitle: 'Insignias Ganadas',
      earnedOn: 'Ganada ',
      noBadgesYet: 'Sin insignias aún',
      noBadgesDesc: '¡Completa misiones para desbloquear insignias!',
      allAvailableBadges: 'Insignias Disponibles',
      lockedLabel: 'Bloqueada',
      earnedBadgesLabel: 'Insignias Ganadas',
      manageBadgesBtn: 'Gestionar Insignias',
      connectWithVolunteers: 'Conecta con voluntarios',
      addFriend: 'Añadir Amigo',
      searchFriendPlaceholder: 'Buscar...',
      sendRequest: 'Enviar',
      friendRequests: 'Solicitudes',
      accept: 'Aceptar',
      decline: 'Rechazar',
      myFriends: 'Mis Amigos',
      noFriendsYet: 'Sin amigos aún',
      startConnecting: '¡Conecta con otros voluntarios!',
      pendingLabel: 'Pendiente',
      removeFriend: 'Eliminar',
      pendingRequests: 'Solicitudes Pendientes',
      requestSent: 'Solicitud enviada',
      cancelRequest: 'Cancelar',
      userManagementTitle: 'Gestión de Usuarios',
      userManagementDesc: 'Gestiona usuarios registrados',
      tableHeaderUser: 'Usuario',
      tableHeaderRole: 'Rol',
      tableHeaderHours: 'Horas',
      tableHeaderMissions: 'Misiones',
      tableHeaderBadges: 'Insignias',
      tableHeaderStatus: 'Estado',
      tableHeaderActions: 'Acciones',
      roleStudentLabel: 'Estudiante',
      roleNGOLabel: 'ONG',
      roleAdminLabel: 'Admin',
      statusActive: 'Activo',
      statusVerified: 'Verificado',
      publishActivityBtn: 'Publicar',
      editMissionTitle: 'Editar Misión',
      titleLabelForm: 'Título',
      hoursLabelForm: 'Horas',
      maxParticipantsForm: 'Máx Participantes',
      categoryFormLabel: 'Categoría',
      difficultyFormLabel: 'Dificultad',
      saveChangesBtn: 'Guardar',
      certificateManagerTitle: 'Gestor de Certificados',
      certificatesTitle: 'Certificados y Premios',
      certificatesSubtitle: 'Solicita certificados oficiales',
      personalInformation: 'Información Personal',
      languageSettings: 'Idioma',
      volunteerInterests: 'Intereses',
      interestEnvironment: 'Medio Ambiente',
      interestEducation: 'Educación',
      interestHealthcare: 'Salud',
      interestCommunity: 'Comunidad',
      interestAnimals: 'Animales',
      interestElderlyCare: 'Cuidado de Ancianos',
      interestYouthPrograms: 'Programas Juveniles',
      interestFoodSecurity: 'Seguridad Alimentaria',
      requiredHoursLabel: 'Horas Requeridas',
      yourProgressLabel: 'Tu Progreso',
      signInFooterTagline: 'Empoderando comunidades',
      signInFooterCopyright: '© 2026 KindWorld.',
      noCertificatesUploadedYet: 'No hay certificados.',
      noCertificatesAvailableYet: 'No hay certificados disponibles.',
      transportOwn: 'Transporte propio',
      transportCarpool: 'Compartir viaje',
      transportPublic: 'Transporte público',
      selectRegion: 'Seleccionar Región',
      selectLanguage: 'Seleccionar Idioma',
      nearbyMissions: 'Mi Ubicación',
      findMissions: 'Buscar Misiones',
      allRegions: 'Todas las Regiones',
      allCountries: 'Todos los Países',
      regionSetup: 'Configura tu Perfil',
      regionSetupDesc: 'Ayúdanos a encontrar oportunidades cerca de ti',
      yourRegion: 'Tu Región',
      yourCountry: 'Tu País',
      preferredLanguage: 'Idioma Preferido',
      continueSetup: 'Continuar',
      skipForNow: 'Saltar'
    },
    fr: {
      title: 'KindWorld',
      subtitle: 'Transformez la Bonté en Impact',
      getStarted: 'Commencer',
      signIn: 'Se Connecter',
      startVolunteering: 'Commencer le Bénévolat',
      learnMore: 'En Savoir Plus',
      dashboard: 'Tableau de Bord',
      missions: 'Missions',
      certificates: 'Certificats',
      badges: 'Badges',
      friends: 'Amis',
      profile: 'Profil',
      volunteerHours: 'Heures de Bénévolat',
      thisMonthHours: 'Ce Mois',
      selectRole: 'Choisissez votre rôle:',
      student: 'Étudiant - Je veux être bénévole',
      ngo: 'ONG - Nous créons des missions',
      admin: 'Admin - Je gère la plateforme',
      welcomeBack: 'Bienvenue',
      impactSummary: 'Votre résumé d\'impact bénévole',
      projectsCompleted: 'Projets Terminés',
      organizationsHelped: 'Organisations Aidées',
      averageRating: 'Note Moyenne',
      monthlyProgress: 'Progrès sur 6 Mois',
      yearlyProgress: 'Progrès Annuel',
      allTimeProgress: 'Progrès Total',
      clickForDetails: 'Cliquez pour voir les détails',
      clickPointsForDetails: 'Cliquez pour détails',
      sixMonths: '6 Mois',
      oneYear: '1 An',
      allTime: 'Tout',
      logout: 'Déconnexion',
      volunteerPlatform: 'PLATEFORME DE BÉNÉVOLAT',
      heroTitle1: 'Autonomiser les Communautés',
      heroSubtitle1: 'Transformez des vies par l\'action compatissante',
      heroTitle2: 'Faire la Différence',
      heroSubtitle2: 'Chaque heure de bonté crée un impact durable',
      heroTitle3: 'Rejoignez le Mouvement',
      heroSubtitle3: 'Faites partie d\'un réseau mondial d\'acteurs du changement',
      welcomeBackTitle: 'Bienvenue',
      createAccount: 'Créer un Compte',
      signInToContinue: 'Connectez-vous pour continuer',
      joinKindWorld: 'Rejoignez KindWorld et faites la différence',
      emailOrUsername: 'Email ou Nom d\'utilisateur',
      password: 'Mot de Passe',
      forgotPassword: 'Mot de Passe Oublié?',
      pleaseFillAllFields: 'Veuillez entrer votre email et mot de passe',
      invalidCredentials: 'Email ou mot de passe invalide',
      rememberMe: 'Se souvenir de moi',
      noAccount: 'Pas de compte?',
      registerNow: 'Inscrivez-vous',
      firstName: 'Prénom',
      lastName: 'Nom',
      emailAddress: 'Adresse Email',
      phoneNumber: 'Numéro de Téléphone',
      country: 'Pays',
      cityResidency: 'Ville / Résidence',
      confirmPassword: 'Confirmer le Mot de Passe',
      minCharacters: 'Min. 8 caractères',
      agreeTerms: 'J\'accepte les',
      termsOfService: 'Conditions d\'Utilisation',
      and: 'et',
      privacyPolicy: 'Politique de Confidentialité',
      orSignInWith: 'ou connectez-vous avec',
      orRegisterWith: 'ou inscrivez-vous avec',
      alreadyHaveAccount: 'Déjà un compte?',
      selectCountry: 'Sélectionner un pays',
      creatingAccount: 'Création du Compte...',
      roleVolunteer: 'Bénévole',
      roleNGO: 'ONG',
      roleAdmin: 'Admin',
      ngoWelcome: 'Tableau de Bord ONG',
      manageMissions: 'Gérer les Missions',
      createMission: 'Créer une Mission',
      pendingVerifications: 'Vérifications en Attente',
      verifyHours: 'Vérifier les Heures',
      approveHours: 'Approuver',
      rejectHours: 'Rejeter',
      hoursToVerify: 'heures à vérifier',
      volunteerName: 'Nom du Bénévole',
      missionName: 'Nom de la Mission',
      hoursSubmitted: 'Heures Soumises',
      submittedDate: 'Date de Soumission',
      uploadCertificate: 'Télécharger un Certificat',
      certificateName: 'Nom du Certificat',
      uploadFile: 'Télécharger un Fichier',
      dragDropFile: 'Glissez ou cliquez pour télécharger',
      supportedFormats: 'Formats: PDF, PNG, JPG',
      publishCertificate: 'Publier le Certificat',
      saveDraft: 'Enregistrer le Brouillon',
      editProfile: 'Modifier le Profil',
      saveChanges: 'Enregistrer',
      personalInfo: 'Informations Personnelles',
      contactInfo: 'Coordonnées',
      volunteerStats: 'Statistiques',
      totalVolunteerHours: 'Total des Heures',
      viewAnalytics: 'Voir les Analyses',
      totalMissions: 'Total des Missions',
      activeVolunteers: 'Bénévoles Actifs',
      hoursCompleted: 'Heures Complétées',
      platformManagement: 'Gestion de la Plateforme',
      allMissions: 'Toutes les Missions',
      allUsers: 'Tous les Utilisateurs',
      removeMission: 'Supprimer la Mission',
      manageBadges: 'Gérer les Badges',
      addBadge: 'Ajouter un Badge',
      removeBadge: 'Retirer un Badge',
      userDetails: 'Détails de l\'Utilisateur',
      editUser: 'Modifier l\'Utilisateur',
      hoursBreakdown: 'Répartition des Heures',
      environmentHours: 'Environnement',
      communityHours: 'Communauté',
      healthcareHours: 'Santé',
      educationHours: 'Éducation',
      discoverImpact: 'Découvrez Notre Impact',
      discoverImpactSubtitle: 'Rejoignez une communauté mondiale transformant des vies.',
      ourGlobalImpact: 'Notre Impact Global',
      realNumbers: 'Chiffres réels de vrais bénévoles',
      activeInWorld: 'Actif dans le Monde Entier',
      communitySpans: 'Notre communauté s\'étend sur les continents',
      volunteerHoursLogged: 'Heures Enregistrées',
      treesPlanted: 'Arbres Plantés',
      mealsServed: 'Repas Servis',
      countriesReached: 'Pays Atteints',
      partnerNGOs: 'ONGs Partenaires',
      backToHome: 'Retour à l\'Accueil',
      joinNow: 'Rejoindre',
      volunteers: 'Bénévoles',
      countries: 'Pays',
      voicesFromCommunity: 'Voix de la Communauté',
      realStoriesVolunteers: 'Histoires réelles de bénévoles',
      hours: 'Heures',
      missionsLabel: 'Missions',
      trustedByOrganizations: 'Confiance des Organisations',
      ngosUseKindWorld: 'Les ONGs utilisent KindWorld pour amplifier leur impact',
      volunteersLabel: 'Bénévoles',
      missionsPosted: 'Missions Publiées',
      alignedWithSDG: 'Aligné sur les ODD de l\'ONU',
      sdgDescription: 'Nos missions contribuent aux objectifs de développement mondial',
      readyToMakeMark: 'Prêt à Faire Votre Marque?',
      joinThousands: 'Rejoignez des milliers créant un changement positif.',
      startVolunteeringBtn: 'Commencer',
      registerYourNGO: 'Enregistrer Votre ONG',
      trustedBy: 'Confiance de',
      partneredWith: 'Partenaire de',
      activeIn: 'Actif dans',
      volunteersIn: 'bénévoles dans',
      hoursLoggedDesc: 'Heures dédiées aux communautés',
      treesPlantedDesc: 'Contribuant à une planète plus verte',
      mealsServedDesc: 'Lutter contre la faim',
      countriesDesc: 'Mouvement mondial de bonté',
      activeVolunteersDesc: 'Communauté d\'acteurs du changement',
      partnerNGOsDesc: 'Organisations créant un impact',
      availableMissionsTitle: 'Missions Disponibles',
      availableMissionsSubtitle: 'Rejoignez et faites un impact positif',
      hoursLabel: 'heures',
      participantsLabel: 'participants',
      joinMission: 'Rejoindre',
      leaveMission: 'Quitter',
      joinMissionTitle: 'Rejoindre la Mission',
      viewDetails: 'Voir Détails',
      manageMission: 'Gérer',
      ngoMissionsTitle: 'Vos Missions Publiées',
      ngoMissionsSubtitle: 'Gérez vos activités et suivez la participation',
      adminMissionsTitle: 'Toutes les Missions',
      adminMissionsSubtitle: 'Surveillez et gérez toutes les activités de la plateforme',
      registrationForm: 'Formulaire d\'Inscription',
      fullName: 'Nom Complet',
      emergencyContact: 'Contact d\'Urgence',
      emergencyPhone: 'Téléphone d\'Urgence',
      allergies: 'Allergies',
      medicalConditions: 'Conditions Médicales',
      dietaryRestrictions: 'Restrictions Alimentaires',
      tshirtSize: 'Taille de T-Shirt',
      transportation: 'Transport',
      ownTransport: 'Propre',
      needRide: 'Besoin',
      publicTransport: 'Public',
      specialSkills: 'Compétences',
      agreeToTerms: 'J\'accepte les conditions',
      cancel: 'Annuler',
      confirmRegistration: 'Confirmer',
      activeVolunteersLabel: 'Bénévoles Actifs',
      partnerNGOsLabel: 'ONGs Partenaires',
      hoursLoggedLabel: 'Heures Enregistrées',
      citiesWorldwide: 'Villes',
      howItWorks: 'COMMENT ÇA MARCHE',
      journeyToImpact: 'Votre Parcours vers l\'Impact',
      journeySubtitle: 'Plateforme pour amplifier votre contribution',
      discoverMissions: 'Découvrir les Missions',
      discoverMissionsDesc: 'Trouvez des opportunités de bénévolat',
      trackProgress: 'Suivre les Progrès',
      trackProgressDesc: 'Surveillez vos heures et impact',
      earnRecognition: 'Gagner des Récompenses',
      earnRecognitionDesc: 'Obtenez badges et certificats',
      buildNetwork: 'Construire un Réseau',
      buildNetworkDesc: 'Connectez-vous avec des bénévoles',
      testimonialsLabel: 'TÉMOIGNAGES',
      successStoriesTitle: 'Histoires d\'Impact',
      successStoriesSubtitle: 'Histoires réelles de bénévoles et ONGs',
      scrollLabel: 'DÉFILER',
      hoursStats: 'Heures',
      missionsStats: 'Missions',
      volunteersStats: 'Bénévoles',
      projectsStats: 'Projets',
      globalImpactTitle: 'Impact Global',
      globalImpactSubtitle: 'Créer un changement significatif',
      activeCommunitiesTitle: 'Communautés Actives',
      northAmerica: 'Amérique du Nord',
      europe: 'Europe',
      asiaPacific: 'Asie Pacifique',
      latinAmerica: 'Amérique Latine',
      africaMiddleEast: 'Afrique et Moyen-Orient',
      africa: 'Afrique',
      middleEast: 'Moyen-Orient',
      sdgTitle: 'Contribuer aux ODD',
      sdgSubtitle: 'Missions alignées sur les efforts mondiaux',
      noPoverty: 'Pas de Pauvreté',
      zeroHunger: 'Faim Zéro',
      goodHealth: 'Bonne Santé',
      qualityEducation: 'Éducation de Qualité',
      reducedInequalities: 'Inégalités Réduites',
      sustainableCities: 'Villes Durables',
      climateAction: 'Action Climatique',
      partnerships: 'Partenariats',
      readyToImpact: 'Prêt pour l\'Impact?',
      readyToImpactSubtitle: 'Rejoignez 150 000+ bénévoles et 500+ organisations.',
      startVolunteeringToday: 'Commencer Aujourd\'hui',
      registerNGO: 'Enregistrer Votre ONG',
      freeToJoin: 'Gratuit',
      noCommitments: 'Sans engagement',
      startImpactImmediately: 'Impact immédiat',
      footerTagline: 'Autonomiser les bénévoles',
      footerCopyright: 'KindWorld. Tous droits réservés.',
      ngoDashboardTitle: 'Tableau de Bord ONG',
      ngoDashboardSubtitle: 'Créez des activités et gérez les certificats',
      ngoActiveVolunteers: 'Bénévoles Actifs',
      ngoPublishedActivities: 'Activités Publiées',
      ngoCertificatesIssued: 'Certificats Émis',
      ngoTotalImpactHours: 'Heures d\'Impact',
      createNewActivity: 'Créer une Activité',
      publishVolunteerOpportunities: 'Publiez des opportunités de bénévolat',
      createActivity: 'Créer une Activité',
      manageCertificatesTitle: 'Gérer les Certificats',
      createPublishCertificates: 'Créez et publiez des certificats',
      allHoursVerified: 'Toutes les heures vérifiées!',
      pendingStatus: 'En Attente',
      viewAll: 'Voir Tout',
      noActivitiesYet: 'Pas encore d\'activités.',
      participantsLabel2: 'Participants',
      durationLabel: 'Durée',
      upcomingStatus: 'À Venir',
      completedStatus: 'Terminé',
      editLabel: 'Modifier',
      issueCertificates: 'Émettre des Certificats',
      yourCertificates: 'Vos Certificats',
      uploadCertificateBtn: 'Télécharger',
      noCertificatesYet: 'Pas de certificats',
      uploadFirstCertificate: 'Téléchargez Votre Premier Certificat',
      issuedLabel: 'émis',
      publishLabel: 'Publier',
      previewLabel: 'Aperçu',
      createNewVolunteerActivity: 'Créer une Nouvelle Activité',
      activityTitle: 'Titre',
      activityTitlePlaceholder: 'ex., Nettoyage de Plage',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Décrivez l\'activité...',
      locationLabel: 'Lieu',
      locationPlaceholder: 'ex., Parc Central',
      dateLabel: 'Date',
      durationHours: 'Durée (heures)',
      maxParticipantsLabel: 'Max Participants',
      categoryLabel: 'Catégorie',
      difficultyLabel: 'Difficulté',
      categoryEnvironment: 'Environnement',
      categoryCommunity: 'Communauté',
      categoryHealthcare: 'Santé',
      categoryEducation: 'Éducation',
      categoryAnimals: 'Animaux',
      difficultyEasy: 'Facile',
      difficultyMedium: 'Moyen',
      difficultyHard: 'Difficile',
      publishActivity: 'Publier',
      organizationLabel: 'Organisation',
      studentLabel: 'Étudiant',
      ngosLabel: 'ONGs',
      participantListTitle: 'Liste des Participants',
      registeredParticipants: 'Participants Inscrits',
      noParticipantsYet: 'Pas de participants.',
      closeLabel: 'Fermer',
      contactLabel: 'Contact',
      emergencyLabel: 'Urgence',
      adminDashboardTitle: 'Tableau de Bord Admin',
      adminDashboardSubtitle: 'Gérez les utilisateurs et programmes',
      totalUsersLabel: 'Total Utilisateurs',
      volunteersLabel2: 'Bénévoles',
      totalMissionsLabel: 'Total Missions',
      viewManageMissions: 'Gérez les missions de bénévolat',
      missionsCount: 'missions',
      volunteersCount: 'bénévoles',
      addRemoveBadges: 'Gérez les badges pour les bénévoles',
      badgesAvailable: 'badges disponibles',
      openBadgeManager: 'Ouvrir le Gestionnaire de Badges',
      ngoApplications: 'Candidatures ONG',
      ngoApplicationsDesc: 'Examinez les demandes d\'inscription',
      pendingApplications: 'candidatures en attente',
      approveNGO: 'Approuver',
      rejectNGO: 'Rejeter',
      ngoListTitle: 'ONGs Enregistrées',
      ngoListDesc: 'Voir les ONGs approuvées',
      registeredNGOs: 'ONGs enregistrées',
      ngoName: 'Nom',
      ngoEmail: 'Email',
      ngoDescription: 'Description',
      ngoWebsite: 'Site Web',
      appliedOn: 'Candidature le',
      approvedOn: 'Approuvé le',
      noApplications: 'Pas de candidatures',
      adminLabel: 'Admin',
      activeStatus: 'Actif',
      deleteLabel: 'Supprimer',
      manageLabel: 'Gérer',
      confirmDelete: 'Supprimer cette mission?',
      backLabel: 'Retour',
      detailsLabel: 'Détails',
      totalHoursLabel: 'Total Heures',
      missionsCompletedLabel: 'Missions',
      badgesLabel: 'Badges',
      orgsHelpedLabel: 'Orgs Aidées',
      roleLabel: 'Rôle',
      statusLabel: 'Statut',
      joinDateLabel: 'Date d\'Inscription',
      ratingLabel: 'Note',
      reportLabel: 'Rapport',
      volunteerActivityBreakdown: 'Répartition de l\'activité',
      missionsCompleted: 'Missions Terminées',
      missionTimeline: 'Chronologie',
      myBadges: 'Mes Badges',
      volunteerRole: 'Bénévole',
      uploadCertDescription: 'Téléchargez des certificats pour les bénévoles',
      certificateNameOptional: 'Nom (Optionnel)',
      badgeManagementCenter: 'Centre de Gestion des Badges',
      badgeManagementDesc: 'Gérez les badges de réussite',
      selectUser: 'Sélectionner un Utilisateur',
      selectUserDesc: 'Sélectionnez un Utilisateur',
      selectUserDescLong: 'Choisissez un bénévole pour gérer ses badges',
      allBadgesTitle: 'Tous les Badges',
      clickToUnlockRemove: 'Cliquez pour déverrouiller/retirer',
      clickToRemove: 'Cliquez pour Retirer',
      clickToUnlock: 'Cliquez pour Déverrouiller',
      hoursUnit: 'heures',
      editUserTitle: 'Modifier l\'Utilisateur',
      fullNameLabel: 'Nom Complet',
      emailLabel: 'Email',
      volunteerHoursLabel: 'Heures de Bénévolat',
      userRoleLabel: 'Rôle',
      studentVolunteerRole: 'Étudiant/Bénévole',
      platformAdmin: 'Admin',
      saveLabel: 'Enregistrer',
      cancelLabel: 'Annuler',
      userUpdatedSuccess: 'Utilisateur mis à jour',
      profileUpdatedSuccess: 'Profil mis à jour!',
      verifiedLabel: 'Vérifié',
      cancelEditLabel: 'Annuler',
      totalHoursProfile: 'Total Heures',
      activitiesCompleted: 'Activités',
      badgesEarned: 'Badges',
      organizationsHelpedProfile: 'Orgs Aidées',
      cityPlaceholder: 'Ville, Pays',
      backToDashboard: 'Retour au Tableau de Bord',
      badgesDescription: 'Vos réalisations et reconnaissances',
      earnedLabel: 'Gagnés',
      totalAvailable: 'Total Disponible',
      earnedBadgesTitle: 'Badges Gagnés',
      earnedOn: 'Gagné ',
      noBadgesYet: 'Pas encore de badges',
      noBadgesDesc: 'Complétez des missions pour débloquer des badges!',
      allAvailableBadges: 'Badges Disponibles',
      lockedLabel: 'Verrouillé',
      earnedBadgesLabel: 'Badges Gagnés',
      manageBadgesBtn: 'Gérer les Badges',
      connectWithVolunteers: 'Connectez-vous avec des bénévoles',
      addFriend: 'Ajouter un Ami',
      searchFriendPlaceholder: 'Rechercher...',
      sendRequest: 'Envoyer',
      friendRequests: 'Demandes d\'Amis',
      accept: 'Accepter',
      decline: 'Refuser',
      myFriends: 'Mes Amis',
      noFriendsYet: 'Pas encore d\'amis',
      startConnecting: 'Connectez-vous avec d\'autres bénévoles!',
      pendingLabel: 'En Attente',
      removeFriend: 'Retirer',
      pendingRequests: 'Demandes en Attente',
      requestSent: 'Demande envoyée',
      cancelRequest: 'Annuler',
      userManagementTitle: 'Gestion des Utilisateurs',
      userManagementDesc: 'Gérez les utilisateurs inscrits',
      tableHeaderUser: 'Utilisateur',
      tableHeaderRole: 'Rôle',
      tableHeaderHours: 'Heures',
      tableHeaderMissions: 'Missions',
      tableHeaderBadges: 'Badges',
      tableHeaderStatus: 'Statut',
      tableHeaderActions: 'Actions',
      roleStudentLabel: 'Étudiant',
      roleNGOLabel: 'ONG',
      roleAdminLabel: 'Admin',
      statusActive: 'Actif',
      statusVerified: 'Vérifié',
      publishActivityBtn: 'Publier',
      editMissionTitle: 'Modifier la Mission',
      titleLabelForm: 'Titre',
      hoursLabelForm: 'Heures',
      maxParticipantsForm: 'Max Participants',
      categoryFormLabel: 'Catégorie',
      difficultyFormLabel: 'Difficulté',
      saveChangesBtn: 'Enregistrer',
      certificateManagerTitle: 'Gestionnaire de Certificats',
      certificatesTitle: 'Certificats et Prix',
      certificatesSubtitle: 'Demandez des certificats officiels',
      personalInformation: 'Informations Personnelles',
      languageSettings: 'Langue',
      volunteerInterests: 'Intérêts',
      interestEnvironment: 'Environnement',
      interestEducation: 'Éducation',
      interestHealthcare: 'Santé',
      interestCommunity: 'Communauté',
      interestAnimals: 'Animaux',
      interestElderlyCare: 'Soins aux Personnes Âgées',
      interestYouthPrograms: 'Programmes Jeunesse',
      interestFoodSecurity: 'Sécurité Alimentaire',
      requiredHoursLabel: 'Heures Requises',
      yourProgressLabel: 'Votre Progrès',
      signInFooterTagline: 'Autonomiser les communautés',
      signInFooterCopyright: '© 2026 KindWorld.',
      noCertificatesUploadedYet: 'Pas de certificats.',
      noCertificatesAvailableYet: 'Pas de certificats disponibles.',
      transportOwn: 'Transport personnel',
      transportCarpool: 'Covoiturage',
      transportPublic: 'Transport public',
      selectRegion: 'Sélectionner la Région',
      selectLanguage: 'Sélectionner la Langue',
      nearbyMissions: 'Ma Position',
      findMissions: 'Rechercher',
      allRegions: 'Toutes les Régions',
      allCountries: 'Tous les Pays',
      regionSetup: 'Configurez votre Profil',
      regionSetupDesc: 'Aidez-nous à trouver des opportunités près de chez vous',
      yourRegion: 'Votre Région',
      yourCountry: 'Votre Pays',
      preferredLanguage: 'Langue Préférée',
      continueSetup: 'Continuer',
      skipForNow: 'Passer'
    },
    pt: {
      title: 'KindWorld',
      subtitle: 'Transforme Bondade em Impacto',
      getStarted: 'Começar',
      signIn: 'Entrar',
      startVolunteering: 'Começar a Voluntariar',
      learnMore: 'Saiba Mais',
      dashboard: 'Painel',
      missions: 'Missões',
      certificates: 'Certificados',
      badges: 'Distintivos',
      friends: 'Amigos',
      profile: 'Perfil',
      volunteerHours: 'Horas de Voluntariado',
      thisMonthHours: 'Este Mês',
      selectRole: 'Escolha seu papel:',
      student: 'Estudante - Quero ser voluntário',
      ngo: 'ONG - Criamos missões',
      admin: 'Admin - Gerencio a plataforma',
      welcomeBack: 'Bem-vindo de volta',
      impactSummary: 'Seu resumo de impacto voluntário',
      projectsCompleted: 'Projetos Concluídos',
      organizationsHelped: 'Organizações Ajudadas',
      averageRating: 'Avaliação Média',
      monthlyProgress: 'Progresso de 6 Meses',
      yearlyProgress: 'Progresso Anual',
      allTimeProgress: 'Progresso Total',
      clickForDetails: 'Clique para ver detalhes',
      clickPointsForDetails: 'Clique para detalhes',
      sixMonths: '6 Meses',
      oneYear: '1 Ano',
      allTime: 'Tudo',
      logout: 'Sair',
      volunteerPlatform: 'PLATAFORMA DE VOLUNTARIADO',
      heroTitle1: 'Empodere Comunidades',
      heroSubtitle1: 'Transforme vidas através da ação compassiva',
      heroTitle2: 'Faça a Diferença',
      heroSubtitle2: 'Cada hora de bondade cria impacto duradouro',
      heroTitle3: 'Junte-se ao Movimento',
      heroSubtitle3: 'Faça parte de uma rede global de agentes de mudança',
      welcomeBackTitle: 'Bem-vindo',
      createAccount: 'Criar Conta',
      signInToContinue: 'Entre para continuar',
      joinKindWorld: 'Junte-se ao KindWorld e faça a diferença',
      emailOrUsername: 'Email ou Nome de Usuário',
      password: 'Senha',
      forgotPassword: 'Esqueceu a Senha?',
      pleaseFillAllFields: 'Por favor, insira seu email e senha',
      invalidCredentials: 'Email ou senha inválidos',
      rememberMe: 'Lembrar-me',
      noAccount: 'Não tem conta?',
      registerNow: 'Registre-se',
      firstName: 'Nome',
      lastName: 'Sobrenome',
      emailAddress: 'Endereço de Email',
      phoneNumber: 'Número de Telefone',
      country: 'País',
      cityResidency: 'Cidade / Residência',
      confirmPassword: 'Confirmar Senha',
      minCharacters: 'Mín. 8 caracteres',
      agreeTerms: 'Eu aceito os',
      termsOfService: 'Termos de Serviço',
      and: 'e',
      privacyPolicy: 'Política de Privacidade',
      orSignInWith: 'ou entre com',
      orRegisterWith: 'ou registre-se com',
      alreadyHaveAccount: 'Já tem uma conta?',
      selectCountry: 'Selecionar país',
      creatingAccount: 'Criando Conta...',
      roleVolunteer: 'Voluntário',
      roleNGO: 'ONG',
      roleAdmin: 'Admin',
      ngoWelcome: 'Painel da ONG',
      manageMissions: 'Gerenciar Missões',
      createMission: 'Criar Missão',
      pendingVerifications: 'Verificações Pendentes',
      verifyHours: 'Verificar Horas',
      approveHours: 'Aprovar',
      rejectHours: 'Rejeitar',
      hoursToVerify: 'horas para verificar',
      volunteerName: 'Nome do Voluntário',
      missionName: 'Nome da Missão',
      hoursSubmitted: 'Horas Enviadas',
      submittedDate: 'Data de Envio',
      uploadCertificate: 'Enviar Certificado',
      certificateName: 'Nome do Certificado',
      uploadFile: 'Enviar Arquivo',
      dragDropFile: 'Arraste ou clique para enviar',
      supportedFormats: 'Formatos: PDF, PNG, JPG',
      publishCertificate: 'Publicar Certificado',
      saveDraft: 'Salvar Rascunho',
      editProfile: 'Editar Perfil',
      saveChanges: 'Salvar',
      personalInfo: 'Informações Pessoais',
      contactInfo: 'Informações de Contato',
      volunteerStats: 'Estatísticas',
      totalVolunteerHours: 'Total de Horas',
      viewAnalytics: 'Ver Análises',
      totalMissions: 'Total de Missões',
      activeVolunteers: 'Voluntários Ativos',
      hoursCompleted: 'Horas Completadas',
      platformManagement: 'Gestão da Plataforma',
      allMissions: 'Todas as Missões',
      allUsers: 'Todos os Usuários',
      removeMission: 'Remover Missão',
      manageBadges: 'Gerenciar Distintivos',
      addBadge: 'Adicionar Distintivo',
      removeBadge: 'Remover Distintivo',
      userDetails: 'Detalhes do Usuário',
      editUser: 'Editar Usuário',
      hoursBreakdown: 'Detalhamento de Horas',
      environmentHours: 'Meio Ambiente',
      communityHours: 'Comunidade',
      healthcareHours: 'Saúde',
      educationHours: 'Educação',
      discoverImpact: 'Descubra Nosso Impacto',
      discoverImpactSubtitle: 'Junte-se a uma comunidade global transformando vidas.',
      ourGlobalImpact: 'Nosso Impacto Global',
      realNumbers: 'Números reais de voluntários reais',
      activeInWorld: 'Ativo no Mundo Todo',
      communitySpans: 'Nossa comunidade abrange continentes',
      volunteerHoursLogged: 'Horas Registradas',
      treesPlanted: 'Árvores Plantadas',
      mealsServed: 'Refeições Servidas',
      countriesReached: 'Países Alcançados',
      partnerNGOs: 'ONGs Parceiras',
      backToHome: 'Voltar ao Início',
      joinNow: 'Junte-se',
      volunteers: 'Voluntários',
      countries: 'Países',
      voicesFromCommunity: 'Vozes da Comunidade',
      realStoriesVolunteers: 'Histórias reais de voluntários',
      hours: 'Horas',
      missionsLabel: 'Missões',
      trustedByOrganizations: 'Confiado por Organizações',
      ngosUseKindWorld: 'ONGs usam KindWorld para amplificar seu impacto',
      volunteersLabel: 'Voluntários',
      missionsPosted: 'Missões Publicadas',
      alignedWithSDG: 'Alinhado com os ODS da ONU',
      sdgDescription: 'Nossas missões contribuem para objetivos de desenvolvimento global',
      readyToMakeMark: 'Pronto para Deixar sua Marca?',
      joinThousands: 'Junte-se a milhares criando mudança positiva.',
      startVolunteeringBtn: 'Começar',
      registerYourNGO: 'Registre sua ONG',
      trustedBy: 'Confiado por',
      partneredWith: 'Parceiro de',
      activeIn: 'Ativo em',
      volunteersIn: 'voluntários em',
      hoursLoggedDesc: 'Horas dedicadas às comunidades',
      treesPlantedDesc: 'Contribuindo para um planeta mais verde',
      mealsServedDesc: 'Combatendo a fome',
      countriesDesc: 'Movimento global de bondade',
      activeVolunteersDesc: 'Comunidade de agentes de mudança',
      partnerNGOsDesc: 'Organizações criando impacto',
      availableMissionsTitle: 'Missões Disponíveis',
      availableMissionsSubtitle: 'Junte-se e faça um impacto positivo',
      hoursLabel: 'horas',
      participantsLabel: 'participantes',
      joinMission: 'Participar',
      leaveMission: 'Sair',
      joinMissionTitle: 'Participar da Missão',
      viewDetails: 'Ver Detalhes',
      manageMission: 'Gerenciar',
      ngoMissionsTitle: 'Suas Missões Publicadas',
      ngoMissionsSubtitle: 'Gerencie suas atividades e acompanhe a participação',
      adminMissionsTitle: 'Todas as Missões',
      adminMissionsSubtitle: 'Monitore e gerencie todas as atividades da plataforma',
      registrationForm: 'Formulário de Inscrição',
      fullName: 'Nome Completo',
      emergencyContact: 'Contato de Emergência',
      emergencyPhone: 'Telefone de Emergência',
      allergies: 'Alergias',
      medicalConditions: 'Condições Médicas',
      dietaryRestrictions: 'Restrições Alimentares',
      tshirtSize: 'Tamanho da Camiseta',
      transportation: 'Transporte',
      ownTransport: 'Próprio',
      needRide: 'Preciso',
      publicTransport: 'Público',
      specialSkills: 'Habilidades',
      agreeToTerms: 'Aceito os termos',
      cancel: 'Cancelar',
      confirmRegistration: 'Confirmar',
      activeVolunteersLabel: 'Voluntários Ativos',
      partnerNGOsLabel: 'ONGs Parceiras',
      hoursLoggedLabel: 'Horas Registradas',
      citiesWorldwide: 'Cidades',
      howItWorks: 'COMO FUNCIONA',
      journeyToImpact: 'Sua Jornada ao Impacto',
      journeySubtitle: 'Plataforma para amplificar sua contribuição',
      discoverMissions: 'Descobrir Missões',
      discoverMissionsDesc: 'Encontre oportunidades de voluntariado',
      trackProgress: 'Acompanhar Progresso',
      trackProgressDesc: 'Monitore suas horas e impacto',
      earnRecognition: 'Ganhar Reconhecimento',
      earnRecognitionDesc: 'Obtenha distintivos e certificados',
      buildNetwork: 'Construir Rede',
      buildNetworkDesc: 'Conecte-se com voluntários',
      testimonialsLabel: 'DEPOIMENTOS',
      successStoriesTitle: 'Histórias de Impacto',
      successStoriesSubtitle: 'Histórias reais de voluntários e ONGs',
      scrollLabel: 'ROLAR',
      hoursStats: 'Horas',
      missionsStats: 'Missões',
      volunteersStats: 'Voluntários',
      projectsStats: 'Projetos',
      globalImpactTitle: 'Impacto Global',
      globalImpactSubtitle: 'Criando mudança significativa',
      activeCommunitiesTitle: 'Comunidades Ativas',
      northAmerica: 'América do Norte',
      europe: 'Europa',
      asiaPacific: 'Ásia Pacífico',
      latinAmerica: 'América Latina',
      africaMiddleEast: 'África e Oriente Médio',
      africa: 'África',
      middleEast: 'Oriente Médio',
      sdgTitle: 'Contribuindo para os ODS',
      sdgSubtitle: 'Missões alinhadas com esforços globais',
      noPoverty: 'Sem Pobreza',
      zeroHunger: 'Fome Zero',
      goodHealth: 'Boa Saúde',
      qualityEducation: 'Educação de Qualidade',
      reducedInequalities: 'Desigualdades Reduzidas',
      sustainableCities: 'Cidades Sustentáveis',
      climateAction: 'Ação Climática',
      partnerships: 'Parcerias',
      readyToImpact: 'Pronto para o Impacto?',
      readyToImpactSubtitle: 'Junte-se a 150.000+ voluntários e 500+ organizações.',
      startVolunteeringToday: 'Comece Hoje',
      registerNGO: 'Registre sua ONG',
      freeToJoin: 'Gratuito',
      noCommitments: 'Sem compromissos',
      startImpactImmediately: 'Impacto imediato',
      footerTagline: 'Empoderando voluntários',
      footerCopyright: 'KindWorld. Todos os direitos reservados.',
      ngoDashboardTitle: 'Painel da ONG',
      ngoDashboardSubtitle: 'Crie atividades e gerencie certificados',
      ngoActiveVolunteers: 'Voluntários Ativos',
      ngoPublishedActivities: 'Atividades Publicadas',
      ngoCertificatesIssued: 'Certificados Emitidos',
      ngoTotalImpactHours: 'Horas de Impacto',
      createNewActivity: 'Criar Atividade',
      publishVolunteerOpportunities: 'Publique oportunidades de voluntariado',
      createActivity: 'Criar Atividade',
      manageCertificatesTitle: 'Gerenciar Certificados',
      createPublishCertificates: 'Crie e publique certificados',
      allHoursVerified: 'Todas as horas verificadas!',
      pendingStatus: 'Pendente',
      viewAll: 'Ver Tudo',
      noActivitiesYet: 'Nenhuma atividade ainda.',
      participantsLabel2: 'Participantes',
      durationLabel: 'Duração',
      upcomingStatus: 'Em Breve',
      completedStatus: 'Concluído',
      editLabel: 'Editar',
      issueCertificates: 'Emitir Certificados',
      yourCertificates: 'Seus Certificados',
      uploadCertificateBtn: 'Enviar',
      noCertificatesYet: 'Sem certificados',
      uploadFirstCertificate: 'Envie Seu Primeiro Certificado',
      issuedLabel: 'emitidos',
      publishLabel: 'Publicar',
      previewLabel: 'Visualizar',
      createNewVolunteerActivity: 'Criar Nova Atividade',
      activityTitle: 'Título',
      activityTitlePlaceholder: 'ex., Limpeza de Praia',
      descriptionLabel: 'Descrição',
      descriptionPlaceholder: 'Descreva a atividade...',
      locationLabel: 'Local',
      locationPlaceholder: 'ex., Parque Central',
      dateLabel: 'Data',
      durationHours: 'Duração (horas)',
      maxParticipantsLabel: 'Máx Participantes',
      categoryLabel: 'Categoria',
      difficultyLabel: 'Dificuldade',
      categoryEnvironment: 'Meio Ambiente',
      categoryCommunity: 'Comunidade',
      categoryHealthcare: 'Saúde',
      categoryEducation: 'Educação',
      categoryAnimals: 'Animais',
      difficultyEasy: 'Fácil',
      difficultyMedium: 'Médio',
      difficultyHard: 'Difícil',
      publishActivity: 'Publicar',
      organizationLabel: 'Organização',
      studentLabel: 'Estudante',
      ngosLabel: 'ONGs',
      participantListTitle: 'Lista de Participantes',
      registeredParticipants: 'Participantes Inscritos',
      noParticipantsYet: 'Sem participantes.',
      closeLabel: 'Fechar',
      contactLabel: 'Contato',
      emergencyLabel: 'Emergência',
      adminDashboardTitle: 'Painel do Admin',
      adminDashboardSubtitle: 'Gerencie usuários e programas',
      totalUsersLabel: 'Total de Usuários',
      volunteersLabel2: 'Voluntários',
      totalMissionsLabel: 'Total de Missões',
      viewManageMissions: 'Gerencie missões de voluntariado',
      missionsCount: 'missões',
      volunteersCount: 'voluntários',
      addRemoveBadges: 'Gerencie distintivos para voluntários',
      badgesAvailable: 'distintivos disponíveis',
      openBadgeManager: 'Abrir Gerenciador de Distintivos',
      ngoApplications: 'Candidaturas de ONG',
      ngoApplicationsDesc: 'Revise solicitações de registro',
      pendingApplications: 'candidaturas pendentes',
      approveNGO: 'Aprovar',
      rejectNGO: 'Rejeitar',
      ngoListTitle: 'ONGs Registradas',
      ngoListDesc: 'Ver ONGs aprovadas',
      registeredNGOs: 'ONGs registradas',
      ngoName: 'Nome',
      ngoEmail: 'Email',
      ngoDescription: 'Descrição',
      ngoWebsite: 'Site',
      appliedOn: 'Candidatura em',
      approvedOn: 'Aprovado em',
      noApplications: 'Sem candidaturas',
      adminLabel: 'Admin',
      activeStatus: 'Ativo',
      deleteLabel: 'Excluir',
      manageLabel: 'Gerenciar',
      confirmDelete: 'Excluir esta missão?',
      backLabel: 'Voltar',
      detailsLabel: 'Detalhes',
      totalHoursLabel: 'Total de Horas',
      missionsCompletedLabel: 'Missões',
      badgesLabel: 'Distintivos',
      orgsHelpedLabel: 'Orgs Ajudadas',
      roleLabel: 'Função',
      statusLabel: 'Status',
      joinDateLabel: 'Data de Registro',
      ratingLabel: 'Avaliação',
      reportLabel: 'Relatório',
      volunteerActivityBreakdown: 'Detalhamento de atividade',
      missionsCompleted: 'Missões Concluídas',
      missionTimeline: 'Linha do Tempo',
      myBadges: 'Meus Distintivos',
      volunteerRole: 'Voluntário',
      uploadCertDescription: 'Envie certificados para voluntários',
      certificateNameOptional: 'Nome (Opcional)',
      badgeManagementCenter: 'Centro de Distintivos',
      badgeManagementDesc: 'Gerencie distintivos de conquistas',
      selectUser: 'Selecionar Usuário',
      selectUserDesc: 'Selecione um Usuário',
      selectUserDescLong: 'Escolha um voluntário para gerenciar seus distintivos',
      allBadgesTitle: 'Todos os Distintivos',
      clickToUnlockRemove: 'Clique para desbloquear/remover',
      clickToRemove: 'Clique para Remover',
      clickToUnlock: 'Clique para Desbloquear',
      hoursUnit: 'horas',
      editUserTitle: 'Editar Usuário',
      fullNameLabel: 'Nome Completo',
      emailLabel: 'Email',
      volunteerHoursLabel: 'Horas de Voluntariado',
      userRoleLabel: 'Função',
      studentVolunteerRole: 'Estudante/Voluntário',
      platformAdmin: 'Admin',
      saveLabel: 'Salvar',
      cancelLabel: 'Cancelar',
      userUpdatedSuccess: 'Usuário atualizado',
      profileUpdatedSuccess: 'Perfil atualizado!',
      verifiedLabel: 'Verificado',
      cancelEditLabel: 'Cancelar',
      totalHoursProfile: 'Total de Horas',
      activitiesCompleted: 'Atividades',
      badgesEarned: 'Distintivos',
      organizationsHelpedProfile: 'Orgs Ajudadas',
      cityPlaceholder: 'Cidade, País',
      backToDashboard: 'Voltar ao Painel',
      badgesDescription: 'Suas conquistas e reconhecimentos',
      earnedLabel: 'Ganhos',
      totalAvailable: 'Total Disponível',
      earnedBadgesTitle: 'Distintivos Ganhos',
      earnedOn: 'Ganho ',
      noBadgesYet: 'Sem distintivos ainda',
      noBadgesDesc: 'Complete missões para desbloquear distintivos!',
      allAvailableBadges: 'Distintivos Disponíveis',
      lockedLabel: 'Bloqueado',
      earnedBadgesLabel: 'Distintivos Ganhos',
      manageBadgesBtn: 'Gerenciar Distintivos',
      connectWithVolunteers: 'Conecte-se com voluntários',
      addFriend: 'Adicionar Amigo',
      searchFriendPlaceholder: 'Buscar...',
      sendRequest: 'Enviar',
      friendRequests: 'Pedidos de Amizade',
      accept: 'Aceitar',
      decline: 'Recusar',
      myFriends: 'Meus Amigos',
      noFriendsYet: 'Sem amigos ainda',
      startConnecting: 'Conecte-se com outros voluntários!',
      pendingLabel: 'Pendente',
      removeFriend: 'Remover',
      pendingRequests: 'Pedidos Pendentes',
      requestSent: 'Pedido enviado',
      cancelRequest: 'Cancelar',
      userManagementTitle: 'Gestão de Usuários',
      userManagementDesc: 'Gerencie usuários registrados',
      tableHeaderUser: 'Usuário',
      tableHeaderRole: 'Função',
      tableHeaderHours: 'Horas',
      tableHeaderMissions: 'Missões',
      tableHeaderBadges: 'Distintivos',
      tableHeaderStatus: 'Status',
      tableHeaderActions: 'Ações',
      roleStudentLabel: 'Estudante',
      roleNGOLabel: 'ONG',
      roleAdminLabel: 'Admin',
      statusActive: 'Ativo',
      statusVerified: 'Verificado',
      publishActivityBtn: 'Publicar',
      editMissionTitle: 'Editar Missão',
      titleLabelForm: 'Título',
      hoursLabelForm: 'Horas',
      maxParticipantsForm: 'Máx Participantes',
      categoryFormLabel: 'Categoria',
      difficultyFormLabel: 'Dificuldade',
      saveChangesBtn: 'Salvar',
      certificateManagerTitle: 'Gerenciador de Certificados',
      certificatesTitle: 'Certificados e Prêmios',
      certificatesSubtitle: 'Solicite certificados oficiais',
      personalInformation: 'Informações Pessoais',
      languageSettings: 'Idioma',
      volunteerInterests: 'Interesses',
      interestEnvironment: 'Meio Ambiente',
      interestEducation: 'Educação',
      interestHealthcare: 'Saúde',
      interestCommunity: 'Comunidade',
      interestAnimals: 'Animais',
      interestElderlyCare: 'Cuidados com Idosos',
      interestYouthPrograms: 'Programas para Jovens',
      interestFoodSecurity: 'Segurança Alimentar',
      requiredHoursLabel: 'Horas Necessárias',
      yourProgressLabel: 'Seu Progresso',
      signInFooterTagline: 'Empoderando comunidades',
      signInFooterCopyright: '© 2026 KindWorld.',
      noCertificatesUploadedYet: 'Sem certificados.',
      noCertificatesAvailableYet: 'Sem certificados disponíveis.',
      transportOwn: 'Transporte próprio',
      transportCarpool: 'Carona',
      transportPublic: 'Transporte público',
      selectRegion: 'Selecionar Região',
      selectLanguage: 'Selecionar Idioma',
      nearbyMissions: 'Minha Localização',
      findMissions: 'Buscar Missões',
      allRegions: 'Todas as Regiões',
      allCountries: 'Todos os Países',
      regionSetup: 'Configure seu Perfil',
      regionSetupDesc: 'Ajude-nos a encontrar oportunidades perto de você',
      yourRegion: 'Sua Região',
      yourCountry: 'Seu País',
      preferredLanguage: 'Idioma Preferido',
      continueSetup: 'Continuar',
      skipForNow: 'Pular'
    },
    ja: {
      title: 'KindWorld',
      subtitle: '優しさをインパクトに変える',
      getStarted: '始める',
      signIn: 'ログイン',
      startVolunteering: 'ボランティアを始める',
      learnMore: '詳細を見る',
      dashboard: 'ダッシュボード',
      missions: 'ミッション',
      certificates: '証明書',
      badges: 'バッジ',
      friends: '友達',
      profile: 'プロフィール',
      volunteerHours: 'ボランティア時間',
      thisMonthHours: '今月',
      selectRole: '役割を選択:',
      student: '学生 - ボランティアをしたい',
      ngo: 'NGO - ミッションを作成',
      admin: '管理者 - プラットフォームを管理',
      welcomeBack: 'おかえりなさい',
      impactSummary: 'ボランティアインパクトの要約',
      projectsCompleted: '完了したプロジェクト',
      organizationsHelped: '支援した組織',
      averageRating: '平均評価',
      monthlyProgress: '6ヶ月の進捗',
      yearlyProgress: '年間進捗',
      allTimeProgress: '累計進捗',
      clickForDetails: 'クリックして詳細を見る',
      clickPointsForDetails: 'クリックして詳細',
      sixMonths: '6ヶ月',
      oneYear: '1年',
      allTime: '全期間',
      logout: 'ログアウト',
      volunteerPlatform: 'ボランティアプラットフォーム',
      heroTitle1: 'コミュニティを支援',
      heroSubtitle1: '思いやりの行動で人生を変える',
      heroTitle2: '変化を起こす',
      heroSubtitle2: '優しさの一時間が持続的な影響を生む',
      heroTitle3: '運動に参加',
      heroSubtitle3: 'グローバルなチェンジメーカーネットワークの一員に',
      welcomeBackTitle: 'おかえりなさい',
      createAccount: 'アカウント作成',
      signInToContinue: 'ログインして続ける',
      joinKindWorld: 'KindWorldに参加して変化を起こそう',
      emailOrUsername: 'メールまたはユーザー名',
      password: 'パスワード',
      forgotPassword: 'パスワードをお忘れですか？',
      pleaseFillAllFields: 'メールアドレスとパスワードを入力してください',
      invalidCredentials: 'メールアドレスまたはパスワードが無効です',
      rememberMe: 'ログイン状態を保持',
      noAccount: 'アカウントがありませんか？',
      registerNow: '今すぐ登録',
      firstName: '名',
      lastName: '姓',
      emailAddress: 'メールアドレス',
      phoneNumber: '電話番号',
      country: '国',
      cityResidency: '市区町村',
      confirmPassword: 'パスワード確認',
      minCharacters: '最低8文字',
      agreeTerms: '同意します',
      termsOfService: '利用規約',
      and: 'と',
      privacyPolicy: 'プライバシーポリシー',
      orSignInWith: 'または以下でログイン',
      orRegisterWith: 'または以下で登録',
      alreadyHaveAccount: 'アカウントをお持ちですか？',
      selectCountry: '国を選択',
      creatingAccount: 'アカウント作成中...',
      roleVolunteer: 'ボランティア',
      roleNGO: 'NGO',
      roleAdmin: '管理者',
      ngoWelcome: 'NGOダッシュボード',
      manageMissions: 'ミッション管理',
      createMission: 'ミッション作成',
      pendingVerifications: '保留中の確認',
      verifyHours: '時間を確認',
      approveHours: '承認',
      rejectHours: '却下',
      hoursToVerify: '確認待ちの時間',
      volunteerName: 'ボランティア名',
      missionName: 'ミッション名',
      hoursSubmitted: '提出された時間',
      submittedDate: '提出日',
      uploadCertificate: '証明書をアップロード',
      certificateName: '証明書名',
      uploadFile: 'ファイルをアップロード',
      dragDropFile: 'ドラッグまたはクリック',
      supportedFormats: '形式: PDF, PNG, JPG',
      publishCertificate: '証明書を公開',
      saveDraft: '下書き保存',
      editProfile: 'プロフィール編集',
      saveChanges: '保存',
      personalInfo: '個人情報',
      contactInfo: '連絡先情報',
      volunteerStats: '統計',
      totalVolunteerHours: '総時間',
      viewAnalytics: '分析を見る',
      totalMissions: '総ミッション',
      activeVolunteers: 'アクティブなボランティア',
      hoursCompleted: '完了した時間',
      platformManagement: 'プラットフォーム管理',
      allMissions: 'すべてのミッション',
      allUsers: 'すべてのユーザー',
      removeMission: 'ミッション削除',
      manageBadges: 'バッジ管理',
      addBadge: 'バッジ追加',
      removeBadge: 'バッジ削除',
      userDetails: 'ユーザー詳細',
      editUser: 'ユーザー編集',
      hoursBreakdown: '時間の内訳',
      environmentHours: '環境',
      communityHours: 'コミュニティ',
      healthcareHours: '医療',
      educationHours: '教育',
      discoverImpact: 'インパクトを発見',
      discoverImpactSubtitle: '人生を変えるグローバルコミュニティに参加',
      ourGlobalImpact: 'グローバルインパクト',
      realNumbers: '実際のボランティアの実数',
      activeInWorld: '世界中で活動',
      communitySpans: '大陸を超えるコミュニティ',
      volunteerHoursLogged: '記録された時間',
      treesPlanted: '植樹された木',
      mealsServed: '提供された食事',
      countriesReached: '到達した国',
      partnerNGOs: 'パートナーNGO',
      backToHome: 'ホームに戻る',
      joinNow: '今すぐ参加',
      volunteers: 'ボランティア',
      countries: '国',
      voicesFromCommunity: 'コミュニティの声',
      realStoriesVolunteers: 'ボランティアの実話',
      hours: '時間',
      missionsLabel: 'ミッション',
      trustedByOrganizations: '組織から信頼',
      ngosUseKindWorld: 'NGOがKindWorldを使用',
      volunteersLabel: 'ボランティア',
      missionsPosted: '投稿されたミッション',
      alignedWithSDG: '国連SDGsと連携',
      sdgDescription: 'グローバル開発目標に貢献',
      readyToMakeMark: '準備はできましたか？',
      joinThousands: '何千人もの人々に参加',
      startVolunteeringBtn: '始める',
      registerYourNGO: 'NGOを登録',
      trustedBy: '信頼',
      partneredWith: '提携',
      activeIn: '活動中',
      volunteersIn: 'ボランティア',
      hoursLoggedDesc: 'コミュニティに捧げた時間',
      treesPlantedDesc: '緑の地球に貢献',
      mealsServedDesc: '飢餓と闘う',
      countriesDesc: 'グローバルな優しさの運動',
      activeVolunteersDesc: 'チェンジメーカーのコミュニティ',
      partnerNGOsDesc: 'インパクトを創る組織',
      availableMissionsTitle: '利用可能なミッション',
      availableMissionsSubtitle: '参加してポジティブな影響を',
      hoursLabel: '時間',
      participantsLabel: '参加者',
      joinMission: '参加',
      leaveMission: '退出',
      joinMissionTitle: 'ミッションに参加',
      viewDetails: '詳細を見る',
      manageMission: '管理',
      ngoMissionsTitle: '公開したミッション',
      ngoMissionsSubtitle: 'ボランティア活動を管理し、参加状況を追跡',
      adminMissionsTitle: 'すべてのミッション',
      adminMissionsSubtitle: 'プラットフォーム上のすべての活動を監視・管理',
      registrationForm: '登録フォーム',
      fullName: '氏名',
      emergencyContact: '緊急連絡先',
      emergencyPhone: '緊急電話',
      allergies: 'アレルギー',
      medicalConditions: '既往症',
      dietaryRestrictions: '食事制限',
      tshirtSize: 'Tシャツサイズ',
      transportation: '交通手段',
      ownTransport: '自家用車',
      needRide: '送迎希望',
      publicTransport: '公共交通',
      specialSkills: 'スキル',
      agreeToTerms: '規約に同意',
      cancel: 'キャンセル',
      confirmRegistration: '確認',
      activeVolunteersLabel: 'アクティブなボランティア',
      partnerNGOsLabel: 'パートナーNGO',
      hoursLoggedLabel: '記録された時間',
      citiesWorldwide: '都市',
      howItWorks: '使い方',
      journeyToImpact: 'インパクトへの旅',
      journeySubtitle: '貢献を増幅するプラットフォーム',
      discoverMissions: 'ミッションを発見',
      discoverMissionsDesc: 'ボランティアの機会を見つける',
      trackProgress: '進捗を追跡',
      trackProgressDesc: '時間とインパクトを監視',
      earnRecognition: '認定を獲得',
      earnRecognitionDesc: 'バッジと証明書を取得',
      buildNetwork: 'ネットワーク構築',
      buildNetworkDesc: 'ボランティアとつながる',
      testimonialsLabel: '体験談',
      successStoriesTitle: 'インパクトストーリー',
      successStoriesSubtitle: 'ボランティアとNGOの実話',
      scrollLabel: 'スクロール',
      hoursStats: '時間',
      missionsStats: 'ミッション',
      volunteersStats: 'ボランティア',
      projectsStats: 'プロジェクト',
      globalImpactTitle: 'グローバルインパクト',
      globalImpactSubtitle: '意味のある変化を創造',
      activeCommunitiesTitle: 'アクティブなコミュニティ',
      northAmerica: '北米',
      europe: 'ヨーロッパ',
      asiaPacific: 'アジア太平洋',
      latinAmerica: '中南米',
      africaMiddleEast: 'アフリカ・中東',
      africa: 'アフリカ',
      middleEast: '中東',
      sdgTitle: 'SDGsに貢献',
      sdgSubtitle: 'グローバルな取り組みと連携',
      noPoverty: '貧困をなくそう',
      zeroHunger: '飢餓をゼロに',
      goodHealth: '健康と福祉',
      qualityEducation: '質の高い教育',
      reducedInequalities: '不平等の是正',
      sustainableCities: '持続可能な都市',
      climateAction: '気候変動対策',
      partnerships: 'パートナーシップ',
      readyToImpact: '準備はできましたか？',
      readyToImpactSubtitle: '15万人以上のボランティアと500以上の組織に参加',
      startVolunteeringToday: '今日から始める',
      registerNGO: 'NGOを登録',
      freeToJoin: '無料',
      noCommitments: '義務なし',
      startImpactImmediately: '即時インパクト',
      footerTagline: 'ボランティアを支援',
      footerCopyright: 'KindWorld. All rights reserved.',
      ngoDashboardTitle: 'NGOダッシュボード',
      ngoDashboardSubtitle: '活動を作成し証明書を管理',
      ngoActiveVolunteers: 'アクティブなボランティア',
      ngoPublishedActivities: '公開された活動',
      ngoCertificatesIssued: '発行された証明書',
      ngoTotalImpactHours: 'インパクト時間',
      createNewActivity: '活動を作成',
      publishVolunteerOpportunities: 'ボランティアの機会を公開',
      createActivity: '活動を作成',
      manageCertificatesTitle: '証明書管理',
      createPublishCertificates: '証明書を作成・公開',
      allHoursVerified: 'すべての時間が確認されました！',
      pendingStatus: '保留中',
      viewAll: 'すべて見る',
      noActivitiesYet: 'まだ活動がありません',
      participantsLabel2: '参加者',
      durationLabel: '期間',
      upcomingStatus: '予定',
      completedStatus: '完了',
      editLabel: '編集',
      issueCertificates: '証明書を発行',
      yourCertificates: 'あなたの証明書',
      uploadCertificateBtn: 'アップロード',
      noCertificatesYet: '証明書なし',
      uploadFirstCertificate: '最初の証明書をアップロード',
      issuedLabel: '発行済み',
      publishLabel: '公開',
      previewLabel: 'プレビュー',
      createNewVolunteerActivity: '新しい活動を作成',
      activityTitle: 'タイトル',
      activityTitlePlaceholder: '例: ビーチクリーンアップ',
      descriptionLabel: '説明',
      descriptionPlaceholder: '活動を説明...',
      locationLabel: '場所',
      locationPlaceholder: '例: 中央公園',
      dateLabel: '日付',
      durationHours: '期間（時間）',
      maxParticipantsLabel: '最大参加者',
      categoryLabel: 'カテゴリ',
      difficultyLabel: '難易度',
      categoryEnvironment: '環境',
      categoryCommunity: 'コミュニティ',
      categoryHealthcare: '医療',
      categoryEducation: '教育',
      categoryAnimals: '動物',
      difficultyEasy: '簡単',
      difficultyMedium: '普通',
      difficultyHard: '難しい',
      publishActivity: '公開',
      organizationLabel: '組織',
      studentLabel: '学生',
      ngosLabel: 'NGO',
      participantListTitle: '参加者リスト',
      registeredParticipants: '登録済み参加者',
      noParticipantsYet: '参加者なし',
      closeLabel: '閉じる',
      contactLabel: '連絡先',
      emergencyLabel: '緊急',
      adminDashboardTitle: '管理者ダッシュボード',
      adminDashboardSubtitle: 'ユーザーとプログラムを管理',
      totalUsersLabel: '総ユーザー',
      volunteersLabel2: 'ボランティア',
      totalMissionsLabel: '総ミッション',
      viewManageMissions: 'ボランティアミッションを管理',
      missionsCount: 'ミッション',
      volunteersCount: 'ボランティア',
      addRemoveBadges: 'ボランティアのバッジを管理',
      badgesAvailable: '利用可能なバッジ',
      openBadgeManager: 'バッジマネージャーを開く',
      ngoApplications: 'NGO申請',
      ngoApplicationsDesc: '登録申請を審査',
      pendingApplications: '保留中の申請',
      approveNGO: '承認',
      rejectNGO: '却下',
      ngoListTitle: '登録済みNGO',
      ngoListDesc: '承認されたNGOを見る',
      registeredNGOs: '登録済みNGO',
      ngoName: '名前',
      ngoEmail: 'メール',
      ngoDescription: '説明',
      ngoWebsite: 'ウェブサイト',
      appliedOn: '申請日',
      approvedOn: '承認日',
      noApplications: '申請なし',
      adminLabel: '管理者',
      activeStatus: 'アクティブ',
      deleteLabel: '削除',
      manageLabel: '管理',
      confirmDelete: 'このミッションを削除しますか？',
      backLabel: '戻る',
      detailsLabel: '詳細',
      totalHoursLabel: '総時間',
      missionsCompletedLabel: 'ミッション',
      badgesLabel: 'バッジ',
      orgsHelpedLabel: '支援した組織',
      roleLabel: '役割',
      statusLabel: 'ステータス',
      joinDateLabel: '登録日',
      ratingLabel: '評価',
      reportLabel: 'レポート',
      volunteerActivityBreakdown: '活動の内訳',
      missionsCompleted: '完了したミッション',
      missionTimeline: 'タイムライン',
      myBadges: 'マイバッジ',
      volunteerRole: 'ボランティア',
      uploadCertDescription: 'ボランティア用の証明書をアップロード',
      certificateNameOptional: '名前（任意）',
      badgeManagementCenter: 'バッジ管理センター',
      badgeManagementDesc: '達成バッジを管理',
      selectUser: 'ユーザーを選択',
      selectUserDesc: 'ユーザーを選択',
      selectUserDescLong: 'バッジを管理するボランティアを選択',
      allBadgesTitle: 'すべてのバッジ',
      clickToUnlockRemove: 'クリックして解除/削除',
      clickToRemove: 'クリックして削除',
      clickToUnlock: 'クリックして解除',
      hoursUnit: '時間',
      editUserTitle: 'ユーザー編集',
      fullNameLabel: '氏名',
      emailLabel: 'メール',
      volunteerHoursLabel: 'ボランティア時間',
      userRoleLabel: '役割',
      studentVolunteerRole: '学生/ボランティア',
      platformAdmin: '管理者',
      saveLabel: '保存',
      cancelLabel: 'キャンセル',
      userUpdatedSuccess: 'ユーザー更新完了',
      profileUpdatedSuccess: 'プロフィール更新完了！',
      verifiedLabel: '確認済み',
      cancelEditLabel: 'キャンセル',
      totalHoursProfile: '総時間',
      activitiesCompleted: '活動',
      badgesEarned: 'バッジ',
      organizationsHelpedProfile: '支援した組織',
      cityPlaceholder: '都市, 国',
      backToDashboard: 'ダッシュボードに戻る',
      badgesDescription: 'あなたの実績と認定',
      earnedLabel: '獲得済み',
      totalAvailable: '合計利用可能',
      earnedBadgesTitle: '獲得したバッジ',
      earnedOn: '獲得日 ',
      noBadgesYet: 'まだバッジがありません',
      noBadgesDesc: 'ミッションを完了してバッジを獲得！',
      allAvailableBadges: '利用可能なバッジ',
      lockedLabel: 'ロック中',
      earnedBadgesLabel: '獲得したバッジ',
      manageBadgesBtn: 'バッジ管理',
      connectWithVolunteers: 'ボランティアとつながる',
      addFriend: '友達追加',
      searchFriendPlaceholder: '検索...',
      sendRequest: '送信',
      friendRequests: '友達リクエスト',
      accept: '承認',
      decline: '拒否',
      myFriends: 'マイフレンド',
      noFriendsYet: 'まだ友達がいません',
      startConnecting: '他のボランティアとつながろう！',
      pendingLabel: '保留中',
      removeFriend: '削除',
      pendingRequests: '保留中のリクエスト',
      requestSent: 'リクエスト送信済み',
      cancelRequest: 'キャンセル',
      userManagementTitle: 'ユーザー管理',
      userManagementDesc: '登録ユーザーを管理',
      tableHeaderUser: 'ユーザー',
      tableHeaderRole: '役割',
      tableHeaderHours: '時間',
      tableHeaderMissions: 'ミッション',
      tableHeaderBadges: 'バッジ',
      tableHeaderStatus: 'ステータス',
      tableHeaderActions: '操作',
      roleStudentLabel: '学生',
      roleNGOLabel: 'NGO',
      roleAdminLabel: '管理者',
      statusActive: 'アクティブ',
      statusVerified: '確認済み',
      publishActivityBtn: '公開',
      editMissionTitle: 'ミッション編集',
      titleLabelForm: 'タイトル',
      hoursLabelForm: '時間',
      maxParticipantsForm: '最大参加者',
      categoryFormLabel: 'カテゴリ',
      difficultyFormLabel: '難易度',
      saveChangesBtn: '保存',
      certificateManagerTitle: '証明書マネージャー',
      certificatesTitle: '証明書と賞',
      certificatesSubtitle: '公式証明書を申請',
      personalInformation: '個人情報',
      languageSettings: '言語',
      volunteerInterests: '興味',
      interestEnvironment: '環境',
      interestEducation: '教育',
      interestHealthcare: '医療',
      interestCommunity: 'コミュニティ',
      interestAnimals: '動物',
      interestElderlyCare: '高齢者ケア',
      interestYouthPrograms: '青少年プログラム',
      interestFoodSecurity: '食料安全保障',
      requiredHoursLabel: '必要時間',
      yourProgressLabel: '進捗',
      signInFooterTagline: 'コミュニティを支援',
      signInFooterCopyright: '© 2026 KindWorld.',
      noCertificatesUploadedYet: '証明書なし',
      noCertificatesAvailableYet: '利用可能な証明書なし',
      transportOwn: '自家用車',
      transportCarpool: '相乗り',
      transportPublic: '公共交通',
      selectRegion: '地域を選択',
      selectLanguage: '言語を選択',
      nearbyMissions: '現在地',
      findMissions: 'ミッションを探す',
      allRegions: 'すべての地域',
      allCountries: 'すべての国',
      regionSetup: 'プロフィール設定',
      regionSetupDesc: 'お近くの機会を見つけるお手伝い',
      yourRegion: 'あなたの地域',
      yourCountry: 'あなたの国',
      preferredLanguage: '希望言語',
      continueSetup: '続ける',
      skipForNow: 'スキップ'
    },
    th: {
      title: 'KindWorld',
      subtitle: 'เปลี่ยนความเมตตาเป็นผลกระทบ',
      getStarted: 'เริ่มต้น',
      signIn: 'เข้าสู่ระบบ',
      startVolunteering: 'เริ่มเป็นอาสาสมัคร',
      learnMore: 'เรียนรู้เพิ่มเติม',
      dashboard: 'แดชบอร์ด',
      missions: 'ภารกิจ',
      certificates: 'ใบรับรอง',
      badges: 'เหรียญตรา',
      friends: 'เพื่อน',
      profile: 'โปรไฟล์',
      volunteerHours: 'ชั่วโมงอาสาสมัคร',
      thisMonthHours: 'เดือนนี้',
      selectRole: 'เลือกบทบาทของคุณ:',
      student: 'นักศึกษา - ฉันต้องการเป็นอาสาสมัคร',
      ngo: 'องค์กร - เราสร้างภารกิจ',
      admin: 'ผู้ดูแล - ฉันจัดการแพลตฟอร์ม',
      welcomeBack: 'ยินดีต้อนรับกลับ',
      impactSummary: 'นี่คือสรุปผลกระทบของอาสาสมัคร',
      projectsCompleted: 'โครงการที่เสร็จสิ้น',
      organizationsHelped: 'องค์กรที่ช่วยเหลือ',
      averageRating: 'คะแนนเฉลี่ย',
      monthlyProgress: 'ความก้าวหน้า 6 เดือน',
      yearlyProgress: 'ความก้าวหน้ารายปี',
      allTimeProgress: 'ความก้าวหน้าทั้งหมด',
      clickForDetails: 'คลิกจุดใดก็ได้เพื่อดูรายละเอียด',
      clickPointsForDetails: 'คลิกเพื่อดูรายละเอียด',
      sixMonths: '6 เดือน',
      oneYear: '1 ปี',
      allTime: 'ทั้งหมด',
      logout: 'ออกจากระบบ',
      volunteerPlatform: 'แพลตฟอร์มอาสาสมัคร',
      heroTitle1: 'เสริมพลังชุมชน',
      heroSubtitle1: 'เปลี่ยนชีวิตผ่านการกระทำด้วยความเมตตา',
      heroTitle2: 'สร้างความแตกต่าง',
      heroSubtitle2: 'ทุกชั่วโมงของความเมตตาสร้างผลกระทบที่ยั่งยืน',
      heroTitle3: 'เข้าร่วมขบวนการ',
      heroSubtitle3: 'เป็นส่วนหนึ่งของเครือข่ายผู้สร้างการเปลี่ยนแปลงระดับโลก',
      welcomeBackTitle: 'ยินดีต้อนรับกลับ',
      createAccount: 'สร้างบัญชี',
      signInToContinue: 'เข้าสู่ระบบเพื่อดำเนินการต่อ',
      joinKindWorld: 'เข้าร่วม KindWorld และสร้างความแตกต่าง',
      emailOrUsername: 'อีเมลหรือชื่อผู้ใช้',
      password: 'รหัสผ่าน',
      forgotPassword: 'ลืมรหัสผ่าน?',
      pleaseFillAllFields: 'กรุณากรอกอีเมลและรหัสผ่านของคุณ',
      invalidCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      rememberMe: 'จดจำฉัน',
      noAccount: 'ยังไม่มีบัญชี?',
      registerNow: 'ลงทะเบียนเลย',
      firstName: 'ชื่อ',
      lastName: 'นามสกุล',
      emailAddress: 'ที่อยู่อีเมล',
      phoneNumber: 'หมายเลขโทรศัพท์',
      country: 'ประเทศ',
      cityResidency: 'เมือง / ที่อยู่',
      confirmPassword: 'ยืนยันรหัสผ่าน',
      minCharacters: 'อย่างน้อย 8 ตัวอักษร',
      agreeTerms: 'ฉันยอมรับ',
      termsOfService: 'ข้อกำหนดการใช้งาน',
      and: 'และ',
      privacyPolicy: 'นโยบายความเป็นส่วนตัว',
      orSignInWith: 'หรือเข้าสู่ระบบด้วย',
      orRegisterWith: 'หรือลงทะเบียนด้วย',
      alreadyHaveAccount: 'มีบัญชีแล้ว?',
      selectCountry: 'เลือกประเทศ',
      creatingAccount: 'กำลังสร้างบัญชี...',
      roleVolunteer: 'อาสาสมัคร',
      roleNGO: 'องค์กร',
      roleAdmin: 'ผู้ดูแล',
      ngoWelcome: 'แดชบอร์ดองค์กร',
      manageMissions: 'จัดการภารกิจ',
      createMission: 'สร้างภารกิจใหม่',
      pendingVerifications: 'การยืนยันชั่วโมงที่รอดำเนินการ',
      verifyHours: 'ยืนยันชั่วโมง',
      approveHours: 'อนุมัติ',
      rejectHours: 'ปฏิเสธ',
      hoursToVerify: 'ชั่วโมงที่ต้องยืนยัน',
      volunteerName: 'ชื่ออาสาสมัคร',
      missionName: 'ชื่อภารกิจ',
      hoursSubmitted: 'ชั่วโมงที่ส่ง',
      submittedDate: 'วันที่ส่ง',
      uploadCertificate: 'อัปโหลดใบรับรอง',
      certificateName: 'ชื่อใบรับรอง',
      uploadFile: 'อัปโหลดไฟล์',
      dragDropFile: 'ลากและวางหรือคลิกเพื่ออัปโหลด',
      supportedFormats: 'รูปแบบที่รองรับ: PDF, PNG, JPG',
      publishCertificate: 'เผยแพร่ใบรับรอง',
      saveDraft: 'บันทึกเป็นฉบับร่าง',
      editProfile: 'แก้ไขโปรไฟล์',
      saveChanges: 'บันทึกการเปลี่ยนแปลง',
      personalInfo: 'ข้อมูลส่วนตัว',
      contactInfo: 'ข้อมูลติดต่อ',
      volunteerStats: 'สถิติอาสาสมัคร',
      totalVolunteerHours: 'ชั่วโมงอาสาสมัครทั้งหมด',
      viewAnalytics: 'ดูการวิเคราะห์',
      totalMissions: 'ภารกิจทั้งหมด',
      activeVolunteers: 'อาสาสมัครที่ใช้งานอยู่',
      hoursCompleted: 'ชั่วโมงที่เสร็จสิ้น',
      platformManagement: 'การจัดการแพลตฟอร์ม',
      allMissions: 'ภารกิจทั้งหมด',
      allUsers: 'ผู้ใช้ทั้งหมด',
      removeMission: 'ลบภารกิจ',
      manageBadges: 'จัดการเหรียญตรา',
      addBadge: 'เพิ่มเหรียญตรา',
      removeBadge: 'ลบเหรียญตรา',
      userDetails: 'รายละเอียดผู้ใช้',
      editUser: 'แก้ไขผู้ใช้',
      hoursBreakdown: 'รายละเอียดชั่วโมง',
      environmentHours: 'สิ่งแวดล้อม',
      communityHours: 'ชุมชน',
      healthcareHours: 'สุขภาพ',
      educationHours: 'การศึกษา',
      discoverImpact: 'ค้นพบผลกระทบระดับโลกของเรา',
      discoverImpactSubtitle: 'เข้าร่วมชุมชนผู้สร้างการเปลี่ยนแปลงทั่วโลกที่กำลังเปลี่ยนชีวิตทีละชั่วโมง',
      ourGlobalImpact: 'ผลกระทบระดับโลกของเรา',
      realNumbers: 'ตัวเลขจริงจากอาสาสมัครจริงที่สร้างการเปลี่ยนแปลงจริง',
      activeInWorld: 'ใช้งานอยู่ในทุกมุมโลก',
      communitySpans: 'ชุมชนอาสาสมัครของเราครอบคลุมทุกทวีป',
      volunteerHoursLogged: 'ชั่วโมงอาสาสมัครที่บันทึก',
      treesPlanted: 'ต้นไม้ที่ปลูก',
      mealsServed: 'มื้ออาหารที่เสิร์ฟ',
      countriesReached: 'ประเทศที่เข้าถึง',
      partnerNGOs: 'องค์กรพันธมิตร',
      backToHome: 'กลับหน้าหลัก',
      joinNow: 'เข้าร่วมเลย',
      volunteers: 'อาสาสมัคร',
      countries: 'ประเทศ',
      voicesFromCommunity: 'เสียงจากชุมชนของเรา',
      realStoriesVolunteers: 'เรื่องราวจริงจากอาสาสมัครทั่วโลก',
      hours: 'ชั่วโมง',
      missionsLabel: 'ภารกิจ',
      trustedByOrganizations: 'ได้รับความไว้วางใจจากองค์กรชั้นนำ',
      ngosUseKindWorld: 'องค์กรทั่วโลกใช้ KindWorld เพื่อขยายผลกระทบ',
      volunteersLabel: 'อาสาสมัคร',
      missionsPosted: 'ภารกิจที่โพสต์',
      alignedWithSDG: 'สอดคล้องกับเป้าหมายการพัฒนาที่ยั่งยืนของสหประชาชาติ',
      sdgDescription: 'ภารกิจของเรามีส่วนช่วยเป้าหมายการพัฒนาระดับโลก สร้างผลกระทบที่วัดได้ต่อความท้าทายที่ยิ่งใหญ่ที่สุดของมนุษยชาติ',
      readyToMakeMark: 'พร้อมที่จะสร้างรอยประทับของคุณแล้วหรือยัง?',
      joinThousands: 'เข้าร่วมกับอาสาสมัครและองค์กรหลายพันคนที่กำลังสร้างการเปลี่ยนแปลงเชิงบวก การเดินทางของคุณเริ่มต้นด้วยก้าวเดียว',
      startVolunteeringBtn: 'เริ่มเป็นอาสาสมัคร',
      registerYourNGO: 'ลงทะเบียนองค์กรของคุณ',
      trustedBy: 'ได้รับความไว้วางใจจาก',
      partneredWith: 'ร่วมมือกับ',
      activeIn: 'ใช้งานอยู่ใน',
      volunteersIn: 'อาสาสมัครใน',
      hoursLoggedDesc: 'ชั่วโมงที่อุทิศให้กับการทำให้ชุมชนดีขึ้น',
      treesPlantedDesc: 'มีส่วนช่วยสร้างโลกที่เขียวขึ้น',
      mealsServedDesc: 'ต่อสู้กับความหิวทีละมื้อ',
      countriesDesc: 'ขบวนการความเมตตาระดับโลกอย่างแท้จริง',
      activeVolunteersDesc: 'ชุมชนผู้สร้างการเปลี่ยนแปลงที่เติบโต',
      partnerNGOsDesc: 'องค์กรที่สร้างผลกระทบ',
      availableMissionsTitle: 'ภารกิจที่มีอยู่',
      availableMissionsSubtitle: 'เข้าร่วมภารกิจอาสาสมัครและสร้างผลกระทบเชิงบวกในชุมชนของคุณ',
      hoursLabel: 'ชั่วโมง',
      participantsLabel: 'ผู้เข้าร่วม',
      joinMission: 'เข้าร่วมภารกิจ',
      leaveMission: 'ออกจากภารกิจ',
      joinMissionTitle: 'เข้าร่วมภารกิจ',
      viewDetails: 'ดูรายละเอียด',
      manageMission: 'จัดการ',
      ngoMissionsTitle: 'ภารกิจที่เผยแพร่',
      ngoMissionsSubtitle: 'จัดการกิจกรรมอาสาสมัครและติดตามการเข้าร่วม',
      adminMissionsTitle: 'ภารกิจทั้งหมด',
      adminMissionsSubtitle: 'ตรวจสอบและจัดการกิจกรรมทั้งหมดบนแพลตฟอร์ม',
      registrationForm: 'แบบฟอร์มลงทะเบียน',
      fullName: 'ชื่อเต็ม',
      emergencyContact: 'ผู้ติดต่อฉุกเฉิน',
      emergencyPhone: 'โทรศัพท์ฉุกเฉิน',
      allergies: 'อาการแพ้ (ถ้ามี)',
      medicalConditions: 'สภาวะทางการแพทย์',
      dietaryRestrictions: 'ข้อจำกัดด้านอาหาร',
      tshirtSize: 'ขนาดเสื้อยืด',
      transportation: 'การเดินทาง',
      ownTransport: 'มีรถส่วนตัว',
      needRide: 'ต้องการรถรับส่ง',
      publicTransport: 'ขนส่งสาธารณะ',
      specialSkills: 'ทักษะพิเศษ',
      agreeToTerms: 'ฉันยอมรับข้อกำหนดและเงื่อนไข',
      cancel: 'ยกเลิก',
      confirmRegistration: 'ยืนยันการลงทะเบียน',
      activeVolunteersLabel: 'อาสาสมัครที่ใช้งานอยู่',
      partnerNGOsLabel: 'องค์กรพันธมิตร',
      hoursLoggedLabel: 'ชั่วโมงที่บันทึก',
      citiesWorldwide: 'เมืองทั่วโลก',
      howItWorks: 'วิธีการทำงาน',
      journeyToImpact: 'เส้นทางสู่ผลกระทบของคุณ',
      journeySubtitle: 'แพลตฟอร์มที่ออกแบบมาเพื่อขยายการมีส่วนร่วมของคุณต่อชุมชน',
      discoverMissions: 'ค้นพบภารกิจ',
      discoverMissionsDesc: 'ค้นหาโอกาสอาสาสมัครที่มีความหมายซึ่งตรงกับความหลงใหลของคุณ',
      trackProgress: 'ติดตามความก้าวหน้า',
      trackProgressDesc: 'ตรวจสอบชั่วโมงอาสาสมัครและดูผลกระทบของคุณเติบโต',
      earnRecognition: 'รับการยอมรับ',
      earnRecognitionDesc: 'รับเหรียญตราและใบรับรองสำหรับการมีส่วนร่วมของคุณ',
      buildNetwork: 'สร้างเครือข่าย',
      buildNetworkDesc: 'เชื่อมต่อกับอาสาสมัครและองค์กรที่มีความคิดเดียวกัน',
      testimonialsLabel: 'คำรับรอง',
      successStoriesTitle: 'เรื่องราวแห่งผลกระทบ',
      successStoriesSubtitle: 'เรื่องราวจริงจากอาสาสมัครและองค์กรที่สร้างความแตกต่างทั่วโลก',
      scrollLabel: 'เลื่อน',
      hoursStats: 'ชั่วโมง',
      missionsStats: 'ภารกิจ',
      volunteersStats: 'อาสาสมัคร',
      projectsStats: 'โครงการ',
      globalImpactTitle: 'ผลกระทบระดับโลกของเรา',
      globalImpactSubtitle: 'ร่วมกัน เรากำลังสร้างการเปลี่ยนแปลงที่มีความหมายทั่วโลก',
      activeCommunitiesTitle: 'ชุมชนที่ใช้งานอยู่ทั่วโลก',
      northAmerica: 'อเมริกาเหนือ',
      europe: 'ยุโรป',
      asiaPacific: 'เอเชียแปซิฟิก',
      latinAmerica: 'ละตินอเมริกา',
      africaMiddleEast: 'แอฟริกาและตะวันออกกลาง',
      africa: 'แอฟริกา',
      middleEast: 'ตะวันออกกลาง',
      sdgTitle: 'มีส่วนร่วมในเป้าหมายการพัฒนาที่ยั่งยืนของสหประชาชาติ',
      sdgSubtitle: 'ภารกิจของเราสอดคล้องกับความพยายามระดับโลกในการสร้างโลกที่ดีขึ้น',
      noPoverty: 'ไม่มีความยากจน',
      zeroHunger: 'ไม่มีความหิว',
      goodHealth: 'สุขภาพดี',
      qualityEducation: 'การศึกษาที่มีคุณภาพ',
      reducedInequalities: 'ลดความไม่เท่าเทียม',
      sustainableCities: 'เมืองที่ยั่งยืน',
      climateAction: 'การดำเนินการด้านสภาพภูมิอากาศ',
      partnerships: 'หุ้นส่วน',
      readyToImpact: 'พร้อมที่จะสร้างผลกระทบแล้วหรือยัง?',
      readyToImpactSubtitle: 'เข้าร่วมกับอาสาสมัครกว่า 150,000 คนและองค์กรกว่า 500 แห่งที่สร้างการเปลี่ยนแปลงเชิงบวกในชุมชนทั่วโลก การเดินทางของคุณเริ่มต้นวันนี้',
      startVolunteeringToday: 'เริ่มเป็นอาสาสมัครวันนี้',
      registerNGO: 'ลงทะเบียนองค์กรของคุณ',
      freeToJoin: 'เข้าร่วมฟรี',
      noCommitments: 'ไม่มีข้อผูกมัด',
      startImpactImmediately: 'เริ่มสร้างผลกระทบทันที',
      footerTagline: 'เสริมพลังอาสาสมัครทั่วโลก',
      footerCopyright: 'KindWorld. สงวนลิขสิทธิ์',
      ngoDashboardTitle: 'แดชบอร์ดองค์กร',
      ngoDashboardSubtitle: 'สร้างกิจกรรมอาสาสมัคร จัดการใบรับรอง และติดตามผลกระทบต่อชุมชน',
      ngoActiveVolunteers: 'อาสาสมัครที่ใช้งานอยู่',
      ngoPublishedActivities: 'กิจกรรมที่เผยแพร่',
      ngoCertificatesIssued: 'ใบรับรองที่ออก',
      ngoTotalImpactHours: 'ชั่วโมงผลกระทบทั้งหมด',
      createNewActivity: 'สร้างกิจกรรมใหม่',
      publishVolunteerOpportunities: 'เผยแพร่โอกาสอาสาสมัครสำหรับชุมชน',
      createActivity: 'สร้างกิจกรรม',
      manageCertificatesTitle: 'จัดการใบรับรอง',
      createPublishCertificates: 'สร้างและเผยแพร่ใบรับรองสำหรับอาสาสมัคร',
      allHoursVerified: 'ชั่วโมงอาสาสมัครทั้งหมดได้รับการยืนยันแล้ว!',
      pendingStatus: 'รอดำเนินการ',
      viewAll: 'ดูทั้งหมด',
      noActivitiesYet: 'ยังไม่มีกิจกรรมที่เผยแพร่ สร้างกิจกรรมแรกของคุณ!',
      participantsLabel2: 'ผู้เข้าร่วม',
      durationLabel: 'ระยะเวลา',
      upcomingStatus: 'กำลังจะมาถึง',
      completedStatus: 'เสร็จสิ้น',
      editLabel: 'แก้ไข',
      issueCertificates: 'ออกใบรับรอง',
      yourCertificates: 'ใบรับรองของคุณ',
      uploadCertificateBtn: 'อัปโหลดใบรับรอง',
      noCertificatesYet: 'ยังไม่มีใบรับรองที่อัปโหลด',
      uploadFirstCertificate: 'อัปโหลดใบรับรองแรกของคุณ',
      issuedLabel: 'ออกแล้ว',
      publishLabel: 'เผยแพร่',
      previewLabel: 'ดูตัวอย่าง',
      createNewVolunteerActivity: 'สร้างกิจกรรมอาสาสมัครใหม่',
      activityTitle: 'ชื่อกิจกรรม',
      activityTitlePlaceholder: 'เช่น การทำความสะอาดชายหาด',
      descriptionLabel: 'คำอธิบาย',
      descriptionPlaceholder: 'อธิบายกิจกรรมอาสาสมัครและผลกระทบ...',
      locationLabel: 'สถานที่',
      locationPlaceholder: 'เช่น สวนลุมพินี กรุงเทพฯ',
      dateLabel: 'วันที่',
      durationHours: 'ระยะเวลา (ชั่วโมง)',
      maxParticipantsLabel: 'ผู้เข้าร่วมสูงสุด',
      categoryLabel: 'หมวดหมู่',
      difficultyLabel: 'ความยาก',
      categoryEnvironment: 'สิ่งแวดล้อม',
      categoryCommunity: 'ชุมชน',
      categoryHealthcare: 'สุขภาพ',
      categoryEducation: 'การศึกษา',
      categoryAnimals: 'สัตว์',
      difficultyEasy: 'ง่าย',
      difficultyMedium: 'ปานกลาง',
      difficultyHard: 'ยาก',
      publishActivity: 'เผยแพร่กิจกรรม',
      organizationLabel: 'องค์กร',
      studentLabel: 'นักศึกษา',
      ngosLabel: 'องค์กร',
      participantListTitle: 'รายชื่อผู้เข้าร่วม',
      registeredParticipants: 'ผู้เข้าร่วมที่ลงทะเบียน',
      noParticipantsYet: 'ยังไม่มีผู้เข้าร่วมลงทะเบียน',
      closeLabel: 'ปิด',
      contactLabel: 'ติดต่อ',
      emergencyLabel: 'ฉุกเฉิน',
      adminDashboardTitle: 'แดชบอร์ดผู้ดูแล',
      adminDashboardSubtitle: 'จัดการผู้ใช้ ตรวจสอบกิจกรรมแพลตฟอร์ม และดูแลโปรแกรมอาสาสมัคร',
      totalUsersLabel: 'ผู้ใช้ทั้งหมด',
      volunteersLabel2: 'อาสาสมัคร',
      totalMissionsLabel: 'ภารกิจทั้งหมด',
      viewManageMissions: 'ดูและจัดการภารกิจอาสาสมัครทั้งหมดบนแพลตฟอร์ม',
      missionsCount: 'ภารกิจ',
      volunteersCount: 'อาสาสมัคร',
      addRemoveBadges: 'เพิ่มหรือลบเหรียญตราสำหรับอาสาสมัคร',
      badgesAvailable: 'เหรียญตราที่มี',
      openBadgeManager: 'เปิดตัวจัดการเหรียญตรา',
      ngoApplications: 'การสมัครองค์กร',
      ngoApplicationsDesc: 'ตรวจสอบและอนุมัติคำขอลงทะเบียนองค์กร',
      pendingApplications: 'การสมัครที่รอดำเนินการ',
      approveNGO: 'อนุมัติ',
      rejectNGO: 'ปฏิเสธ',
      ngoListTitle: 'องค์กรที่ลงทะเบียน',
      ngoListDesc: 'ดูองค์กรที่ได้รับการอนุมัติทั้งหมดบนแพลตฟอร์ม',
      registeredNGOs: 'องค์กรที่ลงทะเบียน',
      ngoName: 'ชื่อองค์กร',
      ngoEmail: 'อีเมล',
      ngoDescription: 'คำอธิบาย',
      ngoWebsite: 'เว็บไซต์',
      appliedOn: 'สมัครเมื่อ',
      approvedOn: 'อนุมัติเมื่อ',
      noApplications: 'ไม่มีการสมัครที่รอดำเนินการ',
      adminLabel: 'ผู้ดูแล',
      activeStatus: 'ใช้งานอยู่',
      deleteLabel: 'ลบ',
      manageLabel: 'จัดการ',
      confirmDelete: 'คุณแน่ใจหรือไม่ว่าต้องการลบภารกิจนี้?',
      backLabel: 'กลับ',
      detailsLabel: 'รายละเอียด',
      totalHoursLabel: 'ชั่วโมงทั้งหมด',
      missionsCompletedLabel: 'ภารกิจ',
      badgesLabel: 'เหรียญตรา',
      orgsHelpedLabel: 'องค์กรที่ช่วยเหลือ',
      roleLabel: 'บทบาท',
      statusLabel: 'สถานะ',
      joinDateLabel: 'วันที่เข้าร่วม',
      ratingLabel: 'คะแนน',
      reportLabel: 'รายงาน',
      volunteerActivityBreakdown: 'รายละเอียดกิจกรรมอาสาสมัครของคุณ',
      missionsCompleted: 'ภารกิจที่เสร็จสิ้น',
      missionTimeline: 'ไทม์ไลน์ภารกิจ',
      myBadges: 'เหรียญตราของฉัน',
      volunteerRole: 'อาสาสมัคร',
      uploadCertDescription: 'อัปโหลดใบรับรองที่คุณออกแบบสำหรับอาสาสมัครหลังจากเสร็จสิ้นภารกิจ',
      certificateNameOptional: 'ชื่อใบรับรอง (ไม่บังคับ)',
      badgeManagementCenter: 'ศูนย์จัดการเหรียญตรา',
      badgeManagementDesc: 'ปลดล็อคและจัดการเหรียญตราความสำเร็จสำหรับอาสาสมัคร',
      selectUser: 'เลือกผู้ใช้',
      selectUserDesc: 'เลือกผู้ใช้',
      selectUserDescLong: 'เลือกอาสาสมัครจากรายการทางซ้ายเพื่อจัดการเหรียญตราของพวกเขา',
      allBadgesTitle: 'เหรียญตราทั้งหมด',
      clickToUnlockRemove: 'คลิกเพื่อปลดล็อคหรือลบ',
      clickToRemove: 'คลิกเพื่อลบ',
      clickToUnlock: 'คลิกเพื่อปลดล็อค',
      hoursUnit: 'ชั่วโมง',
      editUserTitle: 'แก้ไขผู้ใช้',
      fullNameLabel: 'ชื่อเต็ม',
      emailLabel: 'ที่อยู่อีเมล',
      volunteerHoursLabel: 'ชั่วโมงอาสาสมัคร',
      userRoleLabel: 'บทบาทผู้ใช้',
      studentVolunteerRole: 'นักศึกษา/อาสาสมัคร',
      platformAdmin: 'ผู้ดูแลแพลตฟอร์ม',
      saveLabel: 'บันทึก',
      cancelLabel: 'ยกเลิก',
      userUpdatedSuccess: 'อัปเดตผู้ใช้สำเร็จ',
      profileUpdatedSuccess: 'อัปเดตโปรไฟล์สำเร็จ!',
      verifiedLabel: 'ยืนยันแล้ว',
      cancelEditLabel: 'ยกเลิกการแก้ไข',
      totalHoursProfile: 'ชั่วโมงทั้งหมด',
      activitiesCompleted: 'กิจกรรมที่เสร็จสิ้น',
      badgesEarned: 'เหรียญตราที่ได้รับ',
      organizationsHelpedProfile: 'องค์กรที่ช่วยเหลือ',
      cityPlaceholder: 'กรุงเทพฯ, ประเทศไทย',
      backToDashboard: 'กลับไปแดชบอร์ด',
      badgesDescription: 'ความสำเร็จและการยอมรับของคุณ',
      earnedLabel: 'ได้รับแล้ว',
      totalAvailable: 'ทั้งหมดที่มี',
      earnedBadgesTitle: 'เหรียญตราที่ได้รับ',
      earnedOn: 'ได้รับเมื่อ ',
      noBadgesYet: 'คุณยังไม่ได้รับเหรียญตราใดๆ',
      noBadgesDesc: 'เสร็จสิ้นภารกิจและสะสมชั่วโมงอาสาสมัครเพื่อปลดล็อคเหรียญตรา!',
      allAvailableBadges: 'เหรียญตราที่มีทั้งหมด',
      lockedLabel: 'ล็อคอยู่',
      earnedBadgesLabel: 'เหรียญตราที่ได้รับ',
      manageBadgesBtn: 'จัดการเหรียญตรา',
      connectWithVolunteers: 'เชื่อมต่อกับอาสาสมัครคนอื่น',
      addFriend: 'เพิ่มเพื่อน',
      searchFriendPlaceholder: 'ค้นหาด้วยชื่อหรืออีเมล...',
      sendRequest: 'ส่งคำขอ',
      friendRequests: 'คำขอเป็นเพื่อน',
      accept: 'ยอมรับ',
      decline: 'ปฏิเสธ',
      myFriends: 'เพื่อนของฉัน',
      noFriendsYet: 'ยังไม่มีเพื่อน',
      startConnecting: 'เริ่มเชื่อมต่อกับอาสาสมัครคนอื่น!',
      pendingLabel: 'รอดำเนินการ',
      removeFriend: 'ลบ',
      pendingRequests: 'คำขอที่รอดำเนินการ',
      requestSent: 'ส่งคำขอแล้ว',
      cancelRequest: 'ยกเลิก',
      userManagementTitle: 'การจัดการผู้ใช้',
      userManagementDesc: 'ดูและจัดการผู้ใช้ที่ลงทะเบียนทั้งหมดบนแพลตฟอร์ม',
      tableHeaderUser: 'ผู้ใช้',
      tableHeaderRole: 'บทบาท',
      tableHeaderHours: 'ชั่วโมง',
      tableHeaderMissions: 'ภารกิจ',
      tableHeaderBadges: 'เหรียญตรา',
      tableHeaderStatus: 'สถานะ',
      tableHeaderActions: 'การดำเนินการ',
      roleStudentLabel: 'นักศึกษา',
      roleNGOLabel: 'องค์กร',
      roleAdminLabel: 'ผู้ดูแล',
      statusActive: 'ใช้งานอยู่',
      statusVerified: 'ยืนยันแล้ว',
      publishActivityBtn: 'เผยแพร่กิจกรรม',
      editMissionTitle: 'แก้ไขภารกิจ',
      titleLabelForm: 'ชื่อ',
      hoursLabelForm: 'ชั่วโมง',
      maxParticipantsForm: 'ผู้เข้าร่วมสูงสุด',
      categoryFormLabel: 'หมวดหมู่',
      difficultyFormLabel: 'ความยาก',
      saveChangesBtn: 'บันทึกการเปลี่ยนแปลง',
      certificateManagerTitle: 'ตัวจัดการใบรับรอง',
      certificatesTitle: 'ใบรับรองและรางวัล',
      certificatesSubtitle: 'สมัครใบรับรองและเหรียญอย่างเป็นทางการจากองค์กรพันธมิตร',
      personalInformation: 'ข้อมูลส่วนตัว',
      languageSettings: 'ภาษา',
      volunteerInterests: 'ความสนใจด้านอาสาสมัคร',
      interestEnvironment: 'สิ่งแวดล้อม',
      interestEducation: 'การศึกษา',
      interestHealthcare: 'สุขภาพ',
      interestCommunity: 'ชุมชน',
      interestAnimals: 'สัตว์',
      interestElderlyCare: 'ดูแลผู้สูงอายุ',
      interestYouthPrograms: 'โปรแกรมเยาวชน',
      interestFoodSecurity: 'ความมั่นคงทางอาหาร',
      requiredHoursLabel: 'ชั่วโมงที่ต้องการ',
      yourProgressLabel: 'ความก้าวหน้าของคุณ',
      signInFooterTagline: 'เสริมพลังชุมชนผ่านการกระทำด้วยความเมตตา',
      signInFooterCopyright: '© 2026 KindWorld. สงวนลิขสิทธิ์',
      noCertificatesUploadedYet: 'ยังไม่มีใบรับรองที่อัปโหลด อัปโหลดใบรับรองแรกของคุณด้านบน!',
      noCertificatesAvailableYet: 'ยังไม่มีใบรับรอง กรุณาตรวจสอบภายหลัง!',
      transportOwn: 'มีรถส่วนตัว',
      transportCarpool: 'ต้องการรถรับส่ง',
      transportPublic: 'ขนส่งสาธารณะ',
      selectRegion: 'เลือกภูมิภาค',
      selectLanguage: 'เลือกภาษา',
      nearbyMissions: 'ตำแหน่งของฉัน',
      findMissions: 'ค้นหาภารกิจ',
      allRegions: 'ทุกภูมิภาค',
      allCountries: 'ทุกประเทศ',
      regionSetup: 'ตั้งค่าโปรไฟล์ของคุณ',
      regionSetupDesc: 'ช่วยเราค้นหาโอกาสอาสาสมัครใกล้คุณ',
      yourRegion: 'ภูมิภาคของคุณ',
      yourCountry: 'ประเทศของคุณ',
      preferredLanguage: 'ภาษาที่ต้องการ',
      continueSetup: 'ดำเนินการต่อ',
      skipForNow: 'ข้ามไปก่อน'
    },
    vi: {
      title: 'KindWorld',
      subtitle: 'Biến lòng tốt thành tác động',
      getStarted: 'Bắt đầu',
      signIn: 'Đăng nhập',
      startVolunteering: 'Bắt đầu tình nguyện',
      learnMore: 'Tìm hiểu thêm',
      dashboard: 'Bảng điều khiển',
      missions: 'Nhiệm vụ',
      certificates: 'Chứng chỉ',
      badges: 'Huy hiệu',
      friends: 'Bạn bè',
      profile: 'Hồ sơ',
      volunteerHours: 'Giờ tình nguyện',
      thisMonthHours: 'Tháng này',
      selectRole: 'Chọn vai trò của bạn:',
      student: 'Sinh viên - Tôi muốn tình nguyện',
      ngo: 'Tổ chức - Chúng tôi tạo nhiệm vụ',
      admin: 'Quản trị - Tôi quản lý nền tảng',
      welcomeBack: 'Chào mừng trở lại',
      impactSummary: 'Đây là tóm tắt tác động tình nguyện của bạn',
      projectsCompleted: 'Dự án đã hoàn thành',
      organizationsHelped: 'Tổ chức đã hỗ trợ',
      averageRating: 'Đánh giá trung bình',
      monthlyProgress: 'Tiến độ 6 tháng',
      yearlyProgress: 'Tiến độ hàng năm',
      allTimeProgress: 'Tiến độ toàn thời gian',
      clickForDetails: 'Nhấp vào bất kỳ điểm nào để xem chi tiết',
      clickPointsForDetails: 'Nhấp để xem chi tiết',
      sixMonths: '6 Tháng',
      oneYear: '1 Năm',
      allTime: 'Tất cả',
      logout: 'Đăng xuất',
      volunteerPlatform: 'NỀN TẢNG TÌNH NGUYỆN',
      heroTitle1: 'Trao quyền cho cộng đồng',
      heroSubtitle1: 'Thay đổi cuộc sống thông qua hành động nhân ái',
      heroTitle2: 'Tạo ra sự khác biệt',
      heroSubtitle2: 'Mỗi giờ thiện nguyện tạo ra tác động lâu dài',
      heroTitle3: 'Tham gia phong trào',
      heroSubtitle3: 'Trở thành một phần của mạng lưới người thay đổi toàn cầu',
      welcomeBackTitle: 'Chào mừng trở lại',
      createAccount: 'Tạo tài khoản',
      signInToContinue: 'Đăng nhập để tiếp tục hành trình của bạn',
      joinKindWorld: 'Tham gia KindWorld và tạo ra sự khác biệt',
      emailOrUsername: 'Email hoặc tên người dùng',
      password: 'Mật khẩu',
      forgotPassword: 'Quên mật khẩu?',
      pleaseFillAllFields: 'Vui lòng nhập email và mật khẩu của bạn',
      invalidCredentials: 'Email hoặc mật khẩu không hợp lệ',
      rememberMe: 'Ghi nhớ tôi',
      noAccount: 'Chưa có tài khoản?',
      registerNow: 'Đăng ký ngay',
      firstName: 'Tên',
      lastName: 'Họ',
      emailAddress: 'Địa chỉ email',
      phoneNumber: 'Số điện thoại',
      country: 'Quốc gia',
      cityResidency: 'Thành phố / Nơi cư trú',
      confirmPassword: 'Xác nhận mật khẩu',
      minCharacters: 'Tối thiểu 8 ký tự',
      agreeTerms: 'Tôi đồng ý với',
      termsOfService: 'Điều khoản dịch vụ',
      and: 'và',
      privacyPolicy: 'Chính sách bảo mật',
      orSignInWith: 'hoặc đăng nhập bằng',
      orRegisterWith: 'hoặc đăng ký bằng',
      alreadyHaveAccount: 'Đã có tài khoản?',
      selectCountry: 'Chọn quốc gia',
      creatingAccount: 'Đang tạo tài khoản...',
      roleVolunteer: 'Tình nguyện viên',
      roleNGO: 'Tổ chức',
      roleAdmin: 'Quản trị',
      ngoWelcome: 'Bảng điều khiển tổ chức',
      manageMissions: 'Quản lý nhiệm vụ',
      createMission: 'Tạo nhiệm vụ mới',
      pendingVerifications: 'Xác minh giờ đang chờ',
      verifyHours: 'Xác minh giờ',
      approveHours: 'Phê duyệt',
      rejectHours: 'Từ chối',
      hoursToVerify: 'giờ cần xác minh',
      volunteerName: 'Tên tình nguyện viên',
      missionName: 'Tên nhiệm vụ',
      hoursSubmitted: 'Giờ đã gửi',
      submittedDate: 'Ngày gửi',
      uploadCertificate: 'Tải lên chứng chỉ',
      certificateName: 'Tên chứng chỉ',
      uploadFile: 'Tải lên tệp',
      dragDropFile: 'Kéo và thả hoặc nhấp để tải lên',
      supportedFormats: 'Định dạng hỗ trợ: PDF, PNG, JPG',
      publishCertificate: 'Xuất bản chứng chỉ',
      saveDraft: 'Lưu bản nháp',
      editProfile: 'Chỉnh sửa hồ sơ',
      saveChanges: 'Lưu thay đổi',
      personalInfo: 'Thông tin cá nhân',
      contactInfo: 'Thông tin liên hệ',
      volunteerStats: 'Thống kê tình nguyện',
      totalVolunteerHours: 'Tổng giờ tình nguyện',
      viewAnalytics: 'Xem phân tích',
      totalMissions: 'Tổng nhiệm vụ',
      activeVolunteers: 'Tình nguyện viên hoạt động',
      hoursCompleted: 'Giờ đã hoàn thành',
      platformManagement: 'Quản lý nền tảng',
      allMissions: 'Tất cả nhiệm vụ',
      allUsers: 'Tất cả người dùng',
      removeMission: 'Xóa nhiệm vụ',
      manageBadges: 'Quản lý huy hiệu',
      addBadge: 'Thêm huy hiệu',
      removeBadge: 'Xóa huy hiệu',
      userDetails: 'Chi tiết người dùng',
      editUser: 'Chỉnh sửa người dùng',
      hoursBreakdown: 'Chi tiết giờ',
      environmentHours: 'Môi trường',
      communityHours: 'Cộng đồng',
      healthcareHours: 'Y tế',
      educationHours: 'Giáo dục',
      discoverImpact: 'Khám phá tác động toàn cầu của chúng tôi',
      discoverImpactSubtitle: 'Tham gia cộng đồng những người thay đổi thế giới đang biến đổi cuộc sống từng giờ.',
      ourGlobalImpact: 'Tác động toàn cầu của chúng tôi',
      realNumbers: 'Số liệu thực từ tình nguyện viên thực tạo ra thay đổi thực',
      activeInWorld: 'Hoạt động ở mọi nơi trên thế giới',
      communitySpans: 'Cộng đồng tình nguyện viên của chúng tôi trải rộng trên các châu lục',
      volunteerHoursLogged: 'Giờ tình nguyện đã ghi',
      treesPlanted: 'Cây đã trồng',
      mealsServed: 'Bữa ăn đã phục vụ',
      countriesReached: 'Quốc gia đã tiếp cận',
      partnerNGOs: 'Tổ chức đối tác',
      backToHome: 'Quay lại trang chủ',
      joinNow: 'Tham gia ngay',
      volunteers: 'Tình nguyện viên',
      countries: 'Quốc gia',
      voicesFromCommunity: 'Tiếng nói từ cộng đồng',
      realStoriesVolunteers: 'Câu chuyện thực từ tình nguyện viên trên toàn thế giới',
      hours: 'Giờ',
      missionsLabel: 'Nhiệm vụ',
      trustedByOrganizations: 'Được tin tưởng bởi các tổ chức hàng đầu',
      ngosUseKindWorld: 'Các tổ chức trên toàn thế giới sử dụng KindWorld để mở rộng tác động',
      volunteersLabel: 'Tình nguyện viên',
      missionsPosted: 'Nhiệm vụ đã đăng',
      alignedWithSDG: 'Phù hợp với Mục tiêu Phát triển Bền vững của Liên Hợp Quốc',
      sdgDescription: 'Các nhiệm vụ của chúng tôi đóng góp vào mục tiêu phát triển toàn cầu, tạo tác động có thể đo lường được đối với những thách thức lớn nhất của nhân loại',
      readyToMakeMark: 'Sẵn sàng để lại dấu ấn của bạn?',
      joinThousands: 'Tham gia cùng hàng ngàn tình nguyện viên và tổ chức đang tạo ra thay đổi tích cực. Hành trình tạo ra sự khác biệt của bạn bắt đầu từ một bước.',
      startVolunteeringBtn: 'Bắt đầu tình nguyện',
      registerYourNGO: 'Đăng ký tổ chức của bạn',
      trustedBy: 'Được tin tưởng bởi',
      partneredWith: 'Hợp tác với',
      activeIn: 'Hoạt động tại',
      volunteersIn: 'tình nguyện viên tại',
      hoursLoggedDesc: 'Giờ dành cho việc làm cho cộng đồng tốt đẹp hơn',
      treesPlantedDesc: 'Đóng góp cho một hành tinh xanh hơn',
      mealsServedDesc: 'Chống đói từng bữa ăn một',
      countriesDesc: 'Một phong trào nhân ái toàn cầu thực sự',
      activeVolunteersDesc: 'Cộng đồng những người thay đổi đang phát triển',
      partnerNGOsDesc: 'Các tổ chức tạo ra tác động',
      availableMissionsTitle: 'Nhiệm vụ có sẵn',
      availableMissionsSubtitle: 'Tham gia các nhiệm vụ tình nguyện và tạo tác động tích cực trong cộng đồng của bạn',
      hoursLabel: 'giờ',
      participantsLabel: 'người tham gia',
      joinMission: 'Tham gia nhiệm vụ',
      leaveMission: 'Rời nhiệm vụ',
      joinMissionTitle: 'Tham gia nhiệm vụ',
      viewDetails: 'Xem chi tiết',
      manageMission: 'Quản lý',
      ngoMissionsTitle: 'Nhiệm vụ đã đăng',
      ngoMissionsSubtitle: 'Quản lý hoạt động tình nguyện và theo dõi sự tham gia',
      adminMissionsTitle: 'Tất cả nhiệm vụ',
      adminMissionsSubtitle: 'Giám sát và quản lý tất cả hoạt động trên nền tảng',
      registrationForm: 'Mẫu đăng ký',
      fullName: 'Họ và tên',
      emergencyContact: 'Liên hệ khẩn cấp',
      emergencyPhone: 'Điện thoại khẩn cấp',
      allergies: 'Dị ứng (nếu có)',
      medicalConditions: 'Tình trạng sức khỏe',
      dietaryRestrictions: 'Hạn chế ăn uống',
      tshirtSize: 'Kích cỡ áo',
      transportation: 'Phương tiện di chuyển',
      ownTransport: 'Có phương tiện riêng',
      needRide: 'Cần đưa đón',
      publicTransport: 'Phương tiện công cộng',
      specialSkills: 'Kỹ năng đặc biệt',
      agreeToTerms: 'Tôi đồng ý với các điều khoản và điều kiện',
      cancel: 'Hủy',
      confirmRegistration: 'Xác nhận đăng ký',
      activeVolunteersLabel: 'Tình nguyện viên hoạt động',
      partnerNGOsLabel: 'Tổ chức đối tác',
      hoursLoggedLabel: 'Giờ đã ghi',
      citiesWorldwide: 'Thành phố trên toàn thế giới',
      howItWorks: 'CÁCH THỨC HOẠT ĐỘNG',
      journeyToImpact: 'Hành trình đến tác động của bạn',
      journeySubtitle: 'Một nền tảng được thiết kế để khuếch đại đóng góp của bạn cho cộng đồng',
      discoverMissions: 'Khám phá nhiệm vụ',
      discoverMissionsDesc: 'Tìm cơ hội tình nguyện có ý nghĩa phù hợp với đam mê của bạn',
      trackProgress: 'Theo dõi tiến độ',
      trackProgressDesc: 'Theo dõi giờ tình nguyện và xem tác động của bạn phát triển',
      earnRecognition: 'Nhận được sự công nhận',
      earnRecognitionDesc: 'Nhận huy hiệu và chứng chỉ cho những đóng góp của bạn',
      buildNetwork: 'Xây dựng mạng lưới',
      buildNetworkDesc: 'Kết nối với những tình nguyện viên và tổ chức có cùng chí hướng',
      testimonialsLabel: 'LỜI CHỨNG THỰC',
      successStoriesTitle: 'Câu chuyện về tác động',
      successStoriesSubtitle: 'Câu chuyện thực từ tình nguyện viên và tổ chức đang tạo ra sự khác biệt trên toàn thế giới',
      scrollLabel: 'CUỘN',
      hoursStats: 'Giờ',
      missionsStats: 'Nhiệm vụ',
      volunteersStats: 'Tình nguyện viên',
      projectsStats: 'Dự án',
      globalImpactTitle: 'Tác động toàn cầu của chúng tôi',
      globalImpactSubtitle: 'Cùng nhau, chúng ta đang tạo ra thay đổi có ý nghĩa trên toàn cầu',
      activeCommunitiesTitle: 'Cộng đồng hoạt động trên toàn thế giới',
      northAmerica: 'Bắc Mỹ',
      europe: 'Châu Âu',
      asiaPacific: 'Châu Á Thái Bình Dương',
      latinAmerica: 'Châu Mỹ Latinh',
      africaMiddleEast: 'Châu Phi & Trung Đông',
      africa: 'Châu Phi',
      middleEast: 'Trung Đông',
      sdgTitle: 'Đóng góp vào Mục tiêu Phát triển Bền vững của Liên Hợp Quốc',
      sdgSubtitle: 'Các nhiệm vụ của chúng tôi phù hợp với nỗ lực toàn cầu để tạo ra một thế giới tốt đẹp hơn',
      noPoverty: 'Xóa đói giảm nghèo',
      zeroHunger: 'Không còn đói',
      goodHealth: 'Sức khỏe tốt',
      qualityEducation: 'Giáo dục chất lượng',
      reducedInequalities: 'Giảm bất bình đẳng',
      sustainableCities: 'Thành phố bền vững',
      climateAction: 'Hành động vì khí hậu',
      partnerships: 'Đối tác',
      readyToImpact: 'Sẵn sàng tạo ra tác động?',
      readyToImpactSubtitle: 'Tham gia cùng hơn 150.000 tình nguyện viên và hơn 500 tổ chức đang tạo ra thay đổi tích cực trong các cộng đồng trên toàn thế giới. Hành trình của bạn bắt đầu ngay hôm nay.',
      startVolunteeringToday: 'Bắt đầu tình nguyện ngay hôm nay',
      registerNGO: 'Đăng ký tổ chức của bạn',
      freeToJoin: 'Miễn phí tham gia',
      noCommitments: 'Không có cam kết',
      startImpactImmediately: 'Bắt đầu tạo tác động ngay lập tức',
      footerTagline: 'Trao quyền cho tình nguyện viên trên toàn thế giới',
      footerCopyright: 'KindWorld. Bảo lưu mọi quyền.',
      ngoDashboardTitle: 'Bảng điều khiển tổ chức',
      ngoDashboardSubtitle: 'Tạo hoạt động tình nguyện, quản lý chứng chỉ và theo dõi tác động cộng đồng',
      ngoActiveVolunteers: 'Tình nguyện viên hoạt động',
      ngoPublishedActivities: 'Hoạt động đã xuất bản',
      ngoCertificatesIssued: 'Chứng chỉ đã cấp',
      ngoTotalImpactHours: 'Tổng giờ tác động',
      createNewActivity: 'Tạo hoạt động mới',
      publishVolunteerOpportunities: 'Xuất bản cơ hội tình nguyện cho cộng đồng',
      createActivity: 'Tạo hoạt động',
      manageCertificatesTitle: 'Quản lý chứng chỉ',
      createPublishCertificates: 'Tạo và xuất bản chứng chỉ cho tình nguyện viên',
      allHoursVerified: 'Tất cả giờ tình nguyện đã được xác minh!',
      pendingStatus: 'Đang chờ',
      viewAll: 'Xem tất cả',
      noActivitiesYet: 'Chưa có hoạt động nào được xuất bản. Tạo hoạt động đầu tiên của bạn!',
      participantsLabel2: 'Người tham gia',
      durationLabel: 'Thời lượng',
      upcomingStatus: 'Sắp tới',
      completedStatus: 'Đã hoàn thành',
      editLabel: 'Chỉnh sửa',
      issueCertificates: 'Cấp chứng chỉ',
      yourCertificates: 'Chứng chỉ của bạn',
      uploadCertificateBtn: 'Tải lên chứng chỉ',
      noCertificatesYet: 'Chưa có chứng chỉ nào được tải lên',
      uploadFirstCertificate: 'Tải lên chứng chỉ đầu tiên của bạn',
      issuedLabel: 'đã cấp',
      publishLabel: 'Xuất bản',
      previewLabel: 'Xem trước',
      createNewVolunteerActivity: 'Tạo hoạt động tình nguyện mới',
      activityTitle: 'Tiêu đề hoạt động',
      activityTitlePlaceholder: 'ví dụ: Dọn dẹp bãi biển',
      descriptionLabel: 'Mô tả',
      descriptionPlaceholder: 'Mô tả hoạt động tình nguyện và tác động của nó...',
      locationLabel: 'Địa điểm',
      locationPlaceholder: 'ví dụ: Công viên 23/9, TP.HCM',
      dateLabel: 'Ngày',
      durationHours: 'Thời lượng (giờ)',
      maxParticipantsLabel: 'Số người tham gia tối đa',
      categoryLabel: 'Danh mục',
      difficultyLabel: 'Độ khó',
      categoryEnvironment: 'Môi trường',
      categoryCommunity: 'Cộng đồng',
      categoryHealthcare: 'Y tế',
      categoryEducation: 'Giáo dục',
      categoryAnimals: 'Động vật',
      difficultyEasy: 'Dễ',
      difficultyMedium: 'Trung bình',
      difficultyHard: 'Khó',
      publishActivity: 'Xuất bản hoạt động',
      organizationLabel: 'Tổ chức',
      studentLabel: 'Sinh viên',
      ngosLabel: 'Tổ chức',
      participantListTitle: 'Danh sách người tham gia',
      registeredParticipants: 'Người tham gia đã đăng ký',
      noParticipantsYet: 'Chưa có người tham gia nào đăng ký.',
      closeLabel: 'Đóng',
      contactLabel: 'Liên hệ',
      emergencyLabel: 'Khẩn cấp',
      adminDashboardTitle: 'Bảng điều khiển quản trị',
      adminDashboardSubtitle: 'Quản lý người dùng, giám sát hoạt động nền tảng và giám sát các chương trình tình nguyện',
      totalUsersLabel: 'Tổng người dùng',
      volunteersLabel2: 'Tình nguyện viên',
      totalMissionsLabel: 'Tổng nhiệm vụ',
      viewManageMissions: 'Xem và quản lý tất cả nhiệm vụ tình nguyện trên nền tảng',
      missionsCount: 'nhiệm vụ',
      volunteersCount: 'tình nguyện viên',
      addRemoveBadges: 'Thêm hoặc xóa huy hiệu cho tình nguyện viên để công nhận',
      badgesAvailable: 'huy hiệu có sẵn',
      openBadgeManager: 'Mở quản lý huy hiệu',
      ngoApplications: 'Đơn đăng ký tổ chức',
      ngoApplicationsDesc: 'Xem xét và phê duyệt yêu cầu đăng ký tổ chức',
      pendingApplications: 'đơn đang chờ',
      approveNGO: 'Phê duyệt',
      rejectNGO: 'Từ chối',
      ngoListTitle: 'Tổ chức đã đăng ký',
      ngoListDesc: 'Xem tất cả tổ chức đã được phê duyệt trên nền tảng',
      registeredNGOs: 'tổ chức đã đăng ký',
      ngoName: 'Tên tổ chức',
      ngoEmail: 'Email',
      ngoDescription: 'Mô tả',
      ngoWebsite: 'Website',
      appliedOn: 'Đăng ký vào',
      approvedOn: 'Phê duyệt vào',
      noApplications: 'Không có đơn đang chờ',
      adminLabel: 'Quản trị',
      activeStatus: 'Hoạt động',
      deleteLabel: 'Xóa',
      manageLabel: 'Quản lý',
      confirmDelete: 'Bạn có chắc chắn muốn xóa nhiệm vụ này?',
      backLabel: 'Quay lại',
      detailsLabel: 'Chi tiết',
      totalHoursLabel: 'Tổng giờ',
      missionsCompletedLabel: 'Nhiệm vụ',
      badgesLabel: 'Huy hiệu',
      orgsHelpedLabel: 'Tổ chức đã hỗ trợ',
      roleLabel: 'Vai trò',
      statusLabel: 'Trạng thái',
      joinDateLabel: 'Ngày tham gia',
      ratingLabel: 'Đánh giá',
      reportLabel: 'Báo cáo',
      volunteerActivityBreakdown: 'Chi tiết hoạt động tình nguyện của bạn',
      missionsCompleted: 'Nhiệm vụ đã hoàn thành',
      missionTimeline: 'Dòng thời gian nhiệm vụ',
      myBadges: 'Huy hiệu của tôi',
      volunteerRole: 'Tình nguyện viên',
      uploadCertDescription: 'Tải lên chứng chỉ bạn đã thiết kế để tình nguyện viên nhận sau khi hoàn thành nhiệm vụ',
      certificateNameOptional: 'Tên chứng chỉ (Tùy chọn)',
      badgeManagementCenter: 'Trung tâm quản lý huy hiệu',
      badgeManagementDesc: 'Mở khóa và quản lý huy hiệu thành tích cho tình nguyện viên',
      selectUser: 'Chọn người dùng',
      selectUserDesc: 'Chọn một người dùng',
      selectUserDescLong: 'Chọn một tình nguyện viên từ danh sách bên trái để quản lý huy hiệu của họ',
      allBadgesTitle: 'Tất cả huy hiệu',
      clickToUnlockRemove: 'Nhấp để mở khóa hoặc xóa',
      clickToRemove: 'Nhấp để xóa',
      clickToUnlock: 'Nhấp để mở khóa',
      hoursUnit: 'giờ',
      editUserTitle: 'Chỉnh sửa người dùng',
      fullNameLabel: 'Họ và tên',
      emailLabel: 'Địa chỉ email',
      volunteerHoursLabel: 'Giờ tình nguyện',
      userRoleLabel: 'Vai trò người dùng',
      studentVolunteerRole: 'Sinh viên/Tình nguyện viên',
      platformAdmin: 'Quản trị viên nền tảng',
      saveLabel: 'Lưu',
      cancelLabel: 'Hủy',
      userUpdatedSuccess: 'Cập nhật người dùng thành công',
      profileUpdatedSuccess: 'Cập nhật hồ sơ thành công!',
      verifiedLabel: 'Đã xác minh',
      cancelEditLabel: 'Hủy chỉnh sửa',
      totalHoursProfile: 'Tổng giờ',
      activitiesCompleted: 'Hoạt động đã hoàn thành',
      badgesEarned: 'Huy hiệu đã nhận',
      organizationsHelpedProfile: 'Tổ chức đã hỗ trợ',
      cityPlaceholder: 'TP. Hồ Chí Minh, Việt Nam',
      backToDashboard: 'Quay lại bảng điều khiển',
      badgesDescription: 'Thành tích và sự công nhận của bạn',
      earnedLabel: 'Đã nhận',
      totalAvailable: 'Tổng có sẵn',
      earnedBadgesTitle: 'Huy hiệu đã nhận',
      earnedOn: 'Nhận vào ',
      noBadgesYet: 'Bạn chưa nhận được huy hiệu nào',
      noBadgesDesc: 'Hoàn thành nhiệm vụ và tích lũy giờ tình nguyện để mở khóa huy hiệu!',
      allAvailableBadges: 'Tất cả huy hiệu có sẵn',
      lockedLabel: 'Đã khóa',
      earnedBadgesLabel: 'Huy hiệu đã nhận',
      manageBadgesBtn: 'Quản lý huy hiệu',
      connectWithVolunteers: 'Kết nối với các tình nguyện viên khác',
      addFriend: 'Thêm bạn',
      searchFriendPlaceholder: 'Tìm kiếm theo tên hoặc email...',
      sendRequest: 'Gửi yêu cầu',
      friendRequests: 'Yêu cầu kết bạn',
      accept: 'Chấp nhận',
      decline: 'Từ chối',
      myFriends: 'Bạn bè của tôi',
      noFriendsYet: 'Chưa có bạn bè',
      startConnecting: 'Bắt đầu kết nối với các tình nguyện viên khác!',
      pendingLabel: 'Đang chờ',
      removeFriend: 'Xóa',
      pendingRequests: 'Yêu cầu đang chờ',
      requestSent: 'Đã gửi yêu cầu',
      cancelRequest: 'Hủy',
      userManagementTitle: 'Quản lý người dùng',
      userManagementDesc: 'Xem và quản lý tất cả người dùng đã đăng ký trên nền tảng',
      tableHeaderUser: 'Người dùng',
      tableHeaderRole: 'Vai trò',
      tableHeaderHours: 'Giờ',
      tableHeaderMissions: 'Nhiệm vụ',
      tableHeaderBadges: 'Huy hiệu',
      tableHeaderStatus: 'Trạng thái',
      tableHeaderActions: 'Hành động',
      roleStudentLabel: 'Sinh viên',
      roleNGOLabel: 'Tổ chức',
      roleAdminLabel: 'Quản trị',
      statusActive: 'Hoạt động',
      statusVerified: 'Đã xác minh',
      publishActivityBtn: 'Xuất bản hoạt động',
      editMissionTitle: 'Chỉnh sửa nhiệm vụ',
      titleLabelForm: 'Tiêu đề',
      hoursLabelForm: 'Giờ',
      maxParticipantsForm: 'Số người tham gia tối đa',
      categoryFormLabel: 'Danh mục',
      difficultyFormLabel: 'Độ khó',
      saveChangesBtn: 'Lưu thay đổi',
      certificateManagerTitle: 'Quản lý chứng chỉ',
      certificatesTitle: 'Chứng chỉ & Giải thưởng',
      certificatesSubtitle: 'Đăng ký chứng chỉ chính thức và huy chương từ các tổ chức đối tác',
      personalInformation: 'Thông tin cá nhân',
      languageSettings: 'Ngôn ngữ',
      volunteerInterests: 'Sở thích tình nguyện',
      interestEnvironment: 'Môi trường',
      interestEducation: 'Giáo dục',
      interestHealthcare: 'Y tế',
      interestCommunity: 'Cộng đồng',
      interestAnimals: 'Động vật',
      interestElderlyCare: 'Chăm sóc người cao tuổi',
      interestYouthPrograms: 'Chương trình thanh niên',
      interestFoodSecurity: 'An ninh lương thực',
      requiredHoursLabel: 'Giờ yêu cầu',
      yourProgressLabel: 'Tiến độ của bạn',
      signInFooterTagline: 'Trao quyền cho cộng đồng thông qua hành động nhân ái',
      signInFooterCopyright: '© 2026 KindWorld. Bảo lưu mọi quyền.',
      noCertificatesUploadedYet: 'Chưa có chứng chỉ nào được tải lên. Tải lên chứng chỉ đầu tiên của bạn ở trên!',
      noCertificatesAvailableYet: 'Chưa có chứng chỉ nào. Vui lòng quay lại sau!',
      transportOwn: 'Có phương tiện riêng',
      transportCarpool: 'Cần đưa đón',
      transportPublic: 'Phương tiện công cộng',
      selectRegion: 'Chọn khu vực',
      selectLanguage: 'Chọn ngôn ngữ',
      nearbyMissions: 'Vị trí của tôi',
      findMissions: 'Tìm nhiệm vụ',
      allRegions: 'Tất cả khu vực',
      allCountries: 'Tất cả quốc gia',
      regionSetup: 'Thiết lập hồ sơ của bạn',
      regionSetupDesc: 'Giúp chúng tôi tìm cơ hội tình nguyện gần bạn',
      yourRegion: 'Khu vực của bạn',
      yourCountry: 'Quốc gia của bạn',
      preferredLanguage: 'Ngôn ngữ ưa thích',
      continueSetup: 'Tiếp tục',
      skipForNow: 'Bỏ qua lúc này'
    },
    ko: {
      title: 'KindWorld',
      subtitle: '친절을 영향력으로 바꾸세요',
      getStarted: '시작하기',
      signIn: '로그인',
      startVolunteering: '봉사 시작하기',
      learnMore: '더 알아보기',
      dashboard: '대시보드',
      missions: '미션',
      certificates: '인증서',
      badges: '배지',
      friends: '친구',
      profile: '프로필',
      volunteerHours: '봉사 시간',
      thisMonthHours: '이번 달',
      selectRole: '역할을 선택하세요:',
      student: '학생 - 봉사활동을 하고 싶습니다',
      ngo: '조직 - 미션을 만듭니다',
      admin: '관리자 - 플랫폼을 관리합니다',
      welcomeBack: '다시 오신 것을 환영합니다',
      impactSummary: '봉사 활동 영향력 요약입니다',
      projectsCompleted: '완료된 프로젝트',
      organizationsHelped: '도운 조직',
      averageRating: '평균 평점',
      monthlyProgress: '6개월 봉사 진행 상황',
      yearlyProgress: '연간 봉사 진행 상황',
      allTimeProgress: '전체 봉사 진행 상황',
      clickForDetails: '세부 사항을 보려면 아무 점이나 클릭하세요',
      clickPointsForDetails: '세부 사항 보기',
      sixMonths: '6개월',
      oneYear: '1년',
      allTime: '전체',
      logout: '로그아웃',
      volunteerPlatform: '봉사 플랫폼',
      heroTitle1: '커뮤니티 역량 강화',
      heroSubtitle1: '자비로운 행동을 통해 삶을 변화시키세요',
      heroTitle2: '변화 만들기',
      heroSubtitle2: '친절의 매 시간이 지속적인 영향을 만듭니다',
      heroTitle3: '운동에 참여하기',
      heroSubtitle3: '글로벌 체인지메이커 네트워크의 일원이 되세요',
      welcomeBackTitle: '다시 오신 것을 환영합니다',
      createAccount: '계정 만들기',
      signInToContinue: '여정을 계속하려면 로그인하세요',
      joinKindWorld: 'KindWorld에 가입하여 변화를 만드세요',
      emailOrUsername: '이메일 또는 사용자 이름',
      password: '비밀번호',
      forgotPassword: '비밀번호를 잊으셨나요?',
      pleaseFillAllFields: '이메일과 비밀번호를 입력해주세요',
      invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다',
      rememberMe: '로그인 상태 유지',
      noAccount: '계정이 없으신가요?',
      registerNow: '지금 등록하세요',
      firstName: '이름',
      lastName: '성',
      emailAddress: '이메일 주소',
      phoneNumber: '전화번호',
      country: '국가',
      cityResidency: '도시 / 거주지',
      confirmPassword: '비밀번호 확인',
      minCharacters: '최소 8자',
      agreeTerms: '동의합니다',
      termsOfService: '이용 약관',
      and: '및',
      privacyPolicy: '개인정보 보호정책',
      orSignInWith: '또는 다음으로 로그인',
      orRegisterWith: '또는 다음으로 등록',
      alreadyHaveAccount: '이미 계정이 있으신가요?',
      selectCountry: '국가 선택',
      creatingAccount: '계정 생성 중...',
      roleVolunteer: '봉사자',
      roleNGO: '조직',
      roleAdmin: '관리자',
      ngoWelcome: '조직 대시보드',
      manageMissions: '미션 관리',
      createMission: '새 미션 만들기',
      pendingVerifications: '대기 중인 시간 인증',
      verifyHours: '시간 인증',
      approveHours: '승인',
      rejectHours: '거부',
      hoursToVerify: '인증할 시간',
      volunteerName: '봉사자 이름',
      missionName: '미션 이름',
      hoursSubmitted: '제출된 시간',
      submittedDate: '제출 날짜',
      uploadCertificate: '인증서 업로드',
      certificateName: '인증서 이름',
      uploadFile: '파일 업로드',
      dragDropFile: '드래그 앤 드롭하거나 클릭하여 업로드',
      supportedFormats: '지원 형식: PDF, PNG, JPG',
      publishCertificate: '인증서 게시',
      saveDraft: '임시 저장',
      editProfile: '프로필 편집',
      saveChanges: '변경 사항 저장',
      personalInfo: '개인 정보',
      contactInfo: '연락처 정보',
      volunteerStats: '봉사 통계',
      totalVolunteerHours: '총 봉사 시간',
      viewAnalytics: '분석 보기',
      totalMissions: '총 미션',
      activeVolunteers: '활동 중인 봉사자',
      hoursCompleted: '완료된 시간',
      platformManagement: '플랫폼 관리',
      allMissions: '모든 미션',
      allUsers: '모든 사용자',
      removeMission: '미션 삭제',
      manageBadges: '배지 관리',
      addBadge: '배지 추가',
      removeBadge: '배지 삭제',
      userDetails: '사용자 세부 정보',
      editUser: '사용자 편집',
      hoursBreakdown: '시간 내역',
      environmentHours: '환경',
      communityHours: '커뮤니티',
      healthcareHours: '헬스케어',
      educationHours: '교육',
      discoverImpact: '글로벌 영향력 발견하기',
      discoverImpactSubtitle: '한 시간씩 삶을 변화시키는 글로벌 체인지메이커 커뮤니티에 가입하세요.',
      ourGlobalImpact: '우리의 글로벌 영향력',
      realNumbers: '실제 변화를 만드는 실제 봉사자들의 실제 숫자',
      activeInWorld: '세계 곳곳에서 활동 중',
      communitySpans: '우리의 봉사자 커뮤니티는 대륙을 넘어 뻗어 있습니다',
      volunteerHoursLogged: '기록된 봉사 시간',
      treesPlanted: '심은 나무',
      mealsServed: '제공한 식사',
      countriesReached: '도달한 국가',
      partnerNGOs: '파트너 조직',
      backToHome: '홈으로 돌아가기',
      joinNow: '지금 가입하기',
      volunteers: '봉사자',
      countries: '국가',
      voicesFromCommunity: '커뮤니티의 목소리',
      realStoriesVolunteers: '전 세계 봉사자들의 실제 이야기',
      hours: '시간',
      missionsLabel: '미션',
      trustedByOrganizations: '선도 조직들이 신뢰합니다',
      ngosUseKindWorld: '전 세계 조직들이 KindWorld를 사용하여 영향력을 확대합니다',
      volunteersLabel: '봉사자',
      missionsPosted: '게시된 미션',
      alignedWithSDG: 'UN 지속가능발전목표에 부합',
      sdgDescription: '우리의 미션은 글로벌 발전 목표에 기여하여 인류의 가장 큰 도전에 측정 가능한 영향을 만듭니다',
      readyToMakeMark: '흔적을 남길 준비가 되셨나요?',
      joinThousands: '긍정적인 변화를 만드는 수천 명의 봉사자와 조직에 가입하세요. 변화를 만드는 여정은 한 걸음에서 시작됩니다.',
      startVolunteeringBtn: '봉사 시작하기',
      registerYourNGO: '조직 등록하기',
      trustedBy: '신뢰하는',
      partneredWith: '파트너',
      activeIn: '활동 중',
      volunteersIn: '봉사자 위치',
      hoursLoggedDesc: '커뮤니티를 더 좋게 만드는 데 헌신한 시간',
      treesPlantedDesc: '더 푸른 지구에 기여',
      mealsServedDesc: '한 끼씩 배고픔과 싸우기',
      countriesDesc: '진정한 글로벌 친절 운동',
      activeVolunteersDesc: '성장하는 체인지메이커 커뮤니티',
      partnerNGOsDesc: '영향력을 만드는 조직',
      availableMissionsTitle: '이용 가능한 미션',
      availableMissionsSubtitle: '봉사 미션에 참여하여 지역 사회에 긍정적인 영향을 만드세요',
      hoursLabel: '시간',
      participantsLabel: '참가자',
      joinMission: '미션 참여',
      leaveMission: '미션 나가기',
      joinMissionTitle: '미션 참여',
      viewDetails: '상세 보기',
      manageMission: '관리',
      ngoMissionsTitle: '등록한 미션',
      ngoMissionsSubtitle: '봉사 활동을 관리하고 참여를 추적하세요',
      adminMissionsTitle: '모든 미션',
      adminMissionsSubtitle: '플랫폼의 모든 활동을 모니터링하고 관리하세요',
      registrationForm: '등록 양식',
      fullName: '성명',
      emergencyContact: '비상 연락처',
      emergencyPhone: '비상 전화',
      allergies: '알레르기 (있는 경우)',
      medicalConditions: '건강 상태',
      dietaryRestrictions: '식이 제한',
      tshirtSize: '티셔츠 사이즈',
      transportation: '교통 수단',
      ownTransport: '자가 교통',
      needRide: '픽업 필요',
      publicTransport: '대중 교통',
      specialSkills: '특기',
      agreeToTerms: '약관에 동의합니다',
      cancel: '취소',
      confirmRegistration: '등록 확인',
      activeVolunteersLabel: '활동 중인 봉사자',
      partnerNGOsLabel: '파트너 조직',
      hoursLoggedLabel: '기록된 시간',
      citiesWorldwide: '전 세계 도시',
      howItWorks: '작동 방식',
      journeyToImpact: '영향력으로 가는 여정',
      journeySubtitle: '커뮤니티에 대한 기여를 증폭시키도록 설계된 플랫폼',
      discoverMissions: '미션 발견하기',
      discoverMissionsDesc: '열정에 맞는 의미 있는 봉사 기회 찾기',
      trackProgress: '진행 상황 추적',
      trackProgressDesc: '봉사 시간을 모니터링하고 영향력이 성장하는 것을 보세요',
      earnRecognition: '인정 받기',
      earnRecognitionDesc: '기여에 대한 배지와 인증서 획득',
      buildNetwork: '네트워크 구축',
      buildNetworkDesc: '같은 생각을 가진 봉사자 및 조직과 연결',
      testimonialsLabel: '후기',
      successStoriesTitle: '영향력의 이야기',
      successStoriesSubtitle: '전 세계에서 변화를 만드는 봉사자와 조직의 실제 이야기',
      scrollLabel: '스크롤',
      hoursStats: '시간',
      missionsStats: '미션',
      volunteersStats: '봉사자',
      projectsStats: '프로젝트',
      globalImpactTitle: '우리의 글로벌 영향력',
      globalImpactSubtitle: '함께, 전 세계에 의미 있는 변화를 만들고 있습니다',
      activeCommunitiesTitle: '전 세계 활동 중인 커뮤니티',
      northAmerica: '북미',
      europe: '유럽',
      asiaPacific: '아시아 태평양',
      latinAmerica: '라틴 아메리카',
      africaMiddleEast: '아프리카 & 중동',
      africa: '아프리카',
      middleEast: '중동',
      sdgTitle: 'UN 지속가능발전목표에 기여',
      sdgSubtitle: '우리의 미션은 더 나은 세상을 만들기 위한 글로벌 노력에 부합합니다',
      noPoverty: '빈곤 퇴치',
      zeroHunger: '기아 종식',
      goodHealth: '건강과 웰빙',
      qualityEducation: '양질의 교육',
      reducedInequalities: '불평등 감소',
      sustainableCities: '지속 가능한 도시',
      climateAction: '기후 행동',
      partnerships: '파트너십',
      readyToImpact: '영향을 만들 준비가 되셨나요?',
      readyToImpactSubtitle: '전 세계 커뮤니티에서 긍정적인 변화를 만드는 150,000명 이상의 봉사자와 500개 이상의 조직에 가입하세요. 여정은 오늘 시작됩니다.',
      startVolunteeringToday: '오늘 봉사 시작하기',
      registerNGO: '조직 등록하기',
      freeToJoin: '무료 가입',
      noCommitments: '약속 없음',
      startImpactImmediately: '즉시 영향력 만들기 시작',
      footerTagline: '전 세계 봉사자에게 힘을 실어줍니다',
      footerCopyright: 'KindWorld. 모든 권리 보유.',
      ngoDashboardTitle: '조직 대시보드',
      ngoDashboardSubtitle: '봉사 활동 만들기, 인증서 관리, 커뮤니티 영향력 추적',
      ngoActiveVolunteers: '활동 중인 봉사자',
      ngoPublishedActivities: '게시된 활동',
      ngoCertificatesIssued: '발급된 인증서',
      ngoTotalImpactHours: '총 영향력 시간',
      createNewActivity: '새 활동 만들기',
      publishVolunteerOpportunities: '커뮤니티를 위한 봉사 기회 게시',
      createActivity: '활동 만들기',
      manageCertificatesTitle: '인증서 관리',
      createPublishCertificates: '봉사자를 위한 인증서 만들기 및 게시',
      allHoursVerified: '모든 봉사 시간이 인증되었습니다!',
      pendingStatus: '대기 중',
      viewAll: '모두 보기',
      noActivitiesYet: '아직 게시된 활동이 없습니다. 첫 번째 활동을 만드세요!',
      participantsLabel2: '참가자',
      durationLabel: '기간',
      upcomingStatus: '예정됨',
      completedStatus: '완료됨',
      editLabel: '편집',
      issueCertificates: '인증서 발급',
      yourCertificates: '내 인증서',
      uploadCertificateBtn: '인증서 업로드',
      noCertificatesYet: '아직 업로드된 인증서가 없습니다',
      uploadFirstCertificate: '첫 번째 인증서 업로드',
      issuedLabel: '발급됨',
      publishLabel: '게시',
      previewLabel: '미리보기',
      createNewVolunteerActivity: '새 봉사 활동 만들기',
      activityTitle: '활동 제목',
      activityTitlePlaceholder: '예: 해변 청소 캠페인',
      descriptionLabel: '설명',
      descriptionPlaceholder: '봉사 활동과 그 영향에 대해 설명하세요...',
      locationLabel: '위치',
      locationPlaceholder: '예: 서울 한강공원',
      dateLabel: '날짜',
      durationHours: '기간 (시간)',
      maxParticipantsLabel: '최대 참가자',
      categoryLabel: '카테고리',
      difficultyLabel: '난이도',
      categoryEnvironment: '환경',
      categoryCommunity: '커뮤니티',
      categoryHealthcare: '헬스케어',
      categoryEducation: '교육',
      categoryAnimals: '동물',
      difficultyEasy: '쉬움',
      difficultyMedium: '보통',
      difficultyHard: '어려움',
      publishActivity: '활동 게시',
      organizationLabel: '조직',
      studentLabel: '학생',
      ngosLabel: '조직',
      participantListTitle: '참가자 목록',
      registeredParticipants: '등록된 참가자',
      noParticipantsYet: '아직 등록된 참가자가 없습니다.',
      closeLabel: '닫기',
      contactLabel: '연락처',
      emergencyLabel: '비상',
      adminDashboardTitle: '관리자 대시보드',
      adminDashboardSubtitle: '사용자 관리, 플랫폼 활동 모니터링, 봉사 프로그램 감독',
      totalUsersLabel: '총 사용자',
      volunteersLabel2: '봉사자',
      totalMissionsLabel: '총 미션',
      viewManageMissions: '플랫폼의 모든 봉사 미션 보기 및 관리',
      missionsCount: '개 미션',
      volunteersCount: '명의 봉사자',
      addRemoveBadges: '봉사자에게 배지 추가 또는 제거',
      badgesAvailable: '개의 배지 이용 가능',
      openBadgeManager: '배지 관리자 열기',
      ngoApplications: '조직 신청',
      ngoApplicationsDesc: '조직 등록 요청 검토 및 승인',
      pendingApplications: '대기 중인 신청',
      approveNGO: '승인',
      rejectNGO: '거부',
      ngoListTitle: '등록된 조직',
      ngoListDesc: '플랫폼의 모든 승인된 조직 보기',
      registeredNGOs: '등록된 조직',
      ngoName: '조직 이름',
      ngoEmail: '이메일',
      ngoDescription: '설명',
      ngoWebsite: '웹사이트',
      appliedOn: '신청일',
      approvedOn: '승인일',
      noApplications: '대기 중인 신청이 없습니다',
      adminLabel: '관리자',
      activeStatus: '활성',
      deleteLabel: '삭제',
      manageLabel: '관리',
      confirmDelete: '이 미션을 삭제하시겠습니까?',
      backLabel: '뒤로',
      detailsLabel: '세부 정보',
      totalHoursLabel: '총 시간',
      missionsCompletedLabel: '미션',
      badgesLabel: '배지',
      orgsHelpedLabel: '도운 조직',
      roleLabel: '역할',
      statusLabel: '상태',
      joinDateLabel: '가입일',
      ratingLabel: '평점',
      reportLabel: '보고서',
      volunteerActivityBreakdown: '봉사 활동 내역',
      missionsCompleted: '완료된 미션',
      missionTimeline: '미션 타임라인',
      myBadges: '내 배지',
      volunteerRole: '봉사자',
      uploadCertDescription: '미션 완료 후 봉사자가 받을 디자인된 인증서 업로드',
      certificateNameOptional: '인증서 이름 (선택 사항)',
      badgeManagementCenter: '배지 관리 센터',
      badgeManagementDesc: '봉사자를 위한 성취 배지 잠금 해제 및 관리',
      selectUser: '사용자 선택',
      selectUserDesc: '사용자 선택',
      selectUserDescLong: '왼쪽 목록에서 봉사자를 선택하여 배지를 관리하세요',
      allBadgesTitle: '모든 배지',
      clickToUnlockRemove: '잠금 해제 또는 제거하려면 클릭',
      clickToRemove: '제거하려면 클릭',
      clickToUnlock: '잠금 해제하려면 클릭',
      hoursUnit: '시간',
      editUserTitle: '사용자 편집',
      fullNameLabel: '성명',
      emailLabel: '이메일 주소',
      volunteerHoursLabel: '봉사 시간',
      userRoleLabel: '사용자 역할',
      studentVolunteerRole: '학생/봉사자',
      platformAdmin: '플랫폼 관리자',
      saveLabel: '저장',
      cancelLabel: '취소',
      userUpdatedSuccess: '사용자가 성공적으로 업데이트되었습니다',
      profileUpdatedSuccess: '프로필이 성공적으로 업데이트되었습니다!',
      verifiedLabel: '인증됨',
      cancelEditLabel: '편집 취소',
      totalHoursProfile: '총 시간',
      activitiesCompleted: '완료된 활동',
      badgesEarned: '획득한 배지',
      organizationsHelpedProfile: '도운 조직',
      cityPlaceholder: '서울, 대한민국',
      backToDashboard: '대시보드로 돌아가기',
      badgesDescription: '성취 및 인정',
      earnedLabel: '획득함',
      totalAvailable: '총 이용 가능',
      earnedBadgesTitle: '획득한 배지',
      earnedOn: '획득일 ',
      noBadgesYet: '아직 획득한 배지가 없습니다',
      noBadgesDesc: '미션을 완료하고 봉사 시간을 쌓아 배지를 잠금 해제하세요!',
      allAvailableBadges: '모든 이용 가능한 배지',
      lockedLabel: '잠김',
      earnedBadgesLabel: '획득한 배지',
      manageBadgesBtn: '배지 관리',
      connectWithVolunteers: '다른 봉사자와 연결',
      addFriend: '친구 추가',
      searchFriendPlaceholder: '이름 또는 이메일로 검색...',
      sendRequest: '요청 보내기',
      friendRequests: '친구 요청',
      accept: '수락',
      decline: '거절',
      myFriends: '내 친구',
      noFriendsYet: '아직 친구가 없습니다',
      startConnecting: '다른 봉사자들과 연결을 시작하세요!',
      pendingLabel: '대기 중',
      removeFriend: '삭제',
      pendingRequests: '대기 중인 요청',
      requestSent: '요청 전송됨',
      cancelRequest: '취소',
      userManagementTitle: '사용자 관리',
      userManagementDesc: '플랫폼의 모든 등록된 사용자 보기 및 관리',
      tableHeaderUser: '사용자',
      tableHeaderRole: '역할',
      tableHeaderHours: '시간',
      tableHeaderMissions: '미션',
      tableHeaderBadges: '배지',
      tableHeaderStatus: '상태',
      tableHeaderActions: '작업',
      roleStudentLabel: '학생',
      roleNGOLabel: '조직',
      roleAdminLabel: '관리자',
      statusActive: '활성',
      statusVerified: '인증됨',
      publishActivityBtn: '활동 게시',
      editMissionTitle: '미션 편집',
      titleLabelForm: '제목',
      hoursLabelForm: '시간',
      maxParticipantsForm: '최대 참가자',
      categoryFormLabel: '카테고리',
      difficultyFormLabel: '난이도',
      saveChangesBtn: '변경 사항 저장',
      certificateManagerTitle: '인증서 관리자',
      certificatesTitle: '인증서 & 상',
      certificatesSubtitle: '파트너 조직의 공식 인증서 및 메달 신청',
      personalInformation: '개인 정보',
      languageSettings: '언어',
      volunteerInterests: '봉사 관심사',
      interestEnvironment: '환경',
      interestEducation: '교육',
      interestHealthcare: '헬스케어',
      interestCommunity: '커뮤니티',
      interestAnimals: '동물',
      interestElderlyCare: '노인 돌봄',
      interestYouthPrograms: '청소년 프로그램',
      interestFoodSecurity: '식량 안보',
      requiredHoursLabel: '필요한 시간',
      yourProgressLabel: '내 진행 상황',
      signInFooterTagline: '자비로운 행동으로 커뮤니티에 힘을 실어줍니다',
      signInFooterCopyright: '© 2026 KindWorld. 모든 권리 보유.',
      noCertificatesUploadedYet: '아직 업로드된 인증서가 없습니다. 위에서 첫 번째 인증서를 업로드하세요!',
      noCertificatesAvailableYet: '아직 이용 가능한 인증서가 없습니다. 나중에 다시 확인하세요!',
      transportOwn: '자가 교통',
      transportCarpool: '픽업 필요',
      transportPublic: '대중 교통',
      selectRegion: '지역 선택',
      selectLanguage: '언어 선택',
      nearbyMissions: '내 위치',
      findMissions: '미션 찾기',
      allRegions: '모든 지역',
      allCountries: '모든 국가',
      regionSetup: '프로필 설정',
      regionSetupDesc: '근처의 봉사 기회를 찾을 수 있도록 도와주세요',
      yourRegion: '내 지역',
      yourCountry: '내 국가',
      preferredLanguage: '선호 언어',
      continueSetup: '계속',
      skipForNow: '나중에 하기'
    },
    de: {
      title: 'KindWorld',
      subtitle: 'Verwandeln Sie Freundlichkeit in Wirkung',
      getStarted: 'Loslegen',
      signIn: 'Anmelden',
      startVolunteering: 'Freiwilligenarbeit starten',
      learnMore: 'Mehr erfahren',
      dashboard: 'Dashboard',
      missions: 'Missionen',
      certificates: 'Zertifikate',
      badges: 'Abzeichen',
      friends: 'Freunde',
      profile: 'Profil',
      volunteerHours: 'Freiwilligenstunden',
      thisMonthHours: 'Diesen Monat',
      selectRole: 'Wählen Sie Ihre Rolle:',
      student: 'Student - Ich möchte mich freiwillig engagieren',
      ngo: 'Organisation - Wir erstellen Missionen',
      admin: 'Admin - Ich verwalte die Plattform',
      welcomeBack: 'Willkommen zurück',
      impactSummary: 'Hier ist Ihre Zusammenfassung der Freiwilligenarbeit',
      projectsCompleted: 'Abgeschlossene Projekte',
      organizationsHelped: 'Unterstützte Organisationen',
      averageRating: 'Durchschnittsbewertung',
      monthlyProgress: '6-Monats-Fortschritt',
      yearlyProgress: 'Jahresfortschritt',
      allTimeProgress: 'Gesamtfortschritt',
      clickForDetails: 'Klicken Sie auf einen beliebigen Punkt für Details',
      clickPointsForDetails: 'Für Details klicken',
      sixMonths: '6 Monate',
      oneYear: '1 Jahr',
      allTime: 'Gesamt',
      logout: 'Abmelden',
      volunteerPlatform: 'FREIWILLIGENPLATTFORM',
      heroTitle1: 'Gemeinschaften stärken',
      heroSubtitle1: 'Leben durch mitfühlendes Handeln verändern',
      heroTitle2: 'Einen Unterschied machen',
      heroSubtitle2: 'Jede Stunde der Freundlichkeit schafft bleibende Wirkung',
      heroTitle3: 'Der Bewegung beitreten',
      heroSubtitle3: 'Werden Sie Teil eines globalen Netzwerks von Veränderern',
      welcomeBackTitle: 'Willkommen zurück',
      createAccount: 'Konto erstellen',
      signInToContinue: 'Melden Sie sich an, um fortzufahren',
      joinKindWorld: 'Treten Sie KindWorld bei und machen Sie einen Unterschied',
      emailOrUsername: 'E-Mail oder Benutzername',
      password: 'Passwort',
      forgotPassword: 'Passwort vergessen?',
      pleaseFillAllFields: 'Bitte geben Sie Ihre E-Mail und Ihr Passwort ein',
      invalidCredentials: 'Ungültige E-Mail oder Passwort',
      rememberMe: 'Angemeldet bleiben',
      noAccount: 'Noch kein Konto?',
      registerNow: 'Jetzt registrieren',
      firstName: 'Vorname',
      lastName: 'Nachname',
      emailAddress: 'E-Mail-Adresse',
      phoneNumber: 'Telefonnummer',
      country: 'Land',
      cityResidency: 'Stadt / Wohnort',
      confirmPassword: 'Passwort bestätigen',
      minCharacters: 'Mind. 8 Zeichen',
      agreeTerms: 'Ich stimme zu',
      termsOfService: 'Nutzungsbedingungen',
      and: 'und',
      privacyPolicy: 'Datenschutzrichtlinie',
      orSignInWith: 'oder anmelden mit',
      orRegisterWith: 'oder registrieren mit',
      alreadyHaveAccount: 'Bereits ein Konto?',
      selectCountry: 'Land auswählen',
      creatingAccount: 'Konto wird erstellt...',
      roleVolunteer: 'Freiwilliger',
      roleNGO: 'Organisation',
      roleAdmin: 'Admin',
      ngoWelcome: 'Organisations-Dashboard',
      manageMissions: 'Missionen verwalten',
      createMission: 'Neue Mission erstellen',
      pendingVerifications: 'Ausstehende Stundenverifizierungen',
      verifyHours: 'Stunden verifizieren',
      approveHours: 'Genehmigen',
      rejectHours: 'Ablehnen',
      hoursToVerify: 'zu verifizierende Stunden',
      volunteerName: 'Name des Freiwilligen',
      missionName: 'Missionsname',
      hoursSubmitted: 'Eingereichte Stunden',
      submittedDate: 'Einreichungsdatum',
      uploadCertificate: 'Zertifikat hochladen',
      certificateName: 'Zertifikatsname',
      uploadFile: 'Datei hochladen',
      dragDropFile: 'Ziehen und ablegen oder klicken zum Hochladen',
      supportedFormats: 'Unterstützte Formate: PDF, PNG, JPG',
      publishCertificate: 'Zertifikat veröffentlichen',
      saveDraft: 'Als Entwurf speichern',
      editProfile: 'Profil bearbeiten',
      saveChanges: 'Änderungen speichern',
      personalInfo: 'Persönliche Informationen',
      contactInfo: 'Kontaktinformationen',
      volunteerStats: 'Freiwilligenstatistik',
      totalVolunteerHours: 'Gesamte Freiwilligenstunden',
      viewAnalytics: 'Analysen anzeigen',
      totalMissions: 'Gesamte Missionen',
      activeVolunteers: 'Aktive Freiwillige',
      hoursCompleted: 'Abgeschlossene Stunden',
      platformManagement: 'Plattformverwaltung',
      allMissions: 'Alle Missionen',
      allUsers: 'Alle Benutzer',
      removeMission: 'Mission entfernen',
      manageBadges: 'Abzeichen verwalten',
      addBadge: 'Abzeichen hinzufügen',
      removeBadge: 'Abzeichen entfernen',
      userDetails: 'Benutzerdetails',
      editUser: 'Benutzer bearbeiten',
      hoursBreakdown: 'Stundenaufschlüsselung',
      environmentHours: 'Umwelt',
      communityHours: 'Gemeinschaft',
      healthcareHours: 'Gesundheit',
      educationHours: 'Bildung',
      discoverImpact: 'Entdecken Sie unsere globale Wirkung',
      discoverImpactSubtitle: 'Werden Sie Teil einer weltweiten Gemeinschaft von Veränderern, die Leben Stunde für Stunde transformieren.',
      ourGlobalImpact: 'Unsere globale Wirkung',
      realNumbers: 'Echte Zahlen von echten Freiwilligen, die echte Veränderungen bewirken',
      activeInWorld: 'Aktiv in jeder Ecke der Welt',
      communitySpans: 'Unsere Freiwilligengemeinschaft erstreckt sich über Kontinente',
      volunteerHoursLogged: 'Erfasste Freiwilligenstunden',
      treesPlanted: 'Gepflanzte Bäume',
      mealsServed: 'Servierte Mahlzeiten',
      countriesReached: 'Erreichte Länder',
      partnerNGOs: 'Partnerorganisationen',
      backToHome: 'Zurück zur Startseite',
      joinNow: 'Jetzt beitreten',
      volunteers: 'Freiwillige',
      countries: 'Länder',
      voicesFromCommunity: 'Stimmen aus unserer Gemeinschaft',
      realStoriesVolunteers: 'Echte Geschichten von Freiwilligen weltweit',
      hours: 'Stunden',
      missionsLabel: 'Missionen',
      trustedByOrganizations: 'Vertraut von führenden Organisationen',
      ngosUseKindWorld: 'Organisationen weltweit nutzen KindWorld, um ihre Wirkung zu verstärken',
      volunteersLabel: 'Freiwillige',
      missionsPosted: 'Veröffentlichte Missionen',
      alignedWithSDG: 'Ausgerichtet an den UN-Nachhaltigkeitszielen',
      sdgDescription: 'Unsere Missionen tragen zu globalen Entwicklungszielen bei und schaffen messbare Auswirkungen auf die größten Herausforderungen der Menschheit',
      readyToMakeMark: 'Bereit, Ihren Eindruck zu hinterlassen?',
      joinThousands: 'Schließen Sie sich Tausenden von Freiwilligen und Organisationen an, die positive Veränderungen schaffen. Ihre Reise, einen Unterschied zu machen, beginnt mit einem Schritt.',
      startVolunteeringBtn: 'Freiwilligenarbeit starten',
      registerYourNGO: 'Ihre Organisation registrieren',
      trustedBy: 'Vertraut von',
      partneredWith: 'Partner von',
      activeIn: 'Aktiv in',
      volunteersIn: 'Freiwillige in',
      hoursLoggedDesc: 'Stunden gewidmet für bessere Gemeinschaften',
      treesPlantedDesc: 'Beitrag zu einem grüneren Planeten',
      mealsServedDesc: 'Hunger bekämpfen, eine Mahlzeit nach der anderen',
      countriesDesc: 'Eine wahrhaft globale Bewegung der Freundlichkeit',
      activeVolunteersDesc: 'Wachsende Gemeinschaft von Veränderern',
      partnerNGOsDesc: 'Organisationen, die Wirkung erzielen',
      availableMissionsTitle: 'Verfügbare Missionen',
      availableMissionsSubtitle: 'Nehmen Sie an Freiwilligenmissionen teil und schaffen Sie einen positiven Einfluss in Ihrer Gemeinde',
      hoursLabel: 'Stunden',
      participantsLabel: 'Teilnehmer',
      joinMission: 'Mission beitreten',
      leaveMission: 'Mission verlassen',
      joinMissionTitle: 'Mission beitreten',
      viewDetails: 'Details anzeigen',
      manageMission: 'Verwalten',
      ngoMissionsTitle: 'Ihre veröffentlichten Missionen',
      ngoMissionsSubtitle: 'Verwalten Sie Ihre Aktivitäten und verfolgen Sie die Teilnahme',
      adminMissionsTitle: 'Alle Missionen',
      adminMissionsSubtitle: 'Überwachen und verwalten Sie alle Aktivitäten auf der Plattform',
      registrationForm: 'Anmeldeformular',
      fullName: 'Vollständiger Name',
      emergencyContact: 'Notfallkontakt',
      emergencyPhone: 'Notfalltelefon',
      allergies: 'Allergien (falls vorhanden)',
      medicalConditions: 'Gesundheitszustand',
      dietaryRestrictions: 'Ernährungseinschränkungen',
      tshirtSize: 'T-Shirt-Größe',
      transportation: 'Transport',
      ownTransport: 'Eigener Transport',
      needRide: 'Mitfahrgelegenheit benötigt',
      publicTransport: 'Öffentliche Verkehrsmittel',
      specialSkills: 'Besondere Fähigkeiten',
      agreeToTerms: 'Ich stimme den Bedingungen zu',
      cancel: 'Abbrechen',
      confirmRegistration: 'Anmeldung bestätigen',
      activeVolunteersLabel: 'Aktive Freiwillige',
      partnerNGOsLabel: 'Partnerorganisationen',
      hoursLoggedLabel: 'Erfasste Stunden',
      citiesWorldwide: 'Städte weltweit',
      howItWorks: 'SO FUNKTIONIERT ES',
      journeyToImpact: 'Ihre Reise zur Wirkung',
      journeySubtitle: 'Eine Plattform, die entwickelt wurde, um Ihren Beitrag zur Gemeinschaft zu verstärken',
      discoverMissions: 'Missionen entdecken',
      discoverMissionsDesc: 'Finden Sie bedeutungsvolle Freiwilligenmöglichkeiten, die zu Ihrer Leidenschaft passen',
      trackProgress: 'Fortschritt verfolgen',
      trackProgressDesc: 'Überwachen Sie Ihre Freiwilligenstunden und sehen Sie, wie Ihre Wirkung wächst',
      earnRecognition: 'Anerkennung verdienen',
      earnRecognitionDesc: 'Erhalten Sie Abzeichen und Zertifikate für Ihre Beiträge',
      buildNetwork: 'Netzwerk aufbauen',
      buildNetworkDesc: 'Verbinden Sie sich mit gleichgesinnten Freiwilligen und Organisationen',
      testimonialsLabel: 'ERFAHRUNGSBERICHTE',
      successStoriesTitle: 'Geschichten der Wirkung',
      successStoriesSubtitle: 'Echte Geschichten von Freiwilligen und Organisationen, die weltweit einen Unterschied machen',
      scrollLabel: 'SCROLLEN',
      hoursStats: 'Stunden',
      missionsStats: 'Missionen',
      volunteersStats: 'Freiwillige',
      projectsStats: 'Projekte',
      globalImpactTitle: 'Unsere globale Wirkung',
      globalImpactSubtitle: 'Gemeinsam schaffen wir bedeutungsvolle Veränderungen auf der ganzen Welt',
      activeCommunitiesTitle: 'Aktive Gemeinschaften weltweit',
      northAmerica: 'Nordamerika',
      europe: 'Europa',
      asiaPacific: 'Asien-Pazifik',
      latinAmerica: 'Lateinamerika',
      africaMiddleEast: 'Afrika & Naher Osten',
      africa: 'Afrika',
      middleEast: 'Naher Osten',
      sdgTitle: 'Beitrag zu den UN-Nachhaltigkeitszielen',
      sdgSubtitle: 'Unsere Missionen sind auf globale Bemühungen ausgerichtet, eine bessere Welt zu schaffen',
      noPoverty: 'Keine Armut',
      zeroHunger: 'Kein Hunger',
      goodHealth: 'Gesundheit und Wohlbefinden',
      qualityEducation: 'Hochwertige Bildung',
      reducedInequalities: 'Weniger Ungleichheiten',
      sustainableCities: 'Nachhaltige Städte',
      climateAction: 'Klimaschutz',
      partnerships: 'Partnerschaften',
      readyToImpact: 'Bereit, Wirkung zu erzielen?',
      readyToImpactSubtitle: 'Schließen Sie sich über 150.000 Freiwilligen und 500+ Organisationen an, die positive Veränderungen in Gemeinschaften weltweit schaffen. Ihre Reise beginnt heute.',
      startVolunteeringToday: 'Heute mit der Freiwilligenarbeit beginnen',
      registerNGO: 'Ihre Organisation registrieren',
      freeToJoin: 'Kostenlose Teilnahme',
      noCommitments: 'Keine Verpflichtungen',
      startImpactImmediately: 'Sofort Wirkung erzielen',
      footerTagline: 'Freiwillige weltweit stärken',
      footerCopyright: 'KindWorld. Alle Rechte vorbehalten.',
      ngoDashboardTitle: 'Organisations-Dashboard',
      ngoDashboardSubtitle: 'Freiwilligenaktivitäten erstellen, Zertifikate verwalten und Gemeinschaftsauswirkungen verfolgen',
      ngoActiveVolunteers: 'Aktive Freiwillige',
      ngoPublishedActivities: 'Veröffentlichte Aktivitäten',
      ngoCertificatesIssued: 'Ausgestellte Zertifikate',
      ngoTotalImpactHours: 'Gesamte Wirkungsstunden',
      createNewActivity: 'Neue Aktivität erstellen',
      publishVolunteerOpportunities: 'Freiwilligenmöglichkeiten für die Gemeinschaft veröffentlichen',
      createActivity: 'Aktivität erstellen',
      manageCertificatesTitle: 'Zertifikate verwalten',
      createPublishCertificates: 'Zertifikate für Freiwillige erstellen und veröffentlichen',
      allHoursVerified: 'Alle Freiwilligenstunden wurden verifiziert!',
      pendingStatus: 'Ausstehend',
      viewAll: 'Alle anzeigen',
      noActivitiesYet: 'Noch keine Aktivitäten veröffentlicht. Erstellen Sie Ihre erste Aktivität!',
      participantsLabel2: 'Teilnehmer',
      durationLabel: 'Dauer',
      upcomingStatus: 'Bevorstehend',
      completedStatus: 'Abgeschlossen',
      editLabel: 'Bearbeiten',
      issueCertificates: 'Zertifikate ausstellen',
      yourCertificates: 'Ihre Zertifikate',
      uploadCertificateBtn: 'Zertifikat hochladen',
      noCertificatesYet: 'Noch keine Zertifikate hochgeladen',
      uploadFirstCertificate: 'Laden Sie Ihr erstes Zertifikat hoch',
      issuedLabel: 'ausgestellt',
      publishLabel: 'Veröffentlichen',
      previewLabel: 'Vorschau',
      createNewVolunteerActivity: 'Neue Freiwilligenaktivität erstellen',
      activityTitle: 'Aktivitätstitel',
      activityTitlePlaceholder: 'z.B. Strandreinigungsinitiative',
      descriptionLabel: 'Beschreibung',
      descriptionPlaceholder: 'Beschreiben Sie die Freiwilligenaktivität und ihre Wirkung...',
      locationLabel: 'Standort',
      locationPlaceholder: 'z.B. Stadtpark, Berlin',
      dateLabel: 'Datum',
      durationHours: 'Dauer (Stunden)',
      maxParticipantsLabel: 'Max. Teilnehmer',
      categoryLabel: 'Kategorie',
      difficultyLabel: 'Schwierigkeit',
      categoryEnvironment: 'Umwelt',
      categoryCommunity: 'Gemeinschaft',
      categoryHealthcare: 'Gesundheit',
      categoryEducation: 'Bildung',
      categoryAnimals: 'Tiere',
      difficultyEasy: 'Einfach',
      difficultyMedium: 'Mittel',
      difficultyHard: 'Schwer',
      publishActivity: 'Aktivität veröffentlichen',
      organizationLabel: 'Organisation',
      studentLabel: 'Student',
      ngosLabel: 'Organisationen',
      participantListTitle: 'Teilnehmerliste',
      registeredParticipants: 'Registrierte Teilnehmer',
      noParticipantsYet: 'Noch keine Teilnehmer registriert.',
      closeLabel: 'Schließen',
      contactLabel: 'Kontakt',
      emergencyLabel: 'Notfall',
      adminDashboardTitle: 'Admin-Dashboard',
      adminDashboardSubtitle: 'Benutzer verwalten, Plattformaktivität überwachen und Freiwilligenprogramme beaufsichtigen',
      totalUsersLabel: 'Gesamte Benutzer',
      volunteersLabel2: 'Freiwillige',
      totalMissionsLabel: 'Gesamte Missionen',
      viewManageMissions: 'Alle Freiwilligenmissionen auf der Plattform anzeigen und verwalten',
      missionsCount: 'Missionen',
      volunteersCount: 'Freiwillige',
      addRemoveBadges: 'Abzeichen für Freiwillige als Anerkennung hinzufügen oder entfernen',
      badgesAvailable: 'verfügbare Abzeichen',
      openBadgeManager: 'Abzeichen-Manager öffnen',
      ngoApplications: 'Organisationsanträge',
      ngoApplicationsDesc: 'Registrierungsanfragen von Organisationen prüfen und genehmigen',
      pendingApplications: 'ausstehende Anträge',
      approveNGO: 'Genehmigen',
      rejectNGO: 'Ablehnen',
      ngoListTitle: 'Registrierte Organisationen',
      ngoListDesc: 'Alle genehmigten Organisationen auf der Plattform anzeigen',
      registeredNGOs: 'registrierte Organisationen',
      ngoName: 'Organisationsname',
      ngoEmail: 'E-Mail',
      ngoDescription: 'Beschreibung',
      ngoWebsite: 'Website',
      appliedOn: 'Beantragt am',
      approvedOn: 'Genehmigt am',
      noApplications: 'Keine ausstehenden Anträge',
      adminLabel: 'Admin',
      activeStatus: 'Aktiv',
      deleteLabel: 'Löschen',
      manageLabel: 'Verwalten',
      confirmDelete: 'Sind Sie sicher, dass Sie diese Mission löschen möchten?',
      backLabel: 'Zurück',
      detailsLabel: 'Details',
      totalHoursLabel: 'Gesamtstunden',
      missionsCompletedLabel: 'Missionen',
      badgesLabel: 'Abzeichen',
      orgsHelpedLabel: 'Unterstützte Orgs',
      roleLabel: 'Rolle',
      statusLabel: 'Status',
      joinDateLabel: 'Beitrittsdatum',
      ratingLabel: 'Bewertung',
      reportLabel: 'Bericht',
      volunteerActivityBreakdown: 'Ihre Freiwilligenaktivitätsaufschlüsselung',
      missionsCompleted: 'Abgeschlossene Missionen',
      missionTimeline: 'Missions-Timeline',
      myBadges: 'Meine Abzeichen',
      volunteerRole: 'Freiwilliger',
      uploadCertDescription: 'Laden Sie Ihr gestaltetes Zertifikat hoch, das Freiwillige nach Abschluss von Missionen erhalten',
      certificateNameOptional: 'Zertifikatsname (Optional)',
      badgeManagementCenter: 'Abzeichen-Verwaltungszentrum',
      badgeManagementDesc: 'Erfolgsabzeichen für Freiwillige freischalten und verwalten',
      selectUser: 'Benutzer auswählen',
      selectUserDesc: 'Einen Benutzer auswählen',
      selectUserDescLong: 'Wählen Sie einen Freiwilligen aus der Liste links, um seine Abzeichen zu verwalten',
      allBadgesTitle: 'Alle Abzeichen',
      clickToUnlockRemove: 'Zum Freischalten oder Entfernen klicken',
      clickToRemove: 'Zum Entfernen klicken',
      clickToUnlock: 'Zum Freischalten klicken',
      hoursUnit: 'Stunden',
      editUserTitle: 'Benutzer bearbeiten',
      fullNameLabel: 'Vollständiger Name',
      emailLabel: 'E-Mail-Adresse',
      volunteerHoursLabel: 'Freiwilligenstunden',
      userRoleLabel: 'Benutzerrolle',
      studentVolunteerRole: 'Student/Freiwilliger',
      platformAdmin: 'Plattform-Admin',
      saveLabel: 'Speichern',
      cancelLabel: 'Abbrechen',
      userUpdatedSuccess: 'Benutzer erfolgreich aktualisiert',
      profileUpdatedSuccess: 'Profil erfolgreich aktualisiert!',
      verifiedLabel: 'Verifiziert',
      cancelEditLabel: 'Bearbeitung abbrechen',
      totalHoursProfile: 'Gesamtstunden',
      activitiesCompleted: 'Abgeschlossene Aktivitäten',
      badgesEarned: 'Verdiente Abzeichen',
      organizationsHelpedProfile: 'Unterstützte Organisationen',
      cityPlaceholder: 'Berlin, Deutschland',
      backToDashboard: 'Zurück zum Dashboard',
      badgesDescription: 'Ihre Erfolge und Anerkennung',
      earnedLabel: 'Verdient',
      totalAvailable: 'Gesamt verfügbar',
      earnedBadgesTitle: 'Verdiente Abzeichen',
      earnedOn: 'Verdient am ',
      noBadgesYet: 'Sie haben noch keine Abzeichen verdient',
      noBadgesDesc: 'Schließen Sie Missionen ab und sammeln Sie Freiwilligenstunden, um Abzeichen freizuschalten!',
      allAvailableBadges: 'Alle verfügbaren Abzeichen',
      lockedLabel: 'Gesperrt',
      earnedBadgesLabel: 'Verdiente Abzeichen',
      manageBadgesBtn: 'Abzeichen verwalten',
      connectWithVolunteers: 'Mit anderen Freiwilligen verbinden',
      addFriend: 'Freund hinzufügen',
      searchFriendPlaceholder: 'Nach Name oder E-Mail suchen...',
      sendRequest: 'Anfrage senden',
      friendRequests: 'Freundschaftsanfragen',
      accept: 'Annehmen',
      decline: 'Ablehnen',
      myFriends: 'Meine Freunde',
      noFriendsYet: 'Noch keine Freunde',
      startConnecting: 'Beginnen Sie, sich mit anderen Freiwilligen zu verbinden!',
      pendingLabel: 'Ausstehend',
      removeFriend: 'Entfernen',
      pendingRequests: 'Ausstehende Anfragen',
      requestSent: 'Anfrage gesendet',
      cancelRequest: 'Abbrechen',
      userManagementTitle: 'Benutzerverwaltung',
      userManagementDesc: 'Alle registrierten Benutzer auf der Plattform anzeigen und verwalten',
      tableHeaderUser: 'Benutzer',
      tableHeaderRole: 'Rolle',
      tableHeaderHours: 'Stunden',
      tableHeaderMissions: 'Missionen',
      tableHeaderBadges: 'Abzeichen',
      tableHeaderStatus: 'Status',
      tableHeaderActions: 'Aktionen',
      roleStudentLabel: 'Student',
      roleNGOLabel: 'Organisation',
      roleAdminLabel: 'Admin',
      statusActive: 'Aktiv',
      statusVerified: 'Verifiziert',
      publishActivityBtn: 'Aktivität veröffentlichen',
      editMissionTitle: 'Mission bearbeiten',
      titleLabelForm: 'Titel',
      hoursLabelForm: 'Stunden',
      maxParticipantsForm: 'Max. Teilnehmer',
      categoryFormLabel: 'Kategorie',
      difficultyFormLabel: 'Schwierigkeit',
      saveChangesBtn: 'Änderungen speichern',
      certificateManagerTitle: 'Zertifikat-Manager',
      certificatesTitle: 'Zertifikate & Auszeichnungen',
      certificatesSubtitle: 'Beantragen Sie offizielle Zertifikate und Medaillen von Partnerorganisationen',
      personalInformation: 'Persönliche Informationen',
      languageSettings: 'Sprache',
      volunteerInterests: 'Freiwilligeninteressen',
      interestEnvironment: 'Umwelt',
      interestEducation: 'Bildung',
      interestHealthcare: 'Gesundheit',
      interestCommunity: 'Gemeinschaft',
      interestAnimals: 'Tiere',
      interestElderlyCare: 'Seniorenbetreuung',
      interestYouthPrograms: 'Jugendprogramme',
      interestFoodSecurity: 'Ernährungssicherheit',
      requiredHoursLabel: 'Erforderliche Stunden',
      yourProgressLabel: 'Ihr Fortschritt',
      signInFooterTagline: 'Gemeinschaften durch mitfühlendes Handeln stärken',
      signInFooterCopyright: '© 2026 KindWorld. Alle Rechte vorbehalten.',
      noCertificatesUploadedYet: 'Noch keine Zertifikate hochgeladen. Laden Sie Ihr erstes Zertifikat oben hoch!',
      noCertificatesAvailableYet: 'Noch keine Zertifikate verfügbar. Schauen Sie später wieder vorbei!',
      transportOwn: 'Eigener Transport',
      transportCarpool: 'Mitfahrgelegenheit benötigt',
      transportPublic: 'Öffentliche Verkehrsmittel',
      selectRegion: 'Region auswählen',
      selectLanguage: 'Sprache auswählen',
      nearbyMissions: 'Mein Standort',
      findMissions: 'Missionen suchen',
      allRegions: 'Alle Regionen',
      allCountries: 'Alle Länder',
      regionSetup: 'Profil einrichten',
      regionSetupDesc: 'Helfen Sie uns, Freiwilligenmöglichkeiten in Ihrer Nähe zu finden',
      yourRegion: 'Ihre Region',
      yourCountry: 'Ihr Land',
      preferredLanguage: 'Bevorzugte Sprache',
      continueSetup: 'Weiter',
      skipForNow: 'Vorerst überspringen'
    }
  }

  const t = (key: string): string => {
    const lang = localTranslations[language]
    const translation = lang?.[key]
    // Fallback to English if translation not found in current language
    if (!translation) {
      return localTranslations.en?.[key] || key
    }
    return translation
  }

  const joinMission = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId)
    const isCurrentlyJoined = mission?.joined || false

    setMissions(prev => {
      const updated = prev.map(m => {
        if (m.id === missionId) {
          const newParticipantCount = m.joined ? m.currentParticipants - 1 : m.currentParticipants + 1
          return {
            ...m,
            joined: !m.joined,
            currentParticipants: newParticipantCount,
            participants: `${newParticipantCount}/${m.maxParticipants}`
          }
        }
        return m
      })
      localStorage.setItem('kindworld_missions', JSON.stringify(updated))
      return updated
    })

    if (mission && !isCurrentlyJoined && user) {
      // Add registration record
      setMissionRegistrations(prev => [...prev, {
        missionId,
        volunteer: { id: user.id, name: user.name, email: user.email },
        registrationData: missionRegistration
      }])
      setNotifications(prev => [...prev, `Successfully joined "${mission.title}"! 🎉`])
    } else if (mission && isCurrentlyJoined && user) {
      // Remove registration record
      setMissionRegistrations(prev => prev.filter(r => !(r.missionId === missionId && r.volunteer.id === user.id)))
      setNotifications(prev => [...prev, `Left "${mission.title}"`])
    }
  }

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notifications])

  const performSignIn = (role?: 'student' | 'ngo' | 'admin') => {
    const signInRole = role || selectedRole
    setIsLoading(true)
    setTimeout(() => {
      const userEmail = signInRole === 'student' ? 'alex.chen@gmail.com' :
               signInRole === 'ngo' ? 'admin@redcross.org' : 'admin@kindworld.com'

      // Check if user exists in allUsers to get their badges
      const existingUser = allUsers.find((u: any) => u.email === userEmail)

      const userData: User = {
        id: existingUser?.id || `user_${Date.now()}`,
        name: signInRole === 'student' ? 'Alex Chen' :
              signInRole === 'ngo' ? 'Red Cross International' : 'System Administrator',
        role: signInRole,
        hours: signInRole === 'student' ? 610 : signInRole === 'ngo' ? 2100 : 0,
        email: userEmail,
        avatar: signInRole === 'student' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' :
                signInRole === 'ngo' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face' :
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        joinDate: '2025-08-15',
        badges: [
          { id: 'b1', name: 'Community Champion', icon: '🏆', earnedDate: '2025-12-01', company: 'KindWorld' },
          { id: 'b2', name: 'Environmental Hero', icon: '🌱', earnedDate: '2025-11-15', company: 'Green Earth' },
          { id: 'b3', name: 'Education Supporter', icon: '📚', earnedDate: '2025-10-20', company: 'UNICEF' }
        ],
        userBadges: existingUser?.userBadges || [
          { id: 'b1', name: 'Community Champion', icon: '🏆', earnedDate: '2025-12-01', company: 'KindWorld' },
          { id: 'b2', name: 'Environmental Hero', icon: '🌱', earnedDate: '2025-11-15', company: 'Green Earth' },
          { id: 'b3', name: 'Education Supporter', icon: '📚', earnedDate: '2025-10-20', company: 'UNICEF' }
        ],
        completedMissions: signInRole === 'student' ? 23 : signInRole === 'ngo' ? 67 : 0,
        organizationsHelped: signInRole === 'student' ? 12 : signInRole === 'ngo' ? 35 : 0,
        rating: signInRole === 'student' ? 4.9 : signInRole === 'ngo' ? 4.8 : 5.0
      }

      setUser(userData)
      setSelectedRole(signInRole)
      // Sync user hours into allUsers to keep data consistent
      setAllUsers((prev: any[]) => prev.map((u: any) =>
        u.email === userData.email ? { ...u, hours: userData.hours, completedMissions: userData.completedMissions } : u
      ))
      setIsLoading(false)
      setCurrentPage('dashboard')
      setNotifications(['Welcome to KindWorld! 🎉', 'Your profile has been created successfully.'])

      // Show region setup for first-time volunteers (students)
      if (signInRole === 'student') {
        const savedRegion = localStorage.getItem('kindworld_user_region')
        if (!savedRegion) {
          setShowRegionSetup(true)
        } else {
          setUserRegion(savedRegion)
        }
      }
    }, 1500)
  }

  // Admin credentials (in a real app these would be server-side)
  const adminCredentials = [
    { email: 'admin@kindworld.com', password: 'admin123' }
  ]

  const ngoCredentials = [
    { email: 'admin@redcross.org', password: 'ngo123' }
  ]

  const handleSignIn = () => {
    if (!signInForm.email.trim() || !signInForm.password.trim()) {
      setSignInError(t('pleaseFillAllFields') || 'Please enter your email and password')
      return
    }

    const emailLower = signInForm.email.trim().toLowerCase()

    // Check if trying to log in as admin — only accessible via credentials
    const adminMatch = adminCredentials.find(c => c.email === emailLower)
    if (adminMatch) {
      if (signInForm.password === adminMatch.password) {
        setSignInError('')
        performSignIn('admin')
      } else {
        setSignInError(t('invalidCredentials') || 'Invalid email or password')
      }
      return
    }

    // Check if trying to log in as NGO via credentials
    const ngoMatch = ngoCredentials.find(c => c.email === emailLower)
    if (ngoMatch) {
      if (signInForm.password === ngoMatch.password) {
        setSignInError('')
        performSignIn('ngo')
      } else {
        setSignInError(t('invalidCredentials') || 'Invalid email or password')
      }
      return
    }

    // Regular sign-in (volunteer/NGO based on selected role)
    setSignInError('')
    performSignIn()
  }

  const handleSocialSignIn = () => {
    setSignInError('')
    performSignIn()
  }

  // Sample user data for admin dashboard
  const defaultAllUsers = [
    {
      id: 'user_001',
      name: 'Alex Chen',
      role: 'student' as const,
      email: 'alex.chen@gmail.com',
      hours: 610,
      joinDate: '2025-08-15',
      status: 'active',
      completedMissions: 23,
      badges: 8,
      userBadges: [
        { id: 'b1', name: 'Community Champion', icon: '🏆', earnedDate: '2025-12-01', company: 'KindWorld' },
        { id: 'b2', name: 'Environmental Hero', icon: '🌱', earnedDate: '2025-11-15', company: 'Green Earth' },
        { id: 'b3', name: 'Education Supporter', icon: '📚', earnedDate: '2025-10-20', company: 'UNICEF' }
      ]
    },
    {
      id: 'user_002',
      name: 'Sarah Johnson',
      role: 'student' as const,
      email: 'sarah.j@gmail.com',
      hours: 342,
      joinDate: '2025-09-02',
      status: 'active',
      completedMissions: 15,
      badges: 5,
      userBadges: [
        { id: 'b9', name: 'Rising Star', icon: '🌟', earnedDate: '2025-09-10', company: 'KindWorld' },
        { id: 'b2', name: 'Environmental Hero', icon: '🌱', earnedDate: '2025-10-05', company: 'Green Earth' }
      ]
    },
    {
      id: 'user_003',
      name: 'Red Cross International',
      role: 'ngo' as const,
      email: 'admin@redcross.org',
      hours: 2100,
      joinDate: '2025-07-10',
      status: 'verified',
      completedMissions: 67,
      badges: 12,
      userBadges: []
    },
    {
      id: 'user_004',
      name: 'Michael Rodriguez',
      role: 'student' as const,
      email: 'mike.r@gmail.com',
      hours: 189,
      joinDate: '2025-10-20',
      status: 'active',
      completedMissions: 8,
      badges: 3,
      userBadges: [
        { id: 'b9', name: 'Rising Star', icon: '🌟', earnedDate: '2025-10-25', company: 'KindWorld' }
      ]
    },
    {
      id: 'user_005',
      name: 'UNICEF Foundation',
      role: 'ngo' as const,
      email: 'contact@unicef.org',
      hours: 1850,
      joinDate: '2025-06-25',
      status: 'verified',
      completedMissions: 45,
      badges: 10,
      userBadges: []
    }
  ]

  const [allUsers, setAllUsers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindworld_allusers')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Merge with defaultAllUsers to update stale values (e.g. hours)
          return parsed.map((u: any) => {
            const defaultUser = defaultAllUsers.find((d: any) => d.email === u.email)
            if (defaultUser) {
              return { ...u, hours: defaultUser.hours, completedMissions: defaultUser.completedMissions }
            }
            return u
          })
        } catch (e) {
          return defaultAllUsers
        }
      }
    }
    return defaultAllUsers
  })

  // Save allUsers to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kindworld_allusers', JSON.stringify(allUsers))
    }
  }, [allUsers])

  // Sync current user's badges from allUsers when allUsers changes (for when admin updates badges)
  useEffect(() => {
    if (user && allUsers.length > 0) {
      const updatedUserData = allUsers.find((u: any) => u.id === user.id || u.email === user.email)
      if (updatedUserData && updatedUserData.userBadges) {
        // Only update if badges have changed
        const currentBadges = JSON.stringify(user.userBadges || [])
        const newBadges = JSON.stringify(updatedUserData.userBadges || [])
        if (currentBadges !== newBadges) {
          setUser(prev => prev ? { ...prev, userBadges: updatedUserData.userBadges } : null)
        }
      }
    }
  }, [allUsers])

  // Pending NGO applications for admin approval
  const [pendingNGOs, setPendingNGOs] = useState<{id: number, name: string, email: string, organization: string, description: string, website?: string, status: 'pending' | 'approved' | 'rejected', appliedDate: string}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindworld_pending_ngos')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          return [
            { id: 1, name: 'Green Earth Foundation', email: 'contact@greenearth.org', organization: 'Green Earth Foundation', description: 'Environmental conservation and tree planting initiatives across Southeast Asia', website: 'https://greenearth.org', status: 'pending', appliedDate: '2026-01-28' },
            { id: 2, name: 'Youth Empowerment Network', email: 'info@youthempowerment.org', organization: 'Youth Empowerment Network', description: 'Education and skills training for underprivileged youth', website: 'https://youthempowerment.org', status: 'pending', appliedDate: '2026-01-30' },
            { id: 3, name: 'Compassion Care', email: 'admin@compassioncare.org', organization: 'Compassion Care', description: 'Healthcare support and elderly care services', status: 'pending', appliedDate: '2026-02-01' }
          ]
        }
      }
    }
    return [
      { id: 1, name: 'Green Earth Foundation', email: 'contact@greenearth.org', organization: 'Green Earth Foundation', description: 'Environmental conservation and tree planting initiatives across Southeast Asia', website: 'https://greenearth.org', status: 'pending', appliedDate: '2026-01-28' },
      { id: 2, name: 'Youth Empowerment Network', email: 'info@youthempowerment.org', organization: 'Youth Empowerment Network', description: 'Education and skills training for underprivileged youth', website: 'https://youthempowerment.org', status: 'pending', appliedDate: '2026-01-30' },
      { id: 3, name: 'Compassion Care', email: 'admin@compassioncare.org', organization: 'Compassion Care', description: 'Healthcare support and elderly care services', status: 'pending', appliedDate: '2026-02-01' }
    ]
  })

  // Save pendingNGOs to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kindworld_pending_ngos', JSON.stringify(pendingNGOs))
    }
  }, [pendingNGOs])

  // Full year data (12 months) - for demo users with existing hours
  const yearlyDataFull = [
    { month: 'Feb 2025', shortMonth: 'Feb', hours: 22, missions: [{ name: 'New Year Cleanup', hours: 12, date: '2025-02-05' }, { name: 'Winter Food Drive', hours: 10, date: '2025-02-15' }], totalMissions: 2, organizations: ['Clean City', 'Food Bank'] },
    { month: 'Mar 2025', shortMonth: 'Mar', hours: 28, missions: [{ name: 'Valentine Care', hours: 15, date: '2025-03-10' }, { name: 'Animal Shelter', hours: 13, date: '2025-03-20' }], totalMissions: 2, organizations: ['Love Foundation', 'Happy Paws'] },
    { month: 'Apr 2025', shortMonth: 'Apr', hours: 35, missions: [{ name: 'Spring Planting', hours: 18, date: '2025-04-08' }, { name: 'River Cleanup', hours: 17, date: '2025-04-22' }], totalMissions: 2, organizations: ['Green Earth', 'Water Watch'] },
    { month: 'May 2025', shortMonth: 'May', hours: 42, missions: [{ name: 'Earth Day Event', hours: 22, date: '2025-05-22' }, { name: 'School Support', hours: 20, date: '2025-05-15' }], totalMissions: 2, organizations: ['Earth Alliance', 'Education First'] },
    { month: 'Jun 2025', shortMonth: 'Jun', hours: 48, missions: [{ name: 'Community Garden', hours: 25, date: '2025-06-10' }, { name: 'Senior Visit', hours: 23, date: '2025-06-25' }], totalMissions: 2, organizations: ['Green Community', 'Elder Care'] },
    { month: 'Jul 2025', shortMonth: 'Jul', hours: 32, missions: [{ name: 'Summer Camp', hours: 18, date: '2025-07-08' }, { name: 'Beach Cleanup', hours: 14, date: '2025-07-22' }], totalMissions: 2, organizations: ['Youth First', 'Ocean Care'] },
    { month: 'Aug 2025', shortMonth: 'Aug', hours: 38, missions: [{ name: 'Beach Cleanup', hours: 15, date: '2025-08-05' }, { name: 'Food Bank Help', hours: 12, date: '2025-08-15' }, { name: 'Tree Planting', hours: 11, date: '2025-08-28' }], totalMissions: 3, organizations: ['Ocean Care', 'City Food Bank', 'Green Earth'] },
    { month: 'Sep 2025', shortMonth: 'Sep', hours: 45, missions: [{ name: 'Senior Care Visit', hours: 18, date: '2025-09-03' }, { name: 'Animal Shelter', hours: 14, date: '2025-09-12' }, { name: 'Community Garden', hours: 13, date: '2025-09-25' }], totalMissions: 3, organizations: ['Elder Care', 'Happy Paws', 'Green Community'] },
    { month: 'Oct 2025', shortMonth: 'Oct', hours: 62, missions: [{ name: 'Education Support', hours: 25, date: '2025-10-08' }, { name: 'Homeless Outreach', hours: 20, date: '2025-10-18' }, { name: 'Park Restoration', hours: 17, date: '2025-10-29' }], totalMissions: 3, organizations: ['Learn Together', 'Hope Center', 'City Parks'] },
    { month: 'Nov 2025', shortMonth: 'Nov', hours: 78, missions: [{ name: 'Blood Drive Support', hours: 28, date: '2025-11-05' }, { name: 'Library Program', hours: 22, date: '2025-11-15' }, { name: 'Youth Mentoring', hours: 28, date: '2025-11-28' }], totalMissions: 3, organizations: ['Red Cross', 'Public Library', 'Youth First'] },
    { month: 'Dec 2025', shortMonth: 'Dec', hours: 85, missions: [{ name: 'Thanksgiving Drive', hours: 32, date: '2025-12-10' }, { name: 'Winter Clothing', hours: 28, date: '2025-12-20' }, { name: 'Hospital Visit', hours: 25, date: '2025-12-28' }], totalMissions: 3, organizations: ['Food Network', 'Warm Hearts', 'City Hospital'] },
    { month: 'Jan 2026', shortMonth: 'Jan', hours: 95, missions: [{ name: 'Holiday Toy Drive', hours: 35, date: '2026-01-08' }, { name: 'Soup Kitchen', hours: 30, date: '2026-01-15' }, { name: 'New Year Cleanup', hours: 30, date: '2026-01-20' }], totalMissions: 3, organizations: ['Toys for All', 'Community Kitchen', 'Clean City'] }
  ]

  // All-time data (by year)
  const allTimeData = [
    { month: '2022', shortMonth: '2022', hours: 120, missions: [], totalMissions: 12, organizations: [] },
    { month: '2023', shortMonth: '2023', hours: 280, missions: [], totalMissions: 28, organizations: [] },
    { month: '2024', shortMonth: '2024', hours: 420, missions: [], totalMissions: 42, organizations: [] },
    { month: '2025', shortMonth: '2025', hours: 610, missions: [], totalMissions: 61, organizations: [] }
  ]

  // Empty chart data for new users
  const emptyChartData = [
    { month: 'Aug 2025', shortMonth: 'Aug', hours: 0, missions: [], totalMissions: 0, organizations: [] },
    { month: 'Sep 2025', shortMonth: 'Sep', hours: 0, missions: [], totalMissions: 0, organizations: [] },
    { month: 'Oct 2025', shortMonth: 'Oct', hours: 0, missions: [], totalMissions: 0, organizations: [] },
    { month: 'Nov 2025', shortMonth: 'Nov', hours: 0, missions: [], totalMissions: 0, organizations: [] },
    { month: 'Dec 2025', shortMonth: 'Dec', hours: 0, missions: [], totalMissions: 0, organizations: [] },
    { month: 'Jan 2026', shortMonth: 'Jan', hours: 0, missions: [], totalMissions: 0, organizations: [] }
  ]

  // Last 6 months data
  const monthlyData = yearlyDataFull.slice(-6)

  // Get chart data based on selected time period and user hours
  const getChartData = () => {
    // For new users with 0 hours, show empty chart
    if (user && user.hours === 0) {
      return emptyChartData
    }
    switch (chartTimePeriod) {
      case 'year':
        return yearlyDataFull
      case 'allTime':
        return allTimeData
      default:
        return monthlyData
    }
  }

  const chartData = getChartData()

  // Default missions data
  const defaultMissions: Mission[] = [
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
      joined: false,
      region: 'NA'
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
      joined: true,
      region: 'SEA'
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
      joined: false,
      region: 'EU'
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
      joined: false,
      region: 'EA'
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
      joined: false,
      region: 'SEA'
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
      joined: false,
      region: 'OC'
    },
    {
      id: 7,
      title: 'Bali Beach Conservation',
      description: 'Help protect Bali\'s beautiful coastline by removing plastic waste and educating tourists about marine conservation.',
      location: 'Kuta Beach, Bali, Indonesia',
      date: '2025-02-05',
      hours: 4,
      participants: '32/50',
      maxParticipants: 50,
      currentParticipants: 32,
      category: 'Environment',
      difficulty: 'Easy',
      organizer: 'Bali Green Foundation',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop',
      joined: false,
      region: 'SEA'
    },
    {
      id: 8,
      title: 'Tokyo Elderly Care Visit',
      description: 'Spend time with elderly residents in Tokyo nursing homes, sharing conversations and activities to combat loneliness.',
      location: 'Shibuya Senior Center, Tokyo',
      date: '2025-02-10',
      hours: 3,
      participants: '18/30',
      maxParticipants: 30,
      currentParticipants: 18,
      category: 'Healthcare',
      difficulty: 'Easy',
      organizer: 'Japan Volunteer Network',
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=250&fit=crop',
      joined: false,
      region: 'EA'
    },
    {
      id: 9,
      title: 'Bangkok Street Food Distribution',
      description: 'Help prepare and distribute meals to homeless individuals in Bangkok\'s urban areas.',
      location: 'Khao San Road, Bangkok',
      date: '2025-02-12',
      hours: 4,
      participants: '25/40',
      maxParticipants: 40,
      currentParticipants: 25,
      category: 'Community',
      difficulty: 'Medium',
      organizer: 'Thailand Care Foundation',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop',
      joined: false,
      region: 'SEA'
    },
    {
      id: 10,
      title: 'Jakarta Youth Coding Workshop',
      description: 'Teach basic programming skills to underprivileged children in Jakarta to help bridge the digital divide.',
      location: 'Jakarta Digital Hub',
      date: '2025-02-15',
      hours: 5,
      participants: '40/60',
      maxParticipants: 60,
      currentParticipants: 40,
      category: 'Education',
      difficulty: 'Medium',
      organizer: 'Indonesia Digital Future',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop',
      joined: false,
      region: 'SEA'
    }
  ]

  // Load missions from localStorage or use defaults
  const [missions, setMissions] = useState<Mission[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindworld_missions')
      console.log('Loading missions from localStorage:', saved ? 'found' : 'not found', saved ? JSON.parse(saved).length + ' missions' : '')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          console.log('Parsed missions:', parsed.length)
          return parsed
        } catch (e) {
          console.error('Error parsing missions:', e)
          return defaultMissions
        }
      }
    }
    return defaultMissions
  })

  // Save missions to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Saving missions to localStorage:', missions.length, 'missions')
      localStorage.setItem('kindworld_missions', JSON.stringify(missions))
    }
  }, [missions])

  // Reload missions from localStorage when user logs in or page changes (to sync between NGO and student accounts)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindworld_missions')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          console.log('Reloading missions on user/page change:', parsed.length, 'missions', 'currentPage:', currentPage)
          // Force update missions from localStorage to ensure sync between different user roles
          setMissions(parsed)
        } catch (e) {
          console.error('Error reloading missions:', e)
        }
      }
    }
  }, [user, currentPage])

  // Also reload when specifically going to missions page or dashboard to ensure fresh data
  useEffect(() => {
    if ((currentPage === 'missions' || currentPage === 'dashboard') && typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindworld_missions')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          console.log('Reloading missions for', currentPage, 'page:', parsed.length, 'missions')
          setMissions(parsed)
        } catch (e) {
          console.error('Error reloading missions for', currentPage, 'page:', e)
        }
      }
      // Also reload all users for admin dashboard
      const savedUsers = localStorage.getItem('kindworld_allusers')
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers)
          console.log('Reloading users for', currentPage, 'page:', parsedUsers.length, 'users')
          setAllUsers(parsedUsers)
        } catch (e) {
          console.error('Error reloading users:', e)
        }
      }
    }
  }, [currentPage])

  // Listen for localStorage changes from other tabs (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kindworld_missions' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          console.log('Missions updated from another tab:', parsed.length, 'missions')
          setMissions(parsed)
        } catch (error) {
          console.error('Error parsing missions from storage event:', error)
        }
      }
      if (e.key === 'kindworld_allusers' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          console.log('Users updated from another tab:', parsed.length, 'users')
          setAllUsers(parsed)
        } catch (error) {
          console.error('Error parsing users from storage event:', error)
        }
      }
      if (e.key === 'kindworld_registrations' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          console.log('Registrations updated from another tab:', parsed.length, 'registrations')
          setMissionRegistrations(parsed)
        } catch (error) {
          console.error('Error parsing registrations from storage event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Save registrations to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kindworld_registrations', JSON.stringify(missionRegistrations))
    }
  }, [missionRegistrations])

  // Reload registrations from localStorage when user logs in or page changes (to sync between accounts)
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindworld_registrations')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          console.log('Reloading registrations on user/page change:', parsed.length, 'registrations')
          setMissionRegistrations(parsed)
        } catch (e) {
          console.error('Error reloading registrations:', e)
        }
      }
    }
  }, [user, currentPage])

  // Sync user badges from allUsers when going to badges or profile page
  useEffect(() => {
    if (user && (currentPage === 'badges' || currentPage === 'profile') && typeof window !== 'undefined') {
      const savedUsers = localStorage.getItem('kindworld_allusers')
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers)
          const currentUserData = parsedUsers.find((u: any) => u.id === user.id || u.email === user.email)
          if (currentUserData && currentUserData.userBadges) {
            const currentBadges = JSON.stringify(user.userBadges || [])
            const newBadges = JSON.stringify(currentUserData.userBadges || [])
            if (currentBadges !== newBadges) {
              console.log('Syncing user badges from allUsers:', currentUserData.userBadges.length, 'badges')
              setUser(prev => prev ? { ...prev, userBadges: currentUserData.userBadges } : null)
              // Also update kindworld_user in localStorage
              const savedUser = localStorage.getItem('kindworld_user')
              if (savedUser) {
                const parsedUser = JSON.parse(savedUser)
                parsedUser.userBadges = currentUserData.userBadges
                localStorage.setItem('kindworld_user', JSON.stringify(parsedUser))
              }
            }
          }
        } catch (e) {
          console.error('Error syncing user badges:', e)
        }
      }
    }
  }, [currentPage, user?.id])

  // Save friends to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kindworld_friends', JSON.stringify(friends))
    }
  }, [friends])

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
      earnedDate: '2025-10-25'
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
      earnedDate: '2025-11-15'
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
      earnedDate: '2025-11-25'
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
      earnedDate: '2025-10-25'
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
      earnedDate: '2025-11-30'
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
      earnedDate: '2025-12-10'
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

  // Landing Page with Carousel
  if (currentPage === 'landing') {
    return (
      <div style={{
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #c7d2fe 100%)'
      }}>
        {/* Navigation Bar */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '16px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
              }}>
                <span style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>K</span>
              </div>
              <span style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.02em', color: '#1f2937' }}>KindWorld</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  appearance: 'none',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '10px 36px 10px 14px',
                  fontSize: '14px',
                  color: '#4b5563',
                  cursor: 'pointer',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '16px',
                  transition: 'all 0.2s ease'
                }}
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code}>{lang.flag} {lang.name}</option>
                ))}
              </select>
              <button
                onClick={() => setCurrentPage('signin')}
                style={{
                  color: '#4b5563',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#6366f1'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
              >
                {t('signIn')}
              </button>
              <button
                onClick={() => setCurrentPage('signin')}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.45)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.35)'
                }}
              >
                {t('getStarted')}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section with Carousel */}
        <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          {heroImages.map((image, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: index === currentSlide ? 1 : 0,
                zIndex: index === currentSlide ? 10 : 0
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${image.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 10s ease-out',
                  transform: index === currentSlide ? 'scale(1.02)' : 'scale(1.15)'
                }}
              />
              {/* Dark gradient overlay for text readability */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)'
                }}
              />
            </div>
          ))}

          <div style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            zIndex: 20
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px', width: '100%' }}>
              <div style={{ maxWidth: '720px', position: 'relative' }}>
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: index === currentSlide ? 1 : 0,
                      transform: index === currentSlide ? 'translateY(0)' : 'translateY(40px)',
                      position: index === currentSlide ? 'relative' : 'absolute',
                      inset: index === currentSlide ? 'auto' : 0,
                      pointerEvents: index === currentSlide ? 'auto' : 'none'
                    }}
                  >
                    {/* Small label */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      padding: '8px 16px',
                      borderRadius: '100px',
                      marginBottom: '24px'
                    }}>
                      <span style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'white', letterSpacing: '0.5px' }}>
                        {t('volunteerPlatform')}
                      </span>
                    </div>
                    <h1 style={{
                      fontSize: 'clamp(42px, 6vw, 68px)',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '20px',
                      lineHeight: '1.1',
                      letterSpacing: '-0.03em',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)'
                    }}>
                      {t(`heroTitle${index + 1}`)}
                    </h1>
                    <p style={{
                      fontSize: 'clamp(17px, 1.8vw, 20px)',
                      color: 'white',
                      marginBottom: '40px',
                      fontWeight: '400',
                      lineHeight: '1.7',
                      maxWidth: '540px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.4), 0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                      {t(`heroSubtitle${index + 1}`)}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setCurrentPage('signin')}
                        style={{
                          padding: '16px 36px',
                          background: 'white',
                          color: '#6366f1',
                          border: 'none',
                          borderRadius: '14px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '15px',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)'
                          e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.2)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        {t('startVolunteering')}
                      </button>
                      <button
                        onClick={() => setCurrentPage('learnmore')}
                        style={{
                          padding: '16px 36px',
                          background: 'rgba(255,255,255,0.15)',
                          color: 'white',
                          border: '2px solid rgba(255,255,255,0.4)',
                          borderRadius: '14px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '15px',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                        }}
                      >
                        {t('learnMore')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '48px',
            display: 'flex',
            gap: '10px',
            zIndex: 30
          }}>
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  height: '4px',
                  width: index === currentSlide ? '40px' : '24px',
                  background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '48px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '13px',
            fontWeight: '500',
            letterSpacing: '0.5px'
          }}>
            <span>{t('scrollLabel')}</span>
            <div style={{
              width: '20px',
              height: '32px',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '6px'
            }}>
              <div style={{
                width: '3px',
                height: '8px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '100px',
                animation: 'float 2s ease-in-out infinite'
              }} />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ background: 'white', padding: '100px 48px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px'
            }}>
              {[
                { value: '10K+', labelKey: 'activeVolunteersLabel', icon: '👥' },
                { value: '250+', labelKey: 'partnerNGOsLabel', icon: '🏢' },
                { value: '100K+', labelKey: 'hoursLoggedLabel', icon: '⏰' },
                { value: '50+', labelKey: 'citiesWorldwide', icon: '🌍' }
              ].map((stat, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  padding: '40px 24px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '24px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.15)'
                  e.currentTarget.style.borderColor = '#c7d2fe'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{stat.icon}</div>
                  <div style={{
                    fontSize: '42px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px',
                    letterSpacing: '-0.02em'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features-section" style={{ padding: '120px 48px', position: 'relative', overflow: 'hidden' }}>
          {/* Background image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&q=80&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 27, 75, 0.92))' }} />

          <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '8px 16px',
                borderRadius: '100px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#c4b5fd', letterSpacing: '1px' }}>{t('howItWorks')}</span>
              </div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                {t('journeyToImpact')}
              </h2>
              <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '400', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
                {t('journeySubtitle')}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[
                { icon: '🎯', titleKey: 'discoverMissions', descKey: 'discoverMissionsDesc' },
                { icon: '⏱️', titleKey: 'trackProgress', descKey: 'trackProgressDesc' },
                { icon: '🏆', titleKey: 'earnRecognition', descKey: 'earnRecognitionDesc' },
                { icon: '🤝', titleKey: 'buildNetwork', descKey: 'buildNetworkDesc' }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '24px',
                  padding: '40px 32px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 25px 60px -12px rgba(0, 0, 0, 0.3)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                }}
                >
                  {/* Number indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    <span style={{ fontSize: '32px' }}>{feature.icon}</span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>{t(feature.titleKey)}</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '15px' }}>{t(feature.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section style={{ padding: '120px 48px', background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '8px 16px',
                borderRadius: '100px',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1', letterSpacing: '1px' }}>{t('testimonialsLabel')}</span>
              </div>
              <h2 style={{ fontSize: '44px', fontWeight: '700', color: '#1f2937', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                {t('successStoriesTitle')}
              </h2>
              <p style={{ fontSize: '18px', color: '#64748b', fontWeight: '400', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
                {t('successStoriesSubtitle')}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {[
                {
                  name: 'Maria Santos',
                  role: 'Volunteer',
                  location: 'Manila, Philippines',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
                  quote: 'KindWorld helped me find my purpose. In just 6 months, I\'ve contributed 200+ hours to environmental causes.',
                  hours: 245,
                  missions: 12
                },
                {
                  name: 'Ocean Conservation',
                  role: 'NGO Partner',
                  location: 'Sydney, Australia',
                  image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150&h=150&fit=crop',
                  quote: 'We\'ve connected with 500+ dedicated volunteers who\'ve helped us clean 15km of coastline.',
                  volunteers: 523,
                  projects: 28
                },
                {
                  name: 'Chen Wei',
                  role: 'Volunteer',
                  location: 'Singapore',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                  quote: 'Earning badges and seeing my impact grow has made volunteering an exciting part of my routine.',
                  hours: 180,
                  missions: 8
                }
              ].map((story, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '36px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.15)'
                  e.currentTarget.style.borderColor = '#c7d2fe'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}
                >
                  {/* Quote icon */}
                  <div style={{
                    fontSize: '48px',
                    color: '#c7d2fe',
                    marginBottom: '16px',
                    lineHeight: 1,
                    fontFamily: 'Georgia, serif'
                  }}>"</div>
                  <p style={{
                    color: '#4b5563',
                    fontSize: '17px',
                    lineHeight: '1.8',
                    marginBottom: '32px',
                    fontWeight: '400',
                    flex: 1
                  }}>{story.quote}</p>

                  {/* Author info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <img
                      src={story.image}
                      alt={story.name}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #e0e7ff'
                      }}
                    />
                    <div>
                      <h4 style={{ fontSize: '17px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{story.name}</h4>
                      <p style={{ fontSize: '14px', color: '#6366f1', margin: '4px 0 0 0', fontWeight: '500' }}>{story.role}</p>
                      <p style={{ fontSize: '13px', color: '#9ca3af', margin: '2px 0 0 0' }}>{story.location}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                    {story.hours && (
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{story.hours}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', letterSpacing: '0.5px' }}>{t('hoursStats')}</div>
                      </div>
                    )}
                    {story.missions && (
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{story.missions}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', letterSpacing: '0.5px' }}>{t('missionsStats')}</div>
                      </div>
                    )}
                    {story.volunteers && (
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{story.volunteers}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', letterSpacing: '0.5px' }}>{t('volunteersStats')}</div>
                      </div>
                    )}
                    {story.projects && (
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{story.projects}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', letterSpacing: '0.5px' }}>{t('projectsStats')}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Impact Statistics Section */}
        <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '300', marginBottom: '16px' }}>
                {t('globalImpactTitle')}
              </h2>
              <p style={{ fontSize: '20px', fontWeight: '300', maxWidth: '672px', margin: '0 auto', opacity: 0.8 }}>
                {t('globalImpactSubtitle')}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '64px' }}>
              {[
                { value: '2.5M+', labelKey: 'volunteerHoursLogged', icon: '⏱️', descKey: 'hoursLoggedDesc' },
                { value: '150K+', labelKey: 'treesPlanted', icon: '🌳', descKey: 'treesPlantedDesc' },
                { value: '500K+', labelKey: 'mealsServed', icon: '🍲', descKey: 'mealsServedDesc' },
                { value: '85+', labelKey: 'countriesReached', icon: '🌍', descKey: 'countriesDesc' }
              ].map((stat, index) => (
                <div key={index} style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '32px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{stat.icon}</div>
                  <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: '600', marginBottom: '8px', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>{t(stat.labelKey)}</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>{t(stat.descKey)}</div>
                </div>
              ))}
            </div>

            {/* World Map Representation */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '500', marginBottom: '32px' }}>
                {t('activeCommunitiesTitle')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
                {[
                  { regionKey: 'northAmerica', volunteers: '28,500+', countries: 'USA, Canada, Mexico' },
                  { regionKey: 'europe', volunteers: '35,200+', countries: 'UK, Germany, France, +15' },
                  { regionKey: 'asiaPacific', volunteers: '52,800+', countries: 'Japan, Singapore, Australia, +20' },
                  { regionKey: 'latinAmerica', volunteers: '18,900+', countries: 'Brazil, Argentina, Chile, +12' },
                  { regionKey: 'africaMiddleEast', volunteers: '14,600+', countries: 'Kenya, UAE, South Africa, +18' }
                ].map((region, index) => (
                  <div key={index} style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '28px', fontWeight: '600', color: '#60a5fa', marginBottom: '8px' }}>{region.volunteers}</div>
                    <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>{t(region.regionKey)}</div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>{region.countries}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SDG Alignment Section */}
        <section style={{ padding: '96px 24px', background: '#f8fafc' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '300', color: '#1f2937', marginBottom: '16px' }}>
                {t('sdgTitle')}
              </h2>
              <p style={{ fontSize: '18px', color: '#4b5563', fontWeight: '300', maxWidth: '672px', margin: '0 auto' }}>
                {t('sdgSubtitle')}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
              {[
                { num: 1, nameKey: 'noPoverty', color: '#e5243b' },
                { num: 2, nameKey: 'zeroHunger', color: '#dda63a' },
                { num: 3, nameKey: 'goodHealth', color: '#4c9f38' },
                { num: 4, nameKey: 'qualityEducation', color: '#c5192d' },
                { num: 10, nameKey: 'reducedInequalities', color: '#dd1367' },
                { num: 11, nameKey: 'sustainableCities', color: '#fd9d24' },
                { num: 13, nameKey: 'climateAction', color: '#3f7e44' },
                { num: 17, nameKey: 'partnerships', color: '#19486a' }
              ].map((sdg, index) => (
                <div key={index} style={{
                  background: sdg.color,
                  color: 'white',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ fontSize: '20px', fontWeight: '700' }}>{sdg.num}</span>
                  <span>{t(sdg.nameKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section style={{ padding: '120px 24px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', position: 'relative', overflow: 'hidden' }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: '-50%', left: '-25%', width: '50%', height: '200%', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'rotate(-15deg)' }}></div>
          <div style={{ position: 'absolute', bottom: '-50%', right: '-25%', width: '50%', height: '200%', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'rotate(15deg)' }}></div>

          <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '300', marginBottom: '24px', lineHeight: '1.2' }}>
              {t('readyToImpact')}
            </h2>
            <p style={{ fontSize: '22px', marginBottom: '48px', fontWeight: '300', lineHeight: '1.6', opacity: 0.9 }}>
              {t('readyToImpactSubtitle')}
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentPage('signin')}
                style={{
                  padding: '20px 48px',
                  background: 'white',
                  color: '#3b82f6',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '600',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0,0,0,0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.25)'
                }}
              >
                {t('startVolunteeringToday')}
              </button>
              <button
                onClick={() => setCurrentPage('signin')}
                style={{
                  padding: '20px 48px',
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#3b82f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'white'
                }}
              >
                {t('registerNGO')}
              </button>
            </div>
            <p style={{ marginTop: '32px', fontSize: '14px', opacity: 0.8 }}>
              ✓ {t('freeToJoin')} &nbsp;&nbsp; ✓ {t('noCommitments')} &nbsp;&nbsp; ✓ {t('startImpactImmediately')}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#111827', color: '#9ca3af', padding: '48px 24px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>K</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: '300', color: 'white' }}>KindWorld</span>
            </div>
            <p style={{ fontSize: '14px', marginBottom: '24px' }}>{t('footerTagline')}</p>
            <p style={{ fontSize: '12px' }}>© 2026 {t('footerCopyright')}</p>
          </div>
        </footer>
      </div>
    )
  }

  // Learn More Page
  if (currentPage === 'learnmore') {
    const testimonials = [
      {
        name: 'Maria Santos',
        role: 'Community Volunteer',
        location: 'Manila, Philippines',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        quote: 'KindWorld transformed how I give back. In just 6 months, I connected with 12 different organizations and logged over 200 volunteer hours. The platform made it so easy to find meaningful causes near me.',
        hours: 247,
        missions: 34
      },
      {
        name: 'James Okonkwo',
        role: 'Youth Leader',
        location: 'Lagos, Nigeria',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        quote: 'As a youth leader, I was looking for ways to engage my community. KindWorld helped me organize clean-up drives and education programs that reached over 500 young people in our neighborhood.',
        hours: 312,
        missions: 28
      },
      {
        name: 'Emma Lindström',
        role: 'Environmental Activist',
        location: 'Stockholm, Sweden',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        quote: 'The badge system keeps me motivated! I have earned 15 certificates and connected with environmental NGOs across Scandinavia. It is amazing to see my impact visualized.',
        hours: 189,
        missions: 22
      },
      {
        name: 'Carlos Mendoza',
        role: 'Medical Volunteer',
        location: 'Mexico City, Mexico',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        quote: 'Through KindWorld, I found medical outreach programs in underserved communities. The hour tracking helped me fulfill my residency requirements while making a real difference.',
        hours: 420,
        missions: 45
      },
      {
        name: 'Aisha Rahman',
        role: 'Education Volunteer',
        location: 'Kuala Lumpur, Malaysia',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        quote: 'I have been tutoring refugee children through missions I found on KindWorld. The platform connected me with three amazing NGOs working on education access.',
        hours: 156,
        missions: 18
      },
      {
        name: 'David Chen',
        role: 'Tech Volunteer',
        location: 'Sydney, Australia',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        quote: 'As a software developer, I wanted to use my skills for good. KindWorld helped me find organizations that needed tech support, from building websites to teaching coding.',
        hours: 283,
        missions: 31
      }
    ]

    const ngoTestimonials = [
      {
        name: 'Ocean Conservation Alliance',
        type: 'Environmental NGO',
        location: 'Sydney, Australia',
        logo: '🌊',
        quote: 'KindWorld helped us recruit over 2,000 volunteers for our beach cleanup initiatives across 15 coastal cities. The platform streamlined our volunteer management significantly.',
        volunteers: 2400,
        missions: 156
      },
      {
        name: 'Education for All Foundation',
        type: 'Education NGO',
        location: 'Nairobi, Kenya',
        logo: '📚',
        quote: 'We have seen a 300% increase in volunteer engagement since joining KindWorld. The platform makes it easy to post missions and track volunteer contributions.',
        volunteers: 1850,
        missions: 89
      },
      {
        name: 'Feeding Hope Network',
        type: 'Humanitarian NGO',
        location: 'São Paulo, Brazil',
        logo: '🍲',
        quote: 'Managing volunteers across 50 food distribution centers was challenging until we found KindWorld. Now we can coordinate efforts seamlessly and measure our impact.',
        volunteers: 3200,
        missions: 245
      }
    ]

    const impactStats = [
      { value: '2.5M+', labelKey: 'volunteerHoursLogged', icon: '⏱️', descKey: 'hoursLoggedDesc' },
      { value: '150K+', labelKey: 'treesPlanted', icon: '🌳', descKey: 'treesPlantedDesc' },
      { value: '500K+', labelKey: 'mealsServed', icon: '🍽️', descKey: 'mealsServedDesc' },
      { value: '85+', labelKey: 'countriesReached', icon: '🌍', descKey: 'countriesDesc' },
      { value: '50K+', labelKey: 'activeVolunteersLabel', icon: '👥', descKey: 'activeVolunteersDesc' },
      { value: '1,200+', labelKey: 'partnerNGOs', icon: '🤝', descKey: 'partnerNGOsDesc' }
    ]

    const sdgGoals = [
      { number: 1, nameKey: 'noPoverty', color: '#E5243B', missions: 1240 },
      { number: 2, nameKey: 'zeroHunger', color: '#DDA63A', missions: 2350 },
      { number: 3, nameKey: 'goodHealth', color: '#4C9F38', missions: 1890 },
      { number: 4, nameKey: 'qualityEducation', color: '#C5192D', missions: 3200 },
      { number: 10, nameKey: 'reducedInequalities', color: '#DD1367', missions: 980 },
      { number: 11, nameKey: 'sustainableCities', color: '#FD9D24', missions: 1560 },
      { number: 13, nameKey: 'climateAction', color: '#3F7E44', missions: 2100 },
      { number: 17, nameKey: 'partnerships', color: '#19486A', missions: 890 }
    ]

    const regions = [
      { nameKey: 'asiaPacific', volunteers: '18,500+', countries: 24, flag: '🌏' },
      { nameKey: 'europe', volunteers: '12,300+', countries: 28, flag: '🇪🇺' },
      { nameKey: 'northAmerica', volunteers: '9,800+', countries: 3, flag: '🌎' },
      { nameKey: 'latinAmerica', volunteers: '6,200+', countries: 18, flag: '🌎' },
      { nameKey: 'africa', volunteers: '4,100+', countries: 15, flag: '🌍' },
      { nameKey: 'middleEast', volunteers: '2,400+', countries: 8, flag: '🌍' }
    ]

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #c7d2fe 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {/* Navigation with Back Button */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '16px 24px'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setCurrentPage('landing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4f46e5',
                fontSize: '15px',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f0f0ff'}
              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
            >
              <span style={{ fontSize: '20px' }}>←</span>
              {t('backToHome')}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>K</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: '300', color: '#1f2937' }}>KindWorld</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Language Selector */}
              <div style={{ position: 'relative' }}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    appearance: 'none',
                    background: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 32px 8px 12px',
                    fontSize: '14px',
                    color: '#4b5563',
                    cursor: 'pointer',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '16px'
                  }}
                >
                  {Object.entries(languages).map(([code, lang]) => (
                    <option key={code} value={code}>{lang.flag} {lang.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setCurrentPage('signin')}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
              >
                {t('joinNow')}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={{
          paddingTop: '120px',
          paddingBottom: '80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
            <h1 style={{
              fontSize: '56px',
              fontWeight: '300',
              color: '#1f2937',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              {t('discoverImpact').split(' ').slice(0, -2).join(' ')} <span style={{ fontWeight: '600', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('discoverImpact').split(' ').slice(-2).join(' ')}</span>
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.7',
              fontWeight: '300'
            }}>
              {t('discoverImpactSubtitle')}
            </p>
          </div>
        </section>

        {/* Impact Statistics */}
        <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '300', color: 'white', textAlign: 'center', marginBottom: '16px' }}>
              {t('ourGlobalImpact')}
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
              {t('realNumbers')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
              {impactStats.map((stat, index) => (
                <div key={index} style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'transform 0.3s ease, background 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '36px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>{stat.value}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t(stat.labelKey)}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{t(stat.descKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Presence */}
        <section style={{ padding: '80px 24px', background: 'white' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '300', color: '#1f2937', textAlign: 'center', marginBottom: '16px' }}>
              {t('activeInWorld')}
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '48px' }}>
              {t('communitySpans')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {regions.map((region, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  borderRadius: '16px',
                  padding: '28px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{region.flag}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>{t(region.nameKey)}</h3>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5', marginBottom: '4px' }}>{region.volunteers}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{t('volunteersIn')} {region.countries} {t('countries')}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer Testimonials */}
        <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '300', color: '#1f2937', textAlign: 'center', marginBottom: '16px' }}>
              {t('voicesFromCommunity')}
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '48px' }}>
              {t('realStoriesVolunteers')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    fontSize: '120px',
                    color: 'rgba(79, 70, 229, 0.05)',
                    fontFamily: 'Georgia, serif',
                    pointerEvents: 'none'
                  }}>"</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e0e7ff' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{testimonial.name}</h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>{testimonial.role}</p>
                      <p style={{ fontSize: '13px', color: '#9ca3af' }}>📍 {testimonial.location}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px', fontStyle: 'italic' }}>
                    "{testimonial.quote}"
                  </p>
                  <div style={{ display: 'flex', gap: '24px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5' }}>{testimonial.hours}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('hours')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#7c3aed' }}>{testimonial.missions}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('missionsLabel')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NGO Testimonials */}
        <section style={{ padding: '80px 24px', background: 'white' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '300', color: '#1f2937', textAlign: 'center', marginBottom: '16px' }}>
              {t('trustedByOrganizations')}
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '48px' }}>
              {t('ngosUseKindWorld')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              {ngoTestimonials.map((ngo, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  borderRadius: '24px',
                  padding: '32px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px'
                    }}>
                      {ngo.logo}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{ngo.name}</h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>{ngo.type}</p>
                      <p style={{ fontSize: '13px', color: '#9ca3af' }}>📍 {ngo.location}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>
                    "{ngo.quote}"
                  </p>
                  <div style={{ display: 'flex', gap: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5' }}>{ngo.volunteers.toLocaleString()}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('volunteersLabel')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#7c3aed' }}>{ngo.missions}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('missionsPosted')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SDG Alignment */}
        <section style={{ padding: '80px 24px', background: 'white' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '300', color: '#1f2937', textAlign: 'center', marginBottom: '16px' }}>
              {t('alignedWithSDG')}
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '48px', maxWidth: '700px', margin: '0 auto 48px' }}>
              {t('sdgDescription')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              {sdgGoals.map((goal, index) => (
                <div key={index} style={{
                  background: goal.color,
                  borderRadius: '16px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = `0 12px 30px ${goal.color}40`
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{goal.number}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'white', marginBottom: '12px', lineHeight: '1.3' }}>{t(goal.nameKey)}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>{goal.missions.toLocaleString()} {t('missionsLabel')}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{
          padding: '100px 24px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1000px',
            height: '1000px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '48px', fontWeight: '300', color: 'white', marginBottom: '24px' }}>
              {t('readyToMakeMark')}
            </h2>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', lineHeight: '1.7' }}>
              {t('joinThousands')}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentPage('signin')}
                style={{
                  padding: '18px 48px',
                  background: 'white',
                  color: '#4f46e5',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                {t('startVolunteeringBtn')}
              </button>
              <button
                onClick={() => setCurrentPage('signin')}
                style={{
                  padding: '18px 48px',
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#4f46e5'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'white'
                }}
              >
                {t('registerYourNGO')}
              </button>
            </div>
            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{t('trustedBy')}</div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: 'white' }}>50,000+ {t('volunteers')}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{t('partneredWith')}</div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: 'white' }}>1,200+ NGOs</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{t('activeIn')}</div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: 'white' }}>85+ {t('countries')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.6)', padding: '48px 24px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>K</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: '300', color: 'white' }}>KindWorld</span>
            </div>
            <p style={{ fontSize: '14px', marginBottom: '24px' }}>{t('signInFooterTagline')}</p>
            <p style={{ fontSize: '12px' }}>{t('signInFooterCopyright')}</p>
          </div>
        </footer>
      </div>
    )
  }

  // Sign In / Register Page
  if (currentPage === 'signin') {
    const countries = [
      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
      'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
      'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
      'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (DRC)', 'Congo (Republic)',
      'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
      'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
      'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
      'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
      'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
      'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
      'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
      'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
      'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
      'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
      'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
      'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
      'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
      'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
      'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
      'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ]

    const handleRegister = () => {
      if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password) {
        alert('Please fill in all required fields')
        return
      }
      if (registerForm.password !== registerForm.confirmPassword) {
        alert('Passwords do not match')
        return
      }
      if (registerForm.password.length < 8) {
        alert('Password must be at least 8 characters')
        return
      }
      // Check if email already exists
      const existingUser = allUsers.find((u: any) => u.email === registerForm.email)
      if (existingUser) {
        alert('An account with this email already exists')
        return
      }
      // Simulate registration
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        const newUserId = `user_${Date.now()}`
        const newUserData: User = {
          id: newUserId,
          name: `${registerForm.firstName} ${registerForm.lastName}`,
          role: selectedRole,
          hours: 0,
          email: registerForm.email,
          avatar: `https://ui-avatars.com/api/?name=${registerForm.firstName}+${registerForm.lastName}&background=4f46e5&color=fff`,
          joinDate: new Date().toISOString().split('T')[0],
          badges: [],
          userBadges: [],
          completedMissions: 0,
          organizationsHelped: 0,
          rating: 0
        }
        setUser(newUserData)
        // Add the new user to allUsers so admin dashboard can see them
        setAllUsers((prev: any[]) => {
          const updated = [...prev, {
            id: newUserId,
            name: newUserData.name,
            role: newUserData.role,
            email: newUserData.email,
            hours: 0,
            joinDate: newUserData.joinDate,
            status: 'active',
            completedMissions: 0,
            badges: 0,
            userBadges: [],
            avatar: newUserData.avatar,
            phone: registerForm.phone,
            residency: registerForm.residency,
            country: registerForm.country
          }]
          localStorage.setItem('kindworld_allusers', JSON.stringify(updated))
          return updated
        })
        setCurrentPage('dashboard')
        setNotifications(['Welcome to KindWorld! 🎉', 'Your account has been created successfully.'])
        setRegisterForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          residency: '',
          country: ''
        })
      }, 1500)
    }

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #c7d2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '-20%',
          width: '60%',
          height: '80%',
          background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-20%',
          width: '60%',
          height: '80%',
          background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Back button */}
        <button
          onClick={() => setCurrentPage('landing')}
          style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '10px 20px',
            color: '#4b5563',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f9fafb'
            e.currentTarget.style.borderColor = '#c7d2fe'
            e.currentTarget.style.color = '#6366f1'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.color = '#4b5563'
          }}
        >
          <span style={{ fontSize: '18px' }}>←</span>
          {t('backLabel')}
        </button>

        {/* Language Selector */}
        <div style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          zIndex: 10
        }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              appearance: 'none',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '10px 40px 10px 16px',
              fontSize: '14px',
              color: '#4b5563',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            {Object.entries(languages).map(([code, lang]) => (
              <option key={code} value={code}>{lang.flag} {lang.name}</option>
            ))}
          </select>
        </div>

        <div style={{
          maxWidth: authMode === 'register' ? '520px' : '440px',
          width: '100%',
          background: 'white',
          padding: '48px 40px',
          borderRadius: '28px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 25px 80px rgba(99, 102, 241, 0.12)',
          transition: 'max-width 0.3s ease',
          position: 'relative',
          zIndex: 5
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)'
            }}>
              <span style={{ color: 'white', fontSize: '26px', fontWeight: '700' }}>K</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {authMode === 'signin' ? t('welcomeBackTitle') : t('createAccount')}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              {authMode === 'signin' ? t('signInToContinue') : t('joinKindWorld')}
            </p>
          </div>

          {/* Language Selector */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                appearance: 'none',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '10px 36px 10px 14px',
                fontSize: '14px',
                color: '#4b5563',
                cursor: 'pointer',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              {Object.entries(languages).map(([code, lang]) => (
                <option key={code} value={code}>{lang.flag} {lang.name}</option>
              ))}
            </select>
          </div>

          {/* Role Selection */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ marginBottom: '12px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>{t('selectRole')}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {(['student', 'ngo'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  style={{
                    flex: 1,
                    padding: '14px 8px',
                    border: selectedRole === role ? '2px solid #6366f1' : '1px solid #e5e7eb',
                    background: selectedRole === role ? '#eef2ff' : 'white',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    fontSize: '13px',
                    fontWeight: selectedRole === role ? '600' : '500',
                    color: selectedRole === role ? '#6366f1' : '#6b7280'
                  }}
                >
                  {role === 'student' ? `👤 ${t('roleVolunteer')}` : `🏢 ${t('roleNGO')}`}
                </button>
              ))}
            </div>
          </div>

          {authMode === 'signin' ? (
            <>
              {/* Error Message */}
              {signInError && (
                <div style={{
                  padding: '12px 16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: '#dc2626', fontSize: '14px' }}>⚠</span>
                  <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>{signInError}</span>
                </div>
              )}

              {/* Username/Email Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {t('emailOrUsername')}
                </label>
                <input
                  type="text"
                  value={signInForm.email}
                  onChange={(e) => { setSignInForm(prev => ({ ...prev, email: e.target.value })); setSignInError('') }}
                  placeholder="Enter your email or username"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: signInError && !signInForm.email.trim() ? '1px solid #fca5a5' : '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    background: '#f9fafb',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = signInError && !signInForm.email.trim() ? '#fca5a5' : '#e5e7eb'
                    e.target.style.background = '#f9fafb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={signInForm.password}
                  onChange={(e) => { setSignInForm(prev => ({ ...prev, password: e.target.value })); setSignInError('') }}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: signInError && !signInForm.password.trim() ? '1px solid #fca5a5' : '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    background: '#f9fafb',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = signInError && !signInForm.password.trim() ? '#fca5a5' : '#e5e7eb'
                    e.target.style.background = '#f9fafb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <a href="#" style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#4f46e5'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6366f1'}
                  >{t('forgotPassword')}</a>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 30px rgba(99, 102, 241, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.45)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.35)'
                }}
              >
                {isLoading && (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                )}
                {isLoading ? t('signIn') + '...' : t('signIn')}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '28px 0', gap: '16px' }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>{t('orSignInWith')}</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              </div>

              {/* Social Login Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                <button
                  onClick={handleSocialSignIn}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f9fafb'
                    e.currentTarget.style.borderColor = '#c7d2fe'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  onClick={handleSocialSignIn}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#000',
                    border: '1px solid #000',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#1f2937'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#000'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Apple
                </button>
              </div>

              {/* Sign Up Link */}
              <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                {t('noAccount')}{' '}
                <a
                  href="#"
                  style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onClick={(e) => {
                    e.preventDefault()
                    setAuthMode('register')
                    setSignInError('')
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#4f46e5'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6366f1'}
                >
                  {t('registerNow')}
                </a>
              </p>
            </>
          ) : (
            <>
              {/* Registration Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {/* First Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {t('firstName')} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      background: '#f9fafb',
                      color: '#1f2937'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1'
                      e.target.style.background = 'white'
                      e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.background = '#f9fafb'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {t('lastName')} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      background: '#f9fafb',
                      color: '#1f2937'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1'
                      e.target.style.background = 'white'
                      e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.background = '#f9fafb'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {t('emailAddress')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    background: '#f9fafb',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.background = '#f9fafb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {t('phoneNumber')}
                </label>
                <input
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    background: '#f9fafb',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.background = '#f9fafb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Country & Residency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {t('country')}
                  </label>
                  <select
                    value={registerForm.country}
                    onChange={(e) => setRegisterForm({ ...registerForm, country: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      background: '#f9fafb',
                      color: '#1f2937',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" style={{ background: 'white' }}>{t('selectCountry')}</option>
                    {countries.map((country) => (
                      <option key={country} value={country} style={{ background: 'white' }}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {t('cityResidency')}
                  </label>
                  <input
                    type="text"
                    placeholder="Jakarta"
                    value={registerForm.residency}
                    onChange={(e) => setRegisterForm({ ...registerForm, residency: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      background: '#f9fafb',
                      color: '#1f2937'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1'
                      e.target.style.background = 'white'
                      e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.background = '#f9fafb'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {t('password')} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder={t('minCharacters')}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      background: '#f9fafb',
                      color: '#1f2937'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1'
                      e.target.style.background = 'white'
                      e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.background = '#f9fafb'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {t('confirmPassword')} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder={t('confirmPassword')}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      background: '#f9fafb',
                      color: '#1f2937'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1'
                      e.target.style.background = 'white'
                      e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.background = '#f9fafb'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              {/* Terms Agreement */}
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="terms"
                  style={{
                    marginTop: '2px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#6366f1'
                  }}
                />
                <label htmlFor="terms" style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                  {t('agreeTerms')}{' '}
                  <a href="#" style={{ color: '#6366f1', textDecoration: 'none' }}>{t('termsOfService')}</a>
                  {' '}{t('and')}{' '}
                  <a href="#" style={{ color: '#6366f1', textDecoration: 'none' }}>{t('privacyPolicy')}</a>
                </label>
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isLoading ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.5)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.4)'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    {t('creatingAccount')}
                  </>
                ) : (
                  t('createAccount')
                )}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '28px 0', gap: '16px' }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>{t('orRegisterWith')}</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              </div>

              {/* Social Registration Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.borderColor = '#6366f1'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.1)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f9fafb'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#1f2937',
                    border: '1px solid #1f2937',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#374151'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#1f2937'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Apple
                </button>
              </div>

              {/* Sign In Link */}
              <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                {t('alreadyHaveAccount')}{' '}
                <a
                  href="#"
                  style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onClick={(e) => {
                    e.preventDefault()
                    setAuthMode('signin')
                    setSignInError('')
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#4f46e5'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6366f1'}
                >
                  {t('signIn')}
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  // Main App (Dashboard, Missions, etc.)
  if (user) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        {/* Navigation */}
        <nav style={{
          background: 'white',
          padding: '16px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.35)'
            }}>
              K
            </div>
            <h1 style={{
              margin: 0,
              color: '#1f2937',
              fontSize: '22px',
              fontWeight: '600',
              letterSpacing: '-0.02em'
            }}>
              {t('title')}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {(() => {
                // Show different navigation items based on user role
                if (user?.role === 'ngo') {
                  return ['dashboard', 'missions', 'certificates', 'profile']
                }
                if (user?.role === 'admin') {
                  return ['dashboard', 'missions', 'certificates', 'profile']
                }
                // Volunteer/student gets full navigation
                return ['dashboard', 'missions', 'badges', 'certificates', 'friends', 'profile']
              })().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as any)}
                  style={{
                    padding: '10px 20px',
                    background: currentPage === page
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'transparent',
                    color: currentPage === page ? 'white' : '#6b7280',
                    border: currentPage === page ? 'none' : '1px solid transparent',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                    outline: 'none',
                    boxShadow: currentPage === page ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.background = '#f3f4f6'
                      e.currentTarget.style.color = '#374151'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#6b7280'
                    }
                  }}
                >
                  {t(page)}
                </button>
              ))}
            </div>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                appearance: 'none',
                padding: '10px 36px 10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                background: '#f9fafb',
                color: '#374151',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '16px'
              }}
            >
              {Object.entries(languages).map(([code, lang]) => (
                <option key={code} value={code} style={{ background: 'white' }}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            {/* Divider */}
            <div style={{ width: '1px', height: '32px', background: '#e5e7eb' }} />

            {/* User Profile & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {user.name.charAt(0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{user.name}</span>
                  <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                    {user.role === 'student' ? 'Volunteer' : user.role.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setUser(null); setCurrentPage('landing') }}
                style={{
                  padding: '10px 18px',
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#fee2e2'
                  e.currentTarget.style.borderColor = '#fca5a5'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#fef2f2'
                  e.currentTarget.style.borderColor = '#fecaca'
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

        <div style={{ padding: '32px 24px', maxWidth: '100%', margin: '0 auto' }}>
          {/* Dashboard */}
          {currentPage === 'dashboard' && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              {user.role === 'admin' ? (
                // Admin Dashboard
                <div>
                  <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)'
                      }}>
                        ⚙️
                      </div>
                      <div>
                        <h2 style={{
                          fontSize: '36px',
                          fontWeight: '700',
                          color: '#1f2937',
                          margin: 0,
                          letterSpacing: '-0.5px'
                        }}>
                          {t('adminDashboardTitle')}
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0, marginTop: '4px' }}>
                          {t('adminDashboardSubtitle')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                    {[
                      { value: allUsers.length, label: t('totalUsersLabel'), icon: '👥', color: '#4f46e5', bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' },
                      { value: allUsers.filter((u: any) => u.role === 'student').length, label: t('volunteersLabel2'), icon: '🎓', color: '#059669', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' },
                      { value: allUsers.filter((u: any) => u.role === 'ngo').length, label: t('ngosLabel'), icon: '🏢', color: '#d97706', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
                      { value: missions.length, label: t('totalMissionsLabel'), icon: '📋', color: '#dc2626', bg: 'linear-gradient(135deg, #fef2f2, #fecaca)' }
                    ].map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'white',
                          padding: '36px',
                          borderRadius: '24px',
                          textAlign: 'center',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)'
                          e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)'
                        }}
                      >
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: stat.bg,
                          borderRadius: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 24px auto',
                          fontSize: '40px'
                        }}>
                          {stat.icon}
                        </div>
                        <div style={{ fontSize: '44px', fontWeight: '700', color: stat.color, marginBottom: '8px', letterSpacing: '-1px' }}>
                          {stat.value.toLocaleString()}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Admin Quick Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
                    {/* Mission Management */}
                    <div style={{
                      background: 'white',
                      padding: '36px',
                      borderRadius: '24px',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)'
                    }}
                    >
                      <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        marginBottom: '20px'
                      }}>
                        📋
                      </div>
                      <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
                        {t('allMissions')}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
                        {t('viewManageMissions')}
                      </p>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                        📊 {missions.length} {t('missionsCount')} | 👥 {missions.reduce((sum, m) => sum + m.currentParticipants, 0)} {t('volunteersCount')}
                      </div>
                    </div>

                    {/* Badge Management */}
                    <div
                      onClick={() => setCurrentPage('badgeManagement')}
                      style={{
                        background: 'white',
                        padding: '36px',
                        borderRadius: '24px',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)'
                        e.currentTarget.style.transform = 'translateY(-4px)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        marginBottom: '20px'
                      }}>
                        🏅
                      </div>
                      <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
                        {t('manageBadges')}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
                        {t('addRemoveBadges')}
                      </p>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                        🏆 12 {t('badgesAvailable')}
                      </div>
                      <div style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        {t('openBadgeManager')} →
                      </div>
                    </div>
                  </div>

                  {/* NGO Applications Section */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '24px',
                    marginBottom: '24px'
                  }}>
                    {/* Pending NGO Applications Card */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      padding: '28px',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px'
                        }}>
                          📝
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontWeight: '700', color: '#1f2937', fontSize: '18px' }}>
                            {t('ngoApplications')}
                          </h4>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
                            {pendingNGOs.filter(n => n.status === 'pending').length} {t('pendingApplications')}
                          </p>
                        </div>
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                        {t('ngoApplicationsDesc')}
                      </p>

                      {pendingNGOs.filter(n => n.status === 'pending').length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                          ✅ {t('noApplications')}
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                          {pendingNGOs.filter(n => n.status === 'pending').map((ngo) => (
                            <div key={ngo.id} style={{
                              padding: '16px',
                              background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                              borderRadius: '12px',
                              border: '1px solid rgba(251, 191, 36, 0.3)'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div>
                                  <h5 style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '15px' }}>
                                    {ngo.organization}
                                  </h5>
                                  <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '12px' }}>
                                    {ngo.email}
                                  </p>
                                </div>
                                <span style={{ fontSize: '11px', color: '#92400e', background: 'rgba(251, 191, 36, 0.3)', padding: '4px 8px', borderRadius: '6px' }}>
                                  {t('appliedOn')}: {ngo.appliedDate}
                                </span>
                              </div>
                              <p style={{ margin: '8px 0', color: '#4b5563', fontSize: '13px', lineHeight: '1.5' }}>
                                {ngo.description}
                              </p>
                              {ngo.website && (
                                <p style={{ margin: '4px 0 12px', color: '#667eea', fontSize: '12px' }}>
                                  🌐 {ngo.website}
                                </p>
                              )}
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => {
                                    setPendingNGOs(prev => prev.map(n =>
                                      n.id === ngo.id ? { ...n, status: 'approved' } : n
                                    ))
                                    // Add to allUsers as NGO
                                    const newNGOUser = {
                                      id: allUsers.length + 1,
                                      name: ngo.organization,
                                      email: ngo.email,
                                      role: 'ngo',
                                      hours: 0,
                                      missions: 0,
                                      rating: 5.0,
                                      userBadges: []
                                    }
                                    setAllUsers((prev: any[]) => {
                                      const updated = [...prev, newNGOUser]
                                      localStorage.setItem('kindworld_allusers', JSON.stringify(updated))
                                      return updated
                                    })
                                    setNotifications(prev => [...prev, `✅ ${ngo.organization} has been approved!`])
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✓ {t('approveNGO')}
                                </button>
                                <button
                                  onClick={() => {
                                    setPendingNGOs(prev => prev.map(n =>
                                      n.id === ngo.id ? { ...n, status: 'rejected' } : n
                                    ))
                                    setNotifications(prev => [...prev, `❌ ${ngo.organization} application rejected`])
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✕ {t('rejectNGO')}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Registered NGOs Card */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      padding: '28px',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px'
                        }}>
                          🏢
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontWeight: '700', color: '#1f2937', fontSize: '18px' }}>
                            {t('ngoListTitle')}
                          </h4>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
                            {allUsers.filter((u: any) => u.role === 'ngo').length} {t('registeredNGOs')}
                          </p>
                        </div>
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                        {t('ngoListDesc')}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                        {allUsers.filter((u: any) => u.role === 'ngo').map((ngo: any) => (
                          <div key={ngo.id} style={{
                            padding: '14px 16px',
                            background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                            borderRadius: '10px',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <h5 style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
                                {ngo.name}
                              </h5>
                              <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '12px' }}>
                                {ngo.email}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '12px', color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px', fontWeight: '500' }}>
                                ✓ {t('activeStatus')}
                              </span>
                            </div>
                          </div>
                        ))}
                        {allUsers.filter((u: any) => u.role === 'ngo').length === 0 && (
                          <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                            No registered NGOs yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* All Missions Section for Admin */}
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
                        📋 {t('allMissions')} ({missions.length})
                      </h3>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      {missions.map((mission) => (
                        <div key={mission.id} style={{
                          padding: '20px',
                          background: 'white',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                          gap: '16px',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                              {mission.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>
                              📍 {mission.location} · 🏢 {mission.organizer}
                            </div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>
                              {mission.currentParticipants}/{mission.maxParticipants}
                            </div>
                            <div style={{ fontSize: '11px', color: '#718096' }}>{t('participantsLabel2')}</div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                              {mission.hours}h
                            </div>
                            <div style={{ fontSize: '11px', color: '#718096' }}>{t('durationLabel')}</div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: new Date(mission.date) > new Date() ? 'rgba(40, 167, 69, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                              color: new Date(mission.date) > new Date() ? '#28a745' : '#6b7280'
                            }}>
                              {new Date(mission.date) > new Date() ? t('upcomingStatus') : t('completedStatus')}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setMissions(prev => {
                                  const updated = prev.filter(m => m.id !== mission.id)
                                  localStorage.setItem('kindworld_missions', JSON.stringify(updated))
                                  return updated
                                })
                                setNotifications(prev => [...prev, `🗑️ Mission "${mission.title}" has been removed from the platform`])
                              }}
                              style={{
                                padding: '8px 16px',
                                background: 'rgba(220, 53, 69, 0.1)',
                                color: '#dc3545',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 53, 69, 0.15)'
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)'
                              }}
                            >
                              {t('removeMission')}
                            </button>
                          </div>
                        </div>
                      ))}
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
                        👤 {t('userManagementTitle')}
                      </h3>
                      <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
                        {t('userManagementDesc')}
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
                      <div>{t('tableHeaderUser')}</div>
                      <div>{t('tableHeaderRole')}</div>
                      <div>{t('tableHeaderHours')}</div>
                      <div>{t('tableHeaderMissions')}</div>
                      <div>{t('tableHeaderBadges')}</div>
                      <div>{t('tableHeaderStatus')}</div>
                      <div>{t('tableHeaderActions')}</div>
                    </div>

                    {/* Table Rows */}
                    {allUsers.map((userData: any) => (
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
                          {userData.role === 'student' ? `🎓 ${t('roleStudentLabel')}` :
                           userData.role === 'ngo' ? `🏢 ${t('roleNGOLabel')}` : `👑 ${t('roleAdminLabel')}`}
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
                          {userData.status === 'active' ? `✅ ${t('statusActive')}` : `⚡ ${t('statusVerified')}`}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setSelectedUserDetail(userData)
                              setShowUserDetailModal(true)
                            }}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(40, 167, 69, 0.1)',
                              color: '#28a745',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {t('detailsLabel')}
                          </button>
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
                            }}
                          >
                            {t('editUser')}
                          </button>
                          <button
                            onClick={() => {
                              setBadgeManagementUser(userData)
                              setCurrentPage('badgeManagement')
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
                            }}
                          >
                            {t('manageBadges')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : user.role === 'ngo' ? (
                // NGO Dashboard
                <div>
                  <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        boxShadow: '0 8px 24px rgba(5, 150, 105, 0.3)'
                      }}>
                        🏢
                      </div>
                      <div>
                        <h2 style={{
                          fontSize: '36px',
                          fontWeight: '700',
                          color: '#1f2937',
                          margin: 0,
                          letterSpacing: '-0.5px'
                        }}>
                          {t('ngoDashboardTitle')}
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0, marginTop: '4px' }}>
                          {t('ngoDashboardSubtitle')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* NGO Stats - Only show stats for this NGO's own missions */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                    {(() => {
                      // Filter missions to only include those created by this NGO
                      const ngoMissions = missions.filter(m => m.organizerId === user?.id)
                      return [
                        { value: ngoMissions.reduce((sum, m) => sum + m.currentParticipants, 0), label: t('ngoActiveVolunteers'), icon: '👥', color: '#4f46e5', bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' },
                        { value: ngoMissions.length, label: t('ngoPublishedActivities'), icon: '📋', color: '#059669', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' },
                        { value: Math.floor(ngoMissions.reduce((sum, m) => sum + m.currentParticipants, 0) * 0.7), label: t('ngoCertificatesIssued'), icon: '🏆', color: '#d97706', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
                        { value: ngoMissions.reduce((sum, m) => sum + (m.hours * m.currentParticipants), 0), label: t('ngoTotalImpactHours'), icon: '⏱️', color: '#dc2626', bg: 'linear-gradient(135deg, #fef2f2, #fecaca)' }
                      ]
                    })().map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'white',
                          padding: '36px',
                          borderRadius: '24px',
                          textAlign: 'center',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)'
                          e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)'
                        }}
                      >
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: stat.bg,
                          borderRadius: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 24px auto',
                          fontSize: '40px'
                        }}>
                          {stat.icon}
                        </div>
                        <div style={{ fontSize: '44px', fontWeight: '700', color: stat.color, marginBottom: '8px', letterSpacing: '-1px' }}>
                          {stat.value.toLocaleString()}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
                    {/* Create Activity */}
                    <div style={{
                      background: 'white',
                      padding: '36px',
                      borderRadius: '24px',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)'
                    }}
                    >
                      <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        marginBottom: '20px'
                      }}>
                        ➕
                      </div>
                      <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
                        {t('createNewActivity')}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
                        {t('publishVolunteerOpportunities')}
                      </p>
                      <button style={{
                        width: '100%',
                        padding: '16px 24px',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '14px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)'
                      }}
                      onClick={() => setShowCreateActivity(true)}
                      >
                        {t('createActivity')}
                      </button>
                    </div>

                    {/* Manage Certificates */}
                    <div style={{
                      background: 'white',
                      padding: '36px',
                      borderRadius: '24px',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)'
                    }}
                    >
                      <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        marginBottom: '20px'
                      }}>
                        🏆
                      </div>
                      <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
                        {t('manageCertificatesTitle')}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
                        {t('createPublishCertificates')}
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
                        {t('manageCertificatesTitle')}
                      </button>
                    </div>
                  </div>

                  {/* Hours Verification Section */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '32px',
                    borderRadius: '20px',
                    border: pendingVerifications.length > 0 ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                          ⏳ {t('pendingVerifications')}
                        </h3>
                        {pendingVerifications.length > 0 && (
                          <span style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {pendingVerifications.length} {t('hoursToVerify')}
                          </span>
                        )}
                      </div>
                    </div>

                    {pendingVerifications.length === 0 ? (
                      <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: '#718096',
                        background: 'rgba(40, 167, 69, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(40, 167, 69, 0.1)'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <p style={{ margin: 0, fontWeight: '500' }}>
                          {t('allHoursVerified')}
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {pendingVerifications.map((verification) => (
                          <div key={verification.id} style={{
                            padding: '20px',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #fde68a',
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto',
                            gap: '16px',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.15)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                          >
                            <div>
                              <div style={{ fontSize: '15px', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                                {verification.volunteerName}
                              </div>
                              <div style={{ fontSize: '12px', color: '#718096' }}>
                                {verification.missionTitle}
                              </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
                                {verification.hoursSubmitted}h
                              </div>
                              <div style={{ fontSize: '11px', color: '#718096' }}>{t('hoursSubmitted')}</div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                {verification.submittedDate}
                              </div>
                              <div style={{ fontSize: '11px', color: '#718096' }}>{t('submittedDate')}</div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: '600',
                                background: 'rgba(245, 158, 11, 0.1)',
                                color: '#f59e0b'
                              }}>
                                {t('pendingStatus')}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  setPendingVerifications(prev => prev.filter(v => v.id !== verification.id))
                                  setNotifications(prev => [...prev, `✅ Approved ${verification.hoursSubmitted} hours for ${verification.volunteerName}!`])
                                }}
                                style={{
                                  padding: '8px 16px',
                                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-1px)'
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)'
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)'
                                  e.currentTarget.style.boxShadow = 'none'
                                }}
                              >
                                {t('approveHours')}
                              </button>
                              <button
                                onClick={() => {
                                  setPendingVerifications(prev => prev.filter(v => v.id !== verification.id))
                                  setNotifications(prev => [...prev, `❌ Rejected hours submission from ${verification.volunteerName}`])
                                }}
                                style={{
                                  padding: '8px 16px',
                                  background: 'rgba(220, 53, 69, 0.1)',
                                  color: '#dc3545',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = 'rgba(220, 53, 69, 0.15)'
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)'
                                }}
                              >
                                {t('rejectHours')}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                        📋 {t('manageMissions')}
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
                        {t('viewAll')}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                      {(() => {
                        // Filter to only show this NGO's own activities
                        const ngoActivities = missions.filter(m => m.organizerId === user?.id)
                        return ngoActivities.length === 0 ? (
                        <div style={{
                          padding: '40px',
                          textAlign: 'center',
                          color: '#718096',
                          background: 'rgba(0, 0, 0, 0.02)',
                          borderRadius: '12px'
                        }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                          <p style={{ margin: 0 }}>{t('noActivitiesYet')}</p>
                        </div>
                      ) : ngoActivities.map((activity, index) => (
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
                              📅 {activity.date} · 📍 {activity.location}
                            </div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>
                              {activity.currentParticipants}/{activity.maxParticipants}
                            </div>
                            <div style={{ fontSize: '11px', color: '#718096' }}>{t('participantsLabel2')}</div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                              {activity.hours}h
                            </div>
                            <div style={{ fontSize: '11px', color: '#718096' }}>{t('durationLabel')}</div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: new Date(activity.date) > new Date() ? 'rgba(40, 167, 69, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                              color: new Date(activity.date) > new Date() ? '#28a745' : '#6b7280'
                            }}>
                              {new Date(activity.date) > new Date() ? t('upcomingStatus') : t('completedStatus')}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => {
                                setSelectedMissionParticipants(activity)
                                setShowParticipantList(true)
                              }}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(40, 167, 69, 0.1)',
                                color: '#28a745',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              👥 {t('participantsLabel2')} ({activity.currentParticipants})
                            </button>
                            <button
                              onClick={() => {
                                setEditingMission(activity)
                                setNewActivity({
                                  title: activity.title,
                                  description: activity.description,
                                  location: activity.location,
                                  date: activity.date,
                                  hours: activity.hours,
                                  maxParticipants: activity.maxParticipants,
                                  category: activity.category,
                                  difficulty: activity.difficulty,
                                  region: activity.region || 'SEA',
                                  country: activity.country || ''
                                })
                              }}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(102, 126, 234, 0.1)',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              {t('editLabel')}
                            </button>
                            <button
                              onClick={() => {
                                setNotifications(prev => [...prev, `🏆 Certificate issued for "${activity.title}" - ${activity.currentParticipants} volunteers will receive certificates!`])
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
                              {t('issueCertificates')}
                            </button>
                          </div>
                        </div>
                      ))
                      })()}
                    </div>
                  </div>

                  {/* Certificate Templates - Upload Based */}
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
                        🏆 {t('yourCertificates')}
                      </h3>
                      <button
                        onClick={() => setShowCertificateManager(true)}
                        style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        📤 {t('uploadCertificateBtn')}
                      </button>
                    </div>

                    {uploadedCertificates.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                        <p style={{ marginBottom: '16px' }}>{t('noCertificatesYet')}</p>
                        <button
                          onClick={() => setShowCertificateManager(true)}
                          style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {t('uploadFirstCertificate')}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {uploadedCertificates.map((cert) => (
                          <div key={cert.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            border: cert.status === 'Active' ? '2px solid #28a745' : '1px solid #e2e8f0',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)'
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                          }}
                          >
                            {/* Preview */}
                            <div style={{
                              height: '120px',
                              background: `url(${cert.previewUrl}) center/cover`,
                              position: 'relative'
                            }}>
                              <span style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '10px',
                                fontWeight: '600',
                                background: cert.status === 'Active' ? '#28a745' : '#ffc107',
                                color: 'white'
                              }}>
                                {cert.status}
                              </span>
                            </div>

                            <div style={{ padding: '16px' }}>
                              <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#2d3748', margin: '0 0 8px 0' }}>
                                {cert.name}
                              </h4>
                              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#718096', marginBottom: '12px' }}>
                                <span>📅 {cert.uploadedAt}</span>
                                <span>🎖️ {cert.issuedCount} {t('issuedLabel')}</span>
                              </div>

                              <div style={{ display: 'flex', gap: '8px' }}>
                                {cert.status === 'Draft' && (
                                  <button
                                    onClick={() => {
                                      setUploadedCertificates(prev => prev.map(c =>
                                        c.id === cert.id ? {...c, status: 'Active'} : c
                                      ))
                                      setNotifications(prev => [...prev, `✅ "${cert.name}" is now active!`])
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: '8px 12px',
                                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {t('publishLabel')}
                                  </button>
                                )}
                                <button
                                  onClick={() => window.open(cert.previewUrl, '_blank')}
                                  style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {t('previewLabel')}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Edit Mission Modal */}
                  {editingMission && (
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
                            ✏️ {t('editMissionTitle')}
                          </h3>
                          <button
                            onClick={() => {
                              setEditingMission(null)
                              setNewActivity({ title: '', description: '', location: '', date: '', hours: 0, maxParticipants: 0, category: 'Community', difficulty: 'Easy', region: 'SEA', country: '' })
                            }}
                            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#718096' }}
                          >
                            ✕
                          </button>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>{t('titleLabelForm')} *</label>
                            <input
                              type="text"
                              value={newActivity.title}
                              onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                              style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>{t('descriptionLabel')} *</label>
                            <textarea
                              value={newActivity.description}
                              onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                              rows={3}
                              style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>{t('locationLabel')} *</label>
                              <input
                                type="text"
                                value={newActivity.location}
                                onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>{t('dateLabel')} *</label>
                              <input
                                type="date"
                                value={newActivity.date}
                                onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>{t('hoursLabelForm')} *</label>
                              <input
                                type="number"
                                value={newActivity.hours}
                                onChange={(e) => setNewActivity({...newActivity, hours: parseInt(e.target.value) || 0})}
                                min="1"
                                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>{t('maxParticipantsForm')} *</label>
                              <input
                                type="number"
                                value={newActivity.maxParticipants}
                                onChange={(e) => setNewActivity({...newActivity, maxParticipants: parseInt(e.target.value) || 0})}
                                min="1"
                                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>{t('categoryFormLabel')}</label>
                              <select
                                value={newActivity.category}
                                onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white' }}
                              >
                                <option value="Community">🤝 {t('categoryCommunity')}</option>
                                <option value="Environment">🌱 {t('categoryEnvironment')}</option>
                                <option value="Education">📚 {t('categoryEducation')}</option>
                                <option value="Healthcare">🏥 {t('categoryHealthcare')}</option>
                                <option value="Animals">🐾 {t('categoryAnimals')}</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>{t('difficultyFormLabel')}</label>
                              <select
                                value={newActivity.difficulty}
                                onChange={(e) => setNewActivity({...newActivity, difficulty: e.target.value})}
                                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white' }}
                              >
                                <option value="Easy">{t('difficultyEasy')}</option>
                                <option value="Medium">{t('difficultyMedium')}</option>
                                <option value="Hard">{t('difficultyHard')}</option>
                              </select>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                              onClick={() => {
                                // Update the mission in state
                                setMissions(prev => {
                                  const updated = prev.map(m =>
                                    m.id === editingMission.id
                                      ? {
                                          ...m,
                                          title: newActivity.title,
                                          description: newActivity.description,
                                          location: newActivity.location,
                                          date: newActivity.date,
                                          hours: newActivity.hours,
                                          maxParticipants: newActivity.maxParticipants,
                                          category: newActivity.category,
                                          difficulty: newActivity.difficulty as 'Easy' | 'Medium' | 'Hard'
                                        }
                                      : m
                                  )
                                  localStorage.setItem('kindworld_missions', JSON.stringify(updated))
                                  return updated
                                })
                                setNotifications(prev => [...prev, `✅ Mission "${newActivity.title}" updated successfully!`])
                                setEditingMission(null)
                                setNewActivity({ title: '', description: '', location: '', date: '', hours: 0, maxParticipants: 0, category: 'Community', difficulty: 'Easy', region: 'SEA', country: '' })
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
                              💾 {t('saveChangesBtn')}
                            </button>
                            <button
                              onClick={() => {
                                setEditingMission(null)
                                setNewActivity({ title: '', description: '', location: '', date: '', hours: 0, maxParticipants: 0, category: 'Community', difficulty: 'Easy', region: 'SEA', country: '' })
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
                              {t('cancelLabel')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Certificate Manager Modal - Upload Based */}
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
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                            🏆 {t('certificateManagerTitle')}
                          </h3>
                          <button
                            onClick={() => setShowCertificateManager(false)}
                            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#718096' }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Upload New Certificate */}
                        <div style={{
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                          padding: '32px',
                          borderRadius: '20px',
                          marginBottom: '30px',
                          border: '2px dashed #86efac',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'white',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px auto',
                            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.2)'
                          }}>
                            <span style={{ fontSize: '40px' }}>📤</span>
                          </div>
                          <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#166534', marginBottom: '8px' }}>
                            {t('uploadCertificate')}
                          </h4>
                          <p style={{ color: '#16a34a', fontSize: '14px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                            {t('uploadCertDescription')}
                          </p>

                          <input
                            type="file"
                            id="cert-upload"
                            accept=".pdf,.png,.jpg,.jpeg"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const newCert = {
                                  id: Date.now(),
                                  name: newCertificate.name || file.name.replace(/\.[^/.]+$/, ''),
                                  fileName: file.name,
                                  fileType: file.type,
                                  fileSize: (file.size / 1024).toFixed(0) + ' KB',
                                  previewUrl: URL.createObjectURL(file),
                                  requiredHours: 0,
                                  uploadedAt: new Date().toISOString().split('T')[0],
                                  issuedCount: 0,
                                  status: 'Draft'
                                }
                                setUploadedCertificates(prev => [...prev, newCert])
                                setNotifications(prev => [...prev, `✅ Certificate "${newCert.name}" uploaded successfully! You can now issue it to volunteers.`])
                                setNewCertificate({ name: '', description: '', requiredHours: 0, template: 'standard' })
                                e.target.value = ''
                              }
                            }}
                          />

                          <div style={{ display: 'grid', gap: '16px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                            <input
                              type="text"
                              placeholder={t('certificateNameOptional')}
                              value={newCertificate.name}
                              onChange={(e) => setNewCertificate({...newCertificate, name: e.target.value})}
                              style={{
                                padding: '14px 18px',
                                border: '2px solid #bbf7d0',
                                borderRadius: '12px',
                                fontSize: '15px',
                                outline: 'none',
                                background: 'white',
                                transition: 'border-color 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                              onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
                            />
                          </div>

                          <label
                            htmlFor="cert-upload"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '16px 36px',
                              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                              color: 'white',
                              borderRadius: '14px',
                              fontSize: '16px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
                            }}
                            onMouseOver={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)'
                            }}
                            onMouseOut={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)'
                            }}
                          >
                            📁 {t('uploadFile')}
                          </label>
                          <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '16px' }}>
                            {t('supportedFormats')} (Max 10MB)
                          </p>
                        </div>

                        {/* Uploaded Certificates */}
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
                            📋 Your Uploaded Certificates
                          </h4>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {uploadedCertificates.map((cert) => (
                              <div key={cert.id} style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: cert.status === 'Active' ? '2px solid #28a745' : '1px solid #e2e8f0',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                              }}>
                                {/* Preview Image */}
                                <div style={{
                                  height: '140px',
                                  background: `url(${cert.previewUrl}) center/cover`,
                                  position: 'relative'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    background: cert.status === 'Active' ? '#28a745' : '#ffc107',
                                    color: 'white'
                                  }}>
                                    {cert.status}
                                  </span>
                                </div>

                                {/* Certificate Info */}
                                <div style={{ padding: '16px' }}>
                                  <h5 style={{ fontSize: '15px', fontWeight: '600', color: '#2d3748', margin: '0 0 8px 0' }}>
                                    {cert.name}
                                  </h5>
                                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#718096', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <span>📄 {cert.fileName}</span>
                                    <span>📦 {cert.fileSize}</span>
                                    <span>🎖️ {cert.issuedCount} {t('issuedLabel')}</span>
                                  </div>

                                  {/* Action Buttons */}
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {cert.status === 'Draft' && (
                                      <button
                                        onClick={() => {
                                          setUploadedCertificates(prev => prev.map(c =>
                                            c.id === cert.id ? {...c, status: 'Active'} : c
                                          ))
                                          setNotifications(prev => [...prev, `✅ "${cert.name}" is now active! Volunteers can earn it.`])
                                        }}
                                        style={{
                                          flex: 1,
                                          padding: '8px 12px',
                                          background: 'linear-gradient(135deg, #28a745, #20c997)',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '8px',
                                          fontSize: '12px',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        ✓ Publish
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        window.open(cert.previewUrl, '_blank')
                                      }}
                                      style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        color: '#667eea',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      👁️ Preview
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm('Delete this certificate?')) {
                                          setUploadedCertificates(prev => prev.filter(c => c.id !== cert.id))
                                          setNotifications(prev => [...prev, `🗑️ "${cert.name}" has been deleted.`])
                                        }
                                      }}
                                      style={{
                                        padding: '8px 12px',
                                        background: 'rgba(220, 53, 69, 0.1)',
                                        color: '#dc3545',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {uploadedCertificates.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                              <p>{t('noCertificatesUploadedYet')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Participant List Modal */}
                  {showParticipantList && selectedMissionParticipants && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                      backdropFilter: 'blur(8px)',
                      padding: '20px'
                    }}>
                      <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
                      }}>
                        <div style={{
                          padding: '28px 32px',
                          borderBottom: '1px solid #e5e7eb',
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '700', color: '#166534' }}>
                                👥 {t('registeredParticipants')}
                              </h2>
                              <p style={{ margin: 0, color: '#16a34a', fontSize: '14px' }}>
                                {selectedMissionParticipants.title}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setShowParticipantList(false)
                                setSelectedMissionParticipants(null)
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#6b7280'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        <div style={{ padding: '24px 32px' }}>
                          {(() => {
                            const participants = missionRegistrations.filter(r => r.missionId === selectedMissionParticipants.id)
                            if (participants.length === 0) {
                              return (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                                  <p style={{ margin: 0 }}>
                                    {t('noParticipantsYet')}
                                  </p>
                                </div>
                              )
                            }
                            return (
                              <div style={{ display: 'grid', gap: '12px' }}>
                                {participants.map((p, index) => (
                                  <div key={index} style={{
                                    padding: '16px',
                                    background: '#f9fafb',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb'
                                  }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                          width: '40px',
                                          height: '40px',
                                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                          borderRadius: '50%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'white',
                                          fontWeight: 'bold',
                                          fontSize: '14px'
                                        }}>
                                          {p.volunteer.name.charAt(0)}
                                        </div>
                                        <div>
                                          <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>
                                            {p.volunteer.name}
                                          </div>
                                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                            {p.volunteer.email}
                                          </div>
                                        </div>
                                      </div>
                                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                        📞 {p.registrationData?.phoneNumber || 'N/A'}
                                      </div>
                                    </div>
                                    {p.registrationData?.emergencyContact && (
                                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>
                                        <strong>{t('emergencyContact')}: </strong>
                                        {p.registrationData.emergencyContact} ({p.registrationData.emergencyPhone})
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )
                          })()}
                        </div>

                        <div style={{ padding: '16px 32px 24px', borderTop: '1px solid #e5e7eb' }}>
                          <button
                            onClick={() => {
                              setShowParticipantList(false)
                              setSelectedMissionParticipants(null)
                            }}
                            style={{
                              width: '100%',
                              padding: '14px',
                              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              fontSize: '15px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            {t('closeLabel')}
                          </button>
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
                                // Actually update user data in allUsers state
                                setAllUsers((prev: any[]) => prev.map((u: any) =>
                                  u.id === editingUser.id
                                    ? { ...u, name: editUserData.name, email: editUserData.email, hours: editUserData.hours, role: editUserData.role }
                                    : u
                                ))
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

                  {/* User Detail Modal */}
                  {showUserDetailModal && selectedUserDetail && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                      backdropFilter: 'blur(8px)',
                      padding: '20px'
                    }}>
                      <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        width: '100%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
                      }}>
                        {/* Header */}
                        <div style={{
                          padding: '28px 32px',
                          background: selectedUserDetail.role === 'student' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                                     selectedUserDetail.role === 'ngo' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' :
                                     'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                          color: 'white',
                          borderRadius: '24px 24px 0 0'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: 'bold'
                              }}>
                                {selectedUserDetail.name.charAt(0)}
                              </div>
                              <div>
                                <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700' }}>
                                  {selectedUserDetail.name}
                                </h2>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                                  {selectedUserDetail.email}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setShowUserDetailModal(false)
                                setSelectedUserDetail(null)
                              }}
                              style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                color: 'white',
                                fontSize: '18px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '28px 32px' }}>
                          {/* Stats Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                            <div style={{
                              padding: '20px',
                              background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                              borderRadius: '16px',
                              textAlign: 'center'
                            }}>
                              <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f46e5' }}>{selectedUserDetail.hours}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{t('totalHoursLabel')}</div>
                            </div>
                            <div style={{
                              padding: '20px',
                              background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                              borderRadius: '16px',
                              textAlign: 'center'
                            }}>
                              <div style={{ fontSize: '28px', fontWeight: '700', color: '#059669' }}>{selectedUserDetail.completedMissions}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{t('missionsCompletedLabel')}</div>
                            </div>
                            <div style={{
                              padding: '20px',
                              background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                              borderRadius: '16px',
                              textAlign: 'center'
                            }}>
                              <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706' }}>{selectedUserDetail.badges}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{t('badgesLabel')}</div>
                            </div>
                            <div style={{
                              padding: '20px',
                              background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                              borderRadius: '16px',
                              textAlign: 'center'
                            }}>
                              <div style={{ fontSize: '28px', fontWeight: '700', color: '#7c3aed' }}>{selectedUserDetail.organizationsHelped}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{t('orgsHelpedLabel')}</div>
                            </div>
                          </div>

                          {/* User Info */}
                          <div style={{
                            background: '#f9fafb',
                            padding: '20px',
                            borderRadius: '16px',
                            marginBottom: '20px'
                          }}>
                            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                              {t('userDetails')}
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t('roleLabel')}</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>
                                  {selectedUserDetail.role === 'student' ? `🎓 ${t('volunteerRole')}` :
                                   selectedUserDetail.role === 'ngo' ? `🏢 ${t('organizationLabel')}` :
                                   `👑 ${t('adminLabel')}`}
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t('statusLabel')}</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: selectedUserDetail.status === 'active' ? '#28a745' : '#ffc107' }}>
                                  {selectedUserDetail.status === 'active' ? '✅ Active' : '⚡ Verified'}
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t('joinDateLabel')}</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>
                                  {selectedUserDetail.joinDate || '2024-01-15'}
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t('ratingLabel')}</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>
                                  ⭐ {selectedUserDetail.rating || 4.8}/5.0
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Badges Section */}
                          <div style={{
                            background: '#fffbeb',
                            padding: '20px',
                            borderRadius: '16px',
                            marginBottom: '20px',
                            border: '1px solid #fde68a'
                          }}>
                            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#92400e', textTransform: 'uppercase' }}>
                              {t('manageBadges')}
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                              {['🌟 Rising Star', '💪 Community Hero', '🌱 Eco Warrior'].map((badge, i) => (
                                <span key={i} style={{
                                  padding: '8px 14px',
                                  background: 'white',
                                  borderRadius: '20px',
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  border: '1px solid #fde68a',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  {badge}
                                  <button
                                    onClick={() => {
                                      setNotifications(prev => [...prev, `🗑️ Removed "${badge}" from ${selectedUserDetail.name}`])
                                    }}
                                    style={{
                                      background: 'rgba(220, 53, 69, 0.1)',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '18px',
                                      height: '18px',
                                      color: '#dc3545',
                                      fontSize: '12px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                              {availableBadges.map((badge) => (
                                <button
                                  key={badge.id}
                                  onClick={() => {
                                    setNotifications(prev => [...prev, `🏅 "${badge.icon} ${badge.name}" added to ${selectedUserDetail.name}!`])
                                  }}
                                  style={{
                                    padding: '8px 14px',
                                    background: 'white',
                                    border: '1px solid #fde68a',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#fef3c7'
                                    e.currentTarget.style.borderColor = '#f59e0b'
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'white'
                                    e.currentTarget.style.borderColor = '#fde68a'
                                  }}
                                  title={badge.description}
                                >
                                  {badge.icon} {badge.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              onClick={() => {
                                setShowUserDetailModal(false)
                                setSelectedUserDetail(null)
                                setEditingUser(selectedUserDetail)
                                setEditUserData({
                                  name: selectedUserDetail.name,
                                  email: selectedUserDetail.email,
                                  hours: selectedUserDetail.hours,
                                  role: selectedUserDetail.role
                                })
                                setShowEditUserModal(true)
                              }}
                              style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              ✏️ {t('editUser')}
                            </button>
                            <button
                              onClick={() => {
                                setShowUserDetailModal(false)
                                setSelectedUserDetail(null)
                              }}
                              style={{
                                padding: '14px 24px',
                                background: 'white',
                                color: '#374151',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              {t('closeLabel')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Student/Volunteer Dashboard
                <div>
                  <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        borderRadius: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        boxShadow: '0 10px 30px rgba(79, 70, 229, 0.35)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h2 style={{
                          fontSize: '36px',
                          fontWeight: '700',
                          color: '#1f2937',
                          margin: 0,
                          letterSpacing: '-0.5px'
                        }}>
                          {t('welcomeBack')}, {user.name}!
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '17px', margin: 0, marginTop: '6px' }}>
                          {t('impactSummary')}
                        </p>
                      </div>
                    </div>
                  </div>

              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                {(() => {
                  // For new users with 0 hours, show 0 for this month too
                  // Only show mock data for demo users with existing hours
                  const currentMonthData = monthlyData.find(m => m.month === 'Jan 2026')
                  const thisMonthHours = user.hours > 0 ? (currentMonthData ? currentMonthData.hours : 0) : 0

                  return [
                    { value: user.hours, label: t('volunteerHours'), icon: '⏱️', color: '#4f46e5', bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' },
                    { value: thisMonthHours, label: t('thisMonthHours'), icon: '📅', color: '#059669', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', highlight: true },
                    { value: user.completedMissions, label: t('projectsCompleted'), icon: '🎯', color: '#d97706', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
                    { value: user.organizationsHelped, label: t('organizationsHelped'), icon: '🏢', color: '#dc2626', bg: 'linear-gradient(135deg, #fef2f2, #fecaca)' }
                  ]
                })().map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'white',
                      padding: '36px',
                      borderRadius: '24px',
                      textAlign: 'center',
                      border: stat.highlight ? '2px solid rgba(5, 150, 105, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: stat.highlight ? '0 10px 40px rgba(5, 150, 105, 0.15)' : '0 10px 40px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)'
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = stat.highlight ? '0 10px 40px rgba(5, 150, 105, 0.15)' : '0 10px 40px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {/* Special badge for monthly hours */}
                    {stat.highlight && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                      }}>
                        THIS MONTH
                      </div>
                    )}

                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: stat.bg,
                      borderRadius: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px auto',
                      fontSize: '40px'
                    }}>
                      {stat.icon}
                    </div>
                    <div style={{ fontSize: '44px', fontWeight: '700', color: stat.color, marginBottom: '8px', letterSpacing: '-1px' }}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {stat.label}
                    </div>

                    {/* Additional info for monthly hours */}
                    {stat.highlight && (
                      <div style={{
                        fontSize: '13px',
                        color: '#059669',
                        marginTop: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}>
                        <span>📈</span> January 2026
                      </div>
                    )}
                  </div>
                ))}
              </div>

                  {/* Interactive Chart Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: showMonthDetails ? '3fr 1fr' : '1fr', gap: '24px' }}>
                {/* Line Chart */}
                <div style={{
                  background: 'white',
                  padding: showMonthDetails ? '32px' : '48px',
                  borderRadius: '24px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                  minWidth: 0
                }}>
                  <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px'
                    }}>
                      📈
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginBottom: '4px', margin: 0 }}>
                        {chartTimePeriod === '6months' ? t('monthlyProgress') : chartTimePeriod === 'year' ? t('yearlyProgress') : t('allTimeProgress')}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                        {t('clickForDetails')}
                      </p>
                    </div>
                    {/* Time Period Selector */}
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '12px' }}>
                      {[
                        { key: '6months', label: t('sixMonths') },
                        { key: 'year', label: t('oneYear') },
                        { key: 'allTime', label: t('allTime') }
                      ].map((period) => (
                        <button
                          key={period.key}
                          onClick={() => {
                            setChartTimePeriod(period.key as '6months' | 'year' | 'allTime')
                            setSelectedMonth(null)
                            setShowMonthDetails(false)
                          }}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: chartTimePeriod === period.key ? 'white' : 'transparent',
                            color: chartTimePeriod === period.key ? '#4f46e5' : '#6b7280',
                            fontWeight: chartTimePeriod === period.key ? '600' : '500',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: chartTimePeriod === period.key ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          {period.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Line Chart */}
                  {(() => {
                    const dataPoints = chartData.length
                    const maxHours = Math.max(...chartData.map(d => d.hours))
                    const containerHeight = showMonthDetails ? 350 : 520
                    const chartHeight = showMonthDetails ? 290 : 450
                    const scale = chartHeight / (maxHours * 1.15)
                    const labelY = showMonthDetails ? 325 : 490
                    // Use percentage-based positioning for full width
                    const startX = 5 // Start at 5%
                    const endX = 95 // End at 95%
                    const getXPosition = (index: number) => {
                      if (dataPoints === 1) return 50
                      return startX + (index / (dataPoints - 1)) * (endX - startX)
                    }
                    const yAxisValues = chartTimePeriod === 'allTime'
                      ? [0, Math.round(maxHours * 0.25), Math.round(maxHours * 0.5), Math.round(maxHours * 0.75), maxHours]
                      : [0, 25, 50, 75, 100]
                    return (
                  <div style={{ position: 'relative', height: `${containerHeight}px`, marginBottom: '20px', transition: 'all 0.3s ease', width: '100%' }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible', position: 'absolute', top: 0, left: 0 }}>
                      {/* Grid Lines - using viewBox coordinates */}
                      {yAxisValues.map((y, idx) => (
                        <line
                          key={y}
                          x1="3"
                          y1={100 - (idx * 25)}
                          x2="98"
                          y2={100 - (idx * 25)}
                          stroke="#e2e8f0"
                          strokeWidth="0.2"
                          strokeDasharray="0.5,0.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </svg>
                    <svg width="100%" height="100%" style={{ overflow: 'visible', position: 'absolute', top: 0, left: 0 }}>
                      {/* Y-axis labels */}
                      {yAxisValues.map((y) => (
                        <text
                          key={y}
                          x="2%"
                          y={chartHeight + 5 - (y * scale)}
                          fill="#718096"
                          fontSize="12"
                          textAnchor="start"
                        >
                          {y}h
                        </text>
                      ))}

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

                      {/* Area under curve - using percentage */}
                      <path
                        d={`M ${getXPosition(0)}% ${chartHeight} L ${getXPosition(0)}% ${chartHeight - (chartData[0].hours * scale)} ${chartData.map((data, index) =>
                          `L ${getXPosition(index)}% ${chartHeight - (data.hours * scale)}`
                        ).join(' ')} L ${getXPosition(dataPoints - 1)}% ${chartHeight} Z`}
                        fill="url(#areaGradient)"
                      />

                      {/* Line Path - using percentage */}
                      <path
                        d={`M ${getXPosition(0)}% ${chartHeight - (chartData[0].hours * scale)} ${chartData.map((data, index) =>
                          `L ${getXPosition(index)}% ${chartHeight - (data.hours * scale)}`
                        ).join(' ')}`}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Data Points - using percentage */}
                      {chartData.map((data, index) => (
                        <g key={index}>
                          <circle
                            cx={`${getXPosition(index)}%`}
                            cy={chartHeight - (data.hours * scale)}
                            r={selectedMonth === data.month ? "10" : "8"}
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
                              e.currentTarget.setAttribute('r', '12')
                              e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4))'
                            }}
                            onMouseOut={(e) => {
                              if (selectedMonth !== data.month) {
                                e.currentTarget.setAttribute('r', '8')
                                e.currentTarget.style.filter = 'none'
                              }
                            }}
                          />

                          {/* Month Labels - using percentage */}
                          <text
                            x={`${getXPosition(index)}%`}
                            y={labelY}
                            fill="#718096"
                            fontSize="14"
                            textAnchor="middle"
                            fontWeight="600"
                          >
                            {data.shortMonth}
                          </text>

                          {/* Hours Labels - using percentage */}
                          <text
                            x={`${getXPosition(index)}%`}
                            y={chartHeight - 15 - (data.hours * scale)}
                            fill="#2d3748"
                            fontSize="14"
                            textAnchor="middle"
                            fontWeight="700"
                          >
                            {data.hours}h
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                    )
                  })()}
                  
                  {/* Chart Legend */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%'
                      }}></div>
                      <span style={{ fontSize: '14px', color: '#718096' }}>{t('volunteerHours')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '12px',
                        height: '3px',
                        background: '#e2e8f0',
                        borderRadius: '2px'
                      }}></div>
                      <span style={{ fontSize: '14px', color: '#718096' }}>{t('clickPointsForDetails')}</span>
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
                          📅 {selectedMonth} {t('reportLabel')}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
                          {t('volunteerActivityBreakdown')}
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
                      const monthData = chartData.find(m => m.month === selectedMonth)
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
                                ⏰ {t('totalHoursLabel')}
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
                                🎯 {t('missionsCompleted')}
                              </div>
                            </div>
                          </div>

                          {/* Detailed Mission Timeline */}
                          <div style={{ marginBottom: '24px' }}>
                            <h5 style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              📋 {t('missionTimeline')}
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
                                const currentIndex = chartData.findIndex(m => m.month === selectedMonth)
                                const previousMonth = currentIndex > 0 ? chartData[currentIndex - 1] : null
                                
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <h2 style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#2d3748',
                      marginBottom: '8px'
                    }}>
                      {user?.role === 'ngo' ? `🏢 ${t('ngoMissionsTitle')}` :
                       user?.role === 'admin' ? `⚙️ ${t('adminMissionsTitle')}` :
                       `🎯 ${t('availableMissionsTitle')}`}
                    </h2>
                    <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>
                      {user?.role === 'ngo' ? t('ngoMissionsSubtitle') :
                       user?.role === 'admin' ? t('adminMissionsSubtitle') :
                       t('availableMissionsSubtitle')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Region Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>🌍</span>
                      <select
                        value={regionFilter}
                        onChange={(e) => {
                          setRegionFilter(e.target.value)
                          setCountryFilter('all') // Reset country when region changes
                        }}
                        style={{
                          padding: '10px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '500',
                          outline: 'none',
                          cursor: 'pointer',
                          background: 'white',
                          minWidth: '160px'
                        }}
                      >
                        <option value="all">{t('allRegions')}</option>
                        {regions.map(region => (
                          <option key={region.code} value={region.code}>{region.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Country Selector - only show when a region is selected */}
                    {regionFilter !== 'all' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>🏳️</span>
                        <select
                          value={countryFilter}
                          onChange={(e) => setCountryFilter(e.target.value)}
                          style={{
                            padding: '10px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '500',
                            outline: 'none',
                            cursor: 'pointer',
                            background: 'white',
                            minWidth: '160px'
                          }}
                        >
                          <option value="all">{t('allCountries')}</option>
                          {regions.find(r => r.code === regionFilter)?.countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* My Location button - set to saved region/country */}
                    {userRegion && (regionFilter !== userRegion || countryFilter !== userCountry) && (
                      <button
                        onClick={() => {
                          setRegionFilter(userRegion)
                          if (userCountry) {
                            setCountryFilter(userCountry)
                          }
                        }}
                        style={{
                          padding: '10px 16px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        📍 {t('nearbyMissions')}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Empty state for NGO with no published activities */}
                {user?.role === 'ngo' && missions.filter(m => m.organizerId === user?.id).length === 0 && (
                  <div style={{
                    background: 'white',
                    padding: '80px 48px',
                    borderRadius: '32px',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Decorative background elements */}
                    <div style={{
                      position: 'absolute',
                      top: '-60px',
                      right: '-60px',
                      width: '200px',
                      height: '200px',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-40px',
                      left: '-40px',
                      width: '150px',
                      height: '150px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)',
                      borderRadius: '50%'
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Icon container */}
                      <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                        boxShadow: '0 12px 40px rgba(99, 102, 241, 0.35)',
                        transform: 'rotate(-6deg)'
                      }}>
                        <span style={{ fontSize: '48px', transform: 'rotate(6deg)' }}>📋</span>
                      </div>

                      <h3 style={{
                        fontSize: '28px',
                        fontWeight: '800',
                        color: '#1f2937',
                        marginBottom: '16px',
                        letterSpacing: '-0.5px'
                      }}>
                        Start Your Impact Journey
                      </h3>

                      <p style={{
                        color: '#6b7280',
                        fontSize: '17px',
                        marginBottom: '40px',
                        maxWidth: '420px',
                        margin: '0 auto 40px',
                        lineHeight: '1.7'
                      }}>
                        Create your first volunteer activity and connect with passionate volunteers ready to make a difference.
                      </p>

                      <button
                        onClick={() => setShowCreateActivity(true)}
                        style={{
                          padding: '18px 40px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '16px',
                          fontSize: '17px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>+</span>
                        Create First Activity
                      </button>

                      <p style={{
                        marginTop: '24px',
                        fontSize: '14px',
                        color: '#9ca3af'
                      }}>
                        It only takes a few minutes to get started
                      </p>
                    </div>
                  </div>
                )}
                {missions
                  .filter(m => {
                    // For NGO users, only show their own missions
                    if (user?.role === 'ngo') {
                      return m.organizerId === user?.id
                    }
                    // For all users, apply region and country filters (strict matching)
                    const matchesRegion = regionFilter === 'all' || m.region === regionFilter
                    const matchesCountry = countryFilter === 'all' || m.country === countryFilter
                    return matchesRegion && matchesCountry
                  })
                  .map((mission, index) => (
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
                          ⏰ {mission.hours} {t('hoursLabel')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                          👥 {mission.participants} {t('participantsLabel')}
                        </div>
                        {mission.region && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#10b981'
                          }}>
                            🌍 {regions.find(r => r.code === mission.region)?.name || mission.region}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Show different buttons based on user role */}
                    {user?.role === 'ngo' || user?.role === 'admin' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setSelectedMissionDetail(mission)
                            setShowMissionDetail(true)
                          }}
                          style={{
                            padding: '12px 20px',
                            background: user?.role === 'admin'
                              ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                              : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
                            e.currentTarget.style.boxShadow = user?.role === 'admin'
                              ? '0 8px 20px rgba(79, 70, 229, 0.4)'
                              : '0 8px 20px rgba(5, 150, 105, 0.4)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          📋 {t('viewDetails')}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMissionParticipants(mission)
                            setShowParticipantList(true)
                          }}
                          style={{
                            padding: '12px 20px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            border: '2px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.2)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          👥 {t('participantsLabel2')} ({mission.currentParticipants})
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (mission.joined) {
                            joinMission(mission.id)
                          } else {
                            setJoiningMission(mission)
                            setMissionRegistration({
                              fullName: user?.name || '',
                              phoneNumber: '',
                              emergencyContact: '',
                              emergencyPhone: '',
                              allergies: '',
                              medicalConditions: '',
                              dietaryRestrictions: '',
                              tshirtSize: 'M',
                              transportation: 'own',
                              specialSkills: '',
                              agreeTerms: false
                            })
                            setShowJoinMissionModal(true)
                          }
                        }}
                        style={{
                          padding: '12px 24px',
                          background: mission.joined
                            ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                            : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
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
                          e.currentTarget.style.boxShadow = mission.joined
                            ? '0 8px 20px rgba(220, 53, 69, 0.4)'
                            : '0 8px 20px rgba(40, 167, 69, 0.4)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        {mission.joined ? t('leaveMission') : t('joinMission')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Region Setup Modal for First-Time Volunteers */}
          {showRegionSetup && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              backdropFilter: 'blur(8px)',
              padding: '20px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '40px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                animation: 'fadeInUp 0.3s ease-out'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '36px'
                  }}>
                    🌍
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                    {t('regionSetup')}
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '15px' }}>
                    {t('regionSetupDesc')}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                    🌏 {t('yourRegion')}
                  </label>
                  <select
                    value={userRegion}
                    onChange={(e) => {
                      setUserRegion(e.target.value)
                      setUserCountry('') // Reset country when region changes
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      cursor: 'pointer',
                      background: 'white'
                    }}
                  >
                    <option value="">{t('selectRegion')}</option>
                    {regions.map(region => (
                      <option key={region.code} value={region.code}>{region.name}</option>
                    ))}
                  </select>
                </div>

                {userRegion && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                      🏳️ {t('yourCountry')}
                    </label>
                    <select
                      value={userCountry}
                      onChange={(e) => setUserCountry(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '15px',
                        outline: 'none',
                        cursor: 'pointer',
                        background: 'white'
                      }}
                    >
                      <option value="">{t('selectCountry')}</option>
                      {regions.find(r => r.code === userRegion)?.countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                    🗣️ {t('preferredLanguage')}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {Object.entries(languages).map(([code, lang]) => (
                      <button
                        key={code}
                        onClick={() => setLanguage(code)}
                        style={{
                          padding: '12px 8px',
                          border: language === code ? '2px solid #667eea' : '2px solid #e5e7eb',
                          background: language === code ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)' : 'white',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                        <span style={{ fontSize: '11px', fontWeight: language === code ? '600' : '500', color: language === code ? '#4f46e5' : '#374151' }}>
                          {lang.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setShowRegionSetup(false)
                    }}
                    style={{
                      flex: 1,
                      padding: '14px 24px',
                      background: 'white',
                      color: '#6b7280',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {t('skipForNow')}
                  </button>
                  <button
                    onClick={() => {
                      if (userRegion) {
                        localStorage.setItem('kindworld_user_region', userRegion)
                        localStorage.setItem('kindworld_user_country', userCountry)
                        localStorage.setItem('kindworld_language', language)
                        setRegionFilter(userRegion)
                      }
                      setShowRegionSetup(false)
                      setNotifications(prev => [...prev, '✅ Profile preferences saved!'])
                    }}
                    style={{
                      flex: 1,
                      padding: '14px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    {t('continueSetup')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Join Mission Registration Modal */}
          {showJoinMissionModal && joiningMission && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(8px)',
              padding: '20px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                {/* Modal Header */}
                <div style={{
                  padding: '28px 32px',
                  borderBottom: '1px solid #e5e7eb',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{
                        margin: '0 0 8px 0',
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#166534'
                      }}>
                        {t('joinMissionTitle')}
                      </h2>
                      <p style={{ margin: 0, color: '#16a34a', fontSize: '16px', fontWeight: '500' }}>
                        {joiningMission.title}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowJoinMissionModal(false)
                        setJoiningMission(null)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: '4px',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div style={{
                    marginTop: '16px',
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      fontSize: '13px',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      📍 {joiningMission.location}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      📅 {joiningMission.date}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      ⏱️ {joiningMission.hours} hours
                    </span>
                  </div>
                </div>

                {/* Modal Body - Registration Form */}
                <div style={{ padding: '28px 32px' }}>
                  <p style={{
                    margin: '0 0 24px 0',
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    Please fill in the required information below. This helps the organizers prepare for your participation and ensure your safety during the mission.
                  </p>

                  <div style={{ display: 'grid', gap: '20px' }}>
                    {/* Personal Information Section */}
                    <div style={{
                      background: '#f9fafb',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h4 style={{
                        margin: '0 0 16px 0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Personal Information
                      </h4>
                      <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={missionRegistration.fullName}
                            onChange={(e) => setMissionRegistration({...missionRegistration, fullName: e.target.value})}
                            placeholder="Enter your full name"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              transition: 'border-color 0.2s ease',
                              boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                          />
                        </div>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={missionRegistration.phoneNumber}
                            onChange={(e) => setMissionRegistration({...missionRegistration, phoneNumber: e.target.value})}
                            placeholder="+1 (555) 000-0000"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              transition: 'border-color 0.2s ease',
                              boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact Section */}
                    <div style={{
                      background: '#fef2f2',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '1px solid #fecaca'
                    }}>
                      <h4 style={{
                        margin: '0 0 16px 0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#991b1b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Emergency Contact
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            Contact Name *
                          </label>
                          <input
                            type="text"
                            value={missionRegistration.emergencyContact}
                            onChange={(e) => setMissionRegistration({...missionRegistration, emergencyContact: e.target.value})}
                            placeholder="Emergency contact name"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #fecaca',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              background: 'white',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            Contact Phone *
                          </label>
                          <input
                            type="tel"
                            value={missionRegistration.emergencyPhone}
                            onChange={(e) => setMissionRegistration({...missionRegistration, emergencyPhone: e.target.value})}
                            placeholder="+1 (555) 000-0000"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #fecaca',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              background: 'white',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Health & Safety Section */}
                    <div style={{
                      background: '#fffbeb',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '1px solid #fde68a'
                    }}>
                      <h4 style={{
                        margin: '0 0 16px 0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#92400e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Health & Safety Information
                      </h4>
                      <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            Allergies
                          </label>
                          <input
                            type="text"
                            value={missionRegistration.allergies}
                            onChange={(e) => setMissionRegistration({...missionRegistration, allergies: e.target.value})}
                            placeholder="List any allergies (food, medication, environmental)"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #fde68a',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              background: 'white',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            Medical Conditions
                          </label>
                          <input
                            type="text"
                            value={missionRegistration.medicalConditions}
                            onChange={(e) => setMissionRegistration({...missionRegistration, medicalConditions: e.target.value})}
                            placeholder="Any conditions we should be aware of"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #fde68a',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              background: 'white',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            Dietary Restrictions
                          </label>
                          <input
                            type="text"
                            value={missionRegistration.dietaryRestrictions}
                            onChange={(e) => setMissionRegistration({...missionRegistration, dietaryRestrictions: e.target.value})}
                            placeholder="Vegetarian, vegan, halal, kosher, etc."
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #fde68a',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              background: 'white',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Details Section */}
                    <div style={{
                      background: '#f0f9ff',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '1px solid #bae6fd'
                    }}>
                      <h4 style={{
                        margin: '0 0 16px 0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#075985',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Additional Details
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            T-Shirt Size
                          </label>
                          <select
                            value={missionRegistration.tshirtSize}
                            onChange={(e) => setMissionRegistration({...missionRegistration, tshirtSize: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #bae6fd',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              background: 'white',
                              boxSizing: 'border-box',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                          </select>
                        </div>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '500',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            Transportation
                          </label>
                          <select
                            value={missionRegistration.transportation}
                            onChange={(e) => setMissionRegistration({...missionRegistration, transportation: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #bae6fd',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              background: 'white',
                              boxSizing: 'border-box',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="own">{t('transportOwn')}</option>
                            <option value="carpool">{t('transportCarpool')}</option>
                            <option value="public">{t('transportPublic')}</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ marginTop: '16px' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '14px'
                        }}>
                          Special Skills or Notes
                        </label>
                        <textarea
                          value={missionRegistration.specialSkills}
                          onChange={(e) => setMissionRegistration({...missionRegistration, specialSkills: e.target.value})}
                          placeholder="Any relevant skills, certifications, or notes for the organizer"
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #bae6fd',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            background: 'white',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <input
                        type="checkbox"
                        checked={missionRegistration.agreeTerms}
                        onChange={(e) => setMissionRegistration({...missionRegistration, agreeTerms: e.target.checked})}
                        style={{
                          width: '20px',
                          height: '20px',
                          marginTop: '2px',
                          cursor: 'pointer',
                          accentColor: '#22c55e'
                        }}
                      />
                      <label style={{
                        fontSize: '13px',
                        color: '#4b5563',
                        lineHeight: '1.5'
                      }}>
                        I agree to the mission terms and conditions. I understand that my information will be shared with the mission organizers for coordination purposes. I confirm that the information provided is accurate. *
                      </label>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div style={{
                  padding: '20px 32px',
                  borderTop: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  borderRadius: '0 0 24px 24px'
                }}>
                  <button
                    onClick={() => {
                      setShowJoinMissionModal(false)
                      setJoiningMission(null)
                    }}
                    style={{
                      padding: '14px 28px',
                      background: 'white',
                      color: '#374151',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f3f4f6'
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Validate required fields
                      if (!missionRegistration.fullName || !missionRegistration.phoneNumber ||
                          !missionRegistration.emergencyContact || !missionRegistration.emergencyPhone ||
                          !missionRegistration.agreeTerms) {
                        setNotifications(prev => [...prev, '⚠️ Please fill in all required fields and agree to the terms'])
                        return
                      }

                      // Join the mission
                      joinMission(joiningMission.id)
                      setShowJoinMissionModal(false)
                      setJoiningMission(null)
                      setNotifications(prev => [...prev, `🎉 Successfully registered for "${joiningMission.title}"! You'll receive confirmation details via email.`])
                    }}
                    disabled={!missionRegistration.agreeTerms}
                    style={{
                      padding: '14px 32px',
                      background: missionRegistration.agreeTerms
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : '#d1d5db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: missionRegistration.agreeTerms ? 'pointer' : 'not-allowed',
                      boxShadow: missionRegistration.agreeTerms ? '0 4px 15px rgba(34, 197, 94, 0.4)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (missionRegistration.agreeTerms) {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.5)'
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      if (missionRegistration.agreeTerms) {
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.4)'
                      }
                    }}
                  >
                    Confirm Registration
                  </button>
                </div>
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
                  🏆 {t('certificatesTitle')}
                </h2>
                <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>
                  {t('certificatesSubtitle')}
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
                        <span style={{ fontSize: '14px', color: '#718096' }}>{t('requiredHoursLabel')}</span>
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

              {/* Available Certificates from NGOs */}
              <div style={{ marginTop: '48px' }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  📋 Available Certificates from NGOs
                </h3>
                <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>
                  Complete the required volunteer hours to earn these certificates
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {uploadedCertificates.filter(c => c.status === 'Active').map((cert) => {
                    const userHours = user?.hours || 0
                    const progress = Math.min((userHours / cert.requiredHours) * 100, 100)
                    const canClaim = userHours >= cert.requiredHours

                    return (
                      <div key={cert.id} style={{
                        background: 'white',
                        borderRadius: '16px',
                        border: canClaim ? '2px solid #28a745' : '1px solid #e2e8f0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                      }}
                      >
                        {/* Certificate Preview */}
                        <div style={{
                          height: '140px',
                          background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${cert.previewUrl}) center/cover`,
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '48px' }}>{canClaim ? '🏆' : '📜'}</span>
                          {canClaim && (
                            <span style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: '#28a745',
                              color: 'white'
                            }}>
                              ✓ Eligible
                            </span>
                          )}
                        </div>

                        <div style={{ padding: '20px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: '0 0 8px 0' }}>
                            {cert.name}
                          </h4>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '16px' }}>
                            <span>⏰ {cert.requiredHours} hours required</span>
                            <span style={{ marginLeft: '12px' }}>🎖️ {cert.issuedCount} volunteers earned</span>
                          </div>

                          {/* Progress Bar */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '12px', color: '#718096' }}>{t('yourProgressLabel')}</span>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: canClaim ? '#28a745' : '#667eea' }}>
                                {userHours}/{cert.requiredHours}h
                              </span>
                            </div>
                            <div style={{
                              width: '100%',
                              height: '8px',
                              background: '#e2e8f0',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: canClaim
                                  ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                transition: 'width 0.5s ease'
                              }} />
                            </div>
                          </div>

                          {canClaim ? (
                            <button
                              onClick={() => {
                                window.open(cert.previewUrl, '_blank')
                                setNotifications(prev => [...prev, `🎉 Congratulations! You've claimed "${cert.name}"!`])
                              }}
                              style={{
                                width: '100%',
                                padding: '12px',
                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                              }}
                            >
                              🏆 Claim Certificate
                            </button>
                          ) : (
                            <div style={{
                              textAlign: 'center',
                              padding: '12px',
                              background: 'rgba(113, 128, 150, 0.1)',
                              borderRadius: '10px',
                              color: '#718096',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>
                              {cert.requiredHours - userHours} more hours needed
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {uploadedCertificates.filter(c => c.status === 'Active').length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <p>{t('noCertificatesAvailableYet')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Badges Page */}
          {currentPage === 'badges' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {/* Badges Header */}
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '32px',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    🏅
                  </div>
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 4px 0' }}>
                      {t('myBadges')}
                    </h2>
                    <p style={{ fontSize: '15px', opacity: 0.9, margin: 0 }}>
                      {t('badgesDescription')}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
                  <div style={{ textAlign: 'center', padding: '12px 24px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{user?.userBadges?.length || 0}</div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>{t('earnedLabel')}</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px 24px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>12</div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>{t('totalAvailable')}</div>
                  </div>
                </div>
              </div>

              {/* Earned Badges Section */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '28px',
                marginBottom: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✨ {t('earnedBadgesTitle')}
                </h3>
                {user?.userBadges && user.userBadges.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                    {user.userBadges.map((badge: any, index: number) => (
                      <div key={index} style={{
                        padding: '24px 20px',
                        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '3px solid #f59e0b',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          width: '28px',
                          height: '28px',
                          background: '#22c55e',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          border: '3px solid white'
                        }}>
                          ✓
                        </div>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{badge.icon}</div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#92400e', marginBottom: '6px' }}>{badge.name}</div>
                        <div style={{ fontSize: '12px', color: '#b45309' }}>{badge.company || 'KindWorld'}</div>
                        {badge.earnedDate && (
                          <div style={{ fontSize: '11px', color: '#78716c', marginTop: '8px' }}>
                            {t('earnedOn')}{badge.earnedDate}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
                    <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>
                      {t('noBadgesYet')}
                    </p>
                    <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                      {t('noBadgesDesc')}
                    </p>
                  </div>
                )}
              </div>

              {/* All Available Badges Section */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎖️ {t('allAvailableBadges')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                  {[
                    { id: 'b1', icon: '🏆', name: 'Community Champion', company: 'KindWorld', color: '#fbbf24', description: 'Top contributor in community service' },
                    { id: 'b2', icon: '🌱', name: 'Environmental Hero', company: 'Green Earth', color: '#22c55e', description: 'Champion of environmental causes' },
                    { id: 'b3', icon: '📚', name: 'Education Supporter', company: 'UNICEF', color: '#3b82f6', description: 'Dedicated to educational initiatives' },
                    { id: 'b4', icon: '❤️', name: 'Healthcare Helper', company: 'Red Cross', color: '#ef4444', description: 'Committed to health and wellness' },
                    { id: 'b5', icon: '🍲', name: 'Hunger Fighter', company: 'Food Bank', color: '#f97316', description: 'Fighting hunger in communities' },
                    { id: 'b6', icon: '🏠', name: 'Shelter Builder', company: 'Habitat', color: '#8b5cf6', description: 'Building homes for those in need' },
                    { id: 'b7', icon: '🐾', name: 'Animal Guardian', company: 'WWF', color: '#ec4899', description: 'Protecting animal welfare' },
                    { id: 'b8', icon: '👴', name: 'Elder Care Champion', company: 'Senior Care', color: '#14b8a6', description: 'Caring for elderly community' },
                    { id: 'b9', icon: '🌟', name: 'Rising Star', company: 'KindWorld', color: '#6366f1', description: 'First 10 volunteer hours' },
                    { id: 'b10', icon: '💯', name: 'Century Club', company: 'KindWorld', color: '#a855f7', description: '100+ volunteer hours' },
                    { id: 'b11', icon: '🎓', name: 'Mentor', company: 'KindWorld', color: '#0ea5e9', description: 'Helped 5+ new volunteers' },
                    { id: 'b12', icon: '🌍', name: 'Global Citizen', company: 'UN Volunteers', color: '#059669', description: 'International volunteering' }
                  ].map((badge) => {
                    const isUnlocked = user?.userBadges?.some((ub: any) => ub.id === badge.id)
                    return (
                      <div key={badge.id} style={{
                        padding: '24px 20px',
                        background: isUnlocked ? `linear-gradient(135deg, ${badge.color}20, ${badge.color}40)` : '#f9fafb',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: isUnlocked ? `3px solid ${badge.color}` : '3px solid #e5e7eb',
                        opacity: isUnlocked ? 1 : 0.6,
                        position: 'relative'
                      }}>
                        {isUnlocked && (
                          <div style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            width: '28px',
                            height: '28px',
                            background: '#22c55e',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            border: '3px solid white'
                          }}>
                            ✓
                          </div>
                        )}
                        <div style={{ fontSize: '40px', marginBottom: '12px', filter: isUnlocked ? 'none' : 'grayscale(100%)' }}>{badge.icon}</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: isUnlocked ? '#1f2937' : '#9ca3af', marginBottom: '4px' }}>{badge.name}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{badge.company}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1.4' }}>{badge.description}</div>
                        {!isUnlocked && (
                          <div style={{
                            marginTop: '12px',
                            padding: '6px 12px',
                            background: '#f3f4f6',
                            color: '#6b7280',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            🔒 {t('lockedLabel')}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Friends */}
          {currentPage === 'friends' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {/* Friends Header */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '32px',
                color: 'white'
              }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{t('friends')}</h1>
                <p style={{ opacity: 0.9 }}>
                  {t('connectWithVolunteers')}
                </p>
              </div>

              {/* Add Friend Section */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  {t('addFriend')}
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder={t('searchFriendPlaceholder')}
                    value={friendSearchQuery}
                    onChange={(e) => setFriendSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => {
                      if (friendSearchQuery.trim()) {
                        const newFriend = {
                          id: Date.now(),
                          name: friendSearchQuery,
                          email: `${friendSearchQuery.toLowerCase().replace(/\s+/g, '.')}@email.com`,
                          hours: Math.floor(Math.random() * 100),
                          status: 'pending' as const
                        }
                        const updatedFriends = [...friends, newFriend]
                        setFriends(updatedFriends)
                        localStorage.setItem('kindworld_friends', JSON.stringify(updatedFriends))
                        setFriendSearchQuery('')
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {t('sendRequest')}
                  </button>
                </div>
              </div>

              {/* Friend Requests */}
              {friendRequests.length > 0 && (
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                    {t('friendRequests')}
                    <span style={{
                      marginLeft: '8px',
                      background: '#ef4444',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>{friendRequests.length}</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {friendRequests.map((request) => (
                      <div key={request.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '18px'
                          }}>
                            {request.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', color: '#1f2937' }}>{request.name}</p>
                            <p style={{ fontSize: '14px', color: '#6b7280' }}>{request.email}</p>
                            <p style={{ fontSize: '12px', color: '#9ca3af' }}>{request.hours} {t('hoursLabel')}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              const acceptedFriend = { ...request, status: 'accepted' as const }
                              const updatedFriends = [...friends, acceptedFriend]
                              setFriends(updatedFriends)
                              localStorage.setItem('kindworld_friends', JSON.stringify(updatedFriends))
                              setFriendRequests(friendRequests.filter(r => r.id !== request.id))
                            }}
                            style={{
                              padding: '8px 16px',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            {t('accept')}
                          </button>
                          <button
                            onClick={() => {
                              setFriendRequests(friendRequests.filter(r => r.id !== request.id))
                            }}
                            style={{
                              padding: '8px 16px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            {t('decline')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Friends List */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  {t('myFriends')}
                  <span style={{
                    marginLeft: '8px',
                    background: '#e5e7eb',
                    color: '#6b7280',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>{friends.filter(f => f.status === 'accepted').length}</span>
                </h3>
                {friends.filter(f => f.status === 'accepted').length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {friends.filter(f => f.status === 'accepted').map((friend) => (
                      <div key={friend.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: friend.avatar ? `url(${friend.avatar}) center/cover` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '18px'
                          }}>
                            {!friend.avatar && friend.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', color: '#1f2937' }}>{friend.name}</p>
                            <p style={{ fontSize: '14px', color: '#6b7280' }}>{friend.hours} {t('hoursLabel')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const updatedFriends = friends.filter(f => f.id !== friend.id)
                            setFriends(updatedFriends)
                            localStorage.setItem('kindworld_friends', JSON.stringify(updatedFriends))
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#fee2e2',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          {t('removeFriend')}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                    <p>{t('noFriendsYet')} {t('startConnecting')}</p>
                  </div>
                )}

                {/* Pending Requests Sent */}
                {friends.filter(f => f.status === 'pending').length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#6b7280' }}>
                      {t('pendingRequests')}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {friends.filter(f => f.status === 'pending').map((friend) => (
                        <div key={friend.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px',
                          background: '#fef3c7',
                          borderRadius: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '14px'
                            }}>
                              {friend.name.charAt(0)}
                            </div>
                            <div>
                              <p style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px' }}>{friend.name}</p>
                              <p style={{ fontSize: '12px', color: '#92400e' }}>
                                {t('requestSent')}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const updatedFriends = friends.filter(f => f.id !== friend.id)
                              setFriends(updatedFriends)
                              localStorage.setItem('kindworld_friends', JSON.stringify(updatedFriends))
                            }}
                            style={{
                              padding: '4px 10px',
                              background: 'transparent',
                              color: '#92400e',
                              border: '1px solid #92400e',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            {t('cancelRequest')}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile */}
          {currentPage === 'profile' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {/* Profile Header */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '24px',
                padding: '40px',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  transform: 'translate(50%, -50%)'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: user.avatar && user.avatar.startsWith('http')
                      ? `url(${user.avatar}) center/cover`
                      : 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                    border: '4px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {(!user.avatar || !user.avatar.startsWith('http')) && (user.name?.charAt(0) || '👤')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
                      {user.name}
                    </h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', margin: '0 0 12px 0' }}>
                      {user.email}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '6px 16px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        fontSize: '14px',
                        color: 'white',
                        fontWeight: '500'
                      }}>
                        🎯 {user.role === 'ngo' ? t('organizationLabel') :
                            user.role === 'admin' ? t('adminLabel') :
                            t('volunteerRole')}
                      </span>
                      <span style={{
                        padding: '6px 16px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        fontSize: '14px',
                        color: 'white',
                        fontWeight: '500'
                      }}>
                        📍 {profileForm.city || t('cityPlaceholder')}
                      </span>
                      <span style={{
                        padding: '6px 16px',
                        background: 'rgba(40, 167, 69, 0.3)',
                        borderRadius: '20px',
                        fontSize: '14px',
                        color: '#90EE90',
                        fontWeight: '600'
                      }}>
                        ✓ {t('verifiedLabel')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditingProfile(!isEditingProfile)
                      if (!isEditingProfile) {
                        setProfileForm({
                          name: user.name,
                          email: user.email,
                          phone: '',
                          city: ''
                        })
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      background: isEditingProfile ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255,255,255,0.2)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isEditingProfile ? t('cancelEditLabel') : t('editProfile')}
                  </button>
                </div>
              </div>

              {/* Stats Overview - Different stats based on user role */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {(() => {
                  // NGO-specific stats
                  if (user.role === 'ngo') {
                    const ngoMissions = missions.filter(m => m.organizerId === user.id)
                    return [
                      { icon: '👥', value: ngoMissions.reduce((sum, m) => sum + m.currentParticipants, 0), label: t('ngoActiveVolunteers'), color: '#4f46e5', bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' },
                      { icon: '📋', value: ngoMissions.length, label: t('ngoPublishedActivities'), color: '#059669', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' },
                      { icon: '🏆', value: Math.floor(ngoMissions.reduce((sum, m) => sum + m.currentParticipants, 0) * 0.7), label: t('ngoCertificatesIssued'), color: '#d97706', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
                      { icon: '⏱️', value: ngoMissions.reduce((sum, m) => sum + (m.hours * m.currentParticipants), 0), label: t('ngoTotalImpactHours'), color: '#7c3aed', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }
                    ]
                  }
                  // Admin-specific stats
                  if (user.role === 'admin') {
                    return [
                      { icon: '👥', value: allUsers.length, label: t('totalUsersLabel'), color: '#4f46e5', bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' },
                      { icon: '📋', value: missions.length, label: t('totalMissionsLabel'), color: '#059669', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' },
                      { icon: '🎯', value: allUsers.filter((u: any) => u.role === 'student').length, label: t('volunteersLabel2'), color: '#d97706', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
                      { icon: '🏢', value: allUsers.filter((u: any) => u.role === 'ngo').length, label: t('ngosLabel'), color: '#7c3aed', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }
                    ]
                  }
                  // Volunteer/Student stats (default)
                  return [
                    { icon: '⏱️', value: user.hours, label: t('totalHoursProfile'), color: '#4f46e5', bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' },
                    { icon: '🎯', value: user.completedMissions || 0, label: t('activitiesCompleted'), color: '#059669', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' },
                    { icon: '🏆', value: user.userBadges?.length || 0, label: t('badgesEarned'), color: '#d97706', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
                    { icon: '🏢', value: user.organizationsHelped || 0, label: t('organizationsHelpedProfile'), color: '#7c3aed', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }
                  ]
                })().map((stat, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: stat.bg,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '28px'
                    }}>
                      {stat.icon}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Personal Information */}
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>👤</span> {t('personalInformation')}
                  </h3>

                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                        {t('fullName')}
                      </label>
                      <input
                        type="text"
                        value={isEditingProfile ? profileForm.name : user.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        disabled={!isEditingProfile}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: isEditingProfile ? '2px solid #667eea' : '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '15px',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          background: isEditingProfile ? 'white' : '#f9fafb',
                          cursor: isEditingProfile ? 'text' : 'default',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                        {t('emailAddress')}
                      </label>
                      <input
                        type="email"
                        value={isEditingProfile ? profileForm.email : user.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        disabled={!isEditingProfile}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: isEditingProfile ? '2px solid #667eea' : '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '15px',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          background: isEditingProfile ? 'white' : '#f9fafb',
                          cursor: isEditingProfile ? 'text' : 'default',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                        {t('phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        disabled={!isEditingProfile}
                        placeholder="+62 812 3456 7890"
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: isEditingProfile ? '2px solid #667eea' : '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '15px',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          background: isEditingProfile ? 'white' : '#f9fafb',
                          cursor: isEditingProfile ? 'text' : 'default',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                        {t('cityResidency')}
                      </label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                        disabled={!isEditingProfile}
                        placeholder={t('cityPlaceholder')}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: isEditingProfile ? '2px solid #667eea' : '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '15px',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          background: isEditingProfile ? 'white' : '#f9fafb',
                          cursor: isEditingProfile ? 'text' : 'default',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Preferences & Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Language Preferences */}
                  <div style={{
                    background: 'white',
                    padding: '32px',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>🌐</span> {t('languageSettings')}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {Object.entries(languages).map(([code, lang]) => (
                        <button
                          key={code}
                          onClick={() => setLanguage(code)}
                          style={{
                            padding: '16px',
                            border: language === code ? '2px solid #667eea' : '2px solid #e5e7eb',
                            background: language === code ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)' : 'white',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{ fontSize: '24px' }}>{lang.flag}</span>
                          <span style={{ fontWeight: language === code ? '600' : '500', color: language === code ? '#4f46e5' : '#374151' }}>
                            {lang.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interests - Only show for volunteers/students */}
                  {user.role !== 'ngo' && user.role !== 'admin' && (
                    <div style={{
                      background: 'white',
                      padding: '32px',
                      borderRadius: '20px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                    }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>💝</span> {t('volunteerInterests')}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {[
                          t('interestEnvironment'),
                          t('interestEducation'),
                          t('interestHealthcare'),
                          t('interestCommunity'),
                          t('interestAnimals'),
                          t('interestElderlyCare'),
                          t('interestYouthPrograms'),
                          t('interestFoodSecurity')
                        ].map((interest, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '10px 18px',
                              background: index < 4 ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)' : '#f3f4f6',
                              color: index < 4 ? '#4f46e5' : '#6b7280',
                              borderRadius: '20px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              border: index < 4 ? '2px solid #667eea' : '2px solid transparent',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditingProfile && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setIsEditingProfile(false)
                      setProfileForm({ name: '', email: '', phone: '', city: '' })
                    }}
                    style={{
                      padding: '14px 32px',
                      background: 'white',
                      color: '#374151',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f9fafb'
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={() => {
                      // Update user data
                      if (profileForm.name) {
                        const updatedName = profileForm.name
                        const updatedEmail = profileForm.email || user?.email || ''
                        setUser(prev => prev ? {...prev, name: updatedName, email: updatedEmail} : prev)
                        // Sync to allUsers so admin dashboard reflects the change
                        setAllUsers((prev: any[]) => {
                          const updated = prev.map((u: any) =>
                            u.id === user?.id || u.email === user?.email
                              ? { ...u, name: updatedName, email: updatedEmail }
                              : u
                          )
                          localStorage.setItem('kindworld_allusers', JSON.stringify(updated))
                          return updated
                        })
                      }
                      setIsEditingProfile(false)
                      setNotifications(prev => [...prev, `✅ ${t('profileUpdatedSuccess')}`])
                    }}
                    style={{
                      padding: '14px 32px',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.5)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    {t('saveChanges')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Badge Management Page */}
          {currentPage === 'badgeManagement' && (
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '32px',
                color: 'white'
              }}>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  ← {t('backToDashboard')}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                      🏅 {t('badgeManagementCenter')}
                    </h1>
                    <p style={{ opacity: 0.9, fontSize: '16px', margin: 0 }}>
                      {t('badgeManagementDesc')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'center', padding: '12px 24px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '28px', fontWeight: '700' }}>12</div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>{t('badgesLabel')}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px 24px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '28px', fontWeight: '700' }}>{allUsers.filter((u: any) => u.role === 'student').length}</div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>{t('volunteersLabel2')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
                {/* Left: User List */}
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  height: 'fit-content',
                  position: 'sticky',
                  top: '24px'
                }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
                    👥 {t('selectUser')}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
                    {allUsers.filter((u: any) => u.role === 'student').map((userData: any) => (
                      <div
                        key={userData.id}
                        onClick={() => setBadgeManagementUser(userData)}
                        style={{
                          padding: '14px',
                          background: badgeManagementUser?.id === userData.id ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#f9fafb',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: badgeManagementUser?.id === userData.id ? '2px solid #f59e0b' : '2px solid transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}>
                            {userData.name.charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>{userData.name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{userData.hours}h • {userData.userBadges?.length || 0} badges</div>
                          </div>
                          {badgeManagementUser?.id === userData.id && (
                            <div style={{ color: '#f59e0b', fontSize: '18px' }}>✓</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Badge Grid */}
                <div>
                  {badgeManagementUser ? (
                    <>
                      {/* Selected User Header */}
                      <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        marginBottom: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                              width: '64px',
                              height: '64px',
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '24px'
                            }}>
                              {badgeManagementUser.name.charAt(0)}
                            </div>
                            <div>
                              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                                {badgeManagementUser.name}
                              </h3>
                              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                                {badgeManagementUser.email} • {badgeManagementUser.hours} {t('hoursUnit')}
                              </p>
                            </div>
                          </div>
                          <div style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                            borderRadius: '12px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#92400e' }}>
                              {badgeManagementUser.userBadges?.length || 0}
                            </div>
                            <div style={{ fontSize: '12px', color: '#b45309' }}>
                              {t('badgesLabel')}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Badge Grid */}
                      <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                      }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '20px' }}>
                          🎖️ {t('allBadgesTitle')}
                          <span style={{ fontSize: '14px', fontWeight: '400', color: '#6b7280', marginLeft: '12px' }}>
                            {t('clickToUnlockRemove')}
                          </span>
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                          {[
                            { id: 'b1', icon: '🏆', name: 'Community Champion', company: 'KindWorld', color: '#fbbf24' },
                            { id: 'b2', icon: '🌱', name: 'Environmental Hero', company: 'Green Earth', color: '#22c55e' },
                            { id: 'b3', icon: '📚', name: 'Education Supporter', company: 'UNICEF', color: '#3b82f6' },
                            { id: 'b4', icon: '❤️', name: 'Healthcare Helper', company: 'Red Cross', color: '#ef4444' },
                            { id: 'b5', icon: '🍲', name: 'Hunger Fighter', company: 'Food Bank', color: '#f97316' },
                            { id: 'b6', icon: '🏠', name: 'Shelter Builder', company: 'Habitat', color: '#8b5cf6' },
                            { id: 'b7', icon: '🐾', name: 'Animal Guardian', company: 'WWF', color: '#ec4899' },
                            { id: 'b8', icon: '👴', name: 'Elder Care Champion', company: 'Senior Care', color: '#14b8a6' },
                            { id: 'b9', icon: '🌟', name: 'Rising Star', company: 'KindWorld', color: '#6366f1' },
                            { id: 'b10', icon: '💯', name: 'Century Club', company: 'KindWorld', color: '#a855f7' },
                            { id: 'b11', icon: '🎓', name: 'Mentor', company: 'KindWorld', color: '#0ea5e9' },
                            { id: 'b12', icon: '🌍', name: 'Global Citizen', company: 'UN Volunteers', color: '#059669' }
                          ].map((badge) => {
                            const isUnlocked = badgeManagementUser.userBadges?.some((ub: any) => ub.id === badge.id)
                            return (
                              <div
                                key={badge.id}
                                onClick={() => {
                                  if (isUnlocked) {
                                    // Remove badge
                                    const updatedBadges = badgeManagementUser.userBadges.filter((ub: any) => ub.id !== badge.id)
                                    setBadgeManagementUser({...badgeManagementUser, userBadges: updatedBadges})
                                    setAllUsers((prev: any[]) => {
                                      const updated = prev.map((u: any) =>
                                        u.id === badgeManagementUser.id
                                          ? { ...u, userBadges: updatedBadges, badges: updatedBadges.length }
                                          : u
                                      )
                                      // Force save to localStorage immediately for cross-tab sync
                                      localStorage.setItem('kindworld_allusers', JSON.stringify(updated))
                                      return updated
                                    })
                                    // Also update current user if they are the one being modified
                                    if (user && (user.id === badgeManagementUser.id || user.email === badgeManagementUser.email)) {
                                      setUser(prev => prev ? { ...prev, userBadges: updatedBadges } : null)
                                      // Save to kindworld_user localStorage
                                      const savedUser = localStorage.getItem('kindworld_user')
                                      if (savedUser) {
                                        const parsedUser = JSON.parse(savedUser)
                                        parsedUser.userBadges = updatedBadges
                                        localStorage.setItem('kindworld_user', JSON.stringify(parsedUser))
                                      }
                                    }
                                    setNotifications(prev => [...prev, `🗑️ Removed "${badge.name}" from ${badgeManagementUser.name}`])
                                  } else {
                                    // Add badge
                                    const newBadge = {
                                      id: badge.id,
                                      name: badge.name,
                                      icon: badge.icon,
                                      earnedDate: new Date().toISOString().split('T')[0],
                                      company: badge.company
                                    }
                                    const updatedBadges = [...(badgeManagementUser.userBadges || []), newBadge]
                                    setBadgeManagementUser({...badgeManagementUser, userBadges: updatedBadges})
                                    setAllUsers((prev: any[]) => {
                                      const updated = prev.map((u: any) =>
                                        u.id === badgeManagementUser.id
                                          ? { ...u, userBadges: updatedBadges, badges: updatedBadges.length }
                                          : u
                                      )
                                      // Force save to localStorage immediately for cross-tab sync
                                      localStorage.setItem('kindworld_allusers', JSON.stringify(updated))
                                      return updated
                                    })
                                    // Also update current user if they are the one being modified
                                    if (user && (user.id === badgeManagementUser.id || user.email === badgeManagementUser.email)) {
                                      setUser(prev => prev ? { ...prev, userBadges: updatedBadges } : null)
                                      // Save to kindworld_user localStorage
                                      const savedUser = localStorage.getItem('kindworld_user')
                                      if (savedUser) {
                                        const parsedUser = JSON.parse(savedUser)
                                        parsedUser.userBadges = updatedBadges
                                        localStorage.setItem('kindworld_user', JSON.stringify(parsedUser))
                                      }
                                    }
                                    setNotifications(prev => [...prev, `🏅 "${badge.name}" unlocked for ${badgeManagementUser.name}!`])
                                  }
                                }}
                                style={{
                                  padding: '20px 16px',
                                  background: isUnlocked ? `linear-gradient(135deg, ${badge.color}20, ${badge.color}40)` : '#f9fafb',
                                  borderRadius: '16px',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  border: isUnlocked ? `3px solid ${badge.color}` : '3px solid transparent',
                                  position: 'relative'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-4px)'
                                  e.currentTarget.style.boxShadow = `0 8px 25px ${badge.color}40`
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)'
                                  e.currentTarget.style.boxShadow = 'none'
                                }}
                              >
                                {isUnlocked && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    width: '28px',
                                    height: '28px',
                                    background: '#22c55e',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    border: '3px solid white'
                                  }}>
                                    ✓
                                  </div>
                                )}
                                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{badge.icon}</div>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937', marginBottom: '4px', lineHeight: '1.3' }}>
                                  {badge.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>{badge.company}</div>
                                <div style={{
                                  marginTop: '12px',
                                  padding: '6px 12px',
                                  background: isUnlocked ? '#fee2e2' : `${badge.color}20`,
                                  color: isUnlocked ? '#dc2626' : badge.color,
                                  borderRadius: '8px',
                                  fontSize: '11px',
                                  fontWeight: '600'
                                }}>
                                  {isUnlocked ? t('clickToRemove') : t('clickToUnlock')}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* No user selected state */
                    <div style={{
                      background: 'white',
                      borderRadius: '20px',
                      padding: '80px 40px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '80px', marginBottom: '24px' }}>👈</div>
                      <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
                        {t('selectUserDesc')}
                      </h3>
                      <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>
                        {t('selectUserDescLong')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Global Edit User Modal */}
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
              zIndex: 2000,
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
                    ✏️ {t('editUserTitle')}: {editingUser.name}
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
                      {t('fullNameLabel')} *
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
                      {t('emailLabel')} *
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
                      {t('volunteerHoursLabel')} *
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
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                      {t('userRoleLabel')} *
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
                      <option value="student">🎓 {t('studentVolunteerRole')}</option>
                      <option value="ngo">🏢 {t('organizationLabel')}</option>
                      <option value="admin">👑 {t('platformAdmin')}</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button
                      onClick={() => {
                        setAllUsers((prev: any[]) => prev.map((u: any) =>
                          u.id === editingUser.id
                            ? { ...u, name: editUserData.name, email: editUserData.email, hours: editUserData.hours, role: editUserData.role }
                            : u
                        ))
                        setNotifications(prev => [...prev, `✅ ${t('userUpdatedSuccess')}!`])
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
                      💾 {t('saveLabel')}
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
                      {t('cancelLabel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global User Detail Modal */}
          {showUserDetailModal && selectedUserDetail && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              backdropFilter: 'blur(8px)',
              padding: '20px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
              }}>
                {/* Header */}
                <div style={{
                  padding: '28px 32px',
                  background: selectedUserDetail.role === 'student' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                             selectedUserDetail.role === 'ngo' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' :
                             'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                  color: 'white',
                  borderRadius: '24px 24px 0 0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}>
                        {selectedUserDetail.name.charAt(0)}
                      </div>
                      <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700' }}>
                          {selectedUserDetail.name}
                        </h2>
                        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                          {selectedUserDetail.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserDetailModal(false)
                        setSelectedUserDetail(null)
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        color: 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '28px 32px' }}>
                  {/* Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '28px' }}>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f46e5' }}>{selectedUserDetail.hours}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{t('totalHoursLabel')}</div>
                    </div>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#059669' }}>{selectedUserDetail.completedMissions}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{t('missionsCompletedLabel')}</div>
                    </div>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706' }}>{selectedUserDetail.userBadges?.length || 0}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{t('badgesLabel')}</div>
                    </div>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#7c3aed' }}>
                        {selectedUserDetail.role === 'student' ? '🎓' : selectedUserDetail.role === 'ngo' ? '🏢' : '👑'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                        {selectedUserDetail.role === 'student' ? t('volunteerRole') :
                         selectedUserDetail.role === 'ngo' ? t('organizationLabel') :
                         t('adminLabel')}
                      </div>
                    </div>
                  </div>

                  {/* User Badges */}
                  {selectedUserDetail.userBadges && selectedUserDetail.userBadges.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                        🏅 {t('earnedBadgesLabel')}
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedUserDetail.userBadges.map((badge: any, index: number) => (
                          <div key={index} style={{
                            padding: '8px 12px',
                            background: '#fef3c7',
                            borderRadius: '8px',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span>{badge.icon}</span>
                            <span style={{ fontWeight: '500', color: '#92400e' }}>{badge.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => {
                        setShowUserDetailModal(false)
                        setSelectedUserDetail(null)
                        setBadgeManagementUser(selectedUserDetail)
                        setCurrentPage('badgeManagement')
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 24px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      🏅 {t('manageBadgesBtn')}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDetailModal(false)
                        setSelectedUserDetail(null)
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 24px',
                        background: 'white',
                        color: '#374151',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {t('closeLabel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global Mission Detail Modal */}
          {showMissionDetail && selectedMissionDetail && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(8px)',
              padding: '20px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '640px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)'
              }}>
                {/* Header image */}
                <div style={{
                  height: '180px',
                  background: `linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9)), url(${selectedMissionDetail.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '24px 24px 0 0',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '24px 32px',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => {
                      setShowMissionDetail(false)
                      setSelectedMissionDetail(null)
                    }}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      borderRadius: '12px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white',
                      fontSize: '20px'
                    }}
                  >
                    ✕
                  </button>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white'
                      }}>
                        {selectedMissionDetail.category}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        background: selectedMissionDetail.difficulty === 'Easy' ? 'rgba(40, 167, 69, 0.3)' : selectedMissionDetail.difficulty === 'Medium' ? 'rgba(255, 193, 7, 0.3)' : 'rgba(220, 53, 69, 0.3)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white'
                      }}>
                        {selectedMissionDetail.difficulty === 'Easy' ? '🟢' : selectedMissionDetail.difficulty === 'Medium' ? '🟡' : '🔴'} {selectedMissionDetail.difficulty}
                      </span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'white' }}>
                      {selectedMissionDetail.title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '32px' }}>
                  {/* Description */}
                  <div style={{ marginBottom: '28px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                      {t('descriptionLabel')}
                    </h4>
                    <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                      {selectedMissionDetail.description}
                    </p>
                  </div>

                  {/* Info grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                    <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '14px' }}>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>📍 {t('locationLabel')}</div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>{selectedMissionDetail.location}</div>
                    </div>
                    <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '14px' }}>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>📅 {t('dateLabel')}</div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>{selectedMissionDetail.date}</div>
                    </div>
                    <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '14px' }}>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>⏱️ {t('durationHours')}</div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>{selectedMissionDetail.hours} {t('hoursLabel')}</div>
                    </div>
                    <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '14px' }}>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>👥 {t('participantsLabel')}</div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>{selectedMissionDetail.currentParticipants} / {selectedMissionDetail.maxParticipants}</div>
                    </div>
                  </div>

                  {/* Additional details */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
                    <div style={{
                      padding: '8px 16px',
                      background: 'rgba(99, 102, 241, 0.08)',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#4f46e5'
                    }}>
                      🏢 {t('organizer')}: {selectedMissionDetail.organizer}
                    </div>
                    {selectedMissionDetail.region && (
                      <div style={{
                        padding: '8px 16px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#059669'
                      }}>
                        🌍 {regions.find(r => r.code === selectedMissionDetail.region)?.name || selectedMissionDetail.region}
                      </div>
                    )}
                    {selectedMissionDetail.country && (
                      <div style={{
                        padding: '8px 16px',
                        background: 'rgba(245, 158, 11, 0.08)',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#d97706'
                      }}>
                        🏳️ {selectedMissionDetail.country}
                      </div>
                    )}
                    <div style={{
                      padding: '8px 16px',
                      background: new Date(selectedMissionDetail.date) > new Date() ? 'rgba(40, 167, 69, 0.08)' : 'rgba(107, 114, 128, 0.08)',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: new Date(selectedMissionDetail.date) > new Date() ? '#28a745' : '#6b7280'
                    }}>
                      {new Date(selectedMissionDetail.date) > new Date() ? '🟢 ' + t('upcomingStatus') : '✅ ' + t('completedStatus')}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => {
                        setShowMissionDetail(false)
                        setSelectedMissionDetail(null)
                        setSelectedMissionParticipants(selectedMissionDetail)
                        setShowParticipantList(true)
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 24px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      👥 {t('participantsLabel2')} ({selectedMissionDetail.currentParticipants})
                    </button>
                    <button
                      onClick={() => {
                        setShowMissionDetail(false)
                        setSelectedMissionDetail(null)
                      }}
                      style={{
                        padding: '14px 24px',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {t('closeLabel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global Create Activity Modal */}
          {showCreateActivity && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
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
                    ➕ {t('createNewVolunteerActivity')}
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
                      {t('activityTitle')} *
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
                      {t('descriptionLabel')} *
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
                        {t('locationLabel')} *
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
                        {t('dateLabel')} *
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
                        {t('durationHours')} *
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
                        {t('maxParticipantsLabel')} *
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
                        {t('categoryLabel')} *
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
                        <option value="Environment">🌱 {t('categoryEnvironment')}</option>
                        <option value="Community">🤝 {t('categoryCommunity')}</option>
                        <option value="Healthcare">🏥 {t('categoryHealthcare')}</option>
                        <option value="Education">📚 {t('categoryEducation')}</option>
                        <option value="Animals">🐾 {t('categoryAnimals')}</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                        {t('difficultyLabel')} *
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
                        <option value="Easy">🟢 {t('difficultyEasy')}</option>
                        <option value="Medium">🟡 {t('difficultyMedium')}</option>
                        <option value="Hard">🔴 {t('difficultyHard')}</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                        🌏 {t('selectRegion')} *
                      </label>
                      <select
                        value={newActivity.region}
                        onChange={(e) => setNewActivity({...newActivity, region: e.target.value, country: ''})}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
                          background: 'white',
                          maxHeight: '200px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      >
                        {regions.map(region => (
                          <option key={region.code} value={region.code}>{region.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Country Selection */}
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                      🏳️ {t('yourCountry')} *
                    </label>
                    <select
                      value={newActivity.country}
                      onChange={(e) => setNewActivity({...newActivity, country: e.target.value})}
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
                      <option value="">{t('selectCountry')}</option>
                      {regions.find(r => r.code === newActivity.region)?.countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button
                      onClick={() => {
                        if (newActivity.title && newActivity.description && newActivity.location && newActivity.date && newActivity.hours > 0 && newActivity.maxParticipants > 0) {
                          const maxId = missions.reduce((max, m) => Math.max(max, m.id), 0)
                          const newMission: Mission = {
                            id: maxId + 1,
                            title: newActivity.title,
                            description: newActivity.description,
                            location: newActivity.location,
                            date: newActivity.date,
                            hours: newActivity.hours,
                            participants: `0/${newActivity.maxParticipants}`,
                            maxParticipants: newActivity.maxParticipants,
                            currentParticipants: 0,
                            category: newActivity.category,
                            difficulty: newActivity.difficulty as 'Easy' | 'Medium' | 'Hard',
                            organizer: user?.name || 'NGO',
                            organizerId: user?.id,
                            image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop',
                            joined: false,
                            region: newActivity.region,
                            country: newActivity.country
                          }
                          console.log('Creating new mission:', newMission)
                          setMissions(prev => {
                            const updated = [...prev, newMission]
                            console.log('Updated missions array:', updated.length, 'missions')
                            localStorage.setItem('kindworld_missions', JSON.stringify(updated))
                            console.log('Saved to localStorage immediately')
                            return updated
                          })
                          setNotifications(prev => [...prev, `✅ Activity "${newActivity.title}" created successfully!`])
                          setNewActivity({
                            title: '',
                            description: '',
                            location: '',
                            date: '',
                            hours: 0,
                            maxParticipants: 0,
                            category: 'Community',
                            difficulty: 'Easy',
                            region: 'SEA',
                            country: ''
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
                      🚀 {t('publishActivityBtn')}
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
                      {t('cancelLabel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global Participant List Modal */}
          {showParticipantList && selectedMissionParticipants && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              backdropFilter: 'blur(8px)',
              padding: '20px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{
                  padding: '28px 32px',
                  borderBottom: '1px solid #e5e7eb',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '700', color: '#166534' }}>
                        👥 {t('registeredParticipants')}
                      </h2>
                      <p style={{ margin: 0, color: '#16a34a', fontSize: '14px' }}>
                        {selectedMissionParticipants.title}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowParticipantList(false)
                        setSelectedMissionParticipants(null)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#6b7280'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div style={{ padding: '24px 32px' }}>
                  {(() => {
                    const participants = missionRegistrations.filter(r => r.missionId === selectedMissionParticipants.id)
                    if (participants.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                          <p style={{ margin: 0 }}>
                            {t('noParticipantsYet')}
                          </p>
                        </div>
                      )
                    }
                    return (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {participants.map((p, index) => (
                          <div key={index} style={{
                            padding: '16px',
                            background: '#f9fafb',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '14px'
                                }}>
                                  {p.volunteer.name.charAt(0)}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>
                                    {p.volunteer.name}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {p.volunteer.email}
                                  </div>
                                </div>
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                📞 {p.registrationData?.phoneNumber || 'N/A'}
                              </div>
                            </div>
                            {p.registrationData?.emergencyContact && (
                              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>
                                <strong>{t('emergencyContact')}: </strong>
                                {p.registrationData.emergencyContact} ({p.registrationData.emergencyPhone})
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>

                <div style={{ padding: '16px 32px 24px', borderTop: '1px solid #e5e7eb' }}>
                  <button
                    onClick={() => {
                      setShowParticipantList(false)
                      setSelectedMissionParticipants(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {t('closeLabel')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}