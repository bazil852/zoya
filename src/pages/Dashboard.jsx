import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, TrendingUp, Star, Package, Smartphone, Gamepad2, 
  Car, Home, Wrench, Dumbbell, Camera, Music, ChevronRight,
  Filter, MapPin, Clock, User
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

const categories = [
  { id: 'electronics', name: 'Electronics', icon: Smartphone, color: 'bg-black', count: 1250 },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-gray-800', count: 850 },
  { id: 'automotive', name: 'Automotive', icon: Car, color: 'bg-gray-700', count: 650 },
  { id: 'home', name: 'Home & Garden', icon: Home, color: 'bg-gray-600', count: 920 },
  { id: 'tools', name: 'Tools', icon: Wrench, color: 'bg-gray-700', count: 750 },
  { id: 'sports', name: 'Sports', icon: Dumbbell, color: 'bg-gray-800', count: 680 },
  { id: 'photography', name: 'Photography', icon: Camera, color: 'bg-black', count: 450 },
  { id: 'music', name: 'Music', icon: Music, color: 'bg-gray-600', count: 320 },
]

export default function Dashboard() {
  const { userProfile } = useAuth()
  const [featuredListings, setFeaturedListings] = useState([])
  const [popularListings, setPopularListings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch featured listings
      const { data: featured } = await supabase
        .from('listings')
        .select(`
          *,
          owner:users(name, rating, profile_pic)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)

      // Fetch popular listings (simulate by price for now)
      const { data: popular } = await supabase
        .from('listings')
        .select(`
          *,
          owner:users(name, rating, profile_pic)
        `)
        .eq('is_active', true)
        .order('price', { ascending: false })
        .limit(4)

      setFeaturedListings(featured || [])
      setPopularListings(popular || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to listings with search query
      window.location.href = `/listings?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-black">
                Rentique
              </h1>
              <span className="text-sm text-gray-500 font-medium">PREMIUM</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center text-sm text-gray-600">
                Welcome back, <span className="font-medium ml-1">{userProfile?.name}</span>
              </div>
              <Link
                to="/profile"
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-medium"
              >
                {userProfile?.name?.charAt(0) || 'U'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            {/* Hero Vector Illustration */}
            <div className="mb-8 flex justify-center">
              <svg width="300" height="120" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
                {/* Minimalist Circles */}
                <circle cx="60" cy="60" r="35" stroke="#ffffff" strokeWidth="0.5" opacity="0.3"/>
                <circle cx="150" cy="60" r="35" stroke="#ffffff" strokeWidth="0.5" opacity="0.3"/>
                <circle cx="240" cy="60" r="35" stroke="#ffffff" strokeWidth="0.5" opacity="0.3"/>

                {/* Camera Icon - Minimal */}
                <rect x="48" y="54" width="24" height="16" rx="2" stroke="#ffffff" strokeWidth="0.8" fill="none"/>
                <circle cx="60" cy="62" r="4" stroke="#ffffff" strokeWidth="0.8" fill="none"/>

                {/* Car Icon - Minimal */}
                <path d="M138 65 L142 58 L158 58 L162 65" stroke="#ffffff" strokeWidth="0.8" fill="none"/>
                <rect x="135" y="65" width="30" height="8" rx="1" stroke="#ffffff" strokeWidth="0.8" fill="none"/>
                <circle cx="142" cy="73" r="2.5" stroke="#ffffff" strokeWidth="0.8" fill="none"/>
                <circle cx="158" cy="73" r="2.5" stroke="#ffffff" strokeWidth="0.8" fill="none"/>

                {/* Tool Icon - Minimal */}
                <line x1="230" y1="54" x2="238" y2="62" stroke="#ffffff" strokeWidth="0.8"/>
                <circle cx="242" cy="66" r="4" stroke="#ffffff" strokeWidth="0.8" fill="none"/>
                <line x1="246" y1="58" x2="246" y2="70" stroke="#ffffff" strokeWidth="0.8"/>

                {/* Connection Lines */}
                <line x1="95" y1="60" x2="115" y2="60" stroke="#ffffff" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.2"/>
                <line x1="185" y1="60" x2="205" y2="60" stroke="#ffffff" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.2"/>
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover, Rent, Enjoy
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Access premium items from verified owners in your area
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for cameras, cars, tools, electronics..."
                  className="w-full pl-12 pr-4 py-4 text-gray-900 focus:outline-none text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-black px-8 py-4 text-white font-medium hover:bg-gray-800 transition-all duration-300"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Browse Categories</h3>
            <Link
              to="/categories"
              className="text-black hover:text-gray-700 font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.id}
                  to={`/listings?category=${category.id}`}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-black hover:-translate-y-1 min-h-[180px] flex flex-col items-center justify-center text-center"
                >
                  <Icon className="w-8 h-8 text-black mb-4 group-hover:scale-110 transition-transform duration-300 stroke-[1.5]" strokeWidth={1.5} />
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">{category.name}</h4>
                  <p className="text-sm text-gray-500 font-medium">{category.count.toLocaleString()} items</p>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs text-black font-medium">Browse →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Popular This Week */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-black" />
              <h3 className="text-2xl font-bold text-gray-900">Popular This Week</h3>
            </div>
            <Link
              to="/listings?sort=popular"
              className="text-black hover:text-gray-700 font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularListings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listing/${listing.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                  <img
                    src={listing.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={listing.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">{listing.title}</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-black">
                      PKR {listing.price.toLocaleString()}<span className="text-sm text-gray-500">/{listing.price_unit || 'day'}</span>
                    </span>
                    {listing.owner?.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{listing.owner.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{listing.location || 'Location not specified'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Listings */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Featured Listings</h3>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <Link
                to="/listings"
                className="text-black hover:text-gray-700 font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                    <img
                      src={listing.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={listing.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {listing.category}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>2 days ago</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{listing.title}</h4>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-black">
                        PKR {listing.price.toLocaleString()}<span className="text-sm text-gray-500">/{listing.price_unit || 'day'}</span>
                      </span>
                      {listing.owner?.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{listing.owner.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{listing.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{listing.owner?.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <div className="mt-12 bg-gray-100 rounded-2xl p-8 text-center border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Earning?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            List your unused items and start earning money today. From electronics to tools, everything has rental value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-listing"
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300"
            >
              List Your Item
            </Link>
            <Link
              to="/how-it-works"
              className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}