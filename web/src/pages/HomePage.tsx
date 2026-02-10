import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=90&auto=format&fit=crop',
      title: 'Empower Communities',
      subtitle: 'Transform lives through compassionate action',
      learnMoreLink: '/empower-communities'
    },
    {
      url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=90&auto=format&fit=crop',
      title: 'Make a Difference',
      subtitle: 'Every hour of kindness creates lasting impact',
      learnMoreLink: '/make-difference'
    },
    {
      url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=90&auto=format&fit=crop',
      title: 'Join the Movement',
      subtitle: 'Be part of a global network of changemakers',
      learnMoreLink: '/join-movement'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: '🎯',
      title: 'Discover Missions',
      description: 'Connect with meaningful causes aligned with your values and passions'
    },
    {
      icon: '⏱️',
      title: 'Track Impact',
      description: 'Log volunteer hours and visualize your contribution to the community'
    },
    {
      icon: '🏆',
      title: 'Earn Recognition',
      description: 'Celebrate achievements with badges, ranks, and exclusive rewards'
    },
    {
      icon: '🤝',
      title: 'Build Community',
      description: 'Join a network of volunteers, NGOs, and organizations making change'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Active Volunteers' },
    { value: '250+', label: 'Partner NGOs' },
    { value: '100K+', label: 'Hours Logged' },
    { value: '50+', label: 'Cities Worldwide' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">K</span>
            </div>
            <span className="text-2xl font-semibold tracking-tight text-gray-900">KindWorld</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/signin" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Sign In
            </Link>
            <Link
              to="/signin"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300 text-sm font-medium"
            >
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
              index === currentSlide
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out"
              style={{
                backgroundImage: `url(${image.url})`,
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)',
              }}
            />
          </div>
        ))}

        <div className="relative h-full flex items-center z-20">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl relative">
              {heroImages.map((image, index) => (
                <div
                  key={index}
                  className={`transition-all duration-1000 ease-out ${
                    index === currentSlide
                      ? 'opacity-100 translate-x-0 scale-100 relative'
                      : 'opacity-0 absolute inset-0 pointer-events-none scale-95'
                  } ${
                    index < currentSlide ? '-translate-x-12' : 'translate-x-12'
                  }`}
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-tight drop-shadow-lg">
                    {image.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/95 mb-8 font-light leading-relaxed drop-shadow-md">
                    {image.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/signin"
                      className="px-10 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-50 transition-all duration-300 text-center font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transform"
                    >
                      Start Your Journey
                    </Link>
                    <Link
                      to={image.learnMoreLink}
                      className="px-10 py-4 border-2 border-white/80 text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium text-center backdrop-blur-sm"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-10 bg-white' : 'w-4 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A seamless platform designed to amplify your impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Join Section - Using image background instead of solid color */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&q=80&auto=format&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-gray-900/85" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Who Can Join
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              KindWorld welcomes everyone committed to making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Volunteers</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Find meaningful missions, track your hours, earn badges, and connect with like-minded changemakers
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 text-emerald-400 text-xs">✓</span>
                  Discover local causes
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 text-emerald-400 text-xs">✓</span>
                  Track impact metrics
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 text-emerald-400 text-xs">✓</span>
                  Redeem rewards
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">NGOs & Organizations</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Post missions, manage volunteers, and amplify your social impact with data-driven insights
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 text-emerald-400 text-xs">✓</span>
                  Create missions
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 text-emerald-400 text-xs">✓</span>
                  Manage volunteers
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 text-emerald-400 text-xs">✓</span>
                  Track outcomes
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Administrators</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Oversee platform operations, moderate content, and ensure quality across all missions
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 text-emerald-400 text-xs">✓</span>
                  Platform oversight
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 text-emerald-400 text-xs">✓</span>
                  Content moderation
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 text-emerald-400 text-xs">✓</span>
                  Analytics dashboard
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Join thousands of volunteers and organizations creating positive change in communities worldwide
          </p>
          <Link
            to="/signin"
            className="inline-block px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300 text-lg font-semibold"
          >
            Join KindWorld Now
          </Link>
          <p className="mt-6 text-gray-500 text-sm">
            Already have an account? <Link to="/signin" className="text-emerald-600 hover:text-teal-600 font-medium">Sign in here</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="text-xl font-semibold text-white">KindWorld</span>
          </div>
          <p className="text-sm mb-6">
            Empowering communities through compassionate action
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs mt-8">
            © 2026 KindWorld. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
