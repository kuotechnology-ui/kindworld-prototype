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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">K</span>
            </div>
            <span className="text-2xl font-light tracking-wide text-gray-800">KindWorld</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/signin" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Sign In
            </Link>
            <Link
              to="/signin"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm font-medium"
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
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.15)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
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
                  <h1 className="text-6xl md:text-7xl font-light text-white mb-6 leading-tight">
                    {image.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-8 font-light leading-relaxed">
                    {image.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/signin"
                      className="px-10 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-300 text-center font-medium shadow-xl hover:shadow-2xl hover:scale-105 transform"
                    >
                      Start Your Journey
                    </Link>
                    <Link
                      to={image.learnMoreLink}
                      className="px-10 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium text-center"
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
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-12 bg-white' : 'w-8 bg-white/50'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-24 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-light bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              A seamless platform designed to amplify your impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Join Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4">
              Who Can Join
            </h2>
            <p className="text-xl text-blue-100 font-light max-w-2xl mx-auto">
              KindWorld welcomes everyone committed to making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-2xl font-medium mb-3">Volunteers</h3>
              <p className="text-blue-100 leading-relaxed mb-4">
                Find meaningful missions, track your hours, earn badges, and connect with like-minded changemakers
              </p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Discover local causes
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Track impact metrics
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Redeem rewards
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-medium mb-3">NGOs & Organizations</h3>
              <p className="text-blue-100 leading-relaxed mb-4">
                Post missions, manage volunteers, and amplify your social impact with data-driven insights
              </p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Create missions
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Manage volunteers
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Track outcomes
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-2xl font-medium mb-3">Administrators</h3>
              <p className="text-blue-100 leading-relaxed mb-4">
                Oversee platform operations, moderate content, and ensure quality across all missions
              </p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Platform oversight
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Content moderation
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Analytics dashboard
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-gray-600 mb-10 font-light leading-relaxed">
            Join thousands of volunteers and organizations creating positive change in communities worldwide
          </p>
          <Link
            to="/signin"
            className="inline-block px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-medium"
          >
            Join KindWorld Now
          </Link>
          <p className="mt-6 text-gray-500">
            Already have an account? <Link to="/signin" className="text-blue-600 hover:text-indigo-600 font-medium">Sign in here</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="text-xl font-light text-white">KindWorld</span>
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
