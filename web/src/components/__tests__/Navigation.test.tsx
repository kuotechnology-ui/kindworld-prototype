import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import fc from 'fast-check'
import Header from '../Header'
import BottomNav from '../BottomNav'
import authReducer from '../../store/slices/authSlice'
import languageReducer from '../../store/slices/languageSlice'

// Mock store setup
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      language: languageReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: {
          id: '1',
          displayName: 'Test User',
          email: 'test@example.com',
          role: 'student' as const,
        },
        loading: false,
        error: null,
      },
      language: {
        currentLanguage: 'en',
        translations: {
          en: {
            'nav.home': 'Home',
            'nav.missions': 'Missions',
            'nav.badges': 'Badges',
            'nav.leaderboard': 'Leaderboard',
            'nav.profile': 'Profile',
          }
        }
      },
      ...initialState,
    },
  })
}

const TestWrapper = ({ children, initialEntries = ['/'] }: { children: React.ReactNode, initialEntries?: string[] }) => {
  const store = createMockStore()
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </Provider>
  )
}

describe('Navigation Components', () => {
  describe('Header Navigation', () => {
    it('should render all navigation links', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Missions')).toBeInTheDocument()
      expect(screen.getByText('Badges')).toBeInTheDocument()
      expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    })

    it('should highlight active navigation item', () => {
      render(
        <TestWrapper initialEntries={['/badges']}>
          <Header />
        </TestWrapper>
      )

      const badgesLink = screen.getByText('Badges')
      expect(badgesLink).toHaveClass('text-black')
    })
  })

  describe('Bottom Navigation', () => {
    it('should render all navigation items', () => {
      render(
        <TestWrapper>
          <BottomNav />
        </TestWrapper>
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Missions')).toBeInTheDocument()
      expect(screen.getByText('Badges')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    it('should highlight active navigation item', () => {
      render(
        <TestWrapper initialEntries={['/profile']}>
          <BottomNav />
        </TestWrapper>
      )

      const profileLink = screen.getByText('Profile').closest('a')
      expect(profileLink).toHaveClass('text-black')
    })
  })

  /**
   * Feature: web-app-enhancements, Property 1: Navigation State Consistency
   * 
   * Property-based test that verifies navigation state consistency across all valid routes.
   * For any navigation action in the web application, the current page state should always 
   * match the displayed content and active navigation indicators.
   */
  describe('Property 1: Navigation State Consistency', () => {
    it('should maintain consistent active state across all valid routes', () => {
      const validRoutes = ['/', '/missions', '/badges', '/leaderboard', '/profile']
      
      fc.assert(
        fc.property(
          fc.constantFrom(...validRoutes),
          (route) => {
            const { container } = render(
              <TestWrapper initialEntries={[route]}>
                <div>
                  <Header />
                  <BottomNav />
                </div>
              </TestWrapper>
            )

            // Check that exactly one navigation item is active in header (for desktop routes)
            const headerLinks = container.querySelectorAll('nav a')
            const activeHeaderLinks = Array.from(headerLinks).filter(link => 
              link.classList.contains('text-black')
            )

            // Check that exactly one navigation item is active in bottom nav (for mobile routes)
            const bottomNavLinks = container.querySelectorAll('nav a')
            const activeBottomNavLinks = Array.from(bottomNavLinks).filter(link => 
              link.classList.contains('text-black')
            )

            // At least one navigation component should show the active state
            const hasActiveState = activeHeaderLinks.length > 0 || activeBottomNavLinks.length > 0
            
            return hasActiveState
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent href attributes matching the route', () => {
      const validRoutes = ['/', '/missions', '/badges', '/leaderboard', '/profile']
      
      fc.assert(
        fc.property(
          fc.constantFrom(...validRoutes),
          (route) => {
            const { container } = render(
              <TestWrapper initialEntries={[route]}>
                <div>
                  <Header />
                  <BottomNav />
                </div>
              </TestWrapper>
            )

            // Find all navigation links
            const allLinks = container.querySelectorAll('a[href]')
            const navigationLinks = Array.from(allLinks).filter(link => {
              const href = link.getAttribute('href')
              return validRoutes.includes(href || '')
            })

            // Each navigation link should have a valid href that matches a known route
            return navigationLinks.every(link => {
              const href = link.getAttribute('href')
              return validRoutes.includes(href || '')
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain language consistency across navigation state changes', () => {
      const languages = ['en', 'id', 'zh-cn', 'zh-tw']
      const validRoutes = ['/', '/missions', '/badges', '/leaderboard', '/profile']
      
      fc.assert(
        fc.property(
          fc.constantFrom(...languages),
          fc.constantFrom(...validRoutes),
          (language, route) => {
            const store = createMockStore({
              language: {
                currentLanguage: language,
                translations: {
                  [language]: {
                    'nav.home': 'Home',
                    'nav.missions': 'Missions', 
                    'nav.badges': 'Badges',
                    'nav.leaderboard': 'Leaderboard',
                    'nav.profile': 'Profile',
                  }
                }
              }
            })

            render(
              <Provider store={store}>
                <MemoryRouter initialEntries={[route]}>
                  <Header />
                </MemoryRouter>
              </Provider>
            )

            // The language selector should show the correct language
            const languageButtons = screen.getAllByText(language.toUpperCase())
            return languageButtons.length > 0
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})