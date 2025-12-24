import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, LogOut } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { setLanguage } from '../store/slices/languageSlice'
import { logout } from '../store/slices/authSlice'
import { useTranslation } from '../hooks/useTranslation'
import NotificationBadge from './NotificationBadge'
import NotificationDropdown from './NotificationDropdown'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { currentLanguage } = useAppSelector((state) => state.language)
  const { t } = useTranslation()
  
  const languageDropdownRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const notificationDropdownRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/missions', label: t('nav.missions') },
    { path: '/badges', label: t('nav.badges') },
    { path: '/leaderboard', label: t('nav.leaderboard') },
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'zh-cn', name: '简体中文', flag: '🇨🇳' },
    { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
  ]

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  const isActive = (path: string) => location.pathname === path

  const handleLanguageChange = (langCode: string) => {
    dispatch(setLanguage(langCode))
    setLanguageDropdownOpen(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    setProfileDropdownOpen(false)
  }

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'ngo':
        return 'NGO'
      case 'admin':
        return 'Admin'
      default:
        return 'Student/User'
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-semibold text-black">
            KindWorld
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-black'
                    : 'text-gray-600 hover:text-accent'
                }`}

              >
                {link.label}
              </Link>
            ))}
            
            {/* Notifications */}
            {user && (
              <div className="relative" ref={notificationDropdownRef}>
                <NotificationBadge 
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                />
                <NotificationDropdown
                  isOpen={notificationDropdownOpen}
                  onClose={() => setNotificationDropdownOpen(false)}
                />
              </div>
            )}

            {/* Language Selector */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLanguageDropdownOpen(!languageDropdownOpen)
                }}
                className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-accent transition-colors"
              >
                <span>{currentLang.flag}</span>
                <span className="font-medium">{currentLang.code.toUpperCase()}</span>
                <ChevronDown size={16} />
              </button>
              
              {languageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg min-w-[200px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLanguageChange(lang.code)
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <span className="mr-3">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setProfileDropdownOpen(!profileDropdownOpen)
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow"
              >
                {user?.displayName?.charAt(0) || 'U'}
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg min-w-[200px] z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="font-semibold">{user?.displayName}</div>
                    <div className="text-sm text-gray-600">{user?.email}</div>
                    <div className="text-xs text-accent font-medium mt-1">{getRoleLabel()}</div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLogout()
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-red-600 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
