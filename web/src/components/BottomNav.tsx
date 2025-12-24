import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Award, User } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

export default function BottomNav() {
  const location = useLocation()
  const { t } = useTranslation()

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/missions', icon: Search, label: t('nav.missions') },
    { path: '/badges', icon: Award, label: t('nav.badges') },
    { path: '/profile', icon: User, label: t('nav.profile') },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center h-16 safe-area-inset-bottom">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors hover:bg-gray-50 active:bg-gray-100 ${
              isActive(path) ? 'text-black' : 'text-gray-400'
            }`}
            aria-label={`Navigate to ${label}`}
            aria-current={isActive(path) ? 'page' : undefined}
          >
            <Icon size={24} className="flex-shrink-0" />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
